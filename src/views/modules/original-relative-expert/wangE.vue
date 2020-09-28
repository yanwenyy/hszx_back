<template>
  <!--<script :id="this.id" :index="this.index" class="ueditor-box" type="text/plain" style="width: 100%; height: 260px;"></script>-->
 <div :id="this.id" :index="this.index">

  </div>
</template>

<script>
  /*import ueditor from 'ueditor'*/
import Vue from 'vue'
import WangEditor from 'wangeditor'
  export default {
    props:['id','index','econtent','policy'],
    data(){
      return {
        ue: null,
        ueId: this.id,
        ueContent: '',
        dialogVisible: false
      }
    },
    mounted(){

      var that=this
      var editor = new WangEditor("#"+this.id);

      editor.customConfig.onchange = function (html) {
        // 监控变化，同步更新到 content
        //html=html.replace(/\"/g,"'");
        if(html=='<p><br></p>'){html=''}
        //this.content=html
        that.$emit('func',that.policy,that.index,html)
        //this.editorContent1(that.index,html)
      };
      editor.txt.html(this.econtent)
      editor.customConfig.uploadImgServer =  this.$http.adornUrl(`/sys/oss/upload?token=${this.$cookie.get('token')}`); //上传URL
      editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024;
      editor.customConfig.uploadImgMaxLength = 5;
      editor.customConfig.uploadFileName = 'file';
      editor.customConfig.pasteFilterStyle = false;
      editor.customConfig.uploadImgHooks = {
        customInsert: function (insertImg, result, editor) {
          var url ="http://"+result.url;
          insertImg(url);
        }
      };
      editor.customConfig.pasteTextHandle = function (content) {
        // content 即粘贴过来的内容（html 或 纯文本），可进行自定义处理然后返回
        if (content == '' && !content) return ''
        var str = content
        str = str.replace(/<xml>[\s\S]*?<\/xml>/ig, '')
        str = str.replace(/<style>[\s\S]*?<\/style>/ig, '')
        str = str.replace(/<\/?[^>]*>/g, '')
        str = str.replace(/[ | ]*\n/g, '\n')
        str = str.replace(/&nbsp;/ig, '')
        return str
      }
      editor.create();
      editor.txt.html(this.econtent)

     /* var that=this
     /!*ueditor.delEditor = function (this.id) {
            if (this.ue = instances[this.id]) {
              this.ue.key && this.ue.destroy();
              delete instances[this.id]
            }
          }*!/
      this.ue = ueditor.getEditor(this.ueId, {
        serverUrl: this.$http.adornUrl(`ue/uploadimage`),
        zIndex: 1
      })

      UE.Editor.prototype._bkGetActionUrl = UE.Editor.prototype.getActionUrl;
      UE.Editor.prototype.getActionUrl = function(action) {
        if (action == 'uploadimage' || action == 'uploadscrawl' || action == 'uploadimage') {
          return this.$http.adornUrl(`ue/uploadimage`);

        } else {
          return this._bkGetActionUrl.call(this, action);
        }
      }
      this.ue.ready(() => {
        that.ue.setContent(that.econtent)
      })

      this.ue.addListener("blur",function(){
        that.$emit('func',that.policy,that.index,that.ue.getContent())
      })*/
    }
  }
</script>

<style scoped>

</style>
