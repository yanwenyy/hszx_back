<template>
  <div class="mod-policy">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">{{titleTxt}}</h2>
    <el-form label-position="left" label-width="120px" :model="dataForm" :rules="dataRule" ref="dataForm">
      <p><span style="color:red">*</span>选择关联政策</p>
      <div style="border:1px solid #ccc;padding-left:50px;padding-top:10px;margin-bottom:30px;position: relative">
        <el-form-item style="margin:0 0 10px 0;color:#303133" label="政策ID" prop="idShow">
          <el-input style="width:220px" v-model="dataForm.idShow"></el-input>
        </el-form-item>
        <el-button v-show="false" v-model="dataForm.policyId"></el-button>
        <el-button type="primary" style="float: left;margin-right: 5px;z-index: 1;position: absolute;top: 10px;left: 400px;" @click="searchFile(dataForm.idShow)">搜索</el-button>
        <el-form-item style="display:inline-block;margin: 5px 0 10px 0;color:#303133" label="政策标题"><el-input style="width:220px" disabled v-model="dataForm.policyTitle"></el-input></el-form-item>
        <el-form-item style="display:inline-block;margin: 5px 0 10px 50px;color:#303133" label="政策文件号"><el-input style="width:220px" disabled v-model="dataForm.policyFileNum"></el-input></el-form-item>
      </div>
      <el-form-item label="解读ID" prop="id" v-if="addHide==true">
        <el-input v-model="dataForm.id" :disabled="true" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="解读标题" prop="expertTitle">
        <el-input v-model="dataForm.expertTitle" clearable placeholder="请输入解读标题" style="width:500px"></el-input>
      </el-form-item>
      <el-form-item prop="source" label="来源">
        <el-input v-model="dataForm.source" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="dataForm.sort" :disabled="addHide" controls-position="right" :min="1" label="排序"></el-input-number>
        <p style="color:#999">可填写数字如：“1”，数字越大排序越靠前，该设置决定本篇解读在小程序“相关解读”中的排序情况</p>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime" v-if="addHide==true">
        <el-input v-model="dataForm.createTime" :disabled="true" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="发布日期" prop="releaseDate" >
        <!--<el-input v-model="dataForm.releaseDate" style="width:220px"></el-input>-->
        <el-date-picker
          v-model="dataForm.releaseDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="状态" prop="status" v-if="addHide==true">
        <el-input :value="dataForm.status==0?'隐藏':'在线'" :disabled="true" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <template>
          <UEditor :contentUrl='"/biz/trpolicyoriginalrelativeexpert/info/"' :key="'editor_relative_expert'" :val="dataForm.id" :id='"editor_relative_expert"':index="0" :econtent="dataForm.content" :modelname="'relative_expert'" @func="editorContent" ></UEditor>
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
      delFlagShow:false,
      headers: {
        token: this.$cookie.get('token')
      },
      titleTxt:"新增",
      addHide:false,
      disabledStatus:false,
      userList:[],
      dataForm:{
        releaseDate:'',
        id:parseInt(this.$route.query.id) || undefined,
        idShow:'',
        policyId:'',
        policyTitle:'',
        policyFileNum:'',
        expertTitle:'',
        fileNum:'',
        content:'',
        userid:'',
        createTime:'',
        sort:'',
        status:''
      },
      dataRule:{
        idShow:[
          { required: true, message: '政策ID不能为空', trigger: 'blur' }
        ],
        expertTitle: [
          { required: true, message: '标题不能为空', trigger: 'blur' }
        ],
        userid:[
          { required: true, message: '作者不能为空', trigger: 'blur' }
        ],
        content:[
          {required: true, message: '内容不能为空', trigger: 'blur'}
        ],
        releaseDate:[
          {required: true, message: '发布日期不能为空', trigger: 'blur'}
        ],
      }
    }
  },
  mounted(){
    //详情
    if( this.dataForm.id!=undefined) {
      this.$http({
        url: this.$http.adornUrl(`/biz/trpolicyoriginalrelativeexpert/info/${this.dataForm.id}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        this.dataForm.releaseDate=data.data.releaseDate;
        this.titleTxt="编辑"
        this.addHide=true
        this.dataForm.idShow=data.data.policyId
        this.dataForm.policyId=data.data.policyId
        this.dataForm.policyTitle=data.data.policyTitle
        this.dataForm.policyFileNum=data.data.policyFileNum
        this.dataForm.expertTitle = data.data.expertTitle
        this.dataForm.sort = data.data.sort
        this.dataForm.source=data.data.source
        this.dataForm.createTime = this.commonDate.formatTime('', '', data.data.createTime)
        this.dataForm.content=data.data.content
        this.dataForm.status=data.data.status
      })
    }
  },
  methods:{
    onSelected (e) {
      this.dataForm.province=e.province.value
      this.dataForm.region=e.city.value
    },
    //获取富文本内容
    editorContent(modelname,index,content){
      console.log(modelname)
      this.dataForm.content=content
    },
    closePage:function () {
      this.removeTabHandle(this.$store.state.common.mainTabsActiveName)
    },
    //搜索政策ID
    searchFile(id){
      this.$http({
        url: this.$http.adornUrl(`/biz/trpolicyoriginalrelativeexpert/searchPolicyOriginalById`),
        method: 'post',
        params: this.$http.adornParams({policyId:id})
      }).then(({data}) => {
        this.dataForm.policyId=data.data.id
        this.dataForm.policyFileNum=data.data.fileNum
        this.dataForm.policyTitle=data.data.title
      })
    },
    //提交表单
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
          if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/biz/trpolicyoriginalrelativeexpert/${!this.dataForm.id ? 'save' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'id': this.dataForm.id || undefined,
              'policyId':this.dataForm.policyId,
              'expertTitle': this.dataForm.expertTitle,
              'content':this.dataForm.content,
              'source':this.dataForm.source,
              'sort':this.dataForm.sort || undefined,
              'status':this.dataForm.status,
              'releaseDate':this.dataForm.releaseDate
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
