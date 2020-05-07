<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.phone" placeholder="手机号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.realName" placeholder="真实姓名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.role"
          clearable
          placeholder="用户类型" style="width: 150px">
          <el-option v-for="item in roleList"
                     :label="item.name"
                     :value="item.value"
                     :key="item.value" >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.packNum"
          clearable
          placeholder="辅导进度" style="width: 150px">
          <el-option v-for="item in packNumList"
                     :label="item.name"
                     :value="item.value"
                     :key="item.value" >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.annualResults"
          clearable
          placeholder="年度成绩" style="width: 150px">
          <el-option v-for="item in annualResultsList"
                     :label="item.name"
                     :value="item.value"
                     :key="item.value" >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-input v-model="dataForm.companyName" placeholder="企业名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.companyId" placeholder="企业ID" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList()">搜索</el-button>
        <el-button type="info" @click="resetForm()" >重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" @click="excelDown()">导出</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @sort-change='sortChange'
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        header-align="center"
        align="center"
        width="60"
        label="序号">
        <template slot-scope="scope">{{totalPage-scope.$index-(pageIndex-1)*10}}</template>
      </el-table-column>
      <el-table-column
        prop="companyId"
        header-align="center"
        align="center"
        label="企业ID">
      </el-table-column>
      <el-table-column
        prop="companyName"
        header-align="center"
        align="center"
        label="企业名称">
      </el-table-column>
      <el-table-column
        prop="phone"
        header-align="center"
        align="center"
        label="手机号">
      </el-table-column>
      <el-table-column
        prop="realName"
        header-align="center"
        align="center"
        label="真实姓名">
      </el-table-column>
      <el-table-column
        prop="roleName"
        header-align="center"
        align="center"
        label="用户类型">
      </el-table-column>
      <el-table-column
        prop="packNum"
        header-align="center"
        align="center"
        sortable="custom"
        label="辅导进度">
      </el-table-column>
      <el-table-column
        prop="punchRatio"
        header-align="center"
        align="center"
        label="打卡总量">
      </el-table-column>
      <el-table-column
        prop="unqualifiedNum"
        header-align="center"
        align="center"
        label="不合格">
      </el-table-column>
      <el-table-column
        prop="qualifiedNum"
        header-align="center"
        align="center"
        label="合格">
      </el-table-column>
      <el-table-column
        prop="excellentNum"
        header-align="center"
        align="center"
        label="优秀">
      </el-table-column>
      <el-table-column
        prop="annualResults"
        header-align="center"
        align="center"
        label="年度成绩">
      </el-table-column>
      <el-table-column
        prop="repairNum"
        header-align="center"
        align="center"
        sortable="custom"
        label="补考">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="50"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="$router.push({ name: 'policy-data-total-view',query:{uuid:scope.row.uuid} })">查看</el-button>
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
        dataForm: {
          realName:'',
          phone:'',
          role:'',
          packNum:'',
          companyName:'',
          companyId:'',
          annualResults:''
        },
        dataList: [],
        roleList:[{name:'管理层',value:'0'},{name:'员工层',value:'1'}],
        packNumList:[{name:'1',value:'1'},{name:'2',value:'2'},{name:'3',value:'3'},{name:'4',value:'4'},{name:'5',value:'5'},{name:'6',value:'6'},{name:'7',value:'7'},{name:'8',value:'8'},{name:'9',value:'9'},{name:'10',value:'10'},{name:'11',value:'11'},{name:'12',value:'12'},{name:'完成',value:'完成'}],
        annualResultsList:[{name:'优秀',value:'优秀'},{name:'合格',value:'合格'},{name:'不合格',value:'不合格'}],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        isToken:this.$cookie.get('token')
      }
    },
    activated () {
      this.getDataList()
    },
    methods: {
      excelDown(){
        this.$http({
          url: this.$http.adornUrl('/biz/coach/userCoachTotalScoreList'),
          method: 'post',
          responseType: "blob",
          data: this.$http.adornData({
            "realName":this.dataForm.realName || undefined,
            "phone":this.dataForm.phone || undefined,
            "role":this.dataForm.role || undefined,
            "packNum":this.dataForm.packNum || undefined,
            "companyName":this.dataForm.companyName || undefined,
            "companyId":this.dataForm.companyId || undefined,
            "annualResults":this.dataForm.annualResults || undefined
          })
        }).then(res => {
            let content = res.data;
            let blob = new Blob([content]);
            let fileName = "用户辅导总成绩导出.xlsx";
            if ("download" in document.createElement("a")) {
              // 非IE下载
              let elink = document.createElement("a");
              elink.download = fileName;
              elink.style.display = "none";
              elink.href = URL.createObjectURL(blob);
              document.body.appendChild(elink);
              elink.click();
              URL.revokeObjectURL(elink.href); // 释放URL 对象
              document.body.removeChild(elink);
            } else {
              // IE10+下载
              navigator.msSaveBlob(blob, fileName);
            }
            this.$message.success("生成文件成功");
          }).catch(err => {
              console.log(err);
              this.$message.error("服务器出现问题,请稍后再试");
            });
      },
      //重置搜索条件
      resetForm(){
        this.dataForm={
          realName: '',
          phone:'',
          packNum:'',
          companyName:'',
          role:'',
          companyId:'',
          annualResults:''
        }
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
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/biz/coach/userCoachTotalScoreList'),
          method: 'post',
          data: this.$http.adornData({
            'page': String(this.pageIndex),
            'limit': String(this.pageSize),
            "realName":this.dataForm.realName || undefined,
            "phone":this.dataForm.phone || undefined,
            "role":this.dataForm.role || undefined,
            "packNum":this.dataForm.packNum || undefined,
            "companyName":this.dataForm.companyName || undefined,
            "companyId":this.dataForm.companyId || undefined,
            "annualResults":this.dataForm.annualResults || undefined
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
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/biz/userqu/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      }
    }
  }
</script>
