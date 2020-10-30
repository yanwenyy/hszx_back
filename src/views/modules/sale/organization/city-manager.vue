<template>
  <el-dialog
    title="设置管理员"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <div>搜索并添加管理员</div>
      <div class="notice">提示：若输入后无匹配结果，可能是还没有添加该管理员，您可先去“系统管理-管理员列表”中新增</div>
      <div class="search-list">
        <el-input class="search-input" v-model="dataForm.userName" placeholder="请输入您要添加的管理员姓名"></el-input>
        <el-button type="primary" @click="getDataList()">搜索</el-button>
      </div>
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        style="width: 100%;">
        <el-table-column
          prop="id"
          header-align="center"
          align="center"
          width="80"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="title"
          header-align="center"
          align="center"
          label="管理员姓名">
        </el-table-column>
        <el-table-column
          prop="fileNum"
          header-align="center"
          align="center"
          label="管理员ID">
        </el-table-column>
        <el-table-column
          fixed="right"
          header-align="center"
          align="center"
          width="200"
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" v-if="isAuth('biz:trpolicyoriginal:delete')" @click="deleteHandle(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { isEmail, isMobile } from '@/utils/validate'
  import { treeDataTranslate } from '@/utils'
  export default {
    data () {
      return {
        visible: false,
        roleList: [],
        dataList: [],
        dataForm: {
          id: 0,
          userName: '',
          password: '',
          comfirmPassword: '',
          salt: '',
          email: '',
          mobile: '',
          roleIdList: [],
          status: 1,
          /*identity:'',*/
          /*companyId: 1,
          companyName: ''*/
        }
      }
    },
    mounted () {

    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.$http({
          url: this.$http.adornUrl('/sys/role/select'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          var dataList=[];
          for( var i=0;i<data.list.length;i++){
            dataList.push(data.list[i]);
          }
          this.roleList = data && data.code === 0 ?dataList : []
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        }).then(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/sys/user/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.userName = data.user.username
                this.dataForm.salt = data.user.salt
                this.dataForm.email = data.user.email
                this.dataForm.mobile = data.user.mobile
                this.dataForm.roleIdList = data.user.roleIdList
                this.dataForm.status = data.user.status
                /*this.dataForm.identity = data.user.identity*/
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
              url: this.$http.adornUrl(`/sys/user/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'userId': this.dataForm.id || undefined,
                'username': this.dataForm.userName,
                'password': this.dataForm.password,
                'salt': this.dataForm.salt,
                'email': this.dataForm.email,
                'mobile': this.dataForm.mobile,
                'status': this.dataForm.status,
                'roleIdList': this.dataForm.roleIdList/*,
                'identity':this.dataForm.identity*/
                /*'companyId': this.dataForm.companyId*/
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
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
      // 删除
      deleteHandle (id,status) {
        var policyId = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        });
        this.$confirm(`您确定要删除${policyId.length > 1 ? '[id=' + policyId.join(',') + ']':'该'}政策原文吗？`, ``, {
          confirmButtonText: `确定`,
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/biz/trpolicyoriginal/delete'),
            method: 'post',
            data: this.$http.adornData(policyId,false)
          }).then(({data}) => {
            if (data && data.code == 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              if (data.message == undefined) {
                this.$message.error(data.msg)
              } else {
                this.$message.error(data.message)
              }
            }
          })
        })
      },
    }
  }
</script>
<style>
  .notice{
    font-size: 12px;
    color:#999;
    margin-bottom: 20px;
  }
  .search-input{
    width: 60%;
  }
  .search-list{
    margin-bottom: 20px;
  }
</style>
