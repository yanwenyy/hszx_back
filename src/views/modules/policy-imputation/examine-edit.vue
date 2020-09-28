<template>
  <div class="mod-policy">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">审核</h2>
    <el-form label-position="left" label-width="120px" :model="dataForm" :rules="dataRule" ref="dataForm">
      <div style="border:1px solid #ccc;padding-left:50px;padding-top:25px;margin-bottom:30px">
          <el-form-item label="ID" prop="id" style="display:inline-block">
            <el-input v-model="dataForm.id" :disabled="true" style="width:250px"></el-input>
          </el-form-item>
          <el-form-item label="申请人" prop="applyIdName" style="display:inline-block;margin-left:50px">
            <el-input v-model="dataForm.applyIdName" :disabled="true" style="width:250px"></el-input>
          </el-form-item>
          <el-form-item label="审核类型" style="display:inline-block">
            <el-input :value="'申请'+eType"  :disabled="true" style="width:250px"></el-input>
          </el-form-item>
          <el-form-item label="申请时间" prop="applyTime" style="display:inline-block;margin-left:50px">
            <el-input v-model="dataForm.applyTime" :disabled="true" style="width:250px"></el-input>
          </el-form-item>
      </div>
      <el-form-item label="ID" prop="id" v-if="addHide==true">
        <el-input v-model="dataForm.id" :disabled="true" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="属性" size="mini" prop="property">
        <el-radio-group v-model="dataForm.property">
          <el-radio :label="1" :disabled="addHide" >行业政策</el-radio>
          <el-radio :label="2" :disabled="addHide">普适政策</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="行业" prop="tradeid" v-if="dataForm.property==1">
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
      <el-form-item label="原文ID" prop="policyOriginalId">
        <el-input v-model="dataForm.policyOriginalId" clearable placeholder="请输入原文ID" style="width:220px"></el-input>
        <el-button type="primary" style="float: left;margin-right: 5px;z-index: 1;position: absolute;left: 250px;" @click="searchId(dataForm.policyOriginalId)">搜索</el-button>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="dataForm.title" disabled clearable placeholder="请输入标题" style="width:500px"></el-input>
      </el-form-item>
      <el-form-item label="官方发布日期" prop="officialReleaseDate">
        <el-date-picker
          v-model="dataForm.officialReleaseDate"
          type="date"
          disabled
          value-format="yyyy-MM-dd"
          placeholder="选择官方发布日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="文件号" prop="fileNum">
        <el-input v-model="dataForm.fileNum" disabled clearable placeholder="请输入文件号" style="width:500px"></el-input>
      </el-form-item>
      <el-form-item label="发文机关" prop="office">
        <el-input v-model="dataForm.office" disabled clearable placeholder="请输入官方身份" style="width:500px"></el-input>
        <p style="color: #999;margin: 5px 0 0 0;padding: 0;line-height: 12px">注：多个身份需用英文“,”进行分割</p>
      </el-form-item>
      <el-form-item label="政策地区" pror="province"  style="text-align:left">
        <v-distpicker hide-area @province="onChangeProvince" @city="onChangeCity" :province="dataForm.province" :city="dataForm.region"></v-distpicker>
        <span style="color:red">！注:默认不选为全国</span>
      </el-form-item>
      <el-form-item prop="timelinessid" label="时效性">
        <el-select
          v-model="dataForm.timelinessid"
          clearable
          placeholder="时效性" style="width: 220px">
          <el-option v-for="item in timelinessList"
                     :label="item.name"
                     :value="item.id"
                     :key="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="条文税种" prop="taxS">
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
      <el-form-item label="标签" prop="tagS">
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
      <el-form-item label="政策状态" prop="policyStatusName" v-if="addHide==true">
        <el-input v-model="dataForm.policyStatusName" :disabled="true" style="width:220px"></el-input>
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
          <!--v-if="dataForm.id==undefined||dataForm.content!=''"-->
          <UEditor :contentUrl='"/biz/trpolicy/auditInfo/"'  :key="'editor_imputation_edit'" :id='"editor_imputation_edit"' :index="0" :econtent="dataForm.content" :val="dataForm.id"  @func="editorContent" ></UEditor>
        </template>
      </el-form-item>
      <el-form-item label="相关文件">
        <span style="color: #999">只可添加已经填入系统的相关政策</span>
        <div v-for="(policyRelativeFiles, fileIndex) in dataForm.policyRelativeFiles" style="text-indent: 2em;background: #eee;padding: 5px 0;margin-bottom: 10px ;position: relative">
          <el-button type="danger" plain style="float: right;margin-right: 5px;z-index: 1;position: relative;" @click="removeFile(fileIndex)">x 删除模块</el-button>
          <el-form-item style="margin: 5px 0 10px 0;color:#303133" label="条文ID"><el-input style="width:220px" v-model="dataForm.policyRelativeFiles[fileIndex].idShow"></el-input></el-form-item>
          <el-button v-show="false" v-model="dataForm.policyRelativeFiles[fileIndex].relativePolicyId"></el-button>
          <el-button type="primary" style="float: left;margin-right: 5px;z-index: 1;position: absolute;top: 10px;left: 400px;" @click="searchFile(fileIndex,dataForm.policyRelativeFiles[fileIndex].idShow)">搜索</el-button>
          <el-form-item style="margin: 5px 0 10px 0;color:#303133" label="标题"><el-input style="width:220px" disabled v-model="dataForm.policyRelativeFiles[fileIndex].title"></el-input></el-form-item>
          <el-form-item style="margin: 5px 0 10px 0;color:#303133" label="文件号"><el-input style="width:220px" disabled v-model="dataForm.policyRelativeFiles[fileIndex].fileNum"></el-input></el-form-item>
          <el-form-item style="margin: 5px 0 10px 0;color:#303133" label="排序"><el-input style="width:220px" type="number" v-model="dataForm.policyRelativeFiles[fileIndex].sort"></el-input></el-form-item>
        </div>
        <div style="margin-bottom: 20px"><el-button @click="addFile()" type="warning">关联相关条文</el-button></div>
        <div v-for="(policyOriginalRelativeFiles, fileIndex) in dataForm.policyOriginalRelativeFiles" style="text-indent: 2em;background: #eee;padding: 5px 0;margin-bottom: 10px ;position: relative">
          <el-button type="danger" plain style="float: right;margin-right: 5px;z-index: 1;position: relative;" @click="removeFile_original(fileIndex)">x 删除模块</el-button>
          <el-form-item style="margin: 5px 0 10px 0;color:#303133" label="原文ID"><el-input style="width:220px" v-model="dataForm.policyOriginalRelativeFiles[fileIndex].idShow"></el-input></el-form-item>
          <el-button v-show="false" v-model="dataForm.policyOriginalRelativeFiles[fileIndex].relativePolicyId"></el-button>
          <el-button type="primary" style="float: left;margin-right: 5px;z-index: 1;position: absolute;top: 10px;left: 400px;" @click="searchFileOriginal(fileIndex,dataForm.policyOriginalRelativeFiles[fileIndex].idShow)">搜索</el-button>
          <el-form-item style="margin: 5px 0 10px 0;color:#303133" label="政策标题"><el-input style="width:220px" disabled v-model="dataForm.policyOriginalRelativeFiles[fileIndex].title"></el-input></el-form-item>
          <el-form-item style="margin: 5px 0 10px 0;color:#303133" label="文件号"><el-input style="width:220px" disabled v-model="dataForm.policyOriginalRelativeFiles[fileIndex].fileNum"></el-input></el-form-item>
          <el-form-item style="margin: 5px 0 10px 0;color:#303133" label="排序"><el-input style="width:220px" type="number" v-model="dataForm.policyOriginalRelativeFiles[fileIndex].sort"></el-input></el-form-item>
        </div>
        <div><el-button @click="addFile_original()" type="warning">关联相关原文</el-button></div>
      </el-form-item>
      <el-form-item style="text-align: center;">
        <el-button type="primary" @click="dataFormSubmit()">保存并审核通过</el-button>
        <el-button type="primary" @click="fail()">审核未通过</el-button>
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
      eType:'上线',
      editType:this.$route.query.editType,
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
        policyOriginalId:'',
        tradeid:'',
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
        province:'',
        region:'',
        policyRelativeFiles: [],
        policyOriginalRelativeFiles:[],
        createTime:'',
        policyStatusName:'',
      },
      dataRule:{
        property:[
          { required: true, message: '属性不能为空', trigger: 'blur' }
        ],
        policyOriginalId:[
          { required: true, message: '原文ID不能为空', trigger: 'blur' }
        ],
        tradeid:[
          { required: true, message: '行业不能为空', trigger: 'blur' }
        ],
        timelinessid:[
          { required: true, message: '时效性不能为空', trigger: 'blur' }
        ],
        content:[
          {required: true, message: '内容不能为空', trigger: 'blur'}
        ]
      }
    }
  },
  mounted(){
    if(this.editType=='online'){
      this.eType='上线'
    }else{
      this.eType='更新'
    }
    //时效性
    this.$http({
      url: this.$http.adornUrl('/biz/timeliness/timelinessList'),
      method: 'GET',
      params: this.$http.adornParams({'type':2})
    }).then(({data}) => {
      var dataList=[]
      for( var i=0;i<data.data.length;i++){
        dataList.push(data.data[i]);
      }
      this.timelinessList = dataList
    })
    //行业
    this.$http({
      url: this.$http.adornUrl('/biz/trade2/trade2PolicyList'),
      method: 'get',
      params: this.$http.adornData()
    }).then(({data}) => {
      var dataList=[]
      for( var i=0;i<data.data.length;i++){
        dataList.push(data.data[i]);
      }
      this.tradeList = dataList
    })
    //税种
    this.$http({
      url: this.$http.adornUrl('/biz/trtax/trTaxList'),
      method: 'GET',
      params: this.$http.adornParams({'type':2})
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
      params: this.$http.adornParams({'type':2})
    }).then(({data}) => {
      var dataList=[]
      for( var i=0;i<data.data.length;i++){
        dataList.push(data.data[i]);
      }
      this.tagList = dataList
    })
    //详情
    if( this.dataForm.id!=undefined) {
      this.$http({
        url: this.$http.adornUrl(`/biz/trpolicy/auditInfo/${this.dataForm.id}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        this.addHide=true
        this.dataForm.applyIdName=data.data.applyIdName
        this.dataForm.applyTime = data.data.applyTime
        this.dataForm.property=parseInt(data.data.property)
        this.dataForm.policyOriginalId=data.data.policyOriginalId
        this.dataForm.tradeid=data.data.tradeid
        this.dataForm.title = data.data.title
        this.dataForm.officialReleaseDate = this.commonDate.formatDate('', '', data.data.officialReleaseDate)
        this.dataForm.fileNum = data.data.fileNum
        this.dataForm.office = data.data.office
        if(data.data.province=="全国"){
          data.data.province="省"
        }
        this.dataForm.province = data.data.province
        this.dataForm.region = data.data.region
        this.dataForm.timelinessid = parseInt(data.data.timelinessid)
        if(data.data.tax!=null&&data.data.tax!=undefined){
          this.dataForm.tax =data.data.tax.split(',')
          for (var i = 0; i < this.dataForm.tax.length; i++) {
            if(this.dataForm.tax[i]!=""){
              this.dataForm.taxS.push(this.dataForm.tax[i]);
            }
          }
        }
        if(data.data.tag!=null&&data.data.tag!=undefined){
          this.dataForm.tag =data.data.tag.split(',')
          for (var i = 0; i < this.dataForm.tag.length; i++) {
            if(this.dataForm.tag[i]!=""){
              this.dataForm.tagS.push(this.dataForm.tag[i]);
            }
          }
        }
        /*this.dataForm.userid=data.data.userid*/
        this.dataForm.createTime = this.commonDate.formatTime('', '', data.data.createTime)
        this.dataForm.policyStatusName=data.data.policyStatusName
        this.dataForm.content=data.data.content
        if(data.data.policyRelativeFiles!=undefined||(data.data.policyRelativeFiles&&data.data.policyRelativeFiles.length!=0)){
          for(var i=0;i<data.data.policyRelativeFiles.length;i++){
            data.data.policyRelativeFiles[i].idShow=data.data.policyRelativeFiles[i].relativePolicyId
          }
          this.dataForm.policyRelativeFiles=data.data.policyRelativeFiles
        }
        if(data.data.policyOriginalRelativeFiles!=undefined||(data.data.policyOriginalRelativeFiles&&data.data.policyOriginalRelativeFiles.length!=0)){
          for(var i=0;i<data.data.policyOriginalRelativeFiles.length;i++){
            data.data.policyOriginalRelativeFiles[i].idShow=data.data.policyOriginalRelativeFiles[i].relativePolicyId
          }
          this.dataForm.policyOriginalRelativeFiles=data.data.policyOriginalRelativeFiles
        }
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
    searchId(id){
      if(id!=""){
        this.$http({
          url: this.$http.adornUrl(`/biz/trpolicyoriginal/info/${id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if(data.data==null){
            this.$message.error('该政策原文ID不存在')
          }else{
            this.dataForm.title = data.data.title
            this.dataForm.officialReleaseDate = this.commonDate.formatDate('', '', data.data.officialReleaseDate)
            this.dataForm.fileNum = data.data.fileNum
            this.dataForm.office = data.data.office
          }
        })
      }
    },
    //获取富文本内容
    editorContent(modelname,index,content){
      this.dataForm.content=content
    },
    closePage:function () {
      this.removeTabHandle(this.$store.state.common.mainTabsActiveName)
    },
    //添加关联文件
    addFile:function(){
      this.dataForm.policyRelativeFiles.push({
        idShow:'',
        relativePolicyId: '',
        title:'',
        sort:'',
        fileNum:'',
        key: Date.now()
      });
    },
    //删除关联文件
    removeFile:function(item,id){
        this.dataForm.policyRelativeFiles.splice(item, 1)
    },
    //添加关联原文
    addFile_original:function(val){
      this.dataForm.policyOriginalRelativeFiles.push({
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
      this.dataForm.policyOriginalRelativeFiles.splice(index, 1)
    },
    //搜索政策原文ID
    searchFileOriginal(fileIndex,id){
      this.$http({
        url: this.$http.adornUrl(`/biz/trpolicyoriginal/info/${id}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        if(data.data==null){
          this.$message.error('该政策原文ID不存在')
        }else {
          this.dataForm.policyOriginalRelativeFiles[fileIndex].title = data.data.title
          this.dataForm.policyOriginalRelativeFiles[fileIndex].fileNum = data.data.fileNum
          this.dataForm.policyOriginalRelativeFiles[fileIndex].relativePolicyId = data.data.id
        }
      })
    },
    //搜索政策ID
    searchFile(fileIndex,id){
      if(this.dataForm.property==2){
        this.dataForm.tradeid=""
      }
      this.$http({
        url: this.$http.adornUrl(`/biz/trpolicy/aboutPolicy`),
        method: 'get',
        params: this.$http.adornParams({
          'id':id,
          'property':this.dataForm.property,
          'tradeid':this.dataForm.tradeid || undefined
        })
      }).then(({data}) => {
        if(data.code==500){
          this.$message.error(data.msg)
        }else {
          this.dataForm.policyRelativeFiles[fileIndex].title = data.data.title
          this.dataForm.policyRelativeFiles[fileIndex].fileNum = data.data.fileNum
          this.dataForm.policyRelativeFiles[fileIndex].relativePolicyId = data.data.id
        }
      })
    },
    //审核未通过
    fail () {
      this.$prompt('请输入未通过原因，最少5个字最多输入100字', '审核未通过', {
        inputType:'textarea',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator:(val) => {
          return !(val.length < 5 || val.length > 100)
        },
        inputErrorMessage: '！保存失败，您未达到最少字数或超过最大字数'
      }).then(({ value }) => {
        var axUrl='';
        if(this.editType=='online'){
          axUrl='/biz/trpolicy/onlineAuditNoPass'
        }else if(this.editType=='update'){
          axUrl='/biz/trpolicy/updateAuditNoPass'
        }
        this.$http({
          url: this.$http.adornUrl(`${axUrl}`),
          method: 'GET',
          params: this.$http.adornParams({'id':this.dataForm.id,'auditFailReason':value})
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
            if(data.message==undefined){
              this.$message.error(data.msg)
            }else{
              this.$message.error(data.message)
            }
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    },
    //提交表单
    dataFormSubmit () {
      this.$confirm(`您确定审核通过吗？`, ``, {
        confirmButtonText: `确定`,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs['dataForm'].validate((valid) => {
          if(this.dataForm.province=="省"||this.dataForm.province==""||this.dataForm.province==null){
            this.dataForm.province="全国"
            this.dataForm.region=""
          }
          if (valid) {
            var taxArr='',tagArr=''
            if(this.dataForm.taxS.length!=0){
              taxArr=this.dataForm.taxS.join(',')
            }
            if(this.dataForm.tagS.length!=0){
              tagArr=this.dataForm.tagS.join(',')
            }
            var axUrl='';
            if(this.editType=='online'){
              axUrl='/biz/trpolicy/onlineAuditPass'
            }else if(this.editType=='update'){
              axUrl='/biz/trpolicy/updateAuditPass'
            }
            if(this.dataForm.property==2){
              this.dataForm.tradeid=""
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
              url: this.$http.adornUrl(`${axUrl}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'property':this.dataForm.property,
                'policyOriginalId':this.dataForm.policyOriginalId,
                'content':this.dataForm.content,
                'tradeid':this.dataForm.tradeid || undefined,
                'tax':taxArr || undefined,
                'tag':tagArr || undefined,
                'region':this.dataForm.region|| undefined,
                'province':this.dataForm.province,
                'policyRelativeFiles':this.dataForm.policyRelativeFiles || undefined,
                'policyOriginalRelativeFiles':this.dataForm.policyOriginalRelativeFiles || undefined
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
