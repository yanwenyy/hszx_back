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
          accept="image/gif,image/jpeg,image/jpg,image/png"
          disabled
          action="">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
        </el-upload>
        <span style="color: #ccc">提示：格式支持JPG/PNG/GIF，大小200K以内</span>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="dataForm.title" clearable disabled placeholder="请输入标题" style="width:500px"></el-input>
      </el-form-item>
      <el-form-item prop="lecturerName" label="作者">
        <el-input v-model="dataForm.lecturerName" :disabled="true" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="行业" prop="tradeidName">
        <el-input v-model="dataForm.tradeidName" :disabled="true" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="dataForm.sort" disabled controls-position="right" label="排序"></el-input-number>
        <p style="color:#999">可填写数字如：“1”，数字越大排序越靠前</p>
      </el-form-item>
      <el-form-item label="解码图" prop="annexList">
        <el-upload
          style="width: 500px"
          :on-preview="handlePictureCardPreview"
          accept="image/gif,image/jpeg,image/jpg,image/png"
          action=""
          disabled
          :file-list="fileList">
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" append-to-body>
          <img style="max-width:100%" fit="contain" :src="dialogImageUrl" alt="">
        </el-dialog>
        <p style="color:#999">最多上传3张图片，点击图片名称即可查看</p>
      </el-form-item>
      <el-form-item label="创建时间" prop="creatTime">
        <el-input v-model="dataForm.creatTime" :disabled="true" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="ifShow">
        <el-input :value="dataForm.ifShow==0?'隐藏':'在线'" :disabled="true" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <div v-html="dataForm.content" style="border: 1px solid #ccc;padding:0 10px"></div>
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
    let validateImgList = (rule, value, callback) => {
      if (this.fileList.length == "" || this.fileList.length == undefined || this.fileList.length == null) {
        callback(new Error("请上传解码图"));
      } else {
        callback();
      }
    };
    return {
      dialogVisible:false,
      dialogImageUrl:'',
      imageUrl: '',
      fileList:[],
      dataForm:{
        coverUrl:'',
        ifPlatformAuthor:'1',
        id:parseInt(this.$route.query.id) || undefined,
        title:'',
        content:'',
        lecturer:'',
        tradeid:'',
        creatTime:'',
        title:'',
        sort:undefined,
        ifShow:'',
        decodePicture:'',
        annexList:[]
      }
    }
  },
  mounted(){
    //详情
    if( this.dataForm.id!=undefined) {
      this.$http({
        url: this.$http.adornUrl(`/biz/trprocess/info/${this.dataForm.id}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        this.dataForm=data.data
        this.imageUrl = 'http://'+data.data.coverUrl
        if (data.data.annexList.length != 0) {
          for (var i = 0; i < data.data.annexList.length; i++) {
            this.fileList.push({
              name: data.data.annexList[i].fileRealName,
              url: data.data.annexList[i].fileOriginalName
            })
          }
        }
      })
    }
  },
  methods:{
    handlePictureCardPreview(file) {
      if(file.response!=undefined&&file.response!=null&&file.response!=""){
        this.dialogImageUrl = 'http://'+file.response.url;
      }else{
        this.dialogImageUrl = 'http://'+file.url;
      }
      this.dialogVisible = true;
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
</style>
