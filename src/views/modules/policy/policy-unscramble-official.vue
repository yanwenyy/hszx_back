<template>
  <div class="mod-policy">
    <!--<el-tabs type="border-card">
      <el-tab-pane>
        <span slot="label">逐条解读</span>-->
    <ul class="ul-tab-title">
      <li @click="closePage();$router.push({ name: 'policy-unscramble',query:{id:dataForm.policyId} })">逐条解读</li>
      <li @click="closePage();$router.push({ name: 'policy-unscramble-extend',query:{id:dataForm.policyId} })">延伸解读</li>
      <li @click="closePage();$router.push({ name: 'policy-unscramble-contrast',query:{id:dataForm.policyId} })">对比解读</li>
      <li class="pack">官方解读</li>
    </ul>
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">编辑</h2>
    <el-form label-position="right" label-width="100px" :model="dataForm" ref="dataForm">
        <h2 style="background: #45c2b5;line-height: 36px;color:#fff;padding-left: 10px">内容</h2>
        <el-form-item prop="content">
          <template>
            <UEditor :contentUrl='"/biz/policyofficial/info/"' :key="'official'"  :id='"official_editor"':index="0" :val="dataForm.policyId" :econtent="dataForm.content" :modelname="'official'" @func="editorContent" ></UEditor>
          </template>
        </el-form-item>
        <el-form-item style="text-align: center;">
          <el-button type="primary" @click="dataFormSubmit()">保存</el-button>
          <el-button type="info" @click="closePage()">关闭</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import Vue from 'vue'
  import UEditor from '@/components/ueditor/ueditor.vue'
  import ElFormItem from "element-ui/packages/form/src/form-item";
  export default {
    components: {
      ElFormItem,
      UEditor
    },
    inject:['removeTabHandle'],
    data(){
      return {
        headers: {
          token: this.$cookie.get('token')
        },
        dataForm:{
          policyId:parseInt(this.$route.query.id) || undefined,
          id:undefined,
          content:'',
        },

      }
    },
    mounted(){
      if( this.dataForm.policyId!=undefined) {
        this.$http({
          url: this.$http.adornUrl(`/biz/policyofficial/info/${this.dataForm.policyId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if(data.code==200&&data.data!=null){
            this.dataForm.content=data.data.content
            this.dataForm.id=data.data.id
          }
        })
      }
    },
    methods:{
      //获取富文本内容
      editorContent(modelname,index,content){
        this.dataForm.content=content
      },
      closePage:function () {
        this.removeTabHandle(this.$store.state.common.mainTabsActiveName)
      },
      //提交表单
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/biz/policyofficial/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData(this.dataForm)
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
<style>
  .w-e-text,.w-e-text-container{
    min-height:400px !important;
    z-index: 1 !important;
  }
  .w-e-menu{
    z-index: 2 !important;
  }
  .ul-tab-title{
    background: #f5f7fa;
    border-bottom: 1px solid #e4e7ed;
    padding-left: 0;
    height: 38px;
    cursor: pointer;
  }
  .ul-tab-title li{
    display: inline-block;
    line-height: 36px;
    width:100px;
    text-align: center;
    cursor: pointer;
    color: #909399;
  }
  .ul-tab-title li.pack{
    color:#409eff;
    border-bottom: 1px solid #fff;
    border-left: 1px solid #e4e7ed;
    border-right: 1px solid #e4e7ed;
    border-top: 1px solid #e4e7ed;
    background:#fff;
  }
  .ul-tab-title li:hover{
    color:#409eff;
  }
</style>

