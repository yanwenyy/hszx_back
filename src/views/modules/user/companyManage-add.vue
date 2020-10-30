<template>
  <div class="mod-policy-pack">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">新增</h2>
    <el-form label-position="left" label-width="100px" :model="dataForm" :rules="dataRule" ref="dataForm">
      <div class="city-view-title">企业信息</div>
      <div class="city-view-box">
        <el-form-item label="企业名称:" prop="companyname">
          <el-input maxlength="20" v-model="dataForm.companyname"   placeholder="企业名称"></el-input>
        </el-form-item>
        <!--<el-form-item label="企业授权人数:" prop="companyname">-->
          <!--<el-input maxlength="20" v-model="dataForm.companyname"   placeholder="企业名称"></el-input>-->
        <!--</el-form-item>-->
      </div>
      <div class="city-view-title">分成渠道标记</div>
      <div class="city-view-box">
        <el-radio-group v-model="radio" class="radio-list" @change="getRadio">
          <el-radio :label="1">运营中心</el-radio>
          <el-radio :label="2">股东</el-radio>
          <el-radio :label="3">经销商</el-radio>
        </el-radio-group>
        <el-form-item  label="城市运营中心:">
          <el-select
            :disabled="!(radio==1||radio==2||radio==3)"
            v-model="dataForm.cityCenterId"
            clearable
            @change="zxChange"
            placeholder="城市运营中心">
            <el-option v-for="item in zxList"
                       :label="item.name"
                       :value="item.id"
                       :key="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item  label="股东机构:">
          <el-select
            :disabled="!(radio==2||radio==3)"
            v-model="dataForm.shareholderId"
            clearable
            @change="gdChange"
            placeholder="股东机构">
            <el-option v-for="item in gdList"
                       :label="item.name"
                       :value="item.id"
                       :key="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="经销商机构:">
          <el-select
            :disabled="!(radio==3)"
            v-model="dataForm.agencyId"
            clearable
            @change="jxsChange"
            placeholder="经销商机构">
            <el-option v-for="item in jxsList"
                       :label="item.name"
                       :value="item.id"
                       :key="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="销售:">
          <el-select
            :disabled="!(radio==1||radio==2||radio==3)"
            v-model="dataForm.inviteId"
            clearable
            placeholder="销售">
            <el-option v-for="item in xsList"
                       :label="item.realname"
                       :value="item.uuid"
                       :key="item.uuid">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <el-form-item style="text-align: center;">
        <el-button @click="visible = false">取消</el-button>
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
      return {
        id:this.$route.query.id,
        dataForm:{
          companyname: "",
          cityCenterId: "",
          shareholderId: "",
          agencyId: "",
          inviteId: "",
        },
        radio:1,
        dataRule:{
          companyname: [
            { required: true, message: '企业名称不能为空', trigger: 'blur' }
          ],
          trade: [
            { type: 'array', required: true, message: '请至少选择一个行业', trigger: 'change' }
          ]
        },
        zxList:[],//城市运营中心
        gdList:[],//股东机构
        jxsList:[],//经销商
        xsList:[]//销售
      }
    },
    components: {
      VDistpicker
    },
    mounted(){
      //中心列表
      this.$http({
        url: this.$http.adornUrl('/biz/company/organizations'),
        method: 'GET',
        params: this.$http.adornParams({
          'orgId':'',
          'type': "1",
        })
      }).then(({data}) => {
        this.zxList = data.data
      });
    },
    methods:{
      getRadio(){
        this.zxList=[];
        this.gdList=[];
        this.jxsList=[];
        this.xsList=[];
        this.dataForm.cityCenterId='';
        this.dataForm.shareholderId='';
        this.dataForm.agencyId='';
        this.dataForm.inviteId='';
        this.$http({
          url: this.$http.adornUrl('/biz/company/organizations'),
          method: 'GET',
          params: this.$http.adornParams({
            'orgId':'',
            'type': "1",
          })
        }).then(({data}) => {
          this.zxList = data.data
        });
      },
      //城市运营中心选择
      zxChange(){
        if(this.dataForm.cityCenterId!==''){
          if(this.radio=='1'){
            //销售列表
            this.$http({
              url: this.$http.adornUrl('/biz/company/organizationSales'),
              method: 'GET',
              params: this.$http.adornParams({
                'orgId':this.dataForm.cityCenterId,
                'type': "1",
              })
            }).then(({data}) => {
              this.xsList = data.data
            });
          }else{
            //股东机构列表
            this.$http({
              url: this.$http.adornUrl('/biz/company/organizations'),
              method: 'GET',
              params: this.$http.adornParams({
                'orgId':this.dataForm.cityCenterId,
                'type': "2",
              })
            }).then(({data}) => {
              this.gdList = data.data
            });
          }

        }
      },
      //股东选择
      gdChange(){
        if(this.dataForm.shareholderId!==''){
          if(this.radio=='2'){
            //销售列表
            this.$http({
              url: this.$http.adornUrl('/biz/company/organizationSales'),
              method: 'GET',
              params: this.$http.adornParams({
                'orgId':this.dataForm.shareholderId,
                'type': "2",
              })
            }).then(({data}) => {
              this.xsList = data.data
            });
          }else{
            //经销商列表
            this.$http({
              url: this.$http.adornUrl('/biz/company/organizations'),
              method: 'GET',
              params: this.$http.adornParams({
                'orgId':this.dataForm.shareholderId,
                'type': "3",
              })
            }).then(({data}) => {
              this.jxsList = data.data
            });
          }

        }
      },
      //经销商选择
      jxsChange(){
        if(this.dataForm.agencyId!==''){
          //销售列表
          this.$http({
            url: this.$http.adornUrl('/biz/company/organizationSales'),
            method: 'GET',
            params: this.$http.adornParams({
              'orgId':this.dataForm.agencyId,
              'type': "3",
            })
          }).then(({data}) => {
            this.xsList = data.data
          });
        }
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/biz/company/save`),
              method: 'post',
              data: this.$http.adornData({
                'companyname': this.dataForm.companyname,
                'cityCenterId': this.dataForm.cityCenterId,
                'shareholderId': this.dataForm.shareholderId,
                'agencyId': this.dataForm.agencyId,
                'inviteId': this.dataForm.inviteId,
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
  >>> input[placeholder="选择日期"]{
    width: 200px!important;
  }
  .two-title{
    font-size: 24px;
    margin-bottom: 20px;
    font-weight: bold;
  }
  .date-line{
    margin-right: 20px;
  }
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
  .radio-list{
    margin-bottom: 20px;
  }
</style>
