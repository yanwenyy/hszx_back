<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-button type="warning" v-if="isAuth('biz:trtag:save')" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.type"
          clearable
          placeholder="模块">
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.tagName" placeholder="标签" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.status"
          clearable
          placeholder="状态">
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList()">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      @sort-change='sortChange'
      style="width: 100%;">
      <el-table-column
        prop="tagId"
        header-align="center"
        align="center"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        label="模块">
        <template slot-scope="scope">
          <span>{{scope.row.type==1?'政策原文':'政策条文'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="tagName"
        header-align="center"
        align="center"
        label="标签">
      </el-table-column>
      <el-table-column
        prop="insertTime"
        header-align="center"
        align="center"
        :formatter="commonDate.formatTime"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="状态">
        <template slot-scope="scope">
          <el-button type="text" v-if="scope.row.status==0" @click="updateShowFlag(scope.row.tagId,0)">隐藏</el-button>
          <el-button type="text" v-if="scope.row.status==1" @click="updateShowFlag(scope.row.tagId,1)">在线</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="sort"
        header-align="center"
        align="center"
        width="120"
       sortable="custom"
        label="排序">
        <template slot-scope="scope">
          <el-input type="number" v-model="scope.row.sort" ref="sortDis" :class="'sortDis'+scope.$index" :disabled="scope.row.disabled" style="display:inline-block;width:70px"></el-input>
          <i class="el-icon-edit" v-show='scope.row.disabled' @click="sortShow(scope.$index)"></i>
          <i class="el-icon-check" v-show='!scope.row.disabled'  @click="sortUpdate(scope.$index,scope.row.tagId,scope.row.sort)"></i>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.tagId)">编辑</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.tagId)">删除</el-button>
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
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './tag-add-or-update'
  export default {
    data () {
      return {
        dataForm: {
          tagName: '',
          type:'',
          status:''
        },
        isAsc:'desc',
        dataList: [],
        typeList:[{'label':'政策原文','value':1},{'label':'政策条文','value':2}],
        statusList:[{'label':'在线','value':'1'},{'label':'隐藏','value':'0'}],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    methods: {
      sortShow(index){
        this.dataList[index].disabled=false;
      },
      sortUpdate(index,id,sort){
        this.$http({
          url: this.$http.adornUrl('/biz/trtag/updateSort'),
          method: 'post',
          params: this.$http.adornParams({id: id, sort: sort})
        }).then(({data}) => {
          if (data && data.code == 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                // this.dataList[index].disabled=true;
                this.getDataList();
              }
            })
          } else {
            if(data.message==undefined){
              this.$message.error(data.msg)
            }else{
              this.$message.error(data.message)
            }
          }
        })
      },
      sortChange (column, prop, order){
        if(column.order=='descending'){
          column.order='desc'
        }
        if(column.order=='ascending'){
          column.order='asc'
        }
        this.isAsc =column.order;
        this.getDataList()
      },
      updateShowFlag (id,txt) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        var ajaxUrl=''
        var ajaxtxt=''
        if(txt==1){
          //在线--》隐藏
          ajaxUrl='/biz/trtag/toCang';
          ajaxtxt='您确定进行隐藏操作吗？'
        }else{
          ajaxUrl='/biz/trtag/toZai';
          ajaxtxt='您确定进行在线操作吗？'
        }
        this.$confirm(`${ajaxtxt}`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          this.$http({
            url: this.$http.adornUrl(`${ajaxUrl}`),
            method: 'post',
            params:this.$http.adornParams({'tagId':id})
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
              if(data.message==undefined){
                this.$message.error(data.msg)
              }else{
                this.$message.error(data.message)
              }
            }
          })
        }).catch(() => {})

      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/biz/trtag/list'),
          method: 'get',
          params: this.$http.adornParams({
            'pageNum': this.pageIndex,
            'pageSize': this.pageSize,
            'tagName': this.dataForm.tagName || undefined,
            'status':this.dataForm.status || undefined,
            'type':this.dataForm.type || undefined,
            'isAsc': this.isAsc
          })
        }).then(({data}) => {
          if (data && data.code == 200) {
            for (var i = 0; i < data.data.list.length; i++) {
              data.data.list[i].disabled = true
            }
            this.dataList = data.data.list;
            this.totalPage = data.data.totalCount;
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
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/biz/trtag/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
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
              this.$message.error(data.msg)
            }
          })
        })
      }
    }
  }
</script>
