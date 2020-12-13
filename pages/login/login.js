// pages/login/login.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:{Name:wx.getStorageSync('name')},
    checked1:wx.getStorageSync('LoginType')||false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  login:function(){
    wx.showLoading({title: '登录中...',mask:true });
    var name=this.data.user.Name;
    wx.request({
      url: app.globalData.baseUrl+'/Account/Login',
      data:this.data.user,success:function(res){
        wx.hideLoading();
        if(res.data.Succ){
          wx.setStorageSync('ticket', {code:res.data.msg,expiration:Date.now()+3*24*60*60*1000});
          wx.setStorageSync('name', name);
          wx.switchTab({
            url: '/pages/index/index',
          })
        }else{
          wx.showToast({
            title: '用户名或密码错误！',
            icon:"none"
          })
        }
      }
    })
  },
  SynData:function(e){
    this.setData({[e.currentTarget.dataset.prop]: e.detail})
  },
  login2:function(){
    var name=this.data.user.Name;
    app.request2("/Account/Login2",this.data.user,function(res){
        wx.navigateTo({
          url: '/pages/TenantCenter/tenantCenter?id='+res.msg,
        })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  LoginType:function(){
    this.setData({checked1:!this.data.checked1});
    wx.setStorageSync('LoginType', this.data.checked1)
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

  },
  videoStart:function(){
    this.setData({video:true});
  },
  videoClose:function(){
    this.setData({video:false});
  },
  ewmStart:function(){
    this.setData({ewm:true});
  },
  ewmClose:function(){
    this.setData({ewm:false});
  },
  suggestion:function(){
    var sugg=this.data.suggestion;
    if(!sugg||!sugg.Phone||!sugg.Suggestion1){
      wx.showToast({title: "联系方式或内容不能为空！",icon:"none",duration:2000});
      return;
    }
    var that=this;
    app.request2("/Account/Suggestion",sugg,function(){
      wx.showToast({
        title: '提交成功！',
      })
      that.ewmClose();
      that.setData({suggestion:{}});
    })
  }
})