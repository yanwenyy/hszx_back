<template>
  <div class="mod-policy">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">{{titleTxt}}</h2>
    <el-form label-position="left" label-width="120px" :model="dataForm" :rules="dataRule" ref="dataForm">
      <el-form-item label="商品ID" prop="id">
        <el-input class="city-input" v-model="dataForm.id" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="商品类型">
        <el-input class="city-input" v-model="dataForm.producttype=='1'?'行业VIP会员':''" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="行业">
        <el-input disabled class="city-input" v-model="dataForm.tradeName"></el-input>
      </el-form-item>
      <el-form-item label="卡种">
        <el-input disabled class="city-input" v-model="dataForm.cardName"></el-input>
      </el-form-item>
      <el-form-item label="价格">
        <el-input disabled class="city-input" v-model="dataForm.price"></el-input>
        <div class="input-msg">价格为小数点后两位，例如：365.00</div>
      </el-form-item>
      <el-form-item label="状态">
        <el-input disabled class="city-input" v-model="dataForm.status=='0'?'在售':'停售'"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input disabled type="textarea" class="city-input" v-model="dataForm.remark"></el-input>
        <div class="input-msg">可记录该商品相关备注，最多200字</div>
      </el-form-item>
      <el-form-item label="创建日期">
        <el-input class="city-input" v-model="dataForm.insertTime" disabled clearable></el-input>
      </el-form-item>
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
          producttype:'1',
          tradeName:'',
          cardName:'1',
          price:'',
          status:'1',
          remark:'',
          insertTime:'1'
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
        producttype:'1',
        tradeName:'',
        cardName:'1',
        price:'',
        status:'1',
        remark:'',
        insertTime:'1'
      };
      this.dataForm.id=this.$route.query.id;
      //详情
      if( this.dataForm.id!=undefined) {
        this.$http({
          url: this.$http.adornUrl(`/biz/goods/info/${this.dataForm.id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          var datas=data.data;
          this.titleTxt="编辑";
          this.addHide=true;
          this.dataForm.tradeName=datas.tradeName;
          this.dataForm.cardName=datas.cardName;
          this.dataForm.price=datas.price;
          this.dataForm.status=datas.status;
          this.dataForm.remark=datas.remark;
          this.dataForm.insertTime=datas.insertTime;
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
