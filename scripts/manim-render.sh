#!/usr/bin/env bash
# Render one Manim scene to the transparent WebM a Remotion ManimLayer plays.
#
#   scripts/manim-render.sh manim/<id>/scene.py <SceneClass> public/manim/<id>/<name>.webm [--preview] [--frames]
#
# --frames skips the VP9 encode and copies the PNG frames to
# public/manim/<id>/<name>/0000.png... instead: point ManimLayer's src at that
# folder for frame-exact scrubbing in Studio while iterating. Encode the .webm
# for the final.
# Manim writes a transparent PNG sequence (the lossless master: frame count =
# file count), then Remotion's bundled ffmpeg encodes VP9 with alpha, the
# format Studio's Chrome preview can play. Manim is the pixi env in .pixi/
# (conda-forge; no Homebrew or sudo needed). --preview renders 960x540, still
# at 30 fps so frame counts stay exact (never use -ql: it drops to 15 fps).
set -euo pipefail
cd "$(dirname "$0")/.."

scene_file=$1; scene_class=$2; out=$3; res=1920,1080; frames_only=0
for arg in "${@:4}"; do
  case $arg in
    --preview) res=960,540 ;;
    --frames) frames_only=1 ;;
  esac
done
# Node for Remotion's ffmpeg; TinyTeX (portable TeX Live in .tinytex/, no sudo)
# for Tex/MathTex, which needs latex and dvisvgm on PATH.
export PATH="$PWD/.tinytex/TinyTeX/bin/universal-darwin:$HOME/.nvm/versions/node/$(ls "$HOME/.nvm/versions/node" | tail -1)/bin:$PATH"

media=manim/media
frames=$media/images/$(basename "$scene_file" .py)
rm -rf "$frames"
.pixi/bin/pixi run manim render "$scene_file" "$scene_class" \
  --transparent --format=png --fps 30 -r "$res" --media_dir "$media" \
  --disable_caching -v WARNING 2>&1 | grep -vE 'SyntaxWarning|re\.match|m2 = |elif re\.|upgrading via|version v0' || true

count=$(ls "$frames"/"$scene_class"*.png 2>/dev/null | wc -l | tr -d ' ')
[[ $count -gt 0 ]] || { echo "no frames rendered in $frames" >&2; exit 1; }

mkdir -p "$(dirname "$out")"
if [[ $frames_only == 1 ]]; then
  dir=${out%.webm}
  rm -rf "$dir" && mkdir -p "$dir"
  i=0
  for f in "$frames"/"$scene_class"*.png; do
    cp "$f" "$dir/$(printf %04d $i).png"; i=$((i + 1))
  done
  echo "$dir/: $i PNG frames (point ManimLayer src at ${dir#public/})"
  exit 0
fi
# Convert and tag as BT.709: untagged, ffmpeg converts with BT.601 while the
# browser decodes HD as BT.709, which dulls theme colors (ACCENT green channel
# 194 -> 180, SUCCESS red 61 -> 39 in the pilot).
npx remotion ffmpeg -y -v error -framerate 30 -i "$frames/${scene_class}%04d.png" \
  -vf "scale=out_color_matrix=bt709:out_range=tv" \
  -c:v libvpx-vp9 -pix_fmt yuva420p -colorspace bt709 -color_primaries bt709 \
  -color_trc bt709 -color_range tv -crf 18 -b:v 0 -auto-alt-ref 0 -row-mt 1 "$out"

probe=$(npx remotion ffprobe -v error -count_frames \
  -show_entries stream=nb_read_frames:stream_tags=alpha_mode -of default=nw=1 "$out")
read_frames=$(sed -n 's/^nb_read_frames=//p' <<<"$probe")
alpha=$(sed -n 's/^TAG:alpha_mode=//p' <<<"$probe")
echo "$out: $count PNG frames, $read_frames WebM frames, alpha_mode=${alpha:-missing}"
[[ $read_frames == "$count" && $alpha == 1 ]] || { echo "frame count or alpha check FAILED" >&2; exit 1; }
