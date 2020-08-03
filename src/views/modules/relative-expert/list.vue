<template>
  <div class="mod-policy">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-button type="warning" v-if="isAuth('biz:trpolicyrelativeexpert:save')" @click="$router.push({ name: 'relative-expert-add-or-update'})">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.id" placeholder="解读ID" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.expertTitle" placeholder="解读标题" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.userid"
          clearable
          placeholder="作者" style="width: 150px">
          <el-option v-for="item in userList"
                     :label="item.realname"
                     :value="item.uuid"
                     :key="item.uuid">
          </el-option>
        </el-select>
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
      <el-form-item>
        <el-select
          v-model="dataForm.status"
          clearable
          placeholder="解读状态" style="width: 150px">
          <el-option v-for="item in statusList"
                     :label="item.label"
                     :value="item.value"
                     :key="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.auditStatus"
          clearable
          placeholder="审核状态" style="width: 150px">
          <el-option v-for="item in examineList"
                     :label="item.label"
                     :value="item.value"
                     :key="item.value">
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
        prop="expertTitle"
        header-align="center"
        align="center"
        label="解读标题">
      </el-table-column>
      <el-table-column
        prop="realName"
        header-align="center"
        align="center"
        label="作者">
      </el-table-column>
      <el-table-column
        prop="policyId"
        header-align="center"
        align="center"
        label="政策ID">
      </el-table-column>
      <el-table-column
        prop="tradeName"
        header-align="center"
        align="center"
        label="关联行业">
      </el-table-column>
      <el-table-column
        prop="policyTitle"
        header-align="center"
        align="center"
        label="关联政策标题">
      </el-table-column>
      <el-table-column
        prop="policyFileNum"
        header-align="center"
        align="center"
        label="关联政策文件号">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        width="120px"
        :formatter="commonDate.formatTime"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="解读状态">
        <template slot-scope="scope">
          <span>{{scope.row.status==1?'在线':'隐藏'}}</span>
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
        prop="auditStatusName"
        header-align="center"
        align="center"
        label="审核状态">
        <template slot-scope="scope">
          <span>{{scope.row.auditStatus | formatAuditStatus}}</span>
          <i class="el-icon-search" v-if="isAuth('biz:trpolicyrelativeexpert:expertAduitRecprd')" @click="$router.push({ name: 'relative-expert-examine-record',query:{id:scope.row.id,title:scope.row.expertTitle} })"></i>
        </template>
      </el-table-column>
      <el-table-column
        width="150"
        header-align="center"
        align="center"
        label="审核操作">
        <template slot-scope="scope">
          <div>
            <el-button style="color:#1e88e5" type="text" size="mini" v-if="isAuth('biz:trpolicyrelativeexpert:applyOnline')" @click="online(scope.row.id)" v-show="scope.row.status==0&&scope.row.passAndE!=1&&scope.row.auditStatus!=2">申请上线</el-button>
            <el-button style="color:orange" type="text" size="mini" v-if="isAuth('biz:trpolicyrelativeexpert:applyUpdate')" v-show="scope.row.passAndE==1&&scope.row.auditStatus!=2" @click="update(scope.row.id)">申请更新</el-button>
            <el-button type="text" style="color:#000" size="mini" v-if="isAuth('biz:trpolicyrelativeexpert:applyDownline')" v-show="scope.row.status==1&&scope.row.auditStatus!=2"  @click="offline(scope.row.id)">申请下线</el-button>
          </div>
          <div>
            <el-button style="color:#67c23a" type="text" size="mini" v-if="isAuth('biz:trpolicyrelativeexpert:auditOnline')" @click="$router.push({ name: 'relative-expert-examine-online',query:{id:scope.row.id} })" v-show="scope.row.status==0&&scope.row.auditStatus==2">上线审核</el-button>
            <el-button style="color:red" type="text" size="mini" v-if="isAuth('biz:trpolicyrelativeexpert:auditUpdate')" @click="$router.push({ name: 'relative-expert-examine-update',query:{id:scope.row.id} })" v-show="scope.row.status==1&&scope.row.auditStatus==2&&scope.row.auditOperate==2">更新审核</el-button>
            <el-button type="text" size="mini" v-if="isAuth('biz:trpolicyrelativeexpert:auditDownline')" v-show="scope.row.status==1&&scope.row.auditStatus==2&&scope.row.auditOperate==3" @click="$router.push({ name: 'relative-expert-examine-offline',query:{id:scope.row.id} })">下线审核</el-button>
          </div>
        </template>
      </el-table-column>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="200"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" v-if="isAuth('biz:operatelog:list')" @click="$router.push({ name: 'relative-expert-record',query:{id:scope.row.id,title:scope.row.expertTitle} })">操作记录</el-button>
          <el-button type="text" size="small" v-if="isAuth('biz:trpolicyrelativeexpert:update')" v-show="scope.row.auditStatus!=2" @click="$router.push({ name: 'relative-expert-add-or-update',query:{id:scope.row.id} })">编辑</el-button>
          <el-button type="text" size="small" v-if="isAuth('biz:trpolicyrelativeexpert:update')" v-show="scope.row.auditStatus==2" @click="editHandle()">编辑</el-button>
          <el-button type="text" size="small" @click="$router.push({ name: 'relative-expert-view',query:{id:scope.row.id} })">查看</el-button>
          <el-button type="text" size="small" v-if="isAuth('biz:trpolicyrelativeexpert:delete')" @click="deleteHandle(scope.row.id,scope.row.status)">删除</el-button>
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
          userid:'',
          policyId:'',
          policyTitle:'',
          policyFileNum:'',
          tradeid:'',
          status:'',
          auditStatus:'',
          createTime:''
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
      //作者
      this.$http({
        url: this.$http.adornUrl('/biz/user/getIdentityList'),
        method: 'get',
        params: this.$http.adornParams({'identity':1})
      }).then(({data}) => {
        var dataList=[]
        for( var i=0;i<data.length;i++){
          dataList.push(data[i]);
        }
        this.userList = dataList
      })
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
      sortShow(index){
        this.dataList[index].disabled=false
      },
      sortUpdate(index,id,sort){
        this.$http({
          url: this.$http.adornUrl('/biz/trpolicyrelativeexpert/updateSort'),
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
        if(status==1){
          this.$alert('该政策为“在线”状态，不可删除，您可以申请下线后重新操作！', '提示', {confirmButtonText: '我知道了'});
          return false
        }
        this.$confirm(`您确定要删除该政策吗？`, ``, {
          confirmButtonText: `确定`,
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/biz/trpolicyrelativeexpert/delete'),
            method: 'post',
            data: this.$http.adornData(id,false)
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
      // 申请上线
      online (id) {

        this.confirmFn('您确定要申请上线吗？','提交后，1-2个工作日为您审核，审核中将不能修改该政策。','提交申请','/biz/trpolicyrelativeexpert/applyOnline/',id)
      },
      //申请更新
      update (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.confirmFn('您确定要申请更新吗？','提交后，1-2个工作日为您审核，审核中将不能修改该政策。','提交申请','/biz/trpolicyrelativeexpert/applyUpdate/',ids)
      },
      //申请下线
      offline (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })

        this.$prompt('请输入下线原因，最少5个字最多输入100字', '申请下线', {
          inputType:'textarea',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValidator:(val) => {
            return !(val.length < 5 || val.length > 100)
          },
          inputErrorMessage: '！保存失败，您未达到最少字数或超过最大字数'
        }).then(({ value }) => {
          this.$http({
            url: this.$http.adornUrl('/biz/trpolicyrelativeexpert/applyDownline'),
            method: 'GET',
            params: this.$http.adornParams({'id':id,'downlineReason':value})
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
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
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
          url: this.$http.adornUrl('/biz/trpolicyrelativeexpert/list'),
          method: 'get',
          params: this.$http.adornParams({
            'pageNum': String(this.pageIndex),
            'pageSize': String(this.pageSize),
            'id':this.dataForm.id|| undefined,
            'expertTitle':this.dataForm.expertTitle|| undefined,
            'userid':this.dataForm.userid|| undefined,
            'policyId':this.dataForm.policyId|| undefined,
            'policyTitle':this.dataForm.policyTitle|| undefined,
            'policyFileNum':this.dataForm.policyFileNum|| undefined,
            'tradeid':this.dataForm.tradeid|| undefined,
            'status':this.dataForm.status|| undefined,
            'auditStatus':this.dataForm.auditStatus|| undefined,
            'createTimeStart':createTimeStart || undefined,
            'createTimeEnd':createTimeEnd || undefined
          })
        }).then(({data}) => {
          if (data && data.code == 200) {
           for(var i=0;i<data.data.list.length;i++) {
             data.data.list[i].disabled=true
           }
          this.dataList = data.data.list
            console.log(this.dataList)
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
