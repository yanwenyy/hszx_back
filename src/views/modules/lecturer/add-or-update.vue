<template>
  <div class="mod-policy">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">{{titleTxt}}</h2>
    <el-form label-position="left" label-width="120px" :model="dataForm" :rules="dataRule" ref="dataForm">
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="dataForm.phone" :disabled="true" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="dataForm.userName" clearable placeholder="请输入用户名" style="width:500px"></el-input>
      </el-form-item>
      <el-form-item label="真实姓名" prop="realName">
        <el-input v-model="dataForm.realName" clearable placeholder="请输入真实姓名" style="width:500px"></el-input>
      </el-form-item>
      <el-form-item label="个人介绍" prop="introduce">
        <el-input
          style="width:500px"
          type="textarea"
          :rows="4"
          placeholder="请输入个人介绍"
          v-model="dataForm.introduce"
          maxlength="500"
          @input="introduceInput"
          show-word-limit="true"
          >
        </el-input>
        <span style="color:#999;">{{introduceNum}}/500</span>
      </el-form-item>

      <el-form-item style="text-align: center;">
        <el-button type="primary" @click="dataFormSubmit()">保存</el-button>
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
      titleTxt:"新增",
      tradeList:[],
      introduceNum:0,
      dataForm:{
        phone:parseInt(this.$route.query.phone),
        realName:'',
        uuid:this.$route.query.uuid || undefined,
        id:this.$route.query.id || undefined,
        userName:'',
        introduce:''
      },
      dataRule:{
        phone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        realName:[
          { required: true, message: '真实姓名不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  mounted(){
    if( this.dataForm.id!=undefined){
      this.$http({
        url: this.$http.adornUrl(`/biz/user/lecturerUserOne`),
        method: 'get',
        params: this.$http.adornParams({phone:this.dataForm.phone})
      }).then((data) => {
        this.dataForm.userName = data.data.data.username
        this.dataForm.realName=data.data.data.realname
        this.dataForm.uuid=data.data.data.uuid
      })
    }
    //详情
    if( this.$route.query.uuid!=undefined) {
      this.$http({
        url: this.$http.adornUrl(`/biz/user/expertOrLecturerInfo`),
        method: 'get',
        params: this.$http.adornParams({uuid:this.dataForm.uuid})
      }).then(({data}) => {
        this.titleTxt="编辑"
        this.dataForm.userName = data.data.username
        this.dataForm.realName=data.data.realname
        this.dataForm.introduce=data.data.introduce
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
    },
    //提交表单
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
          if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/biz/user/${!this.$route.query.uuid ? 'addLecturer' : 'updateExpertAndLecturer'}`),
            method: 'get',
            params: this.$http.adornParams({
              'uuid': this.dataForm.uuid || undefined,
              'phone':this.dataForm.phone,
              'realName':this.dataForm.realName,
              'userName': this.dataForm.userName,
              'introduce':this.dataForm.introduce || undefined
            })
          }).then(({data}) => {
            if (data && data.code == 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.closePage()
                }
              })

            } else {
              this.$message.error(data.msg)
            }
          })
        }
      })
    }
  }
}
</script>

