<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '编辑'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="企业ID" prop="companyid">
        <el-input v-model="dataForm.id" :disabled="true" placeholder="企业ID"></el-input>
      </el-form-item>
      <el-form-item label="企业名称" prop="companyname">
        <el-input v-model="dataForm.companyname"  placeholder="企业名称"></el-input>
      </el-form-item>
      <el-form-item label="企业版本*" prop="companyname">
        <el-input v-model="dataForm.cardType=='1'?'个人版':dataForm.cardType=='2'?'企业版':dataForm.cardType=='3'?'集团版':'无版本'" :disabled="true" placeholder="企业版本"></el-input>
      </el-form-item>
      <el-form-item label="版本授权账号数" prop="companyname">
        <el-input v-model="dataForm.personNumber" :disabled="true" placeholder="版本授权账号数"></el-input>
      </el-form-item>
      <el-form-item label="创建日期" prop="companyname">
        <el-input v-model="dataForm.createtime" :disabled="true" placeholder="创建日期"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import VDistpicker from 'v-distpicker'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: '',
          companyname: '',
          cardType: '',
          personNumber: '',
          createtime: '',
        },
        tradeList: [],
        companyscale:[],
        companynature:[],
        dataRule: {
          companyid: [
            { companyid: true, message: '企业id不能为空', trigger: 'blur' }
          ],
          companyname: [
            { companyname: true, message: '企业名称不能为空', trigger: 'blur' }
          ],
          companynature: [
            { companynature: true, message: '企业性质不能为空', trigger: 'blur' }
          ],
          companyscale: [
            { companyscale: true, message: '规模不能为空', trigger: 'blur' }
          ],
          province: [
            { province: true, message: '地区不能为空', trigger: 'blur' }
          ],
          city: [
            { city: true, message: '地区不能为空', trigger: 'blur' }
          ],
          trade: [
            { trade: true, message: '行业不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    components: {
      VDistpicker
    },
    mounted () {

    },
    methods: {
      init (id) {
        this.dataForm.id = id || ''
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/biz/company/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code == 200) {
                var datas=data.data;
                this.dataForm.companyname = datas.companyname;
                this.dataForm.cardType = datas.cardType;
                this.dataForm.personNumber = datas.personNumber;
                this.dataForm.createtime = datas.createtime;
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
              url: this.$http.adornUrl(`/biz/company/update`),
              method: 'post',
              data: this.$http.adornData({
                'uuid': this.dataForm.id,
                'companyname': this.dataForm.companyname,
                'cardType':this.dataForm.cardType
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
      },
    }
  }
</script>
