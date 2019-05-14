import Vue from 'vue'
import Router from 'vue-router'
import NProgress from "nprogress";
import Home from '../views/Home'
import Rooms from '../views/Rooms'
import Bookings from '../views/Bookings'
import Services from '../views/Services'
import About from '../views/About'
import Dashboard from '../views/Dashboard'
import DashboardRoomTypes from '../views/dashboard/RoomTypes'
import DashboardRooms from '../views/dashboard/Rooms'
import DashboardBookings from '../views/dashboard/Bookings'
import store from '../store/index';

Vue.use(Router)

var router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/rooms', name: 'rooms', component: Rooms },
    { path: '/services', name: 'services', component: Services },
    { path: '/about', name: 'about', component: About },
    { path: '/bookings', name: 'bookings', component: Bookings, props: true },
    { path: '/dashboard', name: 'dashboard', component: Dashboard, meta: { auth: true } },
    { path: '/dashboard/bookings', name: 'dashboard-bookings', component: DashboardBookings, meta: { auth: true } },
    { path: '/dashboard/room-types', name: 'dashboard-room-types', component: DashboardRoomTypes, meta: { auth: true, isAdmin: true } },
    { path: '/dashboard/rooms', name: 'dashboard-rooms', component: DashboardRooms, meta: { auth: true, isAdmin: true } },
    { path: '*', redirect: { name: 'home' } },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
});

router.beforeEach((to, from, next) => {

  function checkRole() {
    if (to.matched.some(record => record.meta.isAdmin)) {
      if (store.getters['auth/isAdmin']) {
        next()
      }
      else {
        next('/')
      }
    } else {
      next()
    }
  }

  // if token is not available 'close' all 'auth-neaded' paths 
  if (!store.getters['auth/authenticated']) {
    if (to.matched.some(record => record.meta.auth)) {
      next('/')
    } else {
      next()
    }
  } else {
    if (Object.entries(store.getters['auth/user']).length === 0) {
      store.dispatch('auth/fetchUserDetails');
      store.watch(store.getters['auth/userLoaded'], (val) => {
        if (val) {
          checkRole()
        }

      })
    } else {
      checkRole()
    }
  }
});

router.beforeResolve((to, from, next) => {
  if (to.name) {
    NProgress.start()
  }
  next()
})

router.afterEach(() => {
  NProgress.done()
})

export default router;