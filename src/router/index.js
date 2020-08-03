/**
 * 全站路由配置
 *
 * 建议:
 * 1. 代码中路由统一使用name属性跳转(不使用path属性)
 */
import Vue from 'vue'
import Router from 'vue-router'
import http from '@/utils/httpRequest'
import { isURL } from '@/utils/validate'
import { clearLoginInfo } from '@/utils'

Vue.use(Router)

// 开发环境不使用懒加载, 因为懒加载页面太多的话会造成webpack热更新太慢, 所以只有生产环境使用懒加载
const _import = require('./import-' + process.env.NODE_ENV)

// 全局路由(无需嵌套上左右整体布局)
const globalRoutes = [
  { path: '/404', component: _import('common/404'), name: '404', meta: { title: '404未找到' } },
  { path: '/login', component: _import('common/login'), name: 'login', meta: { title: '登录' } },
]

// 主入口路由(需嵌套上左右整体布局)
const mainRoutes = {
  path: '/',
  component: _import('main'),
  name: 'main',
  redirect: { name: 'home' },
  meta: { title: '主入口整体布局' },
  children: [
    // 通过meta对象设置路由展示方式
    // 1. isTab: 是否通过tab展示内容, true: 是, false: 否
    // 2. iframeUrl: 是否通过iframe嵌套展示内容, '以http[s]://开头': 是, '': 否
    // 提示: 如需要通过iframe嵌套展示内容, 但不通过tab打开, 请自行创建组件使用iframe处理!
    { path: '/home', component: _import('common/home'), name: 'home', meta: { title: '首页' } },
    { path: '/theme', component: _import('common/theme'), name: 'theme', meta: { title: '主题' } },
    { path: '/404', component: _import('common/404'), name: 'theme', meta: { title: '404' } },
    { path: '/demo-echarts', component: _import('demo/echarts'), name: 'demo-echarts', meta: { title: 'demo-echarts', isTab: true } },
    { path: '/demo-ueditor', component: _import('demo/ueditor'), name: 'demo-ueditor', meta: { title: 'demo-ueditor', isTab: true } },
    /*{path:'/policy-pack',component:_import('modules/policy-pack/policy-pack'),name:'policy-pack',meta:{title:'月政策包管理',isTab: true }},*/
    {path:'/policy-pack-add-or-update',component: _import('modules/policy-pack/policy-pack-add-or-update'),name:'policy-pack-add-or-update',meta: { title: '月政策包新增or编辑',isTab: true }},
    {path:'/policy-pack-view',component:_import('modules/policy-pack/policy-pack-view'),name:'policy-pack-view',meta:{title:'月政策包查看',isTab: true }},
    /*{path:'/policy',component:_import('modules/policy/policy'),name:'policy',meta:{title:'政策管理',isTab: true }},*/
    {path:'/policy-original-text-add-or-update',component:_import('modules/policy/policy-original-text-add-or-update'),name:'policy-original-text-add-or-update',meta:{title:'政策原文新增or编辑',isTab: true }},
    {path:'/policy-original-view',component:_import('modules/policy/policy-original-view'),name:'policy-original-view',meta:{title:'政策原文查看',isTab: true }},
    {path:'/policy-article-add-or-update',component:_import('modules/policy/policy-article-add-or-update'),name:'policy-article-add-or-update',meta:{title:'文章新增or编辑',isTab: true }},
    {path:'/policy-article-view',component:_import('modules/policy/policy-article-view'),name:'policy-article-view',meta:{title:'文章查看',isTab: true }},
    {path:'/policy-unscramble',component:_import('modules/policy/policy-unscramble'), name:'policy-unscramble', meta:{title:'逐条解读',isTab: true }},
    {path:'/policy-unscramble-view', component:_import('modules/policy/policy-unscramble-view'), name:'policy-unscramble-view', meta:{title:'逐条解读查看',isTab: true }},
    {path:'/policy-unscramble-extend', component:_import('modules/policy/policy-unscramble-extend'), name:'policy-unscramble-extend', meta:{title:'延伸解读',isTab: true }},
    {path:'/policy-unscramble-extend-view', component:_import('modules/policy/policy-unscramble-extend-view'), name:'policy-unscramble-extend-view', meta:{title:'延伸解读查看',isTab: true }},
    {path:'/policy-unscramble-contrast', component:_import('modules/policy/policy-unscramble-contrast'), name:'policy-unscramble-contrast', meta:{title:'对比解读',isTab: true }},
    {path:'/policy-unscramble-contrast-view', component:_import('modules/policy/policy-unscramble-contrast-view'), name:'policy-unscramble-contrast-view', meta:{title:'对比解读查看',isTab: true }},
    {path:'/policy-unscramble-official', component:_import('modules/policy/policy-unscramble-official'), name:'policy-unscramble-official', meta:{title:'官方解读',isTab: true }},
    {path:'/policy-unscramble-official-view', component:_import('modules/policy/policy-unscramble-official-view'), name:'policy-unscramble-official-view', meta:{title:'官方解读查看',isTab: true }},
    {path:'/policy-report-expert', component:_import('modules/policy/policy-report-expert'), name:'policy-report-expert', meta:{title:'专家预测',isTab: true }},
    {path:'/policy-report-expert-view', component:_import('modules/policy/policy-report-expert-view'), name:'policy-report-expert-view', meta:{title:'专家预测查看',isTab: true }},
    {path:'/policy-report-idea', component:_import('modules/policy/policy-report-idea'), name:'policy-report-idea', meta:{title:'参考意见',isTab: true }},
    {path:'/policy-report-idea-view', component:_import('modules/policy/policy-report-idea-view'), name:'policy-report-idea-view', meta:{title:'参考意见查看',isTab: true }},
    {path:'/policy-evaluation', component:_import('modules/policy/policy-evaluation'), name:'policy-evaluation', meta:{title:'测评',isTab: true }},
    {path:'/policy-question-add-or-update', component:_import('modules/policy/policy-question-add-or-update'), name:'policy-question-add-or-update', meta:{title:'测评试题新增or编辑',isTab: true },},
    {path:'/policy-question-view', component:_import('modules/policy/policy-question-view'), name:'policy-question-view', meta:{title:'试题查看',isTab: true }},
    {path:'/question-add-or-update', component:_import('modules/question/question-add-or-update'), name:'question-add-or-update', meta:{title:'试题管理新增or编辑',isTab: true },},
    {path:'/banner-view',component:_import('modules/banner/banner-view'),name:'banner-view',meta:{title:'广告位查看',isTab: true }},
    {path:'/banner-add-or-update',component:_import('modules/banner/banner-add-or-update'),name:'banner-add-or-update',meta:{title:'广告位新增or编辑',isTab: true }},
    {path:'/goods-view',component:_import('modules/goods/goods-view'),name:'goods-view',meta:{title:'商品查看',isTab: true }},
    {path:'/goods-add-or-update',component:_import('modules/goods/goods-add-or-update'),name:'goods-add-or-update',meta:{title:'商品新增or编辑',isTab: true }},
    {path:'/user',component:_import('modules/user/user'),name:'user',meta:{title:'普通用户管理',isTab: true }},
    {path:'/company',component:_import('modules/user/company'),name:'company',meta:{title:'企业用户管理',isTab: true }},
    {path:'/company-view',component:_import('modules/user/company-view'),name:'company-view',meta:{title:'企业用户查看',isTab: true }},
    {path:'/companyManage-view',component:_import('modules/user/companyManage-view'),name:'companyManage-view',meta:{title:'企业查看',isTab: true }},
    {path:'/companyManage-add',component:_import('modules/user/companyManage-add'),name:'companyManage-add',meta:{title:'企业新增',isTab: true }},
    {path:'/company-account',component:_import('modules/user/company-account'),name:'company-account',meta:{title:'账户管理',isTab: true }},
    {path:'/company-equity',component:_import('modules/user/company-equity'),name:'company-equity',meta:{title:'权益管理',isTab: true }},
    {path:'/company-equity-add',component:_import('modules/user/company-equity-add'),name:'company-equity-add',meta:{title:'权益新增or续费',isTab: true }},
    {path:'/user-question-view', component:_import('modules/coach/user-question-view'), name:'user-question-view', meta:{title:'用户测评结果查看',isTab: true }},
    {path:'/user-report-res-view', component:_import('modules/coach/user-report-res-view'), name:'user-report-res-view', meta:{title:'用户报告结果查看',isTab: true }},
    {path:'/month-data-view', component:_import('modules/coach/month-data-view'), name:'month-data-view', meta:{title:'月度辅导数据查看',isTab: true }},
    {path:'/policy-data-view', component:_import('modules/coach/policy-data-view'), name:'policy-data-view', meta:{title:'政策辅导数据查看',isTab: true }},
    {path:'/policy-data-total-view', component:_import('modules/coach/policy-data-total-view'), name:'policy-data-total-view', meta:{title:'政策辅导总数据查看',isTab: true }},
    {path:'/company-question-view', component:_import('modules/question-record/company-question-view'), name:'company-question-view', meta:{title:'企业问答查看',isTab: true }},
    {path:'/question-record-view', component:_import('modules/question-record/question-record-view'), name:'question-record-view', meta:{title:'问题管理查看',isTab: true }},
    {path:'/policy-original-add-or-update', component:_import('modules/policy-original/add-or-update'), name:'policy-original-add-or-update', meta:{title:'政策原文新增or编辑',isTab: true }},
    {path:'/policy-original-tr-view', component:_import('modules/policy-original/tr-view'), name:'policy-original-tr-view', meta:{title:'政策原文查看',isTab: true }},
    {path:'/policy-imputation-add-or-update', component:_import('modules/policy-imputation/add-or-update'), name:'policy-imputation-add-or-update', meta:{title:'政策归集新增or编辑',isTab: true }},
    {path:'/policy-imputation-view', component:_import('modules/policy-imputation/view'), name:'policy-imputation-view', meta:{title:'政策归集查看',isTab: true }},
    {path:'/policy-imputation-examine-online', component:_import('modules/policy-imputation/examine-online'), name:'policy-imputation-examine-online', meta:{title:'政策归集上线审核',isTab: true }},
    {path:'/policy-imputation-examine-update', component:_import('modules/policy-imputation/examine-update'), name:'policy-imputation-examine-update', meta:{title:'政策归集更新审核',isTab: true }},
    {path:'/policy-imputation-examine-edit', component:_import('modules/policy-imputation/examine-edit'), name:'policy-imputation-examine-edit', meta:{title:'政策归集审核编辑',isTab: true }},
    {path:'/policy-imputation-examine-offline', component:_import('modules/policy-imputation/examine-offline'), name:'policy-imputation-examine-offline', meta:{title:'政策归集下线审核',isTab: true }},
    {path:'/policy-imputation-examine-offline-view', component:_import('modules/policy-imputation/examine-offline-view'), name:'policy-imputation-examine-offline-view', meta:{title:'政策归集审核查看',isTab: true }},
    {path:'/policy-imputation-examine-record', component:_import('modules/policy-imputation/examine-record'), name:'policy-imputation-examine-record', meta:{title:'政策归集审核记录',isTab: true }},
    {path:'/policy-imputation-record', component:_import('modules/policy-imputation/record'), name:'policy-imputation-record', meta:{title:'政策归集操作记录',isTab: true }},
    {path:'/relative-expert-add-or-update', component:_import('modules/relative-expert/add-or-update'), name:'relative-expert-add-or-update', meta:{title:'相关解读新增or编辑',isTab: true }},
    {path:'/relative-expert-view', component:_import('modules/relative-expert/view'), name:'relative-expert-view', meta:{title:'相关解读查看',isTab: true }},
    {path:'/relative-expert-record', component:_import('modules/relative-expert/record'), name:'relative-expert-record', meta:{title:'相关解读操作记录',isTab: true }},
    {path:'/relative-expert-examine-record', component:_import('modules/relative-expert/examine-record'), name:'relative-expert-examine-record', meta:{title:'相关解读审核记录',isTab: true }},
    {path:'/relative-expert-examine-online', component:_import('modules/relative-expert/examine-online'), name:'relative-expert-examine-online', meta:{title:'相关解读上线审核',isTab: true }},
    {path:'/relative-expert-examine-update', component:_import('modules/relative-expert/examine-update'), name:'relative-expert-examine-update', meta:{title:'相关解读更新审核',isTab: true }},
    {path:'/relative-expert-examine-edit', component:_import('modules/relative-expert/examine-edit'), name:'relative-expert-examine-edit', meta:{title:'相关解读审核编辑',isTab: true }},
    {path:'/relative-expert-examine-offline', component:_import('modules/relative-expert/examine-offline'), name:'relative-expert-examine-offline', meta:{title:'相关解读下线审核',isTab: true }},
    {path:'/relative-expert-examine-offline-view', component:_import('modules/relative-expert/examine-offline-view'), name:'relative-expert-examine-offline-view', meta:{title:'相关解读审核查看',isTab: true }},
    {path:'/risk-tips-add-or-update', component:_import('modules/risk-tips/add-or-update'), name:'risk-tips-add-or-update', meta:{title:'风险提示新增or编辑',isTab: true }},
    {path:'/risk-tips-view', component:_import('modules/risk-tips/view'), name:'risk-tips-view', meta:{title:'风险提示查看',isTab: true }},
    {path:'/risk-tips-record', component:_import('modules/risk-tips/record'), name:'risk-tips-record', meta:{title:'风险提示操作记录',isTab: true }},
    {path:'/tax-plan-add-or-update', component:_import('modules/tax-plan/add-or-update'), name:'tax-plan-add-or-update', meta:{title:'税收筹划新增or编辑',isTab: true }},
    {path:'/tax-plan-view', component:_import('modules/tax-plan/view'), name:'tax-plan-view', meta:{title:'税收筹划查看',isTab: true }},
    {path:'/tax-plan-record', component:_import('modules/tax-plan/record'), name:'tax-plan-record', meta:{title:'税收筹划操作记录',isTab: true }},
    {path:'/news-center-add-or-update', component:_import('modules/news-center/add-or-update'), name:'news-center-add-or-update', meta:{title:'新闻中心新增or编辑',isTab: true }},
    {path:'/news-center-view', component:_import('modules/news-center/view'), name:'news-center-view', meta:{title:'新闻中心查看',isTab: true }},
    {path:'/news-center-record', component:_import('modules/news-center/record'), name:'news-center-record', meta:{title:'新闻中心操作记录',isTab: true }},
    {path:'/process-add-or-update', component:_import('modules/process/add-or-update'), name:'process-add-or-update', meta:{title:'流程解码图新增or编辑',isTab: true }},
    {path:'/process-view', component:_import('modules/process/view'), name:'process-view', meta:{title:'流程解码图查看',isTab: true }},
    {path:'/process-record', component:_import('modules/process/record'), name:'process-record', meta:{title:'流程解码图操作记录',isTab: true }},
    {path:'/good-class-add-or-update', component:_import('modules/good-class/add-or-update'), name:'good-class-add-or-update', meta:{title:'精选好课新增or编辑',isTab: true }},
    {path:'/good-class-view', component:_import('modules/good-class/view'), name:'good-class-view', meta:{title:'精选好课查看',isTab: true }},
    {path:'/good-class-record', component:_import('modules/good-class/record'), name:'good-class-record', meta:{title:'精选好课操作记录',isTab: true }},
    {path:'/broadcast-add-or-update', component:_import('modules/broadcast/add-or-update'), name:'broadcast-add-or-update', meta:{title:'直播答疑新增or编辑',isTab: true }},
    {path:'/broadcast-view', component:_import('modules/broadcast/view'), name:'broadcast-view', meta:{title:'直播答疑查看',isTab: true }},
    {path:'/broadcast-record', component:_import('modules/broadcast/record'), name:'broadcast-record', meta:{title:'直播答疑操作记录',isTab: true }},
    {path:'/expert-add-or-update', component:_import('modules/expert/add-or-update'), name:'expert-add-or-update', meta:{title:'专家管理新增or编辑',isTab: true }},
    {path:'/expert-view', component:_import('modules/expert/view'), name:'expert-view', meta:{title:'专家管理查看',isTab: true }},
    {path:'/lecturer-add-or-update', component:_import('modules/lecturer/add-or-update'), name:'lecturer-add-or-update', meta:{title:'讲师管理新增or编辑',isTab: true }},
    {path:'/lecturer-view', component:_import('modules/lecturer/view'), name:'lecturer-view', meta:{title:'讲师管理查看',isTab: true }},
    ],
  beforeEnter (to, from, next) {
    let token = Vue.cookie.get('token')
    if (!token || !/\S/.test(token)) {
      clearLoginInfo()
      next({ name: 'login' })
    }
    next()
  }
}

