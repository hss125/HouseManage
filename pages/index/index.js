//index.js
var dater=require("../../lib/js/date.js");
//获取应用实例
const app = getApp()
Page({
  data: {
    active: 0,
    show: {
      basic: false ,
      basic2: false 
    },
    minDate: new Date(2015, 0, 1).getTime(),
    maxDate: new Date(2030, 10, 1).getTime(),
    rent:{ContractDate:dater.dateFormat("YYYY-mm-dd",new Date()),Expiration:12,PayRentMonths:1,PayRentType:"交一压一"},
    roomId:null
  },
  onShow: function () {
    app.validateLogon();
    this.getTenant();
    this.setData({face:wx.getStorageSync('face')});
  },
  getTenant:function(){
    var that=this;
    app.get("/Tenant/GetTenant",{},function(data){
      for(var i=0;i<data.payRent.length;i++){
        data.payRent[i].room.PayRentDate=dater.YMD(data.payRent[i].room.PayRentDate);
        data.payRent[i].room.SupDays=dater.getDays(data.payRent[i].room.PayRentDate);
      }
      for(var i=0;i<data.contractExpires.length;i++){
        data.contractExpires[i].room.Deadline=dater.YMD(data.contractExpires[i].room.Deadline);
        data.contractExpires[i].room.ContractDate=dater.YMD(data.contractExpires[i].room.ContractDate);
        data.contractExpires[i].room.SupDays=dater.getDays(data.contractExpires[i].room.Deadline);
      }
      for(var i=0;i<data.repair.length;i++){
        data.repair[i].repa.InsertDate=dater.YMD(data.repair[i].repa.InsertDate);
      }
      that.setData({model:data});
    })
  },
  onChange(event) {
    const { key } = event.currentTarget.dataset;
    this.setData({ [key]: event.detail });
  },
  rent:function(e){
    var id=e.currentTarget.dataset.id;
    var rent=e.currentTarget.dataset.rent;
    var index=e.currentTarget.dataset.index;
    this.setData({roomId:id,payRentRoom:this.data.model.forRent[index]});
    this.setData({["rent.Rent"]:rent});
    this.showBasic();
  },
  payrent:function(e){
    var id=e.currentTarget.dataset.id;
    var index=e.currentTarget.dataset.index;
    this.setData({roomId:id,payRentRoom:this.data.model.payRent[index]});
    this.toggle('basic2', true);
  },
  checkOut:function(e){
    var index=e.currentTarget.dataset.index;
    var that=this;
    var room=this.data.model.payRent[index];
    wx.showModal({
      cancelColor: 'cancelColor',
      title:room.house.Community+room.house.Building+room.room.Name+" 是否确定退房！",
      success:function(res){
          if (res.confirm) {
            app.request("/Tenant/CheckOut",{id:room.room.Id},function(){
              wx.showToast({
                title: "退房成功！",
              })
              that.getTenant();
            })
          } 
      }
    }) 
  },
  saveContractRenewal:function(){
    var that=this;
    app.request("/Tenant/contractRenewal",this.data.Renewal,function(data){
      that.getTenant();
      that.hideBasic3();
    })
  },
  contractRenewal:function(e){
    this.toggle('basic3', true);
    var index=e.currentTarget.dataset.index;
    //this.setData({roomId:id,payRentRoom:this.data.model.contractExpires[index]});
    var id=e.currentTarget.dataset.id;
    var rent=e.currentTarget.dataset.rent;
    this.setData({["Renewal.Id"]:id,["Renewal.Expiration"]:12,["Renewal.Rent"]:rent,RenewalRoom:this.data.model.contractExpires[index]});   
  },
  showPickerFun:function(e){
    var field=e.currentTarget.dataset.field;
    this.setData({dateField:field});
    this.setData({
      showPicker: true
    });
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
    this.toggle('basic2', false);
  },
  hideBasic3() {
    this.toggle('basic3', false);
  },
  hidePickerFun:function(){
    this.setData({
      showPicker: false
    });
  },
  suredate1:function(e){
    e.detail=dater.dateFormat("YYYY-mm-dd", new Date(e.detail));
    this.setData({[this.data.dateField]:e.detail});
    this.hidePickerFun();
  },
  SynRent:function(e){
    this.setData({[e.currentTarget.dataset.prop]: e.detail})
  },
  saveRent:function(){
   var that=this;
    var rent=this.data.rent;
    rent.Id=this.data.roomId;
    if(!rent.PayRentDate){
      wx.showToast({
        title: "请选择下次交租日期！",
        icon:"none"
      })
      return;
    }
    app.request("/Tenant/RentOut/",rent,function(res){
      that.getTenant();
      that.setData({rent:{ContractDate:dater.dateFormat("YYYY-mm-dd",new Date()),Expiration:12,PayRentMonths:1,PayRentType:"交一压一"}});
    })
    this.hideBasic();
  },
  savePayRent:function(){
    var that=this;
     var rent=this.data.rent;
     rent.Id=this.data.roomId;
     app.request("/Tenant/PayRent/",rent,function(){
      that.getTenant();
     })
     this.hideBasic2();
   },
   PayRentType:function(){
     var arr=['交1压1','交2压1', '交3压1', '交6压1'];
     var that=this;
      wx.showActionSheet({
        itemList: arr,
        success (res) {
          that.setData({["rent.PayRentType"]:arr[res.tapIndex]});
        }
      })
   },
   repaired:function(e){
    var id=e.currentTarget.dataset.id;
    var index=e.currentTarget.dataset.index;
    var name = 'model.repair[' + index + '].delete';
    var that=this;
    app.request("/Tenant/Repaired",{id:id},function(){
      that.setData({[name]:true});
    })
   },
   copy:function(){
     var msg="最新房源\n\n";
     var r=this.data.model.forRent;
     for(var i=0;i<r.length;i++){
       msg+="【"+(i+1)+"】"+r[i].house.Community+" "+r[i].house.Building+" "+r[i].room.Name+" ￥"+r[i].room.Rent+"\n\n";
     }
     msg+="联系电话:"+wx.getStorageSync('name');
     wx.setClipboardData({
      data: msg,
      success (res) {
        wx.getClipboardData({
          success (res) {
            console.log(res.data) // data
          }
        })
      }
    })
   }
})
