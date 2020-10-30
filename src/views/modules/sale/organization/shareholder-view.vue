<template>
  <div class="mod-policy">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">查看</h2>
    <el-form label-position="left" label-width="120px" :model="dataFrom" ref="dataFrom">
      <div class="city-view-group">
        <div class="city-view-title">基础信息</div>
        <div class="city-view-box">
          <el-form-item label="ID">
            <el-input class="city-input" v-model="dataFrom.id" disabled></el-input>
          </el-form-item>
          <el-form-item label="城市运营中心">
            <el-input class="city-input" v-model="dataFrom.pIdName" disabled></el-input>
          </el-form-item>
          <el-form-item label="股东机构名称">
            <el-input class="city-input" v-model="dataFrom.name" disabled></el-input>
          </el-form-item>
          <el-form-item label="机构负责人">
            <el-input class="city-input" v-model="dataFrom.leader" disabled></el-input>
          </el-form-item>
          <el-form-item label="负责人电话">
            <el-input class="city-input" v-model="dataFrom.phone" disabled></el-input>
          </el-form-item>
          <el-form-item label="合同过期时间">
            <!--<span>{{dataFrom.contractStart+"至"+dataFrom.contractEnd}}</span>-->
          </el-form-item>
          <el-form-item label="添加时间">
            <el-input class="city-input" v-model="dataFrom.createTime" disabled clearable></el-input>
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
                <el-input disabled v-model="item.price" class="small-input"></el-input>
              </div>
            </div>
            <p class="input-msg">注释：请填写整数数字，如“500”</p>
          </el-form-item>
          <el-form-item label="分成状态">
            <el-radio disabled v-model="dataFrom.ifShare" label="1">开启</el-radio>
            <el-radio disabled v-model="dataFrom.ifShare" label="2">关闭</el-radio>
          </el-form-item>
          <el-form-item label="是否扣税">
            <el-radio disabled v-model="dataFrom.ifTax" label="1">扣税</el-radio>
            <el-radio disabled v-model="dataFrom.ifTax" label="2">无需扣税</el-radio>
          </el-form-item>
        </div>
      </div>
      <div class="city-view-group">
        <div class="city-view-title">股东小程序端人员 <el-button type="primary" @click="getLook(1,'股东小程序端人员')">查看全部人员</el-button></div>
        <div class="city-view-box">
          <el-form-item label="管理员">
            <el-input class="city-input" v-model="dataFrom.adminNum" disabled></el-input>
          </el-form-item>
          <el-form-item label="股东销售">
            <el-input class="city-input" v-model="dataFrom.shareholderNum" disabled></el-input>
          </el-form-item>
        </div>
      </div>
      <div class="city-view-group">
        <div class="city-view-title">中心后台管理人员</div>
        <el-table
          :data="adminList"
          border
          style="width: 100%;">
          <el-table-column
            prop="id"
            header-align="center"
            align="center"
            width="80"
            label="序号">
          </el-table-column>
          <el-table-column
            prop="userId"
            header-align="center"
            align="center"
            label="管理员ID">
          </el-table-column>
          <el-table-column
            prop="username"
            header-align="center"
            align="center"
            label="管理员真实姓名">
          </el-table-column>
          <el-table-column
            prop="createTime"
            header-align="center"
            align="center"
            label="设置时间">
          </el-table-column>
        </el-table>
      </div>
      <el-form-item class="close-btn">
        <el-button type="info" @click="closePage()">关闭</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-table
        v-show="dialogType==1"
        :data="dataList"
        border
        style="width: 100%;">
        <el-table-column
          prop="id"
          header-align="center"
          align="center"
          width="80"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="id"
          header-align="center"
          align="center"
          width="80"
          label="人员角色">
        </el-table-column>
        <el-table-column
          prop="title"
          header-align="center"
          align="center"
          label="用户ID">
        </el-table-column>
        <el-table-column
          prop="fileNum"
          header-align="center"
          align="center"
          label="真实姓名">
        </el-table-column>
        <el-table-column
          prop="fileNum"
          header-align="center"
          align="center"
          label="手机号">
        </el-table-column>
        <el-table-column
          prop="fileNum"
          header-align="center"
          align="center"
          label="设置时间">
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data(){
      return {
        headers: {
          token: this.$cookie.get('token')
        },
        dataList:[],
        dialogTitle:'',
        dialogFormVisible:false,
        dialogType:1,
        id:'',
        dataFrom:{
          id:'',
          pIdName:'',
          name:'',
          leader:'',
          phone:'',
          contractStart:'',
          contractEnd:'',
          createTime:'',
          ifShare:'',
          ifTax:'',
          adminNum:'',
          shareholderNum:'',
        },
        cardAccountList:[],
        adminList:[]
      }
    },
    mounted(){
      this.dataFrom.id=this.$route.query.id;
      var that=this;
      //详情
      if( this.dataFrom.id!=undefined) {
        this.$http({
          url: this.$http.adornUrl(`/biz/organization/infoShareholder/${this.dataFrom.id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          var datas=data.data;
          that.dataFrom.pIdName=datas.pIdName||'';
          that.dataFrom.name=datas.name||'';
          that.dataFrom.leader=datas.leader||'';
          that.dataFrom.phone=datas.phone||'';
          that.dataFrom.contractStart=datas.contractStart||'';
          that.dataFrom.contractEnd=datas.contractEnd||'';
          that.dataFrom.createTime=datas.createTime||'';
          that.dataFrom.ifShare=datas.ifShare||'';
          that.dataFrom.ifTax=datas.ifTax||'';
          that.dataFrom.adminNum=datas.adminNum||'';
          that.dataFrom.shareholderNum=datas.shareholderNum||'';
          that.adminList=datas.adminList||[];
          that.cardAccountList=datas.cardAccountList||[];
        })
      }
    },
    methods:{
      closePage:function () {
        this.removeTabHandle(this.$store.state.common.mainTabsActiveName)
      },
      getLook(val,title){
        this.dialogFormVisible=true;
        this.dialogType=val;
        this.dialogTitle=title;
      }
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
  .input-msg{
    font-size: 12px;
    color:#999;
    margin-top: 0;
  }
  .small-input{
    width: 200px;
  }
  .close-btn{
    text-align: center;
    margin-top: 20px;
  }
</style>
