<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.companyName" placeholder="企业名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.uuid" placeholder="企业ID" clearable></el-input>
      </el-form-item>
     <el-form-item>
        <el-input  placeholder="管理层姓名" v-model="dataForm.realName" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input  placeholder="手机号" v-model="dataForm.phone" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.vipStatus"
          clearable
          placeholder="会员状态" style="width: 150px">
          <el-option v-for="item in vipStatusList"
                     :label="item.name"
                     :value="item.value"
                     :key="item.value" >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.tryNum"
          clearable
          placeholder="试用时长" style="width: 150px">
          <el-option v-for="item in tryNumList"
                     :label="item.name"
                     :value="item.value"
                     :key="item.value" >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.ifTrial"
          clearable
          placeholder="试用状态" style="width: 150px">
          <el-option v-for="item in ifTrialList"
                     :label="item.name"
                     :value="item.value"
                     :key="item.value" >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="领取时间：">
        <el-date-picker
          v-model="timeS"
          type="daterange"
          range-separator="至"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="创建时间：">
        <el-date-picker
          v-model="timeS1"
          type="daterange"
          range-separator="至"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList()">查询</el-button>
      </el-form-item>
      <el-form-item>
      <el-button type="warning" @click="excelDown()">导出</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
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
        prop="uuid"
        header-align="center"
        align="center"
        label="企业ID">
      </el-table-column>
      <el-table-column
        prop="companyname"
        header-align="center"
        align="center"
        label="企业名称">
      </el-table-column>
      <el-table-column
        prop="realName"
        header-align="center"
        align="center"
        label="管理层姓名">
      </el-table-column>
      <el-table-column
        prop="phone"
        header-align="center"
        align="center"
        label="手机号">
      </el-table-column>
      <el-table-column
        prop="vipStatus"
        header-align="center"
        align="center"
        label="会员状态">
      </el-table-column>
      <el-table-column
        prop="tryNum"
        header-align="center"
        align="center"
        label="试用时长">
      </el-table-column>
      <el-table-column
        prop="ifTrial"
        header-align="center"
        align="center"
        label="试用状态">
      </el-table-column>
      <el-table-column
        prop="trystarttime"
        header-align="center"
        align="center"
        label="试用领取时间">
      </el-table-column>
      <el-table-column
        prop="createtime"
        header-align="center"
        align="center"
        label="企业创建时间">
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
          phone:'',
          realName:'',
          uuid:'',
          companyName:'',
          vipStatus:'',
          tryNum:'',
          ifTrial:'',
          tryStartTime1:'',
          tryStartTime2:'',
          createTime1:'',
          createTime2:''
        },
        timeS:[],
        timeS1:[],
        vipStatusList:[{name:'有效',value:"0"},{name:'过期',value:"1"},{name:'未开通',value:"2"}],
        ifTrialList:[{name:'有效',value:"1"},{name:'失效',value:"0"}],
        tryNumList:[],
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
    mounted() {
      //试用时长
      this.$http({
        url: this.$http.adornUrl('/biz/try/tryList'),
        method: 'get',
        data: this.$http.adornData()
      }).then(({data}) => {
        for(var i=0;i<data.data.length;i++){
          console.log(data.data[i])
          this.tryNumList.push({
            'name':data.data[i],
            'value':data.data[i]
          })
        }

      })
    },
    methods: {
      //导出
      excelDown(){
        this.$http({
          url: this.$http.adornUrl('/biz/try/export/tryList'),
          method: 'get',
          responseType: "blob",
          params: this.$http.adornParams({
            'phone':this.dataForm.phone || undefined,
            'realName':this.dataForm.realName || undefined,
            'uuid':this.dataForm.uuid || undefined,
            'companyName':this.dataForm.companyName || undefined,
            'vipStatus':this.dataForm.vipStatus || undefined,
            'tryNum':this.dataForm.tryNum || undefined,
            'ifTrial':this.dataForm.ifTrial || undefined,
            'tryStartTime1':this.dataForm.tryStartTime1 || undefined,
            'tryStartTime2':this.dataForm.tryStartTime2 || undefined,
            'createTime1':this.dataForm.createTime1 || undefined,
            'createTime2':this.dataForm.createTime2 || undefined
          })
        }).then(res => {
          let content = res.data;
          let blob = new Blob([content]);
          let fileName = "试用期管理导出.xlsx";
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
        if(this.timeS==null){this.timeS=[]}
        if(this.timeS1==null){this.timeS1=[]}
        if(this.timeS.length!=0){
          this.dataForm.tryStartTime1=this.timeS[0]
          this.dataForm.tryStartTime2=this.timeS[1]
        }
        if(this.timeS1.length!=0){
          this.dataForm.createTime1=this.timeS1[0]
          this.dataForm.createTime2=this.timeS1[1]
        }
        this.$http({
          url: this.$http.adornUrl('biz/try/list'),
          method: 'get',
          params: this.$http.adornParams({
            'pageNum': String(this.pageIndex),
            'pageSize': String(this.pageSize),
            'phone':this.dataForm.phone || undefined,
            'realName':this.dataForm.realName || undefined,
            'uuid':this.dataForm.uuid || undefined,
            'companyName':this.dataForm.companyName || undefined,
            'vipStatus':this.dataForm.vipStatus || undefined,
            'tryNum':this.dataForm.tryNum || undefined,
            'ifTrial':this.dataForm.ifTrial || undefined,
            'tryStartTime1':this.dataForm.tryStartTime1 || undefined,
            'tryStartTime2':this.dataForm.tryStartTime2 || undefined,
            'createTime1':this.dataForm.createTime1 || undefined,
            'createTime2':this.dataForm.createTime2 || undefined,
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
      }
    }
  }
</script>
