<template>
  <div class="mod-policy">
    <el-form label-position="left" label-width="120px">
      <div class="city-view-group">
        <div class="city-view-title">中心销售分成模板</div>
        <div class="city-view-box">
          <el-form-item label="直销" prop="fh">
            <div class="cp-list">
              <div class="inline-block" v-for="item in centerSaleList">
                <span>{{item.cardName}}:</span>
                <el-input disabled v-model="item.price" class="small-input"></el-input>
                <el-button type="primary" @click="eidtShare(item),editName='updatePriceCenterSale'">修改</el-button>
              </div>
            </div>
            <div class="input-msg">
              <div>注： 成交对象为“中心销售人员”；分成对象为成交者本人</div>
              <div>分成公式：分成金额  =  实际设定分成金额</div>
              <div>模板定义：该模板仅对身份管理中新增“城市中心销售”角色时，设置分成的默认值生效。管理员可根据实际情况调整。最终分成金额以身份管理中保存值为准。</div>
            </div>
          </el-form-item>
        </div>
      </div>
      <div class="city-view-group">
        <div class="city-view-title">股分成东</div>
        <div class="city-view-box">
          <el-form-item label="直销分成模板" prop="fh">
            <div class="cp-list">
              <div class="inline-block" v-for="item in shareHolderListZX">
                <span>{{item.cardName}}:</span>
                <el-input disabled v-model="item.price" class="small-input"></el-input>
                <el-button type="primary" @click="eidtShare(item),editName='updatePriceShareOrg'">修改</el-button>
              </div>
            </div>
            <div class="input-msg">
              <div>分成关系： 成交对象为“股东机构人员”；分成对象为成交者所在的“股东机构”</div>
              <div>分成公式：分成金额  =  实际设定分成金额</div>
              <div>模板定义：该模板仅对新增“股东机构”时，设置分成的默认值生效。管理员可根据实际情况调整。最终分成金额以股东机构中保存值为准。</div>
            </div>
          </el-form-item>
        </div>
        <div class="city-view-box">
          <el-form-item label="经销商提成" prop="fh">
            <div class="cp-list">
              <div class="inline-block" v-for="item in shareHolderListJXS">
                <span>{{item.cardName}}:</span>
                <el-input disabled v-model="item.price" class="small-input"></el-input>
              </div>
            </div>
            <div class="input-msg">
              <div>分成关系： 成交对象为“代理商机构人员”，分成对象为成交者所在机构关联的“股东机构”；若未关联“股东机构”则不计算该公式</div>
              <div>分成公式：分成金额  =  实际设定分成金额</div>
              <div class="orange">注意：该分成金额修改后，作用于所有“股东机构”且立即生效，请谨慎操作</div>
            </div>
          </el-form-item>
        </div>
        <div class="city-view-box">
          <el-form-item label="股东池（基础分红）" prop="fh">
            <div class="cp-list">
              <div class="inline-block" v-for="item in shareHolderListGDC">
                <span>{{item.cardName}}:</span>
                <el-input disabled v-model="item.price" class="small-input"></el-input>
              </div>
            </div>
            <div class="input-msg">
              <div>分成关系： 成交对象为“股东机构人员”，分成对象为成交者所关联的“城市运营中心”下所有的股东机构；</div>
              <div>分成公式</div>
              <div>1. 权益分红：以运营中心为单位计算；</div>
              <div>单笔基础分红*50%/股东人数=每个“股东机构”应分金额</div>
              <div>2. 贡献率分红： 以运营中心为单位计算；</div>
              <div>（股东直销+该股东下代理商直销总套数）/（全部股东直销+全部代理商直销）*股东池*50%=每个“股东机构”应分金额</div>
              <div>3. 机构统计</div>
              <div>当月加入城市运营中心，即可获得股东池分成</div>
              <div class="orange">注意：该分成金额修改后，作用于所有“股东机构”且立即生效，请谨慎操作</div>
            </div>
          </el-form-item>
        </div>
        <div class="city-view-box">
          <el-form-item label="股东池（裂变分红）" prop="fh">
            <div class="cp-list">
              <div class="inline-block" v-for="item in shareHolderListLB">
                <span>{{item.cardName}}:</span>
                <el-input disabled v-model="item.price" class="small-input"></el-input>
              </div>
            </div>
            <div class="input-msg">
              <div>分成关系： 成交对象为“代言人”，分成对象为成交者所关联的“城市运营中心”下所有的股东机构；</div>
              <div>分成公式：同上</div>
              <div class="orange">注意：该分成金额修改后，作用于所有“股东机构”且立即生效，请谨慎操作</div>
            </div>
          </el-form-item>
        </div>
      </div>
      <div class="city-view-group">
        <div class="city-view-title">经销商分成</div>
        <div class="city-view-box">
          <el-form-item label="直销" prop="fh">
            <div class="cp-list">
              <div class="inline-block" v-for="item in agencySaleList">
                <span>{{item.cardName}}:</span>
                <el-input disabled v-model="item.price" class="small-input"></el-input>
              </div>
            </div>
            <div class="input-msg">
              <div>分成关系： 成交对象为“经销商机构人员”；分成对象为成交者所在的“股东机构”</div>
              <div>分成公式：分成金额  =  实际设定分成金额</div>
              <div class="orange">注意：该分成金额修改后，作用于所有“股东机构”且立即生效，请谨慎操作</div>
            </div>
          </el-form-item>
        </div>
      </div>
      <div class="city-view-group">
        <div class="city-view-title">代言人分成</div>
        <div class="city-view-box">
          <el-form-item label="直销" prop="fh">
            <div class="cp-list">
              <div class="inline-block" v-for="item in spokesmanList">
                <span>{{item.cardName}}:</span>
                <el-input disabled v-model="item.price" class="small-input"></el-input>
              </div>
            </div>
            <div class="input-msg">
              <div>分成关系： 成交对象为“经销商机构人员”；分成对象为成交者所在的“股东机构”</div>
              <div>分成公式：分成金额  =  实际设定分成金额</div>
              <div class="orange">注意：该分成金额修改后，作用于所有“股东机构”且立即生效，请谨慎操作</div>
            </div>
          </el-form-item>
        </div>
      </div>
      <el-form-item class="close-btn">
        <el-button type="info" @click="closePage()">关闭</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="修改分成" :visible.sync="dialogFormVisible">
      <el-form :model="cardForm" :rules="dataRule" ref="cardForm">
        <el-form-item :label="cardForm.cardName" prop="price">
          <el-input class="city-input" v-model="cardForm.price"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="subEdit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { isInteger } from '@/utils/validate'
  export default {
    inject:['removeTabHandle'],
    data(){
      var validateInteger = (rule, value, callback) => {
        if (!isInteger(value)&&value!="") {
          callback(new Error('格式错误'))
        } else {
          callback()
        }
      }
      return {
        delFlagShow:false,
        headers: {
          token: this.$cookie.get('token')
        },
        dialogFormVisible:false,
        centerSaleList:[],
        shareHolderListZX:[],
        shareHolderListJXS:[],
        shareHolderListGDC:[],
        shareHolderListLB:[],
        agencySaleList:[],
        spokesmanList:[],
        cardForm:{},
        editName:'',
        dataRule:{
          price:[
            { validator: validateInteger, trigger: 'blur' }
          ],
        }
      }
    },
    mounted(){
      //中心销售直销回显
      this.$http({
        url: this.$http.adornUrl('/biz/card/splitTemplateForCenterSale'),
        method: 'GET',
      }).then(({data}) => {
        var datas=data.data;
        this.centerSaleList = datas;
      });
      //股东机构直销
      this.$http({
        url: this.$http.adornUrl('/biz/card/splitTemplateForShare'),
        method: 'GET',
      }).then(({data}) => {
        var datas=data.data;
        this.shareHolderListZX = datas;
      });
      //股东机构经销商
      this.$http({
        url: this.$http.adornUrl('/biz/card/splitTemplateForAgencyDivide'),
        method: 'GET',
      }).then(({data}) => {
        var datas=data.data;
        this.shareHolderListJXS = datas;
      });
      //股东机构股东池
      this.$http({
        url: this.$http.adornUrl('/biz/card/shareholderPoolBaseTemplate'),
        method: 'GET',
      }).then(({data}) => {
        var datas=data.data;
        this.shareHolderListGDC = datas;
      });
      //股东机构裂变
      this.$http({
        url: this.$http.adornUrl('/biz/card/shareholderPoolChangeTemplate'),
        method: 'GET',
      }).then(({data}) => {
        var datas=data.data;
        this.shareHolderListLB = datas;
      });
      //经销商
      this.$http({
        url: this.$http.adornUrl('/biz/card/agencySaleTemplate'),
        method: 'GET',
      }).then(({data}) => {
        var datas=data.data;
        this.agencySaleList = datas;
      });
      //代言人
      this.$http({
        url: this.$http.adornUrl('/biz/card/spokesmanSaleTemplate'),
        method: 'GET',
      }).then(({data}) => {
        var datas=data.data;
        this.spokesmanList = datas;
      });
    },
    methods:{
      //打开修改分成
      eidtShare(val){
        this.dialogFormVisible=true;
        this.cardForm=val;
      },
      //修改分成
      subEdit(){
        this.$refs['cardForm'].validate((valid) => {
          this.$http({
            url: this.$http.adornUrl(`/biz/card/${this.editName}`),
            method: 'GET',
            params: this.$http.adornParams({
              'cardId': this.cardForm.cardId,
              'price': this.cardForm.price,
            })
          }).then(({data}) => {
            if (data && data.code == 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.dialogFormVisible = false;
                }
              })

            } else {
              this.$message.error(data.msg)
            }
          })
        })
      }
    }
  }
</script>
<style>
  .city-view-title{
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .city-view-box{
    border:1px solid #ccc;
    border-radius: 4px;
    padding:20px;
    margin-bottom:30px;
    position: relative
  }
  .city-input{
    width: 80%;
  }
  .input-msg{
    font-size: 12px;
    color:#999;
    margin-top: 0;
  }
  .input-msg>div{
    line-height: 20px;
  }
  .small-input{
    width: 200px;
  }
  .close-btn{
    text-align: center;
    margin-top: 20px;
  }
  .inline-block{
    display: inline-block;
  }
  .cp-list>div{
    margin-bottom: 20px;
    margin-right: 20px;
  }
  .orange{
    color: orange;
  }
</style>
