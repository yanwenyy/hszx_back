<template>
  <div class="mod-policy">
    <!--<el-tabs type="border-card">
      <el-tab-pane>
        <span slot="label">逐条解读</span>-->
    <ul class="ul-tab-title">
      <li class="pack">逐条解读</li>
      <li @click="closePage();$router.push({ name: 'policy-unscramble-extend',query:{id:dataForm.policyId} })">延伸解读</li>
      <li @click="closePage();$router.push({ name: 'policy-unscramble-contrast',query:{id:dataForm.policyId} })">对比解读</li>
      <li @click="closePage();$router.push({ name: 'policy-unscramble-official',query:{id:dataForm.policyId} })">官方解读</li>
    </ul>
        <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">编辑</h2>
        <el-form label-position="right" label-width="100px" :model="dataForm" ref="dataForm">
          <div v-for="(listParts, index) in dataForm.listParts" v-model="dataForm.listParts" :key="reld">
            <h2 style="background: #45c2b5;line-height: 36px;color:#fff;padding-left: 10px;position: relative">Part {{index+1}}<el-form-item>
              <el-button type="danger" @click="removePart(listParts,dataForm.listParts[index].expertPart.id)" style="position: absolute;top:-36px;right:0">删除Part</el-button>
            </el-form-item></h2>
            <el-form-item>
              <template>
              </template>
            </el-form-item>
            <el-form-item label="政策原文" :prop="'content'+index">
              <UEditor :key="index+timer" :id='"editor"+index':index="index" :econtent="dataForm.listParts[index].expertPart.partContent" :modelname="'content'" @func="editorContents" ></UEditor>
            </el-form-item>
            <el-form-item label="解读" :prop="'resolve'+index">
              <UEditor :key="'resolve_'+index+timer" :index="index" :id='"resolve_editor"+index' :econtent="dataForm.listParts[index].expertPart.resolve" :modelname="'resolve'" @func="editorContents" ></UEditor>
            </el-form-item>
            <el-form-item label="音频">
              <div v-for="(expertPartVoices, voiceIndex) in dataForm.listParts[index].expertPartVoices" style="background: #eee;padding: 5px 0;margin-bottom: 10px ">
                <el-button type="danger" plain style="float: right;margin-right: 5px;z-index: 1;position: relative;" @click="removeVoice(index,expertPartVoices,dataForm.listParts[index].expertPartVoices[voiceIndex].id)">x 删除模块</el-button>
                <el-form-item style="margin: 5px 0 10px 0;color:#303133" label="CC播放ID"><el-input style="width:220px" v-model="dataForm.listParts[index].expertPartVoices[voiceIndex].realName"></el-input></el-form-item>
                <el-form-item style="margin: 5px 0 10px 0;color:#303133" label="音频标题"><el-input style="width:220px" v-model="dataForm.listParts[index].expertPartVoices[voiceIndex].title"></el-input></el-form-item>
              </div>
              <el-button @click="addVoice(index)" type="warning">新增音频</el-button>
            </el-form-item>
            <el-form-item label="视频" :prop="'video'+index">
              <div v-for="(expertPartVideos, videoIndex) in dataForm.listParts[index].expertPartVideos" style="background: #eee;padding: 5px 0;margin-bottom: 10px ">
                <el-button type="danger" plain style="float: right;margin-right: 5px;z-index: 1;position: relative;" @click="removeVideo(index,expertPartVideos,dataForm.listParts[index].expertPartVideos[videoIndex].id)">x 删除模块</el-button>
                <el-form-item style="margin: 5px 0 10px 0;color:#303133" label="CC播放ID"><el-input style="width:220px" v-model="dataForm.listParts[index].expertPartVideos[videoIndex].vid"></el-input></el-form-item>
                <el-form-item style="margin: 5px 0 10px 0;color:#303133" label="视频标题"><el-input style="width:220px" v-model="dataForm.listParts[index].expertPartVideos[videoIndex].title"></el-input></el-form-item>
                <el-form-item style="margin: 5px 0 10px 0;color:#303133" label="封面链接">
                  <el-input style="width:500px" v-model="dataForm.listParts[index].expertPartVideos[videoIndex].cover"></el-input>
                  <el-button plain @click="uploadCover()" @refreshData="getReld" placeholder="请上传封面，填写生成链接">添加封面</el-button>
                  <p style="color: #999;margin: 5px 0 0 0;padding: 0;line-height: 12px">注：点击添加封面按钮，进行封面上传，复制生成链接</p>
                </el-form-item>
              </div>
              <el-button @click="addVideo(index)" type="warning">新增视频</el-button>
            </el-form-item>
          </div>
            <el-button type="primary" @click="addPart()">新增Part</el-button>
          <div>
            <h2 style="background: #45c2b5;line-height: 36px;color:#fff;padding-left: 10px">政策背景</h2>
            <el-form-item prop="content">
              <template>
                <UEditor :contentUrl='"/biz/policyexpert/info/"' :id="'policyBack'" :index="0"  :modelname="'policyBack'" :val="dataForm.policyId" @func="editorContent"></UEditor>
              </template>
            </el-form-item>
            <el-form-item style="text-align: center;">
              <el-button type="primary" @click="dataFormSubmit()">保存</el-button>
              <el-button type="info" @click="closePage()">关闭</el-button>
            </el-form-item>
          </div>

        </el-form>
    <upload-cover v-if="uploadCoverVisible" ref="uploadCoverRef" @refreshData="getReld"></upload-cover>
  </div>
