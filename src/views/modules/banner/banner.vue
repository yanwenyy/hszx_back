<template>
  <div class="mod-banner">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-button v-if="isAuth('biz:banner:save')" type="warning" @click="$router.push({ name: 'banner-add-or-update' })" >新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      :header-cell-style="{background: 'rgb(21, 161, 147)',color:'#fff'}"
      style="width: 100%;">
      <el-table-column
        header-align="center"
        align="center"
        label="序号">
        <template slot-scope="scope"><span>{{scope.$index+(pageIndex - 1) * pageSize + 1}} </span></template>
      </el-table-column>
      <el-table-column
        prop="showPlatform"
        header-align="center"
        align="center"
        width="80"
        label="展示平台">
        <template slot-scope="scope">
          <span v-if="scope.row.showPlatform==1">新政辅导</span>
          <span v-if="scope.row.showPlatform==2">行业辅导</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="showPlace"
        header-align="center"
        align="center"
        width="80"
        label="展示页面">
        <template slot-scope="scope">
          <span v-if="scope.row.showPlace==1">首页</span>
          <span v-if="scope.row.showPlace==2">评估页</span>
          <span v-if="scope.row.showPlace==3">我的报告-个人/员工</span>
          <span v-if="scope.row.showPlace==4">我的报告-管理层</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="广告名称">
      </el-table-column>
      <el-table-column
        prop="imgUrl"
        header-align="center"
        align="center"
        width="150px"
        label="图片">
        <template slot-scope="scope">
          <el-popover
          placement="right"
          title=""
          trigger="hover">
          <img :src="'http://'+scope.row.imgUrl"/>
          <img slot="reference" :src="'http://'+scope.row.imgUrl" :alt="scope.row.imgUrl" style="max-height: 50px;max-width: 130px">
        </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="jumpType"
        header-align="center"
        align="center"
        label="跳转类型">
        <template slot-scope="scope">
          <span v-if="scope.row.jumpType==1">不跳转</span>
          <span v-if="scope.row.jumpType==2">H5</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="sort"
        header-align="center"
        align="center"
        label="播放顺序">
      </el-table-column>
      <el-table-column
        prop="showFlag"
        header-align="center"
        align="center"
        label="状态">
        <template slot-scope="scope">
          <el-button type="text" v-if="scope.row.showFlag==0" @click="updateShowFlag(scope.row.id)">显示</el-button>
          <el-button type="text" v-if="scope.row.showFlag==1" @click="updateShowFlag(scope.row.id)">隐藏</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        :formatter="commonDate.formatTime"
        align="center"
        width="150"
        label="创建时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('biz:banner:info')" type="text" size="small" @click="$router.push({ name: 'banner-view',query:{id:scope.row.id} })">查看</el-button>
          <el-button v-if="isAuth('biz:banner:update')" type="text" size="small" @click="$router.push({ name: 'banner-add-or-update',query:{id:scope.row.id} })">编辑</el-button>
          <el-button v-if="isAuth('biz:banner:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
        dataForm: {
          title: 'banner维护管理'
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: []
      }
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/biz/banner/list'),
          method: 'get',
          params: this.$http.adornParams({
            'pageNum': String(this.pageIndex),
            'pageSize': String(this.pageSize)
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
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
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
            url: this.$http.adornUrl('/biz/banner/delete'),
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
              if(data.message==undefined){
                this.$message.error(data.msg)
              }else{
                this.$message.error(data.message)
              }
            }
          })
        }).catch(() => {})
      },
      //更新显示状态
      updateShowFlag (id) {
        this.$http({
          url: this.$http.adornUrl(`/biz/banner/showorhide?id=${id}`),
          method: 'post'
        }).then(({data}) => {
          if (data && data.code == 200) {
            this.getDataList()
          }else{
            if(data.message==undefined){
              this.$message.error(data.msg)
            }else{
              this.$message.error(data.message)
            }
          }
        })

        /*this.$confirm(`状态变更后，将进入测试期`, '您确定本月政策已全部更新完成吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/biz/policypack/update/finish'),
            method: 'post',
            data: this.$http.adornData({'id':id})
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
        }).catch(() => {})*/
      }
    }
  }
</script>
