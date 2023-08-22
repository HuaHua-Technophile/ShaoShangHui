const app = getApp(); // 获取应用实例
Page({
  data: {
    navBarFullHeight: 0, // 整个导航栏高度
    goodData: {}, //商品的所有文本信息
    goodSwiper: [], //商品的头部轮播图
    activeIndex: 0, //商品的头部轮播图的激活序号
    productLabel: [], //商品标签
    productIntro: [], //商品的下方介绍图
    cartTabbarHeight: 0, //底部"加购/购买"栏的高度
    pageContainerShow: false, //假页面容器显示状态
    hiddenTabbarBtn: 0, //是同时展示加购/购买,还是其中一个
  },
  //轮播图变更时,修改右下方序号
  changeActiveIndex(e) {
    console.log("轮播图切换=>", e);
    this.setData({
      activeIndex: e.detail.current,
    });
  },
  // 点击选择规格,并加入购物车/立即购买
  showPageContainer(e) {
    this.setData({
      pageContainerShow: true,
      hiddenTabbarBtn: e.currentTarget.dataset.status,
    });
    console.log("点击显示规格弹窗", e, this.data.hiddenTabbarBtn);
  },
  onLoad(options) {
    this.setData({ navBarFullHeight: app.globalData.navBarFullHeight });
    // 查询底部"加购/购买"栏高度为多少
    let query = wx.createSelectorQuery();
    query
      .select(".cart-tabbar")
      .boundingClientRect((rect) => {
        this.setData({
          cartTabbarHeight: rect.height,
        });
      })
      .exec();
    // 获取商品轮播图
    app
      .ajax({
        path: "/product/queryProductSwiper",
        data: { productId: options.id },
      })
      .then((res) => {
        console.log("获取到了商品轮播图=>", res, app.globalData.https);
        this.setData({
          goodSwiper: res.data.data.map((item) => {
            item.image = app.globalData.https + item.image;
            return item;
          }),
        });
      });
    // 获取商品详情文本
    app
      .ajax({
        path: "/product/queryProductDetail",
        data: { productId: options.id },
      })
      .then((res) => {
        console.log("获取到了商品数据=>", res);
        this.setData({
          goodData: res.data.data.productDetails,
        });
      });
    // 获取商品标签
    app
      .ajax({
        path: "/product/queryProductLabel",
        data: { productId: options.id },
      })
      .then((res) => {
        console.log("获取到了商品标签=>", res);
        this.setData({
          productLabel: res.data.data,
        });
      });
    // 获取商品底部介绍图(多图拼凑)
    app
      .ajax({
        path: "/product/queryProductIntro",
        data: { productId: options.id },
      })
      .then((res) => {
        console.log("获取到了商品介绍图=>", res);
        this.setData({
          productIntro: res.data.data.map((item) => {
            item.image = app.globalData.https + item.image;
            return item;
          }),
        });
      });
  },
  onReady() {},
  onShow() {},
  onHide() {},
  onUnload() {},
  onPullDownRefresh() {},
  onReachBottom() {},
  onShareAppMessage() {},
});
