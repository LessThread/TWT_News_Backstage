<template>
  <div class="publish">
    <p class="title">{{ pageTitle }}</p>
    <div class="flexLine">
      <p class="tagText">标题：</p>
      <el-input
        class="flexGrow"
        v-model="title"
        maxlength="50"
        placeholder="请输入新闻标题"
        show-word-limit
        type="text"
      />
    </div>
    <div class="flexLine">
      <p class="tagText">来源：</p>
      <el-input
        class="flexGrow"
        v-model="origin"
        maxlength="50"
        placeholder="请输入新闻来源"
        show-word-limit
        type="text"
      />
    </div>
    <div class="flexLine">
      <p class="tagText">供稿：</p>
      <el-input
        class="flexGrow"
        v-model="contributorName"
        maxlength="50"
        placeholder="请输入新闻供稿人"
        show-word-limit
        type="text"
      />
    </div>

    <div class="flexLine">
      <p class="tagText">供图：</p>
      <el-input
        class="flexGrow"
        v-model="photographerName"
        maxlength="50"
        placeholder="请输入新闻供图人"
        show-word-limit
        type="text"
      />
    </div>

    <div class="flexLine">
      <p class="tagText">审稿：</p>
      <el-input
        class="flexGrow"
        v-model="reviewerName"
        maxlength="50"
        placeholder="请输入新闻审稿人"
        show-word-limit
        type="text"
      />
    </div>
    <div class="flexLine">
      <p class="tagText">分类：</p>
      <el-radio-group v-model="categoryId">
        <el-radio :label="item.id" v-for="(item, i) in category" :key="i">{{
          item.name
        }}</el-radio>
      </el-radio-group>
    </div>
    <!-- <div class="flexLine">
      <p class="tagText">标签：</p>
      <el-tag
        v-for="tag in tagNameList"
        :key="tag"
        class="marginRight10"
        closable
        :disable-transitions="false"
        @close="handleClose(tag)"
      >
        {{ tag }}
      </el-tag>
      <el-input
        v-if="inputVisible"
        ref="InputRef"
        v-model="inputValue"
        class="width120"
        size="small"
        @keyup.enter="handleInputConfirm"
        @blur="handleInputConfirm"
      />
      <el-button
        v-else
        class="button-new-tag ml-1"
        size="small"
        @click="showInput"
      >
        + 添加标签
      </el-button>
    </div> -->
    <div class="flexLine">
      <p class="tagText">其他：</p>
      <el-checkbox-group v-model="status" :min="0" :max="1">
        <el-checkbox :label="1">置顶</el-checkbox>
        <el-checkbox :label="2">隐藏</el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="flexLine alignTop">
      <p class="tagText">添加封面图：</p>
      <el-upload
        :class="{ 'hide-upload-btn': photoHide_1 }"
        :limit="1"
        :file-list="fileList_1"
        accept="image/*"
        :auto-upload="false"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-change="fileChange_1"
        :on-remove="fileRemove_1"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>
      <p class="tagText marginLeft">（新闻的封面图）</p>
    </div>
    <div class="flexLine alignTop">
      <p class="tagText">添加横幅图：</p>
      <el-upload
        :class="{ 'hide-upload-btn': photoHide_2 }"
        :limit="1"
        :file-list="fileList_2"
        accept="image/*"
        :auto-upload="false"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-change="fileChange_2"
        :on-remove="fileRemove_2"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>
      <p class="tagText marginLeft">（新闻详情页上方的横版大图）</p>
    </div>
    <div class="flexRow">
      <p class="tagText">新闻内容：</p>

      <div>
        <el-button type="primary" size="large" @click="changeEditor">切换为{{MdOrText?"富文本":"MD"}}编辑器</el-button>
      </div>

      <div v-show="MdOrText">
        <v-md-editor
        v-model="text"
        height="32rem"
        :toolbar="toolbar"
        :disabled-menus="[]"
        @upload-image="handleUploadImage"
        left-toolbar="h bold italic strikethrough quote | ul ol table hr | customToolbar1 customToolbar2 customToolbar3 customToolbar4 customToolbar5 | link image code | undo redo clear | save export import"
      >
      </v-md-editor>
      </div>
      
      <div v-show="!MdOrText">
      <div style="border: 1px solid #ccc">
        <Toolbar
          style="border-bottom: 1px solid #ccc"
          :editor="editorRef"
          :defaultConfig="toolbarConfig"
          :mode="mode"
        />
        <Editor
          style="height: 400px; overflow-y: hidden;"
          v-model="text"
          :defaultConfig="editorConfig"
          :mode="mode"
          @onCreated="handleCreated"
        />
      </div>
      <div style="margin-top: 10px;display: flex">
        <textarea
          v-model="text"
          readonly
          style="width: 50%; height: 200px; outline: none"
        ></textarea>
        <div style="margin-top: 10px ;width: 50%; height: 200px; outline: none" >
          <p v-html="text"></p>
        </div>
      </div>
    </div>

    </div>
    <div class="actionBar">
      <el-button
        class="confirmBtn margin50"
        @click="confirm"
        :loading="uploadLoading"
        >{{ pageTitle === "编辑新闻" ? "确认" : "发布" }}</el-button
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
    <el-dialog v-model="centerDialogVisible" title="确认" center>
      <span class="bodySpan">{{
        pageTitle === "编辑新闻"
          ? "您确认要编辑这条新闻吗"
          : "您确认要发布这条新闻吗"
      }}</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            class="cancelBtn marginRight40 dialogBtn"
            @click="centerDialogVisible = false"
            >取消</el-button
          >
          <el-button
            class="confirmBtn dialogBtn"
            @click="
              centerDialogVisible = false;
              confirmPost();
            "
            >{{ pageTitle === "编辑新闻" ? "确认" : "发布" }}</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getCategory, uploadImg, postNews, updateNews } from "@/api/user";
