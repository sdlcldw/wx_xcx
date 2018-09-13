const app = getApp();
Page({
  data:{
    hiddenLoading:false,
    ifhtgz:true,
    value: [0],
    years: [],
    datas:'',
    cxyf:'',
    htgz_xd:[],
    ifhtgz_xd:false,
    htgzcx_loading:false,
    tggz_yfs:[],
    tggz_cxyf:'',
    iftggz_xd:false,
    tggzcx_loading:false,
    tggz_xd:[],    
  },
  
  onLoad: function () {
        app.dl_request('wx/get_htgz_rqlb') 
          .then(res =>{
            if(res){
               this.setData({years:res.data,cxyf:res.data[0],hiddenLoading:true})
               console.log(this.tears)
            }
          });
        },
        
  htgz: function () {
      console.log('点击了合同工资按钮')
      this.setData({ifhtgz:true})
  },

  tggz: function () {
    console.log('点击了套改工资按钮')
    this.setData({hiddenLoading:false})
    var thet = this;
    app.dl_request('wx/get_tggz_rqlb') 
          .then(res =>{
            console.log(res.data.length)
            if(res.data.length == 0){
              wx.showToast({
                title: `无套改工资数据`,
                image: '../../images/warning.png',
                duration: 2000
              });
            }else{
              thet.setData({tggz_yfs:res.data,tggz_cxyf:res.data[0],ifhtgz:false})
            }
    this.setData({hiddenLoading:true})            
          });
        },
  bindChange: function (e) {
    const val = e.detail.value
    this.setData({
      cxyf: this.data.years[val[0]],
    })
    console.log(this.data.cxyf)
  },
  htgz_cx:function(){
    this.setData({htgzcx_loading:true})
    var thet = this;    
    app.dl_request('wx/htgz_cx','POST',this.data.cxyf) 
          .then(res =>{
            if(res){
               console.log(res)
              thet.setData({htgz_xd:res.data,ifhtgz_xd:true,htgzcx_loading:false})
              console.log(thet.data.htgz_xd)
            }
          });
  },
  tggz_cx:function(){
    this.setData({tggzcx_loading:true})
    var thet = this;    
    app.dl_request('wx/tggz_cx','POST',this.data.tggz_cxyf)
          .then(res =>{
            if(res){
               console.log(res)
              thet.setData({tggz_xd:res.data,iftggz_xd:true,tggzcx_loading:false})
              console.log(thet.data.tggz_xd)
            }
          });
  }

})
