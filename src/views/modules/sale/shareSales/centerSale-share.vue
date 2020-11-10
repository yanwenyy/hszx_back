<template>
  <div class="mod-policy">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-popover
          placement="right"
          width="400"
          v-model="batchVisible"
          trigger="click">
          <div>批量修改卡种选择</div>
          <div>
            <el-checkbox-group v-model="checkList">
              <el-checkbox label="复选框 A"></el-checkbox>
              <el-checkbox label="复选框 B"></el-checkbox>
              <el-checkbox label="复选框 C"></el-checkbox>
            </el-checkbox-group>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="batchVisible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="openDialog(1,'产品直销分成批量设置')">确定</el-button>
            </div>
          </div>
          <el-button v-if="false" type="warning" slot="reference">批量设置分成</el-button>
        </el-popover>
      </el-form-item>
      <!--<el-form-item>-->
        <!--<el-input v-model="dataForm.id" placeholder="ID" clearable></el-input>-->
      <!--</el-form-item>-->
      <el-form-item>
        <el-input v-model="dataForm.realName" placeholder="销售姓名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.pid"
          clearable
          placeholder="所属运营中心" >
          <el-option v-for="item in nameList"
                     :label="item.name"
                     :value="item.name"
                     :key="item.name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList()">搜索</el-button>
        <el-button type="info" @click="resetForm()" >重置</el-button>
        <el-button type="info" @click="excelDown()" >导出</el-button>
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
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        type="index"
        header-align="center"
        align="center"
        width="80"
        label="序号">
      </el-table-column>
      <el-table-column
        prop="realName"
        header-align="center"
        align="center"
        label="销售姓名">
      </el-table-column>
      <el-table-column
        prop="phone"
        header-align="center"
        align="center"
        label="手机号">
      </el-table-column>
      <el-table-column
        prop="cityCenterIdName"
        header-align="center"
        align="center"
        width="120px"
        label="所属城市运营中心 ">
      </el-table-column>
      <el-table-column
        prop="card1"
        header-align="center"
        align="center"
        width="120px"
        label="个人版">
      </el-table-column>
      <el-table-column
        prop="card2"
        header-align="center"
        align="center"
        width="120px"
        label="企业版">
      </el-table-column>
      <el-table-column
        prop="card3"
        header-align="center"
        align="center"
        width="120px"
        label="集团版">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="200"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" v-if="isAuth('biz:trpolicyoriginal:update')"  @click="openDialog(2,'产品直销分成设置',scope.row.uuid),cardForm.saleName=scope.row.realName">修改分成</el-button>
          <el-button type="text" size="small" v-if="isAuth('biz:trpolicyoriginal:info')" @click="openDialog(3,'分成修改记录',scope.row.uuid),recordForm=scope.row">查看记录</el-button>
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
    <el-dialog class="bigDialog" :title="dialogTitle" :visible.sync="dialogFormVisible">
      <div v-show="dialogType==1">
        <div class="city-view-box">
          <div class="inline-block fc-list" v-for="item in 3">
            <span>A卡产品:</span>
            <el-input v-model="dataForm.fh" class="small-input"></el-input>
          </div>
        </div>
        <div class="city-view-title">选中机构共计: 5</div>
        <el-table
          :data="dataList"
          border
          v-loading="dataListLoading"
          style="width: 100%;">
          <el-table-column
            prop="id"
            header-align="center"
            align="center"
            width="80"
            label="序号">
          </el-table-column>
          <el-table-column
            prop="id"
            header-align="center"
            align="center"
            width="80"
            label="销售名称">
          </el-table-column>
          <el-table-column
            prop="title"
            header-align="center"
            align="center"
            label="ID">
          </el-table-column>
          <el-table-column
            prop="fileNum"
            header-align="center"
            align="center"
            label="所属城市中心">
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="dialogType==2">
        <div>
          <div class="fc-list">
            <span>销售名称:</span>
            <el-input disabled v-model="cardForm.saleName" class="small-input"></el-input>
          </div>
          <div class="fc-list" v-for="item in cardForm.cardList">
            <span>{{item.cardName}}:</span>
            <el-input disabled v-model="item.price" class="small-input"></el-input>
            <el-button type="primary" @click="eidtShare(item)">修改</el-button>
          </div>
        </div>
      </div>
      <div v-show="dialogType==3">
        <div>
          <div class="fc-list">
            <span class="record-name">销售名称:</span>
            <el-input class="record-input" v-model="recordForm.realName" disabled></el-input>
          </div>
          <div class="fc-list">
            <span class="record-name">个人版:</span>
            <el-input class="record-input" v-model="recordForm.card1" disabled></el-input>
          </div>
          <div class="fc-list">
            <span class="record-name">企业版:</span>
            <el-input class="record-input" v-model="recordForm.card2" disabled></el-input>
          </div>
          <div class="fc-list">
            <span class="record-name">集团版:</span>
            <el-input class="record-input" v-model="recordForm.card3" disabled></el-input>
          </div>
        </div>
        <div class="city-view-title">修改记录</div>
        <el-table
          :data="recordList"
          border
          v-loading="dataListLoading"
          style="width: 100%;">
          <el-table-column
            type="index"
            header-align="center"
            align="center"
            width="80"
            label="序号">
          </el-table-column>
          <el-table-column
            prop="versionType"
            header-align="center"
            align="center"
            width="80"
            label="卡种">
            <template slot-scope="scope">
              {{scope.row.versionType=='1'?'个人版':scope.row.versionType=='2'?'企业版':scope.row.versionType=='3'?'集团版':scope.row.versionType=='4'?'单专题':scope.row.versionType=='5'?'全部专题':'无版本'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="price"
            header-align="center"
            align="center"
            label="金额">
          </el-table-column>
          <el-table-column
            prop="type"
            header-align="center"
            align="center"
            label="属性">
            <template slot-scope="scope">
              {{scope.row.type=='1'?'修改':'新增'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="remarks"
            header-align="center"
            align="center"
            label="说明">
          </el-table-column>
          <el-table-column
            prop="createTime"
            header-align="center"
            align="center"
            label="修改时间">
          </el-table-column>
          <el-table-column
            prop="createrName"
            header-align="center"
            align="center"
            label="操作人">
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关闭</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="分成设置" :visible.sync="editShareVisible">
      <div class="city-view-title">销售名称：{{editShareTitle}}</div>
      <div class="inline-block fc-list">
        <span>{{cardForm.cardName}}</span>
        <el-input v-model="cardForm.price" class="small-input"></el-input>
      </div>
      <div>
        <span>修改原因:</span>
        <el-input type="textarea" v-model="cardForm.remarks"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editShareVisible = false">关闭</el-button>
        <el-button type="primary" @click="subEdit()">确 定</el-button>
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
          realName:'',
          pid:'',
        },
        cardForm:{
          saleName:'',
          cardList:[],
          accountId:'',
          cardId:'',
          cardName:'',
          price:'',
          remarks:'',
          type:2
        },
        recordForm:{},
        recordList:[],
        batchVisible:false,
        checkList: ['复选框 A'],
        dialogFormVisible:false,
        dialogTitle:'',
        dialogType:1,
        editShareVisible:false,
        editShareTitle:'',
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
      })
    },
    methods: {
      //导出
      excelDown(){
        this.$http({
          url: this.$http.adornUrl('/biz/cardaccount/export/userList'),
          method: 'get',
          responseType: "blob",
          params: this.$http.adornParams({
            'pageNum': String(this.pageIndex),
            'pageSize': String(this.pageSize),
            'realName':this.dataForm.realName,
            'pid':this.dataForm.pid
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
      //分成修改弹窗
      eidtShare(item){
        this.editShareVisible=true;
        this.cardForm.cardId=item.cardId;
        this.cardForm.cardName=item.cardName;
        this.cardForm.price=item.price;
        this.cardForm.remarks='';
      },
      //提交分成修改
      subEdit(){
        this.$http({
          url: this.$http.adornUrl(`/biz/cardaccount/update`),
          method: 'post',
          data: this.$http.adornData({
            'accountId': this.cardForm.accountId || undefined,
            'cardId': this.cardForm.cardId,
            'cardName': this.cardForm.cardName,
            'price': this.cardForm.price,
            'remarks': this.cardForm.remarks,
            'type': this.cardForm.type,
          })
        }).then(({data}) => {
          if (data && data.code == 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.editShareVisible = false;
                this.dialogFormVisible=false;
                this.getDataList();
              }
            })

          } else {
            this.$message.error(data.msg)
          }
        })
      },
      //打开弹窗
      openDialog(type,title,id){
        this.dialogFormVisible=true;
        this.dialogType=type;
        this.dialogTitle=title;
        if(type==1){
          this.batchVisible=false;
        }else if(type==2){
          this.cardForm.accountId=id;
          this.$http({
            url: this.$http.adornUrl('/biz/cardaccount/info/'+id),
            method: 'GET',
          }).then(({data}) => {
            this.cardForm.cardList = data.data
          })
        }else if(type==3){
          this.$http({
            url: this.$http.adornUrl('/biz/cardaccount/updateInfo/'+id),
            method: 'GET',
          }).then(({data}) => {
            this.recordList = data.data
          })
        }
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      //重置搜索条件
      resetForm(){
        this.dataForm={
          realName:'',
          pid:'',
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
        this.$confirm(`您确定要删除${policyId.length > 1 ? '[id=' + policyId.join(',') + ']':'该'}政策原文吗？`, ``, {
          confirmButtonText: `确定`,
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/biz/trpolicyoriginal/delete'),
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
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/biz/cardaccount/userList'),
          method: 'get',
          params: this.$http.adornParams({
            'pageNum': String(this.pageIndex),
            'pageSize': String(this.pageSize),
            'realName':this.dataForm.realName,
            'pid':this.dataForm.pid
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
  .city-view-title{
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .city-view-box{
    border:1px solid #ccc;
    border-radius: 4px;
    padding:20px;
    margin-bottom:30px;
    position: relative
  }
  .small-input{
    width: 200px;
  }
  .inline-block{
    display: inline-block;
  }
  .fc-list{
    margin-bottom: 10px;
    margin-right: 10px;
  }
  /*.bigDialog .el-dialog{*/
    /*width: 80%;*/
  /*}*/
  .record-input{
    width: 80%;
  }
  .record-name{
    display: inline-block;
    text-align: right;
    width: 10%;
  }
</style>