const router = new Router({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  isAddDynamicMenuRoutes: false, // 是否已经添加动态(菜单)路由
  routes: globalRoutes.concat(mainRoutes)
})

router.beforeEach((to, from, next) => {
  // 添加动态(菜单)路由
  // 1. 已经添加 or 全局路由, 直接访问
  // 2. 获取菜单列表, 添加并保存本地存储
  if (router.options.isAddDynamicMenuRoutes || fnCurrentRouteType(to, globalRoutes) === 'global') {
    next()
  } else {
    http({
      url: http.adornUrl('/sys/menu/nav'),
      method: 'get',
      params: http.adornParams()
    }).then(({data}) => {
      if (data && data.code === 0) {
        fnAddDynamicMenuRoutes(data.menuList)
        router.options.isAddDynamicMenuRoutes = true
        sessionStorage.setItem('menuList', JSON.stringify(data.menuList || '[]'))
        sessionStorage.setItem('permissions', JSON.stringify(data.permissions || '[]'))
        next({ ...to, replace: true })
      } else {
        sessionStorage.setItem('menuList', '[]')
        sessionStorage.setItem('permissions', '[]')
        next()
      }
    }).catch((e) => {
      console.log(`%c${e} 请求菜单列表和权限失败，跳转至登录页！！`, 'color:blue')
      router.push({ name: 'login' })
    })
  }
})