import { BASE_URL } from "@/utils/request/config";

import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
//import { IEditorConfig} from '@wangeditor/editor'



export default {
  components: { Editor, Toolbar },
  setup() {
    // 编辑器实例，必须用 shallowRef
    const editorRef = shallowRef()
    const editorConfig = {MENU_CONF: {}}

    // 内容 HTML
    const valueHtml = ref('<p>hello</p>')

    // 模拟 ajax 异步获取内容
    onMounted(() => {
        setTimeout(() => {
            valueHtml.value = '<p>Ajax 异步</p>'
        }, 1500)
    })

    const toolbarConfig = {}
    
    editorConfig.MENU_CONF['uploadImage'] = {
      server: 'https://news.twt.edu.cn/imgbed/upload',
      fieldName: 'img',
      customInsert(res, insertFn) {
        let surl="https://news.twt.edu.cn/imgbed/download/"+res.result;
        // 从 res 中找到 url alt href ，然后插入图片
        insertFn(surl,"","")
    },
}


    // 组件销毁时，也及时销毁编辑器
    onBeforeUnmount(() => {
        const editor = editorRef.value
        if (editor == null) return
        editor.destroy()
    })

    const handleCreated = (editor) => {
      editorRef.value = editor // 记录 editor 实例，重要！
    }

    //editorConfig.MENU_CONF['uploadImage'] = {}

    return {
      editorRef,
      valueHtml,
      mode: 'default', // 或 'simple'
      toolbarConfig,
      editorConfig,
      handleCreated
    };

  },
  

  data() {
    return {
      MdOrText:0,
      photographerName:"",
      photoHide_1: false,
      photoHide_2: false,
      page: 1,
      releaseTime: "",
      centerDialogVisible: false,
      text: "",
      tagNameList: [],
      pageTitle: "发布新闻",
      uploadLoading: false,
      id: "",
      status: [],
      categoryId: "",
      title: "",
      articleId: "",
      time: "",
      summary: "",
      reviewerName: "",
      contributorName: "",
      origin: "",
      category: [],
      dialogVisible: false,
      dialogImageUrl: "",
      fileList: [],
      fileList_1: [],
      fileList_2: [],
      imageId: 0,
      imageId_1: 0,
      imageId_2: 0,
      inputValue: "",
      inputVisible: false,
      toolbar: {
        customToolbar1: {
          title: "居左",
          icon: "v-md-icon-left",
          action(editor) {
            editor.insert(function (selected) {
              const prefix = "::: align-left";
              const suffix = ":::";
              const placeholder = "请输入文本";
              const content = selected || placeholder;

              return {
                text: `${prefix}\n${content}\n${suffix}`,
                selected: content,
              };
            });
          },
        },
        customToolbar2: {
          title: "居中",
          icon: "v-md-icon-center",
          action(editor) {
            editor.insert(function (selected) {
              const prefix = "::: align-center";
              const suffix = ":::";
              const placeholder = "请输入文本";
              const content = selected || placeholder;

              return {
                text: `${prefix}\n${content}\n${suffix}`,
                selected: content,
              };
            });
          },
        },
        customToolbar3: {
          title: "居右",
          icon: "v-md-icon-right",
          action(editor) {
            editor.insert(function (selected) {
              const prefix = "::: align-right";
              const suffix = ":::";
              const placeholder = "请输入文本";
              const content = selected || placeholder;

              return {
                text: `${prefix}\n${content}\n${suffix}`,
                selected: content,
              };
            });
          },
        },
        customToolbar4: {
        title: '插入一个空格',
        icon: 'v-md-icon-tip',
        action(editor) {
          editor.insert(function (selected) {
            const prefix = '(((';
            const suffix = ')))';
            const placeholder = '&emsp;';
            const content = selected || placeholder;

            return {
              text: `${content}`,
              selected: content,
            };
          });
        },
      },
      customToolbar5: {
        title: '换行',
        icon: 'v-md-icon-arrow-down',
        action(editor) {
          editor.insert(function (selected) {
            const prefix = '(((';
            const suffix = ')))';
            const placeholder = '<br>';
            const content = selected || placeholder;

            return {
              text: `${content}`,
              selected: content,
            };
          });
        },
      },
      },
    };
  },
  mounted() {
    this.dateShow();
  },
  created() {
    window.addEventListener("beforeunload", (e) => this.beforeunloadFn(e));
    this.dateFormat();
    this.getCategory();
    this.setInitData();
  },
  beforeDestroy() {
    window.removeEventListener("beforeunload", (e) => this.beforeunloadFn(e));
    this.dataDestroy();
  },
  beforeRouteLeave(to, from, next) {
    if (!this.id)
      localStorage.setItem("publishData", JSON.stringify(this.$data));
    next();
  },
  watch: {
    $route() {
      this.setInitData();
      this.getCategory();
    },
  },
  methods: {
    changeEditor(){
      this.MdOrText=!this.MdOrText;
    },
    beforeunloadFn() {
      if (!this.id)
        localStorage.setItem("publishData", JSON.stringify(this.$data));
    },
    handleUploadImage(event, insertImage, files) {
      // 拿到 files 之后上传到文件服务器，然后向编辑框中插入对应的内容
      console.log(files);
      let formData = new FormData();
      formData.append("img", files[0]);
      uploadImg(formData).then(({ code: code, result: res }) => {
        if (code === 0) {
          insertImage({
            url: BASE_URL + "/imgbed/download/" + res,
            desc: "图片描述",
            width: "auto",
            height: "auto",
          });
        }
      });
    },
    handleClose(tag) {
      this.tagNameList.splice(this.tagNameList.indexOf(tag), 1);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.InputRef.focus();
      });
    },
    handleInputConfirm() {
      if (this.inputValue) {
        this.tagNameList.push(this.inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    setInitData() {
      if (this.$route.query.id) {
        this.id = parseInt(this.$route.query.id) || "";
        this.page = parseInt(this.$route.query.page) || "";
        this.title = this.$route.query.title || "";
        this.origin = this.$route.query.origin || "";
        this.contributorName = this.$route.query.contributorName || "";
        this.reviewerName = this.$route.query.reviewerName || "";
        this.categoryId = parseInt(this.$route.query.categoryId) || "";
        this.photographerName = this.$route.query.photographerName || "";
        this.tagNameList = this.$route.query.tagNameList || [];
        this.status = parseInt(this.$route.query.status)
          ? [parseInt(this.$route.query.status)]
          : [];
        this.imageId_1 = this.$route.query.coverImageId || 0;
        this.imageId_2 = this.$route.query.bannerImageId || 0;
        this.text = this.$route.query.text || "";
        this.releaseTime = this.$route.query.releaseTime || "";
        this.pageTitle = parseInt(this.$route.query.id)
          ? "编辑新闻"
          : "发布新闻";
      } else {
        const preData = localStorage.getItem("publishData");
        if (preData) {
          Object.assign(this.$data, JSON.parse(preData));
          localStorage.removeItem("publishData");
        }
      }
    },
    confirm() {
      if (!this.title) {
        ElMessage.warning("请输入新闻标题");
        return;
      }
      if (!this.origin) {
        ElMessage.warning("请输入新闻来源");
        return;
      }
      if (!this.contributorName) {
        ElMessage.warning("请输入新闻供稿人");
        return;
      }
      if (!this.reviewerName) {
        ElMessage.warning("请输入新闻审稿人");
        return;
      }
      if (!this.categoryId) {
        ElMessage.warning("请选择新闻分类");
        return;
      }
      if (this.text.length === 0) {
        ElMessage.warning("请输入新闻内容");
        return;
      }
      if (this.fileList_1.length === 0 && this.imageId_1 === 0) {
        ElMessage.warning("请添加新闻封面图");
        return;
      }
      if (this.fileList_2.length === 0 && this.imageId_2 === 0) {
        ElMessage.warning("请添加新闻横幅图");
        return;
      }
      this.centerDialogVisible = true;
    },
    confirmPost() {
      this.uploadLoading = true;
      let promiseArr = [];
      if (this.imageId_1 === 0) {
        let formData = new FormData();
        formData.append("img", this.fileList_1[0].raw);
        promiseArr.push(uploadImg(formData));
      }
      if (this.imageId_2 === 0) {
        let formData = new FormData();
        formData.append("img", this.fileList_2[0].raw);
        promiseArr.push(uploadImg(formData));
      }
      Promise.all(promiseArr).then((res) => {
        if (res.length === 0) {
          this.postNews(false);
        } else {
          if (this.imageId_1 === 0 && this.imageId_2 === 0) {
            this.imageId_1 = res[0].result;
            this.imageId_2 = res[1].result;
          } else if (this.imageId_1 === 0) {
            this.imageId_1 = res[0].result;
          } else {
            this.imageId_2 = res[0].result;
          }
          this.postNews(true);
          this.photographerName="";

          this.photoHide_2=false;
          this.photoHide_1=false;
        }
      });
    },
    postNews(val) {
      if (val) {
        postNews({
          title: this.title,
          origin: this.origin,
          contributorName: this.contributorName+"$"+this.photographerName,
          reviewerName: this.reviewerName,
          status: this.status.length === 0 ? 0 : this.status[0],
          tagNameList: this.tagNameList,
          categoryId: this.categoryId,
          coverImageId: this.imageId_1,
          bannerImageId: this.imageId_2,
          text: this.text,
        })
          .then(({ code: code, message: msg }) => {
            if (code === 0) {
              this.empty();
              this.getCategory();
              this.uploadLoading = false;
              ElMessage.success("发布成功");
            } else {
              ElMessage.error(msg);
              this.uploadLoading = false;
            }
          })
          .catch(() => {
            ElMessage.error("发布失败");
            this.uploadLoading = false;
          });
      } else {
        updateNews({
          id: this.id,
          title: this.title,
          origin: this.origin,
          contributorName: this.contributorName,
          reviewerName: this.reviewerName,
          status: this.status.length === 0 ? 0 : this.status[0],
          tagNameList: this.tagNameList,
          categoryId: this.categoryId,
          coverImageId: this.imageId_1,
          bannerImageId: this.imageId_2,
          text: this.text,
          releaseTime: this.releaseTime,
        })
          .then(({ code: code, message: msg }) => {
            if (code === 0) {
              this.empty();
              this.getCategory();
              this.uploadLoading = false;
              ElMessage.success("编辑成功");
              this.$router.push({
                path: "/news",
                query: {
                  page: this.page,
                },
              });
            } else {
              ElMessage.error(msg);
              this.uploadLoading = false;
            }
          })
          .catch(() => {
            ElMessage.error("编辑失败");
            this.uploadLoading = false;
          });
      }
    },
    empty() {
      this.title = "";
      this.origin = "";
      this.contributorName = "";
      this.reviewerName = "";
      this.categoryId = "";
      this.tagNameList = [];
      this.status = [];
      this.fileList_1 = [];
      this.fileList_2 = [];
      this.imageId_1 = 0;
      this.imageId_2 = 0;
      this.text = "";
    },
    fileChange(file, files) {
      this.fileList = [file];
    },
    fileChange_1(file, files) {
      this.fileList_1 = [file];
      this.photoHide_1 = true;
    },
    fileChange_2(file, files) {
      this.fileList_2 = [file];
      this.photoHide_2 = true;
    },
    fileRemove_1() {
      this.photoHide_1 = false;
    },
    fileRemove_2() {
      this.photoHide_2 = false;
    },
    handleRemove(uploadFile, uploadFiles) {
      console.log(uploadFile, uploadFiles);
    },
    handlePictureCardPreview(uploadFile) {
      this.dialogImageUrl = uploadFile.url;
      this.dialogVisible = true;
    },
    getCategory() {
      getCategory().then(({ code: code, result: res }) => {
        if (code === 0) {
          this.category = res;
          this.category.sort((a, b) => a.id - b.id);
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
.publish {
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
.marginRight10 {
  margin-right: 10px;
}
.width120 {
  width: 120px;
}
.v-md-editor {
  margin-top: 10px;
}
.bodySpan {
  margin: 0 100px;
  color: #2a2a2a;
  font-size: 24px;
}
.marginRight40 {
  margin-right: 40px;
}
</style>
