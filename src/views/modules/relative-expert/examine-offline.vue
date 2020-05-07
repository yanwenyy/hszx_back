<template>
  <div class="mod-policy">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">审核<el-button type="primary" style="margin-left:20px" size="small" @click="$router.push({ name: 'relative-expert-view',query:{id:$route.query.id} })">查看在线内容</el-button></h2>
    <div>
      <el-form label-position="left" label-width="100px"  :model="dataForm" ref="dataForm" style="border:1px solid #ccc;padding-left:50px;padding-top:25px;margin-bottom:30px">
        <el-form-item label="政策ID" prop="id" style="display:inline-block">
          <el-input v-model="dataForm.id" :disabled="true" style="width:250px"></el-input>
        </el-form-item>
        <el-form-item label="申请人" prop="applyName"  style="display:inline-block;margin-left:50px">
          <el-input v-model="dataForm.applyName" :disabled="true" style="width:250px"></el-input>
        </el-form-item>
        <el-form-item label="审核类型"  style="display:inline-block">
          <el-input value="申请下线"  :disabled="true" style="width:250px"></el-input>
        </el-form-item>
        <el-form-item label="申请时间" prop="applyTime"style="display:inline-block;margin-left:50px">
          <el-input v-model="dataForm.applyTime" :disabled="true" style="width:250px"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <el-form label-position="left" label-width="120px" :model="dataForm" ref="dataForm">
      <el-form-item label="下线原因" prop="auditReason">
        <el-input type="textarea" v-model="dataForm.auditReason" :disabled="true" style="width:500px"></el-input>
      </el-form-item>

      <el-form-item style="text-align: center;">
        <el-button type="primary" @click="dataFormSubmit()">审核通过</el-button>
        <el-button type="primary" @click="fail()">审核未通过</el-button>
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
      delFlagShow:false,
      titleTxt:"新增",
      dataForm:{
        id:parseInt(this.$route.query.id) || undefined,
        applyTime:'',
        applyName:'',
        auditReason:''
      }
    }
  },
  mounted(){
    if( this.dataForm.id!=undefined) {
      this.$http({
        url: this.$http.adornUrl(`/biz/trpolicyrelativeexpert/applyDownlineInfo`),
        method: 'get',
        params: this.$http.adornParams({expertId:this.dataForm.id})
      }).then(({data}) => {
        this.dataForm.applyTime=data.data[0].applyTime
        this.dataForm.applyName=data.data[0].applyName
        this.dataForm.auditReason=data.data[0].auditReason
      })
    }
  },

  methods:{
    closePage:function () {
      this.removeTabHandle(this.$store.state.common.mainTabsActiveName)
    },
    //审核未通过
    fail () {
      this.$prompt('请输入未通过原因，最少5个字最多输入100字', '审核未通过', {
        inputType:'textarea',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator:(val) => {
          return !(val.length < 5 || val.length > 100)
        },
        inputErrorMessage: '！保存失败，您未达到最少字数或超过最大字数'
      }).then(({ value }) => {
        this.$http({
          url: this.$http.adornUrl('/biz/trpolicyrelativeexpert/applyDownlineNoPass'),
          method: 'GET',
          params: this.$http.adornParams({'expertId':this.dataForm.id,'auditFailReason':value})
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
            if(data.message==undefined){
              this.$message.error(data.msg)
            }else{
              this.$message.error(data.message)
            }
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    },
    //提交表单
    dataFormSubmit () {
      this.$confirm(`您确定审核通过吗？`, ``, {
        confirmButtonText: `确定`,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl(''),
          method: 'post',
          data: this.$http.adornData('', false)
        }).then(({data}) => {
          if (data && data.code == 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              }
            })
          } else {
            if(data.message==undefined){
              this.$message.error(data.msg)
            }else{
              this.$message.error(data.message)
            }
          }
        })
      })
    }
  }
}
</script>
<style>
  .w-e-text,.w-e-text-container{
    min-height:400px !important;
    z-index: 1 !important;
  }
  .w-e-menu{
    z-index: 2 !important;
  }
</style>
