var app = getApp()

Page({
  data: {
    xm:'',
    ifloading:true,
    loading:false,
    inputvalue:'',
  },

  onLoad: function(option){
    this.setData({xm:option.xm});
    var thes = this;
    app.dl_request('wx/get_user'+this.data.xm, 'GET')
    .then(res => {
      console.log(res)
      if (res) {
        thes.setData({inputvalue:res.data,ifloading:false})
      }
    });
  },
  
  bindinput:function(e){
    console.log(e)
    this.setData({inputvalue:e.detail.value})
  },
  qrxg:function(){
    this.setData({loading:true})
    console.log(this.data.inputvalue)
    var thes = this;    
    app.dl_request('wx/up_userinfo', 'GET',{xm:this.data.xm,data:this.data.inputvalue})
    .then(res => {
      console.log(res)
      if (res) {
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 2000
        })
        thes.setData({loading:false})
      }
    });
  }


})