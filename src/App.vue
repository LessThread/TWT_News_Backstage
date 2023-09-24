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
        <!-- <div>
          <h3>更新日志 V0.2.4</h3>
          <li>更新时间 2023-8-28</li>
          <li>添加了编辑恢复功能,每2秒钟会自动保存一次</li>
          <li>添加日志页面(未实现)</li>
        </div> -->
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
        message: '2023-0912:修复了在二次编辑时可能会丢失供图信息的bug,如果还有其他情况请联系',
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
      if(localStorage.getItem("UpdateDate")!== '2023-0924'){
        localStorage.setItem("UpdateDate",'2023-0924');
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