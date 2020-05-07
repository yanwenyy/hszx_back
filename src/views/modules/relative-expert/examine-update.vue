<template>
  <div class="mod-policy">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">{{titleTxt}}</h2>
    <el-form label-position="left" label-width="120px" :model="dataForm" :rules="dataRule" ref="dataForm">
      <div style="border:1px solid #ccc;padding-left:50px;padding-top:25px;margin-bottom:30px">
        <el-form-item label="解读ID" prop="id" style="display:inline-block">
          <el-input v-model="dataForm.id" :disabled="true" style="width:250px"></el-input>
        </el-form-item>
        <el-form-item label="申请人" prop="applyName" style="display:inline-block;margin-left:50px">
          <el-input v-model="dataForm.applyName" :disabled="true" style="width:250px"></el-input>
        </el-form-item>
        <el-form-item label="审核类型" style="display:inline-block">
          <el-input value="申请上线"  :disabled="true" style="width:250px"></el-input>
        </el-form-item>
        <el-form-item label="申请时间" prop="applyTime" style="display:inline-block;margin-left:50px">
          <el-input v-model="dataForm.applyTime" :disabled="true" style="width:250px"></el-input>
        </el-form-item>
      </div>
      <p><span style="color:red">*</span>选择关联政策</p>
      <div style="border:1px solid #ccc;padding-left:50px;padding-top:10px;margin-bottom:30px;position: relative">
        <el-form-item style="margin:0 0 10px 0;color:#303133" label="政策ID" prop="policyId"><el-input style="width:220px" v-model="dataForm.idShow"></el-input></el-form-item>
        <el-button v-show="false" v-model="dataForm.policyId"></el-button>
        <el-button type="primary" style="float: left;margin-right: 5px;z-index: 1;position: absolute;top: 10px;left: 400px;" @click="searchFile(dataForm.idShow)">搜索</el-button>
        <el-form-item style="display:inline-block;margin: 5px 0 10px 0;color:#303133" label="政策标题"><el-input style="width:220px" disabled v-model="dataForm.policyTitle"></el-input></el-form-item>
        <el-form-item style="display:inline-block;margin: 5px 0 10px 50px;color:#303133" label="政策文件号"><el-input style="width:220px" disabled v-model="dataForm.policyFileNum"></el-input></el-form-item>
        <div style="margin:10px 0"><el-button type="primary" size="mini" v-if="isAuth('biz:trpolicy:info')" @click="$router.push({ name: 'policy-imputation-view',query:{id:dataForm.policyId} })">查看政策</el-button></div>
      </div>
      <el-form-item label="解读ID" prop="id" v-if="addHide==true">
        <el-input v-model="dataForm.id" :disabled="true" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="解读标题" prop="expertTitle">
        <el-input v-model="dataForm.expertTitle" clearable placeholder="请输入解读标题" style="width:500px"></el-input>
      </el-form-item>
      <el-form-item prop="userid" label="作者">
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
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="dataForm.sort" :disabled="addHide" controls-position="right" :min="1" label="排序"></el-input-number>
        <p style="color:#999">可填写数字如：“1”，数字越大排序越靠前，该设置决定本篇解读在小程序“相关解读”中的排序情况</p>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime" v-if="addHide==true">
        <el-input v-model="dataForm.createTime" :disabled="true" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <template>
          <UEditor :key="'editor_relative_expert'" :val="dataForm.id" :id='"editor_relative_expert"':index="0" :econtent="dataForm.content" :modelname="'relative_expert'" @func="editorContent" ></UEditor>
        </template>
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
        expertTitle:'',
        sort:'',
        status:'',
        applyTime:'',
        applyName:''
      },
      dataRule:{
        policyId:[
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
        sort:[
          {required: true, message: '排序不能为空', trigger: 'blur'}
        ]
      }
    }
  },
  mounted(){
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
    //详情
    if( this.dataForm.id!=undefined) {
      this.$http({
        url: this.$http.adornUrl(`/biz/trpolicyrelativeexpert/applyDownlineInfo`),
        method: 'get',
        params: this.$http.adornParams({expertId:this.dataForm.id})
      }).then(({data}) => {
        this.dataForm.applyTime=data.data[0].applyTime
        this.dataForm.applyName=data.data[0].applyName
      })
      this.$http({
        url: this.$http.adornUrl(`/biz/trpolicyrelativeexpert/updateinfo/${this.dataForm.id}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        this.addHide=true
        this.dataForm.idShow=data.data.policyId
        this.dataForm.policyId=data.data.policyId
        this.dataForm.policyTitle=data.data.policyTitle
        this.dataForm.policyFileNum=data.data.policyFileNum
        this.dataForm.expertTitle = data.data.expertTitle
        this.dataForm.sort = data.data.sort
        this.dataForm.userid=data.data.userid
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
        url: this.$http.adornUrl(`/biz/trpolicyrelativeexpert/searchPolicyById`),
        method: 'post',
        params: this.$http.adornParams({policyId:id})
      }).then(({data}) => {
        this.dataForm.policyId=data.data.id
        this.dataForm.policyFileNum=data.data.fileNum
        this.dataForm.policyTitle=data.data.title
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
          url: this.$http.adornUrl('/biz/trpolicyrelativeexpert/applyUpdateNoPass'),
          method: 'GET',
          params: this.$http.adornParams({'expertId':this.dataForm.id,'auditFailReason':value})
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
        this.$http({
          url: this.$http.adornUrl(`/biz/trpolicyrelativeexpert/applyUpdatePass`),
          method: 'post',
          data: this.$http.adornData({
            'id': this.dataForm.id || undefined,
            'policyId':this.dataForm.policyId,
            'expertTitle': this.dataForm.expertTitle,
            'content':this.dataForm.content,
            'userid':this.dataForm.userid,
            'sort':this.dataForm.sort ,
            'status':this.dataForm.status
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
        /*this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/biz/trpolicyrelativeexpert/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'policyId': this.dataForm.policyId,
                'expertTitle': this.dataForm.expertTitle,
                'content': this.dataForm.content,
                'userid': this.dataForm.userid,
                'sort': this.dataForm.sort || undefined,
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
        })*/
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
