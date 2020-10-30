<template>
  <div class="mod-policy">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">{{titleTxt}}</h2>
    <el-form label-position="left" label-width="120px" :model="dataForm" :rules="dataRule" ref="dataForm">
      <el-form-item label="商品类型">
        <el-input class="city-input" v-model="dataForm.producttype=='1'?'行业VIP会员':''" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="选择行业">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <el-checkbox-group v-model="checkList" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="item in hyList" :label="item.tradeId">{{item.tradeName}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="卡种">
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
      <el-form-item label="价格">
        <el-input class="city-input" v-model="dataForm.price"></el-input>
        <div class="input-msg">价格为小数点后两位，例如：365.00</div>
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
        hyList: [],
        checkList:[],
        checkAll: false,
        czList:[],
        isIndeterminate: true,
        titleTxt:"新增",
        addHide:false,
        disabledStatus:false,
        dataForm:{
          producttype:'1',
          cardId:'',
          price:''
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
        producttype:'1',
        cardId:'',
        price:''
      };
      this.dataForm.id=this.$route.query.id;
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
    },
    methods:{
      handleCheckAllChange(val) {
        this.checkList = val ? this.hyList : [];
        this.isIndeterminate = false;
      },
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.checkList.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.checkList.length;
      },
      //提交表单
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
            this.$http({
              url: this.$http.adornUrl(`/biz/goods/saveManyGoods`),
              method: 'post',
              data: this.$http.adornData({
                'producttype': this.dataForm.producttype || undefined,
                'cardId': this.dataForm.cardId,
                'price': this.dataForm.price,
                'tradeIdLists': this.checkList
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
  .el-checkbox{
    display: inline-block;
    width: 20%;
    margin-left: 0!important;
    word-break:break-all;
  }
</style>
