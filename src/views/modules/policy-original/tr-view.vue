<template>
  <div class="mod-policy">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">查看</h2>
    <el-form label-position="left" label-width="120px" :model="dataForm" ref="dataForm">
      <el-form-item label="ID" prop="id">
        <el-input v-model="dataForm.id" :disabled="true" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="dataForm.title" disabled placeholder="请输入标题" style="width:500px"></el-input>
      </el-form-item>
      <el-form-item label="官方发布日期" prop="officialReleaseDate">
        <el-input v-model="dataForm.officialReleaseDate" :disabled="true" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="文件号" prop="fileNum">
        <el-input v-model="dataForm.fileNum" disabled clearable placeholder="请输入文件号" style="width:500px"></el-input>
      </el-form-item>
      <el-form-item label="发文机关" prop="office">
        <el-input v-model="dataForm.office" disabled clearable placeholder="请输入官方身份" style="width:500px"></el-input>
        <p style="color: #999;margin: 5px 0 0 0;padding: 0;line-height: 12px">注：多个身份需用英文“,”进行分割</p>
      </el-form-item>
      <el-form-item label="政策地区" pror="province"  style="text-align:left">
        <el-input v-model="dataForm.province" disabled clearable style="width:500px"></el-input>
      </el-form-item>
      <el-form-item prop="timelinessidName" label="原文时效性">
        <el-input v-model="dataForm.timelinessidName" disabled clearable style="width:500px"></el-input>
      </el-form-item>
      <el-form-item label="原文税种" prop="taxName">
        <el-input v-model="dataForm.taxName" disabled clearable style="width:500px"></el-input>
      </el-form-item>
      <el-form-item label="原文标签" prop="tagName">
        <el-input v-model="dataForm.tagName" disabled clearable style="width:500px"></el-input>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime" >
        <el-input v-model="dataForm.createTime" :disabled="true" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="policyStatusName">
        <el-input v-model="dataForm.statusName" :disabled="true" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="政策附件">
        <p style="margin: 0;padding: 0" v-for="item in dataForm.annexList"><a :href="'http://'+item.fileOriginalName">{{item.fileRealName}}</a></p>
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
      dataForm:{
        annexList:[],
        id:parseInt(this.$route.query.id) || undefined,
        title:'',
        officialReleaseDate:'',
        fileNum:'',
        office:'',
        timelinessidName:'',
        taxName:'',
        tagName:'',
        content:'',
        province:'',
        region:'',
        createTime:'',
        statusName:'',
      },
      totalPage:0,
      totalPage1:0,
      dataList:[],
      dataListLoading:false,
      dataList1:[],
      dataList1Loading:false
    }
  },
  mounted(){
    if( this.dataForm.id!=undefined) {
      this.$http({
        url: this.$http.adornUrl(`/biz/trpolicyoriginal/info/${this.dataForm.id}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        this.dataForm.title = data.data.title
        this.dataForm.officialReleaseDate = data.data.officialReleaseDate
        this.dataForm.fileNum = data.data.fileNum
        this.dataForm.office = data.data.office
        if(data.data.province==data.data.region){
          this.dataForm.province = data.data.province
        }else{
          if(data.data.region!=null){
            this.dataForm.province = data.data.province+' '+data.data.region
          }else{
            this.dataForm.province = data.data.province
          }
        }
        this.dataForm.timelinessidName = data.data.timelinessidName,
        this.dataForm.taxName =data.data.taxsName
        this.dataForm.tagName=data.data.tagsName
        this.dataForm.annexList=data.data.annexList
        this.dataForm.createTime = this.commonDate.formatTime('', '', data.data.createTime)
        this.dataForm.statusName=data.data.statusName
        this.dataForm.content=data.data.content
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
</style>
