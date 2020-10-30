<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.phone"  placeholder="手机号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.nickname" placeholder="昵称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.ifTry" placeholder="是否领取试用" clearable>
          <el-option
            v-for="item in ifSy"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="注册时间:">
        <el-date-picker
          v-model="dataForm.start"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
        <span>--</span>
        <el-date-picker
          v-model="dataForm.end"
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
        <el-form-item>
          <el-button type="warning" @click="excelDown()">导出</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      :header-cell-style="{background: 'rgb(21, 161, 147)',color:'#fff'}"
      style="width: 100%;">
      <el-table-column
        type="index"
        header-align="center"
        align="center"
        label="ID">
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
        prop="city"
        header-align="center"
        align="center"
        label="地区">
      </el-table-column>
      <el-table-column
        prop="city"
        header-align="center"
        align="center"
        label="企业名称">
      </el-table-column>
      <el-table-column
        prop="joinCompany"
        header-align="center"
        align="center"
        label="是否加入过企业">
        <template slot-scope="scope">
          {{scope.row.joinCompany=='1'?'是':'否'}}
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
        :formatter="commonDate.formatTime"
        label="注册时间">
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
          phone: '',
          nickname: '',
          start: '',
          end: ''
        },
        ifSy:[
          {
          label:'是',
          value:1
           },
          {
            label:'否',
            value:0
          }],
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    activated () {
      this.getDataList()
    },
    methods: {
      //导出
      excelDown(){
        this.$http({
          url: this.$http.adornUrl('/biz/user/exportPerson'),
          method: 'get',
          responseType: "blob",
          params: this.$http.adornParams({
            'pageNum': this.pageIndex,
            'pageSize': this.pageSize,
            'phone': this.dataForm.phone,
            'nickname': this.dataForm.nickname,
            'start': this.dataForm.start,
            'end': this.dataForm.end
          })
        }).then(res => {
          let content = res.data;
          let blob = new Blob([content]);
          let fileName = "普通用户管理导出.xlsx";
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
          this.$message.error("服务器出现问题,请稍后再试");
        })
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/biz/user/userlist'),
          method: 'get',
          params: this.$http.adornParams({
            'pageNum': this.pageIndex,
            'pageSize': this.pageSize,
            'phone': this.dataForm.phone,
            'nickname': this.dataForm.nickname,
            'createtimeStart': this.dataForm.start,
            'createtimeEnd': this.dataForm.end
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
          phone: '',
          nickname: '',
          start: '',
          end: ''
        }
      },
      // 是否加入企业\是否试用
      jionStatus (row, column, cellValue) {
        if (cellValue == "1"){
          return '是';
        }else{
          return '否';
        }
      }
    }
  }
</script>
<style>
  .seach-btn{
    text-align: right;
  }
</style>
