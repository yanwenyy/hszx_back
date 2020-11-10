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
          <el-form-item label="选择城市运营中心" prop="pid">
            <el-select
              v-model="dataForm.pid"
              clearable
              @change="getSale(dataForm.pid)"
              placeholder="中心等级">
              <el-option v-for="item in gdList"
                         :label="item.name"
                         :value="item.id"
                         :key="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择中心销售" prop="salePersonId">
            <el-select
              v-model="dataForm.salePersonId"
              clearable
              placeholder="中心销售">
              <el-option v-for="item in xsList"
                         :label="item.realname"
                         :value="item.uuid"
                         :key="item.uuid">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="股东机构名称" prop="name">
            <el-input class="city-input" v-model="dataForm.name" clearable placeholder="股东机构名称"></el-input>
          </el-form-item>
          <el-form-item label="机构负责人">
            <el-input class="city-input" v-model="dataForm.leader"></el-input>
          </el-form-item>
          <el-form-item label="负责人电话">
            <el-input class="city-input" v-model="dataForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="合同过期时间">
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
          <el-form-item label="产品直销分成" prop="fh">
            <div class="cp-list">
              <div class="inline-block" v-for="item in cardAccountList">
                <span>{{item.cardName}}:</span>
                <el-input v-model="item.price" class="small-input"></el-input>
              </div>
            </div>
            <p class="input-msg">注释：请填写整数数字，如“500”</p>
          </el-form-item>
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
        gdList:[],
        xsList:[],
        cardAccountList:[
          {
            cardName:'A卡',
            cardId:'1',
            price:'',
          }
        ],
        dataForm:{
          id:'',
          pid:'',
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
          pid:[
            { required: true, trigger: 'blur' ,message: '城市运营中心不能为空'}
          ],
          salePersonId:[
            { required: true,trigger: 'blur' ,message: '中心销售不能为空'}
          ],
          name:[
            { required: true,trigger: 'blur' ,message: '股东机构名称不能为空'}
          ],
        }
      }
    },
    activated(){
      if(!this.dataForm.id){
        //产品直销回显
        this.$http({
          url: this.$http.adornUrl('/biz/card/splitTemplateForShare'),
          method: 'GET',
        }).then(({data}) => {
          var datas=data.data,i=0,len=datas.length;
          // for(;i<len;i++){
          //   datas[i].price=datas[i].shareholderSale;
          // }
          this.cardAccountList = datas;
          // console.log(this.cardAccountList)
        });
      }
      // this.cardAccountList=[];
      this.dataForm={
        id:'',
        pid:'',
        salePersonId:'',
        name:'',
        leader:'',
        phone:'',
        releaseTime:'',
        createTime:'',
        ifShare:'1',
        ifTax:'1',
      };
      //运营中心列表
      this.$http({
        url: this.$http.adornUrl('/biz/organization/centerListOfNoPaging'),
        method: 'GET',
      }).then(({data}) => {
        this.gdList = data.data;
      });

      this.dataForm.id=this.$route.query.id;
      //详情
      if( this.dataForm.id!=undefined) {
        this.$http({
          url: this.$http.adornUrl(`/biz/organization/infoShareholder/${this.dataForm.id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          var datas=data.data;
          this.titleTxt="编辑";
          this.addHide=true;
          this.cardAccountList=datas.cardAccountList?datas.cardAccountList:[];
          this.dataForm.pid=datas.ppId;
          this.dataForm.salePersonId=datas.salePersonId;
          this.dataForm.name=datas.name;
          this.dataForm.leader=datas.leader;
          this.dataForm.phone=datas.phone;
          this.dataForm.releaseTime=[datas.contractStart||'',datas.contractEnd||''];
          this.dataForm.createTime=datas.createTime;
          this.dataForm.ifShare=String(datas.ifShare)||"1";
          this.dataForm.ifTax=String(datas.ifTax)||"1'";
          this.getSale(this.dataForm.pid);
        })
      }
    },
    methods:{
      //获取中心销售
      getSale(id){
        this.dataForm.salePersonId='';
        this.xsList=[];
        if(id){
          //中心销售列表
          this.$http({
            url: this.$http.adornUrl('/biz/orgTbUser/centerUserListOfNoPaging'),
            method: 'GET',
            params: this.$http.adornParams({
              cityCenterId:id
            })
          }).then(({data}) => {
            this.xsList=data.data;
            this.xsList.unshift({
              realname:'无',
              uuid:null
            });
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
              url: this.$http.adornUrl(`/biz/organization/${!this.dataForm.id ? 'saveShareholder' : 'updateShareholder'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'ppId': this.dataForm.pid,
                'salePersonId': this.dataForm.salePersonId,
                'name': this.dataForm.name,
                'leader': this.dataForm.leader,
                'phone': this.dataForm.phone,
                // 'createTime': this.dataForm.createTime,
                'ifShare': this.dataForm.ifShare,
                'ifTax': this.dataForm.ifTax || undefined,
                'cardAccountList': this.cardAccountList,
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
