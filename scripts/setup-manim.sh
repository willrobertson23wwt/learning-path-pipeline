#!/usr/bin/env bash
# Install the Manim toolchain into this project, with no Homebrew or sudo:
#
#   scripts/setup-manim.sh
#
# 1. pixi (a single binary, into .pixi/bin/), checksum-verified.
# 2. The pixi environment from pixi.toml / pixi.lock: Python 3.12 and Manim
#    Community 0.20 from conda-forge (into .pixi/envs/, with its download
#    cache in .pixi/cache/).
# 3. TinyTeX (portable TeX Live, into .tinytex/), checksum-verified, plus the
#    LaTeX packages Manim's Tex/MathTex need, including dvisvgm.
#
# Takes about 2 GB of disk in all (pixi about 65 MB; the environment about
# 1.7 GB with its download cache; TinyTeX about 330 MB). Claude must ask
# the user before running this. Each step is skipped when it's already done,
# so a rerun is cheap. Pinned to the versions the li-v6-ch1 pilot proved
# (pixi 0.81.0, TinyTeX v2026.09); conda-forge's texlive-core is a dead end
# (no LaTeX formats, no working tlmgr). macOS on Apple silicon only, like
# pixi.toml's platforms.
set -euo pipefail
cd "$(dirname "$0")/.."

PIXI_VERSION=v0.81.0
TINYTEX_VERSION=v2026.09
TINYTEX_SHA256=974bb21f394def11780788eaacf77ae8fc1974a60bc9e75a9a2f9d735db479fe
TEX_PACKAGES="standalone preview dvisvgm babel-english amsmath amsfonts cm-super xcolor"

[[ "$(uname -s)-$(uname -m)" == "Darwin-arm64" ]] || {
  echo "setup-manim.sh supports macOS on Apple silicon only (pixi.toml platforms)" >&2; exit 1; }

# 1. pixi
if [[ ! -x .pixi/bin/pixi ]]; then
  mkdir -p .pixi/bin
  url=https://github.com/prefix-dev/pixi/releases/download/$PIXI_VERSION/pixi-aarch64-apple-darwin.tar.gz
  curl -fsSL -o .pixi/bin/pixi.tar.gz "$url"
  expected=$(curl -fsSL "$url.sha256" | awk '{print $1}')
  actual=$(shasum -a 256 .pixi/bin/pixi.tar.gz | awk '{print $1}')
  [[ -n "$expected" && "$expected" == "$actual" ]] || {
    echo "pixi checksum mismatch ($actual, expected $expected)" >&2; rm -f .pixi/bin/pixi.tar.gz; exit 1; }
  tar -xzf .pixi/bin/pixi.tar.gz -C .pixi/bin && rm .pixi/bin/pixi.tar.gz
fi
.pixi/bin/pixi --version

# 2. Python + Manim
export PIXI_CACHE_DIR="$PWD/.pixi/cache"
.pixi/bin/pixi install
.pixi/bin/pixi run manim --version

# 3. TinyTeX + packages
tex=.tinytex/TinyTeX/bin/universal-darwin
if [[ ! -x $tex/latex ]]; then
  mkdir -p .tinytex
  curl -fsSL -o .tinytex/tinytex.tar.xz \
    "https://github.com/rstudio/tinytex-releases/releases/download/$TINYTEX_VERSION/TinyTeX-1-darwin-$TINYTEX_VERSION.tar.xz"
  actual=$(shasum -a 256 .tinytex/tinytex.tar.xz | awk '{print $1}')
  [[ "$actual" == "$TINYTEX_SHA256" ]] || {
    echo "TinyTeX checksum mismatch ($actual)" >&2; rm -f .tinytex/tinytex.tar.xz; exit 1; }
  tar -xJf .tinytex/tinytex.tar.xz -C .tinytex && rm .tinytex/tinytex.tar.xz
fi
# shellcheck disable=SC2086
$tex/tlmgr install $TEX_PACKAGES >/dev/null
$tex/kpsewhich standalone.cls preview.sty amsmath.sty amssymb.sty >/dev/null
$tex/dvisvgm --version

echo "Manim toolchain ready. Next: .pixi/envs/default/bin/python scripts/course-backgrounds.py"
