<template>
  <form
    :class="$style.form"
    @submit.prevent="updateSettings"
    v-if="!$apolloData.loading"
  >
    <div :class="$style['form-group']">
      <sc-label v-t="'security.email'" />
      <sc-input v-model="formData.email" type="text" />
    </div>
    <div :class="$style['form-group']">
      <sc-label v-t="'security.firstName'" />
      <sc-input v-model="formData.firstName" type="text" />
    </div>
    <div :class="$style['form-group']">
      <sc-label v-t="'security.lastName'" />
      <sc-input v-model="formData.lastName" type="text" />
    </div>
    <div :class="$style['form-group']">
      <sc-label v-t="'security.language'" />
      <sc-select :options="languageOptions" v-model="formData.language" />
    </div>
    <div :class="`${$style['form-group']} ${$style['form-group-button']}`">
      <sc-button v-t="'security.update'" />
    </div>
  </form>
</template>

<script>
import pick from 'lodash/pick'

import { scButton, scInput, scLabel, scSelect } from '@/base'

import CURRENT_USER from '@/security/graphql/current-user.gql'

export default {
  name: 'settings',
  apollo: {
    currentUser: CURRENT_USER,
  },
  components: {
    scButton,
    scInput,
    scLabel,
    scSelect,
  },
  data() {
    return {
      languageOptions: [
        {
          name: 'English',
          value: 'en',
        },
        {
          name: 'Русский',
          value: 'ru',
        },
      ],
    }
  },
  computed: {
    formData() {
      const data = this.$apolloData.data.currentUser
      return {
        ...pick(data, ['email', 'firstName', 'lastName']),
        language: data.settings.language || this.$i18n.locale,
      }
    },
  },
  methods: {
    updateSettings() {
      if (this.$i18n.locale !== this.formData.language) {
        this.$i18n.locale = this.formData.language
      }
    },
  },
}
</script>

<style module>
.form {
  width: 400px;

  @media (width < 620px) {
    width: 100%;
  }
}

.form-group {
  width: 100%;
  margin-bottom: 10px;
}

.form-group-button {
  text-align: right;
}
</style>
