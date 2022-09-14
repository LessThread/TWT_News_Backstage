<template>
  <div class="header noSelect">
    <div class="logo" @click="$router.push('/')">
      <img src="../assets/logo.svg" class="logoIcon" />
      <p class="title">TWT News 管理后台</p>
    </div>
  </div>
</template>

<script>
import getAssetsFile from "@/utils/pub-use";
export default {
  data() {
    return {
      isResizing: false,
      login: false,
      tabList: [
        {
          src: "folder.png",
          title: "资源库",
          url: "/resource",
        },
        {
          src: "merge.png",
          title: "入党流程",
          url: "/progress",
        },
        {
          src: "mail.png",
          title: "站内信",
          url: "/message",
        },
        {
          src: "file.png",
          title: "学习与考试",
          url: "/study",
        },
        {
          src: "avatar.png",
          title: "我的文件",
          url: "/file",
        },
      ],
    };
  },
  methods: {
    getAssetsFile(url) {
      return getAssetsFile(url);
    },
  },
};
</script>

<style scoped>
.header {
  width: 100%;
  height: 86px;
  background-color: #fefefe;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 30px;
}
.logo {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
}
.title {
  color: #2a2a2a;
  font-size: 26px;
  letter-spacing: 1px;
}
.logoIcon {
  width: 35px;
  height: 30px;
  margin-right: 20px;
}
</style>