<template>
  <div class="home-container">
    <Aside :userInfo="userInfo" :mobileFlag="mobileFlag"></Aside>
    <Header :userInfo="userInfo" v-if="!mobileFlag"></Header>
    <div class="home-right" :class="{mobile: mobileFlag}">
      <div class="home-breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/product' }">产品</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="home-content" ref="homeContent">
        <div class="home-descr" v-show="homeFlag">
          主页面 - 介绍
        </div>
        <router-view :userInfo="userInfo" :mobileFlag="mobileFlag"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  import Aside from 'components/common/Aside'
  import Header from 'components/common/Header'
  import apiUrl from '@/serviceAPI.config.js'
  export default {
    data() {
      return {
        homeFlag: true,
        userInfo: {},
        mobileFlag: false
      }
    },
    beforeCreate() {
      this.$http.post(apiUrl.getSession).then(res => {
        if (res.data.code === 200) {
          this.userInfo = res.data.message
        } else {
          this.$message({
            message: res.data.message,
            duration: 1000
          })
          this.$router.push({path: '/login'})
        }
      }).catch(err => {
        this.$router.push({path: '/login'})
        this.$message.error(res.data.message)
      })
    },
    created() {
      this.mobileFlag = document.documentElement.clientWidth <= 500 || document.documentElement.clientHeight <= 500 ? true : false
      this.homeFlag = this.$route.name === 'Home' ? true : false
      this.$nextTick(() => {
        const windowH = window.innerHeight
        const offsetTop = this.$refs.homeContent.offsetTop
        this.$refs.homeContent.style.height = `${windowH - offsetTop - 70}px`
        // this.height = windowH - offsetTop - 100
      })
    },
    watch: {
      $route(to, from) {
        this.homeFlag = to.name === 'Home' ? true : false
      }
    },
    components: {
      Aside,
      Header
    }
  }
</script>

<style lang="scss" scoped>
  @import 'common/css/variable.scss';

  .home-container {
    .home-right {
      position: fixed;
      top: 50px;
      bottom: 0;
      left: 250px;
      right: 0;
      .home-breadcrumb {
        padding: 10px;
        border-bottom: 2px solid $color-deepgray;
      }
      .home-content {
        padding: 10px;
        overflow: auto;
      }
      &.mobile {
        position: absolute;
        top: 0;
        left: 0;
        width: 650px;
      }
    }
  }
</style>
