<template>
  <div class="mod-policy">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">审核查看<el-button type="primary" style="margin-left:20px" size="small" @click="$router.push({ name: 'policy-imputation-view',query:{id:$route.query.policyId} })">查看在线内容</el-button></h2>
    <div>
      <el-form label-position="left" label-width="100px"  :model="dataForm" ref="dataForm" style="border:1px solid #ccc;padding-left:50px;padding-top:25px;margin-bottom:30px">
        <el-form-item label="政策ID" prop="id" style="display:inline-block">
          <el-input v-model="dataForm.id" :disabled="true" style="width:250px"></el-input>
        </el-form-item>
        <el-form-item label="申请人" prop="applyIdName" style="display:inline-block;margin-left:50px">
          <el-input v-model="dataForm.applyIdName" :disabled="true" style="width:250px"></el-input>
        </el-form-item>
        <el-form-item label="审核类型"style="display:inline-block">
          <el-input value="申请下线"  :disabled="true" style="width:250px"></el-input>
        </el-form-item>
        <el-form-item label="申请时间" prop="applyTime"  style="display:inline-block;margin-left:50px">
          <el-input v-model="dataForm.applyTime" :disabled="true" style="width:250px"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <el-form label-position="left" label-width="120px" :model="dataForm" ref="dataForm">
      <el-form-item label="下线原因" prop="createDate">
        <el-input type="textarea" v-model="dataForm.createDate" :disabled="true" style="width:500px"></el-input>
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
      delFlagShow:false,
      titleTxt:"新增",
      dataForm:{
        id:parseInt(this.$route.query.id) || undefined,
        applyTime:'',
        applyIdName:'',
        applyReason:''
      }
    }
  },
  mounted(){
    if( this.dataForm.id!=undefined) {
      this.$http({
        url: this.$http.adornUrl(`/biz/trpolicy/auditedOfflineInfo/${this.dataForm.id}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        this.dataForm.applyIdName=data.data.applyIdName
        this.dataForm.applyTime = data.data.applyTime
        this.dataForm.applyReason=data.data.applyReason
      })
    }
  },

  methods:{
    closePage:function () {
      this.removeTabHandle(this.$store.state.common.mainTabsActiveName)
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
