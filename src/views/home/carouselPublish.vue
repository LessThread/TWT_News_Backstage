<template>
  <div class="carouselPublish">
    <p class="title">{{ pageTitle }}</p>
    <div class="flexLine">
      <p class="tagText">标题：</p>
      <el-input
        class="flexGrow"
        v-model="title"
        maxlength="50"
        placeholder="请输入轮播图标题"
        show-word-limit
        type="text"
      />
    </div>

    <!-- <div class="flexLine">
      <p class="tagText">文章ID：</p>
      <el-input
        class="flexGrow"
        v-model="articleId"
        placeholder="请输入轮播图关联的文章ID"
        type="text"
      />
    </div> -->

    <div class="flexLine">
      <p class="tagText">关联文章：</p>
    <el-cascader
      placeholder="请输入轮播图关联的文章标题"
      :options="ArticleSelectionBox"
      filterable
      v-model="articleId"
    />
    <p class="tagText">ID：{{articleId}}</p>
    </div>



    <div class="flexLine">
      <p class="tagText">发布日期：</p>
      <p class="tagText">{{ time }}</p>
    </div>
    <div class="flexLine">
      <p class="tagText">轮播图位置：</p>
      <el-radio-group v-model="id">
        <el-radio :label="1"
          >第一张（{{
            !carousel[0].title || carousel[0].title === "0"
              ? "空"
              : carousel[0].title
          }}）</el-radio
        >
        <el-radio :label="2"
          >第二张（{{
            !carousel[1].title || carousel[1].title === "0"
              ? "空"
              : carousel[1].title
          }}）</el-radio
        >
        <el-radio :label="3"
          >第三张（{{
            !carousel[2].title || carousel[2].title === "0"
              ? "空"
              : carousel[2].title
          }}）</el-radio
        >
        <el-radio :label="4"
          >第四张（{{
            !carousel[3].title || carousel[3].title === "0"
              ? "空"
              : carousel[3].title
          }}）</el-radio
        >
      </el-radio-group>
    </div>
    <div class="flexRow">
      <p class="tagText">摘要：</p>
      <el-input
        class="rowTextarea"
        v-model="summary"
        placeholder="请输入轮播图摘要"
        maxlength="100"
        show-word-limit
        :autosize="{ minRows: 2, maxRows: 6 }"
        type="textarea"
        resize="none"
      />
    </div>
    <div class="flexLine alignTop">
      <p class="tagText">添加主图：</p>
      <el-upload
        :class="{  'hide-upload-btn': photoHide  }"
        :limit="1"
        :file-list="fileList"
        accept="image/*"
        :auto-upload="false"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-change="fileChange"
        :on-remove="fileRemove"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>
      <p class="tagText marginLeft">（建议比例为4:3，尺寸大于1600*1200）</p>
    </div>
    <div class="actionBar">
      <el-button
        class="confirmBtn margin50"
        @click="confirm"
        :loading="uploadLoading"
        >发布</el-button
      >
      <el-button
        class="cancelBtn margin50"
        @click="empty"
        :disabled="uploadLoading"
        >清空</el-button
      >
    </div>
    <el-dialog v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
  </div>
</template>

