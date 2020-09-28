<template>
  <div class="mod-policy">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-button type="warning" v-if="isAuth('biz:trpolicyoriginal:save')" @click="$router.push({ name: 'policy-original-add-or-update'})">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.moudle"
          clearable
          placeholder="模块名称" style="width: 150px">
          <el-option v-for="item in moudelList"
                     :label="item.label"
                     :value="item.value"
                     :key="item.value" >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input :disabled="dataForm.moudle==''" v-model="dataForm.moudleId" placeholder="评论主体id" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="dataForm.level"
          clearable
          placeholder="属性" style="width: 150px">
          <el-option v-for="item in attributeList"
                     :label="item.label"
                     :value="item.value"
                     :key="item.value" >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.content" placeholder="评论内容" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.trPolicyTtle" placeholder="关联政策标题" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.trPolicyFileNum" placeholder="关联政策文件号" clearable></el-input>
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
        <el-button type="primary" @click="getDataList()">搜索</el-button>
        <el-button type="info" @click="resetForm()" >重置</el-button>
        <el-button type="danger" v-if="isAuth('biz:trpolicyoriginal:delete')" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
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
        prop="moudle"
        header-align="center"
        align="center"
        width="80"
        label="模块">
        <template slot-scope="scope">
          <span>{{getMoudel(scope.row.moudle)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="moudleId"
        header-align="center"
        align="center"
        label="评论主体ID">
      </el-table-column>
      <el-table-column
        prop="content"
        header-align="center"
        align="center"
        width="120px"
        label="评论内容">
      </el-table-column>
      <el-table-column
        prop="levelName"
        header-align="center"
        align="center"
        label="属性">
        <template slot-scope="scope">
          <span>{{scope.row.levelName==1?'评论':'回复'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="userName"
        header-align="center"
        align="center"
        label="评论人">
      </el-table-column>
      <el-table-column
        prop="phone"
        header-align="center"
        align="center"
        label="评论人手机号">
      </el-table-column>
      <el-table-column
        prop="careadateFormat"
        header-align="center"
        align="center"
        width="120px"
        :formatter="commonDate.formatTime"
        label="创建时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="200"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" v-if="isAuth('biz:trpolicyoriginal:info')" @click="$router.push({ name: 'discuss-view',query:{id:scope.row.id} })">查看</el-button>
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
  export default {
    data () {
      return {
        myHeaders: {
          token: this.$cookie.get('token')
        },
        dataForm: {
          moudle:'',
          level:'',
          moudleId:'',
          content:'',
          trPolicyTtle:'',
          trPolicyFileNum:'',
          createTime:'',
        },
        moudelList:[
          {
            value:'1',
            label:'政策归集'
          },{
            value:'2',
            label:'相关解读'
          },{
            value:'3',
            label:'风险提示'
          },{
            value:'4',
            label:'税收筹划'
          },{
            value:'5',
            label:'解码图'
          },{
            value:'6',
            label:'新闻中心'
          },{
            value:'7',
            label:'精选好课'
          },{
            value:'8',
            label:'直播答疑'
          },{
            value:'9',
            label:'评论'
          }
        ],
        tradeList:[],
        attributeList:[{
            value: '1',
            label: '评论'
          },{
            value: '2',
            label: '回复'
          },
        ],
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
      }
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      //重置搜索条件
      resetForm(){
        this.dataForm={
          moudle:'',
          tradeid:'',
          level:'',
          moudleId:'',
          content:'',
          trPolicyTtle:'',
          trPolicyFileNum:'',
          createTime:'',
        };
        this.$refs.child.reset()
      },
      // 删除
      deleteHandle (id,status) {
        var policyId = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        });
        this.$confirm(`您确定要删除${policyId.length > 1 ? '[id=' + policyId.join(',') + ']':'该'}评论吗？`, ``, {
          confirmButtonText: `确定`,
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/biz/trdiscuss/delete'),
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
        var createTimeStart='',createTimeEnd='';
        if(this.dataForm.createTime!=undefined&&this.dataForm.createTime!=""&&this.dataForm.createTime!=null&&this.dataForm.createTime.length!=0){
          createTimeStart=this.dataForm.createTime[0]
          createTimeEnd=this.dataForm.createTime[1]
        }
        this.dataListLoading = true;
        this.$http({
          url: this.$http.adornUrl('/biz/trdiscuss/list'),
          method: 'get',
          params: this.$http.adornParams({
            'pageNum': String(this.pageIndex),
            'pageSize': String(this.pageSize),
            'moudle':this.dataForm.moudle|| undefined,
            'level':this.dataForm.level|| undefined,
            'moudleId':this.dataForm.moudleId|| undefined,
            'content':this.dataForm.content|| undefined,
            'trPolicyTtle':this.dataForm.trPolicyTtle|| undefined,
            'trPolicyFileNum':this.dataForm.trPolicyFileNum|| undefined,
            'createTimeStart':createTimeStart || undefined,
            'createTimeEnd':createTimeEnd || undefined,
          })
        }).then(({data}) => {
          if (data && data.code == 200) {
            this.dataList = data.data.list;
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
      //获取模块名称
      getMoudel:function(val){
        var list=this.moudelList,i=0,len=list.length;
        for(;i<len;i++){
          if(list[i].value==val){
            return list[i].label;
          }
        }
      }
    }
  }
</script>
<style>
  .distpicker-address-wrapper select{height: 36px;line-height: 40px;padding:0.15rem 0.75rem}
</style>
