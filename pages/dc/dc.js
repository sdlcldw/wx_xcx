const app = getApp();

function get_dc(thes){
  app.dl_request('wx/get_dc')
  .then(res => {
    console.log(res)
    let dczt;
    if (res.data.dcsj == 4) { //在正常订餐时间内
      if (res.data.mydczt == 1) {
        thes.setData({
          ifzt_a: true,
          ifzt_b: false,
          ifzt_c: false,
          mydczt: '已订餐',
          ifdc: false,
          ifqx: true,
          ifyjs: false,
          ifyqx: false,
          ifwks: false,
        })
      } else if (res.data.mydczt == 2) {
        thes.setData({
          ifzt_a: false,
          ifzt_b: true,
          ifzt_c: false,
          mydczt: '已取消今日订餐',
          ifdc: false,
          ifqx: false,
          ifyjs: false,
          ifwks: false,
          ifyqx: true,
        })
      } else {
        thes.setData({
          ifzt_a: false,
          ifzt_b: false,
          ifzt_c: true,
          mydczt: '未订餐',
          ifdc: true,
          ifqx: false,
          ifyjs: false,
          ifyqx: false,
          ifwks: false,
        })
      }
    }else if(res.data.dcsj == 2){//未开始
      thes.setData({
        ifzt_a: false,
        ifzt_b: false,
        ifzt_c: true,
        mydczt: '未开始',
        ifdc: false,
        ifqx: false,
        ifyjs: false,
        ifwks: true,
        ifyqx: false,
      })
    }else if(res.data.dcsj == 3){//已结束
      thes.setData({
      ifdc: false,
      ifqx: false,
      ifyjs: true,
      ifyqx: false,
      ifwks: false,
    })
      if (res.data.mydczt == 1) {
        thes.setData({
          ifzt_a: true,
          ifzt_b: false,
          ifzt_c: false,
          mydczt: '已订餐',
        })
      } else if (res.data.mydczt == 2) {
        thes.setData({
          ifzt_a: false,
          ifzt_b: true,
          ifzt_c: false,
          mydczt: '已取消今日订餐',
        })
      } else {
        thes.setData({
          ifzt_a: false,
          ifzt_b: false,
          ifzt_c: true,
          mydczt: '未订餐',
        })
      }
    }
    thes.setData({
      lsdcrs: res.data.lsdcrs,
      jrdcrs: res.data.jrdcrs,
      mylsdc: res.data.mylsdc,
      jrcd: res.data.jrcd,
      dcsj: res.data.sj,
      ifloading: false,
    })
    let timea = res.data.djs
    if(timea >= 0) {
      var h = Math.floor(timea / 60 / 60 % 24);
      var m = Math.floor(timea / 60 % 60);
      var s = Math.floor(timea % 60);
       if(s < 10) {
           s = "0" + s;
       }
       if(m < 10) {
           m = "0" + m;
       }
       if(h < 10) {
           h = "0" + h;
       }
     thes.setData({
       djs : h + '：' + m +'：'+ s 
     })
   } else {
     thes.setData({
       djs : '已结束'
     })
    }
    var interval = setInterval(function(){
      if(timea >= 0) {
       var h = Math.floor(timea / 60 / 60 % 24);
       var m = Math.floor(timea / 60 % 60);
       var s = Math.floor(timea % 60);
        if(s < 10) {
            s = "0" + s;
        }
        if(m < 10) {
            m = "0" + m;
        }
        if(h < 10) {
            h = "0" + h;
        }
        timea -= 1;
      thes.setData({
        djs : h + '：' + m +'：'+ s 
      })
    } else {
      thes.setData({
        djs : '已结束'
      })
        clearInterval(interval); //结束循环
    }
  }
  ,1000)
  });
}

Page({
  data: {
    ifloading: true,
    ifdc: false,
    ifqx: false,
    ifyjs: false,
    ifyqx: false,
    ifwks: false,
    lsdcrs: 0,
    jrdcrs: 0,
    mydczt: '',
    mylsdc: 0,
    jrcd: {},
    ifzt_a: true,
    ifzt_b: false,
    ifzt_c: false,
    dcsj: {},
    djs: ''
  },
  onLoad: function () {
    let thes = this;
    get_dc(thes);
  },

  dc_click: function () {
    console.log('订餐click')
    let thes = this;
    app.dl_request('wx/add_dc')
      .then(res => {
        console.log(res)
        if (res.data == 1) {
          wx.showToast({
            title: '订餐成功',
            icon: 'success',
            duration: 2000
          })
          this.setData({
            ifdc: false,
            ifqx: true,
            ifyjs: false
          })
        } else if (res.data == 2) {
          wx.showToast({
            title: '今日已订餐！',
            icon: 'success',
            duration: 2000
          })
        } else if (res.data == 3) {
          wx.showToast({
            title: '今日无订餐资格！',
            icon: 'success',
            duration: 2000
          })
        }
      });
      get_dc(thes);
  },

  qx_click: function () {
    var thet = this;
    console.log('取消订餐click')
    wx.showModal({
      title: '取消后今日将：',
      content: '无法再次重复订餐，确定取消订餐吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.dl_request('wx/dele_dc')
            .then(res => {
              console.log(res)
              wx.showToast({
                title: '已取消订餐！',
                icon: 'success',
                duration: 2000
              })
              thet.setData({
                ifdc: true,
                ifqx: false,
                ifyjs: false
              })
            });
            get_dc(thet);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  dc_ct:function(){
    console.log('订餐-餐厅按钮点击')
    wx.navigateTo({
      url: '../dc_ct/dc_ct'
    })
  },
  dc_cw:function(){
    console.log('订餐-财务按钮点击')
    wx.navigateTo({
      url: '../dc_cw/dc_cw'
    })
  },
    dc_gly:function(){
    console.log('订餐-管理员按钮点击')
    wx.navigateTo({
      url: '../dc_gly/dc_gly'
    })
  }














})
