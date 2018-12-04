import Vue from 'vue'
import Router from 'vue-router'
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

Vue.use(Router)

export default new Router({
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
          component: Product
        },
        {
          path: '/baseinfo/company',
          name: 'Company',
          component: Company
        },
        {
          path: '/baseinfo/unit',
          name: 'Unit',
          component: Unit
        },
        {
          path: '/supply',
          name: 'Supply',
          component: Supply
        },
        {
          path: '/order/latest',
          name: 'order',
          component: Order
        },
        {
          path: '/order/history',
          name: 'OrderHistory',
          component: OrderHistory
        },
        {
          path: '/invoice/delivery',
          name: 'Delivery',
          component: Delivery
        },
        {
          path: '/invoice/history',
          name: 'DeliveryHistory',
          component: DeliveryHistory
        },
        {
          path: '/inventory/list',
          name: 'InventoryList',
          component: InventoryList
        },
        {
          path: '/inventory/in',
          name: 'InventoryIn',
          component: InventoryIn
        },
        ,
        {
          path: '/inventory/out',
          name: 'InventoryOut',
          component: InventoryOut
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
