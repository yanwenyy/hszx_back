<template>
  <div class="mod-policy">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">{{titleTxt}}</h2>
    <el-form label-position="left" label-width="120px" :model="dataForm" :rules="dataRule" ref="dataForm">
      <el-form-item label="ID" prop="id" v-if="addHide==true">
        <el-input v-model="dataForm.id" :disabled="true" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="dataForm.title" clearable placeholder="请输入标题" style="width:500px"></el-input>
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

        <el-radio v-model="dataForm.ifPlatformAuthor" @change="dataForm.lecturer=''" label="0" style="margin-right:6px">填写非平台作者</el-radio>
        <el-input v-model="dataForm.lecturer" v-show='dataForm.ifPlatformAuthor==0' style="width:220px"></el-input>
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
      <el-form-item label="属性" prop="attributeid">
        <el-select
          v-model="dataForm.attributeid"
          clearable
          placeholder="请选择属性" style="width: 220px">
          <el-option v-for="item in attributeList"
                     :label="item.name"
                     :value="item.id"
                     :key="item.id" >
          </el-option>
        </el-select>
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
      <el-form-item label="引言" prop="summary">
        <el-input
          type="textarea"
          v-model="dataForm.summary"
          maxlength="100"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <template>
          <UEditor :contentUrl='"/biz/trtaxplan/info/"' :key="'editor_risk-tips'" :val="dataForm.id" :url="'/biz/trtaxplan/info/'" :id='"editor_risk-tips"':index="0" :econtent="dataForm.content"  @func="editorContent" ></UEditor>
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
    return {
      titleTxt:"新增",
      addHide:false,
      userList:[],
      tradeList:[],
      attributeList:[],
      dataForm:{
        ifPlatformAuthor:'1',
        id:parseInt(this.$route.query.id) || undefined,
        title:'',
        content:'',
        lecturer:'',
        attributeid:'',
        tradeid:'',
        creatTime:'',
        title:'',
        sort:undefined,
        ifShow:'',
        summary:''
      },
      dataRule:{
        title: [
          { required: true, message: '标题不能为空', trigger: 'blur' }
        ],
        lecturer:[
          { required: true, message: '作者不能为空', trigger: 'blur' }
        ],
        tradeid:[
          { required: true, message: '行业不能为空', trigger: 'blur' }
        ],
        attributeid:[
          { required: true, message: '属性不能为空', trigger: 'blur' }
        ],
        content:[
          {required: true, message: '内容不能为空', trigger: 'blur'}
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
      params: this.$http.adornParams({module:2})
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
        url: this.$http.adornUrl(`/biz/trtaxplan/info/${this.dataForm.id}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        this.titleTxt="编辑"
        this.addHide=true
        this.dataForm.tradeid=data.data.tradeid
        this.dataForm.attributeid=data.data.attributeid
        this.dataForm.summary=data.data.summary
        this.dataForm.title = data.data.title
        this.dataForm.sort = data.data.sort
        this.dataForm.lecturer=data.data.lecturer
        this.dataForm.ifPlatformAuthor=data.data.ifPlatformAuthor
        this.dataForm.creatTime = this.commonDate.formatTime('', '', data.data.creatTime)
        this.dataForm.content=data.data.content
        this.dataForm.ifShow=data.data.ifShow
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
            url: this.$http.adornUrl(`/biz/trtaxplan/${!this.dataForm.id ? 'save' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'id': this.dataForm.id || undefined,
              'ifPlatformAuthor':this.dataForm.ifPlatformAuthor,
              'lecturer':this.dataForm.lecturer,
              'title': this.dataForm.title,
              'tradeid': this.dataForm.tradeid,
              'attributeid': this.dataForm.attributeid,
              'content':this.dataForm.content,
              'lecturer':this.dataForm.lecturer,
              'sort':this.dataForm.sort || undefined,
              'summary':this.dataForm.summary || undefined
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
</style>
