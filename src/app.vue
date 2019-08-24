<template>
  <div :class="$style.app">
    <log-in v-if="authorized === false" />
    <main v-if="authorized === true" :class="$style.main">
      <sidebar :menu="menu" />
      <div :class="$style.content">
        <vue-custom-scrollbar
          :class="`${$style['scroll-area']} ${$style['scroll-content']}`"
          :settings="scrollbarSettings"
        >
          <transition
            :enter-class="$style['fade-enter']"
            :enter-active-class="$style['fade-enter-active']"
            :leave-active-class="$style['fade-leave-active']"
          >
            <router-view />
          </transition>
        </vue-custom-scrollbar>
      </div>
    </main>
  </div>
</template>

<script>
import vueCustomScrollbar from 'vue-custom-scrollbar'

import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import isUndefined from 'lodash/isUndefined'

import logIn from '@/core/components/log-in.vue'
import sidebar from '@/core/components/sidebar.vue'

import CURRENT_USER from '@/core/graphql/current-user.gql'

export default {
  name: 'app',
  components: {
    sidebar,
    logIn,
    vueCustomScrollbar,
  },
  props: {
    menu: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      scrollbarSettings: {
        minScrollbarLength: 50,
        maxScrollbarLength: 250,
        suppressScrollX: true,
      },
    }
  },
  apollo: {
    currentUser: {
      query: CURRENT_USER,
      result({ currentUser }) {
        const language = get(currentUser, 'settings.language')
        if (language) {
          this.$i18n.locale = language
        }
      },
    },
  },
  computed: {
    authorized() {
      const hasCurrentUser = isUndefined(this.currentUser)
        ? null
        : !isEmpty(this.currentUser)

      return hasCurrentUser
    },
  },
}
</script>

<style module>
:root {
  --primary: #6bd098;
}

@import-normalize;

* {
  box-sizing: border-box;
}

::selection {
  background: rgba(107, 208, 152, 0.99);
  color: #212121;
}

html {
  line-height: 1.15;
}

body {
  margin: 0;
}

button,
input,
select,
textarea {
  font-family: inherit;
  font-size: 100%;
  line-height: 1.15;
  margin: 0;
}

.app {
  font-family: 'Helvetica Neue', 'Segoe UI', Helvetica, Arial, sans-serif;
  font-size: responsive 15px 17px;
  font-range: 420px 1280px; /* stylelint-disable property-no-unknown */
  min-width: 300px;
  width: 100%;
  height: 100%;
  color: rgba(0, 0, 0, 0.75);
}

.main {
  display: flex;
}

.content {
  width: 100%;

  @media (width < 620px) {
    padding-top: 42px;
  }
}

.scroll-area {
  position: relative;
  width: 100%;
  height: 100vh;

  @media (width < 620px) {
    max-height: calc(100vh - 42px);
  }
}

.scroll-content {
  padding: 16px;
}

.fade-enter-active,
.fade-leave-active {
  transition-property: opacity;
  transition-duration: 0.1s;
}

.fade-enter-active {
  transition-delay: 0.15s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
