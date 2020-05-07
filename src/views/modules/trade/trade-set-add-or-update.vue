<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" label-position="right" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="110px">
      <el-form-item label="行业名称" prop="tradeName">
        <el-input v-model="dataForm.tradeName"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input type="number" v-model="dataForm.sort" style="width: 500px"></el-input>
        <p style="color: #ccc;padding: 0;margin: 0;">请填写数字，数字越大越靠前，该排序决定小程序行业列表及售卖行业的排序</p>
      </el-form-item>
      <el-form-item label="icon" prop="tradeIcon">
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
        <el-input type="text"  v-model="dataForm.tradeIcon" style="padding: 0;margin: 0;height: 0;display: none"></el-input>
        <span style="color: #ccc">提示：格式支持JPG/PNG/GIF，尺寸：94*94；大小：50KB以内</span>
      </el-form-item>
      <el-form-item label="行业介绍" prop="introduce">
        <el-input v-model="dataForm.introduce"  type="textarea" maxlength="200" show-word-limit style="width:400px"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {

        visible: false,
        imageUrl: '',
        headers: {
          token: this.$cookie.get('token')
        },
        dataForm: {
          id: 0,
          tradeName: '',
          tradeIcon: '',
          sort:'',
          introduce:''
        },
        dataRule: {
          tradeName: [
            { required: true, message: '行业名称不能为空', trigger: 'blur' }
          ],
          tradeIcon: [
            { required: true, message: 'icon不能为空', trigger: 'blur' }
          ],
          sort: [
            { required: true, message: '排序不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/biz/trade2/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code == 200) {
                this.dataForm.tradeName = data.data.tradeName
                this.dataForm.tradeIcon = data.data.tradeIcon
                this.imageUrl="http://"+data.data.tradeIcon
                this.dataForm.sort=data.data.sort
                this.dataForm.introduce=data.data.introduce
              }
            })
          }else{
            this.imageUrl=''
          }
        })
      },
      UploadUrl:function(){
        return this.$http.adornUrl(`/sys/oss/upload`)
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.dataForm.tradeIcon=res.url
      },
      beforeAvatarUpload(file) {
        const isLt50KB = file.size / 1024 <50;
        if (!isLt50KB) {
          this.$message.error('上传图片大小不能超过 50KB!');
        }
        return isLt50KB;
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/biz/trade2/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'tradeId': this.dataForm.id || undefined,
                'tradeName': this.dataForm.tradeName,
                'tradeIcon': this.dataForm.tradeIcon,
                'sort':this.dataForm.sort,
                'introduce':this.dataForm.introduce || undefined
              })
            }).then(({data}) => {
              if (data && data.code == 200) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
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
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
</style>
