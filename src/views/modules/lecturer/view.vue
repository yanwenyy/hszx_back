<template>
  <div class="mod-policy">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">查看</h2>
    <el-form label-position="left" label-width="120px" :model="dataForm" ref="dataForm">
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="dataForm.phone" :disabled="true" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="dataForm.userName" :disabled="true" clearable placeholder="请输入用户名" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="真实姓名" prop="realName">
        <el-input v-model="dataForm.realName" :disabled="true" clearable placeholder="请输入真实姓名" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="个人介绍" prop="introduce">
        <el-input
          style="width:500px"
          type="textarea"
          :rows="4"
          :disabled="true"
          placeholder="请输入个人介绍"
          v-model="dataForm.introduce"
          maxlength="500"
          @input="introduceInput"
          show-word-limit="true"
          >
        </el-input>
        <span style="color:#999;">{{introduceNum}}/500</span>
      </el-form-item>

      <el-form-item label="认证时间" prop="certificationTime">
        <el-input v-model="dataForm.certificationTime" :disabled="true" clearable style="width:220px"></el-input>
      </el-form-item>
      <el-form-item style="text-align: center;">
        <el-button type="info" @click="closePage()">关闭</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import UEditor from '@/components/ueditor/ueditor.vue'
  import ElButton from "element-ui/packages/button/src/button";
export default {
  inject:['removeTabHandle'],
  components: {
    ElButton,
    UEditor},
  data(){
    return {
      tradeList:[],
      introduceNum:0,
      dataForm:{
        phone:parseInt(this.$route.query.phone),
        realName:'',
        uuid:this.$route.query.uuid || undefined,
        userName:'',
        introduce:'',
        certificationTime:''
      }
    }
  },
  mounted(){
    //详情
    if( this.$route.query.uuid!=undefined) {
      this.$http({
        url: this.$http.adornUrl(`/biz/user/expertOrLecturerInfo`),
        method: 'get',
        params: this.$http.adornParams({uuid:this.dataForm.uuid})
      }).then(({data}) => {
        this.dataForm.phone =data.data.phone
        this.dataForm.userName = data.data.username
        this.dataForm.realName=data.data.realname
        this.dataForm.introduce=data.data.introduce
        this.dataForm.certificationTime=data.data.certificationTime
        if(data.data.introduce!=""&&data.data.introduce!=null){
          this.introduceInput()
        }

      })
    }
  },
  methods:{
    introduceInput(){
      this.introduceNum =this.dataForm.introduce.length
    },
    closePage:function () {
      this.removeTabHandle(this.$store.state.common.mainTabsActiveName)
    }
  }
}
</script>

