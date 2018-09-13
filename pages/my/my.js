var app = getApp()
Page({
  data: {
    ptzh: '',
    userInfo: {}
  },
  onLoad: function () {
    var that = this

    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        ptzh: wx.getStorageSync('ptzh'),
        userInfo:userInfo
      })
    })
  },
  xgsjh:function(){
    console.log('点击修改手机号')
    wx.navigateTo({
      url: "../my_xg/my_xg?xm=phone"
    })
  },
  xgsjdh:function(){
    console.log('点击修改手机短号')
    wx.navigateTo({
      url: "../my_xg/my_xg?xm=phone_d"
    })
  },
  xgbgdh:function(){
    console.log('点击修改办公电话')
    wx.navigateTo({
      url: "../my_xg/my_xg?xm=phone_bg"
    })
  },
  xgyx:function(){
    console.log('点击修改邮箱')
    wx.navigateTo({
      url: "../my_xg/my_xg?xm=email"
    })
  },
  exit:function(){
    console.log('点击退出按钮了')
    wx.showModal({
      title: '退出登录后将：',
      content: '解除办公平台账号与微信账号的关联，无法使用微信自动登录办公平台功能。',
      success: function(res) {
        if (res.confirm) {
          app.dl_request('wx/exit','GET')
          .then(res =>{
            if(res){
              wx.showToast({
                title: '成功退出',
                icon: 'success',
                duration: 2000
              })
              setTimeout(()=>{wx.reLaunch({
                url: '../login/login'
              })}, 1500);
            }
            console.log(res) 
          });
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

})