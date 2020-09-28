<template>
  <div class="mod-policy">
    <!-- <el-tabs type="border-card">
       <el-tab-pane>
         <span slot="label">逐条解读</span>-->
    <ul class="ul-tab-title">
      <li @click="closePage();$router.push({ name: 'policy-unscramble',query:{id:dataForm.policyId} })">逐条解读</li>
      <li @click="closePage();$router.push({ name: 'policy-unscramble-extend',query:{id:dataForm.policyId} })">延伸解读</li>
      <li class="pack">对比解读</li>
      <li @click="closePage();$router.push({ name: 'policy-unscramble-official',query:{id:dataForm.policyId} })">官方解读</li>
    </ul>
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">编辑</h2>
    <el-form label-position="right" label-width="100px" :model="dataForm" ref="dataForm">
      <div v-for="(listParts, index) in dataForm.listParts" v-model="dataForm.listParts" :key="reld">
        <h2 style="background: #45c2b5;line-height: 36px;color:#fff;padding-left: 10px;position: relative">模块 {{index+1}}<el-form-item>
          <el-button type="danger" @click="removePart(listParts,dataForm.listParts[index].id)" style="position: absolute;top:-36px;right:0">删除模块</el-button>
        </el-form-item></h2>
        <el-form-item>
          <template>
          </template>
        </el-form-item>
        <el-form-item label="内容" :prop="'content'+index">
          <UEditor :key="'contrast_'+index+timer"  :id='"contrast_editor"+index' :index="index" :econtent="dataForm.listParts[index].content" :modelname="'content'" @func="editorContent" ></UEditor>
        </el-form-item>
        <el-form-item label="相关政策">
          <div v-for="(relativePolicys, policysIndex) in dataForm.listParts[index].relativePolicys">
            <el-button type="danger" plain style="float: right;margin-right: 5px;z-index: 1;position: relative;" @click="removePolicys(index,relativePolicys,dataForm.listParts[index].relativePolicys[policysIndex].policyDepthId,dataForm.listParts[index].relativePolicys[policysIndex].policyId)">x 删除模块</el-button>
            <el-input style="width:220px;padding-left: 20px" v-model="dataForm.listParts[index].relativePolicys[policysIndex].jId"></el-input>
            <el-button type="primary" @click="policySearch(index,policysIndex)">搜索</el-button>
            <div style="background: #eee;padding: 5px 0;margin-bottom: 10px ;margin-top: 10px">
              <el-form-item style="margin: 5px 0 10px 0;color:#303133" label="政策ID"><el-input style="width:220px;" :disabled="true" v-model="dataForm.listParts[index].relativePolicys[policysIndex].policyId"></el-input></el-form-item>
              <el-form-item style="margin: 5px 0 10px 0;color:#303133" label="政策标题"><el-input style="width:220px;" :disabled="true" v-model="dataForm.listParts[index].relativePolicys[policysIndex].title"></el-input></el-form-item>
              <el-form-item style="margin: 5px 0 10px 0;color:#303133" label="文件号"><el-input style="width:220px;" :disabled="true" v-model="dataForm.listParts[index].relativePolicys[policysIndex].fileNum"></el-input></el-form-item>
            </div>
          </div>
          <el-button @click="addPolicys(index)" type="warning">添加相关政策</el-button>
        </el-form-item>
      </div>
      <el-button type="primary" @click="addPart()">新增模块</el-button>
      <el-form-item style="text-align: center;margin-top: 50px" v-if="dataForm.listParts.length!=0">
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
  import ElButton from "element-ui/packages/button/src/button";
  export default {
    components: {
      ElButton,
      ElFormItem,
      UEditor
    },
    inject:['removeTabHandle'],
    data(){
      return {
        headers: {
          token: this.$cookie.get('token')
        },
        partIndex:0,
        timer:'',
        reld:'',
        dataForm:{
          id:'',
          policyId:this.$route.query.id,
          listParts: [],
        },

      }
    },
    mounted(){
      if( this.dataForm.policyId!=undefined) {
        this.$http({
          url: this.$http.adornUrl(`/biz/policydepth/info/compare/${this.dataForm.policyId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.dataForm.listParts=data.data

          if(data.data.length==0){
            this.dataForm.id=undefined
          }else{
            this.dataForm.id=data.data[0].id
          }
        })
      }
    },
    methods:{
      policySearch(index,policysIndex){
        var val=this.dataForm.listParts[index].relativePolicys[policysIndex].jId
        if(val!=""){

          this.$http({
            url: this.$http.adornUrl(`/biz/policy/info/${val}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.dataForm.listParts[index].relativePolicys[policysIndex].fileNum=data.data.fileNum
            this.dataForm.listParts[index].relativePolicys[policysIndex].title=data.data.title
            this.dataForm.listParts[index].relativePolicys[policysIndex].policyId=data.data.id
            this.dataForm.listParts[index].relativePolicyIds.push(data.data.id)
          })
        }else{
          this.$message.error('请填写相关政策，再进行搜索')
        }

      },
      getReld(){
        this.reld=new Date().getTime()
      },
      newD(){
        this.timer=new Date().getTime()
      },
      //push对应富文本内容
      editorContent:function(p,partIndex,content){
        console.log(partIndex)
        this.dataForm.listParts[partIndex].content=content
      },
      //添加Part
      addPart:function(){
        this.dataForm.listParts.push({
          type:'2',
          content:'',
          policyId:this.dataForm.policyId,
          relativePolicys:[],
          relativePolicyIds:[],
          key: Date.now()
        });
      },
      //删除Part
      removePart:function(item,id){
        var index = this.dataForm.listParts.indexOf(item)
        if (index !== -1) {
          if(id!=undefined&&id!=null&&id!=""){
            var ids =[id]
            this.$confirm(`确定对该模块进行删除操作?`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$http({
                url: this.$http.adornUrl(`biz/policydepth/delete`),
                method: 'POST',
                data: this.$http.adornData(ids, false)
              }).then(({data}) => {
                if (data && data.code == 200) {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500,
                    onClose: () => {
                      this.dataForm.listParts.splice(index, 1);
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
          }else{
            this.dataForm.listParts.splice(index, 1);
          }
        }
        this.newD()
        //console.log(this.dataForm.listParts)
      },
      //添加相关政策
      addPolicys:function(index){
        this.dataForm.listParts[index].relativePolicys.push({
          jId:'',
          policyId:'',
          fileNum:'',
          title:''
        });
      },
      //删除相关政策
      removePolicys:function(partIndex,item,id,policyId){
        var index = this.dataForm.listParts[partIndex].relativePolicys.indexOf(item)
        if (index !== -1) {
          var selId=this.dataForm.listParts[partIndex].relativePolicys[index].policyId
          var selIndex=this.dataForm.listParts[partIndex].relativePolicyIds.indexOf(selId)
          if(id!=undefined&&id!=null&&id!=""){
            this.$confirm(`确定对该相关政策进行删除操作?`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$http({
                url: this.$http.adornUrl(`/biz/policydepthrelative/delete`),
                method: 'POST',
                data: this.$http.adornData({
                  'policyDepthId':id,
                  "relativePolicyId":policyId
                })
              }).then(({data}) => {
                if (data && data.code == 200) {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500,
                    onClose: () => {
                      this.dataForm.listParts[partIndex].relativePolicys.splice(index, 1)
                      this.dataForm.listParts[partIndex].relativePolicyIds.splice(selIndex,1)
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
          }else{
            this.dataForm.listParts[partIndex].relativePolicys.splice(index, 1)
            this.dataForm.listParts[partIndex].relativePolicyIds.splice(selIndex,1)
          }
        }
      },
      closePage:function () {
        this.removeTabHandle(this.$store.state.common.mainTabsActiveName)
      },
      //提交表单
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/biz/policydepth/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.dataForm.listParts
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

