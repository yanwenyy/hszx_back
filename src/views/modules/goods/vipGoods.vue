<template>
  <div class="mod-policy">
    <el-form v-if="false" :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-button type="warning" v-if="isAuth('biz:trpolicyoriginal:save')" @click="$router.push({ name: 'vipGoods-add-or-update'})">新增</el-button>
        <el-button type="warning" v-if="isAuth('biz:trpolicyoriginal:save')" @click="$router.push({ name: 'vipGoods-batch-add'})">批量新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.status"
          clearable
          placeholder="状态" >
          <el-option v-for="item in ztList"
                     :label="item.label"
                     :value="item.value"
                     :key="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.tradeid"
          clearable
          placeholder="行业" >
          <el-option v-for="item in hyList"
                     :label="item.tradeName"
                     :value="item.tradeId"
                     :key="item.tradeId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.cardId"
          clearable
          placeholder="卡种" >
          <el-option v-for="item in czList"
                     :label="item.cardName"
                     :value="item.cardId"
                     :key="item.cardId">
          </el-option>
        </el-select>
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
        prop="goodsId"
        header-align="center"
        align="center"
        width="80"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="goodsType"
        header-align="center"
        align="center"
        label="商品类型">
        <template slot-scope="scope">
          {{scope.row.goodsType=='1'?'行业会员':'专题会员'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="versionType"
        header-align="center"
        align="center"
        width="120px"
        label="权益名称">
        <template slot-scope="scope">
          {{scope.row.versionType=='1'?'个人版':scope.row.versionType=='2'?'企业版':scope.row.versionType=='3'?'集团版':''}}
        </template>
      </el-table-column>
      <el-table-column
        prop="cardLevel"
        header-align="center"
        align="center"
        width="120px"
        label="等级">
      </el-table-column>
      <el-table-column
        prop="accountNum"
        header-align="center"
        align="center"
        width="120px"
        label="账号数量">
      </el-table-column>
      <el-table-column
        prop="firstPrice"
        header-align="center"
        align="center"
        width="120px"
        label="售价">
      </el-table-column>
      <el-table-column
        prop="onlineRight"
        header-align="center"
        align="center"
        width="120px"
        label="线上权益">
        <template slot-scope="scope">
          {{scope.row.onlineRight=='1'?'单一行业':scope.row.onlineRight=='2'?'单一行业+直播':scope.row.onlineRight=='3'?'单一行业+直播+专题':scope.row.onlineRight=='4'?'单一专题':'专题集合'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        width="120px"
        label="状态">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="eidtShow(scope.row.status,scope.row.goodsId)">{{scope.row.status=='1'?'在售':'停售'}}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="insertTime"
        header-align="center"
        align="center"
        width="120px"
        label="创建时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="200"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" v-if="isAuth('biz:trpolicyoriginal:info')" @click="$router.push({ name: 'vipGoods-add-or-update',query:{id:scope.row.goodsId} })">编辑</el-button>
          <el-button type="text" size="small" v-if="isAuth('biz:trpolicyoriginal:delete')" @click="$router.push({ name: 'vipGoods-view',query:{id:scope.row.goodsId} })">查看</el-button>
          <!--<el-button type="text" size="small" v-if="isAuth('biz:trpolicyoriginal:delete')" @click="deleteHandle(scope.row.goodsId)">删除</el-button>-->
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
          status:'',
          tradeid:'',
          cardId:'',
        },
        dialogFormVisible:false,
        searchPhone:true,
        managerVisible:false,
        ztList:[
          {
            label:'在售',
            value:'0'
          },
          {
            label:'停售',
            value:'1'
          }
        ],
        hyList:[],
        czList:[],
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
      //行业列表
      this.$http({
        url: this.$http.adornUrl('/biz/trade2/trade2ModelList'),
        method: 'GET',
      }).then(({data}) => {
        this.hyList = data.data
      });
      //卡种列表
      this.$http({
        url: this.$http.adornUrl('/biz/card/cardlist'),
        method: 'GET',
      }).then(({data}) => {
        this.czList = data.data
      });
    },
    methods: {
      //在售停售点击
      eidtShow(status,id){
        this.$confirm(`您确定要${status=='0'?'停售':'在售'}吗？`, ``, {
          confirmButtonText: `确定`,
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl(`/biz/goods/${status=='0'?'updateToStopSale':'updateToSell'}/${id}`),
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
              this.$message.error(data.msg)
            }
          })
        })
      },
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
          status:'',
          tradeid:'',
          cardId:'',
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
            url: this.$http.adornUrl('/biz/goods/delete'),
            method: 'GET',
            params: this.$http.adornParams({
              cardId: id
            })
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
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/biz/goods/list'),
          method: 'get',
          params: this.$http.adornParams({
            'pageNum': String(this.pageIndex),
            'pageSize': String(this.pageSize),
            // 'status':this.dataForm.status|| undefined,
            // 'tradeid':this.dataForm.tradeid|| undefined,
            // 'cardId':this.dataForm.cardId|| undefined
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
  .card-mm-list{
    margin-bottom: 10px;
  }
  .dialog-footer{
    text-align: center;
    margin-top: 20px;
  }
</style>
