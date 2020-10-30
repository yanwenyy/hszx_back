<template>
  <div class="mod-policy">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">{{titleTxt}}</h2>
    <el-form label-position="left" label-width="120px" :model="dataForm" :rules="dataRule" ref="dataForm">
      <el-form-item v-show="dataForm.id" label="商品ID" prop="id">
        <el-input class="city-input" v-model="dataForm.id" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="商品类型" prop="expertTitle">
        <el-input class="city-input" v-model="dataForm.producttype=='1'?'行业VIP会员':''" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="行业" prop="expertTitle">
        <el-select
          v-model="dataForm.tradeid"
          clearable
          placeholder="行业" >
          <el-option v-for="item in hyList"
                     :label="item.tradeName"
                     :value="item.tradeId"
                     :key="item.tradeId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="卡种" prop="expertTitle">
        <el-select
          v-model="dataForm.cardId"
          clearable
          placeholder="卡种" >
          <el-option v-for="item in czList"
                     :label="item.cardName"
                     :value="item.cardId"
                     :key="item.cardId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="价格" prop="expertTitle">
        <el-input class="city-input" v-model="dataForm.price"></el-input>
        <div class="input-msg">价格为小数点后两位，例如：365.00</div>
      </el-form-item>
      <el-form-item label="状态" prop="expertTitle" v-show="dataForm.id">
        <el-input class="city-input" disabled v-model="dataForm.status=='0'?'在售':'停售'"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="expertTitle" >
        <el-input type="textarea" class="city-input" v-model="dataForm.remark"></el-input>
        <div class="input-msg">可记录该商品相关备注，最多200字</div>
      </el-form-item>
      <el-form-item v-show="dataForm.id" label="创建日期" prop="expertTitle">
        <el-input class="city-input" v-model="dataForm.insertTime" disabled clearable></el-input>
      </el-form-item>
      <el-form-item style="text-align: center;">
        <el-button type="primary" @click="dataFormSubmit()">保存</el-button>
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
        ztList:[
          {
            label:'在售',
            value:'0'
          },
          {
            label:'停售',
            value:'1'
          }
        ],
        hyList:[],
        czList:[],
        dataForm:{
          id:'',
          producttype:'1',
          tradeid:'',
          cardId:'1',
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
      //行业列表
      this.$http({
        url: this.$http.adornUrl('/biz/trade2/trade2ModelList'),
        method: 'GET',
      }).then(({data}) => {
        this.hyList = data.data
      });
      //卡种列表
      this.$http({
        url: this.$http.adornUrl('/biz/card/cardlist'),
        method: 'GET',
      }).then(({data}) => {
        this.czList = data.data
      });
      this.dataForm={
        id:'',
        producttype:'1',
        tradeid:'',
        cardId:'',
        price:'',
        status:'',
        remark:'',
        insertTime:''
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
          this.dataForm.tradeid=datas.tradeid;
          this.dataForm.cardId=datas.cardId;
          this.dataForm.price=datas.price;
          this.dataForm.status=datas.status;
          this.dataForm.remark=datas.remark;
          this.dataForm.insertTime=datas.insertTime;
        })
      }
    },
    methods:{
      //提交表单
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
            this.$http({
              url: this.$http.adornUrl(`/biz/goods/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'goodsId': this.dataForm.id || undefined,
                'producttype': this.dataForm.producttype,
                'tradeid':this.dataForm.tradeid,
                'cardId':this.dataForm.cardId,
                'price':this.dataForm.price,
                'remark':this.dataForm.remark,
              })
            }).then(({data}) => {
              if (data && data.code == 200) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.closePage()
                  }
                })

              } else {
                this.$message.error(data.msg)
              }
            })
        })
      },
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
