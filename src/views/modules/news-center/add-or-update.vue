<template>
  <div class="mod-policy">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">{{titleTxt}}</h2>
    <el-form label-position="left" label-width="120px" :model="dataForm" :rules="dataRule" ref="dataForm">
      <el-form-item label="ID" prop="id" v-if="addHide==true">
        <el-input v-model="dataForm.id" :disabled="true" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="封面版式" prop="coverType">
        <el-select
          v-model="dataForm.coverType"
          clearable
          disabled
          @change="showImg($event)"
          placeholder="请选择封面版式" style="width: 220px">
          <el-option v-for="item in coverTypeList"
                     :label="item.name"
                     :value="item.id"
                     :key="item.id" >
          </el-option>
        </el-select>
        <div style="margin-top: 20px">
        <el-popover
          placement="right"
          width="630"
          height="500"
          style=""
          trigger="click">
          <h3 style="text-align: center">请选择新闻封面样式</h3>
          <div style="display: inline-block;width: 300px;text-align: center;">
            <img src="~@/assets/img/style1.png" width="290"></img>
            <el-radio v-model="dataForm.coverType" label="1" style="margin: 15px 0">样式1</el-radio>
          </div>
          <div style="display: inline-block;width: 300px;text-align: center">
            <img src="~@/assets/img/style1.png" width="290"></img>
            <el-radio v-model="dataForm.coverType" label="2" style="margin: 15px 0">样式2</el-radio>
          </div>
          <div style="display: inline-block;width: 300px;text-align: center">
            <img src="~@/assets/img/style3.png" width="290"></img>
            <el-radio v-model="dataForm.coverType" label="3" style="margin: 15px 0">样式3</el-radio>
          </div>
          <el-button slot="reference">选择样式</el-button>
        </el-popover>
        </div>
      </el-form-item>
      <el-form-item label="封面图" prop="coverUrl" v-show="this.dataForm.coverType==1||this.dataForm.coverType==3">
        <el-upload
          :class="'avatar-uploader avatar-uploader'+this.dataForm.coverType"
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
      <el-form-item label="属性" prop="attributeid">
        <el-select
          v-model="dataForm.attributeid"
          clearable
          @change="getAttribute($event)"
          placeholder="请选择属性" style="width: 220px">
          <el-option v-for="item in attributeList"
                     :label="item.name"
                     :value="item.id"
                     :key="item.id" >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="行业"  prop="tradeid" v-show="attributeShow">
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
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="dataForm.sort" :disabled="addHide" controls-position="right" label="排序"></el-input-number>
        <p style="color:#999">可填写数字如：“1”，数字越大排序越靠前</p>
      </el-form-item>
      <el-form-item prop="lecturer" label="作者">
        <div style="margin-bottom:20px">
          <el-radio  v-model="dataForm.ifPlatformAuthor" @change="dataForm.lecturer=''" label="1" style="margin-right:20px">选择平台作者</el-radio>
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

        <el-radio v-model="dataForm.ifPlatformAuthor" label="0" @change="dataForm.lecturer=''" style="margin-right:6px">填写非平台作者</el-radio>
        <el-input v-model="dataForm.lecturer" v-show='dataForm.ifPlatformAuthor==0' style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="创建时间" prop="creatTime" v-if="addHide==true">
        <el-input v-model="dataForm.creatTime" :disabled="true" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="ifShow" v-if="addHide==true">
        <el-input :value="dataForm.ifShow==0?'隐藏':'在线'" :disabled="true" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item prop="contentType" label="添加内容方式">
        <el-radio  v-model="dataForm.contentType" label="1" style="margin-right:20px">公众号链接</el-radio>
        <el-radio v-model="dataForm.contentType" label="2" style="margin-right:6px">富文本添加内容</el-radio>
      </el-form-item>
      <el-form-item prop="url" label="公众号链接" v-show="this.dataForm.contentType==1">
        <el-input v-model="dataForm.url" style="width:500px"></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="content" v-if="this.dataForm.contentType==2">
        <template>
          <UEditor :key="'editor_news-center'" :val="dataForm.id" :url="'/biz/trnewscenter/info/'" :id='"editor_news-center"':index="0" :econtent="dataForm.content"  @func="editorContent" ></UEditor>
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
    let validateTrade = (rule, value, callback) => {
      // 当行业为空值且为必填时，抛出错误，反之通过校验
      if (value == "" && this.isHaveTo) {
        callback(new Error("行业不能为空"));
      } else {
        callback();
      }
    };
    let validateImg = (rule, value, callback) => {
      // 当行业为空值且为必填时，抛出错误，反之通过校验
      if (value == "" && this.isHaveToImg) {
        callback(new Error("封面图不能为空"));
      } else {
        callback();
      }
    };
    let validateContent = (rule, value, callback) => {
      // 当行业为空值且为必填时，抛出错误，反之通过校验
      if (value == "" && this.isHaveContent) {
        callback(new Error("内容不能为空"));
      } else {
        callback();
      }
    };
    let validateUrl = (rule, value, callback) => {
      // 当行业为空值且为必填时，抛出错误，反之通过校验
      if (value == "" && this.isHaveUrl) {
        callback(new Error("公众号链接不能为空"));
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
      attributeShow:false,
      coverTypeList:[{id:'1',name:'样式1'},{id:'2',name:'样式2'},{id:'3',name:'样式3'}],
      userList:[],
      tradeList:[],
      attributeList:[],
      imageUrl: '',
      ifTradeNews:undefined,
      dataForm:{
        ifPlatformAuthor:'1',
        id:parseInt(this.$route.query.id) || undefined,
        coverType:'',
        title:'',
        content:'',
        lecturer:'',
        attributeid:'',
        tradeid:'',
        creatTime:'',
        title:'',
        coverUrl:'',
        contentType:'',
        url:'',
        sort:undefined,
        ifShow:''
      },
      dataRule:{
        coverUrl:[
          { validator:validateImg, trigger: 'blur' }
        ],
        coverType:[
          { required: true, message: '请选择封面版式', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '标题不能为空', trigger: 'blur' }
        ],
        lecturer:[
          { required: true, message: '作者不能为空', trigger: 'blur' }
        ],
        tradeid:[
          { validator: validateTrade, trigger: 'blur' }
        ],
        attributeid:[
          { required: true, message: '属性不能为空', trigger: 'blur' }
        ],
        contentType:[
          { required: true, message: '请选择添加内容方式', trigger: 'blur' }
        ],
        content:[
          {validator: validateContent, trigger: 'blur'}
        ],
        url:[
          {validator: validateUrl, trigger: 'blur'}
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
      params: this.$http.adornParams({'identity':1})
    }).then(({data}) => {
      var dataList=[]
      for( var i=0;i<data.length;i++){
        dataList.push(data[i]);
      }
      this.userList = dataList
    })
    //属性
    this.$http({
      url: this.$http.adornUrl('/biz/attribute/attributeList'),
      method: 'get',
      params: this.$http.adornParams({module:3})
    }).then(({data}) => {
      var dataList=[]
      for( var i=0;i<data.data.length;i++){
        dataList.push(data.data[i]);
      }
      this.attributeList = dataList
    })
    //详情
    if( this.dataForm.id!=undefined) {
      this.$http({
        url: this.$http.adornUrl(`/biz/trnewscenter/info/${this.dataForm.id}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        this.titleTxt="编辑"
        this.addHide=true
        this.dataForm.tradeid=data.data.tradeid
        this.dataForm.attributeid=data.data.attributeid
        if(data.data.attributeName=='行业新闻'){
          this.attributeShow=true
        }
        this.ifTradeNews=1
        this.dataForm.title = data.data.title
        this.dataForm.sort = data.data.sort
        this.dataForm.lecturer=data.data.lecturer
        this.dataForm.ifPlatformAuthor=data.data.ifPlatformAuthor
        this.dataForm.creatTime = this.commonDate.formatTime('', '', data.data.creatTime)
        this.dataForm.ifShow=data.data.ifShow
        this.dataForm.coverType=data.data.coverType
        if(this.dataForm.coverType!=2){
          this.dataForm.coverUrl=data.data.coverUrl
          this.imageUrl = 'http://'+data.data.coverUrl
        }
        this.dataForm.contentType=data.data.contentType
        if(this.dataForm.contentType==2){
          this.dataForm.content=data.data.content
        }else{
          this.dataForm.url=data.data.url
        }
      })
    }
  },
  computed: {
    isHaveTo: function() {
      if(this.dataForm.attributeid!=""){
        let resultArr = this.attributeList.filter((item)=>{
          return item.id === this.dataForm.attributeid
        });
        if(resultArr[0].name=='行业新闻'){
          return true
        }
      }
      return false
    },
    isHaveToImg:function () {
      if(this.dataForm.coverType!=2){
        return true
      }
      return false
    },
    isHaveContent:function () {
      if(this.dataForm.contentType==2){
        return true
      }
      return false
    },
    isHaveUrl:function () {
      if(this.dataForm.contentType==1){
        return true
      }
      return false
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
    showImg(e){

    },
    getAttribute(e){
      let resultArr = this.attributeList.filter((item)=>{
        return item.id === e
      });
      if(resultArr[0].name=='行业新闻'){
        this.ifTradeNews=1
        this.attributeShow=true
      }else{
        this.ifTradeNews=undefined
        this.attributeShow=false
      }
    },
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
            url: this.$http.adornUrl(`/biz/trnewscenter/${!this.dataForm.id ? 'save' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'id': this.dataForm.id || undefined,
              'ifPlatformAuthor':this.dataForm.ifPlatformAuthor,
              'lecturer':this.dataForm.lecturer,
              'title': this.dataForm.title,
              'tradeid': this.dataForm.tradeid || undefined,
              'attributeid': this.dataForm.attributeid,
              'sort':this.dataForm.sort || undefined,
              'coverType':this.dataForm.coverType,
              'coverUrl':this.dataForm.coverUrl || undefined,
              'contentType':this.dataForm.contentType,
              'url':this.dataForm.url || undefined,
              'content':this.dataForm.content || undefined,
              'ifTradeNews':this.ifTradeNews
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
  .w-e-text,.w-e-text-container{
    min-height:400px !important;
    z-index: 1 !important;
  }
  .w-e-menu{
    z-index: 2 !important;
  }
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
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .avatar-uploader1  .avatar-uploader-icon{
    width: 130px;
    height: 100px;
    line-height: 100px;
  }
  .avatar-uploader1  .avatar{
    width: 130px;
    height: 100px;
  }
  .avatar-uploader3  .avatar-uploader-icon{
     width: 300px;
     height: 100px;
     line-height: 100px;
   }
  .avatar-uploader3  .avatar{
    width: 300px;
    height: 100px;
  }
</style>
