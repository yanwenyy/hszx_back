<template>
  <div class="mod-policy">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-button type="warning" v-if="isAuth('biz:trpolicy:save')" @click="$router.push({ name: 'policy-imputation-add-or-update'})">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.id" placeholder="ID" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.property"
          clearable
          placeholder="属性" style="width: 150px">
          <el-option v-for="item in propertyList"
                     :label="item.label"
                     :value="item.value"
                     :key="item.value" >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.tradeid"
          clearable
          placeholder="全部行业" style="width: 150px">
          <el-option v-for="item in tradeList"
                     :label="item.tradeName"
                     :value="item.tradeId"
                     :key="item.tradeId" >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.policyOriginalId" placeholder="原文ID" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.title" placeholder="标题" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.fileNum" placeholder="文件号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.tax"
          clearable
          placeholder="全部税种" style="width: 150px">
          <el-option v-for="item in taxList"
                     :label="item.taxName"
                     :value="item.taxId"
                     :key="item.taxId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="官方发布时间">
        <el-date-picker
          v-model="dataForm.releaseTime"
          type="daterange"
          range-separator="一"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="创建时间">
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
        <el-select
          v-model="dataForm.timelinessid"
          clearable
          placeholder="时效性" style="width: 150px">
          <el-option v-for="item in timelinessList"
                     :label="item.name"
                     :value="item.id"
                     :key="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.tag"
          clearable
          placeholder="标签" style="width: 150px">
          <el-option v-for="item in tagList"
                     :label="item.tagName"
                     :value="item.tagId"
                     :key="item.tagId">
          </el-option>
        </el-select>
      </el-form-item>
      <!--<el-form-item>
        <el-input placeholder="政策省" v-model="dataForm.province" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input placeholder="政策市级" v-model="dataForm.region" clearable></el-input>
      </el-form-item>-->
      <el-form-item>
        <distpicker hide-area @province="onChangeProvince" ref="child" @city="onChangeCity" :province="dataForm.province" :placeholders="{ province: '全国', city: '市', area: '区' }" :city="dataForm.region" ></distpicker>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.policyStatus"
          clearable
          placeholder="政策状态" style="width: 150px">
          <el-option v-for="item in policyList"
                     :label="item.label"
                     :value="item.value"
                     :key="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.auditStatus"
          clearable
          placeholder="审核状态" style="width: 150px">
          <el-option v-for="item in examineList"
                     :label="item.label"
                     :value="item.value"
                     :key="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
          <el-upload
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            :action="url"
            :on-success="successHandle"
            :headers="myHeaders"
            :show-file-list="false"
            :on-progress="openFullScreen"
            :file-list="fileListUpload"
            style="display:inline-block;text-align: center;">
            <el-button type="primary">导入</el-button>
          </el-upload>
        <el-button type="primary" @click="excelDown()">导出</el-button>
        <el-button type="primary" @click="getDataList()">搜索</el-button>
        <el-button type="info" @click="resetForm()" >重置</el-button>
        <el-button type="danger" v-if="isAuth('biz:trpolicy:delete')" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
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
        prop="id"
        header-align="center"
        align="center"
        width="80"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="property"
        header-align="center"
        align="center"
        label="属性">
        <template slot-scope="scope">
          <span>{{scope.row.property==1?'行业政策':'普适政策'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="tradeidName"
        header-align="center"
        align="center"
        label="行业">
      </el-table-column>
      <el-table-column
        prop="policyOriginalId"
        header-align="center"
        align="center"
        label="原文ID">
      </el-table-column>
      <el-table-column
        prop="title"
        header-align="center"
        align="center"
        label="标题">
      </el-table-column>
      <el-table-column
        prop="fileNum"
        header-align="center"
        align="center"
        label="文件号">
      </el-table-column>
      <el-table-column
          prop="officialReleaseDate"
          header-align="center"
          align="center"
          width="120px"
          :formatter="commonDate.formatDate"
          label="官方发布日期">
      </el-table-column>
      <el-table-column
        prop="taxName"
        header-align="center"
        align="center"
        label="税种">
      </el-table-column>
      <el-table-column
        prop="province"
        header-align="center"
        align="center"
        label="政策省">
      </el-table-column>
      <el-table-column
        prop="region"
        header-align="center"
        align="center"
        label="政策市">
      </el-table-column>
      <el-table-column
        prop="timelinessidName"
        header-align="center"
        align="center"
        label="时效性">
      </el-table-column>
      <el-table-column
        prop="tagName"
        header-align="center"
        align="center"
        label="标签">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        width="120px"
        :formatter="commonDate.formatTime"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="policyStatusName"
        header-align="center"
        align="center"
        label="政策状态">
      </el-table-column>
      <el-table-column
        prop="auditStatusName"
        header-align="center"
        align="center"
        label="审核状态">
        <template slot-scope="scope">
          <span>{{scope.row.auditStatusName}}</span>
          <i  class="el-icon-search" v-if="isAuth('biz:trpolicy:auditRecord')" @click="$router.push({ name: 'policy-imputation-examine-record',query:{id:scope.row.id} })"></i>
        </template>
      </el-table-column>
      <el-table-column
        width="150"
        header-align="center"
        align="center"
        label="审核操作">
        <template slot-scope="scope">
          <div>
            <el-button style="color:#1e88e5" type="text" size="mini" v-if="isAuth('biz:trpolicy:onlineApply')" @click="online(scope.row.id)" v-show="scope.row.policyStatus==0&&scope.row.passAndE!=1&&scope.row.auditStatus!=2">申请上线</el-button>
            <el-button style="color:orange" type="text" size="mini" v-if="isAuth('biz:trpolicy:updateApply')" v-show="scope.row.passAndE==1&&scope.row.auditStatus!=2" @click="update(scope.row.id)">申请更新</el-button>
            <el-button type="text" style="color:#000" size="mini" v-show="scope.row.policyStatus==1&&scope.row.auditStatus!=2" v-if="isAuth('biz:trpolicy:offlineApply')" @click="offline(scope.row.id)">申请下线</el-button>
          </div>
          <div>
            <el-button style="color:#67c23a" type="text" size="mini" @click="$router.push({ name: 'policy-imputation-examine-online',query:{id:scope.row.id} })" v-if="isAuth('biz:trpolicy:onlineAudit')" v-show="scope.row.policyStatus==0&&scope.row.auditStatus==2">上线审核</el-button>
            <el-button style="color:red" type="text" size="mini" @click="$router.push({ name: 'policy-imputation-examine-update',query:{id:scope.row.id} })" v-if="isAuth('biz:trpolicy:updateAudit')" v-show="scope.row.policyStatus==1&&scope.row.auditStatus==2&&scope.row.auditOperate==2">更新审核</el-button>
            <el-button type="text" size="mini" v-if="isAuth('biz:trpolicy:offlineAudit')" v-show="scope.row.policyStatus==1&&scope.row.auditStatus==2&&scope.row.auditOperate==3" @click="$router.push({ name: 'policy-imputation-examine-offline',query:{id:scope.row.id} })">下线审核</el-button>
          </div>
        </template>
      </el-table-column>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="200"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" v-if="isAuth('biz:operatelog:list')" @click="$router.push({ name: 'policy-imputation-record',query:{id:scope.row.id} })">操作记录</el-button>
          <el-button type="text" size="small" v-show="scope.row.auditStatus!=2" @click="$router.push({ name: 'policy-imputation-add-or-update',query:{id:scope.row.id} })">编辑</el-button>
          <el-button type="text" size="small" v-show="scope.row.auditStatus==2" @click="editHandle()">编辑</el-button>
          <el-button type="text" size="small" v-if="isAuth('biz:trpolicy:info')" @click="$router.push({ name: 'policy-imputation-view',query:{id:scope.row.id} })">查看</el-button>
          <el-button type="text" size="small" v-if="isAuth('biz:trpolicy:delete')" @click="deleteHandle(scope.row.id,scope.row.policyStatus)">删除</el-button>
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
  import distpicker from '@/components/distpicker/Distpicker.vue'
  export default {
    components: {distpicker},
    data () {
      return {
        dataForm: {
          id:'',
          title:'',
          fileNum:'',
          policyOriginalId:'',
          tradeid:'',
          timelinessid:'',
          tax:'',
          tag:'',
          property:'',
          province:'',
          region:'',
          auditStatus:'',
          policyStatus:'',
          releaseTime:'',
          createTime:''
        },
        myHeaders: {
          token: this.$cookie.get('token')
        },
        url:this.$http.adornUrl(`/biz/trpolicy/importExcel`),
        propertyList:[{label:'行业政策',value:1},{label:'普适政策',value:2}],
        tagList:[],
        tradeList:[],
        taxList:[],
        timelinessList:[],
        policyList:[{label:'在线',value:'1'},{label:'隐藏',value:'0'}],
        examineList:[{label:'待审核',value:1},{label:'审核中',value:2},{label:'审核通过',value:4},{label:'审核未通过',value:3}],
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        fileListUpload:[],
      }
    },
    activated () {
      this.getDataList()
    },
    mounted(){
      //行业
      this.$http({
        url: this.$http.adornUrl('/biz/trade2/trade2PolicyList'),
        method: 'get',
        params: this.$http.adornData()
      }).then(({data}) => {
        var dataList=[]
        for( var i=0;i<data.data.length;i++){
          dataList.push(data.data[i]);
        }
        this.tradeList = dataList
      });
      //税种
      this.$http({
        url: this.$http.adornUrl('/biz/trtax/trTaxList'),
        method: 'GET',
        params: this.$http.adornParams({'type':2})
      }).then(({data}) => {
        var dataList=[]
        for( var i=0;i<data.data.length;i++){
          dataList.push(data.data[i]);
        }
        this.taxList = dataList
      })
      //时效性
      this.$http({
        url: this.$http.adornUrl('/biz/timeliness/timelinessList'),
        method: 'GET',
        params: this.$http.adornParams({'type':2})
      }).then(({data}) => {
        var dataList=[]
        for( var i=0;i<data.data.length;i++){
          dataList.push(data.data[i]);
        }
        this.timelinessList = dataList
      })
      //标签
      this.$http({
        url: this.$http.adornUrl('/biz/trtag/trTagList'),
        method: 'GET',
        params: this.$http.adornParams({'type':2})
      }).then(({data}) => {
        var dataList=[]
        for( var i=0;i<data.data.length;i++){
          dataList.push(data.data[i]);
        }
        this.tagList = dataList
      })
    },
    methods: {
      //导出
      excelDown(){
        var releaseStartTime='',releaseLastTime='',createTimeStart='',createTimeEnd=''
        if(this.dataForm.releaseTime!=undefined&&this.dataForm.releaseTime!=""&&this.dataForm.releaseTime!=null&&this.dataForm.releaseTime.length!=0){
          releaseStartTime=this.dataForm.releaseTime[0]
          releaseLastTime=this.dataForm.releaseTime[1]
        }
        if(this.dataForm.createTime!=undefined&&this.dataForm.createTime!=""&&this.dataForm.createTime!=null&&this.dataForm.createTime.length!=0){
          createTimeStart=this.dataForm.createTime[0]
          createTimeEnd=this.dataForm.createTime[1]
        }
        this.$http({
          url: this.$http.adornUrl('/biz/trpolicy/downExcel'),
          method: 'get',
          responseType: "blob",
          params: this.$http.adornParams({
            'id':this.dataForm.id|| undefined,
            'policyOriginalId':this.dataForm.policyOriginalId|| undefined,
            'tag':this.dataForm.tag|| undefined,
            'property':this.dataForm.property|| undefined,
            'title':this.dataForm.title|| undefined,
            'fileNum':this.dataForm.fileNum|| undefined,
            'tradeid':this.dataForm.tradeid|| undefined,
            'timelinessid':this.dataForm.timelinessid|| undefined,
            'tax':this.dataForm.tax|| undefined,
            'province':this.dataForm.province|| undefined,
            'region':this.dataForm.region|| undefined,
            'auditStatus':this.dataForm.auditStatus|| undefined,
            'policyStatus':this.dataForm.policyStatus|| undefined,
            'releaseStartTime':releaseStartTime || undefined,
            'releaseLastTime':releaseLastTime || undefined,
            'createTimeStart':createTimeStart || undefined,
            'createTimeEnd':createTimeEnd || undefined
          })
        }).then(res => {
          let content = res.data;
          let blob = new Blob([content]);
          let fileName = res.headers
          fileName = fileName["content-disposition"]
          fileName = fileName.split(";")[1].split("filename=")[1];
          if ("download" in document.createElement("a")) {
            // 非IE下载
            let elink = document.createElement("a");
            elink.download = decodeURI(fileName);  ;
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
          this.$message.error("无匹配政策数据");
        });
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      //重置搜索条件
      resetForm(){

        this.dataForm={
          id:'',
          title:'',
          fileNum:'',
          tradeid:'',
          timelinessid:'',
          policyOriginalId:'',
          tag:'',
          property:'',
          tsx:'',
          province:'',
          region:'',
          auditStatus:'',
          policyStatus:'',
          releaseTime:'',
          createTime:''
        }
        this.$refs.child.reset()
      },
      //政策地区
      onChangeProvince(e) {
        this.dataForm.province=e.province.value
      },
      onChangeCity (e) {
        this.dataForm.region=e.city.value
      },
      confirmFn(title,content,confirmButtonText,ajaxUrl,ids){
        if(confirmButtonText==""){
          confirmButtonText='确定'
        }
        this.$confirm(`${content}`, `${title}`, {
          confirmButtonText: `${confirmButtonText}`,
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl(ajaxUrl+ids),
            method: 'get',
            params: this.$http.adornParams()
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
      //不可编辑
      editHandle(){
        this.$alert('该政策当前正在审核当中，不可编辑', '', {confirmButtonText: '我知道了'});
      },
      // 删除
      deleteHandle (id,status) {
        var policyId = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        });
        console.log(policyId)
        if(status==1){
          this.$alert('该政策为“在线”状态，不可删除，您可以申请下线后重新操作！', '提示', {confirmButtonText: '我知道了'});
          return false
        }
        this.$confirm(`您确定要删除${policyId.length > 1 ? '[id=' + policyId.join(',') + ']':'该'}政策吗？`, ``, {
          confirmButtonText: `确定`,
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/biz/trpolicy/delete'),
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
      // 申请上线
      online (id) {

        this.confirmFn('您确定要申请上线吗？','提交后，1-2个工作日为您审核，审核中将不能修改该政策。','提交申请','/biz/trpolicy/onlineApply/',id)
      },
      //申请更新
      update (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.confirmFn('您确定要申请更新吗？','提交后，1-2个工作日为您审核，审核中将不能修改该政策。','提交申请','/biz/trpolicy/updateApply/',id)
      },
      //申请下线
      offline (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })

        this.$prompt('请输入下线原因，最少5个字最多输入100字', '申请下线', {
          inputType:'textarea',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValidator:(val) => {
            return !(val.length < 5 || val.length > 100)
          },
          inputErrorMessage: '！保存失败，您未达到最少字数或超过最大字数'
        }).then(({ value }) => {
          this.$http({
            url: this.$http.adornUrl('/biz/trpolicy/offlineApply'),
            method: 'GET',
            params: this.$http.adornParams({'id':id,'offlineApplyReason':value})
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
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
      openFullScreen(event, file, fileList) {
        const loading = this.$loading({
          lock: true,
          text: '正在导入...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      },
      successHandle (response, file, fileList) {
        this.fileList = []
        const loading = this.$loading({
          lock: true,
          text: '正在导入...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        if (response && response.code == 200) {
          this.$message.success('导入成功')
          loading.close();
          this.getDataList ()
        } else {
          loading.close();
          this.$message({
            dangerouslyUseHTMLString: true,
            type:'error',
            showClose: true,
            duration:0,
            message:'<div style="max-height: 320px;overflow-y: auto;">'+response.msg+'</div>'
          });
        }
      },
      // 获取数据列表
      getDataList () {
        var releaseStartTime='',releaseLastTime='',createTimeStart='',createTimeEnd=''
        if(this.dataForm.releaseTime!=undefined&&this.dataForm.releaseTime!=""&&this.dataForm.releaseTime!=null&&this.dataForm.releaseTime.length!=0){
          releaseStartTime=this.dataForm.releaseTime[0]
          releaseLastTime=this.dataForm.releaseTime[1]
        }
        if(this.dataForm.createTime!=undefined&&this.dataForm.createTime!=""&&this.dataForm.createTime!=null&&this.dataForm.createTime.length!=0){
          createTimeStart=this.dataForm.createTime[0]
          createTimeEnd=this.dataForm.createTime[1]
        }
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/biz/trpolicy/list'),
          method: 'get',
          params: this.$http.adornParams({
            'pageNum': String(this.pageIndex),
            'pageSize': String(this.pageSize),
            'id':this.dataForm.id|| undefined,
            'policyOriginalId':this.dataForm.policyOriginalId|| undefined,
            'tag':this.dataForm.tag|| undefined,
            'property':this.dataForm.property|| undefined,
            'title':this.dataForm.title|| undefined,
            'fileNum':this.dataForm.fileNum|| undefined,
            'tradeid':this.dataForm.tradeid|| undefined,
            'timelinessid':this.dataForm.timelinessid|| undefined,
            'tax':this.dataForm.tax|| undefined,
            'province':this.dataForm.province|| undefined,
            'region':this.dataForm.region|| undefined,
            'auditStatus':this.dataForm.auditStatus|| undefined,
            'policyStatus':this.dataForm.policyStatus|| undefined,
            'releaseStartTime':releaseStartTime || undefined,
            'releaseLastTime':releaseLastTime || undefined,
            'createTimeStart':createTimeStart || undefined,
            'createTimeEnd':createTimeEnd || undefined
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
  .distpicker-address-wrapper select{height: 36px;line-height: 40px;padding:0.15rem 0.75rem}
</style>
