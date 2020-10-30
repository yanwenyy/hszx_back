<template>
  <div class="mod-policy-pack">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">查看</h2>
    <el-form label-position="left" label-width="100px" :model="dataForm" ref="dataForm">

      <div class="two-title">企业信息</div>
      <el-form-item label="企业ID">
        <el-input v-model="id" :disabled="true" placeholder="企业ID"></el-input>
      </el-form-item>
      <el-form-item label="企业名称">
        <el-input v-model="dataForm.companyname" :disabled="true" placeholder="企业名称"></el-input>
      </el-form-item>
      <el-form-item label="企业版本">
        <el-input v-model="dataForm.cardType=='1'?'个人版':dataForm.cardType=='2'?'企业版':dataForm.cardType=='3'?'集团版':'无版本'" :disabled="true" placeholder="企业名称"></el-input>
      </el-form-item>
      <el-form-item label="版本授权账号数">
        <el-input v-model="dataForm.personNumber" :disabled="true" placeholder="版本授权账号数"></el-input>
      </el-form-item>
      <el-form-item label="创建日期" prop="companyname">
        <el-input v-model="dataForm.createtime" :disabled="true" placeholder="创建日期"></el-input>
      </el-form-item>
      <div class="two-title">分成渠道标记</div>
      <el-form-item label="城市运营中心">
        <el-input v-model="dataForm.citycenterName" :disabled="true" placeholder="城市运营中心"></el-input>
      </el-form-item>
      <el-form-item label="股东机构">
        <el-input v-model="dataForm.shareholderName" :disabled="true" placeholder="股东机构"></el-input>
      </el-form-item>
      <el-form-item label="经销商机构">
        <el-input v-model="dataForm.agencyName" :disabled="true" placeholder="经销商机构"></el-input>
      </el-form-item>
      <el-form-item label="邀请人">
        <el-input v-model="dataForm.inviteRealname" :disabled="true" placeholder="邀请人"></el-input>
      </el-form-item>
      <el-form-item label="邀请人角色">
        <el-input v-model="dataForm.inviteRole=='1'?'中心销售':dataForm.inviteRole=='2'?'股东销售':dataForm.inviteRole=='3'?'股东管理员':dataForm.inviteRole=='4'?'经销商销售':dataForm.inviteRole=='5'?'经销商管理员':dataForm.inviteRole=='6'?'代言人':'普通用户'" :disabled="true" placeholder="邀请人角色"></el-input>
      </el-form-item>
      <!--<div class="two-title">企业人员</div>-->
      <!--<el-table-->
        <!--:data="dataList"-->
        <!--border-->
        <!--v-loading="dataListLoading"-->
        <!--style="width: 100%;margin-bottom: 30px">-->
        <!--<el-table-column-->
          <!--header-align="center"-->
          <!--align="center"-->
          <!--label="序号">-->
          <!--<template slot-scope="scope">{{totalPage-scope.$index}}</template>-->
        <!--</el-table-column>-->

        <!--<el-table-column-->
          <!--prop="username"-->
          <!--header-align="center"-->
          <!--align="center"-->
          <!--label="用户名">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--prop="realname"-->
          <!--header-align="center"-->
          <!--align="center"-->
          <!--label="真实姓名">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--prop="phone"-->
          <!--header-align="center"-->
          <!--align="center"-->
          <!--label="手机号码">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--prop="role"-->
          <!--header-align="center"-->
          <!--align="center"-->
          <!--label="用户角色">-->
          <!--<template slot-scope="scope"> {{dataForm.role==0?'管理员':'员工'}}</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--prop="bindingTime"-->
          <!--header-align="center"-->
          <!--align="center"-->
          <!--:formatter="commonDate.formatTime"-->
          <!--label="加入企业时间">-->
        <!--</el-table-column>-->
      <!--</el-table>-->
      <!--<div class="two-title">企业权益</div>-->
      <!--<el-table-->
        <!--:data="dataList1"-->
        <!--border-->
        <!--style="width: 100%;margin-bottom: 30px">-->
        <!--<el-table-column-->
          <!--header-align="center"-->
          <!--align="center"-->
          <!--label="序号">-->
          <!--<template slot-scope="scope">{{totalPage1-scope.$index}}</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--prop="goodsName"-->
          <!--header-align="center"-->
          <!--align="center"-->
          <!--label="行业">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--prop="purview"-->
          <!--header-align="center"-->
          <!--align="center"-->
          <!--label="卡种">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--prop="vipStatus"-->
          <!--header-align="center"-->
          <!--align="center"-->
          <!--label="商品名称">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--prop="vaildstarttime"-->
          <!--header-align="center"-->
          <!--align="center"-->
          <!--label="剩余咨询次数">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--prop="vaildlasttime"-->
          <!--header-align="center"-->
          <!--align="center"-->
          <!--label="会员状态">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--prop="coachendtime"-->
          <!--header-align="center"-->
          <!--align="center"-->
          <!--label="开通日期">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--prop="coachendtime"-->
          <!--header-align="center"-->
          <!--align="center"-->
          <!--label="截止日期">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--prop="sum"-->
          <!--header-align="center"-->
          <!--align="center"-->
          <!--label="付款金额">-->
        <!--</el-table-column>-->
      <!--</el-table>-->
      <el-form-item style="text-align: center;">
        <el-button type="info" @click="closePage()">关闭</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    inject:['removeTabHandle'],
    data(){
      let validateJumpUrl = (rule, value, callback) => {
        // 当跳转链接为空值且为必填时，抛出错误，反之通过校验
        if (this.dataForm.jumpUrl === "" && this.isHaveTo) {
          callback(new Error("请输入跳转链接"));
        } else {
          callback();
        }
      };
      return {
        id:this.$route.query.id,
        dataForm:{

        },
        city:'',
        dataList: [],
        dataList1: [],
        pageIndex: 1,
        pageSize: 30,
        totalPage: 0,
        totalPage1:0,
        dataListLoading: false,
        addOrUpdateVisible: false,
      }
    },
    mounted(){
      if( this.id!=undefined){
        this.$http({
          url: this.$http.adornUrl(`/biz/company/info/${this.id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code == 200) {
            var datas=data.data;
            this.dataForm = datas;
          }
        });
      }

    },
    methods:{
      closePage:function () {
        this.removeTabHandle(this.$store.state.common.mainTabsActiveName)
      },
    }
  }
</script>
<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 342px;
    height: 122px;
    line-height: 122px;
    text-align: center;
  }
  .avatar {
    width: 342px;
    height: 122px;
    display: block;
  }
  >>> input[type="text"]{
    width: 400px!important;
  }
  >>> input[placeholder="选择日期"]{
    width: 200px!important;
  }
  .two-title{
    font-size: 24px;
    margin-bottom: 20px;
    font-weight: bold;
  }
  .date-line{
    margin-right: 20px;
  }
</style>
