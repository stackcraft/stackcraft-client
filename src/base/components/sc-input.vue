<template>
  <div>
    <input
      ref="input"
      :class="$style.input"
      :value="value"
      :type="type"
      @input="updateValue()"
      spellcheck="false"
    />
    <p :class="$style.error" v-if="error" v-html="error.message" />
  </div>
</template>

<script>
export default {
  name: 'sc-input',
  props: {
    value: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      default: 'text',
    },
  },
  data() {
    return {
      error: null,
    }
  },
  methods: {
    updateValue() {
      this.$emit('input', this.$refs.input.value)
    },
  },
}
</script>

<style module>
.input {
  display: block;
  color: #66615b;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: responsive 13px 15px;
  font-range: 420px 1280px; /* stylelint-disable property-no-unknown */
  line-height: normal;
  width: 100%;
  height: calc(2.25rem + 2px);
  padding: 10px;
  transition: all 0.3s;
  outline: 0;

  &:hover,
  &:focus {
    border: 1px solid #9a9a9a;
  }
}
</style>
