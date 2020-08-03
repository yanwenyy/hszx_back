<template>
  <div class="mod-policy">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-button type="warning" v-if="isAuth('biz:trpolicyoriginal:save')" @click="$router.push({ name: 'policy-original-add-or-update'})">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.id" placeholder="ID" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.title" placeholder="标题" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.fileNum" placeholder="文件号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.office" placeholder="发文机关" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.taxs"
          clearable
          placeholder="税种" style="width: 150px">
          <el-option v-for="item in taxList"
                     :label="item.taxName"
                     :value="item.taxId"
                     :key="item.taxId">
          </el-option>
        </el-select>
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
          v-model="dataForm.tags"
          clearable
          placeholder="标签" style="width: 150px">
          <el-option v-for="item in tagList"
                     :label="item.tagName"
                     :value="item.tagId"
                     :key="item.tagId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.status"
          clearable
          placeholder="政策状态" style="width: 150px">
          <el-option v-for="item in statusList"
                     :label="item.label"
                     :value="item.value"
                     :key="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <distpicker hide-area ref="child" @province="onChangeProvince" @city="onChangeCity" :province="dataForm.province" :placeholders="{ province: '全国', city: '市', }" :city="dataForm.region" ></distpicker>
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
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @sort-change='sortChange'
      :header-cell-style="{background: 'rgb(21, 161, 147)',color:'#fff'}"
      style="width: 100%;">

      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        width="80"
        label="ID">
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
        prop="office"
        header-align="center"
        align="center"
        width="120px"
        label="发文机关">
      </el-table-column>
      <el-table-column
          prop="officialReleaseDate"
          header-align="center"
          align="center"
          width="120px"
          sortable="custom"
          :formatter="commonDate.formatDate"
          label="官方发布日期">
      </el-table-column>
      <el-table-column
        prop="taxsName"
        header-align="center"
        align="center"
        label="税种">
      </el-table-column>
      <el-table-column
        prop="province"
        header-align="center"
        align="center"
        label="政策地区省">
      </el-table-column>
      <el-table-column
        prop="region"
        header-align="center"
        align="center"
        label="政策地区市">
      </el-table-column>
      <el-table-column
        prop="timelinessidName"
        header-align="center"
        align="center"
        label="时效性">
      </el-table-column>
      <el-table-column
        prop="tagsName"
        header-align="center"
        align="center"
        label="标签">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        width="120px"
        sortable="custom"
        :formatter="commonDate.formatTime"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="政策状态">
        <template slot-scope="scope">
          <el-button type="text" v-if="scope.row.status==0" @click="updateShowFlag(scope.row.id,0)">隐藏</el-button>
          <el-button type="text" v-if="scope.row.status==1" @click="updateShowFlag(scope.row.id,1)">在线</el-button>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="200"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" v-if="isAuth('biz:trpolicyoriginal:update')"  @click="$router.push({ name: 'policy-original-add-or-update',query:{id:scope.row.id} })">编辑</el-button>
          <el-button type="text" size="small" v-if="isAuth('biz:trpolicyoriginal:info')" @click="$router.push({ name: 'policy-original-tr-view',query:{id:scope.row.id} })">查看</el-button>
          <el-button type="text" size="small" v-if="isAuth('biz:trpolicyoriginal:delete')" @click="deleteHandle(scope.row.id)">删除</el-button>
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
        myHeaders: {
          token: this.$cookie.get('token')
        },
        dataForm: {
          id:'',
          title:'',
          fileNum:'',
          timelinessid:'',
          taxs:'',
          tags:'',
          office:'',
          province:'',
          region:'',
          status:'',
          releaseTime:'',
          createTime:''
        },
        url:this.$http.adornUrl(`/biz/trpolicyoriginal/importExcel`),
        propertyList:[{label:'行业政策',value:1},{label:'普适政策',value:2}],
        tagList:[],
        tradeList:[],
        taxList:[],
        timelinessList:[],
        statusList:[{label:'在线',value:'1'},{label:'隐藏',value:'0'}],
        examineList:[{label:'待审核',value:1},{label:'审核中',value:2},{label:'审核通过',value:4},{label:'审核未通过',value:3}],
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
      //税种
      this.$http({
        url: this.$http.adornUrl('/biz/trtax/trTaxList'),
        method: 'GET',
        params: this.$http.adornParams({'type':1})
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
        params: this.$http.adornParams({'type':1})
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
        params: this.$http.adornParams({'type':1})
      }).then(({data}) => {
        var dataList=[]
        for( var i=0;i<data.data.length;i++){
          dataList.push(data.data[i]);
        }
        this.tagList = dataList
      })
    },
    methods: {
      //重置搜索条件
      resetForm(){
        this.dataForm={
          id:'',
          title:'',
          fileNum:'',
          timelinessid:'',
          tags:'',
          taxs:'',
          province:'',
          region:'',
          status:'',
          releaseTime:'',
          createTime:''
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
      //政策地区
      onChangeProvince(e) {
        console.log(e)
        this.dataForm.province=e.province.value
      },
      onChangeCity (e) {
        this.dataForm.region=e.city.value
      },
      updateShowFlag (id,txt) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        var ajaxUrl=''
        var ajaxtxt=''
        if(txt==1){
          //在线--》隐藏
          ajaxUrl='/biz/trpolicyoriginal/changeToHide/';
          ajaxtxt='您确定进行隐藏操作吗？'
        }else{
          ajaxUrl='/biz/trpolicyoriginal/changeToShow/';
          ajaxtxt='您确定进行在线操作吗？'
        }
        this.$confirm(`${ajaxtxt}`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          this.$http({
            url: this.$http.adornUrl(`${ajaxUrl}${id}`),
            method: 'get',
           /* params:this.$http.adornParams({'id':id})*/
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
        }).catch(() => {})
      },
      // 删除
      deleteHandle (id,status) {
        this.$confirm(`您确定要删除该政策原文吗？`, ``, {
          confirmButtonText: `确定`,
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/biz/trpolicyoriginal/delete'),
            method: 'post',
            data: this.$http.adornData([id],false)
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
          url: this.$http.adornUrl('/biz/trpolicyoriginal/downExcel'),
          method: 'get',
          responseType: "blob",
          params: this.$http.adornParams({
            'id':this.dataForm.id|| undefined,
            'tags':this.dataForm.tags|| undefined,
            'title':this.dataForm.title|| undefined,
            'fileNum':this.dataForm.fileNum|| undefined,
            'office':this.dataForm.office|| undefined,
            'timelinessid':this.dataForm.timelinessid|| undefined,
            'taxs':this.dataForm.taxs|| undefined,
            'province':this.dataForm.province|| undefined,
            'region':this.dataForm.region|| undefined,
            'status':this.dataForm.status|| undefined,
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
          this.$message.error("无匹配政策原文数据");
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
            message: '<div style="max-height: 320px;overflow-y: auto;">'+response.msg+'</div>'
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
          url: this.$http.adornUrl('/biz/trpolicyoriginal/list'),
          method: 'get',
          params: this.$http.adornParams({
            'pageNum': String(this.pageIndex),
            'pageSize': String(this.pageSize),
            'id':this.dataForm.id|| undefined,
            'tags':this.dataForm.tags|| undefined,
            'title':this.dataForm.title|| undefined,
            'fileNum':this.dataForm.fileNum|| undefined,
            'office':this.dataForm.office|| undefined,
            'timelinessid':this.dataForm.timelinessid|| undefined,
            'taxs':this.dataForm.taxs|| undefined,
            'province':this.dataForm.province|| undefined,
            'region':this.dataForm.region|| undefined,
            'status':this.dataForm.status|| undefined,
            'releaseStartTime':releaseStartTime || undefined,
            'releaseLastTime':releaseLastTime || undefined,
            'createTimeStart':createTimeStart || undefined,
            'createTimeEnd':createTimeEnd || undefined,
            'sid':this.prop ,
            'order':this.order
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
