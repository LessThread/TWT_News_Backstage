<template>
  <div>
    <el-menu
      :default-active="defaultActive"
      router
      class="el-menu-vertical-demo"
    >
      <el-sub-menu index="1">
        <template #title>
          <img
            :src="
              defaultActive.split('/')[1] === 'home'
                ? require('home_active.svg')
                : require('home.svg')
            "
            class="nav-icon"
          />
          <span
            class="nav-title"
            :style="
              defaultActive.split('/')[1] === 'home' ? 'color:#00a0e9;' : ''
            "
            >主页</span
          >
        </template>
        <el-menu-item index="/home/carouselPublish" class="nav-subtitle"
          >轮播图发布</el-menu-item
        >
        <el-menu-item index="/home/carouselManage" class="nav-subtitle"
          >轮播图管理</el-menu-item
        >
      </el-sub-menu>
      <el-menu-item index="/publish">
        <img
          :src="
            defaultActive.split('/')[1] === 'publish'
              ? require('pen_active.svg')
              : require('pen.svg')
          "
          class="nav-icon"
        />
        <span class="nav-title">发布</span>
      </el-menu-item>
      <el-menu-item index="/news">
        <img
          :src="
            defaultActive.split('/')[1] === 'news'
              ? require('flag_active.svg')
              : require('flag.svg')
          "
          class="nav-icon"
        />
        <span class="nav-title">新闻</span>
      </el-menu-item>
      <el-menu-item index="/submit">
        <img
          :src="
            defaultActive.split('/')[1] === 'submit'
              ? require('pointer_active.svg')
              : require('pointer.svg')
          "
          class="nav-icon"
        />
        <span class="nav-title">投稿</span>
      </el-menu-item>
      <el-menu-item index="/access">
        <img
          :src="
            defaultActive.split('/')[1] === 'access'
              ? require('lock_active.svg')
              : require('lock.svg')
          "
          class="nav-icon"
        />
        <span class="nav-title">权限</span>
      </el-menu-item>
      <div class="nav-bottom">
        <img src="../assets/user.svg" class="nav-icon" />
        <span class="nav-title">用户</span>
      </div>
    </el-menu>
  </div>
</template>

<script >
import require from "../utils/pub-use";
export default {
  data() {
    return {
      defaultActive: "",
    };
  },
  methods: {
    require(url) {
      return require(url);
    },
  },
  watch: {
    $route(to, from) {
      this.defaultActive = to.path;
    },
  },
};
</script>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  height: calc(100vh - 86px);
}
.nav-title {
  font-size: 20px;
}
.nav-subtitle {
  font-size: 18px;
  padding-left: calc(
    var(--el-menu-base-level-padding) + var(--el-menu-level) *
      var(--el-menu-level-padding) + 15px
  ) !important;
}
.nav-icon {
  width: 22px;
  height: 22px;
  margin-right: 16px;
}
.right-icon {
  width: 22px;
  height: 22px;
}
.is-active :deep(.el-sub-menu__icon-arrow) {
  color: #00a0e9;
}
.nav-bottom {
  cursor: pointer;
  width: 100%;
  height: 60px;
  position: absolute;
  bottom: 0;
  display: flex;
  padding-left: 30px;
  justify-content: flex-start;
  align-items: center;
}
</style>
