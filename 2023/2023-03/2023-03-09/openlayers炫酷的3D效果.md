##### 先上效果图，可用于大屏展示的效果
![在这里插入图片描述](https://img-blog.csdnimg.cn/8734ba871bb9420cb7d004fef3426678.png)
3D效果设计如下[openlayers(一)添加3D图](https://blog.csdn.net/zelzjjdj/article/details/129144177?spm=1001.2014.3001.5501)
*注：偏移量需要根据实际的多边形大小来设置*


在之前的基础上添加了阴影效果，并加上canvas滤镜

### 添加滤镜效果，专为一个图层添加滤镜
```javascript
this.googleImgLayer = new TileLayer({
      className: 'stamen',
      source: new XYZ({
        // url: 'https://gac-geo.googlecnapps.cn/maps/vt?lyrs=s,m&gl=&x={x}&y={y}&z={z}',
        url: 'http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=' + OlMapConfig.tk,
        wrapX: false,
        crossOrigin: "anonymous",
        tileLoadFunction: function (imageTile: any, src: string) {
          // 使用滤镜 将白色修改为深色
          let img = new Image()
          // img.crossOrigin = ''
          // 设置图片不从缓存取，从缓存取可能会出现跨域，导致加载失败
          img.setAttribute('crossOrigin', 'anonymous')
          img.onload = function () {
            let canvas = document.createElement('canvas')
            let w = img.width
            let h = img.height
            canvas.width = w
            canvas.height = h
            let context: any = canvas.getContext('2d')
            context.filter = 'grayscale(98%) invert(100%) sepia(20%) hue-rotate(180deg) saturate(1600%) brightness(80%) contrast(90%)'
            // context.filter = 'sepia(100%)'
            context.drawImage(img, 0, 0, w, h, 0, 0, w, h)
            imageTile.getImage().src = canvas.toDataURL('image/png')
          }
          img.src = src
        },
      })
    })
```
### 添加阴影效果

```javascript
//添加阴影的图层
    const highlightLayer: any = olMap.addHighlightLayer(level2Layer);
    highlightLayer.setZIndex(-1)
    // highlightLayer.setOpacity(0.5)
    level2Source.once('change', (evt: any) => {
      const source = evt.target;
      if (source.getState() === 'ready') {
        source.forEachFeature((f: any) => {
          highlightLayer.setStyle(() => {
              return new Style({
                fill: new Fill({color: (f.style && f.style.getFill) ? f.style.getFill().getColor() : 'rgba(255,255,255,1)'}),
                // stroke: new Stroke({color: 'rgba(255, 255, 255, 0.2)', width: 5})
              });
            }
          );
          highlightLayer.getSource().addFeature(f);
        })
      }
    })
```

完整代码：[github](https://github.com/z910130233/make-a-little-progress-every-day/blob/main/map_example_test/src/pages/openlayersTest/example/OLExample_4.tsx)