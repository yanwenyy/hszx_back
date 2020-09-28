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
        <el-input :disabled="true" style="width:220px" value="文章"></el-input>
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
      <el-form-item label="政策附件" >
        <el-upload
          style="width: 500px"
          :headers="headers"
          :on-change="OnChange"
          :action="UploadUrl()"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          multiple
          :file-list="fileList">
          <el-button size="small" type="primary">上传附件</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="政策原文" prop="content">
        <template>
          <UEditor :contentUrl='"/biz/policy/info/"' :id="'article'" :index="0" :econtent=dataForm.content  :modelname="'article'" :val="dataForm.id" @func="editorContent" ></UEditor>
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
        // 当跳转链接为空值且为必填时，抛出错误，反之通过校验
        if (this.dataForm.trade === "" && this.isRequired) {
          callback(new Error("适用行业不能为空"));
        } else {
          callback();
        }
      };
      return {
        titleTxt:'新增',
        addHide:false,
        headers: {
          token: this.$cookie.get('token')
        },
        monthList:[],
        styleList:[],
        fileList:[],
        dataForm:{
          id:parseInt(this.$route.query.id) || undefined,
          createDate:'',
          title:'',
          policyPackDate:'',
          officialReleaseDate:'',
          fileNum:'',
          officialCapacity:'',
          style:'',
          annexs:[],
          content:''
        },
        dataRule:{
          policyPackDate: [
            { required: true, message: '辅导月份不能为空', trigger: 'blur' }
          ],
          title: [
            { required: true, message: '辅导期名称不能为空', trigger: 'blur' }
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
          this.dataForm.policyPackDate = data.data.policyPackDate+'-02'
          this.dataForm.title = data.data.title
          this.dataForm.officialReleaseDate = this.commonDate.formatDate('', '', data.data.officialReleaseDate)
          this.dataForm.createDate = this.commonDate.formatTime('', '', data.data.createDate)
          this.dataForm.fileNum = data.data.fileNum
          this.dataForm.officialCapacity = data.data.officialCapacity
          this.dataForm.style = data.data.style
          this.dataForm.content=data.data.content
          if (data.data.annexs.length != 0) {
            for (var i = 0; i < data.data.annexs.length; i++) {
              this.fileList.push({
                name: data.data.annexs[i].fileRealName,
                url: data.data.annexs[i].fileOriginalName
              })
            }
          }
        })
      }
      //this.dataForm.content=data.data.content
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
      if(this.policyId!=undefined){
        this.$http({
          url: this.$http.adornUrl(`/biz/policy/info/${this.policyId}`),
          method: 'get',
          data: this.$http.adornParams()
        }).then(({data}) => {
          this.content=data.policy.content;
          this.title=data.policy.title
          this.editor.txt.html(data.policy.content)
        })
      }
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
        this.dataForm.annexs=[]
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
        this.$refs['dataForm'].validate((valid) => {
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
                'style':this.dataForm.style,
                'fileNum':this.dataForm.fileNum,
                'type':'2'
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

