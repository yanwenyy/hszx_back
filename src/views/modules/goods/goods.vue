<template>
  <div class="mod-goods">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-popover
          ref="popover1"
          placement="bottom"
          size="mini"
          trigger="click">
          <el-button type="text" size="small" @click="$router.push({ name: 'goods-add-or-update',query:{type:'1'} })">新政辅导</el-button>
          <el-button type="text" size="small" @click="$router.push({ name: 'goods-add-or-update',query:{type:'2'} } )">行业辅导</el-button>
        </el-popover>
        <el-button v-if="isAuth('biz:goods:save')" type="warning"  v-popover:popover1 >新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.platform" clearable placeholder="平台">
          <el-option
            v-for="item in platformList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.status" clearable placeholder="状态">
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.tradeid" clearable placeholder="行业">
          <el-option
            v-for="item in tradeList"
            :key="item.tradeId"
            :label="item.tradeName"
            :value="item.tradeId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.cardtype" clearable placeholder="卡种">
          <el-option
            v-for="item in cardList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList()">搜索</el-button>
        <el-button type="info" @click="resetForm()" >重置</el-button>
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
        prop="goodsId"
        header-align="center"
        align="center"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="platform"
        header-align="center"
        align="center"
        label="平台">
        <template slot-scope="scope">
          <span type="text" v-if="scope.row.platform==1">新政辅导</span>
          <span type="text" v-if="scope.row.platform==2">行业辅导</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="tradeName"
        header-align="center"
        align="center"
        label="行业">
      </el-table-column>
      <el-table-column
        prop="cardtypeName"
        header-align="center"
        align="center"
        label="卡种">
      </el-table-column>
      <el-table-column
        prop="goodsName"
        header-align="center"
        align="center"
        label="商品名称">
      </el-table-column>
      <el-table-column
        prop="price"
        header-align="center"
        align="center"
        label="价格">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="状态">
        <template slot-scope="scope">
          <el-button type="text" v-if="scope.row.status==0" @click="updateShowFlag(scope.row.goodsId,1)">在售</el-button>
          <el-button type="text" v-if="scope.row.status==1" @click="updateShowFlag(scope.row.goodsId,0)">停售</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="sort"
        header-align="center"
        align="center"
        label="排序">
      </el-table-column>
      <el-table-column
        prop="insertTime"
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
          <el-button v-if="isAuth('biz:goods:info')" type="text" size="small" @click="$router.push({ name: 'goods-view',query:{id:scope.row.goodsId,type:scope.row.platform} })">查看</el-button>
          <el-button v-if="isAuth('biz:goods:update')" type="text" size="small" @click="$router.push({ name: 'goods-add-or-update',query:{id:scope.row.goodsId,type:scope.row.platform} })">编辑</el-button>
          <el-button v-if="isAuth('biz:goods:delete')" type="text" size="small" @click="deleteHandle(scope.row.goodsId,scope.row.status)">删除</el-button>
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
          title: '商品管理',
          cardtype:'',
          platform:'',
          tradeid:'',
          status:''

        },
        dataList: [],
        platformList:[{label:'新政辅导',value:'1'},{label:'行业辅导',value:'2'}],
        statusList:[{label:'在售',value:'0'},{label:'停售',value:'2'}],
        cardList:[{'value':"1",'label':'A卡'},{'value':"2",'label':'B卡'}],
        tradeList:[],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: []
      }
    },
    activated () {
      this.getDataList()
      //行业
      this.$http({
        url: this.$http.adornUrl('/biz/trade2/trade2ModelList'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        var dataList=[]
        for( var i=0;i<data.data.length;i++){
          dataList.push(data.data[i]);
        }
        this.tradeList = dataList
      })
    },
    methods: {
      // 删除
      deleteHandle (id,status) {
        if(status==0){
          this.$alert('在售商品不可删除', '提示', {confirmButtonText: '我知道了'});
          return false
        }
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/biz/goods/delete'),
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
      //重置搜索条件
      resetForm(){
        this.dataForm={
          cardtype:'',
          platform:'',
          tradeid:'',
          status:''
        }
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/biz/goods/list'),
          method: 'get',
          params: this.$http.adornParams({
            'pageNum': String(this.pageIndex),
            'pageSize': String(this.pageSize),
            'cardtype':this.dataForm.cardtype || undefined,
            'platform':this.dataForm.platform || undefined,
            'tradeid':this.dataForm.tradeid || undefined,
            'status':this.dataForm.status || undefined
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
      //更新显示状态
      updateShowFlag (id,txt) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对[id=${ids.join(',')}]商品进行[${txt ? '停售' : '在售'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var ajaxUrl=''
          if(txt==1){
            ajaxUrl='/biz/goods/updateToStopSell/'
          }else{
            ajaxUrl='/biz/goods/updateToSell/'
          }
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
