<template>
  <label :class="$style.label">
    <slot />
  </label>
</template>

<script>
export default {
  name: 'sc-label',
}
</script>

<style module>
.label {
  display: block;
  font-size: 0.8em;
  margin-bottom: 5px;
  color: #9a9a9a;
}
</style>
