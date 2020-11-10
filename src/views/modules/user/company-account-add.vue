<template>
  <el-dialog
    :title="'新增'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="dataForm.phone" :disabled="true" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="dataForm.username" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item label="真实姓名" prop="realname" >
        <el-input v-model="dataForm.realname" placeholder="真实姓名"></el-input>
      </el-form-item>
      <el-form-item label="用户角色">
        <el-checkbox-group v-model="dataForm.role">
          <el-checkbox :label="1" disabled>管理层</el-checkbox>
          <el-checkbox :label="2" disabled>员工</el-checkbox>
        </el-checkbox-group>
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
        max: 2, // checkbox可选最大数量
        dataForm: {
          id: 0,
          phone: '',
          username: '',
          realname: '',
          province: '',
          city: '',
          trade: [],
          positiotn: '',
          role: [],
          roleNum:1,
        },
        tradeList: [],
        positiotnList:[],
        dataRule: {
          phone: [
            { required: true, message: '手机号不能为空', trigger: 'blur' }
          ],
          realname: [
            { required: true, message: '真实姓名不能为空', trigger: 'blur' }
          ],
          trade: [
            { type: 'array', required: true, message: '请至少选择一个行业', trigger: 'change' }
          ]
        }
      }
    },
    components: {
      VDistpicker
    },
    mounted () {
      // this.getTrade()
      this.getPosition()
    },
    methods: {
      init (id,role,phone,msg) {
        console.log(phone);
        console.log(msg);
        var list=[];
        list.push(role);
        if(msg){
          this.dataForm = msg;
          if(msg.province=="北京"||msg.province=="上海"||msg.province=="天津"||msg.province=="重庆"){
            this.dataForm.province = msg.province+"市";
            this.dataForm.city = msg.city+"城区";
          }else{
            this.dataForm.province = msg.province+"省";
            this.dataForm.city = msg.city+"市";
          }
          this.dataForm.trade=msg.trade?msg.trade.split(',').slice(1,msg.trade.length-1):[];
        }
        this.dataForm.id = id;
        this.dataForm.phone = phone || '';
        this.dataForm.role = list;
        this.dataForm.roleNum = Number(role);
        this.visible = true;
        this.$nextTick(() => {
          // this.$refs['dataForm'].resetFields()
          // if (this.dataForm.id) {
          //   this.$http({
          //     url: this.$http.adornUrl(`/biz/user/info/${this.dataForm.id}`),
          //     method: 'get',
          //     params: this.$http.adornParams()
          //   }).then(({data}) => {
          //     if (data && data.code == 200) {
          //       var datas=data.data;
          //       this.dataForm.companyid = datas.companyid;
          //       this.dataForm.companyname = datas.companyname;
          //       this.dataForm.uuid = datas.uuid;
          //       this.dataForm.phone = datas.phone;
          //       this.dataForm.username = datas.username;
          //       this.dataForm.realname = datas.realname;
          //       this.dataForm.trade = datas.trade?datas.trade.split(',').slice(1,datas.trade.length-1):[];
          //       this.dataForm.positiotn = datas.positiotn;
          //       if(datas.province=="北京"||datas.province=="上海"||datas.province=="天津"||datas.province=="重庆"){
          //         this.dataForm.province = datas.province+"市";
          //         this.dataForm.city = datas.city+"城区";
          //       }else{
          //         this.dataForm.province = datas.province+"省";
          //         this.dataForm.city = datas.city+"市";
          //       }
          //     }
          //   })
          // }
        })
      },

      // 表单提交
      dataFormSubmit () {
        if(this.dataForm.province=="北京市"||this.dataForm.province=="上海市"||this.dataForm.province=="天津市"||this.dataForm.province=="重庆市"){
          this.dataForm.province = this.dataForm.province.split("市")[0];
          this.dataForm.city = this.dataForm.city.split("城区")[0];
        }else{
          this.dataForm.province = this.dataForm.province.split("省")[0];
          this.dataForm.city = this.dataForm.city.split("市")[0];
        }
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/biz/company/addStaffUser`),
              method: 'post',
              data: this.$http.adornData({
                'companyid': this.dataForm.id,
                'phone': this.dataForm.phone,
                'username': this.dataForm.username,
                'realname': this.dataForm.realname,
                'province': this.dataForm.province,
                'city': this.dataForm.city,
                'positiotn': this.dataForm.positiotn,
                'companyRole': this.dataForm.roleNum,
                'trade': ","+this.dataForm.trade.join(",")+","
              })
            }).then(({data}) => {
              if (data && data.code == 200) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false;
                    this.$emit('refreshDataList');
                    this.dataForm.id=0;
                    this.dataForm.phone='';
                    this.dataForm.username='';
                    this.dataForm.realname='';
                    this.dataForm.province='';
                    this.dataForm.city='';
                    this.dataForm.trade=[];
                    this.dataForm.positiotn='';
                    this.dataForm.role=[];
                    this.dataForm.roleNum=1;
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
      tradeChange() {
        if(this.dataForm.trade.length>2){
          this.$message.error('最多选择两个行业');
          return false;
        }
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
