<template>
  <div class="news" ref="news">

    <el-dialog
    v-model="dialogVisible_delete"
    title="请确认"
    width="30%"
    :before-close="handleClose"
  >
      <span>{{dialogMessage}}</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible_delete = false;dialogVisible_delete = 0;showMessage('提示','操作已取消');diglog_item=null;">取消</el-button>
          <el-button type="primary" @click="dialogVisible_delete = false;toDelete(diglog_item);">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
    v-model="dialogVisible_change"
    title="请确认"
    width="30%"
    :before-close="handleClose"
  >
      <span>{{dialogMessage}}</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible_change = false;dialogVisible_change = 0;showMessage('提示','操作已取消')">取消</el-button>
          <el-button type="primary" @click="dialogVisible_change = false;toChangeStatue(diglog_item.item,diglog_item.val)">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>


    <p class="title">管理新闻</p>
    <div class="outerItem" v-for="(item, i) in newsList[page - 1]" :key="i">
      <div class="actions">
        <div>
          <div class="actionBtn" title="编辑" @click="toEdit(item)">
            <img src="../assets/edit.svg" />
          </div>
        </div>
        <div>
          <div class="actionBtn" title="删除" @click="readyDelete(item)">
            <img src="../assets/delete.svg" />
          </div>
        </div>
        <div>
          <div
            class="actionBtn"
            :title="item.status === 1 ? '取消置顶' : '置顶'"
            @click="readyChangeStatue(item, 1)"
          >
            <img
              :src="
                item.status === 1
                  ? require('top_cancel.svg')
                  : require('top.svg')
              "
            />
          </div>
        </div>
        <div>
          <div
            class="actionBtn"
            :title="item.status === 2 ? '取消隐藏' : '隐藏'"
            @click="toChangeStatue(item, 2)"
          >
            <img
              :src="
                item.status === 2
                  ? require('eye.svg')
                  : require('eye_cancel.svg')
              "
            />
          </div>
        </div>
      </div>
      <div class="newsItem" @click="toEdit(item)">
        <p class="newsTitle">
          <span>{{
            item.status === 1 ? "【置顶】" : item.status === 2 ? "【隐藏】" : ""
          }}</span>
          {{ item.title }}
        </p>
        <p class="newsSummary">新闻摘要</p>
        <div class="newsInfo">
          <p>
            {{
              item.releaseTime.split(" ")[0].split("-").join("/") +
              " " +
              item.releaseTime.split(" ")[1]
            }}
          </p>
          <p>{{ getCategoryName(item.categoryId) }}</p>
          <div></div>
          <p>文/{{ item.contributorName }}</p>
          <div></div>
          <p>审/{{ item.reviewerName }}</p>
          <div></div>
          <p>{{ item.viewsNumber }}浏览</p>
          <div></div>
          <p>ID：{{ item.id }}</p>
        </div>
        <el-image
          :src="BASE_URL + '/imgbed/download/' + item.coverImageId"
          class="newsCover"
          ><template #placeholder>
            <div class="image-slot">加载中<span class="dot">...</span></div>
          </template>
          <template #error>
            <div class="image-slot">
              <el-icon><Picture /></el-icon>
            </div>
          </template>
        </el-image>
      </div>
    </div>
    <el-pagination
      background
      layout="pager"
      :page-size="5"
      :total="total"
      hide-on-single-page
      @current-change="changePage"
    />
  </div>
</template>

