<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-button type="warning" v-if="isAuth('biz:trade2:save')"  @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.tradeName" placeholder="行业" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.ifShow" clearable placeholder="展示状态">
          <el-option
            v-for="item in showFlagList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.ifSale" clearable placeholder="售卖状态">
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
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
        prop="tradeId"
        header-align="center"
        align="center"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="tradeName"
        header-align="center"
        align="center"
        label="行业名称">
      </el-table-column>
      <el-table-column
        prop="tradeIcon"
        header-align="center"
        align="center"
        width="150px"
        label="icon">
        <template slot-scope="scope">
          <el-popover
            placement="right"
            title=""
            trigger="hover">
            <img :src="'http://'+scope.row.tradeIcon"/>
            <img slot="reference" :src="'http://'+scope.row.tradeIcon" :alt="scope.row.tradeIcon" style="max-height: 50px;max-width: 130px">
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="insertTime"
        header-align="center"
        align="center"
        :formatter="commonDate.formatTime"
        label="创建日期">
      </el-table-column>
      <el-table-column
        prop="ifShow"
        header-align="center"
        align="center"
        label="行业展示状态">
        <template slot-scope="scope">
          <el-button type="text" v-if="scope.row.ifShow==0" @click="updateShowFlag(scope.row.tradeId,0)">隐藏</el-button>
          <el-button type="text" v-if="scope.row.ifShow==1" @click="updateShowFlag(scope.row.tradeId,1)">在线</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="ifSale"
        header-align="center"
        align="center"
        label="商品售卖状态">
        <template slot-scope="scope">
          <el-button type="text" v-if="scope.row.ifSale==0" @click="updateShowSale(scope.row.tradeId,0)">隐藏</el-button>
          <el-button type="text" v-if="scope.row.ifSale==1" @click="updateShowSale(scope.row.tradeId,1)">在线</el-button>
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
          <i class="el-icon-check" v-show='!scope.row.disabled'  @click="sortUpdate(scope.$index,scope.row.tradeId,scope.row.sort)"></i>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.tradeId)">编辑</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.tradeId)">删除</el-button>
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
  import AddOrUpdate from './trade-set-add-or-update'
  export default {
    data () {
      return {
        dataForm: {
          tradeName: '',
          ifShow:'',
          ifSale:''
        },
        isAsc:'desc',
        dataList: [],
        showFlagList:[{label:'在线',value:'1'},{label:'隐藏',value:'0'}],
        statusList:[{label:'在线',value:'1'},{label:'隐藏',value:'0'}],
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
        this.dataList[index].disabled=false
      },
      sortUpdate(index,id,sort){
        this.$http({
          url: this.$http.adornUrl('/biz/trade2/updateSort'),
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
        // console.log(column, prop, order)
        if(column.order=='descending'){
          column.order='desc'
        }
        if(column.order=='ascending'){
          column.order='asc'
        }
        this.isAsc =column.order;
        this.getDataList()
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/biz/trade2/list'),
          method: 'get',
          params: this.$http.adornParams({
            'pageNum': this.pageIndex,
            'pageSize': this.pageSize,
            'tradeName': this.dataForm.tradeName || undefined,
            'ifShow': this.dataForm.ifShow || undefined,
            'ifSale': this.dataForm.ifSale || undefined,
            'isAsc': this.isAsc
          })
        }).then(({data}) => {
          if (data && data.code == 200) {
            for (var i = 0; i < data.data.list.length; i++) {
              data.data.list[i].disabled = true
            }
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
        var ids = id
        this.$confirm(`确定对[id=${ids}进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/biz/trade2/delete'),
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
      },
      //更新显示状态
      updateShowFlag (id,txt) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        var ajaxUrl=''
        var ajaxtxt=''
        if(txt==1){
          //在线--》隐藏
          ajaxUrl='/biz/trade2/showToCang/';
          ajaxtxt='隐藏后该行业将对用户关闭，请核对付费用户服务是否完结，并谨慎操作。您确定隐藏吗？'
        }else{
          ajaxUrl='/biz/trade2/showToZai/';
          ajaxtxt='上线后该行业将对用户展示，请在行业模块内容完整情况下上线。您确定上线吗？'
        }
        this.$confirm(`${ajaxtxt}`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          this.$http({
            url: this.$http.adornUrl(`${ajaxUrl}${id}`),
            method: 'get'
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
      //更改售卖状态
      updateShowSale (id,txt) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        var ajaxUrl=''
        var ajaxtxt=''
        if(txt==1){
          //在线--》隐藏
          ajaxUrl='/biz/trade2/saleToTing/';
          ajaxtxt='隐藏后该行业将对用户关闭购买入口，请谨慎操作。您确定隐藏吗？'
        }else{
          ajaxUrl='/biz/trade2/saleToZai/';
          ajaxtxt='上线后该行业将对用户开放购买入口，请确认该行业下商品信息添加完毕。您确定上线吗？'
        }
        this.$confirm(`${ajaxtxt}`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          this.$http({
            url: this.$http.adornUrl(`${ajaxUrl}${id}`),
            method: 'get'
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

      }
    }
  }
</script>
