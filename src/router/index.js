import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/pages/Login'
import Home from '@/components/pages/Home'
import Product from '@/components/pages/Product'
import Unit from '@/components/pages//Unit'
import Company from '@/components/pages/Company'
import Supply from '@/components/pages/Supply'
import Delivery from '@/components/pages/inventory/Delivery'
import DeliveryHistory from '@/components/pages/inventory/History'

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
          path: '/inventory/delivery',
          name: 'Delivery',
          component: Delivery
        },
        {
          path: '/inventory/history',
          name: 'DeliveryHistory',
          component: DeliveryHistory
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
