<template>
  <div class="mod-policy">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-button type="warning" v-if="isAuth('biz:trpolicyoriginal:save')" @click="$router.push({ name: 'shareholder-add-or-update'})">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.id" placeholder="ID" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.name"
          clearable
          placeholder="股东机构名称">
          <el-option v-for="item in gdList"
                     :label="item.name"
                     :value="item.name"
                     :key="item.name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.pid"
          clearable
          placeholder="所属运营中心" >
          <el-option v-for="item in nameList"
                     :label="item.name"
                     :value="item.id"
                     :key="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.ifShare"
          clearable
          placeholder="分成状态" >
          <el-option v-for="item in fcList"
                     :label="item.label"
                     :value="item.value"
                     :key="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.contractState"
          clearable
          placeholder="合同状态" >
          <el-option v-for="item in htList"
                     :label="item.label"
                     :value="item.value"
                     :key="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.ifTax"
          clearable
          placeholder="是否扣税" >
          <el-option v-for="item in ksList"
                     :label="item.label"
                     :value="item.value"
                     :key="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="合同过期时间">
        <el-date-picker
          v-model="dataForm.releaseTime"
          type="daterange"
          range-separator="一"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
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
        label="股东机构名称">
      </el-table-column>
      <el-table-column
        prop="ppIdName"
        header-align="center"
        align="center"
        label="所属城市运营中心">
      </el-table-column>
      <el-table-column
        prop="adminNum"
        header-align="center"
        align="center"
        width="120px"
        label="小程序管理员">
      </el-table-column>
      <el-table-column
        prop="saleNum"
        header-align="center"
        align="center"
        width="120px"
        label="股东销售">
      </el-table-column>
      <el-table-column
        prop="agentNum"
        header-align="center"
        align="center"
        width="120px"
        label="经销商">
      </el-table-column>
      <el-table-column
        prop="ifTax"
        header-align="center"
        align="center"
        width="120px"
        label="是否扣税">
        <template slot-scope="scope">
            {{scope.row.ifTax==0?'无需扣税':'扣税'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="ifShare"
        header-align="center"
        align="center"
        width="120px"
        label="分成状态">
        <template slot-scope="scope">
          {{scope.row.ifShare==0?'关闭':'开启'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="contractState"
        header-align="center"
        align="center"
        width="120px"
        label="合同状态">
      </el-table-column>
      <el-table-column
        prop="officialReleaseDate"
        header-align="center"
        align="center"
        width="120px"
        sortable="custom"
        :formatter="commonDate.formatDate"
        label="合同日期">
        <template slot-scope="scope">
          <span v-show="scope.row.contractStart&&scope.row.contractEnd">{{scope.row.contractStart+"至"+scope.row.contractEnd}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        width="120px"
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
          <el-button type="text" size="small" v-if="isAuth('biz:trpolicyoriginal:update')"  @click="$router.push({ name: 'shareholder-add-or-update',query:{id:scope.row.id} })">编辑</el-button>
          <el-button type="text" size="small" v-if="isAuth('biz:trpolicyoriginal:info')" @click="$router.push({ name: 'shareholder-view',query:{id:scope.row.id} })">查看</el-button>
          <el-button type="text" size="small" v-if="isAuth('biz:trpolicyoriginal:delete')" @click="deleteHandle(scope.row.id)">删除</el-button>
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
          pid:'',
          ifShare:'',
          contractState:'',
          ifTax:'',
          releaseTime:'',
          createTime:''
        },
        managerVisible:false,
        gdList:[],
        nameList:[],
        fcList:[
          {
            label:'开启',
            value:'1'
          },
          {
            label:'关闭',
            value:'0'
          },
        ],
        htList:[
          {
            label:'未开始',
            value:'1'
          },
          {
            label:'有效',
            value:'2'
          },
          {
            label:'过期',
            value:'3'
          },
        ],
        ksList:[
          {
            label:'扣税',
            value:'1'
          },
          {
            label:'无需扣税',
            value:'0'
          },
        ],
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
      //股东机构列表
      this.$http({
        url: this.$http.adornUrl('/biz/organization/shareholderListOfNoPaging'),
        method: 'GET',
      }).then(({data}) => {
        this.gdList = data.data
      });
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
          pid:'',
          ifShare:'',
          contractState:'',
          ifTax:'',
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
        this.$confirm(`您确定要删除${policyId.length > 1 ? '[id=' + policyId.join(',') + ']':'该'}股东吗？`, ``, {
          confirmButtonText: `确定`,
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/biz/organization/deleteShareholder/'+policyId),
            method: 'GET',
            // data: this.$http.adornData(policyId,false)
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
          url: this.$http.adornUrl('/biz/organization/shareholderListOfPaging'),
          method: 'get',
          params: this.$http.adornParams({
            'pageNum': String(this.pageIndex),
            'pageSize': String(this.pageSize),
            'id':this.dataForm.id|| undefined,
            'name':this.dataForm.name|| undefined,
            'pid':this.dataForm.pid|| undefined,
            'ifShare':this.dataForm.ifShare|| undefined,
            'contractState':this.dataForm.contractState|| undefined,
            'ifTax':this.dataForm.ifTax|| undefined,
            'contractStart':releaseStartTime || undefined,
            'contractEnd':releaseLastTime || undefined,
            'createTimeStart':createTimeStart || undefined,
            'createTimeEnd':createTimeEnd || undefined
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
