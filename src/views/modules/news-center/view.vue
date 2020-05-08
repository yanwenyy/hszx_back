<template>
  <div class="mod-policy">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">查看</h2>
    <el-form label-position="left" label-width="120px" :model="dataForm"  ref="dataForm">
      <el-form-item label="ID" prop="id">
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
      </el-form-item>
      <el-form-item label="封面图" prop="coverUrl" v-show="this.dataForm.coverType==1||this.dataForm.coverType==3">
        <el-upload
          :class="'avatar-uploader avatar-uploader'+this.dataForm.coverType"
          disabled
          accept="image/gif,image/jpeg,image/jpg,image/png"
          action=""
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
      <el-form-item label="属性" prop="attributeid">
        <el-select
          v-model="dataForm.attributeid"
          clearable
          disabled
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
          disabled
          placeholder="请选择行业" style="width: 220px">
          <el-option v-for="item in tradeList"
                     :label="item.tradeName"
                     :value="item.tradeId"
                     :key="item.tradeId" >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="dataForm.sort" disabled controls-position="right" label="排序"></el-input-number>
        <p style="color:#999">可填写数字如：“1”，数字越大排序越靠前</p>
      </el-form-item>
      <el-form-item prop="lecturer" label="作者">
        <el-input v-model="dataForm.platformAuthorName" disabled style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="创建时间" prop="creatTime">
        <el-input v-model="dataForm.creatTime" :disabled="true" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="ifShow">
        <el-input :value="dataForm.ifShow==0?'隐藏':'在线'" :disabled="true" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item prop="contentType" label="添加内容方式">
        <el-radio  v-model="dataForm.contentType" disabled label="1" style="margin-right:20px">公众号链接</el-radio>
        <el-radio v-model="dataForm.contentType" disabled label="2" style="margin-right:6px">富文本添加内容</el-radio>
      </el-form-item>
      <el-form-item prop="url" label="公众号链接" v-show="this.dataForm.contentType==1">
        <el-input v-model="dataForm.url" disabled style="width:500px"></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="content" v-if="this.dataForm.contentType==2">
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
    return {
      attributeShow:false,
      userList:[],
      tradeList:[],
      coverTypeList:[{id:'1',name:'样式1'},{id:'2',name:'样式2'},{id:'3',name:'样式3'}],
      attributeList:[],
      imageUrl: '',
      dataForm:{
        id:parseInt(this.$route.query.id) || undefined,
        coverType:'',
        title:'',
        content:'',
        platformAuthorName:'',
        attributeid:'',
        tradeid:'',
        creatTime:'',
        title:'',
        coverUrl:'',
        contentType:'',
        url:'',
        sort:undefined,
        ifShow:''
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
        this.dataForm.tradeid=data.data.tradeid
        this.dataForm.attributeid=data.data.attributeid
        if(data.data.attributeName=='行业新闻'){
          this.attributeShow=true
        }
        this.dataForm.title = data.data.title
        this.dataForm.sort = data.data.sort
        this.dataForm.platformAuthorName=data.data.platformAuthorName
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
