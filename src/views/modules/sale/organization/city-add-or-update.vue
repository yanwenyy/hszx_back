<template>
  <div class="mod-policy">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">{{titleTxt}}</h2>
    <el-form label-position="left" label-width="120px" :model="dataForm" :rules="dataRule" ref="dataForm">
      <div class="city-view-group">
        <div class="city-view-title">基础信息</div>
        <div class="city-view-box">
          <el-form-item v-show="dataForm.id" label="ID" prop="id">
            <el-input class="city-input" v-model="dataForm.id" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="中心名称" prop="name">
            <el-input class="city-input" v-model="dataForm.name" clearable placeholder="请输入中心名称"></el-input>
          </el-form-item>
          <el-form-item label="等级" prop="expertTitle">
            <el-select clearable
                       v-model="dataForm.level"
                       placeholder="中心等级">
              <el-option v-for="item in djList"
                         :label="item.label"
                         :value="item.value"
                         :key="item.value">
              </el-option>
            </el-select>
            <p class="input-msg">等级说明：“总代”股东可发展数量为1；“1级”股东数量最多为9；“2级”股东数量最多为18；“3级”股东数量最多为27</p>
          </el-form-item>
          <el-form-item v-show="dataForm.id" label="添加时间" prop="expertTitle">
            <el-input class="city-input" v-model="dataForm.createTime" disabled clearable></el-input>
          </el-form-item>
        </div>
      </div>
      <div class="city-view-group">
        <div class="city-view-title">中心占股分红设置</div>
        <div class="city-view-box">
          <el-form-item label="中心占股分红基数*" prop="fh">
            <el-input v-model="dataForm.shareBase" class="small-input"></el-input> %
            <p class="input-msg">填写提示：请填写整数数字，如果无占股可填写0；例如：填写“10”，则在订单进行股东分红扣除计算时，中心分得10%，其余90%流入股东池进行分成</p>
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
        djList:[
          {
            label:'总代',
            value:0,
          },
          {
            label:'1级',
            value:1,
          },
          {
            label:'2级',
            value:2,
          },
          {
            label:'3级',
            value:3,
          },
          {
            label:'无',
            value:-1,
          }
        ],//等级列表
        dataForm:{
          id:'',
          name:'',
          level:'',
          shareBase:'',
          createTime:''
        },
        dataRule:{
          name: [
            { required: true, message: '中心名称', trigger: 'blur' }
          ],
          shareBase:[
            { validator: validateInteger, trigger: 'blur' }
          ],
        }
      }
    },
    activated(){
      this.dataForm.id=this.$route.query.id;
      //详情
      if( this.dataForm.id!=undefined) {
        this.$http({
          url: this.$http.adornUrl(`/biz/organization/infoCenter/${this.dataForm.id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          var datas=data.data;
          this.titleTxt="编辑";
          this.addHide=true;
          this.dataForm.name=datas.name;
          this.dataForm.level=datas.level;
          this.dataForm.shareBase=datas.shareBase;
          this.dataForm.createTime=datas.createTime
        })
      }
    },
    methods:{
      //提交表单
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
            this.$http({
              url: this.$http.adornUrl(`/biz/organization/${!this.dataForm.id ? 'saveCenter' : 'updateCenter'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'name': this.dataForm.name,
                'level':this.dataForm.level,
                'shareBase':this.dataForm.shareBase
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
  .small-input{
    width: 200px;
  }
  .city-input{
    width: 80%;
  }
  .input-msg{
    font-size: 12px;
    color:#999;
    margin-top: 0;
  }
</style>
