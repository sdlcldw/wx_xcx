const app = getApp()
Page({
  data: {
    sq:'',
    loading: false,
    username: '',
    password: '',
  },
  onLoad: function () {
    this.setData({sq:wx.getStorageSync('ifsq')})
      this.WxValidate = app.wxValidates({
        username: {
          required: true,
          minlength: 2,
          maxlength: 5,
        },
        password: {
          required: true,
          minlength: 6,
          maxlength: 24,
        }
      }, {
          username: {
            required: '用户名不可为空',
            minlength: '账号应大于2位',
            maxlength: '账号应小于5位',
          },
          password: {
            required: '密码不可为空',
            minlength: '密码应大于6位',
            maxlength: '密码应小于24位',
          }
        }
      )
  },

  usernameInput: function (e) {
    this.setData({
      username: e.detail.value
    })
  },


  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },



  onGotUserInfo: function (e) {
    //判断是否同意授权
    if (!e.detail.userInfo) {
      console.log('拒绝授权！')
      wx.showToast({
        title: `请允许微信授权`,
        image: '../../images/warning.png',
        duration: 2000
      })
      return;
    } else {
      wx.setStorageSync('ifsq', true)
      this.setData({
        sq:wx.getStorageSync('ifsq')
      })
    }
  },

  login: function () {
    var that = this;
    // 模拟from表单格式检验表单数据
    let data = {
      detail: {
        value: {
          username: this.data.username,
          password: this.data.password
        }
      }
    }
    if (!this.WxValidate.checkForm(data)) {
      const error = this.WxValidate.errorList[0]
      wx.showToast({
        title: `${error.msg} `,
        image: '../../images/warning.png',
        duration: 2000
      })
      return false
    }

    //设置按钮样式
    this.setData({
      loading: true
    }),
      //执行登录操作
      wx.login({
        success: res => {
          // 查看是否授权
          wx.getSetting({
            success: function (ress) {
              if (ress.authSetting['scope.userInfo']) {
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                wx.getUserInfo({
                  success: function (e) {
                    console.log('getuserinfo:')
                    console.log(e)
                    // 发送 res.code 到后台换取 openId, sessionKey, unionId
                    if (res.code) {
                      //发起网络请求
                      wx.request({
                        url: app.url + 'wx/login',
                        method: 'POST',
                        data: {
                          code: res.code,
                          username: that.data.username,
                          password: that.data.password,
                          rawData: e.rawData,
                          signature: e.signature,
                        },
                        success: res => {
                          if (res.data == '用户名或密码错误'){
                            wx.showToast({
                              title: `账号或密码错误`,
                              image: '../../images/warning.png',
                              duration: 2000
                            });
                            that.setData({
                              loading: false
                            });
                            return;
                          }
                          wx.setStorageSync('session_key', res.data.sessionid)
                          wx.setStorageSync('ptzh', res.data.ptzh)
                          console.log(wx.getStorageSync('ptzh'))
                          console.log('login网络请求：');
                          console.log(res);
                          wx.showToast({
                            title: '成功登录',
                            icon: 'success',
                            duration: 1500
                          })
                          setTimeout(()=>{wx.reLaunch({
                            url: '../my/my'
                          })}, 1500);
                        }
                      })
                    } else {
                      console.log('登录失败！' + res.errMsg)
                    }
                  }
                })
              } else {
                wx.setStorageSync('ifsq', false)
                this.setData({ sq: false })
              }
            }
          })
        }
      })
  }

})
