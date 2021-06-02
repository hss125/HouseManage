//app.js
App({
  onLaunch: function (e) {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    // if(e.path.indexOf("login")<0){
    //   this.isLogin();
    // }
    // 登录
    
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId   
        this.globalData.code=res.code;     
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  }, 
  globalData: {
    userInfo: {name:""},
    baseUrl:"http://localhost:53675/"
    //baseUrl:"https://www.songshan.work/"
  },
  validateLogon:function(){
    var ticket=wx.getStorageSync('ticket');
    if(ticket&&ticket.expiration>Date.now()){
      return;
    }
    wx.showToast({
      title: '登录超时！',
      icon:"none"
    })
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  request2:function(url,data,succ,ticket,fail){
    wx.showLoading({title: '请求中！',mask:true });
    wx.request({
      url: this.globalData.baseUrl+url+"?ticket="+(ticket?ticket.code:""),
      method:"POST",
      data:data,
      success:(res)=>{
        wx.hideLoading();
        if(res.data.Succ){
          succ(res.data);
        }else{
          if(fail){
            fail();
          }          
          wx.showToast({
            title: "信息:"+res.data.msg,
            icon:"none",
            duration:3000
          })
        }
      },
      fail:function(){
        wx.showToast({
          title: '请求超时！',
          icon:"none"
        })
      }
    })
  },
  request:function(url,data,succ,fail){
    data=data||{};
    var ticket=wx.getStorageSync('ticket');
    if(!ticket||ticket.expiration<Date.now()){
      return;
    }
    this.request2(url,data,succ,ticket,fail);
  },
  get2:function(url,data,succ,ticket){
    wx.showLoading({title: '请求中！',mask:true})
    data.ticket=ticket?ticket.code:"";
    wx.request({
      url: this.globalData.baseUrl+url,
      data:data,
      success:(res)=>{
        wx.hideLoading();
        succ(res.data);
      },
      fail:function(){
        wx.showToast({
          title: '请求超时！',
          icon:"none"
        })
      }
    })
  },
  get:function(url,data,succ){
    data=data||{};
    var ticket=wx.getStorageSync('ticket');
    if(!ticket||ticket.expiration<Date.now()){
      return;
    }
    this.get2(url,data,succ,ticket);
  },
})