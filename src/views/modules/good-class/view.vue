<template>
  <div class="mod-policy">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">查看</h2>
    <el-form label-position="left" label-width="120px" :model="dataForm"  ref="dataForm">
      <el-form-item label="ID" prop="id">
        <el-input v-model="dataForm.id" :disabled="true" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="封面图" prop="coverUrl">
        <el-upload
          class="avatar-uploader"
          action=""
          accept="image/gif,image/jpeg,image/jpg,image/png"
          disabled
          :show-file-list="false">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-input type="text"  v-model="dataForm.coverUrl" style="padding: 0;margin: 0;height: 0;display: none"></el-input>
        <span style="color: #ccc">提示：格式支持JPG/PNG/GIF，大小200K以内</span>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="dataForm.title" disabled clearable placeholder="请输入标题" style="width:500px"></el-input>
      </el-form-item>
      <el-form-item prop="lecturerName" label="讲师">
        <el-input v-model="dataForm.lecturerName" disabled  style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="CC视频ID" prop="ccid">
        <el-input v-model="dataForm.ccid" disabled clearable style="width:500px"></el-input>
      </el-form-item>
      <el-form-item label="行业" >
        <el-input v-model="dataForm.tradeidName" disabled clearable style="width:220px"></el-input>
      </el-form-item>
      <el-form-item prop="ifFreeName" label="观看设置">
        <el-input v-model="dataForm.ifFreeName" disabled clearable style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="dataForm.sort" disabled controls-position="right" label="排序"></el-input-number>
        <p style="color:#999">可填写数字如：“1”，数字越大排序越靠前</p>
      </el-form-item>
      <el-form-item label="创建时间" prop="creatTime">
        <el-input v-model="dataForm.creatTime" :disabled="true" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="ifShow">
        <el-input :value="dataForm.ifShow==0?'隐藏':'在线'" :disabled="true" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="课程介绍" prop="introduce">
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
    let validateTax = (rule, value, callback) => {
      if (this.dataForm.taxS.length==0) {
        callback(new Error("税种不能为空"));
      } else {
        callback();
      }
    };
    return {
      headers: {
        token: this.$cookie.get('token')
      },
      imageUrl:'',
      dataForm:{
        ifPlatformAuthor:'1',
        id:parseInt(this.$route.query.id) || undefined,
        title:'',
        introduce:'',
        lecturerName:'',
        coverUrl:'',
        tradeidName:'',
        creatTime:'',
        title:'',
        sort:undefined,
        ifShow:'',
        ifFreeName:'',
        ccid:''
      }
    }
  },
  mounted(){
    //详情
    if( this.dataForm.id!=undefined) {
      this.$http({
        url: this.$http.adornUrl(`/biz/trgoodclass/info/${this.dataForm.id}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        this.dataForm.tradeidName=data.data.tradeidName
        this.dataForm.coverUrl=data.data.coverUrl
        this.imageUrl='http://'+data.data.coverUrl
        this.dataForm.ifFreeName=data.data.ifFreeName
        this.dataForm.title = data.data.title
        this.dataForm.sort = data.data.sort
        this.dataForm.lecturerName=data.data.lecturerName
        this.dataForm.ifPlatformAuthor=data.data.ifPlatformAuthor
        this.dataForm.creatTime = this.commonDate.formatTime('', '', data.data.creatTime)
        this.dataForm.introduce=data.data.introduce
        this.dataForm.ifShow=data.data.ifShow
        this.dataForm.ccid=data.data.ccid
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
