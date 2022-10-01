<template>
  <div class="main">
    <MainHeader />
    <div class="content">
      <Navtree class="nav" />
      <!-- 临时守卫 -->
      <div class="TempkeyBox" v-show="!is">
        后台管理员密码
        <input type="passwo" v-model="Tempkey" placeholder="" @keyup.enter="proofreadKey(Tempkey)"/>
        <button @click="proofreadKey(Tempkey)" >登录</button>
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
  methods: {
    scrollTop() {
      this.$refs.screen.scrollTop = 0;
    },
    proofreadKey(Tempkey){
      console.log(Tempkey)
      if(Tempkey=="20000608")
      this.is=1;
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