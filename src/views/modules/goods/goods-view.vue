<template>
  <div class="mod-policy-pack">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">查看</h2>
    <el-form label-position="left" label-width="100px" :model="dataForm" ref="dataForm">
      <el-form-item label="平台" prop="platform">
        <el-select v-model="dataForm.platform" disabled >
          <el-option
            v-for="item in platformList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="行业" prop="tradeid" v-show="dataForm.platform==2">
        <el-select v-model="dataForm.tradeid" disabled placeholder="请选择行业">
          <el-option
            v-for="item in tradeList"
            :key="item.tradeId"
            :label="item.tradeName"
            :value="item.tradeId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="卡种" prop="cardtype" v-show="dataForm.platform==2">
        <el-select v-model="dataForm.cardtype" disabled placeholder="请选择卡种">
          <el-option
            v-for="item in cardList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品ID" prop="goodsId">
        <el-input v-model="dataForm.goodsId" :disabled="true" style="width:400px"></el-input>
      </el-form-item>
      <el-form-item label="商品名称" prop="goodsName">
        <el-input v-model="dataForm.goodsName" :disabled="true" style="width:400px"></el-input>
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input v-model="dataForm.price" :disabled="true" style="width:400px" type="number" ></el-input>
        <p style="color: #ccc">价格为小数点后两位，例如：365.00</p>
      </el-form-item>
      <el-form-item label="权限" prop="purview">
        <el-select v-model="dataForm.purview"  :disabled="true">
          <el-option
            v-for="item in purviewList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-input v-model="dataForm.status ? '停售':'在售'" :disabled="true" style="width:400px"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input type="number" v-model="dataForm.sort" disabled style="width: 400px"></el-input>
      </el-form-item>
      <el-form-item label="说明" prop="explain">
        <el-input v-model="dataForm.explain" :disabled="true" type="textarea" maxlength="200" show-word-limit style="width:400px"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" :disabled="true" type="textarea" maxlength="200" show-word-limit style="width:400px"></el-input>
        <p style="color: #ccc">可记录该商品相关备注，最多200字</p>
      </el-form-item>
      <el-form-item style="text-align: center;">
        <el-button type="info" @click="closePage()">关闭</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import ElInput from "element-ui/packages/input/src/input";
  export default {
    components: {ElInput},
    inject:['removeTabHandle'],
    data(){
      let validatePrice = (rule, value, callback) => {
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
        titleTxt:"新增",
        id:this.$route.query.id || undefined,
        dataForm:{
          goodsId:this.$route.query.id,
          platform:this.$route.query.type,
          remark:'',
          goodsName:'',
          price:'',
          purview:'',
          tradeid:'',
          sort:'',
          cardtype:'',
          explain:''
        },
        tradeList:[],
        cardList:[{'value':1,'label':'A卡'},{'value':2,'label':'B卡'}],
        purviewList:[{'value':"123",'label':'全部权益'}],
        platformList:[{label:'新政辅导',value:'1'},{label:'行业辅导',value:'2'}],
      }
    },
    mounted(){
      console.log(this.dataForm.platform)
      if(this.dataForm.platform==2){
        this.purviewList=[{'value':"1",'label':'行业辅导全模块权益'},{'value':"0",'label':'行业辅导不包括问答模块权益'}]
        //行业
        this.$http({
          url: this.$http.adornUrl('/biz/trade2/trade2ModelList'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          var dataList=[]
          for( var i=0;i<data.data.length;i++){
            dataList.push(data.data[i]);
          }
          this.tradeList = dataList
        })
      }
      if( this.id!=undefined){
        this.$http({
          url: this.$http.adornUrl(`/biz/goods/info/${this.id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.dataForm.price=data.data.price
          this.dataForm.goodsName=data.data.goodsName
          this.dataForm.purview=String(data.data.purview)
          this.dataForm.remark=data.data.remark
          this.dataForm.explain=data.data.explain
          this.dataForm.sort=data.data.sort
          if(this.dataForm.platform==2){
            this.dataForm.tradeid=data.data.tradeid
            this.dataForm.cardtype=data.data.cardtype
          }
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
</style>
