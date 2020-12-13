// pages/reg/reg.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  SynData:function(e){
    this.setData({[e.currentTarget.dataset.prop]: e.detail})
  },
  reg:function(){
    var user=this.data.user;
    var err="";
    var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(user.Name)) {
      err="请输入正确的手机号！";
    }else if(!user.PassWord||!user.PassWord.replace(/\s*/g,"")){
      err="请输入密码！";
    }else if(user.PassWord!=user.PassWord2){
      err="两次输入密码不一致！";
    }
    if(err){
      wx.showToast({title: err,icon:"none",duration:2000});
      return;
    }
    app.request2("/Account/Login0",this.data.user,function(){
      wx.showToast({title: "注册成功！"})
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})