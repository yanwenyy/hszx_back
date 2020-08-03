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
      <el-form-item label="文件号" prop="fileNum">
        <el-input v-model="dataForm.fileNum" clearable placeholder="请输入文件号" style="width:500px"></el-input>
      </el-form-item>
      <el-form-item label="发文机关" prop="office">
        <el-input v-model="dataForm.office" clearable placeholder="请输入官方身份" style="width:500px"></el-input>
        <p style="color: #999;margin: 5px 0 0 0;padding: 0;line-height: 12px">注：多个身份需用英文“,”进行分割</p>
      </el-form-item>
      <el-form-item label="官方发布日期" prop="officialReleaseDate">
        <el-date-picker
          v-model="dataForm.officialReleaseDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择官方发布日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="政策地区" pror="province"  style="text-align:left">
        <v-distpicker hide-area @province="onChangeProvince" @city="onChangeCity" :province="dataForm.province" :city="dataForm.region"></v-distpicker>
        <span style="color:red">！注:默认不选为全国</span>
      </el-form-item>
      <el-form-item prop="timelinessid" label="原文时效性">
        <el-select
          v-model="dataForm.timelinessid"
          clearable
          placeholder="请选择时效性" style="width: 220px">
          <el-option v-for="item in timelinessList"
                     :label="item.name"
                     :value="item.id"
                     :key="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="原文税种" prop="taxS">
        <el-select
          v-model="dataForm.taxS"
          multiple
          clearable
          placeholder="请选择税种" style="width: 220px">
          <el-option v-for="item in taxList"
                     :label="item.taxName"
                     :value="item.taxId"
                     :key="item.taxId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="原文标签" prop="tagS">
        <el-checkbox-group v-model="dataForm.tagS">
          <el-checkbox v-for="item in tagList"
                       :label="item.tagId"
                       :key="item.tagId"
                       name="tagList" >{{item.tagName}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
<!--      <el-form-item prop="userid" label="指导专家">
        <el-select
          v-model="dataForm.userid"
          clearable
          style="width: 220px">
          <el-option v-for="item in userList"
                     :label="item.realname"
                     :value="item.uuid"
                     :key="item.uuid">
          </el-option>
        </el-select>
      </el-form-item>-->
      <el-form-item label="创建时间" prop="createTime" v-if="addHide==true">
        <el-input v-model="dataForm.createTime" :disabled="true" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="policyStatusName" v-if="addHide==true">
        <el-input v-model="dataForm.statusName" :disabled="true" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="政策附件" prop="annexs">
        <el-upload
          style="width: 500px"
          :headers="headers"
          :on-change="OnChange"
          :action="UploadUrl()"
          :on-remove="handleRemove"
          accept="application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
          :before-remove="beforeRemove"
          multiple
          :file-list="fileList">
          <el-button size="small" type="primary">上传附件</el-button>
        </el-upload>
        <span style="color:red">！注:只可上传doc、xls、xlsx、pdf格式的文件</span>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <template>
          <UEditor v-if="dataForm.id==undefined||dataForm.content!=''"  :id='"editor_tr_original"':index="0" :econtent="dataForm.content" :modelname="'tr_original'" @func="editorContent" ></UEditor>
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
    /*let validateTax = (rule, value, callback) => {
      if (this.dataForm.taxS.length==0) {
        callback(new Error("税种不能为空"));
      } else {
        callback();
      }
    };
    let validateTag = (rule, value, callback) => {
      if (this.dataForm.taxS.length==0) {
        callback(new Error("标签不能为空"));
      } else {
        callback();
      }
    };*/
    return {
      delFlagShow:false,
      headers: {
        token: this.$cookie.get('token')
      },
      titleTxt:"新增",
      addHide:false,
      disabledStatus:false,
      tradeShow:false,
      tradeList:[],
      timelinessList:[],
      userList:[],
      taxList:[],
      tagList:[],
      fileList:[],
      dataForm:{
        id:parseInt(this.$route.query.id) || undefined,
        property:'',
        title:'',
        officialReleaseDate:'',
        fileNum:'',
        office:'',
        timelinessid:'',
        tax:'',
        taxS:[],
        tag:'',
        tagS:[],
        annexs:[],
        content:'',
       /* userid:'',*/
        province:'',
        region:'',
        createTime:'',
        statusName:'',
      },
      dataRule:{
        title: [
          { required: true, message: '标题不能为空', trigger: 'blur' }
        ],
        officialReleaseDate: [
          { required: true, message: '官方发布日期不能为空', trigger: 'blur' }
        ],
        fileNum:[
          { required: true, message: '文件号不能为空', trigger: 'blur' }
        ],
        office:[
          { required: true, message: '发文机关不能为空', trigger: 'blur' }
        ],
        timelinessid:[
          { required: true, message: '原文时效性不能为空', trigger: 'blur' }
        ],
        /*taxS:[
          { validator: validateTax,trigger: 'blur', required: true}
        ],
        tagS:[
          { validator: validateTag,trigger: 'blur', required: true}
        ],*/
        /*userid:[
          { required: true, message: '指导专家不能为空', trigger: 'blur' }
        ],*/
        content:[
          {required: true, message: '内容不能为空', trigger: 'blur'}
        ]
      }
    }
  },
  mounted(){
    //时效性
    this.$http({
      url: this.$http.adornUrl('/biz/timeliness/timelinessList'),
      method: 'GET',
      params: this.$http.adornParams({'type':1})
    }).then(({data}) => {
      var dataList=[]
      for( var i=0;i<data.data.length;i++){
        dataList.push(data.data[i]);
      }
      this.timelinessList = dataList
    })
    //税种
    this.$http({
      url: this.$http.adornUrl('/biz/trtax/trTaxList'),
      method: 'GET',
      params: this.$http.adornParams({'type':1})
    }).then(({data}) => {
      var dataList=[]
      for( var i=0;i<data.data.length;i++){
        dataList.push(data.data[i]);
      }
      this.taxList = dataList
    })
    //标签
    this.$http({
      url: this.$http.adornUrl('/biz/trtag/trTagList'),
      method: 'GET',
      params: this.$http.adornParams({'type':1})
    }).then(({data}) => {
      var dataList=[]
      for( var i=0;i<data.data.length;i++){
        dataList.push(data.data[i]);
      }
      this.tagList = dataList
    })
    /*//专家
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
    })*/
    //详情
    if( this.dataForm.id!=undefined) {
      this.$http({
        url: this.$http.adornUrl(`/biz/trpolicyoriginal/info/${this.dataForm.id}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        this.titleTxt="编辑"
        this.addHide=true
        this.dataForm.title = data.data.title
        this.dataForm.officialReleaseDate = this.commonDate.formatDate('', '', data.data.officialReleaseDate)
        this.dataForm.fileNum = data.data.fileNum
        this.dataForm.office = data.data.office
        if(data.data.province=="全国"){
          data.data.province=""
        }
        this.dataForm.province = data.data.province
        this.dataForm.region = data.data.region
        this.dataForm.timelinessid = parseInt(data.data.timelinessid)
        if(data.data.taxs!=null&&data.data.taxs!=undefined){
          this.dataForm.tax =data.data.taxs.split(',')
          for (var i = 0; i < this.dataForm.tax.length; i++) {
            if(this.dataForm.tax[i]!=""){
              this.dataForm.taxS.push(this.dataForm.tax[i]);
            }
          }
        }
        if(data.data.tags!=null&&data.data.tags!=undefined){
          this.dataForm.tag =data.data.tags.split(',')
          for (var i = 0; i < this.dataForm.tag.length; i++) {
            if(this.dataForm.tag[i]!=""){
              this.dataForm.tagS.push(this.dataForm.tag[i]);
            }
          }
        }
        /*this.dataForm.userid=data.data.userid*/
        this.dataForm.createTime = this.commonDate.formatTime('', '', data.data.createTime)
        this.dataForm.statusName=data.data.statusName
        this.dataForm.content=data.data.content
        if (data.data.annexList.length != 0) {
          for (var i = 0; i < data.data.annexList.length; i++) {
            this.fileList.push({
              url: data.data.annexList[i].fileOriginalName,
              name:  data.data.annexList[i].fileRealName
            })
          }
        }
      })
    }
  },
  methods:{
    UploadUrl:function(){
      return window.SITE_CONFIG['baseUrl']+'/sys/oss/upload'
    },
    OnChange(file,fileList){
      this.fileList=fileList
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.fileList=fileList
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    //政策地区
    onChangeProvince(e) {
      this.dataForm.province=e.value
    },
    onChangeCity (e) {
      this.dataForm.region=e.value
    },
    //获取富文本内容
    editorContent(modelname,index,content){
      console.log(modelname)
      this.dataForm.content=content
    },
    closePage:function () {
      this.removeTabHandle(this.$store.state.common.mainTabsActiveName)
    },
    //添加关联条文
    addFile:function(val){
      this.dataForm.policyRelativeFiles.push({
        idShow:'',
        relativePolicyId: '',
        title:'',
        sort:'',
        fileNum:'',
        type:2,
        key: Date.now()
      });
    },
    //删除关联条文
    removeFile:function(index){
          this.dataForm.policyRelativeFiles.splice(index, 1)
    },
    //添加关联原文
    addFile_original:function(val){
      this.dataForm.policyRelative0riginal.push({
        idShow:'',
        relativePolicyId: '',
        title:'',
        sort:'',
        fileNum:'',
        type:1,
        key: Date.now()
      });
    },
    //删除关联原文
    removeFile_original:function(index){
      this.dataForm.policyRelative0riginal.splice(index, 1)
    },
    //提交表单
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        console.log(this.dataForm.province)
        if(this.dataForm.province=="省"||this.dataForm.province==""){
          this.dataForm.province="全国"
          this.dataForm.region=""
        }

        if (valid) {
          var taxArr="",tagArr=""
          if(this.dataForm.taxS.length!=0){
            taxArr=this.dataForm.taxS.join(',')
          }
          if(this.dataForm.tagS.length!=0){
            tagArr=this.dataForm.tagS.join(',')
          }
          this.dataForm.annexs=[];
          for(var i=0;i<this.fileList.length;i++){
            if(this.fileList[i].response!=undefined){

              this.dataForm.annexs.push({fileRealName:this.fileList[i].name,fileOriginalName:this.fileList[i].response.url})
              console.log(this.fileList[i].response)
            }else{
              this.dataForm.annexs.push({fileRealName:this.fileList[i].name,fileOriginalName:this.fileList[i].url})
              console.log(this.dataForm.annexs)
            }
          }
          this.$http({
            url: this.$http.adornUrl(`/biz/trpolicyoriginal/${!this.dataForm.id ? 'save' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'id': this.dataForm.id || undefined,
              'title': this.dataForm.title,
              'content':this.dataForm.content,
              'office':this.dataForm.office,
              'officialReleaseDate':this.dataForm.officialReleaseDate,
              'timelinessid':this.dataForm.timelinessid,
              'fileNum':this.dataForm.fileNum,
              'taxs':taxArr || undefined,
              'tags':tagArr || undefined,
              'annexList':this.dataForm.annexs,
              'region':this.dataForm.region || undefined,
              'province':this.dataForm.province,
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
