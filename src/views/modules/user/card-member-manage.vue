<template>
  <div class="mod-policy">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <div class="card-mm-title">致通振业事务所</div>
      <el-button type="primary" @click="dialogFormVisible=true">添加授权人员</el-button>
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
        type="index"
        header-align="center"
        align="center"
        width="80"
        label="序号">
      </el-table-column>
      <el-table-column
        prop="uuid"
        header-align="center"
        align="center"
        label="用户ID">
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
        prop="phone"
        header-align="center"
        align="center"
        label="手机号码">
      </el-table-column>
      <el-table-column
        prop="companyName"
        header-align="center"
        align="center"
        label="企业名称">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="200"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" v-if="isAuth('biz:trpolicyoriginal:delete')" @click="deleteHandle(scope.row.uuid)">删除</el-button>
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
    <el-dialog title="新增企业用户" :visible.sync="dialogFormVisible">
      <div class="card-mm-list">
        <span class="dialog-name">请输入手机号:</span>
        <el-input class="city-input" v-model="dataForm.phone"></el-input>
        <el-button type="primary" @click="ifAllow">搜索</el-button>
      </div>
      <div class="card-mm-list">
        <span class="dialog-name">用户名:</span>
        <el-input :disabled="allowPhone" class="city-input" v-model="dataForm.username"></el-input>
      </div>
      <div class="card-mm-list">
        <span class="dialog-name">真实姓名:</span>
        <el-input :disabled="allowPhone" class="city-input" v-model="dataForm.realname"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关闭</el-button>
        <el-button type="primary" @click="addPerson">确 定</el-button>
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
          id:'',
          phone:'',
          realname:'',
          username:'',
          uuid:''
        },
        allowPhone:true,
        dialogFormVisible:false,
        managerVisible:false,
        djList:[],
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
      this.dataForm.id=this.$route.query.id;
      this.getDataList()
    },
    mounted(){
      this.dataForm.id=this.$route.query.id;
      this.getDataList()
    },
    methods: {
      //添加万能卡人员
      addPerson(){
        this.$http({
          url: this.$http.adornUrl(`/user/add`),
          method: 'post',
          data: this.$http.adornData({
            'allpowerId': this.dataForm.id,
            'uuid':this.dataForm.uuid,
            'phone': this.dataForm.phone,
            'realname': this.dataForm.realname,
            'username': this.dataForm.username
          })
        }).then(({data}) => {
          if (data && data.code == 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.dialogFormVisible = false;
                this.getDataList();
              }
            })

          } else {
            this.$message.error(data.msg)
          }
        })
      },
      //查找手机号是否可以添加万能卡
      ifAllow(){
        this.$http({
          url: this.$http.adornUrl(`/ifAllpowerUser/${this.dataForm.phone}`),
          method: 'get',
        }).then(({data}) => {
          if (data && data.code == 200) {
            this.allowPhone=false;
            this.dataForm.realname=data.data.realname;
            this.dataForm.username=data.data.username;
            this.dataForm.uuid=data.data.uuid;
          } else {
            this.$message.error(data.msg)
          }
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
          id:'',
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
        this.$confirm(`您确定要删除${policyId.length > 1 ? '[id=' + policyId.join(',') + ']':'该'}人员吗？`, ``, {
          confirmButtonText: `确定`,
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/user/del/'+id),
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
          url: this.$http.adornUrl('/user/list/'+this.dataForm.id),
          method: 'get',
        }).then(({data}) => {
          if (data && data.code == 200) {
            this.dataList = data.data
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
  .card-mm-title{
    font-size: 18px;
    font-weight: bold;
    display: inline-block;
    margin-bottom: 20px;
    margin-right: 20px;
  }
  .city-input{
    width: 60%;
  }
  .dialog-name{
    width: 20%;
    text-align: right;
    display: inline-block;
  }
  .card-mm-list{
    margin-bottom: 20px;
  }
</style>
