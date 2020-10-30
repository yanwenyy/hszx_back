<template>
  <div class="mod-policy">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">查看</h2>
    <el-form label-position="left" label-width="120px" :model="dataForm" :rules="dataRule" ref="dataForm">
      <div class="city-view-group">
        <div class="city-view-box">
          <el-form-item v-show="dataForm.id" label="ID">
            <el-input class="city-input" v-model="dataForm.id" disabled></el-input>
          </el-form-item>
          <el-form-item label="城市运营中心">
            <el-input class="city-input" v-model="dataForm.citycenterName" disabled></el-input>
          </el-form-item>
          <el-form-item label="选择角色">
            <el-radio disabled v-model="dataForm.nowRole" label="1">股东管理员</el-radio>
            <el-radio disabled v-model="dataForm.nowRole" label="2">股东销售</el-radio>
            <p class="input-msg">注：机构下最高可设置管理员3人、销售20人；若所选机构人员角色达到最大限制，则不可新增；</p>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input class="city-input" v-model="dataForm.phone" disabled></el-input>
          </el-form-item>
          <el-form-item label="用户名">
            <el-input class="city-input" v-model="dataForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="真实姓名">
            <el-input class="city-input" v-model="dataForm.realname" disabled></el-input>
          </el-form-item>
          <el-form-item v-show="dataForm.id" label="添加时间">
            <el-input class="city-input" v-model="dataForm.joinTimeOrg" disabled clearable></el-input>
          </el-form-item>
        </div>
      </div>
      <el-form-item class="close-btn">
        <el-button type="info" @click="closePage()">关闭</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    inject:['removeTabHandle'],
    data(){
      return {
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
        dataForm:{
          id:'',
          citycenterName:'',
          nowRole:'',
          phone:'',
          username:'',
          realname:'',
          joinTimeOrg:''
        },
        dataRule:{

        }
      }
    },
    mounted(){
      this.dataForm={
        id:'',
        citycenterName:'',
        nowRole:'',
        phone:'',
        username:'',
        realname:'',
        joinTimeOrg:''
      };
      this.dataForm.id=this.$route.query.id;
      //详情
      if(this.dataForm.id!=undefined) {
        this.$http({
          url: this.$http.adornUrl(`/biz/orgTbUser/infoShareUser/${this.dataForm.id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          var datas=data.data;
          this.titleTxt="编辑";
          this.addHide=true;
          this.dataForm.citycenterName=datas.citycenterName;
          this.dataForm.nowRole=String(datas.nowRole);
          this.dataForm.phone=datas.phone;
          this.dataForm.username=datas.username;
          this.dataForm.realname=datas.realname;
          this.dataForm.joinTimeOrg=datas.joinTimeOrg;
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
