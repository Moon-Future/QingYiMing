// import Vue from 'vue'
// import Router from 'vue-router'
import Login from '@/components/pages/Login'
import Home from '@/components/pages/Home'
import Product from '@/components/pages/Product'
import Unit from '@/components/pages//Unit'
import Company from '@/components/pages/Company'
import Supply from '@/components/pages/Supply'
import Delivery from '@/components/pages/Delivery'
import DeliveryHistory from '@/components/pages/DeliveryHistory'
import Order from '@/components/pages/Order'
import OrderHistory from '@/components/pages/OrderHistory'
import InventoryList from '@/components/pages/InventoryList'
import InventoryIn from '@/components/pages/InventoryIn'
import InventoryOut from '@/components/pages/InventoryOut'
import apiUrl from '@/serviceAPI.config.js'
import { Message } from 'element-ui'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      children: [
        {
          path: '/baseinfo/product',
          name: 'Product',
          component: () => import('@/components/pages/Product'),
        },
        {
          path: '/baseinfo/company',
          name: 'Company',
          component: () => import('@/components/pages/Company'),
        },
        {
          path: '/baseinfo/unit',
          name: 'Unit',
          component: () => import('@/components/pages/Unit'),
        },
        {
          path: '/supply',
          name: 'Supply',
          component: () => import('@/components/pages/Supply'),
        },
        {
          path: '/order/latest',
          name: 'order',
          component: () => import('@/components/pages/Order'),
        },
        {
          path: '/order/history',
          name: 'OrderHistory',
          component: () => import('@/components/pages/OrderHistory'),
        },
        {
          path: '/invoice/delivery',
          name: 'Delivery',
          component: () => import('@/components/pages/Delivery'),
        },
        {
          path: '/invoice/history',
          name: 'DeliveryHistory',
          component: () => import('@/components/pages/DeliveryHistory'),
        },
        {
          path: '/inventory/list',
          name: 'InventoryList',
          component: () => import('@/components/pages/InventoryList'),
        },
        {
          path: '/inventory/in',
          name: 'InventoryIn',
          component: () => import('@/components/pages/InventoryIn'),
        },
        ,
        {
          path: '/inventory/out',
          name: 'InventoryOut',
          component: () => import('@/components/pages/InventoryOut'),
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    axios.post(apiUrl.getSession).then(res => {
      if (res.data.code === 200) {
        next()
      } else {
        Message({
          message: res.data.message,
          duration: 1000
        })
        next({path: '/login'})
      }
    }).catch(err => {
      next({path: '/login'})
      Message.error(res.data.message)
    })
  }
})

export default router
