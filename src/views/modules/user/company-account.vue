<template>
  <div class="mod-policy-pack">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">账户管理</h2>
    <el-form>
      <el-form-item label="企业版本">
        <el-input v-model="dataForm.cardType=='1'?'个人版':dataForm.cardType=='2'?'企业版':dataForm.cardType=='3'?'集团版':'无版本'" :disabled="true" placeholder="企业名称"></el-input>
      </el-form-item>
      <el-form-item label="版本授权账号数">
        <el-input v-model="dataForm.personNumber" :disabled="true" placeholder="版本授权账号数"></el-input>
      </el-form-item>
    </el-form>
      <!--<div class="two-title">企业人员概况</div>-->
      <!--<el-table-->
        <!--:data="memberList"-->
        <!--border-->
        <!--v-loading="dataListLoading"-->
        <!--style="width: 100%;margin-bottom: 30px">-->
        <!--<el-table-column-->
          <!--prop="currentStaffNum"-->
          <!--header-align="center"-->
          <!--align="center"-->
          <!--label="授权人数">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--prop="adminNum"-->
          <!--header-align="center"-->
          <!--align="center"-->
          <!--label="管理员余位">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--prop="staffNum"-->
          <!--header-align="center"-->
          <!--align="center"-->
          <!--label="员工余位">-->
        <!--</el-table-column>-->
      <!--</el-table>-->
      <div class="two-title">
        企业管理层
        <el-button v-if="isAuth('biz:user:save')" type="warning" @click="addOrUpdateHandle(1)" >+ 添加管理员</el-button>
      </div>
      <el-table
        :data="manageList"
        border
        v-loading="dataListLoading"
        style="width: 100%;margin-bottom: 30px">
        <el-table-column
          type="index"
          header-align="center"
          align="center"
          label="序号">
        </el-table-column>

        <el-table-column
          prop="username"
          header-align="center"
          align="center"
          label="用户名">
        </el-table-column>
        <el-table-column
          prop="realname"
          header-align="center"
          align="center"
          label="真实姓名">
        </el-table-column>
        <el-table-column
          prop="phone"
          header-align="center"
          align="center"
          label="手机号码">
        </el-table-column>
        <el-table-column
          prop="positiotn"
          header-align="center"
          align="center"
          label="职务">
        </el-table-column>
        <el-table-column
          prop="trade"
          header-align="center"
          align="center"
          label="行业">
        </el-table-column>
        <el-table-column
          prop="joinTime"
          header-align="center"
          align="center"
          :formatter="commonDate.formatTime"
          label="加入企业时间">
        </el-table-column>
        <el-table-column
          fixed="right"
          header-align="center"
          align="center"
          width="150"
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="deleteHandle(scope.row.uuid,1)">删除</el-button>
            <el-button type="text" size="small"  @click="$router.push({ name: 'company-view',query:{id:scope.row.uuid,companyid:scope.row.companyid} })">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="two-title" v-if="manageList.length>0">
        企业员工层
        <el-button v-if="isAuth('biz:user:save')" type="warning" @click="addOrUpdateHandle(2)" >+ 添加员工</el-button>
      </div>
      <el-table  v-if="manageList.length>0"
        :data="staffList"
        border
        v-loading="dataListLoading"
        style="width: 100%;margin-bottom: 30px">
        <el-table-column
          type="index"
          header-align="center"
          align="center"
          label="序号">
        </el-table-column>

        <el-table-column
          prop="username"
          header-align="center"
          align="center"
          label="用户名">
        </el-table-column>
        <el-table-column
          prop="realname"
          header-align="center"
          align="center"
          label="真实姓名">
        </el-table-column>
        <el-table-column
          prop="phone"
          header-align="center"
          align="center"
          label="手机号码">
        </el-table-column>
        <el-table-column
          prop="positiotn"
          header-align="center"
          align="center"
          label="职务">
        </el-table-column>
        <el-table-column
          prop="trade"
          header-align="center"
          align="center"
          label="行业">
        </el-table-column>
        <el-table-column
          prop="bindingTime"
          header-align="center"
          align="center"
          :formatter="commonDate.formatTime"
          label="加入企业时间">
        </el-table-column>
        <el-table-column
          fixed="right"
          header-align="center"
          align="center"
          width="150"
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="deleteHandle(scope.row.uuid,2)">删除</el-button>
            <el-button type="text" size="small"  @click="$router.push({ name: 'company-view',query:{id:scope.row.uuid} })">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    <div style="text-align: center"><el-button type="info" @click="closePage()">关闭</el-button></div>
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getList"></add-or-update>
  </div>
