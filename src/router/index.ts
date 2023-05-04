import { createRouter, createWebHashHistory } from "vue-router"

const routes = [
  {
    path: '/',
    redirect: "/home"
  },
  {
    path: '/home',
    redirect: '/home/carouselPublish',
    meta: {
      title:"主页",
    },
    children: [
      {
        path: '/home/carouselPublish',
        component: () => import('@/views/home/carouselPublish.vue'),
        meta: {
          title:"轮播图发布",
        },
      },
      {
        path: '/home/carouselManage',
        component: () => import('@/views/home/carouselManage.vue'),
        meta: {
          title:"轮播图管理",
        },
      }
    ]
  },
  {
    path: '/publish',
    component: () => import('@/views/publish.vue'),
    meta: {
      title:"发布",
    },
  },
  {
    path: '/news',
    component: () => import('@/views/news.vue'),
    meta: {
      title:"新闻",
    },
  },
  {
    path: '/submit',
    component: () => import('@/views/submit.vue'),
    meta: {
      title:"投稿",
    },
  },
  {
    path: '/access',
    component: () => import('@/views/access.vue'),
    meta: {
      title:"权限",
    },
  },
  {
    path: '/examination',
    component: () => import('@/views/examination.vue'),
    meta: {
      title:"审核",
    },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
  scrollBehavior: () => ({ top: 0 }),
})
router.beforeEach(async(to, from, next) => {
    window.document.title =
        to.meta.title == undefined ?
        "TWT News 管理后台" :
        `${to.meta.title} - TWT News 管理后台`;
    next();
});
export default router