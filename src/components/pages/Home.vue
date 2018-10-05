<template>
  <div class="home-container">
    <Aside></Aside>
    <Header></Header>
    <div class="home-right">
      <div class="home-breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/product' }">产品</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="home-content">
        <div class="home-descr" v-show="homeFlag">
          主页面 - 介绍
        </div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  import Aside from 'components/common/Aside'
  import Header from 'components/common/Header'
  export default {
    data() {
      return {
        homeFlag: true
      }
    },
    created() {
      this.homeFlag = this.$route.name === 'Home' ? true : false
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
      }
    }
  }
</style>