</template>
<script>
  import Vue from 'vue'
  import UEditor from '@/components/ueditor/ueditor.vue'
  import uploadCover from './upload-cover'
  import ElFormItem from "element-ui/packages/form/src/form-item";
  export default {
    components: {
      ElFormItem,
      uploadCover,
      UEditor
    },
      inject:['removeTabHandle'],
    data(){
      return {
        headers: {
          token: this.$cookie.get('token')
        },
        uploadCoverVisible:false,
        partIndex:0,
        timer:'',
        imageUrl:'',
        reld:'',
        dataForm:{
          policyId:parseInt(this.$route.query.id) ,
          id:undefined,
          content:'',
          listParts: [],
        },

      }
    },
    mounted(){
     /*if(location.href.indexOf("#reloaded")==-1){
        location.href=location.href+"#reloaded";
        location.reload();
      }*/
      if( this.dataForm.policyId!=undefined) {
        this.$http({
          url: this.$http.adornUrl(`/biz/policyexpert/info/${this.dataForm.policyId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if(data.data.policyId==null||data.data.policyId==0){
            data.data.policyId=this.dataForm.policyId
          }
          if(data.data.id==0){
            data.data.id=undefined
          }
          this.dataForm=data.data
          this.dataForm.content=data.data.content
          if(this.dataForm.listParts==null||this.dataForm.listParts==undefined){
            this.dataForm.listParts=[]
          }
        })
      }

    },
    methods:{
      //获取富文本内容
      editorContent(modelname,index,content){
        this.dataForm.content=content
      },
      uploadCover () {
        this.uploadCoverVisible = true
        this.$nextTick(() => {
          this.$refs.uploadCoverRef.init()
        })
      },
      getReld(){
        this.reld=new Date().getTime()
      },
      newD(){
        this.timer=new Date().getTime()
      },
      //push对应富文本内容
      editorContents:function(policy,partIndex,content){
        console.log(this.dataForm.listParts)
        if(policy=='content'){
          this.dataForm.listParts[partIndex].expertPart.partContent=content
        }else if(policy=='resolve'){
          this.dataForm.listParts[partIndex].expertPart.resolve=content
        }

      },
      //添加Part
      addPart:function(){
        this.dataForm.listParts.push({
          value: '',
          expertPart:{
            partContent:'',
            resolve:''
          },
          expertPartVoices:[],
          expertPartVideos:[],
          key: Date.now()
        });
      },
      //删除Part
      removePart:function(item,id){
        var index = this.dataForm.listParts.indexOf(item)
        if (index !== -1) {
          if(id!=undefined&&id!=null&&id!=""){
            var ids =[id]
            this.$confirm(`确定对该Part进行删除操作?`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$http({
                url: this.$http.adornUrl(`/biz/policyexpert/delete`),
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
      //添加音频
      addVoice:function(index){
        this.dataForm.listParts[index].expertPartVoices.push({
          realName: '',
          title:'',
          key: Date.now()
        });
      },
      //删除音频
      removeVoice:function(partIndex,item,id){
        var index = this.dataForm.listParts[partIndex].expertPartVoices.indexOf(item)
        if (index !== -1) {
          if(id!=undefined&&id!=null&&id!=""){
            var ids = [id]
            this.$confirm(`确定对该音频模块进行删除操作?`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$http({
                url: this.$http.adornUrl(`/biz/policyexpertpartvoice/delete`),
                method: 'POST',
                data: this.$http.adornData(ids, false)
              }).then(({data}) => {
                if (data && data.code == 200) {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500,
                    onClose: () => {
                      this.dataForm.listParts[partIndex].expertPartVoices.splice(index, 1)
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
            this.dataForm.listParts[partIndex].expertPartVoices.splice(index, 1)
          }

        }
      },
      //添加视频
      addVideo:function(index){
        this.dataForm.listParts[index].expertPartVideos.push({
          vid: '',
          title:'',
          cover:'',
          imageUrl:'',
          key: Date.now()
        });
      },
      //删除视频
      removeVideo:function(partIndex,item,id){
        var index = this.dataForm.listParts[partIndex].expertPartVideos.indexOf(item)
        if (index !== -1) {
          if(id!=undefined&&id!=null&&id!=""){
            var ids = [id]
            this.$confirm(`确定对该视频模块进行删除操作?`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$http({
                url: this.$http.adornUrl(`/biz/policyexpertpartvideo/delete`),
                method: 'POST',
                data: this.$http.adornData(ids, false)
              }).then(({data}) => {
                if (data && data.code == 200) {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500,
                    onClose: () => {
                      this.dataForm.listParts[partIndex].expertPartVideos.splice(index, 1)
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
            this.dataForm.listParts[partIndex].expertPartVideos.splice(index, 1)
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
              url: this.$http.adornUrl(`/biz/policyexpert/${!this.dataForm.id ? 'save' : 'update'}`),
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

