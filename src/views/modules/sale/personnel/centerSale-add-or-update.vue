<template>
  <div class="mod-policy">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">{{titleTxt}}</h2>
    <el-form label-position="left" label-width="120px" :model="dataForm" :rules="dataRule" ref="dataForm">
      <div class="city-view-group">
        <div class="city-view-title">人员信息</div>
        <div class="city-view-box">
          <el-form-item v-show="dataForm.id" label="ID" prop="id">
            <el-input class="city-input" v-model="dataForm.id" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="选择城市运营中心">
            <el-select
              clearable
              v-model="dataForm.cityCenterId"
              placeholder="所属运营中心">
              <el-option v-for="item in nameList"
                         :label="item.name"
                         :value="item.id"
                         :key="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input disabled class="city-input" v-model="dataForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="用户名">
            <el-input class="city-input" v-model="dataForm.username"></el-input>
          </el-form-item>
          <el-form-item label="真实姓名">
            <el-input class="city-input" v-model="dataForm.realname"></el-input>
          </el-form-item>
          <el-form-item v-show="dataForm.id" label="添加时间">
            <el-input class="city-input" v-model="dataForm.joinTimeOrg" disabled clearable></el-input>
          </el-form-item>
        </div>
      </div>
      <div class="city-view-group">
        <div class="city-view-title">分成设置</div>
        <div class="city-view-box">
          <el-form-item label="产品直销分成" prop="cardAccountList">
            <div class="cp-list">
              <div class="inline-block" v-for="item in dataForm.cardAccountList">
                <span>{{item.cardName}}:</span>
                <el-input v-model="item.price" class="small-input"></el-input>
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
        for(var i in value){
          if (!isInteger(value[i].price)&&value[i].price!="") {
            callback(new Error('中心占股分红格式错误'))
          } else {
            callback()
          }
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
        nameList:[],
        dataForm:{
          id:'',
          cityCenterId:'',
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
          cardAccountList:[
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
        cityCenterId:'',
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
      this.dataForm.phone=this.$route.query.phone||'';
      this.dataForm.username=this.$route.query.username||'';
      this.dataForm.realname=this.$route.query.realname||'';
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
          this.dataForm.cityCenterId=datas.cityCenterId;
          this.dataForm.phone=datas.phone;
          this.dataForm.username=datas.username;
          this.dataForm.realname=datas.realname;
          this.dataForm.joinTimeOrg=datas.joinTimeOrg;
        })
      }
    },
    mounted(){
      //中心列表
      this.$http({
        url: this.$http.adornUrl('/biz/organization/centerListOfNoPaging'),
        method: 'GET',
      }).then(({data}) => {
        this.nameList = data.data
      });
    },
    methods:{
      //提交表单
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
            this.$http({
              url: this.$http.adornUrl(`/biz/orgTbUser/${!this.dataForm.id ? 'saveCenterUser' : 'updateCenterUser'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'cityCenterId': this.dataForm.cityCenterId,
                'phone':this.dataForm.phone,
                'username':this.dataForm.username,
                'realname':this.dataForm.realname,
                'cardAccountList':this.dataForm.cardAccountList,
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
