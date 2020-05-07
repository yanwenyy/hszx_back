<template>
  <div class="mod-policy-pack">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">查看</h2>
    <el-form label-position="left" label-width="100px" :model="dataForm" ref="dataForm">
      <el-form-item label="广告图" prop="imgUrl">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
      </el-form-item>
      <el-form-item label="广告名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="请输入广告名称" :disabled="true" style="width:500px"></el-input>
      </el-form-item>
      <el-form-item label="展示平台" prop="showPlatform">
        <el-select v-model="dataForm.showPlatform" disabled placeholder="请选择展示平台">
          <el-option
            v-for="item in showPla"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="展示页面" prop="showPlace">
        <el-select v-model="dataForm.showPlace" disabled placeholder="请选择展示页面">
          <el-option
            v-for="item in showPos"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model="dataForm.sort" style="width:200px" :disabled="true" type="number" placeholder="请输入排序" ></el-input>
      </el-form-item>
      <el-form-item label="跳转类型" prop="jumpType">
        <el-select v-model="dataForm.jumpType" disabled placeholder="请选择跳转类型"  @change="getJumpType($event)">
          <el-option
            v-for="item in jumpLink"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="跳转链接"  prop="jumpUrl">
        <el-input v-model="dataForm.jumpUrl" :disabled="true" style="width:500px"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="showFlag">
        <el-input :value="dataForm.showFlag != '1' ? '显示': '隐藏'"  :disabled="true" style="width:500px"></el-input>
      </el-form-item>
      <el-form-item label="时间" prop="createTime">
        <el-input  :disabled="true" v-model="dataForm.createTime" style="width:500px"></el-input>
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
      let validateJumpUrl = (rule, value, callback) => {
        // 当跳转链接为空值且为必填时，抛出错误，反之通过校验
        if (this.dataForm.jumpUrl === "" && this.isHaveTo) {
          callback(new Error("请输入跳转链接"));
        } else {
          callback();
        }
      };
      return {
        imageUrl: '',
        id:this.$route.query.id || undefined,
        showPos:[
          {value:1, label:'首页'},
          {value:2, label:'评估页'},
          {value:3, label:'我的报告-个人/员工'},
          {value:4, label:'我的报告-管理层'}
        ],
        showPla:[
          {value:2, label:'行业辅导'},
          {value:1, label:'新政辅导'}
        ],
        jumpLink:[
          {value:1, label:'不跳转'},
          {value:2, label:'H5'},
        ],
        dataForm:{
          imgUrl:'',
          name:'',
          showPlatform:'',
          showPlace:'',
          sort:'',
          jumpType:'',
          jumpUrl:'',
          showFlag:'',
          createTime:''
        }
      }
    },
    mounted(){
      if( this.id!=undefined){
        this.$http({
          url: this.$http.adornUrl(`/biz/banner/info/${this.id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.dataForm.imgUrl=data.data.imgUrl
          this.dataForm.name=data.data.name
          this.dataForm.showPlatform=data.data.showPlatform
          this.dataForm.showPlace=data.data.showPlace
          this.dataForm.sort=data.data.sort
          this.dataForm.jumpType=data.data.jumpType
          this.dataForm.jumpUrl=data.data.jumpUrl
          this.dataForm.showFlag=data.data.showFlag
          this.dataForm.createTime=this.commonDate.formatTime('','',data.data.createTime)
          this.imageUrl = 'http://'+data.data.imgUrl

        })
      }

    },
    methods:{
      closePage:function () {
        this.removeTabHandle(this.$store.state.common.mainTabsActiveName)
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
