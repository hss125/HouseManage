// pages/houseOwner/houseOwner.js
var app=getApp();
var dater=require("../../lib/js/date.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:{basic:false}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getOwner:function(){
    var that=this;
    app.get("/Owner/GetTenant",{},function(data){
      for(var i=0;i<data.payRent.length;i++){
        data.payRent[i].PayRentDate=dater.YMD(data.payRent[i].PayRentDate);
        data.payRent[i].SupDays=dater.getDays(data.payRent[i].PayRentDate);
      }
      for(var i=0;i<data.contractExpires.length;i++){
        data.contractExpires[i].Deadline=dater.YMD(data.contractExpires[i].Deadline);
        data.contractExpires[i].SupDays=dater.getDays(data.contractExpires[i].Deadline);
      }
      that.setData({model:data});
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
    app.validateLogon();
    this.getOwner();
    this.setData({face:wx.getStorageSync('face')});
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
  savePayRent:function(){
     var that=this;
     var rent=this.data.rent;
     rent.Id=this.data.houseId;
     app.request("/Owner/PayRent/",rent,function(){
      that.getOwner();
     })
     this.hideBasic();
   },
  toggle(type, show) {
    this.setData({
      [`show.${type}`]: show
    });
  },
  showBasic() {
    this.toggle('basic', true);
  },

  hideBasic() {
    this.toggle('basic', false);
  },
  hideBasic2() {
    this.setData({[`show.basic2`]: false});
  },
  showBasic2(e) {
    //var id=e.currentTarget.dataset.id;
    //var h=this.data.model.payRent.find(f=>f.Id==id);
    var index=e.currentTarget.dataset.index;
    var h=this.data.model.contractExpires[index];
    this.setData({["renewal.Id"]:h.Id,[`show.basic2`]: true,currHouse:h});
  },
  payrent:function(e){
    var id=e.currentTarget.dataset.id;
    var h=this.data.model.payRent.find(f=>f.Id==id);
    this.setData({houseId:id,currHouse:h});
    this.showBasic();
  },
  SynRent:function(e){
    this.setData({[e.currentTarget.dataset.prop]: e.detail})
  },
  saveRenewal:function(){
    var that=this;
    app.request("/Owner/Renewal",this.data.renewal,function(){
      wx.showToast({
        title: '续租成功！',
      })
      that.hideBasic2();
      that.getOwner();
    })
  },
})