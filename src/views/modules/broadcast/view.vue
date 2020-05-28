<template>
  <div class="mod-policy">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">查看</h2>
    <el-form label-position="left" label-width="120px" :model="dataForm" ref="dataForm">
      <el-form-item label="ID" prop="id">
        <el-input v-model="dataForm.id" :disabled="true" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="封面图" prop="coverUrl">
        <el-upload
          class="avatar-uploader"
          action=""
          disabled="">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
        </el-upload>
      </el-form-item>
      <el-form-item label="讲师照片" prop="lecturerUrl">
        <el-upload
          class="avatar-uploader avatar-uploader1"
          action=""
          disabled="">
          <img v-if="imageUrl1" :src="imageUrl1" class="avatar avatar1">
        </el-upload>
      </el-form-item>
      <el-form-item label="直播路径照片" prop="pathUrl">
        <el-upload
          class="avatar-uploader avatar-uploader1"
          action=""
          disabled="">
          <img v-if="imageUrl2" :src="imageUrl2" class="avatar avatar1">
        </el-upload>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="dataForm.title" disabled clearable placeholder="请输入标题" style="width:500px"></el-input>
      </el-form-item>
      <el-form-item prop="platformAuthorName" label="讲师">
        <el-input v-model="dataForm.platformAuthorName" disabled style="width:220px"></el-input>
      </el-form-item>
      <el-form-item prop="tradeName" label="行业">
        <el-input v-model="dataForm.tradeName" disabled style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="直播时间设置">
        <el-input v-model="dataForm.broadcastTime" disabled style="width:220px"></el-input>
      </el-form-item>
      <el-form-item prop="status" label="直播状态">
        <el-input v-show="dataForm.status==1" value="预告" disabled style="width:220px"></el-input>
        <el-input v-show="dataForm.status==2" value="直播中" disabled style="width:220px"></el-input>
        <el-input v-show="dataForm.status==3" value="直播结束" disabled style="width:220px"></el-input>
        <el-input v-show="dataForm.status==4" value="回放" disabled style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="CC视频ID" prop="ccid" v-if="dataForm.status==4">
        <el-input v-model="dataForm.ccid" disabled clearable style="width:500px"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="dataForm.sort" disabled controls-position="right" label="排序"></el-input-number>
        <p style="color:#999">可填写数字如：“1”，数字越大排序越靠前</p>
      </el-form-item>
      <el-form-item label="创建时间" prop="creatTime">
        <el-input v-model="dataForm.creatTime" :disabled="true" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="ifShow" >
        <el-input :value="dataForm.ifShow==0?'隐藏':'在线'" :disabled="true" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="直播介绍" prop="introduce">
        <div v-html="dataForm.introduce" style="border: 1px solid #ccc;padding:0 10px"></div>
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
      imageUrl:'',
      imageUrl1:'',
      imageUrl2:'',
      dataForm:{
        platformAuthorName:'',
        id:parseInt(this.$route.query.id) || undefined,
        title:'',
        introduce:'',
        tradeName:'',
        creatTime:'',
        title:'',
        sort:undefined,
        ifShow:'',
        status:'1',
        ccid:'',
        broadcastTime:'',
      }
    }
  },
  mounted(){
    //详情
    if( this.dataForm.id!=undefined) {
      this.$http({
        url: this.$http.adornUrl(`/biz/trbroadcast/info/${this.dataForm.id}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        this.dataForm.tradeName=data.data.tradeName
        this.imageUrl='http://'+data.data.coverUrl
        this.imageUrl1='http://'+data.data.lecturerUrl
        this.imageUrl2='http://'+data.data.pathUrl
        this.dataForm.status=data.data.status
        this.dataForm.title = data.data.title
        this.dataForm.sort = data.data.sort
        this.dataForm.platformAuthorName=data.data.platformAuthorName
        this.dataForm.creatTime = this.commonDate.formatTime('', '', data.data.creatTime)
        this.dataForm.introduce=data.data.introduce
        this.dataForm.ifShow=data.data.ifShow
        this.dataForm.ccid=data.data.ccid
        this.dataForm.broadcastTime=data.data.broadcastTime
      })
    }
  },
  methods:{
    showTime(e){
      var Hours=new Date(e).getHours(),min=new Date(e).getMinutes()
      if(new Date(e).getHours()<10){
        Hours='0'+new Date(e).getHours()
      }
      if(new Date(e).getMinutes()<10){
        min='0'+new Date(e).getMinutes()
      }
      return Hours+":"+min
    },

    //获取富文本内容
    editorContent(modelname,index,content){
      this.dataForm.introduce=content
    },
    closePage:function () {
      this.removeTabHandle(this.$store.state.common.mainTabsActiveName)
    }
  }
}
</script>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 320px;
    height: 140px;
    line-height: 140px;
    text-align: center;
  }
  .avatar {
    width: 320px;
    height: 140px;
    display: block;
  }
  .avatar-uploader1 .avatar-uploader-icon {
    width: 115px;
    height: 140px;
    line-height: 140px;
  }
  .avatar-uploader1 .avatar {
    width: 115px;
    height: 140px;
    display: block;
  }
</style>
