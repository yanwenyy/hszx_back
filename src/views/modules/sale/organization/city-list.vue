<template>
  <div class="mod-policy">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-button type="warning" v-if="isAuth('biz:trpolicyoriginal:save')" @click="$router.push({ name: 'city-add-or-update'})">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.id" placeholder="中心ID" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select clearable
          v-model="dataForm.name"
          placeholder="中心名称">
          <el-option v-for="item in nameList"
                     :label="item.name"
                     :value="item.name"
                     :key="item.name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select clearable
          v-model="dataForm.level"
          placeholder="中心等级">
          <el-option v-for="item in djList"
                     :label="item.label"
                     :value="item.value"
                     :key="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="添加时间">
        <el-date-picker
          v-model="dataForm.createTime"
          type="daterange"
          range-separator="一"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList()">搜索</el-button>
        <el-button type="info" @click="resetForm()" >重置</el-button>
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
        prop="id"
        header-align="center"
        align="center"
        width="80"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="中心名称">
      </el-table-column>
      <el-table-column
        prop="shareBase"
        header-align="center"
        align="center"
        label="中心占股">
      </el-table-column>
      <el-table-column
        prop="level"
        header-align="center"
        align="center"
        label="等级">
        <template slot-scope="scope">
          {{ scope.row.level==0?'总代':scope.row.level==1?'1级':scope.row.level==2?'2级':scope.row.level==3?'3级':'无'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="shareholderNum"
        header-align="center"
        align="center"
        label="股东数量">
      </el-table-column>
      <el-table-column
        prop="agentNum"
        header-align="center"
        align="center"
        label="代理商数量">
      </el-table-column>
      <el-table-column
        prop="saleNum"
        header-align="center"
        align="center"
        label="中心销售">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        sortable="custom"
        :formatter="commonDate.formatDate"
        label="添加时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="200"
        label="操作">
        <template slot-scope="scope">
          <!--<el-button type="text" size="small" v-if="isAuth('biz:trpolicyoriginal:update')"  @click="setMaganger()">设置后台管理员</el-button>-->
          <el-button type="text" size="small" v-if="isAuth('biz:trpolicyoriginal:update')"  @click="$router.push({ name: 'city-add-or-update',query:{id:scope.row.id} })">编辑</el-button>
          <el-button type="text" size="small" v-if="isAuth('biz:trpolicyoriginal:info')" @click="$router.push({ name: 'city-view',query:{id:scope.row.id} })">查看</el-button>
          <el-button type="text" size="small" v-if="isAuth('biz:trpolicyoriginal:delete')" @click="deleteHandle(scope.row.id,scope.row.name)">删除</el-button>
        </template>
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
    <!-- 添加管理员 -->
    <City-Manerger v-if="managerVisible" ref="Maganer" @refreshDataList="getDataList"></City-Manerger>
  </div>
</template>

<script>
  import CityManerger from './city-manager'
  export default {
    components: {CityManerger},
    data () {
      return {
        myHeaders: {
          token: this.$cookie.get('token')
        },
        dataForm: {
          id:'',
          name:'',
          level:'',
          createTime:'',
        },
        managerVisible:false,
        djList:[
          {
            label:'总代',
            value:0,
          },
          {
            label:'1级',
            value:1,
          },
          {
            label:'2级',
            value:2,
          },
          {
            label:'3级',
            value:3,
          },
          {
            label:'无',
            value:-1,
          }
        ],//等级列表
        nameList:[],//中心列表
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
      //中心列表
      this.$http({
        url: this.$http.adornUrl('/biz/organization/centerListOfNoPaging'),
        method: 'GET',
      }).then(({data}) => {
        this.nameList = data.data
      })
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
          name:'',
          level:'',
          createTime:'',
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
      deleteHandle (id,name) {
        this.$confirm(`您确定要删除${name}`, ``, {
          confirmButtonText: `确定`,
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/biz/organization/deleteCenter/'+id),
            method: 'GET',
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
        var createTimeStart='',createTimeEnd='';
        if(this.dataForm.createTime!=undefined&&this.dataForm.createTime!=""&&this.dataForm.createTime!=null&&this.dataForm.createTime.length!=0){
          createTimeStart=this.dataForm.createTime[0]
          createTimeEnd=this.dataForm.createTime[1]
        }
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/biz/organization/centerListOfPaging'),
          method: 'get',
          params: this.$http.adornParams({
            'pageNum': String(this.pageIndex),
            'pageSize': String(this.pageSize),
            'id':this.dataForm.id|| undefined,
            'name':this.dataForm.name|| undefined,
            'level':this.dataForm.level|| undefined,
            'start':createTimeStart || undefined,
            'end':createTimeEnd || undefined,
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

</style>
