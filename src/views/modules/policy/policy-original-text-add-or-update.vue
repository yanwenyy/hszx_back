<template>
  <div class="mod-policy">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">{{titleTxt}}</h2>
    <el-form label-position="left" label-width="120px" :model="dataForm" :rules="dataRule" ref="dataForm">
      <el-form-item label="政策ID" prop="id" v-if="addHide==true">
        <el-input v-model="dataForm.id" :disabled="true" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="创建时间" prop="createDate" v-if="addHide==true">
        <el-input v-model="dataForm.createDate" :disabled="true" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="政策类型" v-if="addHide==true">
        <el-input :disabled="true" style="width:220px" value="政策"></el-input>
      </el-form-item>
      <el-form-item label="辅导月份" prop="policyPackDate">
        <el-select
          v-model="dataForm.policyPackDate"
          clearable
          :disabled="addHide"
          placeholder="辅导月份" style="width: 220px">
          <el-option v-for="item in monthList"
                     :label="item.policyDateKey"
                     :value="item.policyDateValue"
                     :key="item.policyDateValue">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="dataForm.title" clearable placeholder="请输入标题" style="width:500px"></el-input>
      </el-form-item>
      <el-form-item label="官方发布日期" prop="officialReleaseDate">
        <el-date-picker
          v-model="dataForm.officialReleaseDate"
          type="date"
          :disabled="disabledStatus"
          value-format="yyyy-MM-dd"
          placeholder="选择官方发布日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="文件号" prop="fileNum">
        <el-input v-model="dataForm.fileNum" clearable placeholder="请输入文件号" style="width:500px"></el-input>
      </el-form-item>
      <el-form-item label="官方身份" prop="officialCapacity">
        <el-input v-model="dataForm.officialCapacity" clearable placeholder="请输入官方身份" style="width:500px"></el-input>
        <p style="color: #999;margin: 5px 0 0 0;padding: 0;line-height: 12px">注：多个身份需用英文“,”进行分割</p>
      </el-form-item>
      <el-form-item label="属性" prop="style">
        <el-select
          v-model="dataForm.style"
          clearable
          placeholder="请选择属性" style="width: 220px">
          <el-option v-for="item in styleList"
                     :label="item.name"
                     :value="item.id"
                     :key="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="适用范围" prop="pubMin">
        <el-select
          v-model="dataForm.pubMin"
          clearable
          :disabled="delFlagShow"
          placeholder="适用范围" style="width: 220px" @change="getpubMin($event)">
          <el-option v-for="item in pubMinList"
                     :label="item.label"
                     :value="item.value"
                     :key="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="适用行业" prop="trades" v-show="tradeShow">
        <el-select
          v-model="dataForm.trades"
          multiple
          :multiple-limit="2"
          :required="isRequired"
          clearable
          :disabled="delFlagShow"
          placeholder="请选择行业" style="width: 220px">
          <el-option v-for="item in tradeList"
                     :label="item.tradeName"
                     :value="item.tradeId"
                     :key="item.tradeId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标签" prop="tags">
        <el-input v-model="dataForm.tags" clearable placeholder="请输入标签" style="width:500px"></el-input>
        <p style="color: #999;margin: 5px 0 0 0;padding: 0;line-height: 12px">注：最多增加5个标签，标签需用英文“,”进行分割；示例：#实操,#房地产</p>
      </el-form-item>
      <el-form-item label="政策附件" prop="annexs">
        <el-upload
          style="width: 500px"
          :headers="headers"
          :on-change="OnChange"
          :action="UploadUrl()"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          accept="application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/x-png,image/png,application/x-jpg,image/jpeg,image/jpeg,image/gif"
          multiple
          :file-list="fileList">
          <el-button size="small" type="primary">上传附件</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="政策原文" prop="content">
        <template>
         <!-- <div v-model="dataForm.content" id="editor"></div>-->
          <UEditor :contentUrl='"/biz/policy/info/"' :id="'original'" :index="0" :econtent=dataForm.content  :modelname="'orginal'" :val="dataForm.id" @func="editorContent" ></UEditor>
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
export default {
  inject:['removeTabHandle'],
  components: {UEditor},
  data(){
    let validateTrade = (rule, value, callback) => {
      if (this.dataForm.trades.length==0 && this.isRequired) {
        callback(new Error("适用行业不能为空"));
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
      tradeShow:false,
      monthList:[],
      styleList:[],
      pubMinList:[{label:'普适型',value:1},{label:'小众型',value:2}],
      tradeList:[],
      fileList:[],
      dataForm:{
        id:parseInt(this.$route.query.id) || undefined,
        title:'',
        policyPackDate:'',
        officialReleaseDate:'',
        fileNum:'',
        officialCapacity:'',
        style:'',
        pubMin:'',
        trades:[],
        annexs:[],
        content:''
      },
      dataRule:{
        title: [
          { required: true, message: '辅导期名称不能为空', trigger: 'blur' }
        ],
        policyPackDate: [
          { required: true, message: '辅导月份不能为空', trigger: 'blur' }
        ],
        officialReleaseDate: [
          { required: true, message: '官方发布日期不能为空', trigger: 'blur' }
        ],
        fileNum:[
          { required: true, message: '文件号不能为空', trigger: 'blur' }
        ],
        officialCapacity:[
          { required: true, message: '官方身份不能为空', trigger: 'blur' }
        ],
        style:[
          { required: true, message: '属性不能为空', trigger: 'blur' }
        ],
        pubMin:[
          { required: true, message: '适用范围不能为空', trigger: 'blur' }
        ],
        trades: [
          { validator: validateTrade,trigger: 'blur'  }
        ],
        content:[
          {required: true, message: '政策原文不能为空', trigger: 'blur'}
        ]
      }
    }
  },
  mounted(){
    if( this.dataForm.id!=undefined) {
      this.$http({
        url: this.$http.adornUrl(`/biz/policy/info/${this.dataForm.id}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        this.titleTxt="编辑"
        this.addHide=true
        if(data.data.delFlag==0){
          this.delFlagShow=true
        }
        this.dataForm.policyPackDate = data.data.policyPackDate+'-02'
        this.dataForm.title = data.data.title
        this.dataForm.officialReleaseDate = this.commonDate.formatDate('', '', data.data.officialReleaseDate)
        this.dataForm.createDate = this.commonDate.formatTime('', '', data.data.createDate)
        this.dataForm.fileNum = data.data.fileNum
        this.dataForm.officialCapacity = data.data.officialCapacity
        this.dataForm.style = data.data.style
        this.dataForm.pubMin = parseInt(data.data.pubMin)
        if(data.data.pubMin==2){
          this.tradeShow=true
          if(data.data.trades.length>0){
            for(var i=0;i<data.data.trades.length;i++){
              this.dataForm.trades.push(data.data.trades[i].tradeId)
            }
          }
        }
        if(data.data.tags!=""&&data.data.tags!=null&&data.data.tags!=undefined){
          this.dataForm.tags = data.data.tags.substr(1);
          this.dataForm.tags = this.dataForm.tags.substring(0,this.dataForm.tags.length-1)
        }
        this.dataForm.content=data.data.content
        if (data.data.annexs.length != 0) {
          for (var i = 0; i < data.data.annexs.length; i++) {
            this.fileList.push({
              name: data.data.annexs[i].fileRealName,
              url:  data.data.annexs[i].fileOriginalName
            })
          }
        }
      })
    }
    //辅导月份
    this.$http({
      url: this.$http.adornUrl('/biz/policypack/list/allStatusMonth'),
      method: 'post',
      data: this.$http.adornData()
    }).then(({data}) => {
      var dataList=[]
      for( var i=0;i<data.data.length;i++){
        dataList.push(data.data[i]);
      }
      this.monthList = dataList
    })
    //属性
    this.$http({
      url: this.$http.adornUrl('/biz/policyattribute/select'),
      method: 'get',
      params: this.$http.adornParams()
    }).then(({data}) => {
      var dataList=[]
      for( var i=0;i<data.data.length;i++){
        dataList.push(data.data[i]);
      }
      this.styleList = dataList
    })
    //行业
    this.$http({
      url: this.$http.adornUrl('/biz/trade/select'),
      method: 'get',
      params: this.$http.adornParams()
    }).then(({data}) => {
      var dataList=[]
      for( var i=0;i<data.data.length;i++){
        dataList.push(data.data[i]);
      }
      this.tradeList = dataList
    })
  },
  computed: {
    isRequired: function() {
      return this.dataForm.pubMin == `2`;
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
    getpubMin(event){
      if(event==2){
        this.tradeShow=true
      }else{
        this.tradeShow=false
      }
    },
    //提交表单
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        var trades=this.dataForm.trades
        if(this.dataForm.trades.length!=0){
          if(trades[0].tradeId==undefined){
            this.dataForm.trades=[];
            for(var i=0;i<trades.length;i++){
              this.dataForm.trades.push({tradeId:trades[i]})
            }
          }
        }
        var tradeArr=this.dataForm.trades
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
        console.log(this.dataForm.annexs)
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/biz/policy/${!this.dataForm.id ? 'save' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'id': this.dataForm.id || undefined,
              'title': this.dataForm.title,
              'policyPackDate':this.dataForm.policyPackDate,
              'content':this.dataForm.content,
              'annexs':this.dataForm.annexs,
              'officialCapacity':this.dataForm.officialCapacity,
              'officialReleaseDate':this.dataForm.officialReleaseDate,
              'pubMin':this.dataForm.pubMin,
              'style':this.dataForm.style,
              'fileNum':this.dataForm.fileNum,
              'tags':this.dataForm.tags,
              'trades':tradeArr,
              'type':'1'
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
              this.dataForm.annexs=[]
              if(this.dataForm.trades.length!=0){
                var trades=this.dataForm.trades
                this.dataForm.trades=[];
                for(var i=0;i<trades.length;i++){
                  this.dataForm.trades.push(trades[i].tradeId)
                }
              }
              alert(this.dataForm.trades)
              this.$message.error(data.msg)
            }
          })
        }else{
          if(this.dataForm.trades.length!=0){
            var trades=this.dataForm.trades
              this.dataForm.trades=[];
              for(var i=0;i<trades.length;i++){
                this.dataForm.trades.push(trades[i].tradeId)
              }
          }
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
