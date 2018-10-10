<template>
  <div class="header-container">
    <div class="welcome-message">
      {{ userInfo.name }} 欢迎您
    </div>
    <el-button size="mini" @click="logout">退出</el-button>
  </div>
</template>

<script>
  import apiUrl from '@/serviceAPI.config.js'
  export default {
    props: {
      userInfo: {
        type: Object,
        default: null
      }
    },
    methods: {
      logout() {
        this.$http.post(apiUrl.logout).then(res => {
          if (res.data.code === 200) {
            this.$router.push({path: '/login'})
          }
        }).catch(err => {
          this.$message.error('服务器君傲娇啦😭')
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import 'common/css/variable.scss';

  .header-container {
    position: fixed;
    left: 250px;
    right: 0;
    height: 50px;
    background-color: $color-gray;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0 10px;
    .welcome-message {
      margin-right: 10px;
    }
  }
</style>