<script>
import {
  getNews,
  getCategoryName,
  deleteNews,
  changeNewsStatue,
  addLog
} from "@/api/user";
import { BASE_URL } from "@/utils/request/config";
import require from "@/utils/pub-use";
export default {
  data() {
    return {
      page: 1,
      total: 0,
      newsList: [[]],
      categoryMap: {},
      BASE_URL: BASE_URL,
      dialogVisible_delete:0,
      dialogVisible_change:0,
      dialogMessage:"",
      dialogState_delete:0,
      dialogState_change:0,
      diglog_item:null,
    };
  },
  methods: {
    toEdit(item) {
      this.$router.push({
        path: "/publish",
        query: {
          id: item.id,
          page: this.page,
          title: item.title,
          origin: item.origin,
          contributorName: item.contributorName.slice(0,item.contributorName.indexOf("$")),
          photographerName: item.contributorName.slice(item.contributorName.indexOf("$")+1),
          reviewerName: item.reviewerName,
          categoryId: item.categoryId,
          tagNameList: item.tagNameList,
          status: item.status,
          coverImageId: item.coverImageId,
          bannerImageId: item.bannerImageId,
          releaseTime: item.releaseTime,
          text: item.text,
        },
      });
    },
    readyDelete(item){
      this.dialogState_delete = 0;
      this.dialogVisible_delete = true;
      this.dialogMessage = "真的要 删除 吗？";
      this.diglog_item = item;
    },
    readyChangeStatue(item,val){
      this.dialogState_change = 0;
      this.dialogVisible_change = true;
      this.dialogMessage = "真的要 改变置顶状态 吗？"; 
      this.diglog_item = {item,val};
    },
    showMessage(title,message){
            ElNotification({
              title: title,
              message: message,
            })
    },

    toDelete(item) {
      deleteNews({ id: item.id })
      .then(({ code: code, message: msg }) => {
        if (code === 0) {
          addLog(item.id,"删除 ")
          ElMessage.success("删除新闻成功");
          this.getNews();
        } else {
          ElMessage.error(msg);
        }
      });
    },
    toChangeStatue(item, val) {
      changeNewsStatue({
        id: item.id,
        status: item.status === 0 ? val : item.status === val ? 0 : val,
      }).then(({ code: code, message: msg }) => {
        if (code === 0) {
          ElMessage.success(
            item.status === 0
              ? val === 1
                ? "置顶新闻成功"
                : "隐藏新闻成功"
              : item.status === 1
              ? val === 1
                ? "取消置顶成功"
                : "隐藏新闻成功"
              : val === 1
              ? "置顶新闻成功"
              : "取消隐藏成功"
          );
          this.getNews();
        } else {
          ElMessage.error(msg);
        }
      });
    },
    require(url) {
      return require(url);
    },
    getCategoryName(id) {
      if (this.categoryMap[id]) {
        return this.categoryMap[id];
      } else {
        return getCategoryName(id).then(({ result: res }) => {
          this.categoryMap[id] = res;
          return res;
        });
      }
    },
    changePage(val) {
      this.page = val;
      this.$parent.$parent.scrollTop();
    },
    getNews() {
      getNews().then(({ code: code, result: res, message: msg }) => {
        if (code === 0) {
          this.newsList = [[]];
          this.total = res.length;
          for (let i = 0; i < this.total; i++) {
            if (i % 5 === 0) this.newsList[parseInt(i / 5)] = [];
            this.newsList[parseInt(i / 5)][i % 5] = res[res.length - i - 1];
          }
          this.$forceUpdate();
        } else {
          ElMessage.error(msg);
        }
      });
    },
    setInitData() {
      this.page = this.$route.query.page || 1;
    },
  },
  created() {
    this.getNews();
    this.setInitData();
  },
  watch: {
    $route() {
      this.setInitData();
    },
  },
};
</script>

<style scoped>
.news {
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
.newsItem {
  cursor: pointer;
  padding: 20px;
  background-color: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 16px;
  margin-bottom: 30px;
  position: relative;
  overflow: hidden;
  width: 100%;
  transition: all 0.5s;
}
.outerItem:hover .newsItem {
  width: calc(100% - 190px);
}
.outerItem {
  position: relative;
}
.actions {
  position: absolute;
  width: 190px;
  height: 100%;
  right: 0;
  top: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
}
.actionBtn {
  width: 64px;
  height: 64px;
  background-color: #fafafa;
  border: 1px solid #f0f0f0;
  margin: 0 auto;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.actionBtn img {
  width: 24px;
  height: 24px;
}
.newsTitle {
  font-size: 21px;
  color: #2a2a2a;
  font-weight: 700;
  margin-bottom: 20px;
}
.newsTitle span {
  color: #00a0e9;
}
.newsSummary {
  font-size: 16px;
  color: #767676;
  margin-bottom: 20px;
}
.newsInfo {
  font-size: 16px;
  color: #767676;
  display: grid;
  grid-template-columns: 180px 110px 20px 110px 20px 110px 20px 110px 20px auto;
}
.newsCover {
  position: absolute;
  top: 0;
  width: 220px;
  right: 0;
  height: 100%;
}
.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 14px;
}
.dot {
  animation: dot 2s infinite steps(3, start);
  overflow: hidden;
}
</style>
