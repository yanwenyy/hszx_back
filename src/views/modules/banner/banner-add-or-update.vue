<template>
  <div class="mod-policy-pack">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">{{titleTxt}}</h2>
    <el-form label-position="left" label-width="100px" :model="dataForm" :rules="dataRule" ref="dataForm">
      <el-form-item label="广告图" prop="imgUrl">
        <el-upload
          class="avatar-uploader"
          :headers="headers"
          accept="image/gif,image/jpeg,image/jpg,image/png"
          :action="UploadUrl()"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-input type="text"  v-model="dataForm.imgUrl" style="padding: 0;margin: 0;height: 0;display: none"></el-input>
        <span style="color: #ccc">提示：格式支持JPG/PNG/GIF，尺寸：684*244；大小：100KB以内</span>
      </el-form-item>
      <el-form-item label="广告名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="请输入广告名称" style="width:500px"></el-input>
      </el-form-item>
      <el-form-item label="展示平台" prop="showPlatform">
        <el-select v-model="dataForm.showPlatform" :disabled="type" @change="platformPage($event)" placeholder="请选择展示平台">
          <el-option
            v-for="item in showPla"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="展示页面" prop="showPlace">
        <el-select v-model="dataForm.showPlace" placeholder="请选择展示页面">
          <el-option
            v-for="item in showPos"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model="dataForm.sort" style="width:200px" type="number" placeholder="请输入排序" ></el-input>
      </el-form-item>
      <el-form-item label="跳转类型" prop="jumpType">
        <el-select v-model="dataForm.jumpType" placeholder="请选择跳转类型"  @change="getJumpType($event)">
          <el-option
            v-for="item in jumpLink"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="跳转链接" prop="jumpUrl">
        <el-input v-model="dataForm.jumpUrl" :disabled="disabledStatus" :required="isHaveTo" placeholder="请输入跳转链接" style="width:500px"></el-input>
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
      let validateJumpUrl = (rule, value, callback) => {
        // 当跳转链接为空值且为必填时，抛出错误，反之通过校验
        if (this.dataForm.jumpUrl === "" && this.isHaveTo) {
          callback(new Error("跳转链接不能为空"));
        } else {
          callback();
        }
      };
      return {
        headers: {
          token: this.$cookie.get('token')
        },
        type:false,
        titleTxt:"新增",
        disabledStatus:true,
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
          jumpUrl:''
        },
        dataRule:{
          imgUrl:[
            { required: true, message: '请上传广告图', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '广告名称不能为空', trigger: 'blur' }
          ],
          showPlatform: [
            { required: true, message: '展示平台不能为空', trigger: 'blur' }
          ],
          showPlace: [
            { required: true, message: '展示位置不能为空', trigger: 'blur' }
          ],
          sort:[
            { required: true, message: '排序不能为空', trigger: 'blur' }
          ],
          jumpType: [
            { required: true, message: '跳转类型不能为空', trigger: 'blur' }
          ],
          jumpUrl: [
            { validator: validateJumpUrl,trigger: 'blur'  }
          ],
        }
      }
    },
    computed: {
      isHaveTo: function() {
        return this.dataForm.jumpType != `1`;
      }
    },
    mounted(){
      if( this.id!=undefined){
        this.titleTxt="编辑"
        this.$http({
          url: this.$http.adornUrl(`/biz/banner/info/${this.id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.type=true
          this.dataForm.imgUrl=data.data.imgUrl
          this.dataForm.name=data.data.name
          this.dataForm.showPlatform=data.data.showPlatform
          this.dataForm.showPlace=data.data.showPlace
          this.dataForm.sort=data.data.sort
          this.dataForm.jumpType=data.data.jumpType
          this.dataForm.jumpUrl=data.data.jumpUrl
          this.imageUrl = 'http://'+data.data.imgUrl
          if(this.dataForm.showPlatform==2){
            this.showPos=[{value:1, label:'首页'}]
            this.dataForm.showPlace=1
          }
        })
      }

    },
    methods:{
      closePage:function () {
        this.removeTabHandle(this.$store.state.common.mainTabsActiveName)
      },
      platformPage(event){
        if(event==2){
          this.showPos=[{value:1, label:'首页'}]
          this.dataForm.showPlace=1
        }else{
          this.showPos=[
            {value:1, label:'首页'},
            {value:2, label:'评估页'},
            {value:3, label:'我的报告-个人/员工'},
            {value:4, label:'我的报告-管理层'}
          ]
        }
      },
      getJumpType(event){
        if(event==1){
          this.disabledStatus=true
        }else{
          this.disabledStatus=false
        }
      },
      UploadUrl:function(){
        return this.$http.adornUrl(`/sys/oss/upload`)
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.dataForm.imgUrl=res.url
      },
      beforeAvatarUpload(file) {
        const isLt100KB = file.size / 1024 <100;
        if (!isLt100KB) {
          this.$message.error('上传图片大小不能超过 100KB!');
        }
        return isLt100KB;
      },
      //提交表单
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/biz/banner/${!this.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.id || undefined,
                'imgUrl':this.dataForm.imgUrl,
                'name':this.dataForm.name,
                'showPlatform':this.dataForm.showPlatform,
                'showPlace':this.dataForm.showPlace,
                'sort':this.dataForm.sort,
                'jumpType':this.dataForm.jumpType,
                'jumpUrl':this.dataForm.jumpUrl|| undefined,
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
