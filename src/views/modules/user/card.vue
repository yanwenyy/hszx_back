<template>
  <div class="mod-policy">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-button type="warning" v-if="isAuth('biz:trpolicyoriginal:save')" @click="$router.push({ name: 'card-add-or-update'})">新增</el-button>
        <el-button type="primary" v-if="isAuth('biz:trpolicyoriginal:save')" @click="$router.push({ name: 'card-member-list'})">查看人员列表</el-button>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.name" placeholder="主体名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.vipStatus"
          clearable
          placeholder="会员状态">
          <el-option v-for="item in vipList"
                     :label="item.label"
                     :value="item.value"
                     :key="item.label">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.create_by" placeholder="添加人" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.update_by" placeholder="最近操作人" clearable></el-input>
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
      <el-form-item label="过期时间">
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
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        type="index"
        header-align="center"
        align="center"
        width="80"
        label="序号">
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="主体名称">
      </el-table-column>
      <el-table-column
        prop="personNum"
        header-align="center"
        align="center"
        label="当前人数">
      </el-table-column>
      <el-table-column
        prop="vipStatus"
        header-align="center"
        align="center"
        width="120px"
        label="会员状态">
      </el-table-column>
      <el-table-column
        prop="startTime"
        header-align="center"
        align="center"
        width="120px"
        label="开始时间">
      </el-table-column>
      <el-table-column
        prop="endTime"
        header-align="center"
        align="center"
        width="120px"
        label="过期时间">
      </el-table-column>
      <el-table-column
        prop="createBy"
        header-align="center"
        align="center"
        width="120px"
        label="添加人">
      </el-table-column>
      <el-table-column
        prop="updateBy"
        header-align="center"
        align="center"
        width="120px"
        label="最近操作人">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="200"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" v-if="isAuth('biz:trpolicyoriginal:update')"  @click="$router.push({ name: 'card-member-manage',query:{id:scope.row.id} })">人员管理</el-button>
          <el-button type="text" size="small" v-if="isAuth('biz:trpolicyoriginal:info')" @click="$router.push({ name: 'card-add-or-update',query:{id:scope.row.id} })">编辑</el-button>
          <el-button type="text" size="small" v-if="isAuth('biz:trpolicyoriginal:delete')" @click="$router.push({ name: 'card-view',query:{id:scope.row.id} })">查看</el-button>
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
          name:'',
          vipStatus:'',
          create_by:'',
          update_by:'',
          createTime:'',
          releaseTime:'',
          endtimeOrder:'asc',
          personNumOrder:'asc',
        },
        managerVisible:false,
        vipList:[
          {
            label:'过期',
            value:'1'
          },
          {
            label:'有效',
            value:'2'
          }
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
          name:'',
          vipStatus:'',
          create_by:'',
          update_by:'',
          createTime:'',
          releaseTime:'',
          starttimeOrder:'asc',
          endtimeOrder:'asc',
          personNumOrder:'asc',
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
        this.$confirm(`您确定要删除${policyId.length > 1 ? '[id=' + policyId.join(',') + ']':'该'}卡吗？`, ``, {
          confirmButtonText: `确定`,
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/delete'),
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
          url: this.$http.adornUrl('/list'),
          method: 'get',
          params: this.$http.adornParams({
            'pageNum': String(this.pageIndex),
            'pageSize': String(this.pageSize),
            'name':this.dataForm.name|| undefined,
            'vipStatus':this.dataForm.vipStatus|| undefined,
            'create_by':this.dataForm.create_by|| undefined,
            'update_by':this.dataForm.update_by|| undefined,
            'starttimeStart':releaseStartTime || undefined,
            'starttimeEnd':releaseLastTime || undefined,
            'endtimeStart':createTimeStart || undefined,
            'endtimeEnd':createTimeEnd || undefined,
            'starttimeOrder':this.dataForm.starttimeOrder|| undefined,
            'endtimeOrder':this.dataForm.endtimeOrder|| undefined,
            'personNumOrder':this.dataForm.personNumOrder|| undefined,
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
