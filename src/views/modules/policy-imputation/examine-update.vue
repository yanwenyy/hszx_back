<template>
  <div class="mod-policy">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">审核</h2>
    <div>
      <el-form label-position="left" label-width="100px"  :model="dataForm" ref="dataForm" style="border:1px solid #ccc;padding-left:50px;padding-top:25px;margin-bottom:30px">
        <el-form-item label="政策ID" prop="id" v-if="addHide==true" style="display:inline-block">
          <el-input v-model="dataForm.id" :disabled="true" style="width:250px"></el-input>
        </el-form-item>
        <el-form-item label="申请人" prop="user" v-if="addHide==true" style="display:inline-block;margin-left:50px">
          <el-input v-model="dataForm.id" :disabled="true" style="width:250px"></el-input>
        </el-form-item>
        <el-form-item label="审核类型" v-if="addHide==true" style="display:inline-block">
          <el-input value="申请更新"  :disabled="true" style="width:250px"></el-input>
        </el-form-item>
        <el-form-item label="申请时间" prop="user" v-if="addHide==true" style="display:inline-block;margin-left:50px">
          <el-input v-model="dataForm.id" :disabled="true" style="width:250px"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <el-form label-position="left" label-width="120px" :model="dataForm" :rules="dataRule" ref="dataForm">
      <el-form-item label="创建时间" prop="createTime">
        <el-input v-model="dataForm.createTime" :disabled="true" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="行业" prop="tradeid">
        <el-select
          v-model="dataForm.tradeid"
          clearable
          :disabled="true"
          placeholder="请选择行业" style="width: 220px">
          <el-option v-for="item in tradeList"
                     :label="item.tradeName"
                     :value="item.tradeId"
                     :key="item.tradeId" >
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
      <el-form-item label="发文机关" prop="office">
        <el-input v-model="dataForm.office" clearable placeholder="请输入官方身份" style="width:500px"></el-input>
        <p style="color: #999;margin: 5px 0 0 0;padding: 0;line-height: 12px">注：多个身份需用英文“,”进行分割</p>
      </el-form-item>
      <el-form-item label="政策地区" pror="province"  style="text-align:left">
        <v-distpicker hide-area :province="dataForm.province" :city="dataForm.region" @selected="onSelected"></v-distpicker>
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
      <el-form-item label="税种" prop="taxS">
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
      <el-form-item prop="userid" label="指导专家">
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
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <template>
          <UEditor :id="'imputation'" :url="'/biz/trpolicy/auditInfo/'" :index="0" :econtent=dataForm.content  :modelname="'imputation'" :val="dataForm.id" @func="editorContent" ></UEditor>
        </template>
      </el-form-item>
      <el-form-item label="相关文件">
        <div v-for="(policyRelativeFiles, fileIndex) in dataForm.policyRelativeFiles" style="text-indent: 2em;background: #eee;padding: 5px 0;margin-bottom: 10px ;position: relative">
          <el-button type="danger" plain style="float: right;margin-right: 5px;z-index: 1;position: relative;" @click="removeFile(policyRelativeFiles,dataForm.policyRelativeFiles[fileIndex].id)">x 删除模块</el-button>
          <el-form-item style="margin: 5px 0 10px 0;color:#303133" label="政策ID"><el-input style="width:220px" v-model="dataForm.policyRelativeFiles[fileIndex].idShow"></el-input></el-form-item>
          <el-button v-show="false" v-model="dataForm.policyRelativeFiles[fileIndex].relativePolicyId"></el-button>
          <el-button type="primary" style="float: left;margin-right: 5px;z-index: 1;position: absolute;top: 10px;left: 400px;" @click="searchFile(fileIndex,dataForm.policyRelativeFiles[fileIndex].idShow)">搜索</el-button>
          <el-form-item style="margin: 5px 0 10px 0;color:#303133" label="政策标题"><el-input style="width:220px" disabled v-model="dataForm.policyRelativeFiles[fileIndex].title"></el-input></el-form-item>
          <el-form-item style="margin: 5px 0 10px 0;color:#303133" label="文件号"><el-input style="width:220px" disabled v-model="dataForm.policyRelativeFiles[fileIndex].fileNum"></el-input></el-form-item>
          <el-form-item style="margin: 5px 0 10px 0;color:#303133" label="排序"><el-input style="width:220px" type="number" v-model="dataForm.policyRelativeFiles[fileIndex].sort"></el-input></el-form-item>
        </div>
        <el-button @click="addFile()" type="warning">关联相关文件</el-button>
        <span style="color: #999">只可添加已经填入系统的相关政策</span>
      </el-form-item>
      <el-form-item label="相关解读">
      <span style="color: #999">暂无相关解读</span>
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
      let validateTax = (rule, value, callback) => {
        if (this.dataForm.taxS.length==0) {
          callback(new Error("税种不能为空"));
        } else {
          callback();
        }
      };

      let validateRegion = (rule, value, callback) => {
        console.log(1)
        if (value=='') {

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
        tradeShow:false,
        tradeList:[],
        timelinessList:[],
        userList:[{uuid:'0e076cba7c5944e7b535b72700109694',realname:'李贺'}],
        taxList:[],
        fileList:[],
        dataForm:{
          id:parseInt(this.$route.query.id) || undefined,
          tradeid:'',
          title:'',
          officialReleaseDate:'',
          fileNum:'',
          office:'',
          timelinessid:'',
          tax:'',
          taxS:[],
          content:'',
          userid:'',
          province:'',
          region:'',
          policyRelativeFiles: [],
          createTime:'',
          policyStatusName:'',
        },
        dataRule:{
          tradeid:[
            { required: true, message: '行业不能为空', trigger: 'blur' }
          ],
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
            { required: true, message: '时效性不能为空', trigger: 'blur' }
          ],
          taxS:[
            { validator: validateTax,trigger: 'blur', required: true}
          ],
          userid:[
            { required: true, message: '指导专家不能为空', trigger: 'blur' }
          ],
          content:[
            {required: true, message: '内容不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    mounted(){
      //税种
      this.$http({
        url: this.$http.adornUrl('/biz/tax/taxList'),
        method: 'GET',
        params: this.$http.adornParams()
      }).then(({data}) => {
        var dataList=[]
        for( var i=0;i<data.data.length;i++){
          dataList.push(data.data[i]);
        }
        this.taxList = dataList
      })
      //时效性
      this.$http({
        url: this.$http.adornUrl('/biz/timeliness/timelinessList'),
        method: 'GET',
        params: this.$http.adornParams()
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
      //专家
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
      //详情
      if( this.dataForm.id!=undefined) {
        this.$http({
          url: this.$http.adornUrl(`/biz/trpolicy/auditInfo/${this.dataForm.id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.titleTxt="编辑"
          this.addHide=true
          this.dataForm.tradeid=data.data.tradeid
          this.dataForm.title = data.data.title
          this.dataForm.officialReleaseDate = this.commonDate.formatDate('', '', data.data.officialReleaseDate)
          this.dataForm.fileNum = data.data.fileNum
          this.dataForm.office = data.data.office
          if(data.data.province=="全国"){
            data.data.province=""
          }
          this.dataForm.province = data.data.province
          this.dataForm.region = data.data.region
          this.dataForm.timelinessid = parseInt(data.data.timelinessid),
            this.dataForm.tax =data.data.tax.split(',')
          for (var i = 0; i < this.dataForm.tax.length; i++) {
            if(this.dataForm.tax[i]!=""){
              this.dataForm.taxS.push(Number.parseInt(this.dataForm.tax[i]));
            }
          }
          this.dataForm.userid=data.data.userid
          this.dataForm.createTime = this.commonDate.formatTime('', '', data.data.createTime)
          this.dataForm.policyStatusName=data.data.policyStatusName
          this.dataForm.content=data.data.content
          if(data.data.policyRelativeFiles!=undefined){
            for(var i=0;i<data.data.policyRelativeFiles.length;i++){
              data.data.policyRelativeFiles[i].idShow=data.data.policyRelativeFiles[i].relativePolicyId
            }
            this.dataForm.policyRelativeFiles=data.data.policyRelativeFiles
          }

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
        var index = this.dataForm.policyRelativeFiles.indexOf(item)
        if (index !== -1) {
          this.dataForm.policyRelativeFiles.splice(index, 1)
        }
      },
      //搜索政策ID
      searchFile(fileIndex,id){
        this.$http({
          url: this.$http.adornUrl(`/biz/trpolicy/info/${id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.dataForm.policyRelativeFiles[fileIndex].title=data.data.title
          this.dataForm.policyRelativeFiles[fileIndex].fileNum=data.data.fileNum
          this.dataForm.policyRelativeFiles[fileIndex].relativePolicyId=data.data.id
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
          this.$http({
            url: this.$http.adornUrl('/biz/trpolicy/updateAuditNoPass'),
            method: 'GET',
            params: this.$http.adornParams({'id':this.dataForm.id,'auditFailReason':value})
          }).then(({data}) => {
            if (data && data.code == 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
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
            /*var taxS=this.dataForm.taxS
            if(this.dataForm.taxS.length!=0){
              if(taxS[0].taxId==undefined){
                this.dataForm.taxS=[];
                for(var i=0;i<taxS.length;i++){
                  this.dataForm.taxS.push({taxId:taxS[i]})
                }
              }
            }*/

            var taxArr=this.dataForm.taxS.join(',')

            if (valid) {
              if(this.dataForm.region==""){
                this.$message.error('政策地区不能为空')
                return false
              }
              this.$http({
                url: this.$http.adornUrl(`/biz/trpolicy/updateAuditPass`),
                method: 'post',
                data: this.$http.adornData({
                  'id': this.dataForm.id || undefined,
                  'title': this.dataForm.title,
                  'content':this.dataForm.content,
                  'tradeid':this.dataForm.tradeid,
                  'office':this.dataForm.office,
                  'officialReleaseDate':this.dataForm.officialReleaseDate,
                  'timelinessid':this.dataForm.timelinessid,
                  'style':this.dataForm.style,
                  'fileNum':this.dataForm.fileNum,
                  'userid':this.dataForm.userid,
                  'tax':taxArr,
                  'region':this.dataForm.region,
                  'province':this.dataForm.province,
                  'policyRelativeFiles':this.dataForm.policyRelativeFiles || undefined
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
