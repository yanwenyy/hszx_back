<template>
  <div class="mod-policy">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">查看</h2>
    <el-form label-position="left" label-width="120px" :model="dataForm" :rules="dataRule" ref="dataForm">
      <div class="city-view-group">
        <div class="city-view-title">人员信息</div>
        <div class="city-view-box">
          <el-form-item v-show="dataForm.id" label="ID" prop="id">
            <el-input class="city-input" v-model="dataForm.id" disabled></el-input>
          </el-form-item>
          <el-form-item label="城市运营中心" prop="expertTitle">
            <el-input class="city-input" v-model="dataForm.citycenterName" disabled></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="expertTitle">
            <el-input class="city-input" v-model="dataForm.phone" disabled></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="expertTitle">
            <el-input class="city-input" v-model="dataForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="真实姓名" prop="expertTitle">
            <el-input class="city-input" v-model="dataForm.realname" disabled></el-input>
          </el-form-item>
          <el-form-item v-show="dataForm.id" label="添加时间" prop="expertTitle">
            <el-input class="city-input" v-model="dataForm.joinTimeOrg" disabled clearable></el-input>
          </el-form-item>
        </div>
      </div>
      <div class="city-view-group">
        <div class="city-view-title">分成设置</div>
        <div class="city-view-box">
          <el-form-item label="产品直销分成" prop="fh">
            <div class="cp-list">
              <div class="inline-block" v-for="item in dataForm.cardAccountList">
                <span>{{item.cardName}}:</span>
                <el-input disabled v-model="item.price" class="small-input"></el-input>
              </div>
            </div>
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
        djList:[],
        dialogTitle:'',
        dialogFormVisible:false,
        dialogType:1,
        dataForm:{
          id:'',
          citycenterName:'',
          phone:'',
          username:'',
          realname:'',
          joinTimeOrg:'',
          cardAccountList:[
            {
              cardName:'A卡',
              cardId:'1',
              price:'',
            }
          ],
        },
        dataRule:{
          fh:[
            { validator: validateInteger, trigger: 'blur' }
          ],
        }
      }
    },
    activated(){
      if(!this.dataForm.id){
        //产品直销回显
        this.$http({
          url: this.$http.adornUrl('/biz/card/splitTemplateForCenterSale'),
          method: 'GET',
        }).then(({data}) => {
          var datas=data.data,i=0,len=datas.length;
          // for(;i<len;i++){
          //   datas[i].price=datas[i].centerSale;
          // }
          this.dataForm.cardAccountList = datas;
        });
      }
      this.dataForm={
        id:'',
        citycenterName:'',
        phone:'',
        username:'',
        realname:'',
        joinTimeOrg:'',
        cardAccountList:[
          {
            cardName:'A卡',
            cardId:'1',
            price:'',
          }
        ],
      };
      this.dataForm.id=this.$route.query.id;
      //详情
      if( this.dataForm.id!=undefined) {
        this.$http({
          url: this.$http.adornUrl(`/biz/orgTbUser/infoCenterUser/${this.dataForm.id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          var datas=data.data;
          this.titleTxt="编辑";
          this.addHide=true;
          this.dataForm.cardAccountList=datas.cardAccountList;
          this.dataForm.citycenterName=datas.citycenterName;
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
  .inline-block{
    display: inline-block;
  }
  .cp-list>div{
    margin-bottom: 20px;
    margin-right: 20px;
  }
</style>