<script>
import { getCarousel, uploadImg, updateCarousel ,getNews } from "@/api/user";
export default {
  data() {
    return {
      photoHide: false,
      pageTitle: "轮播图发布",
      uploadLoading: false,
      id: "",
      title: "",
      articleId: "",
      time: "",
      summary: "",
      carousel: [[], [], [], []],
      dialogVisible: false,
      dialogImageUrl: "",
      fileList: [],
      imageId: 0,
      ArticleSelectionBox:[],
      bind:null,
    };
  },
  mounted() {
    this.dateShow();
  },
  created() {
    window.addEventListener("beforeunload", (e) => this.beforeunloadFn(e));
    this.dateFormat();
    this.getCarousel();
    this.setInitData();
    getNews().then((d)=>{
      for(let i=0;i<d.result.length;i++)
      {
        let TempArr={"value":d.result[i].id , "label":d.result[i].title};
        console.log(TempArr);
        this.ArticleSelectionBox.push(TempArr);
      }
      })
  },
  beforeDestroy() {
    window.removeEventListener("beforeunload", (e) => this.beforeunloadFn(e));
    this.dataDestroy();
  },
  beforeRouteLeave(to, from, next) {
    if (!this.id)
      localStorage.setItem("carouselPublishData", JSON.stringify(this.$data));
    next();
  },
  watch: {
    $route() {
      this.setInitData();
      this.getCarousel();
    },
  },
  methods: {
    beforeunloadFn() {
      if (!this.id)
        localStorage.setItem("carouselPublishData", JSON.stringify(this.$data));
    },
    setInitData() {
      console.log(this.$route.query);
      if (this.$route.query.id) {
        this.id = parseInt(this.$route.query.id) || "";
        this.imageId = this.$route.query.imageId || 0;
        this.articleId = this.$route.query.articleId || "";
        this.summary = this.$route.query.summary || "";
        this.title = this.$route.query.title || "";
        this.pageTitle = parseInt(this.$route.query.id)
          ? "轮播图编辑"
          : "轮播图发布";
      } else {
        const preData = localStorage.getItem("carouselPublishData");
        if (preData) {
          Object.assign(this.$data, JSON.parse(preData));
          localStorage.removeItem("carouselPublishData");
        }
      }
    },
    confirm() {
      if (!this.title) {
        ElMessage.warning("请输入轮播图标题");
        return;
      }
      if (!this.articleId) {
        ElMessage.warning("请输入轮播图关联的文章ID");
        return;
      }
      if (!this.id) {
        ElMessage.warning("请输入轮播图位置");
        return;
      }
      if (!this.summary) {
        ElMessage.warning("请输入轮播图摘要");
        return;
      }
      if (this.fileList.length === 0 && this.imageId === 0) {
        ElMessage.warning("请添加主图");
        return;
      }
      this.uploadLoading = true;
      if (this.imageId === 0) 
      {
        let formData = new FormData();
        formData.append("img", this.fileList[0].raw);
        uploadImg(formData)
          .then(({ code: code, message: msg, result: res }) => {
            if (code === 0) 
            {
              this.imageId = res;
              this.photoHide = false;
              this.updateCarousel(true);
            } 
            else 
            {
              ElMessage.error(msg);
              this.uploadLoading = false;
            }
          })
          .catch(() => {
            ElMessage.error("发布失败");
            this.uploadLoading = false;
          });
      } 
      else 
      {
        this.updateCarousel(false);
      }
    },
    updateCarousel(val) {
      updateCarousel({
        id: this.id,
        articleId: parseInt(this.articleId),
        title: this.title,
        imageId: this.imageId,
        summary: this.summary,
        createDate: this.time,
      }).then(({ code: code, message: msg }) => {
        if (code === 0) {
          if (
            parseInt(this.$route.query.id) &&
            parseInt(this.$route.query.id) !== this.id
          ) {
            updateCarousel({
              id: parseInt(this.$route.query.id),
              articleId: parseInt(this.carousel[this.id - 1].articleId),
              title: this.carousel[this.id - 1].title,
              imageId: this.carousel[this.id - 1].imageId,
              summary: this.carousel[this.id - 1].summary,
              createDate: this.carousel[this.id - 1].createDate,
            }).then(() => {
              this.empty();
              this.getCarousel();
              this.uploadLoading = false;
              if (val) {
                ElMessage.success("上传成功");
              } else {
                ElMessage.success("编辑成功");
                this.$router.push("/home/carouselManage");
              }
            });
          } else {
            this.empty();
            this.getCarousel();
            this.uploadLoading = false;
            if (val) {
              ElMessage.success("上传成功");
            } else {
              ElMessage.success("编辑成功");
              this.$router.push("/home/carouselManage");
            }
          }
        } else {
          ElMessage.error(msg);
          this.uploadLoading = false;
        }
      });
    },
    empty() {
      this.id = "";
      this.title = "";
      this.articleId = "";
      this.summary = "";
      this.fileList = [];
      this.imageId = 0;
      localStorage.removeItem("carouselPublishData");
    },
    fileChange(file, files) {
      this.fileList = [file];
      this.photoHide = true;
    },
    fileRemove() {
      this.photoHide = false;
    },
    handleRemove(uploadFile, uploadFiles) {
      console.log(uploadFile, uploadFiles);
    },
    handlePictureCardPreview(uploadFile) {
      this.dialogImageUrl = uploadFile.url;
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
    dataDestroy() {
      if (this.timer) {
        clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
      }
    },
    dateShow() {
      this.timer = setInterval(() => {
        this.dateFormat();
      }, 1000);
    },
    dateFormat() {
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
      this.time =
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
        seconds;
    },
  },
};
</script>

<style scoped>
.carouselPublish {
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
.flexLine {
  display: flex;
  width: 100%;
  align-items: center;
  color: #767676;
  font-size: 17px;
  margin-bottom: 20px;
}
.flexRow {
  display: flex;
  flex-direction: column;
  width: 100%;
  color: #767676;
  font-size: 17px;
  margin-bottom: 20px;
}
.tagText {
  margin-right: 5px;
}
.flexGrow {
  flex: 1;
}
.rowTextarea {
  margin-top: 10px;
}
.alignTop {
  align-items: flex-start;
}
.marginLeft {
  margin-left: 15px;
}
.actionBar {
  text-align: center;
}
.margin50 {
  margin: 0 50px;
}
</style>
