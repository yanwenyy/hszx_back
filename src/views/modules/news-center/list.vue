<template>
  <div class="mod-policy">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-button type="warning" v-if="isAuth('biz:trnewscenter:save')" @click="$router.push({ name: 'news-center-add-or-update'})">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.id" placeholder="ID" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.title" placeholder="标题" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.lecturer" placeholder="作者" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.tradeid"
          clearable
          placeholder="行业" style="width: 150px">
          <el-option v-for="item in tradeList"
                     :label="item.tradeName"
                     :value="item.tradeId"
                     :key="item.tradeId" >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.attributeid"
          clearable
          placeholder="属性" style="width: 150px">
          <el-option v-for="item in attributeList"
                     :label="item.name"
                     :value="item.id"
                     :key="item.id" >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.ifShow"
          clearable
          placeholder="状态" style="width: 150px">
          <el-option v-for="item in ifShowList"
                     :label="item.label"
                     :value="item.value"
                     :key="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dataForm.creatTime"
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
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
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
        prop="tradeName"
        header-align="center"
        align="center"
        label="行业">
      </el-table-column>
      <el-table-column
        prop="title"
        header-align="center"
        align="center"
        label="标题">
      </el-table-column>
      <el-table-column
        prop="platformAuthorName"
        header-align="center"
        align="center"
        label="作者">
      </el-table-column>
      <el-table-column
        prop="attributeName"
        header-align="center"
        align="center"
        label="属性">
      </el-table-column>
      <el-table-column
        prop="praiseNum"
        header-align="center"
        align="center"
        label="点赞">
      </el-table-column>
      <el-table-column
        prop="discussNum"
        header-align="center"
        align="center"
        label="评论">
      </el-table-column>
      <el-table-column
        prop="collectNum"
        header-align="center"
        align="center"
        label="收藏">
      </el-table-column>
      <el-table-column
        prop="relayNum"
        header-align="center"
        align="center"
        label="转发">
      </el-table-column>
      <el-table-column
        prop="creatTime"
        header-align="center"
        align="center"
        width="120px"
        :formatter="commonDate.formatTime"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="sort"
        header-align="center"
        align="center"
        width="120"
        label="排序">
        <template slot-scope="scope">
          <el-input type="number" v-model="scope.row.sort" ref="sortDis" :class="'sortDis'+scope.$index" :disabled="scope.row.disabled" style="display:inline-block;width:70px"></el-input>
          <i class="el-icon-edit" v-show='scope.row.disabled' @click="sortShow(scope.$index)"></i>
          <i class="el-icon-check" v-show='!scope.row.disabled'  @click="sortUpdate(scope.$index,scope.row.id,scope.row.sort)"></i>
        </template>
      </el-table-column>
      <el-table-column
        prop="ifShow"
        header-align="center"
        align="center"
        label="状态">
        <template slot-scope="scope">
          <el-button v-show="scope.row.ifShow==0" v-if="isAuth('biz:trnewscenter:toZai')" type="text" size="small" @click="hideToShow(scope.row.id)">隐藏</el-button>
          <el-button v-show="scope.row.ifShow==1" v-if="isAuth('biz:trnewscenter:toCang')" type="text" size="small" @click="showToHide(scope.row.id)">在线</el-button>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="200"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="$router.push({ name: 'news-center-record',query:{id:scope.row.id,title:scope.row.title} })">操作记录</el-button>
          <el-button type="text" size="small" v-if="isAuth('biz:trnewscenter:update')" @click="$router.push({ name: 'news-center-add-or-update',query:{id:scope.row.id} })">编辑</el-button>
          <el-button type="text" size="small" v-if="isAuth('biz:trnewscenter:info')" @click="$router.push({ name: 'news-center-view',query:{id:scope.row.id} })">查看</el-button>
          <el-button type="text" size="small" v-if="isAuth('biz:trnewscenter:delete')" @click="deleteHandle(scope.row.id)">删除</el-button>
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
        sortDis:true,
        dataForm: {
          id:'',
          title:'',
          platformAuthorName:'',
          attributeid:'',
          creatTime:'',
          tradeid:'',
          ifShow:''
        },
        tradeList:[],
        attributeList:[],
        ifShowList:[{label:'隐藏',value:'0'},{label:'在线',value:'1'}],
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
    mounted(){
      //作者
      this.$http({
        url: this.$http.adornUrl('/biz/user/getIdentityList'),
        method: 'get',
        params: this.$http.adornParams({'identity':1})
      }).then(({data}) => {
        var dataList=[]
        for( var i=0;i<data.length;i++){
          dataList.push(data[i]);
        }
        this.userList = dataList
      })
      //行业
      this.$http({
        url: this.$http.adornUrl('/biz/trade2/trade2ModelList'),
        method: 'get',
        params: this.$http.adornData()
      }).then(({data}) => {
        var dataList=[]
        for( var i=0;i<data.data.length;i++){
          dataList.push(data.data[i]);
        }
        this.tradeList = dataList
      })
      //属性
      this.$http({
        url: this.$http.adornUrl('/biz/attribute/attributeList'),
        method: 'get',
        params: this.$http.adornParams({module:3})
      }).then(({data}) => {
        var dataList=[]
        for( var i=0;i<data.data.length;i++){
          dataList.push(data.data[i]);
        }
        this.attributeList = dataList
      })
    },
    methods: {
      sortShow(index){
        this.dataList[index].disabled=false
      },
      sortUpdate(index,id,sort){
        this.$http({
          url: this.$http.adornUrl('/biz/trnewscenter/updateSort'),
          method: 'post',
          data: this.$http.adornData({id:id,sort:sort})
        }).then(({data}) => {
          if (data && data.code == 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.dataList[index].disabled=true
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
      },
      //重置搜索条件
      resetForm(){
        this.dataForm={
          id:'',
          title:'',
          lecturer:'',
          attributeid:'',
          creatTime:'',
          tradeid:'',
          ifShow:''
        }
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
      // 删除
      deleteHandle (id) {
        this.$http({
          url: this.$http.adornUrl('/biz/trnewscenter/delete'),
          method: 'post',
          data: this.$http.adornData(id,false)
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
      },
      // 隐藏按钮--》在线
      hideToShow (id) {
        this.confirmFn('提示','您确定要在线吗？','确定','/biz/trnewscenter/toZai/',id)
      },
      // 在线按钮--》隐藏
      showToHide (id) {
        this.confirmFn('提示','您确定要隐藏吗？','确定','/biz/trnewscenter/toCang/',id)
      },
      // 获取数据列表
      getDataList () {
        var creatTimeStart='',creatTimeEnd=''
        if(this.dataForm.creatTime!=undefined&&this.dataForm.creatTime!=""&&this.dataForm.creatTime.length!=0&&this.dataForm.creatTime!=null){
          creatTimeStart=this.dataForm.creatTime[0]
          creatTimeEnd=this.dataForm.creatTime[1]
        }
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/biz/trnewscenter/list'),
          method: 'get',
          params: this.$http.adornParams({
            'pageNum': String(this.pageIndex),
            'pageSize': String(this.pageSize),
            'id':this.dataForm.id|| undefined,
            'title':this.dataForm.title|| undefined,
            'lecturer':this.dataForm.lecturer|| undefined,
            'tradeid':this.dataForm.tradeid|| undefined,
            'attributeid':this.dataForm.attributeid|| undefined,
            'ifShow':this.dataForm.ifShow|| undefined,
            'createTimeStart':creatTimeStart || undefined,
            'createTimeEnd':creatTimeEnd || undefined
          })
        }).then(({data}) => {
          if (data && data.code == 200) {
           for(var i=0;i<data.data.list.length;i++) {
             data.data.list[i].disabled=true
           }
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
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
  input[type="number"]{
    -moz-appearance: textfield;
    width:60px !important;
    height:20px !important;
    padding:0 !important;
    text-align:center;
  }

</style>
