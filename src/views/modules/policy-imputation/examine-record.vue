<template>
  <div class="mod-policy">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">审核记录</h2>
    <el-form label-position="left" label-width="120px" :model="dataForm" ref="dataForm">
      <div>
        <el-form label-position="left" label-width="100px"  :model="dataForm" ref="dataForm" style="border:1px solid #ccc;padding-left:50px;padding-top:25px;margin-bottom:30px">
          <el-form-item label="政策ID" prop="id">
          <el-input v-model="dataForm.id" :disabled="true" style="width:250px"></el-input>
          </el-form-item>
          <el-form-item label="政策标题" prop="user">
            <el-input v-model="dataForm.title" :disabled="true" style="width:250px"></el-input>
          </el-form-item>
          <el-form-item label="文件号">
            <el-input v-model="dataForm.fileNum" :disabled="true" style="width:250px"></el-input>
          </el-form-item>
        </el-form>
      </div>
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
            prop="auditProcess"
            header-align="center"
            align="center"
            label="审核流程">
            <template slot-scope="scope">
              <span>{{scope.row.auditProcess}}</span>
              <el-button type="text" v-if="scope.row.auditProcess=='下线'" @click="$router.push({ name: 'policy-imputation-examine-offline-view',query:{id:scope.row.id,policyId:$route.query.id} })">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="auditStatus"
            header-align="center"
            align="center"
            label="状态">
          </el-table-column>
          <el-table-column
            prop="applyIdName"
            header-align="center"
            align="center"
            label="申请人">
          </el-table-column>
          <el-table-column
            prop="applyTime"
            header-align="center"
            align="center"
            label="时间">
          </el-table-column>
          <el-table-column
            prop="auditIdName"
            header-align="center"
            align="center"
            label="审核人">
          </el-table-column>
          <el-table-column
            prop="auditTime"
            header-align="center"
            align="center"
            label="时间">
          </el-table-column>
          <el-table-column
            prop="auditFailReason"
            header-align="center"
            align="center"
            label="审核失败原因">
          </el-table-column>
        </el-table>
      <el-form-item style="text-align: center;margin-top:30px">
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
        title:'',
        fileNum:''
      },
      dataList:[],
      dataListLoading:false,
      totalPage:0
    }
  },
  mounted(){
    if( this.dataForm.id!=undefined) {
      this.$http({
        url: this.$http.adornUrl(`/biz/trpolicy/info/${this.dataForm.id}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        this.dataForm.title = data.data.title
        this.dataForm.fileNum = data.data.fileNum
      })
      this.$http({
        url: this.$http.adornUrl(`/biz/trpolicy/auditRecord/{id}`),
        method: 'get',
        params: this.$http.adornParams({
          pageNum:1,
          pageSize:99999,
          id:this.dataForm.id
        })
      }).then(({data}) => {
        this.dataList=data.data.list
        this.totalPage=data.data.list.length
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
