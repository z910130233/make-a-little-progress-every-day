说明: 以前的系统是由其他的前辈写的，由于系统部署在内网中，不方便加载外网的瓦片资源，所以需要加载离线的瓦片作为地球效果查看。瓦片是由地图加载的层级分别加载，层级越大，所占的空间就越大，所以我这里只下载了1-7级的瓦片作为演示。

离线瓦片加载需要瓦片资源，我是从图新地球下载的瓦片资源，也可以从其他的资源下载，如果需要我的瓦片资源，请联系我即可。

关键代码

```javascript
this.viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
      //影像地图
      url: 'cesium/Source/Assets/googleImages/google-grid/{z}/{x}/{y}.png',
      // subdomains: Constants.subdomains,
    }));
```

然后刷新界面查看效果

瓦片资源 目录结构如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/b9f8b132d84c45a9b55b9118a2f722ec.png)
