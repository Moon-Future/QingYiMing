<template>
  <div class="login-container">
    <div class="background">
      <img src="https://api.dujin.org/bing/1366.php" alt="">
    </div>
    <div class="login-wrapper">
      <h1>情义明</h1>
      <div class="form-wrapper">
        <el-form :rules="rules" :model="form">
          <el-form-item prop="user">
            <el-input class="form-input" placeholder="用户" v-model="form.user">
              <template slot="prepend">
                <svg class="iconfont" aria-hidden="true">
                  <use xlink:href="#icon-yonghu"></use>
                </svg>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input class="form-input" type="password" placeholder="密码" v-model="form.password">
              <template slot="prepend">
                <svg class="iconfont" aria-hidden="true">
                  <use xlink:href="#icon-mima"></use>
                </svg>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
        <div class="login-button">
          <el-button type="primary">登陆</el-button>
        </div>
        <div class="login-footer">

        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        form: {
          user: '',
          password: ''
        },
        rules: {
          user: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ]
        }
      }
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
        height: 100%;
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
        .form-input {
          padding: 10px 0;
        }
        .login-button {
          display: flex;
          flex-flow: column;
          padding: 10px 0;
        }
      }
    }
  }
</style>
