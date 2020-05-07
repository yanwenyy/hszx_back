<template>
  <div class="mod-policy">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">审核记录</h2>
    <el-form label-position="left" label-width="120px" :model="dataForm" ref="dataForm">
      <div>
        <el-form label-position="left" label-width="100px"  :model="dataForm" ref="dataForm" style="border:1px solid #ccc;padding-left:50px;padding-top:25px;margin-bottom:30px">
          <el-form-item label="解读ID">
          <el-input v-model="dataForm.id" :disabled="true" style="width:250px"></el-input>
          </el-form-item>
          <el-form-item label="政策标题">
            <el-input v-model="dataForm.title" :disabled="true" style="width:500px"></el-input>
          </el-form-item>
        </el-form>
      </div>
        <el-table
          :data="dataList"
          border
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
            prop="auditProcessName"
            header-align="center"
            align="center"
            label="审核流程">
            <template slot-scope="scope">
              <span>{{scope.row.auditProcessName}}</span>
              <el-button type="text" v-if="scope.row.auditProcess==3" @click="$router.push({ name: 'relative-expert-examine-offline-view',query:{id:scope.row.id,expertId:$route.query.id} })">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="auditStatusName"
            header-align="center"
            align="center"
            label="状态">
          </el-table-column>
          <el-table-column
            prop="applyName"
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
            prop="auditName"
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
      <el-form-item style="text-align: center;margin-top:50px">
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
      dataList:[],
      totalPage: 0,
      dataForm:{
        id:parseInt(this.$route.query.id) || undefined,
        title:this.$route.query.title
      }
    }
  },
  mounted(){
    if( this.dataForm.id!=undefined) {
      this.$http({
        url: this.$http.adornUrl(`/biz/trpolicyrelativeexpert/expertAduitRecprd/${this.dataForm.id}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        this.totalPage=data.data.length
        this.dataList=data.data
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
