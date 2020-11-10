<template>
  <div class="mod-policy-pack">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">{{txtitle}}</h2>
    <el-form label-position="left" label-width="120px" :model="dataForm" :rules="dataRule" ref="dataForm">
      <div class="two-title">企业权益</div>
      <el-form-item label="企业ID">
        <el-input v-model="companyid" :disabled="true" placeholder="企业ID"></el-input>
      </el-form-item>
      <el-form-item label="企业名称">
        <el-input v-model="companyname" :disabled="true" placeholder="企业名称"></el-input>
      </el-form-item>
      <el-form-item label="权益名称">
        <el-input v-model="dataForm.cardType=='1'?'个人版':dataForm.cardType=='2'?'企业版':dataForm.cardType=='3'?'集团版':'无版本'" :disabled="true" placeholder="权益名称"></el-input>
      </el-form-item>
      <el-form-item label="选择行业">
        <el-select v-model="dataForm.tradeId" @change="getPurview" placeholder="选择行业" :disabled="goodsChoice">
          <el-option
            v-for="item in tradeList"
            :key="item.tradeId"
            :label="item.tradeName"
            :value="item.tradeId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="会员开始时间" prop="vipStartTime">
        <el-date-picker
          v-model="dataForm.vipStartTime"
          type="date"
          @change="vipStart"
          :picker-options="start_Date"
          placeholder="选择日期" :disabled="vipStatusFn()">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="会员结束时间">
        <el-date-picker
          v-model="dataForm.vipEndTime"
          type="date"
          :disabled="true"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="付款金额" prop="price">
        <el-input type="number" v-model="dataForm.price" style="width: 400px"   placeholder="付款金额"></el-input>
        <p style="color: #ccc;margin: 0">请填写小数点后两位如：9800.00</p>
      </el-form-item>
      <el-form-item style="text-align: center;">
        <el-button @click="closePage()">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import VDistpicker from 'v-distpicker'
  export default {
    inject:['removeTabHandle'],
    data(){
      let validatePrice = (rule, value, callback) => {
        console.log(1)
        var ArrMen= String(value).split(".");    //截取字符串
        if(ArrMen.length==2){
          if(ArrMen[1].length<2||ArrMen[1].length>2){    //判断小数点后面的字符串长度
            callback(new Error("请输入小数点后两位"));
          }else{
            callback();
          }
        }else{
          callback(new Error("请输入小数点后两位"));
        }
      };
      return {
        start_Date: { //时间限制
          disabledDate: time => {
            if(this.$route.query.id!=undefined){
              return time.getTime() < Date.now()-8.64e7||time.getTime() > Date.now() + 2*8.64e7;
            }
          }
        },
        companyid:this.$route.query.id,
        tradeId:this.$route.query.tradeId,
        cardId:'',
        companyname:'',
        vipStatus:this.$route.query.vipStatus,
        txtitle:'新增',
        goodsChoice:false,
        dataForm:{
          cardType:this.$route.query.cardType,
          tradeId:'',
          vipEndTime:'',
          vipStartTime: "",
          price: "",
        },
        dataRule:{
          goodsid:[
            { required: true, message: '请选择商品', trigger: 'blur' }
          ],
          vipStartTime: [
            { required: true, message: '请选择会员开始时间', trigger: 'blur' }
          ],
          price: [
            { required: true, message: '请填写付款金额', trigger: 'blur' },
            { validator: validatePrice}
          ]
        },
        tradeList:[]//商品
      }
    },
    components: {
      VDistpicker
    },
    mounted(){
      this.cardId=this.$route.query.cardId;
      //企业信息
      this.$http({
        url: this.$http.adornUrl(`/biz/company/info/${this.companyid}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        if (data && data.code == 200) {
          var datas=data.data;
          this.companyname = datas.companyname;
        }
      });
      // if(this.tradeId!=undefined){
      //   this.txtitle='续费'
      //   this.$http({
      //     url: this.$http.adornUrl(`/biz/company/companyrightinfo`),
      //     method: 'get',
      //     params: this.$http.adornParams({
      //       companyId:this.companyId,
      //       tradeId:this.tradeId
      //     })
      //   }).then(({data}) => {
      //     if (data && data.code == 200) {
      //       this.goodsChoice=true
      //       this.dataForm.goodsid = data.data.goodsid;
      //       this.dataForm.purview = data.data.purview;
      //     }
      //   })
      // }
      this.getTrade();
    },
    methods:{
      vipStatusFn(){
        if(this.vipStatus!="有效"){
          return false
        }else{
          return true
        }
      },
      // 表单提交
      dataFormSubmit () {
        var ajaxUrl='/biz/company/savecompanyright';
        if(this.tradeId!=undefined){
          ajaxUrl='/biz/company/companyrightrenew'
        }
        // console.log(this.commonDate.formatTime('', '', this.dataForm.vipStartTime))
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`${ajaxUrl}`),
              method: 'post',
              data: this.$http.adornData({
                'companyId':this.companyid,
                'tradeId': this.dataForm.tradeId,
                'vipEndTime': this.dataForm.vipEndTime,
                'vipStartTime':this.commonDate.formatTime('', '', this.dataForm.vipStartTime).split(' ')[0],
                'price': this.dataForm.price,
                'cardId': this.cardId
              })
            }).then(({data}) => {
              if (data && data.code == 200) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList');
                    this.removeTabHandle(this.$store.state.common.mainTabsActiveName);
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      closePage:function () {
        this.removeTabHandle(this.$store.state.common.mainTabsActiveName)
      },
      //行业列表
      getTrade(){
        this.$http({
          url: this.$http.adornUrl(`/biz/trade2/${this.tradeId!=undefined?'buytrades':'nobuytrades'}/${this.companyid}`),
          method: 'get',
        }).then(({data}) => {
          if (data && data.code == 200) {
          this.tradeList=data.data
          }
        })
      },
      // 选择行业
      getPurview (e){
        if(this.dataForm.tradeId!=''){
          this.$http({
            url: this.$http.adornUrl(`/biz/company/getvipstarttime`),
            method: 'get',
            params: this.$http.adornParams({
              companyId: this.companyid,
              tradeId:this.dataForm.tradeId,
            })
          }).then(({data}) => {
            if (data && data.code == 200) {
              var datas=data.data;
              this.dataForm.vipStartTime=datas.split(" ")[0];
              this.$http({
                url: this.$http.adornUrl('/biz/company/getvipendtime'),
                method: 'GET',
                params: this.$http.adornParams({
                  'vipStart':this.dataForm.vipStartTime
                })
              }).then(({data}) => {
                if (data && data.code == 200) {
                  this.dataForm.vipEndTime=this.commonDate.formatDate('', '', data.data);
                }
              })
            }
          });
        }
      },

      //会员时间变化的时候
      vipStart(e){
        if(e){
          var date=e.toLocaleDateString();
          date=date.split("/").join("-");
          this.$http({
            url: this.$http.adornUrl('/biz/company/getvipendtime'),
            method: 'GET',
            params: this.$http.adornParams({
              'vipStart':date
            })
          }).then(({data}) => {
            if (data && data.code == 200) {
              this.dataForm.vipEndTime=this.commonDate.formatDate('', '', data.data);
            }
          })
        }
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
    width: 250px!important;
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
