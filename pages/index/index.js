const app = getApp()

Page({
  data: {
    ifloading: true,
  },
  onLoad: function () {

    if (wx.getStorageSync('firstLogin')) {
      console.log('首次进入小程序')
      this.iflogint();
      wx.setStorageSync('firstLogin', false);
    } else {
      if (!wx.getStorageSync('ifsq') || !wx.getStorageSync('session_key')) {
        wx.reLaunch({
          url: '../login/login'
        })
      } else {
        this.setData({
          ifloading: false
        })
      }
    }
   
  },
  iflogint: function () {
    new Promise(resolve => {
       wx.getSetting({
         success: function (res) {
           resolve(res)
         }
       })
     })
       .then(res => {
         if (res.authSetting['scope.userInfo']) {
           console.log('已授权')
           wx.setStorageSync('ifsq', true);
             // 如果未登录
             return new Promise(resolve => {
               wx.login({
                 success: res => {
                   if (res.code) {
                     //发起网络请求
                     resolve(res)
                   } else {
                     console.log('登录失败！' + res.errMsg)
                     return false;
                   }
                 }
               })
             })
         } else {
           console.log('未授权')
           wx.setStorageSync('ifsq', false);
           return false;
         }
       })
       .then(res => {
         if (res) {
           return new Promise(resolve => {
             wx.request({
               url: app.url + 'wx/wx_login',
               method: 'POST',
               data: {
                 code: res.code,
               },
               success: rest => {
                 resolve(rest)
               }
             })
           })
         } else {
           return false;
         }
       })
       .then(res => {
         if (res) {
          console.log('wx_login网络请求：');
          console.log(res);
          if (res.data == 2) {
             console.log('该微信号未绑定平台用户名，请登录')
            wx.reLaunch({
              url: '../login/login'
            })
           } else {
            console.log('该微信号已经绑定平台用户名')
        console.log('首次进入小程序，并已正常登陆')             
             wx.setStorageSync('session_key', res.data.sessionid)
             console.log(res.data.ptzh)
             wx.setStorageSync('ptzh', res.data.ptzh)
             this.setData({
              ifloading: false
            })
           }
         } else {
          wx.reLaunch({
            url: '../login/login'
          })
         }
       }
       )
   },
  gzcx:function(){
    console.log('点击工资查询按钮了')
    wx.navigateTo({
      url: '../gzcx/gzcx'
    })
  },
  txl:function(){
    console.log('通讯录按钮了')
    wx.navigateTo({
      url: '../txl/txl'
    })
  }
})
