// lib/component/my-picker/index.js
var dater=require("../../js/date.js");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    label: String,
    prop: String,
    value:String
  },

  /**
   * 组件的初始数据
   */
  data: {
    text:dater.YMD(Date.now())
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeDate:function(res){
      var date=res.detail.value;
      this.setData({text:date});
      var myEventDetail = {date:date,prop:this.data.prop} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('change', myEventDetail, myEventOption)
    }
  },
  ready: function() { 
    var myEventDetail = {date:this.data.value||this.data.text,prop:this.data.prop};
    var myEventOption = {} // 触发事件的选项
    this.triggerEvent('change', myEventDetail, myEventOption)
  },
  observers:{
    value:function(val){
      var index=val.indexOf("T");
      if(index>-1){
        var v=val.substring(0,index);
        this.setData({value:v});
      }
    }
  }
})
