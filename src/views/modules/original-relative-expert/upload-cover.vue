<template>
  <el-dialog
    title="上传视频封面"
    :visible.sync="visible">
    <el-form label-position="right"  label-width="100px">
      <el-form-item label="图片">
        <el-upload
          class="avatar-uploader"
          :headers="headers"
          :action="UploadUrl()"
          :show-file-list="false"
          accept="image/gif,image/jpeg,image/jpg,image/png"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <p v-show="cover">链接地址：{{cover}}</p>
        <span style="color: #ccc">提示：格式支持JPG/PNG/GIF，大小：100KB以内</span>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeN">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        imageUrl: '',
        cover:'',
        headers: {
          token: this.$cookie.get('token')
        },

      }
    },
    methods: {
      closeN(){
        this.visible = false
        this.$emit('refreshData')
      },
      init (id) {
        this.visible = true
      },
      UploadUrl:function(){
        return this.$http.adornUrl(`/sys/oss/upload`)
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.cover=res.url
      },
      beforeAvatarUpload(file) {
        const isLt100KB = file.size / 1024 <100;
        if (!isLt100KB) {
          this.$message.error('上传图片大小不能超过 100KB!');
        }
        return isLt100KB;
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
    width: 270px;
    height: 153px;
    line-height: 153px;
    text-align: center;
  }
  .avatar {
    width: 270px;
    height: 153px;
    display: block;
  }
</style>
