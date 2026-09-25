#!/usr/bin/env bash
# Re-render a Manim scene's frames whenever its source, layout.json, the
# shared kit, or its beats.json changes, so an edit shows up in Remotion
# Studio (ManimLayer pointed at the frames folder) about a minute later.
#
#   scripts/manim-watch.sh manim/<id>/scene.py <SceneClass> public/manim/<id>/<name>.webm
#
# Ctrl-C to stop. Renders with --frames (no VP9 encode); run
# scripts/manim-render.sh without --frames for the final .webm.
set -uo pipefail
cd "$(dirname "$0")/.."

scene_file=$1; scene_class=$2; out=$3
scene_dir=$(dirname "$scene_file")
media_id=$(basename "$scene_dir")

stamp() {
  find "$scene_dir" manim/_kit "public/chapters/$media_id/beats.json" \
    -type f \( -name '*.py' -o -name '*.json' \) -not -path '*/__pycache__/*' \
    -exec stat -f '%m %N' {} + 2>/dev/null | sort | shasum | cut -c1-12
}

last=""
echo "watching $scene_dir, manim/_kit, public/chapters/$media_id/beats.json"
while true; do
  now=$(stamp)
  if [[ $now != "$last" ]]; then
    [[ -n $last ]] && echo "change detected, re-rendering $scene_class..."
    start=$(date +%s)
    if scripts/manim-render.sh "$scene_file" "$scene_class" "$out" --frames 2>&1 | grep -E 'PNG frames|Error|error|past beat|no time left|frames, window'; then :; fi
    echo "done in $(( $(date +%s) - start )) s; refresh Studio (or scrub) to see it"
    last=$(stamp)
  fi
  sleep 2
done
