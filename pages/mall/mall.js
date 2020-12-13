// 引用百度地图微信小程序JSAPI模块 
var bmap = require('../../lib/js/bmap-wx.min.js'); 
const app=getApp();
var wxMarkerData = []; 
var mapSearch=null;
Page({ 
    data: { 
        markers: [], 
        latitude: '', 
        longitude: '', 
        placeData: {} ,
        markerUrl:app.globalData.baseUrl+"/Content/Img/site.png",
        markerUrl2:app.globalData.baseUrl+"/Content/Img/site_o.png"
    }, 
    makertap: function(e) { 
        var that = this; 
        var id = e.markerId; 
        that.showSearchInfo(wxMarkerData, id); 
        that.changeMarkerColor(wxMarkerData, id); 
    }, 
    onLoad: function() { 
        var that = this; 
        // 新建百度地图对象 
        var BMap = new bmap.BMapWX({ 
            ak: '0Yv7jptTohjTUrzCvZjBmXP4jOrHCIx4' 
        }); 
        wx.getLocation({
          success:function(res){
            that.setData({ 
              latitude: res.latitude,
              longitude:res.longitude
            });
          }
        })
        mapSearch=function(keyword){
          BMap.suggestion({ 
            "query": keyword,
            region: '上海', 
            city_limit: true,
            success: function(res){
              var list=[];
              var data=res.result;
              console.log(data);
              for(var i=0;i<data.length;i++){
                list.push({name:data[i].name,latitude:data[i].location.lat,longitude:data[i].location.lng});
              }
              //console.log(list);
              that.setData({searchList:list});
            }
          }); 
        }
        app.get2("/Map/GetRentRoom",{},function(res){
          //console.log(res);
          for(var i=0;i<res.length;i++){
            res[i].room.paths=[];
            if(res[i].room.Url){
              res[i].room.paths=res[i].room.Url.split("|").map(function(it){return app.globalData.baseUrl+"/Upload/Room/"+it})
            }
          }
          var groupData=that.groupBy(res,"Point");
          //console.log(groupData);
          var mark=[];
          for(var i=0;i<groupData.length;i++){
            if(groupData[i][0].Point.indexOf(",")>-1){
              var point=groupData[i][0].Point.split(",");
              point[0]=Number(point[0])-0.0065;
              point[1]=Number(point[1])-0.0060;
              mark.push({id:i,longitude:point[0],latitude:point[1],iconPath:that.data.markerUrl,iconTapPath:that.data.markerUrl2,rooms:groupData[i]})
            }   
          }
          wxMarkerData=mark;
          that.setData({ 
            markers: mark 
         });   
        })
    }, 
    showSearchInfo: function(data, i) { 
        var that = this; 
        that.setData({ 
            placeData: data[i]
        }); 
    }, 
    changeMarkerColor: function(data, i) { 
        var that = this; 
        var markers = []; 
        for (var j = 0; j < data.length; j++) { 
            if (j == i) { 
                // 此处需要在相应路径放置图片文件 
                data[j].iconPath = this.data.markerUrl2; 
            } else { 
                // 此处需要在相应路径放置图片文件 
                data[j].iconPath = this.data.markerUrl; 
            } 
            markers[j]=data[j]; 
        } 
        that.setData({ 
            markers: markers 
        }); 
    },
    search:function(){
      //console.log(this.data.keyword);
      mapSearch(this.data.keyword);
    },
    changekey:function(e){
      this.setData({
        keyword: e.detail.value
      })
    },
    planTo:function(e){
      var data=e.currentTarget.dataset;
      this.setData({ 
        latitude: data.latitude,
        longitude:data.longitude,
        searchList:[]
      });
    },
    infoClose:function(){
      this.setData({placeData:{}});
    },
    groupBy:function(array, name){
      const groups = {};
      array.forEach(function (o) {
          const group = o[name];
          groups[group] = groups[group] || [];
          groups[group].push(o);
      });
      return Object.keys(groups).map(function (group) {
          return groups[group];
      });
    },
    prevImg(e){
      const {x,y}=e.currentTarget.dataset;
      var imgs=this.data.placeData.rooms[x].room.paths;
      wx.previewImage({
        urls: imgs,
        current:imgs[y]
      })
    }
})