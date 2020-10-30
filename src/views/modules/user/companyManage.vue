<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-button v-if="isAuth('biz:company:save')" type="warning" @click="$router.push({ name: 'companyManage-add' })" >新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.uuid" placeholder="企业ID" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.companyName" placeholder="企业名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.cityCenterId" placeholder="标记城市中心">
          <el-option v-for="item in nameList"
                     :label="item.name"
                     :value="item.id"
                     :key="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.shareholderId" placeholder="标记股东机构">
          <el-option
            v-for="item in gdList"
            :label="item.name"
            :value="item.id"
            :key="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.agencyId" placeholder="标记股代理商">
          <el-option v-for="item in jxsList"
                     :label="item.agencyName"
                     :value="item.agencyId"
                     :key="item.agencyId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="邀请人">
        <el-input v-model="dataForm.inviteRealname" placeholder="邀请人" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.inviteRole" placeholder="邀请人角色">
          <el-option
            v-for="item in roleList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.version" placeholder="企业版本">
          <el-option
            v-for="item in companyList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间：">
        <el-date-picker
          v-model="dataForm.createtimeStart"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
        <span>--</span>
        <el-date-picker
          v-model="dataForm.createtimeEnd"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <div class="seach-btn">
        <el-form-item>
          <el-button type="primary" @click="getDataList()">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button  type="warning" @click="resetForm('dataForm')">重置</el-button>
        </el-form-item>
        <!--<el-form-item>
          <el-button type="warning" @click="">导出</el-button>
        </el-form-item>-->
      </div>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
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
        prop="companyname"
        header-align="center"
        align="center"
        label="企业名称">
      </el-table-column>
      <el-table-column
        prop="cardType"
        header-align="center"
        align="center"
        label="企业版本">
        <template slot-scope="scope">
        {{scope.row.cardType=='1'?'个人版':scope.row.cardType=='2'?'企业版':scope.row.cardType=='3'?'集团版':'无版本'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="citycenterName"
        header-align="center"
        align="center"
        label="标记城市中心">
      </el-table-column>
      <el-table-column
        prop="shareholderName"
        header-align="center"
        align="center"
        label="标记股东机构">
      </el-table-column>
      <el-table-column
        prop="agencyName"
        header-align="center"
        align="center"
        label="标记代理商">
      </el-table-column>
      <el-table-column
        prop="inviteRealname"
        header-align="center"
        align="center"
        label="邀请人">
      </el-table-column>
      <el-table-column
        prop="inviteRole"
        header-align="center"
        align="center"
        label="邀请人角色">
        <template slot-scope="scope">
          {{scope.row.inviteRole=='1'?'中心销售':scope.row.inviteRole=='2'?'股东销售':scope.row.inviteRole=='3'?'股东管理员':scope.row.inviteRole=='4'?'经销商销售':scope.row.inviteRole=='5'?'经销商管理员':scope.row.inviteRole=='6'?'代言人':'普通用户'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="createtime"
        header-align="center"
        align="center"
        sortable
        :formatter="commonDate.formatTime"
        label="企业创建时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="$router.push({ name: 'company-account',query:{id:scope.row.uuid ,cardType:scope.row.cardType,personNumber:scope.row.personNumber} })">账户管理</el-button>
          <el-button type="text" size="small" @click="$router.push({ name: 'company-equity',query:{id:scope.row.uuid} })">权益管理</el-button>
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.uuid)">编辑</el-button>
          <el-button type="text" size="small"  @click="$router.push({ name: 'companyManage-view',query:{id:scope.row.uuid} })">查看</el-button>
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
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import VDistpicker from 'v-distpicker'
  import AddOrUpdate from './companyManage-update'
  export default {
    data () {
      return {
        dataForm: {
          uuid:'',
          companyName: '',
          cityCenterId: '',
          cityCenterOrder: 'asc',
          shareholderId: '',
          shareholderOrder: 'asc',
          agencyId: '',
          agencyOrder: 'asc',
          inviteRealname: '',
          inviteRole: '',
          version: '',
          createtimeOrder:'asc',
          createtimeStart:'',
          createtimeEnd:''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        role:[//用户角色
          {
            value: '0',
            label: '管理员'
          },{
            value: '1',
            label: '员工'
          }
        ],
        roleList:[//会员状态
          {
            value: '1',
            label: '中心销售'
          },{
            value: '2',
            label: '股东销售'
          },{
            value: '3',
            label: '股东管理员'
          },{
            value: '4',
            label: '经销商销售'
          },{
            value: '5',
            label: '经销商管理员'
          },{
            value: '6',
            label: '代言人'
          },{
            value: '7',
            label: '普通用户'
          },
        ],
        companyList:[
          {
            value: '0',
            label: '无版本'
          },{
            value: '1',
            label: '个人版'
          },{
            value: '2',
            label: '企业版'
          },{
            value: '3',
            label: '集团版'
          },
        ],
        nameList:[],
        gdList:[],
        jxsList:[],
        companyScale:[],//规模
        companyNature:[],//性质
      }
    },
    components: {
      VDistpicker ,
      AddOrUpdate
    },
    activated () {
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
      this.getDataList();
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/biz/company/list'),
          method: 'get',
          params: this.$http.adornParams({
            'pageNum': this.pageIndex,
            'pageSize': this.pageSize,
            'uuid':this.dataForm.uuid || undefined,
            'companyName': this.dataForm.companyName || undefined,
            'cityCenterId': this.dataForm.cityCenterId || undefined,
            'cityCenterOrder': this.dataForm.cityCenterOrder || undefined,
            'shareholderId': this.dataForm.shareholderId || undefined,
            'shareholderOrder': this.dataForm.shareholderOrder || undefined,
            'agencyId': this.dataForm.agencyId || undefined,
            'agencyOrder': this.dataForm.agencyOrder || undefined,
            'inviteRealname': this.dataForm.inviteRealname || undefined,
            'inviteRole': this.dataForm.inviteRole || undefined,
            'version': this.dataForm.version || undefined,
            'createtimeOrder':this.dataForm.createtimeOrder || undefined,
            'createtimeStart':this.dataForm.createtimeStart || undefined,
            'createtimeEnd':this.dataForm.createtimeEnd || undefined
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
          uuid:'',
          companyName: '',
          cityCenterId: '',
          cityCenterOrder: 'asc',
          shareholderId: '',
          shareholderOrder: 'asc',
          agencyId: '',
          agencyOrder: 'asc',
          inviteRealname: '',
          inviteRole: '',
          version: '',
          createtimeOrder:'asc',
          createtimeStart:'',
          createtimeEnd:''
        }
      },
      // 是否加入企业
      jionStatus (row, column, cellValue) {
        if (cellValue == "1"){
          return '是';
        }else{
          return '否';
        }
      },
    }
  }
</script>
<style>
  .seach-btn{
    text-align: right;
  }
</style>
