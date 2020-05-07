<template>
  <div class="mod-policy-pack">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">查看</h2>
    <el-form label-position="right" label-width="100px" :model="dataForm" ref="dataForm">
      <div style="border: 1px solid #ccc;padding-left: 20px">
        <p style="border-bottom: 1px solid #ccc;margin-left:-20px;text-indent:1em;padding-bottom:10px">问题详情</p>
        <el-form-item label="用户姓名">
          <el-input v-model="dataForm.thirdUserName" :disabled="true" style="width:300px"></el-input>
          <label style="margin-left: 20px;width: 100px">问题涉及行业</label>
          <el-input v-model="dataForm.trade" :disabled="true" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="用户ID">
          <el-input v-model="dataForm.phoneNum" :disabled="true" style="width:300px"></el-input>
          <label style="margin-left: 20px;width: 84px;display: inline-block">税种</label>
          <el-input v-model="dataForm.tax" :disabled="true" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="采纳状态">
          <el-input v-model="dataForm.status" :disabled="true" style="width:300px"></el-input>
          <label style="margin-left: 20px;width: 100px">问题发布时间</label>
          <el-input v-model="dataForm.date" :disabled="true" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="问题内容">
          <el-input type="textarea" v-model="dataForm.content" :disabled="true" style="width:75%"></el-input>
        </el-form-item>
        <el-form-item label="问题图片">
          <div v-for="(picList,index) in dataForm.picList" >
            <el-popover
              placement="right"
              title=""
              trigger="hover">
              <!--正式-->
              <!--<img :src="'https://api.jieshuibao.com/showImg/question/'+picList.url" style="max-width:500px;max-height: 500px"/>
              <img slot="reference" :src="'https://api.jieshuibao.com/showImg/question/'+picList.url" :alt="picList.url" style="max-height: 50px;max-width: 130px">-->
              <!--测试-->
              <img :src="'http://test.jieshuibao.com//jsb_webserver/showImg/question/'+picList.url" style="max-width:500px;max-height: 500px"/>
              <img slot="reference" :src="'http://test.jieshuibao.com//jsb_webserver/showImg/question/'+picList.url" :alt="picList.url" style="max-height: 50px;max-width: 130px">
            </el-popover>
          </div>
        </el-form-item>
        <el-form-item label="显示状态">
          <el-input :value="dataForm.delFlag==0?'显示':'隐藏'" :disabled="true" style="width:300px"></el-input>
        </el-form-item>
      </div>
      <div style="border: 1px solid #ccc;padding-left: 20px;margin-top: 20px">
        <p style="border-bottom: 1px solid #ccc;margin-left:-20px;text-indent:1em;padding-bottom:10px">回答详情</p>
        <el-form-item label="更新时间">
          <el-table
            :data="dataList"
            border
            :header-cell-style="{background: 'rgb(21, 161, 147)',color:'#fff'}"
            :row-style="{height:'36px',padding:'5px 0'}"
            :cell-style="{padding:'5px 0'}">
            <el-table-column
              header-align="center"
              align="center"
              label=" ">
              <template slot-scope="scope"><span>回答{{scope.$index+(pageIndex - 1) * pageSize + 1}} </span></template>
            </el-table-column>
            <el-table-column
              prop="content"
              header-align="center"
              align="center"
              label="回答内容">
            </el-table-column>
            <el-table-column
              prop="status"
              header-align="center"
              align="center"
              label="采纳状态">
              <template slot-scope="scope"><span>{{getAnwStatus(scope.row.status)}} </span></template>
            </el-table-column>
            <el-table-column
              prop="date"
              header-align="center"
              align="center"
              :formatter="formatTime"
              label="回答日期">
            </el-table-column>
            <el-table-column
            prop="counselorname"
            header-align="center"
            align="center"
            label="咨询师姓名">
          </el-table-column>
            <el-table-column
              prop="phone"
              header-align="center"
              align="center"
              label="手机号">
            </el-table-column>
            <el-table-column
              prop="delFlag"
              header-align="center"
              align="center"
              label="显示状态">
              <template slot-scope="scope"><span>{{scope.row.delFlag==0?'显示':'隐藏'}} </span></template>
            </el-table-column>
            <el-table-column
              prop="ancontent"
              header-align="center"
              align="center"
              label="被纠错">
              <template slot-scope="scope"><span>{{scope.row.status==6?scope.row.ancontent:''}} </span></template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </div>
      <el-form-item style="text-align: center;">
        <el-button type="info" @click="closePage()">关闭</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    inject:['removeTabHandle'],
    data(){
      return {
        pageIndex:1,
        pageSize:5,
        dataList:[],
        dataForm:{
          thirdUserName:'',
          statusName:'',
          phoneNum:'',
          trade:'',
          tax:'',
          date:'',
          content:'',
          delFlag:'',
          id:this.$route.query.id || undefined,
          picList:[]
        },


      }
    },
    mounted(){
      if( this.dataForm.id!=undefined){
        this.$http({
          url: this.$http.adornUrl(`/biz/question/getById/${this.dataForm.id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.dataForm.thirdUserName=data.data.data.thirdUserName
          this.dataForm.trade=data.data.data.trade
          this.dataForm.phoneNum=data.data.data.phoneNum
          this.dataForm.tax=data.data.data.tax
          this.dataForm.status=this.getStatus(data.data.data.status)
          this.dataForm.date=this.commonDate.formatTime("","",parseInt(data.data.data.date))
          this.dataForm.content=data.data.data.content
          this.dataForm.delFlag=data.data.data.delFlag
          if(data.data.data.picList!=null){
            if(data.data.data.picList.length!=0){
              for(var i=0;i<data.data.data.picList.length;i++){
                this.dataForm.picList.push({
                  url:data.data.data.picList[i]
                })
              }
            }
          }
          this.dataList=data.data.answers

         /* this.dataForm.policyDate=data.data.policyDate
          this.dataForm.statusName=data.data.statusName*/

        })
      }
    },
    methods:{
      formatTime(row){
        return this.commonDate.formatTime("","",parseInt(row.date))
      },
      getStatus(key) {
        let statusTxt = '';
        switch (key) {
          case 1:statusTxt = "无答案";break
          case 2:statusTxt = "未采纳答案";break
          case 3:statusTxt = "已采纳并公开";break
          case 4:statusTxt = "已采纳不公开";break
          case 5:statusTxt = "未采纳平分";break
          case 6:statusTxt = "未回答退回";break
          case 7:statusTxt = "数据异常";break
          case 8:statusTxt = "退款异常";break
          case 9:statusTxt = "已纠错";break
        }
        return statusTxt
      },
      getAnwStatus(key) {
        let statusTxt = '';
        switch (key) {
          case 0:statusTxt = "无答案";break
          case 1:statusTxt = "未采纳";break
          case 2:statusTxt = "已采纳";break
          case 3:statusTxt = "被举报";break
          case 4:statusTxt = "举报通过";break
          case 5:statusTxt = "举报不通过";break
          case 6:statusTxt = "已纠错";break
          case 7:statusTxt = "无需纠错";break
        }
        return statusTxt
      },
      closePage:function () {
        this.removeTabHandle(this.$store.state.common.mainTabsActiveName)
      }
    }
  }
</script>
