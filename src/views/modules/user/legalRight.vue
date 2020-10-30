<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.companyId"  placeholder="企业ID" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.companyName" placeholder="企业名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.cardType" placeholder="权益名称" clearable>
          <el-option
            v-for="item in qyList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.tradeId" placeholder="行业" clearable>
          <el-option
            v-for="item in tradeList"
            :key="item.tradeId"
            :label="item.tradeName"
            :value="item.tradeId">
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
      <el-form-item label="结束时间">
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
        <el-select v-model="dataForm.attribute" placeholder="属性" clearable>
          <el-option
            v-for="item in sxList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.vipStatus" placeholder="会员状态" clearable>
          <el-option
            v-for="item in hyList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList()">搜索</el-button>
        <el-button  type="warning" @click="resetForm('dataForm')">重置</el-button>
        <!--<el-button type="danger" v-if="isAuth('biz:trpolicyoriginal:delete')" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>-->
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
        type="index"
        header-align="center"
        align="center"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="companyId"
        header-align="center"
        align="center"
        label="企业ID">
      </el-table-column>
      <el-table-column
        prop="companyName"
        header-align="center"
        align="center"
        label="企业名称">
      </el-table-column>
      <el-table-column
        prop="cardName"
        header-align="center"
        align="center"
        label="权益名称">
      </el-table-column>
      <el-table-column
        prop="productName"
        header-align="center"
        align="center"
        label="行业/专题">
      </el-table-column>
      <el-table-column
        prop="ifFirst"
        header-align="center"
        align="center"
        label="属性">
        <template slot-scope="scope">
          {{scope.row.ifFirst=='0'?'首次':'续费'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="vipStatus"
        header-align="center"
        align="center"
        label="会员状态">
      </el-table-column>
      <el-table-column
        prop="vipStartTime"
        header-align="center"
        align="center"
        label="开始日期">
      </el-table-column>
      <el-table-column
        prop="vipEndTime"
        header-align="center"
        align="center"
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
        dataForm: {
          companyId: '',
          companyName: '',
          cardType: '',
          tradeId: '',
          createTime: '',
          releaseTime: '',
          attribute: '',
          vipStatus: '',
        },
        qyList:[
          {
            label:'个人版',
            value:1
          },
          {
            label:'企业版',
            value:2
          },
          {
            label:'集团版',
            value:3
          },
          {
            label:'单专题',
            value:4
          },
          {
            label:'全部专题',
            value:5
          }
        ],
        sxList:[
          {
            label:'首充',
            value:1
          },
          {
            label:'续费',
            value:2
          },
        ],
        hyList:[
          {
            label:'有效',
            value:1
          },
          {
            label:'过期',
            value:2
          },
        ],
        tradeList:[],
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    activated () {
      this.getDataList();
      //行业下拉列表
      this.$http({
        url: this.$http.adornUrl(`/biz/trade2/trade2ModelList`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        if (data && data.code == 200) {
          this.tradeList = data.data;
        }
      });
    },
    methods: {
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
          url: this.$http.adornUrl('/biz/company/companyuserright'),
          method: 'get',
          params: this.$http.adornParams({
            'pageNum': this.pageIndex,
            'pageSize': this.pageSize,
            'companyId': this.dataForm.companyId,
            'companyName': this.dataForm.companyName,
            'cardType': this.dataForm.cardType,
            'tradeId': this.dataForm.tradeId,
            'attribute': this.dataForm.attribute,
            'vipStatus': this.dataForm.vipStatus,
            'starttimeStart': releaseStartTime,
            'starttimeEnd': releaseLastTime,
            'endtimeStart': createTimeStart,
            'endtimeEnd': createTimeEnd,
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
          return item.tradeId
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/biz/trade/delete'),
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
        })
      },
      // 重置
      resetForm(formName) {
        this.dataForm={
          companyId: '',
          companyName: '',
          cardType: '',
          tradeId: '',
          createTime: '',
          releaseTime: '',
          attribute: '',
          vipStatus: '',
        }
      },
      // 是否加入企业\是否试用
      jionStatus (row, column, cellValue) {
        if (cellValue == "1"){
          return '是';
        }else{
          return '否';
        }
      }
    }
  }
</script>
<style>
  .seach-btn{
    text-align: right;
  }
</style>
