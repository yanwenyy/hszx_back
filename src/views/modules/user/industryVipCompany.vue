<template>
  <div class="mod-policy">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.id" placeholder="企业ID" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.id" placeholder="企业名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.id" placeholder="管理员手机号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.id" placeholder="商品ID" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.taxs"
          clearable
          placeholder="行业" style="width: 150px">
          <el-option v-for="item in djList"
                     :label="item.name"
                     :value="item.id"
                     :key="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.taxs"
          clearable
          placeholder="卡种" style="width: 150px">
          <el-option v-for="item in djList"
                     :label="item.name"
                     :value="item.id"
                     :key="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker
          v-model="dataForm.releaseTime"
          type="daterange"
          range-separator="一"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="截止时间">
        <el-date-picker
          v-model="dataForm.releaseTime"
          type="daterange"
          range-separator="一"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.taxs"
          clearable
          placeholder="属性" style="width: 150px">
          <el-option v-for="item in djList"
                     :label="item.name"
                     :value="item.id"
                     :key="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.taxs"
          clearable
          placeholder="会员状态" style="width: 150px">
          <el-option v-for="item in djList"
                     :label="item.name"
                     :value="item.id"
                     :key="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList()">搜索</el-button>
        <el-button type="info" @click="resetForm()" >重置</el-button>
        <el-button type="info" @click="resetForm()" >导出</el-button>
        <!--<el-button type="danger" v-if="isAuth('biz:trpolicyoriginal:delete')" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>-->
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @sort-change='sortChange'
      :header-cell-style="{background: 'rgb(21, 161, 147)',color:'#fff'}"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        width="80"
        label="序号">
      </el-table-column>
      <el-table-column
        prop="title"
        header-align="center"
        align="center"
        label="企业ID">
      </el-table-column>
      <el-table-column
        prop="fileNum"
        header-align="center"
        align="center"
        label="企业名称">
      </el-table-column>
      <el-table-column
        prop="office"
        header-align="center"
        align="center"
        width="120px"
        label="企业管理员手机号">
      </el-table-column>
      <el-table-column
        prop="office"
        header-align="center"
        align="center"
        width="120px"
        label="商品ID">
      </el-table-column>
      <el-table-column
        prop="office"
        header-align="center"
        align="center"
        width="120px"
        label="行业">
      </el-table-column>
      <el-table-column
        prop="office"
        header-align="center"
        align="center"
        width="120px"
        label="卡种">
      </el-table-column>
      <el-table-column
        prop="officialReleaseDate"
        header-align="center"
        align="center"
        width="120px"
        label="属性">
      </el-table-column>
      <el-table-column
        prop="officialReleaseDate"
        header-align="center"
        align="center"
        width="120px"
        label="会员状态">
      </el-table-column>
      <el-table-column
        prop="officialReleaseDate"
        header-align="center"
        align="center"
        width="120px"
        label="开始日期">
      </el-table-column>
      <el-table-column
        prop="officialReleaseDate"
        header-align="center"
        align="center"
        width="120px"
        label="截止日期">
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        myHeaders: {
          token: this.$cookie.get('token')
        },
        dataForm: {
          id:'',
          title:'',
          fileNum:'',
          timelinessid:'',
          taxs:'',
          tags:'',
          office:'',
          province:'',
          region:'',
          status:'',
          releaseTime:'',
          createTime:''
        },
        managerVisible:false,
        djList:[],
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        fileListUpload:[],
        fullscreenLoading: false
      }
    },
    activated () {
      this.getDataList()
    },
    mounted(){
    },
    methods: {
      // 设置管理员
      setMaganger (id) {
        this.managerVisible = true
        this.$nextTick(() => {
          this.$refs.Maganer.init(id)
        })
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      //重置搜索条件
      resetForm(){
        this.dataForm={
          id:'',
          title:'',
          fileNum:'',
          timelinessid:'',
          tags:'',
          taxs:'',
          province:'',
          region:'',
          status:'',
          releaseTime:'',
          createTime:''
        }
        this.$refs.child.reset()
      },
      //排序
      sortChange (column, prop, order){
        if(column.order=='descending'){
          column.order='desc'
        }
        if(column.order=='ascending'){
          column.order='asc'
        }
        this.prop=column.prop
        this.order=column.order
        this.getDataList ()
      },
      // 删除
      deleteHandle (id,status) {
        var policyId = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        });
        this.$confirm(`您确定要删除${policyId.length > 1 ? '[id=' + policyId.join(',') + ']':'该'}政策原文吗？`, ``, {
          confirmButtonText: `确定`,
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/biz/trpolicyoriginal/delete'),
            method: 'post',
            data: this.$http.adornData(policyId,false)
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
              if (data.message == undefined) {
                this.$message.error(data.msg)
              } else {
                this.$message.error(data.message)
              }
            }
          })
        })
      },
      // 获取数据列表
      getDataList () {
        var releaseStartTime='',releaseLastTime='',createTimeStart='',createTimeEnd=''
        if(this.dataForm.releaseTime!=undefined&&this.dataForm.releaseTime!=""&&this.dataForm.releaseTime!=null&&this.dataForm.releaseTime.length!=0){
          releaseStartTime=this.dataForm.releaseTime[0]
          releaseLastTime=this.dataForm.releaseTime[1]
        }
        if(this.dataForm.createTime!=undefined&&this.dataForm.createTime!=""&&this.dataForm.createTime!=null&&this.dataForm.createTime.length!=0){
          createTimeStart=this.dataForm.createTime[0]
          createTimeEnd=this.dataForm.createTime[1]
        }
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/biz/trpolicyoriginal/list'),
          method: 'get',
          params: this.$http.adornParams({
            'pageNum': String(this.pageIndex),
            'pageSize': String(this.pageSize),
            'id':this.dataForm.id|| undefined,
            'tags':this.dataForm.tags|| undefined,
            'title':this.dataForm.title|| undefined,
            'fileNum':this.dataForm.fileNum|| undefined,
            'office':this.dataForm.office|| undefined,
            'timelinessid':this.dataForm.timelinessid|| undefined,
            'taxs':this.dataForm.taxs|| undefined,
            'province':this.dataForm.province|| undefined,
            'region':this.dataForm.region|| undefined,
            'status':this.dataForm.status|| undefined,
            'releaseStartTime':releaseStartTime || undefined,
            'releaseLastTime':releaseLastTime || undefined,
            'createTimeStart':createTimeStart || undefined,
            'createTimeEnd':createTimeEnd || undefined,
            'sid':this.prop ,
            'order':this.order
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
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      }

    }
  }
</script>
<style>
  .distpicker-address-wrapper select{height: 36px;line-height: 40px;padding:0.15rem 0.75rem}
</style>
