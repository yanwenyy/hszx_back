<template>
  <div>
    <script :id="id" type="text/plain" ></script>
  </div>
</template>

<script>

  export default {
    name: "UEditor",
    props: {
      id: {
        type: String
      },
      index: {
        type: Number
      },
      econtent:{
        type: String
      },
      modelname:{
        type: String
      },
      val:{
        type: Number
      },
      url:{
        type: String
      },
      contentUrl:{
        type: String
      }
    },
    data() {
      return {
        editor: null
      }
    },
    mounted() {
      //初始化UE
      const _this = this;

      this.editor = UE.delEditor(this.id);
      this.editor = UE.getEditor(this.id,{
        serverUrl: window.SITE_CONFIG['baseUrl']+"/ueditor/exec?token="+_this.$cookie.get('token')
      });

      this.editor.ready(function() {
        if(_this.val!=null&&_this.val!=undefined){
          // _this.$emit('ready', _this.editor);
          _this.$http({
            url: _this.$http.adornUrl(_this.contentUrl+_this.val),
            method: 'get',
            params: _this.$http.adornParams()
          }).then(({data}) => {
            if(data.code==200&&data.data!=null){
              _this.editor.setContent( data.data.content);
              // console.log(data.data.content)
            }
          });
          // if(_this.modelname=='policyBack'){
          //   _this.$http({
          //     url: _this.$http.adornUrl(`/biz/policyexpert/info/${_this.val}`),
          //     method: 'get',
          //     params: _this.$http.adornParams()
          //   }).then(({data}) => {
          //     if(data.code==200&&data.data!=null){
          //       _this.editor.setContent( data.data.content)
          //     }
          //   })
          // }else if(_this.modelname=='official'){
          //   _this.$http({
          //     url: _this.$http.adornUrl(`/biz/policyofficial/info/${_this.val}`),
          //     method: 'get',
          //     params: _this.$http.adornParams()
          //   }).then(({data}) => {
          //     if(data.code==200&&data.data!=null){
          //       _this.editor.setContent( data.data.content)
          //     }
          //   })
          // }else if(_this.modelname=='orginal'){
          //   _this.$http({
          //     url: _this.$http.adornUrl(`/biz/policy/info/${_this.val}`),
          //     method: 'get',
          //     params: _this.$http.adornParams()
          //   }).then(({data}) => {
          //     if(data.code==200&&data.data!=null){
          //       _this.editor.setContent( data.data.content)
          //     }
          //   })
          // }else if(_this.modelname=='article'){
          //   _this.$http({
          //     url: _this.$http.adornUrl(`/biz/policy/info/${_this.val}`),
          //     method: 'get',
          //     params: _this.$http.adornParams()
          //   }).then(({data}) => {
          //     if(data.code==200&&data.data!=null){
          //       _this.editor.setContent( data.data.content)
          //     }
          //   })
          // }else if(_this.modelname=='report_expert'){
          //   _this.$http({
          //     url: _this.$http.adornUrl(`/biz/report/info/${_this.val}`),
          //     method: 'get',
          //     params: _this.$http.adornParams()
          //   }).then(({data}) => {
          //     if(data.code==200&&data.data!=null){
          //       _this.editor.setContent( data.data.expertForecast)
          //     }
          //   })
          // }else if(_this.modelname=='report_idea'){
          //   _this.$http({
          //     url: _this.$http.adornUrl(`/biz/report/info/${_this.val}`),
          //     method: 'get',
          //     params: _this.$http.adornParams()
          //   }).then(({data}) => {
          //     if(data.code==200&&data.data!=null){
          //       _this.editor.setContent( data.data.opinion)
          //     }
          //   })
          // }else if(_this.modelname=='imputation'){
          //   _this.$http({
          //     url: _this.$http.adornUrl(`${_this.url}${_this.val}`),
          //     method: 'get',
          //     params: _this.$http.adornParams()
          //   }).then(({data}) => {
          //     if(data.code==200&&data.data!=null){
          //       _this.editor.setContent( data.data.content)
          //     }
          //   })
          // }else if(_this.modelname=='relative_expert'){
          //   _this.$http({
          //     url: _this.$http.adornUrl(`/biz/trpolicyrelativeexpert/updateinfo/${_this.val}`),
          //     method: 'get',
          //     params: _this.$http.adornParams()
          //   }).then(({data}) => {
          //     if(data.code==200&&data.data!=null){
          //       _this.editor.setContent( data.data.content)
          //     }
          //   })
          // }else if(_this.modelname=='good-class'){
          //   _this.$http({
          //     url: _this.$http.adornUrl(`${_this.url}${_this.val}`),
          //     method: 'get',
          //     params: _this.$http.adornParams()
          //   }).then(({data}) => {
          //     if(data.code==200&&data.data!=null){
          //       _this.editor.setContent( data.data.introduce)
          //     }
          //   })
          // }else if(_this.modelname=='broadcast'){
          //   _this.$http({
          //     url: _this.$http.adornUrl(`${_this.url}${_this.val}`),
          //     method: 'get',
          //     params: _this.$http.adornParams()
          //   }).then(({data}) => {
          //     if(data.code==200&&data.data!=null){
          //       _this.editor.setContent( data.data.introduce)
          //     }
          //   })
          // }else if(_this.modelname==undefined&&_this.url!=undefined){
          //   _this.$http({
          //     url: _this.$http.adornUrl(`${_this.url}${_this.val}`),
          //     method: 'get',
          //     params: _this.$http.adornParams()
          //   }).then(({data}) => {
          //     if(data.code==200&&data.data!=null){
          //       _this.editor.setContent( data.data.content)
          //     }
          //   })
          // }
        }
        if(_this.econtent!=null&&_this.econtent!=undefined&&_this.econtent!=""){_this.editor.setContent( _this.econtent)}

      });
      this.editor.addListener("contentChange",function(){
        var html=_this.editor.getContent()
        _this.$emit('func',_this.modelname,_this.index,html)
      })
    },
    destoryed() {
      this.editor.destory();
    },
    methods:{
      getUEContent: function(){
        return this.editor.getContent();
      },
      getContentTxt: function(){
        return this.editor.getContentTxt();
      }
    }
  }
</script>
