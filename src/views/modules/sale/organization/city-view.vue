<template>
  <div class="mod-policy">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">查看</h2>
    <el-form label-position="left" label-width="120px" :model="dataForm" :rules="dataRule" ref="dataForm">
      <div class="city-view-group">
        <div class="city-view-title">基础信息</div>
        <div class="city-view-box">
          <el-form-item v-show="dataForm.id" label="ID" prop="id">
            <el-input class="city-input" v-model="dataForm.id" disabled></el-input>
          </el-form-item>
          <el-form-item label="中心名称">
            <el-input class="city-input" v-model="dataForm.name" disabled></el-input>
          </el-form-item>
          <el-form-item label="等级" prop="expertTitle">
            <el-input class="city-input" v-model="dataForm.level==0?'总代':dataForm.level==1?'1级':dataForm.level==2?'2级':dataForm.level==3?'3级':'无'" disabled></el-input>
          </el-form-item>
          <el-form-item v-show="dataForm.id" label="添加时间" prop="expertTitle">
            <el-input class="city-input" v-model="dataForm.createTime" disabled></el-input>
          </el-form-item>
        </div>
      </div>
      <div class="city-view-group">
        <div class="city-view-title">中心占股分红设置</div>
        <div class="city-view-box">
          <el-form-item label="中心占股分红基数*" prop="fh">
            <el-input v-model="dataForm.shareBase" class="small-input" disabled></el-input> %
            <p class="input-msg">填写提示：请填写整数数字，如果无占股可填写0；例如：填写“10”，则在订单进行股东分红扣除计算时，中心分得10%，其余90%流入股东池进行分成</p>
          </el-form-item>
        </div>
      </div>
      <div class="city-view-group">
        <div class="city-view-title">中心股东、销售</div>
        <div class="city-view-box">
          <el-form-item label="股东数量" prop="expertTitle">
            <el-input class="small-input" v-model="dataForm.shareholderNum" disabled></el-input>
            <el-button type="primary" @click="getLook(1,'股东列表')">查看</el-button>
          </el-form-item>
          <el-form-item label="代理商数量" prop="expertTitle">
            <el-input class="small-input" v-model="dataForm.agentNum" disabled></el-input>
            <el-button type="primary" @click="getLook(3,'经销商列表')">查看</el-button>
          </el-form-item>
          <el-form-item label="中心销售数量" prop="expertTitle">
            <el-input class="small-input" v-model="dataForm.saleNum" disabled></el-input>
            <el-button type="primary" @click="getLook(2,'销售列表')">查看</el-button>
          </el-form-item>
        </div>
      </div>
      <div class="city-view-group">
        <div class="city-view-title">中心后台管理人员</div>
        <el-table
          :data="dataForm.adminList"
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
            prop="userId"
            header-align="center"
            align="center"
            label="管理员ID">
          </el-table-column>
          <el-table-column
            prop="username"
            header-align="center"
            align="center"
            label="管理员真实姓名">
          </el-table-column>
          <el-table-column
            prop="createTime"
            header-align="center"
            align="center"
            label="设置时间">
          </el-table-column>
        </el-table>
      </div>
      <el-form-item class="close-btn">
        <el-button type="info" @click="closePage()">关闭</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-table
        v-show="dialogType==1"
        :data="numList"
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
          prop="id"
          header-align="center"
          align="center"
          width="80"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="name"
          header-align="center"
          align="center"
          label="股东机构名称">
        </el-table-column>
        <el-table-column
          prop="leader"
          header-align="center"
          align="center"
          label="负责人">
        </el-table-column>
        <el-table-column
          prop="ifShare"
          header-align="center"
          align="center"
          label="分成状态">
          <template slot-scope="scope">
            {{ scope.row.ifShare==0?'关闭':scope.row.ifShare==1?'开启':''}}
          </template>
        </el-table-column>
        <el-table-column
          prop="fileNum"
          header-align="center"
          align="center"
          label="合同日期">
          <template slot-scope="scope">
            {{ scope.row.contractStart+'至'+scope.row.contractEnd}}
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          header-align="center"
          align="center"
          label="添加时间">
        </el-table-column>
      </el-table>
      <el-table
        v-show="dialogType==2"
        :data="numList"
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
          prop="uuid"
          header-align="center"
          align="center"
          width="80"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="realname"
          header-align="center"
          align="center"
          label="真实姓名">
        </el-table-column>
        <el-table-column
          prop="phone"
          header-align="center"
          align="center"
          label="手机号码">
        </el-table-column>
        <el-table-column
          prop="joinTimeOrg"
          header-align="center"
          align="center"
          label="添加时间">
        </el-table-column>
      </el-table>
      <el-table
        v-show="dialogType==3"
        :data="numList"
        border
        v-loading="dataListLoading"
        style="width: 100%;">
        <el-table-column
          prop="id"
          header-align="center"
          align="center"
          width="80"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="name"
          header-align="center"
          align="center"
          label="经销商机构名称">
        </el-table-column>
        <el-table-column
          prop="ppIdName"
          header-align="center"
          align="center"
          label="所属城市中心">
        </el-table-column>
        <el-table-column
          prop="pIdName"
          header-align="center"
          align="center"
          label="所属股东">
        </el-table-column>
        <el-table-column
          prop="ifShare"
          header-align="center"
          align="center"
          label="分成状态">
          <template slot-scope="scope">
            {{ scope.row.ifShare==0?'关闭':scope.row.ifShare==1?'开启':''}}
          </template>
        </el-table-column>
        <el-table-column
          prop="fileNum"
          header-align="center"
          align="center"
          label="合同日期">
          <template slot-scope="scope">
            {{ scope.row.contractStart+'至'+scope.row.contractEnd}}
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          header-align="center"
          align="center"
          label="添加时间">
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { isInteger } from '@/utils/validate'
  export default {
    inject:['removeTabHandle'],
    data(){
      var validateInteger = (rule, value, callback) => {
        if (!isInteger(value)&&value!="") {
          callback(new Error('中心占股分红格式错误'))
        } else {
          callback()
        }
      }
      return {
        id:'',
        delFlagShow:false,
        headers: {
          token: this.$cookie.get('token')
        },
        addHide:false,
        disabledStatus:false,
        djList:[],
        dialogTitle:'',
        dialogFormVisible:false,
        dialogType:1,
        numList:[],
        dataListLoading: false,
        dataForm:{
          id:'',
          name:'',
          type:'',
          createTime:'',
          shareBase:'',
          shareholderNum:'',
          agentNum:'',
          saleNum:'',
          adminList:[],
        },
        dataRule:{
          shareBase:[
            { validator: validateInteger, trigger: 'blur' }
          ],
        }
      }
    },
    mounted(){
      this.id=this.$route.query.id;
      //详情
      if( this.id!=undefined) {
        this.$http({
          url: this.$http.adornUrl(`/biz/organization/infoCenter/${this.id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          var datas=data.data;
          this.addHide=true;
          this.dataForm=datas;
        })
      }
    },
    methods:{
      closePage:function () {
        this.removeTabHandle(this.$store.state.common.mainTabsActiveName)
      },
      getLook(val,title){
        var url=val==1?'organization/shareholderListOfNoPaging':val==3?'organization/agentListOfNoPaging':'orgTbUser/centerUserListOfNoPaging';
        this.$http({
          url: this.$http.adornUrl('/biz/'+url),
          method: 'GET',
          params: val == 2 ? this.$http.adornParams({ 'cityCenterId': this.id }):this.$http.adornParams({ 'ppId': this.id })
        }).then(({data}) => {
          var datas=data.data;
          if(datas&&datas!=''&&datas!=null){
            this.numList=datas;
            this.dialogFormVisible=true;
            this.dialogType=val;
            this.dialogTitle=title;
          }else{
            this.$message('暂无人员');
          }
        })
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
  .city-input{
    width: 80%;
  }
  .input-msg{
    font-size: 12px;
    color:#999;
    margin-top: 0;
  }
  .small-input{
    width: 200px;
  }
  .close-btn{
    text-align: center;
    margin-top: 20px;
  }
</style>
