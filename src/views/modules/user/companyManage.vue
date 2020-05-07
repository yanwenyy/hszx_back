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
        <el-select v-model="dataForm.companyNature" placeholder="企业性质">
          <el-option
            v-for="item in companyNature"
            :key="item.uuid"
            :label="item.name"
            :value="item.uuid">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.trade" placeholder="行业">
          <el-option
            v-for="item in trade"
            :key="item.tradeId"
            :label="item.tradeName"
            :value="item.tradeId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.companyScale" placeholder="规模">
          <el-option
            v-for="item in companyScale"
            :key="item.uuid"
            :label="item.name"
            :value="item.uuid">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="地区">
        <el-input v-model="dataForm.city" placeholder="地区" clearable></el-input>
        <!--<v-distpicker hide-area></v-distpicker>-->
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.vipStatus" placeholder="会员状态">
          <el-option
            v-for="item in vipStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.vipStatus" placeholder="问答剩余量">
          <el-option
            v-for="item in vipStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="服务到期时间">
        <el-date-picker
          v-model="dataForm.vaildStartTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
        <span>--</span>
        <el-date-picker
          v-model="dataForm.vaildLastTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="开通时间：">
        <el-date-picker
          v-model="dataForm.createStart"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
        <span>--</span>
        <el-date-picker
          v-model="dataForm.createEnd"
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
        prop="companynature"
        header-align="center"
        align="center"
        label="企业性质">
      </el-table-column>
      <el-table-column
        prop="trade"
        header-align="center"
        align="center"
        label="行业">
      </el-table-column>
      <el-table-column
        prop="companyscale"
        header-align="center"
        align="center"
        label="规模">
      </el-table-column>
      <el-table-column
        prop="city"
        header-align="center"
        align="center"
        label="企业所在地域">
      </el-table-column>
      <el-table-column
        prop="currentStaffNum"
        header-align="center"
        align="center"
        label="当前人员数量">
      </el-table-column>
      <el-table-column
        prop="laveStaffNum"
        header-align="center"
        align="center"
        label="可增加人员数量">
      </el-table-column>
      <el-table-column
        prop="vipStatus"
        header-align="center"
        align="center"
        label="会员状态">
      </el-table-column>
      <el-table-column
        prop="questionNum"
        header-align="center"
        align="center"
        label="问答剩余量">
      </el-table-column>
      <el-table-column
        prop="coachEndTime"
        header-align="center"
        align="center"
        :formatter="commonDate.formatTime"
        label="辅导截止月份">
      </el-table-column>
      <el-table-column
        prop="vaildLastTime"
        header-align="center"
        align="center"
        sortable
        :formatter="commonDate.formatTime"
        label="服务到期时间">
      </el-table-column>
      <el-table-column
        prop="createtime"
        header-align="center"
        align="center"
        sortable
        :formatter="commonDate.formatTime"
        label="创建时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="$router.push({ name: 'company-account',query:{id:scope.row.uuid} })">账户管理</el-button>
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
          companyNature: '',
          trade: '',
          companyScale: '',
          city: '',
          vipStatus: '',
          vaildStartTime: '',
          vaildLastTime: '',
          createStart: '',
          createEnd: ''
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
            label: '有效'
          },{
            value: '1',
            label: '过期'
          }
        ],
        trade:[],//行业
        companyScale:[],//规模
        companyNature:[],//性质
      }
    },
    components: {
      VDistpicker ,
      AddOrUpdate
    },
    activated () {
      this.getDataList();
      this.getTrade();
      this.getCompanyScale ();
      this.getCompanyNature();
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
            'companyNature': this.dataForm.companyNature || undefined,
            'trade': this.dataForm.trade || undefined,
            'companyScale': this.dataForm.companyScale || undefined,
            'city': this.dataForm.city || undefined,
            'vipStatus': this.dataForm.vipStatus || undefined,
            'vaildStartTime': this.dataForm.vaildStartTime || undefined,
            'vaildLastTime': this.dataForm.vaildLastTime || undefined,
            'createStart': this.dataForm.createStart || undefined,
            'createEnd': this.dataForm.createEnd || undefined,
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
          uuid:'',
          phone: '',
          realName: '',
          userName: '',
          companyName: '',
          companyId: '',
          role: '',
          vipStatus: '',
          trade: '',
          city: '',
          regStart: '',
          regEnd: '',
          bindStart: '',
          bindEnd: '',
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
      // 获取规模
      getCompanyScale () {
        this.$http({
          url: this.$http.adornUrl('/biz/syscode/select/?category=2'),
          method: 'get'
        }).then(({data}) => {
          if (data && data.code == 200) {
            this.companyScale = data.data;
          }
        })
      },
      // 获取性质
      getCompanyNature () {
        this.$http({
          url: this.$http.adornUrl('/biz/syscode/select/?category=3'),
          method: 'get'
        }).then(({data}) => {
          if (data && data.code == 200) {
            this.companyNature = data.data;
          }
        })
      }
    }
  }
</script>
<style>
  .seach-btn{
    text-align: right;
  }
</style>
