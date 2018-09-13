const app = getApp();

Page({
  data: {
    ifloading: true,
    ifsearch: false,
    searchData: [],
  },
  onLoad: function () {
    // let data = wx.getStorageSync('txl_data')
    // if (data) {
    //   console.log('在本地取数据')
    //   this.setData({ groups: data.bms, friends: data.rys ,ifloading: false })
    // } else {
      // console.log('在网络取数据')      
      let thes = this;
      app.dl_request('wx/get_txl', 'GET')
        .then(res => {
          console.log(res)
          if (res) {
            let bms = res.data.bms, rys = res.data.rys;
            for (var i = 0, len = bms.length; i < len; ++i) {
              bms[i].hidden = true;
            }
            let txl_data ={
              bms : bms,
              rys : rys
            }
            // wx.setStorageSync('txl_data', txl_data);
            thes.setData({ groups: bms, friends: rys, ifloading: false })
          }
        });
    // }
  },
  groupclick: function (e) {
    console.log(e.currentTarget.id)
    var id = e.currentTarget.id, groups = this.data.groups;
    for (var i = 0, len = groups.length; i < len; ++i) {
      if (groups[i].id == id) {
        groups[i].hidden = !groups[i].hidden;
      }
    }
    this.setData({
      groups: groups
    });
  },
  searchInput: function (e) {
    console.log(e)
    if (e.detail.cursor == 0) {
      this.setData({ ifsearch: false })
      return
    } else {
      var value = e.detail.value, friends = this.data.friends;
      this.setData({ ifsearch: true })
      let data = [];
      for (var i = 0, len = friends.length; i < len; ++i) {
        if (friends[i].username.indexOf(value) != -1) {
          console.log(friends[i])
          data.push(friends[i])
        }
      }
      this.setData({ searchData: data });
    }
  },
  mpxq: function (event) {
    let sj = event.currentTarget.dataset.sj, bm = event.currentTarget.dataset.bm;
    console.log(sj)
    wx.navigateTo({
      url: '../txl_mp/txl_mp?bm=' + bm + '&phone=' + sj.phone + '&phone_bg=' + sj.phone_bg + '&phone_d=' + sj.phone_d + '&sex=' + sj.sex + '&username=' + sj.username + '&email=' + sj.email
    })
  }
})
