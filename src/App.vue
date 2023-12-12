<template>
  <div class="main">
    <MainHeader />
    <div class="content">
      <Navtree class="nav" />

      <!-- 临时守卫 -->
      <div class="TempkeyBox" v-show="!is">
        后台管理员密码
        <input type="password"  v-model="Tempkey" placeholder="" @keyup.enter="proofreadKey(Tempkey)"/>
        <button @click="proofreadKey(Tempkey)" >确认</button>
      </div> 
    <!-- 临时守卫 -->

      <div ref="screen" class="screen" v-show="is">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>


<script>
import Navtree from "@/components/Navtree.vue";
import MainHeader from "@/components/MainHeader.vue";
export default {
  setup(){
    const UpdateMsg = () => {
      ElNotification({
        title: '后台已更新',
        message: '2023-1213:修复图片上传大小问题(现在可以上传5MB的图片),上传视频功能将在后续更新',
        type: 'info',
        duration:0
      })
    };

    return{
      UpdateMsg
    }
  },
  data() {
    return {
      is:0,
      Tempkey:"",
    };
  },
  components: {
    Navtree,
    MainHeader,
  },
  created(){
      console.log("isPassword")
      let isPassword=localStorage.getItem("password");
      console.log("isPassword")
      console.log(isPassword);
      if(isPassword==1){
        this.is=1
      }
      if(localStorage.getItem("UpdateDate")!== '2023-1213'){
        localStorage.setItem("UpdateDate",'2023-1213');
        this.UpdateMsg();
      }
    },
  methods: {
    scrollTop() {
      this.$refs.screen.scrollTop = 0;
    },
    proofreadKey(Tempkey){
      if(Tempkey=="20000608")
      {
        this.is=1;
        localStorage.setItem("password",1);
      }
      
    }

  },
};
</script>


<style scoped>
.main {
  min-height: 100vh;
  background-color: #f8f8f8;
}
.screen {
  flex: 1;
  background-color: #f8f8f8;
  overflow: overlay; /*auto*/
  padding: 30px;
  height: calc(100vh - 86px);
}
.content {
  display: flex;
}
</style>


<style scoped>
  .TempkeyBox{
    position: absolute;
    left: 40%;
    top:30%;
  }
</style>