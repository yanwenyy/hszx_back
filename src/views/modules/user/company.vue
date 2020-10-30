<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.uuid"  placeholder="ID" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.phone"  placeholder="手机号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.nickname"  placeholder="昵称" clearable></el-input>
      </el-form-item>
      <el-form-item>
      <el-input v-model="dataForm.realname" placeholder="姓名" clearable></el-input>
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
        <el-input v-model="dataForm.invideRealname" placeholder="邀请人" clearable></el-input>
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
        <el-select v-model="dataForm.nowRole" placeholder="用户角色">
          <el-option
            v-for="item in role"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.ifTrial" placeholder="是否领取试用">
          <el-option
            v-for="item in vipStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="注册时间:">
        <el-date-picker
          v-model="dataForm.jointimeStart"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
        <span>--</span>
        <el-date-picker
          v-model="dataForm.jointimeEnd"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList()">搜索</el-button>
        <el-button  type="warning" @click="resetForm('dataForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="index"
        header-align="center"
        align="center"
        label="序号">
      </el-table-column>
      <el-table-column
        prop="phone"
        header-align="center"
        align="center"
        label="手机号码">
      </el-table-column>
      <el-table-column
        prop="username"
        header-align="center"
        align="center"
        label="昵称">
      </el-table-column>
      <el-table-column
        prop="realname"
        header-align="center"
        align="center"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="companyname"
        header-align="center"
        align="center"
        label="企业名称">
      </el-table-column>
      <el-table-column
        prop="ifTrial"
        header-align="center"
        align="center"
        label="试用">
        <template slot-scope="scope"> {{scope.row.ifTrial==0?'否':'是'}} </template>
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
        prop="inviteId"
        header-align="center"
        align="center"
        label="邀请人ID">
      </el-table-column>
      <el-table-column
        prop="invideRealname"
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
        prop="nowRole"
        header-align="center"
        align="center"
        label="用户当前角色">
        <template slot-scope="scope">
          {{scope.row.nowRole=='1'?'中心销售':scope.row.nowRole=='2'?'股东销售':scope.row.nowRole=='3'?'股东管理员':scope.row.nowRole=='4'?'经销商销售':scope.row.nowRole=='5'?'经销商管理员':scope.row.nowRole=='6'?'代言人':'普通用户'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="createtime"
        header-align="center"
        align="center"
        sortable
        :formatter="commonDate.formatTime"
        label="注册时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.uuid)">编辑</el-button>
          <el-button type="text" size="small"  @click="$router.push({ name: 'company-view',query:{id:scope.row.uuid} })">查看</el-button>
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
  import AddOrUpdate from './company-add-or-update'
  export default {
    data () {
      return {
        dataForm: {
          uuid: '',
          phone: '',
          nickname: '',
          realname: '',
          companyName: '',
          cityCenterId: '',
          cityCenterOrder: 'asc',
          shareholderId: '',
          shareholderOrder: 'asc',
          agencyId: '',
          agencyOrder: 'asc',
          invideRealname: '',
          inviteRealnameOrder: 'asc',
          inviteRole: '',
          nowRole:'',
          jointimeStart: '',
          jointimeEnd: '',
          ifTrial: '',
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
        vipStatus:[//会员状态
          {
            value: '0',
            label: '否'
          },{
            value: '1',
            label: '是'
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
        nameList:[],
        gdList:[],
        jxsList:[],
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
          url: this.$http.adornUrl('/biz/user/enterpriselist'),
          method: 'get',
          params: this.$http.adornParams({
            'pageNum': this.pageIndex,
            'pageSize': this.pageSize,
            'uuid': this.dataForm.uuid,
            'phone': this.dataForm.phone,
            'nickname': this.dataForm.nickname,
            'realname': this.dataForm.realname,
            'companyName': this.dataForm.companyName,
            'cityCenterId': this.dataForm.cityCenterId,
            'cityCenterOrder': this.dataForm.cityCenterOrder,
            'shareholderId': this.dataForm.shareholderId,
            'shareholderOrder': this.dataForm.shareholderOrder,
            'agencyId': this.dataForm.agencyId,
            'agencyOrder': this.dataForm.agencyOrder,
            'invideRealname': this.dataForm.invideRealname,
            'inviteRealnameOrder': this.dataForm.inviteRealnameOrder,
            'inviteRole': this.dataForm.inviteRole,
            'jointimeStart': this.dataForm.jointimeStart,
            'jointimeEnd': this.dataForm.jointimeEnd,
            'nowRole': this.dataForm.nowRole,
            'ifTrial': this.dataForm.ifTrial,
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
      // 获取行业
      getTrade (){
        this.$http({
          url: this.$http.adornUrl('/biz/trade/select'),
          method: 'get'
        }).then(({data}) => {
          if (data && data.code == 200) {
            this.trade = data.data;
          }
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
          uuid: '',
          phone: '',
          nickname: '',
          realname: '',
          companyName: '',
          cityCenterId: '',
          cityCenterOrder: 'asc',
          shareholderId: '',
          shareholderOrder: 'asc',
          agencyId: '',
          agencyOrder: 'asc',
          invideRealname: '',
          inviteRealnameOrder: 'asc',
          inviteRole: '',
          nowRole:'',
          jointimeStart: '',
          jointimeEnd: '',
          ifTrial: '',
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
