<template>
  <div class="mod-policy">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">{{titleTxt}}</h2>
    <el-form label-position="left" label-width="120px" :model="dataForm" :rules="dataRule" ref="dataForm">
      <el-form-item label="ID" prop="id" v-if="addHide==true">
        <el-input v-model="dataForm.id" :disabled="true" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="封面图" prop="coverUrl">
        <el-upload
          class="avatar-uploader"
          :headers="headers"
          accept="image/gif,image/jpeg,image/jpg,image/png"
          :action="UploadUrl()"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-input type="text"  v-model="dataForm.coverUrl" style="padding: 0;margin: 0;height: 0;display: none"></el-input>
        <span style="color: #ccc">提示：格式支持JPG/PNG/GIF，大小200K以内</span>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="dataForm.title" clearable placeholder="请输入标题" style="width:500px"></el-input>
      </el-form-item>
      <el-form-item prop="lecturer" label="讲师">
        <div style="margin-bottom:20px">
          <el-radio  v-model="dataForm.ifPlatformAuthor" @change="dataForm.lecturer=''" label="1" style="margin-right:20px">选择平台讲师</el-radio>
          <el-select
            v-model="dataForm.lecturer"
            clearable
            v-show='dataForm.ifPlatformAuthor==1'
            style="width: 220px">
            <el-option v-for="item in userList"
                       :label="item.realname"
                       :value="item.uuid"
                       :key="item.uuid">
            </el-option>
          </el-select>
        </div>
        <el-radio v-model="dataForm.ifPlatformAuthor" @change="dataForm.lecturer=''" label="0" style="margin-right:6px">填写非平台讲师</el-radio>
        <el-input v-model="dataForm.lecturer" v-show='dataForm.ifPlatformAuthor==0' style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="CC视频ID" prop="ccid">
        <el-input v-model="dataForm.ccid" clearable style="width:500px"></el-input>
      </el-form-item>
      <el-form-item label="行业" prop="tradeid">
        <el-select
          v-model="dataForm.tradeid"
          clearable
          placeholder="请选择行业" style="width: 220px">
          <el-option v-for="item in tradeList"
                     :label="item.tradeName"
                     :value="item.tradeId"
                     :key="item.tradeId" >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="ifFree" label="观看设置">
        <el-radio  v-model="dataForm.ifFree" label="0" style="margin-right:20px">免费</el-radio>
        <el-radio v-model="dataForm.ifFree" label="1" style="margin-right:6px">会员</el-radio>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="dataForm.sort" :disabled="addHide" controls-position="right" label="排序"></el-input-number>
        <p style="color:#999">可填写数字如：“1”，数字越大排序越靠前</p>
      </el-form-item>
      <el-form-item label="创建时间" prop="creatTime" v-if="addHide==true">
        <el-input v-model="dataForm.creatTime" :disabled="true" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="ifShow" v-if="addHide==true">
        <el-input :value="dataForm.ifShow==0?'隐藏':'在线'" :disabled="true" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="课程介绍" prop="introduce">
        <template>
          <UEditor :contentUrl='"/biz/trgoodclass/info/"' :key="'editor_good-class'" :modelname="'good-class'" :val="dataForm.id" :url="'/biz/trgoodclass/info/'" :id='"editor_good-class"':index="0" :econtent="dataForm.introduce"  @func="editorContent" ></UEditor>
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
      titleTxt:"新增",
      addHide:false,
      userList:[],
      tradeList:[],
      attributeList:[],
      imageUrl:'',
      dataForm:{
        ifPlatformAuthor:'1',
        id:parseInt(this.$route.query.id) || undefined,
        title:'',
        introduce:'',
        lecturer:'',
        coverUrl:'',
        tradeid:'',
        creatTime:'',
        title:'',
        sort:undefined,
        ifShow:'',
        ifFree:'',
        ccid:''
      },
      dataRule:{
        ifFree: [
          { required: true, message: '请选择观看设置', trigger: 'blur' }
        ],
        ccid: [
          { required: true, message: 'CC视频ID不能为空', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '标题不能为空', trigger: 'blur' }
        ],
        lecturer:[
          { required: true, message: '讲师不能为空', trigger: 'blur' }
        ],
        tradeid:[
          { required: true, message: '行业不能为空', trigger: 'blur' }
        ],
        coverUrl:[
          { required: true, message: '封面图不能为空', trigger: 'blur' }
        ],
        introduce:[
          {required: true, message: '课程介绍不能为空', trigger: 'blur'}
        ]
      }
    }
  },
  mounted(){
    //行业
    this.$http({
      url: this.$http.adornUrl('/biz/trade2/trade2ModelList'),
      method: 'get',
      params: this.$http.adornData()
    }).then(({data}) => {
      var dataList=[]
      for( var i=0;i<data.data.length;i++){
        dataList.push(data.data[i]);
      }
      this.tradeList = dataList
    })
    //作者
    this.$http({
      url: this.$http.adornUrl('/biz/user/getIdentityList'),
      method: 'get',
      params: this.$http.adornParams({'identity':2})
    }).then(({data}) => {
      var dataList=[]
      for( var i=0;i<data.length;i++){
        dataList.push(data[i]);
      }
      this.userList = dataList
    })
    //详情
    if( this.dataForm.id!=undefined) {
      this.$http({
        url: this.$http.adornUrl(`/biz/trgoodclass/info/${this.dataForm.id}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        this.titleTxt="编辑"
        this.addHide=true
        this.dataForm.tradeid=data.data.tradeid
        this.dataForm.coverUrl=data.data.coverUrl
        this.imageUrl='http://'+data.data.coverUrl
        this.dataForm.ifFree=data.data.ifFree
        this.dataForm.title = data.data.title
        this.dataForm.sort = data.data.sort
        this.dataForm.lecturer=data.data.lecturer
        this.dataForm.ifPlatformAuthor=data.data.ifPlatformAuthor
        this.dataForm.creatTime = this.commonDate.formatTime('', '', data.data.creatTime)
        this.dataForm.introduce=data.data.introduce
        this.dataForm.ifShow=data.data.ifShow
        this.dataForm.ccid=data.data.ccid
      })
    }
  },
  methods:{
    UploadUrl:function(){
      return this.$http.adornUrl(`/sys/oss/upload`)
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.dataForm.coverUrl=res.url
    },
    beforeAvatarUpload(file) {
      const isLt200KB = file.size / 1024 <200;
      if (!isLt200KB) {
        this.$message.error('上传图片大小不能超过 200KB!');
      }
      return isLt200KB;
    },
    //获取富文本内容
    editorContent(modelname,index,content){
      this.dataForm.introduce=content
    },
    closePage:function () {
      this.removeTabHandle(this.$store.state.common.mainTabsActiveName)
    },
    //提交表单
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
          if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/biz/trgoodclass/${!this.dataForm.id ? 'save' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'id': this.dataForm.id || undefined,
              'ifPlatformAuthor':this.dataForm.ifPlatformAuthor,
              'lecturer':this.dataForm.lecturer,
              'title': this.dataForm.title,
              'tradeid': this.dataForm.tradeid,
              'coverUrl': this.dataForm.coverUrl,
              'introduce':this.dataForm.introduce,
              'sort':this.dataForm.sort || undefined,
              'ifFree':this.dataForm.ifFree,
              'ccid':this.dataForm.ccid
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
