<template>
  <div class="mod-policy">
    <h2 style="border-bottom: 1px solid #ccc;padding-bottom: 20px;margin-bottom: 50px">查看</h2>
    <el-form label-position="left" label-width="120px" :model="dataForm"  ref="dataForm">
      <p>评论主体</p>
      <div style="border:1px solid #ccc;padding-left:50px;padding-top:10px;margin-bottom:30px;position: relative">
        <el-form-item style="margin:0 0 10px 0;color:#303133" label="模块"><el-input style="width:220px" disabled :value="getMoudel(dataForm.moudle)"></el-input></el-form-item>
        <el-form-item style="display:inline-block;margin: 5px 0 10px 0;color:#303133" label="主体ID"><el-input style="width:220px" disabled v-model="dataForm.moudleId"></el-input></el-form-item>
        <el-form-item label="标题"><div>{{dataForm.title}}</div></el-form-item>
      </div>
      <p>评论内容</p>
      <el-form-item label="评论ID" prop="id">
        <el-input v-model="dataForm.userId" :disabled="true" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="创建时间" prop="expertTitle">
        <el-input v-model="dataForm.careadateFormat" disabled clearable placeholder="请输入解读标题" style="width:500px"></el-input>
      </el-form-item>
      <el-form-item label="评论人" prop="expertTitle">
        <el-input v-model="dataForm.userName" disabled clearable placeholder="请输入解读标题" style="width:500px"></el-input>
      </el-form-item>
      <el-form-item label="评论人手机号" prop="expertTitle">
        <el-input v-model="dataForm.phone" disabled clearable placeholder="请输入解读标题" style="width:500px"></el-input>
      </el-form-item>
      <el-form-item label="属性" prop="expertTitle">
        <el-input v-model="dataForm.levelName" disabled clearable placeholder="请输入解读标题" style="width:500px"></el-input>
      </el-form-item>
      <el-form-item label="评论内容" prop="content">
        <div v-html="dataForm.content" style="border: 1px solid #ccc;padding:0 10px"></div>
      </el-form-item>
      <el-form-item style="text-align: center;">
        <el-button type="info" @click="closePage()">关闭</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import ElButton from "element-ui/packages/button/src/button";
  export default {
    inject:['removeTabHandle'],
    components: {
      ElButton
    },
    data(){
      return {
        id:parseInt(this.$route.query.id) || undefined,
        dataForm:{

        },
        moudelList:[
          {
            value:'1',
            label:'政策归集'
          },{
            value:'2',
            label:'相关解读'
          },{
            value:'3',
            label:'风险提示'
          },{
            value:'4',
            label:'税收筹划'
          },{
            value:'5',
            label:'解码图'
          },{
            value:'6',
            label:'新闻中心'
          },{
            value:'7',
            label:'精选好课'
          },{
            value:'8',
            label:'直播答疑'
          },{
            value:'9',
            label:'评论'
          }
        ]
      }
    },
    mounted(){
      //详情
      if( this.id!=undefined) {
        this.$http({
          url: this.$http.adornUrl(`/biz/trdiscuss/info/${this.id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.dataForm=data.data;
          console.log(this.dataForm.title)
        })
      }
    },
    methods:{
      //获取富文本内容
      editorContent(modelname,index,content){
        console.log(modelname)
        this.dataForm.content=content
      },
      closePage:function () {
        this.removeTabHandle(this.$store.state.common.mainTabsActiveName)
      },
      //获取模块名称
      getMoudel:function(val){
        var list=this.moudelList,i=0,len=list.length;
        for(;i<len;i++){
          if(list[i].value==val){
            return list[i].label;
          }
        }
      }
    }
  }
</script>
<style>
  .w-e-text,.w-e-text-container{
    min-height:400px !important;
    z-index: 1 !important;
  }
  .w-e-menu{
    z-index: 2 !important;
  }
</style>
