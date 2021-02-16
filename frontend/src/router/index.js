import Vue from 'vue'
import VueRouter from 'vue-router'
import SignIn from '../views/SignIn.vue'
import SignUp from "@/views/SignUp";
import HomePage from "@/views/HomePage";
import MainPage from "@/views/MainPage";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'SignIn',
    component: SignIn
  },
  {
    path: '/SignUp',
    name: 'Signup',
    component: SignUp
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    //component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/HomePage/:id',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/MainPage/:id',
    name: 'MainPage',
    component: MainPage
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
