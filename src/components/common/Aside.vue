<template>
  <div class="aside-container">
    <div class="mobile-menu" v-if="mobileFlag">
      <icon-font icon="icon-menu" :fontSize="32" @click.native="openMenu"></icon-font>
    </div>
    <div class="menu-wrapper" v-show="showFlag">
      <div class="close-menu" v-if="mobileFlag">
        <icon-font icon="icon-close" :fontSize="32" @click.native="closeMenu"></icon-font>
      </div>
      <div class="user-message">
        <div class="user-avatar">
          <img :src="userInfo.avatar || avatar" alt="">
        </div>
        <div class="user-name">{{ userInfo.name || user }}</div>
      </div>
      <el-menu class="aside-menu"
        :default-active="activeIndex"
        background-color="#324157"
        text-color="#fff"
        active-text-color="#E9F01D"
        router>
        <template v-for="item in items">
          <template v-if="item.subs">
            <el-submenu :key="item.index" :index="item.index">
              <template slot="title">
                <icon-font :icon="item.icon" :fontSize="32"></icon-font>
                <span>{{ item.title }}</span>
              </template>
              <el-menu-item v-for="(subItem, i) in item.subs" :key="i" :index="subItem.index">
                <icon-font :icon="subItem.icon" :fontSize="32"></icon-font>
                <span>{{ subItem.title }}</span>
              </el-menu-item>
            </el-submenu>
          </template>
          <template v-else>
            <el-menu-item :key="item.index" :index="item.index">
              <icon-font :icon="item.icon" :fontSize="32"></icon-font>
              <span>{{ item.title }}</span>
            </el-menu-item>
          </template>
        </template>
      </el-menu>
      <div class="rights">
        <p>Copyright © 2018 - {{ new Date().getFullYear() }} Qing Yi Ming wood industry Co., Ltd.</p>
      </div>
    </div>
  </div>
</template>

<script>
  import IconFont from 'components/common/Iconfont'
  import { judgeMobile } from 'common/js/tool'
  export default {
    props: {
      userInfo: {
        type: Object,
        default: null
      }
    },
    computed: {
      items() {
        return this.userInfo.root == 1 ? this.items1 : this.items0
      }
    },
    data() {
      return {
        showFlag: true,
        mobileFlag: false,
        user: '情义明木业有限公司',
        avatar: '	https://qingyiming-1255423800.cos.ap-chengdu.myqcloud.com/QingYiMing.JPG',
        activeIndex: '0',
        items1: [
          {
            icon: 'icon-ziliaofenlei',
            index: '1',
            title: '基础信息',
            subs: [
              {
                icon: 'icon-tree',
                index: '/baseinfo/product',
                title: '产品',
              },
              {
                icon: 'icon-gongsi',
                index: '/baseinfo/company',
                title: '公司'
              },
              {
                icon: 'icon-jiliang',
                index: '/baseinfo/unit',
                title: '单位'
              }
            ]
          },
          {
            icon: 'icon-customer',
            index: '2',
            title: '客户管理',
            subs: [
              {
                icon: 'icon-supply',
                index: '/supply',
                title: '客户供应',
              }
            ]
          },
          {
            icon: 'icon-dingdan',
            index: '3',
            title: '订单管理',
            subs: [
              {
                icon: 'icon-order',
                index: '/order/latest',
                title: '最新订单'
              },
              {
                icon: 'icon-order-history',
                index: '/order/history',
                title: '历史订单'
              }
            ]
          },
          {
            icon: 'icon-kucun',
            index: '4',
            title: '库存管理',
            subs: [
              {
                icon: 'icon-shenqingfahuo',
                index: '/inventor/list',
                title: '库存清单'
              },
              {
                icon: 'icon-history',
                index: '/inventor/out',
                title: '出库清单'
              }
            ]
          },
          {
            icon: 'icon-invoice',
            index: '5',
            title: '送货单',
            subs: [
              {
                icon: 'icon-shenqingfahuo',
                index: '/invoice/delivery',
                title: '打印送货单'
              },
              {
                icon: 'icon-history',
                index: '/invoice/history',
                title: '历史送货单'
              }
            ]
          }
        ],
        items0: [
          {
            icon: 'icon-shenqingfahuo',
            index: '/invoice/delivery',
            title: '打印送货单'
          },
          {
            icon: 'icon-history',
            index: '/invoice/history',
            title: '历史送货单'
          }
        ]
      }
    },
    created() {
      this.mobileFlag = judgeMobile()
      this.showFlag = !judgeMobile()
    },
    methods: {
      openMenu() {
        this.showFlag = true
      },
      closeMenu() {
        this.showFlag = false
      }
    },
    components: {
      IconFont
    }
  }
</script>

<style lang="scss" scoped>
  @import 'common/css/variable.scss';

  .mobile-menu {
    position: fixed;
    padding: 5px;
    background: $color-white;
    text-align: left;
  }

  .menu-wrapper {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 250px;
    text-align: left;
    display: flex;
    flex-flow: column;
    background-color: $color-deepgray;
    overflow-y: auto;
    z-index: 100;
    .close-menu {
      text-align: right;
      padding: 5px;
    }
    .user-message {
      padding: 10px 0;
      margin: auto;
      .user-avatar {
        width: 100px;
        height: 100px;
        margin: auto;
        img {
          width: 100px;
          height: 100px;
          border-radius: 50%;
        }
      }
      .user-name {
        text-align: center;
        margin-top: 10px;
        color: $color-white;
      }
    }
    .aside-menu {
      height: 100%;
      border: none;
    }
    .rights {
      font-size: 12px;
      color: $color-white;
      margin: 10px;
      text-align: center;
      line-height: 22px;
    }
  }
</style>
