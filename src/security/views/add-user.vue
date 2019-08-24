<template>
  <form :class="$style.form" @submit.prevent="addUser">
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
    <div :class="`${$style['form-group']} ${$style['form-group-button']}`">
      <sc-button v-t="'security.add-user'" />
    </div>
  </form>
</template>

<script>
import { scButton, scInput, scLabel } from '@/base'

import ADD_USER from '@/security/graphql/add-user.gql'

export default {
  name: 'add-user',
  components: {
    scButton,
    scInput,
    scLabel,
  },
  data() {
    return {
      formData: {
        email: '',
        firstName: '',
        lastName: '',
      },
    }
  },
  methods: {
    async addUser() {
      try {
        await this.$apollo.mutate({
          mutation: ADD_USER,
          variables: this.formData,
        })
        // eslint-disable-next-line fp/no-mutating-methods
        this.$router.push('/users')
      } catch (error) {
        console.log('error', error)
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
