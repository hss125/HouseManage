// pages/house/house.js
var dater=require("../../lib/js/date.js");
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: {
      basic: false 
    },
    showPicker:false,
    house:{},
    room:[{}],
    houseList:[],
    openIndex:-1,
    roomCount:0,
    tenent:{},
    steps:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHouse();
  },
  showPickerFun:function(e){
    this.setData({
      datefield:e.currentTarget.dataset.field
    });
    this.setData({
      showPicker: true
    });
  },
  hidePickerFun:function(){
    this.setData({
      showPicker: false
    });
  },
  addRoom:function(){
      var rooms=this.data.room;
      rooms.push({});
      this.setData({room:rooms});
  },
  delRoom:function(e){
    var index=e.currentTarget.dataset.index;
    var rooms=this.data.room;
    rooms.splice(index, 1);
    this.setData({room:rooms});
},
  suredate1:function(e){
    e.detail=dater.dateFormat("YYYY-mm-dd", new Date(e.detail))
    this.setData({[this.data.datefield]: e.detail})
    this.hidePickerFun();
  },
  roomChange:function(e){
    var index=e.currentTarget.dataset.index;
    var name=e.currentTarget.dataset.name;
    var rooms=this.data.room;
    rooms[index][name]=e.detail;
    this.setData({room:rooms  })
  },
  houseChange:function(e){
    this.setData({["house."+e.currentTarget.dataset.prop]: e.detail})
  },
  addHouse:function(){
    var that=this;
    var msg="";
    if(!this.data.house.Community){
      msg+="小区 ";
    }
    if(!this.data.house.Community){
      msg+="楼室 ";
    }
    if(!this.data.room[0].Name){
      msg+="房间 ";
    }
    if(!this.data.room[0].Rent){
      msg+="租金 ";
    }
    if(msg){
      wx.showToast({title: msg+"必填！",icon:"none" })
      return false;
    }
    for(var i=0;i<this.data.room.length;i++){
      if(this.data.room[i].fileList){
        this.data.room[i].Url=this.data.room[i].fileList.map(function(it){return it.newUrl}).join("|");
      }
    };
    app.request("/Home/AddHouse",{house:this.data.house,rooms:this.data.room},function(data){
      wx.showToast({
        title: '保存成功！',
      })
      that.getHouse();
      that.hideBasic();
    })
  },
  getHouse:function(){
    var that=this;
    app.get("/Home/GetHouse/",{},function(data){
      //var s=Date.now();
      var count=0;
      var totalprofit=0
      for(var i=0;i<data.length;i++){
          count+=data[i].rooms.length;
          //data[i].house.TakeDate=dater.YMD(data[i].house.TakeDate);
          //data[i].house.Deadline=dater.YMD(data[i].house.Deadline);
          //data[i].house.PayRentDate=dater.YMD(data[i].house.PayRentDate);
          //data[i].house.PaySupDays=dater.getDays(data[i].house.PayRentDate);
          //data[i].house.DeadSupDays=dater.getDays(data[i].house.Deadline);
          var sumrent=0;
          for(var j=0;j<data[i].rooms.length;j++){
            data[i].rooms[j].ContractDate=dater.YMD(data[i].rooms[j].ContractDate);
            data[i].rooms[j].Deadline=dater.YMD(data[i].rooms[j].Deadline);
            data[i].rooms[j].PayRentDate=dater.YMD(data[i].rooms[j].PayRentDate);
            //data[i].rooms[j].DeadSupDays=dater.getDays(data[i].rooms[j].Deadline);
            //data[i].rooms[j].PaySupDays=dater.getDays(data[i].rooms[j].PayRentDate);
            sumrent+=data[i].rooms[j].Rent;
          }
          data[i].house.Rent=sumrent;
          data[i].house.Profit=sumrent-data[i].house.CostPrice;
          totalprofit+=data[i].house.Profit;
      }
      //var end=Date.now();
      //console.log(end-s);
      that.setData({houseList:data,firstLetter:[],roomCount:count,openIndex:-1,totalprofit:totalprofit});
      if(data.length>0){
        that.setData({firstLetter:data[0].firstLetter});
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //this.getHouse();
  },
  openRoom:function(e){
    var index=e.currentTarget.dataset.index; 
    index=index==this.data.openIndex?-1:index;
    this.setData({openIndex:index});
    if(index!=-1&&!this.data.houseList[index].more){
      var count = 'houseList[' + index + '].more';
      this.setData({[count]:true});
    }
  },
  scrollTo: function(e) {
      var fl =".fl"+ e.currentTarget.dataset.index;
      //this.setData({Letter:e.currentTarget.dataset.index});
      var scrollTop;
      const query=wx.createSelectorQuery();  //创建节点查询器
      query.select(fl).boundingClientRect()  //选择toViewid获取位置信息
      query.selectViewport().scrollOffset()  //获取页面查询位置的
      query.exec(function(res) {
            scrollTop = res[0].top+res[1].scrollTop;
            wx.createSelectorQuery().select('.page').boundingClientRect(function(rect) {
              wx.pageScrollTo({
                scrollTop: scrollTop,
                duration: 200
              })
            }).exec()
      })
   },
   onPageScroll (e) { 
      var thTop=0;
      if(e.scrollTop>67){
        thTop=e.scrollTop-67;
      }
      var that=this;
      clearTimeout(this.data.timer1);
      this.data.timer1=setTimeout(function(){
        that.setData({thTop:thTop});
      },50)
    },  
   delFun:function(id){
      var that=this;
     app.request("/Home/DelHouse/",{id:id},function(data){
        wx.showToast({
          title: '删除成功！',
        })
        setTimeout(function(){
          that.getHouse();
        },300)        
     })    
   },
   del:function(e){     
      var id=e.currentTarget.dataset.id;
      var name=e.currentTarget.dataset.name;
      var that=this;
      wx.showModal({
        cancelColor: 'cancelColor',
        title:"是否确定删除！ "+name,
        success:function(res){
            if (res.confirm) {
              that.delFun(id);
            } 
        }
      })      
   },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.validateLogon();
    this.setData({face:wx.getStorageSync('face')});
    //this.getHouse();
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
  toggle(type, show) {
    this.setData({
      [`show.${type}`]: show
    });
  },
  showBasic() {
    this.toggle('basic', true);
    this.setData({house:{TakeDate:dater.dateFormat("YYYY-mm-dd",new Date()),Expiration:60},room:[{}]});
  },
  showBasic2() {
    this.toggle('basic2', true);
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
  roomEdit:function(e){
    var xy=e.currentTarget.dataset;
    var room=this.data.houseList[xy.x].rooms[xy.y];
    this.setData({tenent:room,tenantHouse:this.data.houseList[xy.x].house});
    this.showBasic2();
  },
  roomSave:function(){
    //console.log(this.data.tenent);
    var that=this;
    app.request("/Home/EditRoom",this.data.tenent,function(res){
      that.hideBasic2();
      wx.showToast({
        title: '修改成功！',
      })
      setTimeout(function(){
        that.getHouse();
      },300) 
    })
  },
  edit(e) {
    var index=e.currentTarget.dataset.index;
    this.toggle('basic', true);
    var rooms=this.data.houseList[index].rooms;
    for(var i=0;i<rooms.length;i++){
      if(rooms[i].Url){
        rooms[i].fileList=rooms[i].Url.split("|").map(function(it){return {url:app.globalData.baseUrl+"/Upload/Room/"+it,newUrl:it}});
      }
    }
    this.setData({house:this.data.houseList[index].house,room:rooms});
  },
  ProfitChange:function(){
    this.setData({Profit:!this.data.Profit});
    this.setData({openIndex:-1});
  },
  SynRent:function(e){
    this.setData({[e.currentTarget.dataset.prop]: e.detail})
  },
  onDateChange:function(res){
    //console.log(res);
    this.setData({[res.detail.prop]:res.detail.date});
  },
  checkOut:function(e){
    var id=e.currentTarget.dataset.id;
    var that=this;
    wx.showModal({
      cancelColor: 'cancelColor',
      title:"是否确定退房！",
      success:function(res){
          if (res.confirm) {
            app.request("/Tenant/CheckOut",{id:id},function(){
              wx.showToast({
                title: "退房成功！",
              })
              that.getHouse();
            })
          } 
      }
    }) 
  },
  refresh:function(){
    this.getHouse();
  },
  creatTenant:function(e){
    var data=e.currentTarget.dataset;
    var room=this.data.houseList[data.x].rooms[data.y];
    this.setData({tenent:room});
    var name="houseList["+data.x+"].rooms["+data.y+"].delete";
    var id=data.id;
    var that=this;
    wx.showActionSheet({
      itemList: ['新建租客账号','绑定现有账号'],
      success (res) {
        app.request("/Home/CreatTenant",{id:id,type:res.tapIndex},function(){
          wx.showToast({
            title: '保存成功！',
          })
          that.setData({[name]:true});
        })
      }
    })
  },
  afterRead(event) {
    var that=this;
    //console.log(event.detail);
    var file=event.detail.file;
    var index=event.detail.name;
    file.status='uploading';
    file.message='上传中';
    var fileList=this.data.room[index].fileList||[];
    fileList.push(file);
    this.setData({['room['+index+'].fileList']: fileList });   
    this.PicCompression(file.path,index);
  },
  delete(event) {
    var index=event.detail.name;
    const fileList =this.data.room[index].fileList;
    fileList.splice(event.detail.index, 1);
    this.setData({['room['+index+'].fileList']: fileList });
  },
  PicCompression(url,index){
    var that=this;
    wx.getImageInfo({
      src: url,
      success(res){
        var originWidth, originHeight;
           originHeight = res.height;
           originWidth = res.width;
           // 最大尺寸限制
           var maxWidth = 450,
             maxHeight = 600;
           // 目标尺寸
           var targetWidth = originWidth,
             targetHeight = originHeight;
           //等比例压缩，如果宽度大于高度，则宽度优先，否则高度优先
           if (originWidth > maxWidth || originHeight > maxHeight) {
             if (originWidth / originHeight > maxWidth / maxHeight) {
               // 要求宽度*(原生图片比例)=新图片尺寸
               targetWidth = maxWidth;
               targetHeight = Math.round(maxWidth * (originHeight / originWidth));
             } else {
               targetHeight = maxHeight;
               targetWidth = Math.round(maxHeight * (originWidth / originHeight));
             }
           }
           //尝试压缩文件，创建 canvas
           var ctx = wx.createCanvasContext('firstCanvas');
           ctx.clearRect(0, 0, targetWidth, targetHeight);
           ctx.drawImage(url, 0, 0, targetWidth, targetHeight);
           ctx.draw();
           //更新canvas大小
           that.setData({
             cw: targetWidth,
             ch: targetHeight
           });
           setTimeout(function(){
            wx.canvasToTempFilePath({
              canvasId: 'firstCanvas',
              fileType:"jpg",
              success: (res2) => {
                wx.uploadFile({
                  url: app.globalData.baseUrl+'/File/ImgUpload', //仅为示例，非真实的接口地址
                  filePath: res2.tempFilePath,
                  name: 'file',
                  formData: {
                    'user': 'test'
                  },
                  success(res) {
                    //console.log(res.data);
                    var r=JSON.parse(res.data);
                    var fis=that.data.room[index].fileList||[];
                    var fi=fis.find(function(it){return it.status=='uploading'});
                    if(r.Succ){
                      fi.status="";
                      fi.newUrl=r.msg;
                    }else{
                      fi.status="failed";
                      fi.message=r.msg;
                    }
                    that.setData({['room['+index+'].fileList']: fis });
                  }
                })
              }
            })
           },500)
      }
    })
  },
  roomLog(e){
    var id=e.currentTarget.dataset.id;
    this.toggle('basic3', true);
    const that=this;
    app.get("/Home/GetRoomLog",{roomId:id},function(data){
      const res=data.map(m=>{
        return {text:m.Type+"  "+dater.dateFormat("YYYY-mm-dd HH:MM:SS",new Date(m.InsertDate)),desc:m.Detail};
      })
      that.setData({steps:res});
    })
  }
})