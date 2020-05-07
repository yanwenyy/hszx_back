<template>
  <div class="mod-policy">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">操作记录（风险提示）</h2>
    <el-form label-position="left" label-width="120px" :model="dataForm" ref="dataForm">
      <div>
        <el-form label-position="left" label-width="100px"  :model="dataForm" ref="dataForm" style="border:1px solid #ccc;padding-left:50px;padding-top:25px;margin-bottom:30px">
          <el-form-item label="ID" prop="id">
          <el-input v-model="dataForm.id" :disabled="true" style="width:250px"></el-input>
          </el-form-item>
          <el-form-item label="标题" prop="user">
            <el-input v-model="dataForm.title" :disabled="true" style="width:250px"></el-input>
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
            prop="operate"
            header-align="center"
            align="center"
            label="操作类型">
          </el-table-column>
          <el-table-column
            prop="operateUserStr"
            header-align="center"
            align="center"
            label="操作人">
          </el-table-column>
          <el-table-column
            prop="createTime"
            header-align="center"
            align="center"
            label="操作时间">
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
      dataForm:{
        id:parseInt(this.$route.query.id) || undefined,
        title:this.$route.query.title
      },
      dataList: [],
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: []
    }
  },
  mounted(){
    if( this.dataForm.id!=undefined) {
      this.$http({
        url: this.$http.adornUrl(`/biz/operatelog/list`),
        method: 'get',
        params: this.$http.adornParams({
          'pageNum': '1',
          'pageSize': '99999',
          'dataId':this.dataForm.id,
          'moudle':3
        })
      }).then(({data}) => {
        if (data && data.code == 200) {
          this.dataList = data.data.list
          this.totalPage = data.data.totalCount
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
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
