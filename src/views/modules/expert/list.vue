<template>
  <div class="mod-policy">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-button type="warning" v-if="isAuth('biz:user:addExpertUser')" @click="open">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.phone" placeholder="手机号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.userName" placeholder="用户名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.realName" placeholder="真实姓名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.trade"
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
          v-model="dataForm.tradeVisiblePower"
          clearable
          placeholder="行业内容可见权限" style="width: 200px">
          <el-option v-for="item in tradeVisiblePowerList"
                     :label="item.label"
                     :value="item.value"
                     :key="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="认证时间">
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
        prop="$index"
        header-align="center"
        align="center"
        width="80"
        label="序号">
        <template slot-scope="scope"><span>{{scope.$index+(pageIndex - 1) * pageSize + 1}} </span></template>
      </el-table-column>
      <el-table-column
        prop="phone"
        header-align="center"
        align="center"
        label="手机号">
      </el-table-column>
      <el-table-column
        prop="username"
        header-align="center"
        align="center"
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="realname"
        header-align="center"
        align="center"
        label="真实姓名">
      </el-table-column>
      <el-table-column
        prop="tradeName"
        header-align="center"
        align="center"
        label="行业">
      </el-table-column>
      <el-table-column
        prop="tradeVisiblePower"
        header-align="center"
        align="center"
        label="行业可见内容权限">
        <template slot-scope="scope">
          <el-button v-show="scope.row.tradeVisiblePower==0" v-if="isAuth('biz:user:openPower')" type="text" size="small" @click="hideToShow(scope.row.uuid)">关闭</el-button>
          <el-button v-show="scope.row.tradeVisiblePower==1" v-if="isAuth('biz:user:closePower')" type="text" size="small" @click="showToHide(scope.row.uuid)">开启</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="certificationTime"
        header-align="center"
        align="center"
        width="120px"
        sortable="certificationTime"
        :formatter="commonDate.formatTime"
        label="认证时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="200"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" v-if="isAuth('biz:user:updateExpertAndLecturer')" @click="$router.push({ name: 'expert-add-or-update',query:{phone:scope.row.phone,uuid:scope.row.uuid} })">编辑</el-button>
          <el-button type="text" size="small" v-if="isAuth('biz:user:expertOrLecturerInfo')" @click="$router.push({ name: 'expert-view',query:{uuid:scope.row.uuid} })">查看</el-button>
          <el-button type="text" size="small" v-if="isAuth('biz:user:deleteExpert')" @click="deleteHandle(scope.row.uuid)">删除</el-button>
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
        sid:'',
        order:'',
        dataForm: {
          phone:'',
          userName:'',
          realName:'',
          creatTime:'',
          trade:'',
          tradeVisiblePower:''
        },
        tradeList:[],
        tradeVisiblePowerList:[{label:'关闭',value:'0'},{label:'开启',value:'1'}],
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
      sortChange (column, prop, order){
        if(column.order=='descending'){
          column.order='desc'
        }
        if(column.order=='ascending'){
          column.order='asc'
        }
        this.sid=column.prop
        this.order=column.order
        this.getDataList ()
      },
      //重置搜索条件
      resetForm(){
        this.dataForm={
          phone:'',
          userName:'',
          realName:'',
          creatTime:'',
          trade:'',
          tradeVisiblePower:''
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
            url: this.$http.adornUrl(ajaxUrl),
            method: 'get',
            params: this.$http.adornParams({uuid:ids})
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
      // 关闭按钮--》开启
      hideToShow (id) {
        this.confirmFn('提示','您确定要开启该专家所匹配的前端行业内容权限吗？','确定','/biz/user/openPower',id)
      },
      // 开启按钮--》关闭
      showToHide (id) {
        this.confirmFn('提示','您确定要关闭该专家所匹配的前端行业内容权限吗？','确定','/biz/user/closePower',id)
      },
      // 删除
      deleteHandle (id) {
        this.confirmFn('提示','您确定要删除该专家吗？删除后该用户将失去专家身份。','确定','/biz/user/deleteExpert',id)
      },
      open() {
        this.$prompt('请输入手机号', '新增专家', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/,
          inputErrorMessage: '手机号格式不正确'
        }).then(({ value }) => {
            this.$http({
              url: this.$http.adornUrl(`/biz/user/expertUserOne`),
              method: 'get',
              params: this.$http.adornParams({phone:value})
            }).then((data) => {
                if(data.data.code==200){
                  if(data.data.data!=null){
                    this.$router.push({ name: 'expert-add-or-update',query:{phone:value,id:data.data.data.uuid} })
                  }else{
                    this.$router.push({ name: 'expert-add-or-update',query:{phone:value} })
                  }
                }else {
                  this.$message({
                    type: 'error',
                    message: data.data.msg
                  })
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
        var creatTimeStart='',creatTimeEnd=''
        if(this.dataForm.creatTime!=undefined&&this.dataForm.creatTime!=""&&this.dataForm.creatTime.length!=0&&this.dataForm.creatTime!=null){
          creatTimeStart=this.dataForm.creatTime[0]
          creatTimeEnd=this.dataForm.creatTime[1]
        }
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/biz/user/expertList'),
          method: 'get',
          params: this.$http.adornParams({
            'pageNum': String(this.pageIndex),
            'pageSize': String(this.pageSize),
            'phone':this.dataForm.phone|| undefined,
            'userName':this.dataForm.userName|| undefined,
            'realName':this.dataForm.realName|| undefined,
            'trade':this.dataForm.trade|| undefined,
            'tradeVisiblePower':this.dataForm.tradeVisiblePower|| undefined,
            'sid':this.dataForm.sid|| undefined,
            'order':this.dataForm.order|| undefined,
            'start':creatTimeStart || undefined,
            'end':creatTimeEnd || undefined
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