/**
 * 判断当前路由类型, global: 全局路由, main: 主入口路由
 * @param {*} route 当前路由
 */
function fnCurrentRouteType (route, globalRoutes = []) {
  var temp = []
  for (var i = 0; i < globalRoutes.length; i++) {
    if (route.path === globalRoutes[i].path) {
      return 'global'
    } else if (globalRoutes[i].children && globalRoutes[i].children.length >= 1) {
      temp = temp.concat(globalRoutes[i].children)
    }
  }
  return temp.length >= 1 ? fnCurrentRouteType(route, temp) : 'main'
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function fnAddDynamicMenuRoutes (menuList = [], routes = []) {
  var temp = []
  for (var i = 0; i < menuList.length; i++) {
    if (menuList[i].list && menuList[i].list.length >= 1) {
      temp = temp.concat(menuList[i].list)
    } else if (menuList[i].url && /\S/.test(menuList[i].url)) {
      menuList[i].url = menuList[i].url.replace(/^\//, '')
      var route = {
        path: menuList[i].url.replace('/', '-'),
        component: null,
        name: menuList[i].url.replace('/', '-'),
        meta: {
          menuId: menuList[i].menuId,
          title: menuList[i].name,
          isDynamic: true,
          isTab: true,
          iframeUrl: ''
        }
      }
      // url以http[s]://开头, 通过iframe展示
      if (isURL(menuList[i].url)) {
        route['path'] = `i-${menuList[i].menuId}`
        route['name'] = `i-${menuList[i].menuId}`
        route['meta']['iframeUrl'] = menuList[i].url
      } else {
        try {
          route['component'] = _import(`modules/${menuList[i].url}`) || null
        } catch (e) {}
      }
      routes.push(route)
    }
  }
  if (temp.length >= 1) {
    fnAddDynamicMenuRoutes(temp, routes)
  } else {
    mainRoutes.name = 'main-dynamic'
    mainRoutes.children = routes
    router.addRoutes([
      mainRoutes,
      { path: '*', redirect: { name: '404' } }
    ]);
    sessionStorage.setItem('dynamicMenuRoutes', JSON.stringify(mainRoutes.children || '[]'))
    // console.log('\n')
    // console.log('%c!<-------------------- 动态(菜单)路由 s -------------------->', 'color:blue')
    //console.log(mainRoutes.children)
    // console.log('%c!<-------------------- 动态(菜单)路j由 e -------------------->', 'color:blue')
  }
}

export default router
