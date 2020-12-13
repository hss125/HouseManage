// pages/my.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
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
  getMy:function(){
    var that=this;
    app.get("/My/GetMy",{},function(data){
      that.setData({model:data});
    });
  },
  logout:function(){
    app.request("/Account/Logout",{},function(){
      wx.setStorageSync('ticket', "");
      wx.showToast({
        title: '退出成功！',
      })
      wx.navigateTo({
        url: '/pages/login/login',
      })
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.validateLogon();
    this.getMy();
    let _face=wx.getStorageSync('face')==1?"大号":"正常";
    this.setData({face:_face,face1:wx.getStorageSync('face')});
  },
  typeFace: function() {
    var that=this;
    wx.showActionSheet({
      itemList: ['正常','大号'],
      success (res) {
        let _face=res.tapIndex==1?"大号":"正常";
        that.setData({face:_face,face1:res.tapIndex});
        wx.setStorageSync('face', res.tapIndex);
      }
    })
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
  logs:function(){
    wx.navigateTo({
      url: '../log/log',
    })
  },
  switch1Change:function(e){
    var check=e.detail.value;
    if(check&&!this.data.model.acc.OpenId){
        var that=this;
        wx.requestSubscribeMessage({
          tmplIds: ['2jXJDSxgGNoD4XC9xBifq_PRZlrsNYEmiYtyN8f0w7o'],
          success:function (res) {
            if(res["2jXJDSxgGNoD4XC9xBifq_PRZlrsNYEmiYtyN8f0w7o"]=="accept"){
              that.bindOpenId();
            }
          },fail:function(ex){
            console.log(ex);
          }
        })
    }
  },
  bindOpenId:function(){
    var that=this;
    wx.showLoading({title: '订阅中...',mask:true });
    wx.request({
      url: app.globalData.baseUrl+"/my/BindOpenId",
      method:"POST",
      data:{code:app.globalData.code,id:this.data.model.acc.Id},
      success:(res)=>{
        wx.hideLoading();
        console.log(res.data);//errcode
        if(res.data.Succ){
          that.setData({["model.acc.OpenId"]:true}); 
          wx.showToast({
            title: '订阅成功！',
          })
        }
        else{
          wx.showToast({
            title: '订阅失败！'+res.data.msg,
            duration:3000
          })
        }
      },fail:function(){
        wx.hideLoading();
      }
    })
  },
})