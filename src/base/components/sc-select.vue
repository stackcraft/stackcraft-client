<template>
  <div :class="$style.select">
    <input ref="input" v-show="false" :value="value" @input="updateValue()" />
    <div
      ref="input"
      :class="$style.input"
      @click="toggleOptions"
      v-html="displayedValue"
      :tabindex="0"
    />
    <div :class="$style.options" v-if="expanded" v-on-clickaway="toggleOptions">
      <vue-custom-scrollbar :class="$style['scroll-area']">
        <div
          :class="$style.option"
          v-for="({ name, value: optionValue }, index) in options"
          :key="`option-${index}`"
          :value="optionValue"
          :tabindex="index"
          @click="updateValue(optionValue)"
          v-html="name"
        />
      </vue-custom-scrollbar>
    </div>
  </div>
</template>

<script>
import vueCustomScrollbar from 'vue-custom-scrollbar'
import { directive as onClickaway } from 'vue-clickaway'

import find from 'lodash/find'
import get from 'lodash/get'

export default {
  name: 'sc-select',
  components: {
    vueCustomScrollbar,
  },
  directives: {
    onClickaway,
  },
  props: {
    options: {
      type: Array,
      required: true,
    },
    value: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      expanded: false,
    }
  },
  computed: {
    displayedValue() {
      const { value } = this
      return get(find(this.options, { value }), 'name')
    },
  },
  methods: {
    toggleOptions() {
      this.expanded = !this.expanded
    },
    updateValue(value) {
      this.$emit('input', value)
      this.toggleOptions()
    },
  },
}
</script>

<style module>
.select {
  position: relative;
}

.input {
  display: block;
  color: #66615b;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
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

.options {
  background: #fff;
  position: absolute;
  margin-top: 2px;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
  z-index: 1;
}

.option {
  width: 100%;
  color: #66615b;
  font-size: 14px;
  padding: 10px;
  transition: all 0.3s;
  user-select: none;
  cursor: pointer;

  &focus,
  &:hover,
  &:active {
    background: #fbfbfb;
    background: red;
  }
}

.scroll-area {
  position: relative;
  margin: auto;
  width: 100%;
  max-height: 300px;
}
</style>
