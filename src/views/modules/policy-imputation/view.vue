<template>
  <div class="mod-policy">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">查看</h2>
    <el-form label-position="left" label-width="120px" :model="dataForm" ref="dataForm">
      <el-form-item label="ID" prop="id">
        <el-input v-model="dataForm.id" :disabled="true" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="行业" prop="tradeidName">
        <el-input v-model="dataForm.tradeidName" :disabled="true" style="width:220px"></el-input>
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
      <el-form-item prop="timelinessidName" label="时效性">
        <el-input v-model="dataForm.timelinessidName" disabled clearable style="width:500px"></el-input>
      </el-form-item>
      <el-form-item label="税种" prop="taxName">
        <el-input v-model="dataForm.taxName" disabled clearable style="width:500px"></el-input>
      </el-form-item>
      <el-form-item prop="useridName" label="指导专家">
        <el-input v-model="dataForm.useridName" disabled clearable style="width:500px"></el-input>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime" >
        <el-input v-model="dataForm.createTime" :disabled="true" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="政策状态" prop="policyStatusName">
        <el-input v-model="dataForm.policyStatusName" :disabled="true" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <div v-html="dataForm.content" style="border: 1px solid #ccc;padding:0 10px"></div>
      </el-form-item>
      <el-form-item label="相关文件">
        <el-table
          :data="dataList"
          border
          v-loading="dataListLoading"
          :header-cell-style="{background: 'rgb(21, 161, 147)',color:'#fff'}"
          style="width: 100%;">
          <el-table-column
            prop="index"
            header-align="center"
            align="center"
            width="80"
            label="序号">
            <template  slot-scope="scope">
              <span>{{totalPage-scope.$index}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="relativePolicyId"
            header-align="center"
            align="center"
            label="ID">
          </el-table-column>
          <el-table-column
            prop="title"
            header-align="center"
            align="center"
            label="政策标题">
          </el-table-column>
          <el-table-column
            prop="fileNum"
            header-align="center"
            align="center"
            label="文件号">
          </el-table-column>
          <el-table-column
            prop="sort"
            header-align="center"
            align="center"
            label="排序">
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="相关解读">
        <el-table
          :data="dataList1"
          border
          v-loading="dataList1Loading"
          :header-cell-style="{background: 'rgb(21, 161, 147)',color:'#fff'}"
          style="width: 100%;">
          <el-table-column
            prop="index"
            header-align="center"
            align="center"
            width="80"
            label="序号">
            <template  slot-scope="scope">
              <span>{{totalPage1-scope.$index}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="id"
            header-align="center"
            align="center"
            label="ID">
          </el-table-column>
          <el-table-column
            prop="expertTitle"
            header-align="center"
            align="center"
            label="解读标题">
          </el-table-column>
          <el-table-column
            prop="userid"
            header-align="center"
            align="center"
            label="解读人">
          </el-table-column>
          <el-table-column
            prop="sort"
            header-align="center"
            align="center"
            label="排序">
          </el-table-column>
        </el-table>
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
        id:parseInt(this.$route.query.id) || undefined,
        tradeidName:'',
        title:'',
        officialReleaseDate:'',
        fileNum:'',
        office:'',
        timelinessidName:'',
        taxName:'',
        content:'',
        useridName:'',
        province:'',
        region:'',
        policyRelativeFiles: [],
        createTime:'',
        policyStatusName:'',
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
        url: this.$http.adornUrl(`/biz/trpolicy/info/${this.dataForm.id}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        this.dataForm.tradeidName=data.data.tradeidName
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
        this.dataForm.taxName =data.data.taxName
        this.dataForm.useridName=data.data.useridName
        this.dataForm.createTime = this.commonDate.formatTime('', '', data.data.createTime)
        this.dataForm.policyStatusName=data.data.policyStatusName
        this.dataForm.content=data.data.content
        this.dataList=data.data.policyRelativeFiles
        this.totalPage=data.data.policyRelativeFiles.length
        this.dataList1=data.data.policyRelativeExperts
        this.totalPage1=data.data.policyRelativeExperts.length
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
