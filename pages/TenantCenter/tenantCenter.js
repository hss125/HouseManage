// pages/TenantCenter/tenantCenter.js
const app=getApp();
var dater=require("../../lib/js/date.js");
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
    if(!options.id){
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }else{
      this.setData({id:options.id});
      this.getTenant();
    }
  },
  getTenant:function(){
    var that=this;
    wx.request({
      url: app.globalData.baseUrl+'/TenantCenter/GetTenant',
      data:{id:this.data.id},
      success:function(res){
        //console.log(res.data);
        var model=res.data;
        for(var i=0;i<model.roomList.length;i++){
          model.roomList[i].PayRentDate=dater.YMD(model.roomList[i].PayRentDate);
          model.roomList[i].Deadline=dater.YMD(model.roomList[i].Deadline);
        }
        that.setData({model:model,tenant:{Name:model.tenant.Name,Phone:model.tenant.Phone,Id:model.tenant.Id}});
      }
    })
  },
  subscribe:function(){
    var that=this;
    wx.requestSubscribeMessage({
      tmplIds: ['Axdwzrx9NdoJVc5nXOAOIOiBQ7IgGz7593rtJvdak8k'],
      success:function (res) { 
        //console.log(res);
        if(res.Axdwzrx9NdoJVc5nXOAOIOiBQ7IgGz7593rtJvdak8k=="accept"){
          that.bindOpenId();
        }
      },fail:function(ex){
        console.log(ex);
      }
    })
  },
  bindOpenId:function(){
    var that=this;
    wx.showLoading({title: '订阅中...',mask:true });
    wx.request({
      url: app.globalData.baseUrl+"/TenantCenter/BindOpenId",
      method:"POST",
      data:{code:app.globalData.code,id:this.data.id},
      success:(res)=>{
        wx.hideLoading();
        console.log(res.data);//errcode
        if(res.data.Succ){
          that.setData({checked1:true,["model.tenant.OpenId"]:true}); 
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
  SynRent:function(e){
    this.setData({[e.currentTarget.dataset.prop]: e.detail})
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
  showBasic2() {
    this.toggle('basic2', true);
  },

  hideBasic2() {
    this.toggle('basic2', false);
  },
  editInfo:function(){
    this.showBasic();
  },
  saveInfo:function(){
    var that=this;
    app.request2("/TenantCenter/EditInfo",this.data.tenant,function(res){
      if(res.Succ){
        that.hideBasic();
        wx.showToast({
          title: '修改成功！',
        })
        that.getTenant();
      }
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
  call:function(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.id,
      fail:function(){          
      }
    })
  },
  openRepair:function(e){
    var id=e.currentTarget.dataset.id;
    this.setData({repairRoomId:id});
    this.showBasic2();
  },
  Repair:function(){
    //console.log(this.data.Detail);
    var that=this;
    app.request2("/TenantCenter/Repair",{rep:{Detail:this.data.Detail},id:this.data.repairRoomId},function(res){ 
      that.hideBasic2();
      wx.showToast({
        title: '报修成功！',
      })
    })
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