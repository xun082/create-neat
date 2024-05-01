#! /bin/bash

NAME=$1

FILE_PATH=$(cd "$(dirname "${BASH_SOURCE[0]}")/../packages" && pwd)

re="[[:space:]]+"

if [ "$#" -ne 1 ] || [[ $NAME =~ $re ]] || [ "$NAME" == "" ]; then
  echo "Usage: pnpm gc \${name} with no space"
  exit 1
fi

DIRNAME="$FILE_PATH/components/$NAME"
INPUT_NAME=$NAME

if [ -d "$DIRNAME" ]; then
  echo "$NAME component already exists, please change it"
  exit 1
fi

NORMALIZED_NAME=""
for i in $(echo $NAME | sed 's/[_|-]\([a-z]\)/\ \1/;s/^\([a-z]\)/\ \1/'); do
  C=$(echo "${i:0:1}" | tr "[:lower:]" "[:upper:]")
  NORMALIZED_NAME="$NORMALIZED_NAME${C}${i:1}"
done
NAME=$NORMALIZED_NAME

mkdir -p "$DIRNAME"
mkdir -p "$DIRNAME/src"

cat > $DIRNAME/src/index.vue <<EOF
<template>
  <div>
  this is $NAME
    <slot />
  </div>
</template>

<script lang="ts" setup>
// init here
</script>
EOF

cat <<EOF >"$DIRNAME/index.ts"
import { App, Plugin } from 'vue'
import $NAME from './src/index.vue'

const ${NAME}Install: Plugin = {
  install(app: App) {
    app.component('$NAME', $NAME)
  }
}

export default ${NAME}Install

export {$NAME}
EOF

