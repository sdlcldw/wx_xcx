//app.js
//导入表单验证js
import wxValidate from 'utils/wxValidate.js'

App({

  wxValidates: (rules, messages) => new wxValidate(rules, messages),

  url: "https://www.oa.sdlcycxx.com/oa/basic/web/index.php?r=",

  onLaunch: function () {

    wx.setStorageSync('firstLogin', true);

  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null
  },
  dl_request: function (url, method, data) {
    if (!method) {
      method = 'GET';
    }
    return new Promise(resolve => {
      wx.request({
        url: this.url + url, //仅为示例，并非真实的接口地址
        method: method,
        data: data,
        header: {
          'sessionid': wx.getStorageSync('session_key')
        },
        success: function (res) {
          if (res.data == '未登录') {
            wx.showToast({
              title: `未登录`,
              image: '../../images/warning.png',
              duration: 2000,
            });
            setTimeout(() => {
              wx.reLaunch({
                url: '../login/login'
              })
            }, 1500);
          } else {
            resolve(res)
          }
        },
        fail: function (err) {
          console.log(err)
        }
      })
    })
  }
})

