<template>
  <div class="mod-policy">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-button type="warning" v-if="isAuth('biz:trpolicyoriginal:save')" @click="dialogFormVisible=true,dataForm.searchPhone=''">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.uuid" placeholder="ID" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.realName" placeholder="真实姓名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.userName" placeholder="用户名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.phone" placeholder="手机号码" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.nowRole"
          clearable
          placeholder="角色" >
          <el-option v-for="item in jsList"
                     :label="item.label"
                     :value="item.value"
                     :key="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.cityCenterId"
          clearable
          placeholder="城市运营中心" >
          <el-option v-for="item in nameList"
                     :label="item.name"
                     :value="item.id"
                     :key="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.shareholderId"
          clearable
          placeholder="股东机构" >
          <el-option v-for="item in gdList"
                     :label="item.name"
                     :value="item.id"
                     :key="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.agencyId"
          clearable
          placeholder="经销商机构" >
          <el-option v-for="item in jxsList"
                     :label="item.agencyName"
                     :value="item.agencyId"
                     :key="item.agencyId">
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
        width="80"
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
        prop="nowRole"
        header-align="center"
        align="center"
        width="120px"
        label="角色">
        <template slot-scope="scope">
          {{scope.row.nowRole==1?'股东管理员':'股东销售'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="citycenterName"
        header-align="center"
        align="center"
        width="120px"
        label="城市运营中心">
      </el-table-column>
      <el-table-column
        prop="shareholderName"
        header-align="center"
        align="center"
        width="120px"
        label="股东机构">
      </el-table-column>
      <el-table-column
        prop="agencyName"
        header-align="center"
        align="center"
        width="120px"
        label="经销商机构">
      </el-table-column>
      <el-table-column
        prop="joinTimeOrg"
        header-align="center"
        align="center"
        width="120px"
        sortable="custom"
        :formatter="commonDate.formatDate"
        label="添加时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="200"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" v-if="isAuth('biz:trpolicyoriginal:update')"  @click="$router.push({ name: 'p-distributor-add-or-update',query:{id:scope.row.uuid} })">编辑</el-button>
          <el-button type="text" size="small" v-if="isAuth('biz:trpolicyoriginal:info')" @click="$router.push({ name: 'p-distributor-view',query:{id:scope.row.uuid} })">查看</el-button>
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
    <el-dialog title="新增销售" :visible.sync="dialogFormVisible">
      <el-form  :model="dataForm" :rules="dataRule" ref="diaLog">
        <el-form-item label="请输入手机号" prop="phone">
          <el-input v-model="dataForm.searchPhone"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="goAdd()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { isMobile } from '@/utils/validate'
  export default {
    data () {
      var validateMobile = (rule, value, callback) => {
        if (!isMobile(value)&&value!="") {
          callback(new Error('手机号码格式错误'))
        } else {
          callback()
        }
      }
      return {
        myHeaders: {
          token: this.$cookie.get('token')
        },
        dataForm: {
          uuid:'',
          realName:'',
          userName:'',
          phone:'',
          cityCenterId:'',
          shareholderId:'',
          agencyId:'',
          nowRole:'',
          createTime:'',
          searchPhone:''//新增中心销售事查找手机号
        },
        dialogFormVisible:false,
        dataRule:{
          phone:[
            { validator: validateMobile, trigger: 'blur' }
          ],
        },
        managerVisible:false,
        jsList:[
          {
            label:'股东管理员',
            value:'3'
          },
          {
            label:'股东销售',
            value:'2'
          }
        ],
        nameList:[],
        gdList:[],
        jxsList:[],
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
      //股东机构列表
      this.$http({
        url: this.$http.adornUrl('/biz/organization/shareholderListOfNoPaging'),
        method: 'GET',
      }).then(({data}) => {
        this.gdList = data.data
      });
      //经销商列表
      this.$http({
        url: this.$http.adornUrl('/biz/orgTbUser/agentUserListOfNoPaging'),
        method: 'GET',
      }).then(({data}) => {
        this.jxsList = data.data
      });
    },
    methods: {
      //新增中心销售
      goAdd(){
        this.$refs['diaLog'].validate((valid) => {
          //判断用户销售身份
          this.$http({
            url: this.$http.adornUrl('/biz/orgTbUser/infoTbUserOfRole/'+this.dataForm.searchPhone),
            method: 'GET',
          }).then(({data}) => {
            var datas=data.data;
            if(data.code==200){
              this.dialogFormVisible = false;
              this.$router.push({ name: 'p-distributor-add-or-update',query:{'phone': this.dataForm.searchPhone,'username':datas.username,'realname':datas.realname} })
            }else{
              this.$message.error(data.msg)
            }
          });
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
          uuid:'',
          realName:'',
          userName:'',
          phone:'',
          cityCenterId:'',
          shareholderId:'',
          agencyId:'',
          nowRole:'',
          createTime:'',
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
        this.$confirm(`您确定要删除${policyId.length > 1 ? '[id=' + policyId.join(',') + ']':'该'}数据吗？`, ``, {
          confirmButtonText: `确定`,
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/biz/deleteAgentUser/delete'),
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
        if(this.dataForm.createTime!=undefined&&this.dataForm.createTime!=""&&this.dataForm.createTime!=null&&this.dataForm.createTime.length!=0){
          createTimeStart=this.dataForm.createTime[0]
          createTimeEnd=this.dataForm.createTime[1]
        }
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/biz/orgTbUser/agentUserListOfPaging'),
          method: 'get',
          params: this.$http.adornParams({
            'pageNum': String(this.pageIndex),
            'pageSize': String(this.pageSize),
            'uuid':this.dataForm.uuid|| undefined,
            'realName':this.dataForm.realName|| undefined,
            'userName':this.dataForm.userName|| undefined,
            'phone':this.dataForm.phone|| undefined,
            'cityCenterId':this.dataForm.cityCenterId|| undefined,
            'shareholderId':this.dataForm.shareholderId|| undefined,
            'agencyId':this.dataForm.agencyId|| undefined,
            'nowRole':this.dataForm.nowRole|| undefined,
            'createTimeStart':createTimeStart || undefined,
            'createTimeEnd':createTimeEnd || undefined,
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

</style>
