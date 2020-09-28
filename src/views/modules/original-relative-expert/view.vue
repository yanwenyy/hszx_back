<template>
  <div class="mod-policy">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">查看</h2>
    <el-form label-position="left" label-width="120px" :model="dataForm"  ref="dataForm">
      <p>选择关联政策</p>
      <div style="border:1px solid #ccc;padding-left:50px;padding-top:10px;margin-bottom:30px;position: relative">
        <el-form-item style="margin:0 0 10px 0;color:#303133" label="政策ID" prop="policyId"><el-input style="width:220px" disabled v-model="dataForm.policyId"></el-input></el-form-item>
        <el-form-item style="display:inline-block;margin: 5px 0 10px 0;color:#303133" label="政策标题"><el-input style="width:220px" disabled v-model="dataForm.policyTitle"></el-input></el-form-item>
        <el-form-item style="display:inline-block;margin: 5px 0 10px 50px;color:#303133" label="政策文件号"><el-input style="width:220px" disabled v-model="dataForm.policyFileNum"></el-input></el-form-item>
        <div style="margin:10px 0"><el-button type="primary" size="mini" v-if="isAuth('biz:trpolicy:info')" @click="$router.push({ name: 'policy-imputation-view',query:{id:dataForm.policyId} })">查看政策</el-button></div>
      </div>
      <el-form-item label="解读ID" prop="id">
        <el-input v-model="dataForm.id" :disabled="true" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="解读标题" prop="expertTitle">
        <el-input v-model="dataForm.expertTitle" disabled clearable placeholder="请输入解读标题" style="width:500px"></el-input>
      </el-form-item>
      <el-form-item prop="userid" label="作者">
        <el-select
          v-model="dataForm.userid"
          clearable
          disabled
          style="width: 220px">
          <el-option v-for="item in userList"
                     :label="item.realname"
                     :value="item.uuid"
                     :key="item.uuid">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="dataForm.sort" disabled controls-position="right" :min="1" label="排序"></el-input-number>
        <p style="color:#999">可填写数字如：“1”，数字越大排序越靠前，该设置决定本篇解读在小程序“相关解读”中的排序情况</p>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime" >
        <el-input v-model="dataForm.createTime" :disabled="true" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="发布日期" prop="releaseDate" >
        <el-input v-model="dataForm.releaseDate" :disabled="true" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status" >
        <el-input :value="dataForm.status==0?'隐藏':'在线'" :disabled="true" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="content">
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
      userList:[],
      dataForm:{
        releaseDate:'',
        id:parseInt(this.$route.query.id) || undefined,
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
        status:''
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
        url: this.$http.adornUrl(`/biz/trpolicyoriginalrelativeexpert/info/${this.dataForm.id}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        this.dataForm.releaseDate=data.data.releaseDate;
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
    //获取富文本内容
    editorContent(modelname,index,content){
      console.log(modelname)
      this.dataForm.content=content
    },
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
</style>
