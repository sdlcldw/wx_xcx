const app = getApp();

Page({
  data: {
    mp_data:[]
  },
  onLoad: function(option){
    this.setData({mp_data:option})
    console.log(this.data.mp_data)
  },
  call:function(event){
    let phone = event.currentTarget.dataset.phone
    console.log(phone);
    wx.makePhoneCall({
      phoneNumber: phone 
    })
  },
  call_d:function(event){
    let phone = event.currentTarget.dataset.phone
    console.log(phone);
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  call_bg:function(event){
    let phone = event.currentTarget.dataset.phone
    console.log(phone);
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
})
