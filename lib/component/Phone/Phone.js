// lib/component/Phone/Phone.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    phone: {
      type: String,
      value: '',
    }
  },
  /**
   * 组件的初始数据
   */
  data: {

  },
  /**
   * 组件的方法列表
   */
  methods: {
    call:function(){
      wx.makePhoneCall({
        phoneNumber: this.data.phone ,
        fail:function(){          
        }
      })
    },
  }
})
