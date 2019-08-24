<template>
  <button :class="$style.button">
    <slot />
  </button>
</template>

<script>
export default {
  name: 'sc-button',
}
</script>

<style module>
.button {
  background: var(--primary);
  color: #fff;
  border: 1px solid #28a745;
  border-radius: 3px;
  font-weight: 600;
  font-size: 0.75em;
  line-height: 1.35em;
  text-transform: uppercase;
  padding: 10px 20px;
  transition: all 0.3s;
  cursor: pointer;
  outline: 0;

  &:hover,
  &:focus {
    background: #28a745;
  }
}
</style>
