<template>
  <img
    :class="`${$style.avatar} ${$style[`avatar-${size}`]}`"
    :src="src"
    :alt="alt"
  />
</template>

<script>
import includes from 'lodash/includes'

export default {
  name: 'sc-avatar',
  props: {
    alt: {
      type: String,
      required: true,
    },
    src: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: 'm',
      validator: value => includes(['s', 'm', 'l', 'xl'], value),
    },
  },
}
</script>

<style module>
.avatar {
  display: block;
  border-radius: 50%;
  pointer-events: none;
  user-select: none;
}

.avatar-s {
  width: 16px;
  height: 16px;
}

.avatar-m {
  width: 32px;
  height: 32px;
}

.avatar-l {
  width: 64px;
  height: 64px;
}

.avatar-xl {
  width: 96px;
  height: 96px;
}
</style>
