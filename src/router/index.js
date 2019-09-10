import Vue from 'vue'
import Router from 'vue-router'
import Store from '@/store'
Vue.use(Router)

const router= new Router({
  base:'',
  linkActiveClass:'active',
  routes: [
    {
      path: '/',
      name: 'operations',//添加资料
      component: ()=>import('./../views/operations/index')
    },
    {
      path: '/login',
      name: 'login',//户主登录
      component: ()=>import('./../views/login/index')
    },
    {
      path: '/auditList',
      name: 'auditList',//审计列表
      component: ()=>import('./../views/auditList/index')
    },
    {
      path: '/add',
      name: 'add',//添加资料
      component: ()=>import('./../views/documentation/add')
    },
    {
      path: '/auditing',
      name: 'auditing',//审核资料
      component: ()=>import('./../views/documentation/auditing')
    },
    {
      path: '/edit',
      name: 'edit',//添加资料
      component: ()=>import('./../views/documentation/edit')
    },
    {
      path: '*',
      redirect: { name: 'operations' }
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.name && to.name !== from.name) {
     /*  Store.commit('SWITCH_LOADING', true) */
  }
  next(true)
})
export default router;