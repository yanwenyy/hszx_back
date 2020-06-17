<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '编辑'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="企业ID" prop="companyid">
        <el-input v-model="dataForm.companyid" :disabled="true" placeholder="企业ID"></el-input>
      </el-form-item>
      <el-form-item label="企业名称" prop="companyname">
        <el-input v-model="dataForm.companyname" :disabled="true" placeholder="企业名称"></el-input>
      </el-form-item>
      <el-form-item label="用户ID">
        <el-input v-model="dataForm.uuid" :disabled="true" placeholder="用户ID"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="dataForm.phone" :disabled="true" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="dataForm.username" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item label="真实姓名" >
        <el-input v-model="dataForm.realname" placeholder="真实姓名"></el-input>
      </el-form-item>
      <el-form-item label="地区">
        <v-distpicker hide-area :province="dataForm.province" :city="dataForm.city" @selected="onSelected"></v-distpicker>
      </el-form-item>
      <el-form-item label="行业">
        <el-checkbox-group v-model="dataForm.trade" :max="3">
          <el-checkbox v-for="item in tradeList" :label="item.tradeId" :key="item.tradeId">{{item.tradeName}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="职务">
        <el-select v-model="dataForm.positiotn" placeholder="职务">
          <el-option
            v-for="item in positiotnList"
            :key="item.uuid"
            :label="item.name"
            :value="item.uuid">
          </el-option>
        </el-select>
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
          id: 0,
          companyid: '',
          companyname: '',
          uuid: '',
          phone: '',
          username: '',
          realname: '',
          province: '',
          city:'',
          trade: [],
          positiotn: '',
        },
        tradeList: [],
        positiotnList:[],
        dataRule: {
          companyid: [
            { companyid: true, message: '企业id不能为空', trigger: 'blur' }
          ],
          companyname: [
            { companyname: true, message: '企业名称不能为空', trigger: 'blur' }
          ],
          phone: [
            { phone: true, message: '手机号不能为空', trigger: 'blur' }
          ],
          username: [
            { username: true, message: '用户名不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    components: {
      VDistpicker
    },
    mounted () {
      this.getTrade()
      this.getPosition()
    },
    methods: {
      init (id) {
        this.dataForm.id = id || ''
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/biz/user/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code == 200) {
                var datas=data.data;
                this.dataForm.companyid = datas.companyid;
                this.dataForm.companyname = datas.companyname;
                this.dataForm.uuid = datas.uuid;
                this.dataForm.phone = datas.phone;
                this.dataForm.username = datas.username;
                this.dataForm.realname = datas.realname;
                this.dataForm.trade = datas.trade?datas.trade.split(',').slice(1,datas.trade.length-1):[];
                this.dataForm.positiotn = datas.positiotn;
                if(datas.province=="北京"||datas.province=="上海"||datas.province=="天津"||datas.province=="重庆"){
                  this.dataForm.province = datas.province+"市";
                  this.dataForm.city = datas.city+"城区";
                }else if(datas.province!=null){
                  this.dataForm.province = datas.province+"省";
                  this.dataForm.city = datas.city+"市";
                }
              }
            })
          }
        })
      },

      // 表单提交
      dataFormSubmit () {
        if(this.dataForm.province=="北京市"||this.dataForm.province=="上海市"||this.dataForm.province=="天津市"||this.dataForm.province=="重庆市"){
          this.dataForm.province = this.dataForm.province.split("市")[0];
          if(this.dataForm.city!=""&&this.dataForm.city!=undefined){
            this.dataForm.city = this.dataForm.city.split("城区")[0];
          }
        }else if(this.dataForm.province!=""&&this.dataForm.city!=""){
          this.dataForm.province = this.dataForm.province.split("省")[0];
          this.dataForm.city = this.dataForm.city.split("市")[0];
        }
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/biz/user/update`),
              method: 'post',
              data: this.$http.adornData({
                'companyid': this.dataForm.companyid,
                'companyname': this.dataForm.companyname,
                'uuid': this.dataForm.id,
                'phone': this.dataForm.phone,
                'username': this.dataForm.username,
                'realname': this.dataForm.realname,
                'province': this.dataForm.province,
                'city': this.dataForm.city,
                'trade': ","+this.dataForm.trade.join(",")+",",
                'positiotn': this.dataForm.positiotn,
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
      // 行业选择
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.cities.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
      },
      // 获取行业
      getTrade () {
        this.$http({
          url: this.$http.adornUrl('/biz/trade/select'),
          method: 'get'
        }).then(({data}) => {
          if (data && data.code == 200) {
            var datas=data.data,i;
            for(i in datas){
              datas[i].tradeId=datas[i].tradeId.toString();
            }
            this.tradeList = datas;
          }
        })
      },
      // 获取职务
      getPosition () {
        this.$http({
          url: this.$http.adornUrl('/biz/syscode/select/?category=1'),
          method: 'get'
        }).then(({data}) => {
          if (data && data.code == 200) {
            this.positiotnList = data.data;
          }
        })
      },

      //城市选择
      onSelected (e) {
        this.dataForm.province=e.province.value;
        this.dataForm.city=e.city.value
      },


    }
  }
</script>
