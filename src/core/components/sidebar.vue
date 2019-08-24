<template>
  <aside :class="$style.aside" v-expand="menuExpanded">
    <vue-custom-scrollbar
      :class="`${$style['scroll-area']} ${$style['scroll-menu']}`"
      :settings="scrollbarSettings"
      :aria-expanded="false"
    >
      <header :class="$style.header">
        <button :class="$style['menu-toggle']" @click="toggleMenu">
          <simple-svg :class="$style['menu-toggle-icon']" :filepath="menuSvg" />
        </button>
        <h1 :class="$style.title">
          StackCraft
        </h1>
      </header>
      <ul :class="$style['menu']">
        <li
          :class="$style['menu-item']"
          v-for="({ name, link, icon }, i) in menu"
          :key="`menu-${i}`"
        >
          <router-link
            :class="$style['menu-link']"
            :exact-active-class="$style['menu-link-active']"
            :to="link"
          >
            <simple-svg :class="$style['menu-icon']" :filepath="icon" />
            <span v-t="name" />
          </router-link>
        </li>
      </ul>
    </vue-custom-scrollbar>
  </aside>
</template>

<script>
import vueCustomScrollbar from 'vue-custom-scrollbar'

import menuSvg from '@/core/assets/menu.svg'

export default {
  name: 'sidebar',
  components: {
    vueCustomScrollbar,
  },
  directives: {
    expand: {
      inserted(el, binding, { context }) {
        const calcWidth = () => {
          const currentState = el.getAttribute('aria-expanded')
          el.removeAttribute('aria-expanded')
          el.style.width = null
          el.style.width = `${el.clientWidth}px`
          el.setAttribute('aria-expanded', currentState)
        }
        el.classList.add(context.$style.expand)
        el.setAttribute('aria-expanded', binding.value ? 'true' : 'false')
        calcWidth()
      },
      update(el, binding) {
        if (el.style.width && binding.value !== null) {
          el.setAttribute('aria-expanded', binding.value ? 'true' : 'false')
        }
      },
    },
  },
  props: {
    menu: {
      type: Array,
      required: true,
    },
  },
  data() {
    const fullScreenView = 620
    return {
      menuSvg,
      menuExpanded: window.innerWidth >= fullScreenView,
      scrollbarSettings: {
        minScrollbarLength: 50,
        maxScrollbarLength: 250,
        suppressScrollX: true,
      },
    }
  },
  methods: {
    toggleMenu() {
      this.menuExpanded = !this.menuExpanded
    },
  },
}
</script>

<style module>
.header {
  display: flex;
  align-items: center;
  background: #212121;
  color: var(--primary);
  width: 100%;
  height: 42px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  @media (width < 620px) {
    position: fixed;
    z-index: 1;
    width: 100%;
  }
}

.title {
  user-select: none;
  font-size: 19px;
  margin: 0;
}

.aside {
  height: 100vh;
  background: #212121;

  @media (width < 620px) {
    position: absolute;
    z-index: 1;
  }
}

.menu {
  display: block;
  position: relative;
  margin: 0;
  padding: 4px 16px;
  background: #212121;
  color: #fff;
  flex-shrink: 0;
  list-style-type: none;
  width: 260px;
  border-right: 1px solid rgba(0, 0, 0, 0.1);

  @media (width < 620px) {
    margin-top: 42px;
  }
}

.menu-item {
  position: relative;
  margin: 16px 0;
  user-select: none;
}

.menu-link {
  color: inherit;
  text-decoration: none;
  transition: color 0.3s;
  outline: 0;

  &:hover,
  &:focus {
    color: var(--primary);
  }
}

.menu-link-active {
  color: var(--primary);

  @media (width >= 620px) {
    &::before {
      border-top: 14px solid transparent;
      border-bottom: 14px solid transparent;
      content: '';
      display: inline-block;
      position: absolute;
      opacity: 1;
      top: -4px;
      transition: opacity 0.15s ease-in;
      border-right: 14px solid #fff;
      right: -17px;
    }
  }
}

.menu-toggle {
  background: transparent;
  height: 42px;
  padding: 0 16px;
  outline: 0;
  border: 0;
  color: inherit;
  cursor: pointer;
}

.menu-toggle-icon {
  width: 15px;
  height: 15px;
  fill: currentColor;
}

.menu-icon {
  display: inline-block;
  flex-shrink: 0;
  fill: currentColor;
  width: 15px;
  height: 15px;
  margin-right: 16px;
  cursor: pointer;
}

.scroll-area {
  position: relative;
  width: 100%;
  height: 100vh;

  @media (width < 620px) {
    max-height: calc(100vh - 42px);
  }
}

.scroll-menu {
  background: #212121;
}

.expand {
  flex-shrink: 0;
  overflow: hidden;
  transition-property: width;
  transition-duration: 0.4s;

  &[aria-expanded='false'] {
    width: 46px !important;

    @media (width < 620px) {
      width: 0 !important;
    }
  }
}
</style>
