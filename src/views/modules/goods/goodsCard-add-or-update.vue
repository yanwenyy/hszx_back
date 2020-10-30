<template>
  <div class="mod-policy">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">{{titleTxt}}</h2>
    <el-form label-position="left" label-width="120px" :model="dataForm" :rules="dataRule" ref="dataForm">
      <div class="city-view-group">
        <div class="city-view-title">卡种信息</div>
        <div class="city-view-box">
          <el-form-item v-show="dataForm.id" label="ID" prop="id">
            <el-input class="city-input" v-model="dataForm.id" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="卡种名称" prop="expertTitle">
            <el-input class="city-input" v-model="dataForm.cardName"></el-input>
          </el-form-item>
          <el-form-item label="卡种等级" prop="expertTitle">
            <el-input class="city-input" v-model="dataForm.cardLevel"></el-input>
            <div class="input-msg">请填写数字，数字越大等级越高，数字不可重复</div>
          </el-form-item>
          <el-form-item label="线上权益" prop="expertTitle">
            <el-select
              v-model="dataForm.onlineRight"
              clearable
              placeholder="线上权益">
              <el-option v-for="item in qyList"
                         :label="item.label"
                         :value="item.value"
                         :key="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="权益说明" prop="expertTitle">
            <el-input type="textarea" class="city-input" v-model="dataForm.rightExplain"></el-input>
            <div class="input-msg">前端展示，请谨慎承诺卡种权益</div>
          </el-form-item>
          <el-form-item label="备注说明" prop="expertTitle">
            <el-input type="textarea" class="city-input" v-model="dataForm.remark"></el-input>
            <div class="input-msg">内部备注，前端不展示</div>
          </el-form-item>
          <el-form-item v-show="dataForm.id" label="创建日期" prop="expertTitle">
            <el-input class="city-input" v-model="dataForm.createTime" disabled clearable></el-input>
          </el-form-item>
        </div>
      </div>
      <div class="city-view-group" v-show="!dataForm.id">
        <div class="city-view-title">卡种分成</div>
        <div class="city-view-box">
          <div class="input-msg">注：请填写整数数字，如“500”</div>
          <el-form-item label="中心销售" prop="centerSale">
            <div class="cp-list">
              <div class="inline-block">
                <span>直销:</span>
                <el-input v-model="dataForm.centerSale" class="small-input"></el-input>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="股东分成" prop="shareholderSale">
            <div class="cp-list">
              <div class="inline-block">
                <span>直销:</span>
                <el-input v-model="dataForm.shareholderSale" class="small-input"></el-input>
              </div>
              <div class="inline-block">
                <span>经销商提成:</span>
                <el-input v-model="dataForm.agencyDivide" class="small-input"></el-input>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="股东池分成" prop="shareholderPoolBase">
            <div class="cp-list">
              <div class="inline-block">
                <span>基础分红:</span>
                <el-input v-model="dataForm.shareholderPoolBase" class="small-input"></el-input>
              </div>
              <div class="inline-block">
                <span>裂变分红:</span>
                <el-input v-model="dataForm.shareholderPoolChange" class="small-input"></el-input>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="经销商分成" prop="agencySale">
            <div class="cp-list">
              <div class="inline-block">
                <span>直销:</span>
                <el-input v-model="dataForm.agencySale" class="small-input"></el-input>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="代言人分成" prop="spokesmanSale">
            <div class="cp-list">
              <div class="inline-block">
                <span>直销:</span>
                <el-input v-model="dataForm.spokesmanSale" class="small-input"></el-input>
              </div>
            </div>
          </el-form-item>
        </div>
      </div>
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
        console.log(isInteger(value))
        if (!isInteger(value)&&value!="") {
          callback(new Error('格式错误'))
        } else {
          callback()
        }
      }
      var shareholderSaleValidateInteger=(rule, value, callback) => {
        if (!isInteger(this.dataForm.shareholderSale)&&this.dataForm.shareholderSale!="") {
          callback(new Error('格式错误'))
        }else if(!isInteger(this.dataForm.agencyDivide)&&this.dataForm.agencyDivide!=""){
          callback(new Error('格式错误'))
        } else {
          callback()
        }
      }
      var shareholderPoolBaseValidateInteger=(rule, value, callback) => {
        if (!isInteger(this.dataForm.shareholderPoolBase)&&this.dataForm.shareholderPoolBase!="") {
          callback(new Error('格式错误'))
        }else if(!isInteger(this.dataForm.shareholderPoolChange)&&this.dataForm.shareholderPoolChange!=""){
          callback(new Error('格式错误'))
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
        qyList:[
          {
            label:'全部权益',
            value:'1'
          },
          {
            label:'不包含 微咨询',
            value:'2'
          },
        ],
        dataForm:{
          id:'',
          cardName:'',
          cardLevel:'',
          onlineRight:'',
          rightExplain:'',
          remark:'',
          createTime:'',
          centerSale:'',
          shareholderSale:'',
          agencyDivide:'',
          shareholderPoolBase:'',
          shareholderPoolChange:'',
          agencySale:'',
          spokesmanSale:''
        },
        dataRule:{
          centerSale:[
            { validator: validateInteger, trigger: 'blur' }
          ],
          shareholderSale:[
            { validator: shareholderSaleValidateInteger, trigger: 'blur' }
          ],
          shareholderPoolBase:[
            { validator: shareholderPoolBaseValidateInteger, trigger: 'blur' }
          ],
          agencySale:[
            { validator: validateInteger, trigger: 'blur' }
          ],
          spokesmanSale:[
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
        centerSale:'',
        shareholderSale:'',
        agencyDivide:'',
        shareholderPoolBase:'',
        shareholderPoolChange:'',
        agencySale:'',
        spokesmanSale:''
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
          this.dataForm.centerSale=datas.centerSale;
          this.dataForm.shareholderSale=datas.shareholderSale;
          this.dataForm.agencyDivide=datas.agencyDivide;
          this.dataForm.shareholderPoolBase=datas.shareholderPoolBase;
          this.dataForm.shareholderPoolChange=datas.shareholderPoolChange;
          this.dataForm.agencySale=datas.agencySale;
          this.dataForm.spokesmanSale=datas.spokesmanSale;
        })
      }
    },
    methods:{
      //提交表单
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
            this.$http({
              url: this.$http.adornUrl(`/biz/card/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'cardId': this.dataForm.id || undefined,
                'cardName': this.dataForm.cardName,
                'cardLevel':this.dataForm.cardLevel,
                'onlineRight':this.dataForm.onlineRight,
                'rightExplain':this.dataForm.rightExplain,
                'remark':this.dataForm.remark,
                'centerSale':this.dataForm.centerSale,
                'shareholderSale':this.dataForm.shareholderSale,
                'agencyDivide':this.dataForm.agencyDivide || undefined,
                'shareholderPoolBase':this.dataForm.shareholderPoolBase,
                'shareholderPoolChange':this.dataForm.shareholderPoolChange,
                'agencySale':this.dataForm.agencySale,
                'spokesmanSale':this.dataForm.spokesmanSale,
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
