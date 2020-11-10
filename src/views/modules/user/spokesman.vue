<template>
  <div class="mod-policy">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-button type="warning" v-if="isAuth('biz:trpolicyoriginal:save')" @click="dialogFormVisible=true;searchPhone=true,dataForm.searchPhoneNum=''">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.uuid" placeholder="ID" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.realname" placeholder="真实姓名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.userName" placeholder="用户名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.phone" placeholder="手机号码" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          clearable
          v-model="dataForm.cityCenterId"
          placeholder="城市运营中心">
          <el-option v-for="item in nameList"
                     :label="item.name"
                     :value="item.id"
                     :key="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="添加时间">
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
        prop="uuid"
        header-align="center"
        align="center"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="realname"
        header-align="center"
        align="center"
        label="真实姓名">
      </el-table-column>
      <el-table-column
        prop="username"
        header-align="center"
        align="center"
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="phone"
        header-align="center"
        align="center"
        width="120px"
        label="手机号码">
      </el-table-column>
      <el-table-column
        prop="citycenterName"
        header-align="center"
        align="center"
        width="120px"
        sortable="custom"
        label="标记城市中心">
      </el-table-column>
      <el-table-column
        prop="joinSpokemanTime"
        header-align="center"
        align="center"
        width="120px"
        sortable="custom"
        label="时间">
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
    <el-dialog title="新增代言人" :visible.sync="dialogFormVisible">
      <div v-show="searchPhone">
        <div class="card-mm-list">
          <span class="dialog-name">请输入手机号:</span>
          <el-input class="city-input" v-model="dataForm.searchPhoneNum"></el-input>
        </div>
        <div class="dialog-footer">
          <el-button type="primary" @click="getPhone()">确 定</el-button>
        </div>

      </div>
     <div v-show="!searchPhone">
       <div class="card-mm-list">
         <span class="dialog-name">请输入手机号:</span>
         <el-input disabled class="city-input" v-model="dataForm.addForm.phone"></el-input>
       </div>
       <div class="card-mm-list">
         <span class="dialog-name">用户名:</span>
         <el-input class="city-input" v-model="dataForm.addForm.username"></el-input>
       </div>
       <div class="card-mm-list">
         <span class="dialog-name">真实姓名:</span>
         <el-input class="city-input" v-model="dataForm.addForm.realname"></el-input>
       </div>
       <div slot="footer" class="dialog-footer">
         <el-button @click="dialogFormVisible = false">关闭</el-button>
         <el-button type="primary" @click="addSpokeMan()">确 定</el-button>
       </div>
     </div>
    </el-dialog>
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
          uuid:'',
          realname:'',
          userName:'',
          phone:'',
          cityCenterId:'',
          cityCenterOrder:'asc',
          joinSpokemanTimeOrder:'asc',
          createTime:'',
          searchPhoneNum:'',
          addForm:{},
        },
        dialogFormVisible:false,
        searchPhone:true,
        managerVisible:false,
        nameList:[],
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
      //中心列表
      this.$http({
        url: this.$http.adornUrl('/biz/organization/centerListOfNoPaging'),
        method: 'GET',
      }).then(({data}) => {
        this.nameList = data.data
      });
    },
    methods: {
      //新增代言人
      addSpokeMan(){
        this.$http({
          url: this.$http.adornUrl('/biz/spokeman/add'),
          method: 'POST',
          data: this.$http.adornData({
            'uuid': this.dataForm.addForm.uuid,
            'username': this.dataForm.addForm.username,
            'realname': this.dataForm.addForm.realname,
          })
        }).then(({data}) => {
          var datas=data.data;
          if(data.code==200){
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.dialogFormVisible = false;
                this.getDataList()
              }
            })
          }else{
            this.$message.error(data.msg)
          }
        });
      },
      //查找手机号,搜索代言人
      getPhone(){
        this.$http({
          url: this.$http.adornUrl('/biz/spokeman/search'),
          method: 'GET',
          params: this.$http.adornParams({
            'phone':this.dataForm.searchPhoneNum,
          })
        }).then(({data}) => {
          var datas=data.data;
          if(data.code==200){
            this.searchPhone = false;
            this.dataForm.addForm=data.data
          }else{
            this.$message.error(data.msg)
          }
        });
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
          uuid:'',
          realname:'',
          userName:'',
          phone:'',
          cityCenterId:'',
          cityCenterOrder:'asc',
          joinSpokemanTimeOrder:'asc',
          createTime:'',
          searchPhoneNum:'',
          addForm:{},
        }
        this.$refs.child.reset()
      },
      //排序
      sortChange (column, prop, order){
        var prop=column.prop;
        if(column.order=='descending'){
          column.order='desc'
        }
        if(column.order=='ascending'){
          column.order='asc'
        }
        if(prop=='citycenterName'){
          this.dataForm.cityCenterOrder=column.order;
        }else if(prop=='joinSpokemanTime'){
          this.dataForm.joinSpokemanTimeOrder=column.order;
        }
        this.prop=column.prop
        this.order=column.order
        this.getDataList ()
      },
      // 获取数据列表
      getDataList () {
        var createTimeStart='',createTimeEnd=''
        if(this.dataForm.createTime!=undefined&&this.dataForm.createTime!=""&&this.dataForm.createTime!=null&&this.dataForm.createTime.length!=0){
          createTimeStart=this.dataForm.createTime[0]
          createTimeEnd=this.dataForm.createTime[1]
        }
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/biz/spokeman/list'),
          method: 'get',
          params: this.$http.adornParams({
            'pageNum': String(this.pageIndex),
            'pageSize': String(this.pageSize),
            'uuid':this.dataForm.uuid|| undefined,
            'realname':this.dataForm.realname|| undefined,
            'userName':this.dataForm.userName|| undefined,
            'phone':this.dataForm.phone|| undefined,
            'cityCenterId':this.dataForm.cityCenterId|| undefined,
            'cityCenterOrder':this.dataForm.cityCenterOrder|| undefined,
            'joinSpokemanTimeOrder':this.dataForm.joinSpokemanTimeOrder|| undefined,
            'joinSpokemanTimeStart':createTimeStart || undefined,
            'joinSpokemanTimeEnd':createTimeEnd || undefined,
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
  .card-mm-list{
    margin-bottom: 10px;
  }
  .dialog-footer{
    text-align: center;
    margin-top: 20px;
  }
</style>
