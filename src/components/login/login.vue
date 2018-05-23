<template>
  <div class="login">
    <v-container fluid>
      <v-layout row wrap justify-center>
        <v-flex xs12 sm4>
          <v-card>
            <v-toolbar color="green">
              <v-btn icon @click="back">
                <v-icon color="white">arrow_back</v-icon>
              </v-btn>
              <v-flex xs12>
                <v-layout row justify-center>
                  <v-toolbar-title justify-center style="margin-left:-40px">登录</v-toolbar-title>
                </v-layout>
              </v-flex>
            </v-toolbar>
            <v-container fluid>
              <v-layout row wrap>
                
                <v-flex xs12>
                  <v-form ref="form" v-model="valid" lazy-validation class="xs12">
                    <v-flex xs12>
                      <v-text-field
                        v-model="email"
                        :rules="[rulesEmail.required, rulesEmail.email]"
                        label="邮箱地址"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-text-field
                        :append-icon="passwordInVisible ? 'visibility' : 'visibility_off'"
                        :append-icon-cb="() => (passwordInVisible = !passwordInVisible)"
                        :type="passwordInVisible ? 'password' : 'text'"
                        label="密码"
                        hint="至少6位数密码."
                        v-model="password"
                        :rules="[rulesPass.required, rulesPass.password]"
                        class="input-group"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-btn
                        :disabled="!valid"
                        @click="submit"
                      >
                        登录
                      </v-btn>
                      <v-btn @click="clear">清空</v-btn>
                    </v-flex>
                  </v-form>
                </v-flex>
                
              </v-layout>
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        valid: true,
        title: '邮箱',
        email: '',
        rulesEmail: {
          required: (value) => !!value || '必须填的呀.',
          email: (value) => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || '邮箱地址无效.'
          }
        },
        password: '',
        passwordInVisible: true,
        rulesPass: {
          required: (value) => !!value || '必须填的呀.',
          password: (value) => {
            const pattern = /.{6,12}/
            return pattern.test(value) || '密码无效.'
          }
        },
      }
    },
    created() {
    },
    beforeRouteEnter(to, from, next) {
      // session会话存在
      let cookies = {}
      document.cookie.split(';').map((item) => {
        if (!item) return
        cookies[[item.split('=')[0].trim()]] = item.split('=')[1].trim()
      })
      if (cookies['koa:sess'] && cookies['koa:sess.sig']) {
        next(vm => {
          vm.$router.replace('/management')
        })
        return
      }
      next()
    },
    methods: {
      submit () {
        if (this.$refs.form.validate()) {
          this.$http.post('/admin/login', {
            email: this.email,
            password: this.password
          }).then(res => {
            if (res.data.success) {
              this.$router.replace('/management')
            }
          })
        }
      },
      clear () {
        this.$refs.form.reset()
      },
      back() {
        this.$router.back()
      }
    }
  }
</script>

<style media="screen">
.login{
  display: flex;
  width: 100%;
  height: 100%;
  align-content: center;
  justify-content: center;
}
</style>