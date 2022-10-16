<template>
  <div class="carouselManage">
    <p class="title">轮播图管理</p>
    <div class="carouselItem" v-for="(item, i) in carousel" :key="i">
      <div class="titleDiv">第{{ trans[i] }}张：</div>
      <div class="bottomBar">
        <div class="textDiv">
          <p>标题： {{ item.title }}</p>
          <p>日期： {{ item.createDate }}</p>
          <p>
            图片：
            <span @click="toPreview(item.imageId)" class="textSpan"
              >【点击查看】</span
            >
          </p>
        </div>
        <div class="btnDiv">
          <el-button class="confirmBtn marginRight40" @click="toEdit(item)"
            >编辑</el-button
          >
          <el-button
            class="cancelBtn"
            @click="toDelete(item.id)"
            :loading="loading[item.id]"
            >删除</el-button
          >
        </div>
      </div>
    </div>
    <el-dialog v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
  </div>
</template>

<script>
import { getCarousel, updateCarousel } from "@/api/user";
import { BASE_URL } from "@/utils/request/config";
export default {
  data() {
    return {
      trans: ["一", "二", "三", "四"],
      carousel: [],
      loading: [false, false, false, false, false],
      dialogVisible: false,
      dialogImageUrl: "",
    };
  },
  created() {
    this.getCarousel();
  },
  watch: {
    $route() {
      this.getCarousel();
    },
  },
  methods: {
    toEdit(item) {
      this.$router.push({
        path: "/home/carouselPublish",
        query: {
          id: item.id,
          articleId: item.articleId,
          //imageId: item.imageId,
          summary: item.summary,
          title: item.title,
        },
      });
    },
    toPreview(id) {
      this.dialogImageUrl = BASE_URL + "/imgbed/download/" + id;
      this.dialogVisible = true;
    },
    getCarousel() {
      getCarousel().then(({ code: code, result: res }) => {
        if (code === 0) {
          this.carousel = res;
          this.carousel.sort((a, b) => a.id - b.id);
        }
      });
    },
    getNow() {
      let date = new Date();
      let year = date.getFullYear();
      let month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      let hours =
        date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      let minutes =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      let seconds =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return (
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds
      );
    },
    toDelete(id) {
      this.loading[id] = true;
      updateCarousel({
        id: id,
        articleId: 0,
        title: "0",
        imageId: 0,
        summary: "0",
        createDate: this.getNow(),
      }).then(({ code: code, message: msg }) => {
        if (code === 0) {
          ElMessage.success("删除成功");
          this.getCarousel();
          this.loading[id] = false;
        } else {
          ElMessage.error(msg);
          this.loading[id] = false;
        }
      });
    },
  },
};
</script>

<style scoped>
.carouselManage {
  width: 100%;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 16px;
  box-sizing: border-box;
}
.title {
  color: #2a2a2a;
  font-weight: 700;
  font-size: 24px;
  margin-bottom: 30px;
}
.carouselItem {
  margin-bottom: 30px;
}
.titleDiv {
  color: #2a2a2a;
  font-size: 17px;
  border-left: 4px solid #00a0e9;
  padding-left: 10px;
  margin-bottom: 20px;
}
.bottomBar {
  display: flex;
  justify-content: space-between;
}
.textDiv {
  display: grid;
  grid-template-columns: 260px 260px 240px;
  color: #767676;
  font-size: 17px;
}
.textSpan {
  cursor: pointer;
  color: #00a0e9;
}
.marginRight40 {
  margin-right: 40px;
}
</style>
