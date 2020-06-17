<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" label-position="right" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="110px">
      <el-form-item label="关联模块" prop="module">
        <el-select
          clearable
          placeholder="关联模块" :disabled="disabled" v-model="dataForm.module">
          <el-option v-for="item in linkList"
                     :label="item.name"
                     :value="item.value"
                     :key="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="政策属性名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="政策属性"></el-input>
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
        disabled:false,
        visible: false,
        imageUrl: '',
        headers: {
          token: this.$cookie.get('token')
        },
        dataForm: {
          id: 0,
          name: '',
          module: '',
        },
        linkList:[{name:'风险提示',value:1},{name:'税收筹划方案',value:2},{name:'新闻中心',value:3}],
        dataRule: {
          name: [
            { required: true, message: '政策属性名称不能为空', trigger: 'blur' }
          ],
          module: [
            { required: true, message: '关联模块不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/biz/attribute/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code == 200) {
                this.disabled=true
                this.dataForm.name = data.data.name
                this.dataForm.module = parseInt(data.data.module)
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if(this.dataForm.name=='行业新闻'){
            this.$message.error('不能新增属性名字为 行业新闻 的属性')
          }
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/biz/attribute/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'name': this.dataForm.name,
                'module': this.dataForm.module,
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
