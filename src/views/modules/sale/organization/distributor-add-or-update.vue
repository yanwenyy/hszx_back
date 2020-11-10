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
          <el-form-item label="上级机构属性">
            <el-select
              v-model="dataForm.pType"
              clearable
              placeholder="上级机构属性">
              <el-option v-for="item in sjList"
                         :label="item.label"
                         :value="item.value"
                         :key="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择城市运营中心">
            <el-select
              @change="getSale()"
              v-model="dataForm.ppid"
              clearable
              placeholder="所属运营中心">
              <el-option v-for="item in nameList"
                         :label="item.name"
                         :value="item.id"
                         :key="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属股东" v-if="dataForm.pType==2">
            <el-select
              @change="getSale()"
              v-model="dataForm.pid"
              clearable
              placeholder="所属股东">
              <el-option v-for="item in gdList"
                         :label="item.name"
                         :value="item.id"
                         :key="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属销售">
            <el-select
              :disabled="dataForm.ppid==''&&dataForm.pid==''"
              v-model="dataForm.salePersonId"
              clearable
              placeholder="所属销售">
              <el-option v-for="item in xsList"
                         :label="item.realname"
                         :value="item.uuid"
                         :key="item.uuid">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="经销商机构名称" prop="name">
            <el-input class="city-input" v-model="dataForm.name" clearable placeholder="请输入中心名称"></el-input>
          </el-form-item>
          <el-form-item label="机构负责人">
            <el-input class="city-input" v-model="dataForm.leader"></el-input>
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input class="city-input" v-model="dataForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="合同日期">
            <el-date-picker
              v-model="dataForm.releaseTime"
              type="daterange"
              range-separator="一"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item v-show="dataForm.id" label="添加时间">
            <el-input class="city-input" v-model="dataForm.createTime" disabled clearable></el-input>
          </el-form-item>
        </div>
      </div>
      <div class="city-view-group">
        <div class="city-view-title">分成设置</div>
        <div class="city-view-box">
          <el-form-item label="分成状态">
            <el-radio v-model="dataForm.ifShare" label="1">开启</el-radio>
            <el-radio v-model="dataForm.ifShare" label="0">关闭</el-radio>
          </el-form-item>
          <el-form-item label="是否扣税">
            <el-radio v-model="dataForm.ifTax" label="1">扣税</el-radio>
            <el-radio v-model="dataForm.ifTax" label="0">无需扣税</el-radio>
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
        xsList:[],
        sjList:[
          {
            label:'城市中心',
            value:'1'
          },
          {
            label:'股东',
            value:'2'
          },
        ],
        gdList:[],
        nameList:[],
        dataForm:{
          id:'',
          pType:'',
          pid:'',
          ppid:'',
          salePersonId:'',
          name:'',
          leader:'',
          phone:'',
          releaseTime:'',
          createTime:'',
          ifShare:'1',
          ifTax:'1',
        },
        dataRule:{
          name:[
            { required: true,trigger: 'blur' ,message: '经销商机构名称'}
          ],
        }
      }
    },
    activated(){
      this.dataForm={
        id:'',
        pType:'',
        pid:'',
        ppid:'',
        salePersonId:'',
        name:'',
        leader:'',
        phone:'',
        releaseTime:'',
        createTime:'',
        ifShare:'1',
        ifTax:'1',
      };
      //中心列表
      this.$http({
        url: this.$http.adornUrl('/biz/organization/centerListOfNoPaging'),
        method: 'GET',
      }).then(({data}) => {
        this.nameList = data.data
      });
      //股东列表
      this.$http({
        url: this.$http.adornUrl('/biz/organization/shareholderListOfNoPaging'),
        method: 'GET',
      }).then(({data}) => {
        this.gdList = data.data
      });



      this.dataForm.id=this.$route.query.id;
      //详情
      if( this.dataForm.id!=undefined) {
        this.$http({
          url: this.$http.adornUrl(`/biz/organization/infoAgent/${this.dataForm.id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          var datas=data.data;
          this.titleTxt="编辑";
          this.addHide=true;
          this.dataForm.pType=String(datas.pType);
          this.dataForm.pid=datas.pid;
          this.dataForm.ppid=datas.ppId;
          this.dataForm.salePersonId=String(datas.salePersonId||'');
          this.dataForm.name=datas.name;
          this.dataForm.leader=datas.leader;
          this.dataForm.phone=datas.phone;
          this.dataForm.releaseTime=[datas.contractStart||'',datas.contractEnd||''];
          this.dataForm.createTime=datas.createTime;
          this.dataForm.ifShare=String(datas.ifShare)||"1";
          this.dataForm.ifTax=String(datas.ifTax)||"1'";
          if(this.dataForm.pType=='1'){
            // //中心销售列表
            this.$http({
              url: this.$http.adornUrl('/biz/orgTbUser/centerUserListOfNoPaging'),
              method: 'GET',
              params: this.$http.adornParams({
                'cityCenterId':this.dataForm.ppid,
              })
            }).then(({data}) => {
              this.xsList = data.data
            });
          }else if(this.dataForm.pType=='2'){
            this.$http({
              url: this.$http.adornUrl('/biz/orgTbUser/centerUserListOfNoPaging'),
              method: 'GET',
              params: this.$http.adornParams({
                'shareholderId':this.dataForm.pid
              })
            }).then(({data}) => {
              this.xsList = data.data
            });
          }
        })
      }
    },
    methods:{
      //城市运营中心和所属股东选择
      getSale(){
        this.xsList =[];
        if(this.dataForm.pType=='1'){
          // //中心销售列表
          this.$http({
            url: this.$http.adornUrl('/biz/orgTbUser/centerUserListOfNoPaging'),
            method: 'GET',
            params: this.$http.adornParams({
              'cityCenterId':this.dataForm.ppid,
            })
          }).then(({data}) => {
            this.xsList = data.data
          });
        }else if(this.dataForm.pType=='2'){
          this.$http({
            url: this.$http.adornUrl('/biz/orgTbUser/centerUserListOfNoPaging'),
            method: 'GET',
            params: this.$http.adornParams({
              'shareholderId':this.dataForm.pid
            })
          }).then(({data}) => {
            this.xsList = data.data
          });
        }

      },
      //提交表单
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          var releaseStartTime='',releaseLastTime='';
          if(this.dataForm.releaseTime!=undefined&&this.dataForm.releaseTime!=""&&this.dataForm.releaseTime!=null&&this.dataForm.releaseTime.length!=0){
            releaseStartTime=this.dataForm.releaseTime[0]
            releaseLastTime=this.dataForm.releaseTime[1]
          }
            this.$http({
              url: this.$http.adornUrl(`/biz/organization/${!this.dataForm.id ? 'saveAgent' : 'updateAgent'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'pType': this.dataForm.pType,
                'pid':this.dataForm.pid,
                'ppId':this.dataForm.ppid,
                'salePersonId':this.dataForm.salePersonId,
                'name':this.dataForm.name,
                'leader':this.dataForm.leader,
                'phone':this.dataForm.phone,
                'ifShare':this.dataForm.ifShare || undefined,
                'ifTax':this.dataForm.ifTax,
                'contractStart': releaseStartTime,
                'contractEnd': releaseLastTime
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
