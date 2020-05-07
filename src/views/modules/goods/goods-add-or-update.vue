<template>
  <div class="mod-policy-pack">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">{{titleTxt}}</h2>
    <el-form label-position="left" label-width="100px" :model="dataForm" :rules="dataRule" ref="dataForm">
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
        <el-select v-model="dataForm.tradeid" placeholder="请选择行业">
          <el-option
            v-for="item in tradeList"
            :key="item.tradeId"
            :label="item.tradeName"
            :value="item.tradeId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="卡种" prop="cardtype" v-show="dataForm.platform==2">
        <el-select v-model="dataForm.cardtype" placeholder="请选择卡种">
          <el-option
            v-for="item in cardList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品名称" prop="goodsName">
        <el-input v-model="dataForm.goodsName" placeholder="请输入商品名称" style="width:400px"></el-input>
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input v-model="dataForm.price" style="width:400px" type="number" ></el-input>
        <p style="color: #ccc;padding: 0;margin: 0">价格为小数点后两位，例如：365.00</p>
      </el-form-item>
      <el-form-item label="权限" prop="purview">
        <el-select v-model="dataForm.purview" >
          <el-option
            v-for="item in purviewList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排序" prop="sort" :rules="{required: true, message: '排序不能为空', trigger: 'blur'}">
        <el-input type="number" v-model="dataForm.sort" style="width: 400px"></el-input>
        <p style="color: #ccc;padding: 0;margin: 0;">请填写数字，数字越大排序越靠前，该排序影响小程序前端商品排序</p>
      </el-form-item>
      <el-form-item label="说明" prop="explain">
        <el-input v-model="dataForm.explain" type="textarea" maxlength="200" show-word-limit style="width:400px"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark"  type="textarea" maxlength="200" show-word-limit style="width:400px"></el-input>
        <p style="color: #ccc">可记录该商品相关备注，最多200字</p>
      </el-form-item>
      <el-form-item style="text-align: center;">
        <el-button type="primary" @click="dataFormSubmit()">保存</el-button>
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
      let validateTrade = (rule, value, callback) => {
        // 当跳转链接为空值且为必填时，抛出错误，反之通过校验
        if (this.dataForm.tradeid=='' && this.isRequired) {
          callback(new Error("行业不能为空"));
        } else {
          callback();
        }
      };
      let validateCard = (rule, value, callback) => {
        // 当跳转链接为空值且为必填时，抛出错误，反之通过校验
        if (this.dataForm.cardtype=='' && this.isRequired) {
          callback(new Error("卡种不能为空"));
        } else {
          callback();
        }
      };
      return {
        titleTxt:"新增",
        id:this.$route.query.id || undefined,
        dataForm:{
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
        dataRule:{
          goodsName: [
            { required: true, message: '商品名称不能为空', trigger: 'blur' }
          ],
          price: [
            { required: true, message: '请填写价格', trigger: 'blur' },
            { validator: validatePrice}
          ],
          purview:[
            { required: true, message: '权限不能为空', trigger: 'blur' }
          ],
          tradeid: [
            { validator: validateTrade,trigger: 'blur'  }
          ],
          cardtype:[
            { validator: validateCard,trigger: 'blur'  }
          ]
        }
      }
    },
    computed: {
      isRequired: function() {
        return this.dataForm.platform == `2`;
      }
    },
    mounted(){
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
        this.titleTxt="编辑"
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
      //提交表单
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/biz/goods/${!this.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'goodsId': this.id || undefined,
                'price':this.dataForm.price,
                'goodsName':this.dataForm.goodsName,
                'remark':this.dataForm.remark || undefined,
                'purview':this.dataForm.purview,
                'explain':this.dataForm.explain || undefined,
                'platform':this.dataForm.platform ,
                'cardtype':this.dataForm.cardtype || undefined,
                'tradeid':this.dataForm.tradeid || undefined,
                'sort':this.dataForm.sort

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
                if(data.message==undefined){
                  this.$message.error(data.msg)
                }else{
                  this.$message.error(data.message)
                }
              }
            })
          }
        })
      }

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