</template>
<script>
  import AddOrUpdate from './company-account-add'
  export default {
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
        id:'',
        showPos:[
          {value:1, label:'首页'},
          {value:2, label:'评估页'},
        ],
        jumpLink:[
          {value:1, label:'不跳转'},
          {value:2, label:'H5'},
        ],
        dataForm: {
          cardType:'',
          personNumber:''
        },
        memberList:[],
        manageList: [],
        staffList:[],
        pageIndex: 1,
        pageSize: 30,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        addCode:1,//1刷新管理员,2刷新员工
        addPhone:'',//添加的手机号
      }
    },
    components: {
      AddOrUpdate
    },
    activated(){
      this.id=this.$route.query.id;
      this.dataForm.cardType=this.$route.query.cardType;
      // this.dataForm.personNumber=this.$route.query.personNumber||0;
      if( this.id!=undefined){
        this.$http({
          url: this.$http.adornUrl(`/biz/company/overview/${this.id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code == 200) {
            var datas=data.data;
            this.dataForm.personNumber=datas.personNumber;
            this.memberList.push(datas);
          }
        });
        this.getManageList();
        this.getStaffList();
      }

    },
    methods:{
      closePage:function () {
        this.removeTabHandle(this.$store.state.common.mainTabsActiveName)
      },
      // 获取管理员列表
      getManageList () {
        this.$http({
          url: this.$http.adornUrl('/biz/company/companyuserlist'),
          method: 'get',
          params: this.$http.adornParams({
            // 'pageNum': this.pageIndex,
            // 'pageSize': this.pageSize,
            'companyId': this.id,
            'companyRole': 1
          })
        }).then(({data}) => {
          if (data && data.code == 200) {
            this.manageList = data.data
          }
          this.dataListLoading = false
        })
      },
      // 获取员工列表
      getStaffList () {
        this.$http({
          url: this.$http.adornUrl('/biz/company/companyuserlist'),
          method: 'get',
          params: this.$http.adornParams({
            'pageNum': this.pageIndex,
            'pageSize': this.pageSize,
            'companyId': this.id,
            'companyRole': 2
          })
        }).then(({data}) => {
          if (data && data.code == 200) {
            this.staffList = data.data
          }
          this.dataListLoading = false
        })
      },
      // 删除
      deleteHandle (id,code) {
        this.addCode=code;
        this.$confirm(`确定对[id=${id}]进行[删除]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl(`/biz/company/untiestaffuser`),
            method: 'GET',
            params: this.$http.adornParams({
              'companyId': this.id,
              'uuid':id
            })
          }).then(({data}) => {
            if (data && data.code == 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  if(this.addCode==1){
                    this.getManageList();
                  }else{
                    this.getStaffList();
                  }
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true;
        this.addCode=id;
        this.$http({
          url: this.$http.adornUrl(`/biz/company/idleseat`),
          method: 'get',
          params: this.$http.adornParams({
              'companyId': this.id,
              'companyRole': this.addCode
          })
        }).then(({data}) => {
          if (data && data.code == 200) {
            console.log(data);
            this.$prompt('请输入手机号', '新增企业用户', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              inputPattern: /^1[3456789]\d{9}$/,
              inputErrorMessage: '手机号格式不正确'
            }).then(({ value }) => {
              this.$http({
                url: this.$http.adornUrl(`/biz/company/searchUser`),
                method: 'POST',
                params: this.$http.adornParams({
                  phone: value
                })
              }).then(({data}) => {
                if (data && data.code == 200) {
                  var datas=data.data;
                  if(datas!=null&&datas!=''){//库里有用户
                    if(datas.companyid){//企业用户
                      this.$confirm(`
                           <div>手机号码“${value}”已经是企业用户</div>
                           <div>真实姓名： ${datas.realname||"未填写"}</div>
                           <div>企业名称： ${datas.companyname}</div>
                           <div>会员状态：  ${datas.vaildlasttime>new Date().getTime()?'有效':'过期'}</div>
                           <div>用户角色：  ${this.addCode==1?'管理层':'员工层'}</div>
                        `, '提示', {
                        confirmButtonText: '解绑并添加至当前企业',
                        dangerouslyUseHTMLString: true
                      }).then(() => {
                        if(datas.companyid==this.id){//已经是该企业用户
                          this.$alert(`
                           <div>手机号码“${value}”已在当前企业，不可重复添加</div>
                           <div>真实姓名： ${datas.realname||"未填写"}</div>
                           <div>企业名称： ${datas.companyname}</div>
                           <div>用户角色：  ${this.addCode==1?'管理层':'员工层'}</div>
                        `,  {
                            dangerouslyUseHTMLString: true
                          });
                        }else{
                          if(datas.role==0){//管理员,不可解绑
                            this.$alert(`
                           <div>手机号码“${value}”为其他企业管理员，不可添加</div>
                           <div>真实姓名： ${datas.realname||"未填写"}</div>
                           <div>企业名称： ${datas.companyname}</div>
                           <div>会员状态：  ${this.addCode==1?'管理层':'员工层'}</div>
                        `,  {
                              dangerouslyUseHTMLString: true
                            });
                          }else{//员工,可解绑
                            this.$http({
                              url: this.$http.adornUrl(`/biz/company/untiestaffuser`),
                              method: 'get',
                              params: this.$http.adornParams({
                                'companyId': datas.companyid,
                                'uuid':datas.uuid
                              })
                            }).then(({data}) => {
                              if (data && data.code == 200) {
                                this.$nextTick(() => {
                                  this.$refs.addOrUpdate.init(this.id,this.addCode,value,datas)
                                })
                              } else {
                                this.$message.error(data.msg)
                              }
                            })
                          }
                        }
                      })
                    }else{//普通用户
                      this.$nextTick(() => {
                        this.$refs.addOrUpdate.init(this.id,this.addCode,value,datas)
                      })
                    }
                  }else{//库里没有用户
                    this.$nextTick(() => {
                      this.$refs.addOrUpdate.init(this.id,this.addCode,value)
                    })
                  }

                } else {
                  this.$message.error(data.msg)
                }
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '取消输入'
              });
            });
          } else {
            this.$message.error(data.msg)
          }
        })
        // this.$nextTick(() => {
        //   this.$refs.addOrUpdate.init()
        // })
      },
      //刷新列表
      getList (){
        if(this.addCode==1){
          this.getManageList();
        }else{
          this.getStaffList();
        }
      }
    }
  }
</script>
<style scoped>
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
  >>> input[type="text"]{
    width: 400px!important;
  }
  >>> input[placeholder="选择日期"]{
    width: 200px!important;
  }
  .two-title{
    font-size: 24px;
    margin-bottom: 20px;
    font-weight: bold;
  }
  .date-line{
    margin-right: 20px;
  }
</style>
