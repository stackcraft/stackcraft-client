<template>
  <form :class="$style.form" @submit.prevent="logIn">
    <div :class="$style['form-group']">
      <sc-label>Email</sc-label>
      <sc-input v-model="loginFormData.email" type="text" />
    </div>
    <div :class="$style['form-group']">
      <sc-label>Password</sc-label>
      <sc-input v-model="loginFormData.password" type="password" />
    </div>
    <div :class="`${$style['form-group']} ${$style['form-group-button']}`">
      <sc-button>Submit</sc-button>
    </div>
  </form>
</template>

<script>
import { scButton, scInput, scLabel } from '@/base'

import LOG_IN from '@/core/graphql/log-in.gql'

import { setToken } from '@/core/utils/token-helpers'

export default {
  name: 'log-in',
  components: {
    scButton,
    scInput,
    scLabel,
  },
  data() {
    return {
      loginFormData: {
        email: 'phoebe.buffay@gmail.com',
        password: 'UGrcLVmq',
      },
    }
  },
  methods: {
    async logIn() {
      try {
        await this.$apollo.mutate({
          mutation: LOG_IN,
          variables: {
            email: this.loginFormData.email,
            password: this.loginFormData.password,
          },
          update: (store, { data: { logIn: tokenPair } }) => {
            /*
             * The client saves the tokens and lifetime of the access token and
             * use the access token for subsequent authorization of requests
             */
            setToken(tokenPair)
            this.$router.go()
          },
        })
      } catch (error) {
        console.log('error', error)
      }
    },
  },
}
</script>

<style module>
.form {
  display: block;
  position: absolute;
  top: calc(50% - 48px);
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  margin-right: -50%;
  padding: 18px;
}

.form-group {
  width: 100%;
  margin-bottom: 10px;
}

.form-group-button {
  text-align: right;
}
</style>
