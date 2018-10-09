import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/pages/Login'
import Home from '@/components/pages/Home'
import Product from '@/components/pages//Product'
import Unit from '@/components/pages//Unit'
import Company from '@/components/pages//Company'
import Supply from '@/components/pages//Supply'
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
          path: '/company',
          name: 'Company',
          component: Company
        },
        {
          path: '/unit',
          name: 'Unit',
          component: Unit
        },
        {
          path: '/supply',
          name: 'Supply',
          component: Supply
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
