<template>
  <div class="mod-policy">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">查看</h2>
    <el-form label-position="left" label-width="120px" :model="dataForm" :rules="dataRule" ref="dataForm">
      <div class="city-view-group">
        <div class="city-view-title">卡种信息</div>
        <div class="city-view-box">
          <el-form-item label="ID" prop="id">
            <el-input class="city-input" v-model="dataForm.id" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="卡种名称" prop="expertTitle">
            <el-input disabled class="city-input" v-model="dataForm.cardName"></el-input>
          </el-form-item>
          <el-form-item label="卡种等级" prop="expertTitle">
            <el-input disabled class="city-input" v-model="dataForm.cardLevel"></el-input>
            <div class="input-msg">请填写数字，数字越大等级越高，数字不可重复</div>
          </el-form-item>
          <el-form-item label="线上权益" prop="expertTitle">
            <el-input disabled class="city-input" v-model="dataForm.onlineRight=='1'?'全部权益':'不包含 微咨询'"></el-input>
          </el-form-item>
          <el-form-item label="权益说明" prop="expertTitle">
            <el-input disabled type="textarea" class="city-input" v-model="dataForm.rightExplain"></el-input>
            <div class="input-msg">前端展示，请谨慎承诺卡种权益</div>
          </el-form-item>
          <el-form-item label="备注说明" prop="expertTitle">
            <el-input disabled type="textarea" class="city-input" v-model="dataForm.remark"></el-input>
            <div class="input-msg">内部备注，前端不展示</div>
          </el-form-item>
          <el-form-item label="创建日期" prop="expertTitle">
            <el-input class="city-input" v-model="dataForm.createTime" disabled clearable></el-input>
          </el-form-item>
        </div>
      </div>
      <el-form-item style="text-align: center;">
        <el-button type="info" @click="closePage()">关闭</el-button>
      </el-form-item>
    </el-form>
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
        titleTxt:"新增",
        addHide:false,
        disabledStatus:false,
        djList:[],
        dataForm:{
          id:'',
          cardName:'',
          cardLevel:'',
          onlineRight:'',
          rightExplain:'',
          remark:'',
          createTime:'',
        },
        dataRule:{
          fh:[
            { validator: validateInteger, trigger: 'blur' }
          ],
        }
      }
    },
    activated(){
      this.dataForm={
        id:'',
        cardName:'',
        cardLevel:'',
        onlineRight:'',
        rightExplain:'',
        remark:'',
        createTime:'',
      };
      this.dataForm.id=this.$route.query.id;
      //详情
      if( this.dataForm.id!=undefined) {
        this.$http({
          url: this.$http.adornUrl(`/biz/card/info/${this.dataForm.id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          var datas=data.data;
          this.titleTxt="编辑";
          this.addHide=true;
          this.dataForm.cardName=datas.cardName;
          this.dataForm.cardLevel=datas.cardLevel;
          this.dataForm.onlineRight=String(datas.onlineRight);
          this.dataForm.rightExplain=datas.rightExplain;
          this.dataForm.remark=datas.remark;
          this.dataForm.createTime=datas.createTime;
        })
      }
    },
    methods:{
      closePage:function () {
        this.removeTabHandle(this.$store.state.common.mainTabsActiveName)
      },
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
  .small-input{
    width: 200px;
  }
  .input-msg{
    font-size: 12px;
    color:#999;
    margin-top: 0;
  }
  .inline-block{
    display: inline-block;
  }
  .cp-list>div{
    margin-bottom: 20px;
    margin-right: 20px;
  }
</style>
