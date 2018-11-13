<template>
  <div class="login-container">
    <div class="background" v-if="!mobileFlag">
      <img src="https://source.unsplash.com/random/1080x720" alt="">
    </div>
    <div class="login-wrapper">
      <h1>情义明</h1>
      <div class="form-wrapper">
        <el-form ref="loginForm" :rules="rules" :model="form">
          <el-form-item prop="account">
            <el-input class="form-input" clearable maxlength="20" placeholder="用户" v-model="form.account" @blur="blurAccount">
              <template slot="prepend">
                <icon-font icon="icon-yonghu"></icon-font>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input class="form-input" type="password" maxlength="20" clearable placeholder="密码" v-model="form.password" @keyup.enter.native="login">
              <template slot="prepend">
                <icon-font icon="icon-mima"></icon-font>
              </template>
            </el-input>
          </el-form-item>
          <div class="remember-wrapper" v-show="!registerFlag">
            <el-checkbox v-model="remember">记住账号和密码</el-checkbox>            
          </div>
          <div v-show="registerFlag">
            <el-form-item prop="password">
              <el-input class="form-input" type="password" maxlength="20" clearable placeholder="确认密码" v-model="form.rePassword">
                <template slot="prepend">
                  <icon-font icon="icon-mima"></icon-font>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="name">
              <el-input class="form-input" maxlength="20" clearable placeholder="昵称" v-model="form.name">
                <template slot="prepend">
                  昵称
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="root">
              <el-input class="form-input" maxlength="20" clearable placeholder="注册码" v-model="form.root">
                <template slot="prepend">
                  注册码
                </template>
              </el-input>
            </el-form-item>
          </div>
        </el-form>
        <div class="login-button" v-show="!registerFlag">
          <el-button 
            type="primary" 
            :loading="subWait" 
            :class="subWait ? 'subWait' : ''" 
            @click="login">登陆</el-button>
        </div>
        <div class="register-button">
          <el-button 
            type="success" 
            :loading="subWait && registerFlag" 
            :class="subWait && registerFlag ? 'subWait' : ''" 
            @click="register">注册</el-button>
        </div>
        <div class="back-button" v-show="registerFlag">
          <el-button type="primary" @click="back">返回</el-button>
        </div>
        <div class="login-footer">

        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import IconFont from 'components/common/Iconfont'
  import apiUrl from '@/serviceAPI.config.js'
  import { getCookie, setCookie, delCookie, judgeMobile } from 'common/js/tool'
  const crypto = require('crypto')
  export default {
    data() {
      return {
        form: {
          account: '',
          password: '',
          rePassword: '',
          name: '',
          root: ''
        },
        rules: {
          account: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ],
          rePassword: [
            {required: true, message: '两次输入密码不同', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '请输入昵称', trigger: 'blur'}
          ],
          root: [
            {required: true, message: '请输入注册码', trigger: 'blur'}
          ]
        },
        registerFlag: false,
        subWait: false,
        checked: false,
        remember: false,
        cookiePassword: '88888888',
        password: '',
        cookieInfo: {},
        mobileFlag: false
      }
    },
    created() {
      const account = getCookie('account')
      const password = getCookie('password')
      if (account && password) {
        this.remember = true
        this.form.account = account
        this.form.password = this.cookiePassword
        this.cookieInfo = {account, password}
      }
      this.mobileFlag = judgeMobile()
    },
    methods: {
      register() {
        if (!this.registerFlag) {
          this.registerFlag = true
          this.clear()
          return
        }
        if (this.subWait) {
          return
        }
        if (this.form.account === '' || this.form.password === '' || this.form.rePassword === '' || this.form.name === '' || this.form.root === '') {
          this.$message.error('请补充完整数据')
          return
        }
        if (this.form.password !== this.form.rePassword) {
          this.$message.error('两次输入密码不同')
          return
        }
        this.subWait = true
        this.$http.post(apiUrl.register, {
          data: {
            account: this.form.account,
            password: crypto.createHash('sha1').update(this.form.password.trim()).digest('hex'),
            name: this.form.name,
            root: this.form.root
          }
        }).then(res => {
          this.subWait = false
          if (res.data.code === 200) {
            this.$message.success(res.data.message)
            this.registerFlag = false
            this.form.password = ''
            this.form.rePassword = ''
            this.form.name = ''
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(err => {
          this.subWait = false
          this.$message.error('服务器君傲娇啦😭')
        })
      },
      login() {
        if (this.subWait) {
          return
        }
        if (this.form.account === '' || this.form.password === '') {
          this.$message({type: 'error', message: '请输入用户和密码'})
          return
        }
        this.subWait = true
        if (this.form.account !== this.cookieInfo.account || this.form.password != this.cookiePassword) {
          this.password = crypto.createHash('sha1').update(this.form.password.trim()).digest('hex')
        } else {
          this.password = this.cookieInfo.password.trim()
        }
        this.$http.post(apiUrl.login, {
          data: {
            account: this.form.account,
            password: this.password
          }
        }).then(res => {
          this.subWait = false
          if (res.data.code === 200) {
            this.setCookie()
            this.$message.success(res.data.message)
            this.$router.push({path: '/'})
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(err => {
          this.subWait = false
          this.$message.error('服务器君傲娇啦😭')
        })
      },
      back() {
        if (this.subWait) {
          return
        }
        this.registerFlag = false
        this.clear()
      },
      clear() {
        this.$refs.loginForm.resetFields()
        this.form.account = ''
        this.form.password = ''
        this.remember = false
      },
      blurAccount() {
        if (this.cookieInfo.account !== this.form.account) {
          this.remember = false
        } else {
          this.remember = true
        }
      },
      setCookie() {
        if (this.cookieInfo.account === this.form.account && !this.remember) {
          delCookie('account')
          delCookie('password')
        } else if (this.cookieInfo.account !== this.form.account && this.remember) {
          setCookie('account', this.form.account, 7)
          setCookie('password', crypto.createHash('sha1').update(this.form.password.trim()).digest('hex'), 7)
        }
      }
    },
    components: {
      IconFont
    }
  }
</script>

<style lang="scss" scoped>
  @import 'common/css/variable.scss';

  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    .background {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: -1;
      img {
        width: 100%;
      }
    }
    .login-wrapper {
      width: 350px;
      padding: 10px;
      border: 1px solid $color-gray;
      box-shadow: 0 0 1px $color-gray;
      background-color: $color-white;
      h1 {
        font-weight: bold;
        padding: 10px 0;
      }
      .form-wrapper {
        .login-button, .register-button, .back-button {
          display: flex;
          flex-flow: column;
          padding: 10px 0;
        }
        .remember-wrapper {
          text-align: left;
        }
      }
    }
  }
</style>
