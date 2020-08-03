<template>
  <el-dialog
    :title="!dataForm.tagId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" label-position="right" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="110px">
      <el-form-item label="模块" prop="typeList" size="mini">
        <el-checkbox-group v-model="dataForm.typeList">
          <el-checkbox label="1" name="typeList" :disabled="eit">政策原文</el-checkbox>
          <el-checkbox label="2" name="typeList" :disabled="eit">政策条文</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="标签名称" prop="tagName">
        <el-input v-model="dataForm.tagName" placeholder=""></el-input>
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
        eit:false,
        dataForm: {
          tagId: 0,
          tagName: '',
          typeList:[]
        },
        dataRule: {
          tagName: [
            { required: true, message: '标签名称不能为空', trigger: 'blur' }
          ],
          typeList: [
            { required: true, message: '模块不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.tagId = id || 0
        this.visible = true
        if(this.dataForm.tagId==0){
          this.eit=false
        }
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.tagId) {
            this.$http({
              url: this.$http.adornUrl(`/biz/trtag/info/${this.dataForm.tagId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code == 200) {
                this.dataForm.tagName = data.data.tagName
                this.eit=true
                this.dataForm.typeList = new Array(data.data.type)
              }
            })
          }
        })
      },

      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/biz/trtag/${!this.dataForm.tagId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'tagId': this.dataForm.tagId || undefined,
                'tagName': this.dataForm.tagName,
                'typeList': this.dataForm.typeList,
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
