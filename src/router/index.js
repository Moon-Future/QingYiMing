import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/pages/Login'
import Home from '@/components/pages/Home'
import Product from '@/components/pages//Product'
import Customer from '@/components/pages//Customer'
import Delivery from '@/components/pages//Delivery'

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
          path: '/product',
          name: 'Product',
          component: Product
        },
        {
          path: '/customer',
          name: 'Customer',
          component: Customer
        },
        {
          path: '/delivery',
          name: 'Delivery',
          component: Delivery
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
