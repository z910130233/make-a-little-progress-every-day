# 获取点击的坐标点
高度为0

```javascript
 const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(function(evt: any) {
      const cartesian = viewer.camera.pickEllipsoid(evt.position,viewer.scene.globe.ellipsoid);
      const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
      const lng = Cesium.Math.toDegrees(cartographic.longitude);//经度值
      const lat = Cesium.Math.toDegrees(cartographic.latitude);//纬度值
      const mapPosition = {x:lng,y:lat,z:cartographic.height};//cartographic.height的值始终为零。
      console.log(mapPosition)
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
```