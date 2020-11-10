<template>
  <div class="mod-policy">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">{{titleTxt}}</h2>
    <el-form label-position="left" label-width="120px" :model="dataForm" :rules="dataRule" ref="dataForm">
      <div class="city-view-group">
        <div class="city-view-box">
          <el-form-item v-show="dataForm.id" label="ID" prop="id">
            <el-input class="city-input" v-model="dataForm.id" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="选择城市运营中心">
            <el-select
              @change="getGd()"
              v-model="dataForm.cityCenterId"
              clearable
              placeholder="选择城市运营中心" >
              <el-option v-for="item in nameList"
                         :label="item.name"
                         :value="item.id"
                         :key="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="股东机构">
            <el-select
              @change="getGdNum"
              v-model="dataForm.shareholderId"
              clearable
              placeholder="股东机构" >
              <el-option v-for="item in gdList"
                         :label="item.name"
                         :value="item.id"
                         :key="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择角色">
            <el-radio :disabled="saleAdminNum>3" v-model="dataForm.nowRole" label="3">股东管理员</el-radio>
            <el-radio :disabled="saleNum>17" v-model="dataForm.nowRole" label="2">股东销售</el-radio>
            <p class="input-msg">注：机构下最高可设置管理员3人、销售17人；若所选机构人员角色达到最大限制，则不可新增；</p>
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
        nameList:[],
        gdList:[],
        dataForm:{
          id:'',
          cityCenterId:'',
          shareholderId:'',
          nowRole:'',
          phone:'',
          username:'',
          realname:'',
          joinTimeOrg:''
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
        cityCenterId:'',
        shareholderId:'',
        nowRole:'',
        phone:'',
        username:'',
        realname:'',
        joinTimeOrg:''
      };
      //中心列表
      this.$http({
        url: this.$http.adornUrl('/biz/organization/centerListOfNoPaging'),
        method: 'GET',
      }).then(({data}) => {
        this.nameList = data.data
      });
      this.dataForm.id=this.$route.query.id;
      this.dataForm.phone=this.$route.query.phone||'';
      this.dataForm.username=this.$route.query.username||'';
      this.dataForm.realname=this.$route.query.realname||'';
      //详情
      if( this.dataForm.id!=undefined) {
        this.$http({
          url: this.$http.adornUrl(`/biz/orgTbUser/infoShareUser/${this.dataForm.id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          var datas=data.data;
          this.titleTxt="编辑";
          this.addHide=true;
          this.dataForm.cityCenterId=datas.cityCenterId;
          this.dataForm.shareholderId=datas.shareholderId;
          this.dataForm.nowRole=String(datas.nowRole);
          this.dataForm.phone=datas.phone;
          this.dataForm.username=datas.username;
          this.dataForm.realname=datas.realname;
          this.dataForm.joinTimeOrg=datas.joinTimeOrg;
          //股东机构列表
          this.$http({
            url: this.$http.adornUrl('/biz/organization/shareholderListOfNoPaging'),
            method: 'GET',
            params: this.$http.adornParams({
              ppId: this.dataForm.cityCenterId
            })
          }).then(({data}) => {
            this.gdList = data.data
          });
        })
      }
    },
    methods:{
      //中心运营列表选择
      getGd(){
        if(this.dataForm.cityCenterId!==''){
          //股东机构列表
          this.$http({
            url: this.$http.adornUrl('/biz/organization/shareholderListOfNoPaging'),
            method: 'GET',
            params: this.$http.adornParams({
              ppId: this.dataForm.cityCenterId
            })
          }).then(({data}) => {
            this.dataForm.shareholderId='';
            this.gdList = data.data;
          });
        }
      },
      //股东列表选择
      getGdNum(val){
        this.saleAdminNum = val ? this.gdList.find(ele => ele.id === val).saleAdminNum : '';
        this.saleNum = val ? this.gdList.find(ele => ele.id === val).saleNum : '';
      },
      //提交表单
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
            this.$http({
              url: this.$http.adornUrl(`/biz/orgTbUser/${!this.dataForm.id ? 'saveShareUser' : 'updateShareUser'}`),
              method: 'post',
              data: this.$http.adornData({
                'uuid': this.dataForm.id || undefined,
                'cityCenterId': this.dataForm.cityCenterId,
                'shareholderId':this.dataForm.shareholderId,
                'nowRole':this.dataForm.nowRole,
                'phone':this.dataForm.phone,
                'username':this.dataForm.username,
                'realname':this.dataForm.realname,
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
