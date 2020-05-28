<template>
  <div class="mod-policy">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-button type="warning" v-if="isAuth('biz:trbroadcast:save')" @click="$router.push({ name: 'broadcast-add-or-update'})">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.id" placeholder="ID" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.title" placeholder="标题" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.lecturer" placeholder="讲师" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.tradeid"
          clearable
          placeholder="行业" style="width: 150px">
          <el-option v-for="item in tradeList"
                     :label="item.tradeName"
                     :value="item.tradeId"
                     :key="item.tradeId" >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.ifShow"
          clearable
          placeholder="状态" style="width: 150px">
          <el-option v-for="item in ifShowList"
                     :label="item.label"
                     :value="item.value"
                     :key="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.status"
          clearable
          placeholder="直播状态" style="width: 150px">
          <el-option v-for="item in statusList"
                     :label="item.label"
                     :value="item.value"
                     :key="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="直播时间">
        <el-date-picker
          v-model="dataForm.broadcastTime"
          type="daterange"
          range-separator="一"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dataForm.creatTime"
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
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      @sort-change='sortChange'
      v-loading="dataListLoading"
      :header-cell-style="{background: 'rgb(21, 161, 147)',color:'#fff'}"
      style="width: 100%;">

      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        width="80"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="tradeName"
        header-align="center"
        align="center"
        label="行业">
      </el-table-column>
      <el-table-column
        prop="title"
        header-align="center"
        align="center"
        label="标题">
      </el-table-column>
      <el-table-column
        prop="imgUrl"
        header-align="center"
        align="center"
        width="150px"
        label="封面图">
        <template slot-scope="scope">
          <el-popover
            placement="right"
            title=""
            trigger="hover">
            <img :src="'http://'+scope.row.coverUrl"/>
            <img slot="reference" :src="'http://'+scope.row.coverUrl" :alt="scope.row.coverUrl" style="max-height: 50px;max-width: 130px">
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="platformAuthorName"
        header-align="center"
        align="center"
        label="讲师">
      </el-table-column>
      <el-table-column
        prop="broadcastTime"
        header-align="center"
        sortable="broadcastTime"
        align="center"
        label="直播时间">
      </el-table-column>
      <el-table-column
        prop="statusName"
        header-align="center"
        align="center"
        label="直播状态">
      </el-table-column>
      <el-table-column
        prop="creatTime"
        header-align="center"
        align="center"
        width="120px"
        :formatter="commonDate.formatTime"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="sort"
        header-align="center"
        align="center"
        width="120"
        label="排序">
        <template slot-scope="scope">
          <el-input type="number" v-model="scope.row.sort" ref="sortDis" :class="'sortDis'+scope.$index" :disabled="scope.row.disabled" style="display:inline-block;width:70px"></el-input>
          <i class="el-icon-edit" v-show='scope.row.disabled' @click="sortShow(scope.$index)"></i>
          <i class="el-icon-check" v-show='!scope.row.disabled'  @click="sortUpdate(scope.$index,scope.row.id,scope.row.sort)"></i>
        </template>
      </el-table-column>
      <el-table-column
        prop="ifShow"
        header-align="center"
        align="center"
        label="状态">
        <template slot-scope="scope">
          <el-button v-show="scope.row.ifShow==0" v-if="isAuth('biz:trbroadcast:toZai')" type="text" size="small" @click="hideToShow(scope.row.id)">隐藏</el-button>
          <el-button v-show="scope.row.ifShow==1" v-if="isAuth('biz:trbroadcast:toCang')" type="text" size="small" @click="showToHide(scope.row.id)">在线</el-button>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="200"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="$router.push({ name: 'broadcast-record',query:{id:scope.row.id,title:scope.row.title} })">操作记录</el-button>
          <el-button type="text" size="small" v-if="isAuth('biz:trbroadcast:update')" @click="$router.push({ name: 'broadcast-add-or-update',query:{id:scope.row.id} })">编辑</el-button>
          <el-button type="text" size="small" v-if="isAuth('biz:trbroadcast:info')" @click="$router.push({ name: 'broadcast-view',query:{id:scope.row.id} })">查看</el-button>
          <el-button type="text" size="small" v-if="isAuth('biz:trbroadcast:delete')" @click="deleteHandle(scope.row.id)">删除</el-button>
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
        sortDis:true,
        isAsc:'',
        dataForm: {
          id:'',
          title:'',
          lecturer:'',
          status:'',
          creatTime:'',
          tradeid:'',
          ifShow:'',
          broadcastTime:''
        },
        tradeList:[],
        statusList:[{label:'预告',value:'1'},{label:'直播中',value:'2'},{label:'直播结束',value:'3'},{label:'回放',value:'4'}],
        ifShowList:[{label:'隐藏',value:'0'},{label:'在线',value:'1'}],
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
    mounted(){
      //行业
      this.$http({
        url: this.$http.adornUrl('/biz/trade2/trade2ModelList'),
        method: 'get',
        params: this.$http.adornData()
      }).then(({data}) => {
        var dataList=[]
        for( var i=0;i<data.data.length;i++){
          dataList.push(data.data[i]);
        }
        this.tradeList = dataList
      })
    },
    methods: {
      //排序
      sortChange (column, prop, order){
        if(column.order=='descending'){
          column.order='desc'
        }
        if(column.order=='ascending'){
          column.order='asc'
        }
        this.isAsc =column.order
        this.getDataList ()
      },
      sortShow(index){
        this.dataList[index].disabled=false
      },
      sortUpdate(index,id,sort){
        this.$http({
          url: this.$http.adornUrl('/biz/trbroadcast/updateSort'),
          method: 'post',
          params: this.$http.adornParams({id:id,sort:sort})
        }).then(({data}) => {
          if (data && data.code == 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.dataList[index].disabled=true
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
      //重置搜索条件
      resetForm(){
        this.dataForm={
          id:'',
          title:'',
          lecturer:'',
          status:'',
          creatTime:'',
          tradeid:'',
          ifShow:'',
          broadcastTime:''
        }
      },
      confirmFn(title,content,confirmButtonText,ajaxUrl,ids){
        if(confirmButtonText==""){
          confirmButtonText='确定'
        }
        this.$confirm(`${content}`, `${title}`, {
          confirmButtonText: `${confirmButtonText}`,
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl(ajaxUrl+ids),
            method: 'get',
            params: this.$http.adornParams()
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
      // 删除
      deleteHandle (id) {
        this.$confirm(`您确定要删除该条数据吗？`, ``, {
          confirmButtonText: `确定`,
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/biz/trbroadcast/delete'),
            method: 'post',
            data: this.$http.adornData(id, false)
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
      // 隐藏按钮--》在线
      hideToShow (id) {
        this.confirmFn('提示','您确定要在线吗？','确定','/biz/trbroadcast/toZai/',id)
      },
      // 在线按钮--》隐藏
      showToHide (id) {
        this.confirmFn('提示','您确定要隐藏吗？','确定','/biz/trbroadcast/toCang/',id)
      },
      // 获取数据列表
      getDataList () {
        var creatTimeStart='',creatTimeEnd='',startTime='',endTime=''
        if(this.dataForm.creatTime!=undefined&&this.dataForm.creatTime!=""&&this.dataForm.creatTime.length!=0&&this.dataForm.creatTime!=null){
          creatTimeStart=this.dataForm.creatTime[0]
          creatTimeEnd=this.dataForm.creatTime[1]
        }
        if(this.dataForm.broadcastTime!=undefined&&this.dataForm.broadcastTime!=""&&this.dataForm.broadcastTime.length!=0&&this.dataForm.broadcastTime!=null){
          startTime=this.dataForm.broadcastTime[0]
          =this.dataForm.broadcastTime[1]
        }
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/biz/trbroadcast/list'),
          method: 'get',
          params: this.$http.adornParams({
            'pageNum': String(this.pageIndex),
            'pageSize': String(this.pageSize),
            'isAsc':this.isAsc|| undefined,
            'id':this.dataForm.id|| undefined,
            'title':this.dataForm.title|| undefined,
            'lecturer':this.dataForm.lecturer|| undefined,
            'tradeid':this.dataForm.tradeid|| undefined,
            'status':this.dataForm.status|| undefined,
            'ifShow':this.dataForm.ifShow|| undefined,
            'createTimeStart':creatTimeStart || undefined,
            'createTimeEnd':creatTimeEnd || undefined,
            'startTime':startTime || undefined,
            'endTime':endTime || undefined
          })
        }).then(({data}) => {
          if (data && data.code == 200) {
           for(var i=0;i<data.data.list.length;i++) {
             data.data.list[i].disabled=true
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
      }

    }
  }
</script>
<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
  input[type="number"]{
    -moz-appearance: textfield;
    width:60px !important;
    height:20px !important;
    padding:0 !important;
    text-align:center;
  }

</style>
