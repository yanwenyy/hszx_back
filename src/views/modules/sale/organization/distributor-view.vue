<template>
  <div class="mod-policy">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">查看</h2>
    <el-form label-position="left" label-width="120px" :model="dataForm" :rules="dataRule" ref="dataForm">
      <div class="city-view-group">
        <div class="city-view-title">基础信息</div>
        <div class="city-view-box">
          <el-form-item label="ID" prop="id">
            <el-input class="city-input" v-model="dataForm.id" disabled></el-input>
          </el-form-item>
          <el-form-item label="上级机构属性" prop="expertTitle">
            <el-input class="city-input" v-model="dataForm.pType==0?'无':dataForm.pType==1?'城市中心':'股东'" disabled></el-input>
          </el-form-item>
          <el-form-item label="所属城市运营中心" prop="expertTitle">
            <el-input class="city-input" v-model="dataForm.pIdName" disabled></el-input>
          </el-form-item>
          <el-form-item label="所属股东" prop="expertTitle">
            <el-input class="city-input" v-model="dataForm.ppIdName" disabled></el-input>
          </el-form-item>
          <el-form-item label="所属销售" prop="expertTitle">
            <el-input class="city-input" v-model="dataForm.id" disabled></el-input>
          </el-form-item>
          <el-form-item label="经销商机构名称" prop="expertTitle">
            <el-input class="city-input" v-model="dataForm.name" disabled></el-input>
          </el-form-item>
          <el-form-item label="机构负责人" prop="expertTitle">
            <el-input class="city-input" v-model="dataForm.leader" disabled></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="expertTitle">
            <el-input class="city-input" v-model="dataForm.phone" disabled></el-input>
          </el-form-item>
          <el-form-item label="合同过期时间">
            <el-date-picker disabled
                            v-model="dataForm.releaseTime"
                            type="daterange"
                            range-separator="一"
                            value-format="yyyy-MM-dd"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="添加时间" prop="expertTitle">
            <el-input class="city-input" v-model="dataForm.createTime" disabled clearable></el-input>
          </el-form-item>
        </div>
      </div>
      <div class="city-view-group">
        <div class="city-view-title">分成设置</div>
        <div class="city-view-box">
          <el-form-item label="分成状态">
            <el-radio disabled v-model="dataForm.ifShare" label="1">开启</el-radio>
            <el-radio disabled v-model="dataForm.ifShare" label="2">关闭</el-radio>
          </el-form-item>
          <el-form-item label="是否扣税">
            <el-radio disabled v-model="dataForm.ifTax" label="1">扣税</el-radio>
            <el-radio disabled v-model="dataForm.ifTax" label="2">无需扣税</el-radio>
          </el-form-item>
        </div>
      </div>
      <div class="city-view-group">
        <div class="city-view-title">股东小程序端人员 <el-button type="primary" @click="getLook(1,'股东小程序端人员')">查看全部人员</el-button></div>
        <div class="city-view-box">
          <el-form-item label="管理员" prop="expertTitle">
            <el-input class="city-input" v-model="dataForm.saleAdminNum" disabled></el-input>
          </el-form-item>
          <el-form-item label="股东销售" prop="expertTitle">
            <el-input class="city-input" v-model="dataForm.shareholderNum" disabled></el-input>
          </el-form-item>
        </div>
      </div>
      <div class="city-view-group">
        <div class="city-view-title">中心后台管理人员</div>
        <el-table
          :data="dataForm.adminList"
          border
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
        :data="dataList"
        border
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
          label="角色">
        </el-table-column>
        <el-table-column
          prop="title"
          header-align="center"
          align="center"
          label="用户ID">
        </el-table-column>
        <el-table-column
          prop="fileNum"
          header-align="center"
          align="center"
          label="真实姓名">
        </el-table-column>
        <el-table-column
          prop="fileNum"
          header-align="center"
          align="center"
          label="手机号">
        </el-table-column>
        <el-table-column
          prop="fileNum"
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
        delFlagShow:false,
        headers: {
          token: this.$cookie.get('token')
        },
        addHide:false,
        disabledStatus:false,
        dialogTitle:'',
        dialogFormVisible:false,
        dialogType:1,
        dataForm:{
          id:'',
          pType:'',
          pid:'',
          ppid:'',
          salePersonId:'',
          name:'',
          leader:'',
          phone:'',
          releaseTime:'',
          createTime:'',
          ifShare:'1',
          ifTax:'1',
        },
        dataList:[],
        dataRule:{
          fh:[
            { validator: validateInteger, trigger: 'blur' }
          ],
        }
      }
    },
    mounted(){
      this.dataForm.id=this.$route.query.id;
      //详情
      if( this.dataForm.id!=undefined) {
        this.$http({
          url: this.$http.adornUrl(`/biz/organization/infoAgent/${this.dataForm.id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          var datas=data.data;
          this.titleTxt="编辑";
          this.addHide=true;
          this.dataForm=datas;
          this.dataForm.releaseTime=[datas.contractStart||'',datas.contractEnd||''];
        })
      }
    },
    methods:{
      closePage:function () {
        this.removeTabHandle(this.$store.state.common.mainTabsActiveName)
      },
      getLook(val,title){
        this.dialogFormVisible=true;
        this.dialogType=val;
        this.dialogTitle=title;
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
