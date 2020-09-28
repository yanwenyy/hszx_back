<template>
  <div class="mod-policy">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-button type="warning" v-if="isAuth('biz:trpolicyoriginalrelativeexpert:save')" @click="$router.push({ name: 'original-relative-expert-add-or-update'})">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.id" placeholder="解读ID" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.expertTitle" placeholder="解读标题" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.source" placeholder="来源" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.policyId" placeholder="政策ID" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.policyTitle" placeholder="政策标题" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.policyFileNum" placeholder="政策文件号" clearable></el-input>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dataForm.createTime"
          type="daterange"
          range-separator="一"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="发布时间">
        <el-date-picker
          v-model="dataForm.releaseDate"
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
        <el-button type="danger" v-if="isAuth('biz:trpolicyoriginalrelativeexpert:delete')" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      :header-cell-style="{background: 'rgb(21, 161, 147)',color:'#fff'}"
      @selection-change="selectionChangeHandle"
      @sort-change='sortChange'
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        width="80"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="expertTitle"
        header-align="center"
        align="center"
        label="解读标题">
      </el-table-column>
      <el-table-column
        prop="policyId"
        header-align="center"
        align="center"
        label="政策ID">
      </el-table-column>
      <el-table-column
        prop="policyFileNum"
        header-align="center"
        align="center"
        sortabel
        label="关联政策文件号">
      </el-table-column>
      <el-table-column
        prop="releaseDate"
        header-align="center"
        align="center"
        width="120px"
        :formatter="commonDate.formatTime"
        sortable="custom"
        label="发布日期">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        width="120px"
        :formatter="commonDate.formatTime"
        sortable="custom"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="解读状态">
        <template slot-scope="scope">
          <el-button type="text" v-if="scope.row.status==0" @click="updateShowFlag(scope.row.id,0)">隐藏</el-button>
          <el-button type="text" v-if="scope.row.status==1" @click="updateShowFlag(scope.row.id,1)">在线</el-button>
        </template>
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
        fixed="right"
        header-align="center"
        align="center"
        width="200"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" v-if="isAuth('biz:trpolicyoriginalrelativeexpert:update')" v-show="scope.row.auditStatus!=2" @click="$router.push({ name: 'original-relative-expert-add-or-update',query:{id:scope.row.id} })">编辑</el-button>
          <el-button type="text" size="small" @click="$router.push({ name: 'original-relative-expert-view',query:{id:scope.row.id} })">查看</el-button>
          <el-button type="text" size="small" v-if="isAuth('biz:trpolicyoriginalrelativeexpert:delete')" @click="deleteHandle(scope.row.id,scope.row.status)">删除</el-button>
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
        dataForm: {
          id:'',
          expertTitle:'',
          source:'',
          policyId:'',
          policyTitle:'',
          policyFileNum:'',
          tradeid:'',
          status:'',
          auditStatus:'',
          createTime:'',
          releaseDate:'',
          releaseDateIsAsc:'',
          createTimeIsAsc:'',
        },
        userList:[],
        tradeList:[],
        statusList:[{label:'隐藏',value:'0'},{label:'在线',value:'1'}],
        examineList:[{label:'未申请审核',value:1},{label:'待审核',value:2},{label:'审核通过',value:4},{label:'审核未通过',value:3}],
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
    filters: {
      formatAuditStatus(status){
        switch(status) {
          case 1: status='未申请审核'
            break;
          case 2:  status='待审核'
            break;
          case 3:  status='审核未通过'
            break;
          case 4:  status='审核通过'
            break;
        }
        return status
      }
    },
    mounted(){
      //行业
      this.$http({
        url: this.$http.adornUrl('/biz/trade2/trade2PolicyList'),
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
      sortChange (column, prop, order){
        console.log(column);
        var _order=column.order,
            _prop=column.prop;
        if(_order=='descending'){
          if(_prop=='releaseDate'){
            this.dataForm.releaseDateIsAsc='desc';
            this.dataForm.createTimeIsAsc=''
          }else if(_prop=='createTime'){
            this.dataForm.createTimeIsAsc='desc';
            this.dataForm.releaseDateIsAsc=''
          }
        }
        if(_order=='ascending'){
          if(_prop=='releaseDate'){
            this.dataForm.releaseDateIsAsc='asc';
            this.dataForm.createTimeIsAsc=''
          }else if(_prop=='createTime'){
            this.dataForm.createTimeIsAsc='asc'
            this.dataForm.releaseDateIsAsc=''
          }
        }
        console.log(this.dataForm.releaseDateIsAsc+'===>'+this.dataForm.createTimeIsAsc)
        this.getDataList()
      },
      //在线,隐藏
      updateShowFlag (id,txt) {
        var ajaxUrl=''
        var ajaxtxt=''
        if(txt==1){
          //在线--》隐藏
          ajaxUrl='/biz/trpolicyoriginalrelativeexpert/zaiToCang';
          ajaxtxt='您确定进行隐藏操作吗？'
        }else{
          ajaxUrl='/biz/trpolicyoriginalrelativeexpert/yinToZai';
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
            params: this.$http.adornParams({
              'id': id
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
              if(data.message==undefined){
                this.$message.error(data.msg)
              }else{
                this.$message.error(data.message)
              }
            }
          })
        }).catch(() => {})
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      sortShow(index){
        this.dataList[index].disabled=false
      },
      sortUpdate(index,id,sort){
        this.$http({
          url: this.$http.adornUrl('/biz/trpolicyoriginalrelativeexpert/updateSort'),
          method: 'post',
          params: this.$http.adornParams({id:id,sort:sort},false)
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
          expertTitle:'',
          userid:'',
          policyId:'',
          policyTitle:'',
          policyFileNum:'',
          tradeid:'',
          status:'',
          auditStatus:'',
          createTime:''
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
      //不可编辑
      editHandle(){
        this.$alert('该政策当前正在审核当中，不可编辑', '', {confirmButtonText: '我知道了'});
      },
      // 删除
      deleteHandle (id,status) {
        // if(status==1){
        //   this.$alert('该政策为“在线”状态，不可删除，您可以申请下线后重新操作！', '提示', {confirmButtonText: '我知道了'});
        //   return false
        // }
        var policyId = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        });
        this.$confirm(`您确定要删除${policyId.length > 1 ? '[id=' + policyId.join(',') + ']':'该'}政策原文吗？`, ``, {
          confirmButtonText: `确定`,
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/biz/trpolicyoriginalrelativeexpert/delete'),
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
        var createTimeStart='',createTimeEnd=''
        if(this.dataForm.createTime!=undefined&&this.dataForm.createTime!=""&&this.dataForm.createTime.length!=0&&this.dataForm.createTime!=null){
          createTimeStart=this.dataForm.createTime[0]
          createTimeEnd=this.dataForm.createTime[1]
        }
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/biz/trpolicyoriginalrelativeexpert/list'),
          method: 'get',
          params: this.$http.adornParams({
            'pageNum': String(this.pageIndex),
            'pageSize': String(this.pageSize),
            'id':this.dataForm.id|| undefined,
            'expertTitle':this.dataForm.expertTitle|| undefined,
            'source':this.dataForm.source|| undefined,
            'policyId':this.dataForm.policyId|| undefined,
            'policyTitle':this.dataForm.policyTitle|| undefined,
            'policyFileNum':this.dataForm.policyFileNum|| undefined,
            'tradeid':this.dataForm.tradeid|| undefined,
            'createTimeStart':createTimeStart || undefined,
            'createTimeEnd':createTimeEnd || undefined,
            'releaseDateStart':this.dataForm.releaseDate&&this.dataForm.releaseDate[0] || undefined,
            'releaseDateEnd':this.dataForm.releaseDate&&this.dataForm.releaseDate[1] || undefined,
            'releaseDateIsAsc':this.dataForm.releaseDateIsAsc,
            'createTimeIsAsc':this.dataForm.createTimeIsAsc,
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
