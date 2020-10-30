<template>
  <div class="mod-policy">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">{{titleTxt}}</h2>
    <el-form label-position="left" label-width="120px" :model="dataForm" :rules="dataRule" ref="dataForm">
      <el-form-item v-show="dataForm.id" label="ID" prop="id">
        <el-input class="city-input" v-model="dataForm.id" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="权益主体名称" prop="expertTitle">
        <el-input class="city-input" v-model="dataForm.name"></el-input>
        <div class="input-msg">使用权益的主体事务所/个人名称</div>
      </el-form-item>
      <el-form-item label="权益开始日期" prop="expertTitle">
        <el-date-picker
          v-model="dataForm.startTime"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="权益结束日期" prop="expertTitle">
        <el-date-picker
          v-model="dataForm.endTime"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="备注" prop="expertTitle">
        <el-input type="textarea" class="city-input" v-model="dataForm.remark"></el-input>
      </el-form-item>
      <el-form-item v-show="dataForm.id" label="创建日期" prop="expertTitle">
        <el-input class="city-input" v-model="dataForm.createTime" disabled clearable></el-input>
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
        djList:[],
        dataForm:{
          id:'',
          name:'',
          startTime:'',
          endTime:'',
          remark:'',
          createTime:''
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
        name:'',
        startTime:'',
        endTime:'',
        remark:'',
        createTime:''
      };
      this.dataForm.id=this.$route.query.id;
      //详情
      if( this.dataForm.id!=undefined) {
        this.$http({
          url: this.$http.adornUrl(`/info/${this.dataForm.id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          var datas=data.data;
          this.titleTxt="编辑";
          this.addHide=true;
          this.dataForm.name=datas.name;
          this.dataForm.startTime=datas.startTime;
          this.dataForm.endTime=datas.endTime;
          this.dataForm.remark=datas.remark;
          this.dataForm.createTime=datas.createTime;
        })
      }
    },
    methods:{
      //提交表单
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'name': this.dataForm.name,
                'startTime':this.dataForm.startTime,
                'endTime':this.dataForm.endTime,
                'remark':this.dataForm.remark
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
          }
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
