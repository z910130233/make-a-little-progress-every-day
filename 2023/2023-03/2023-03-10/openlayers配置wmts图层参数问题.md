##### step1. 在geoserver中发布wmts图层首先需要在指定的工作区中勾上wmts
![在这里插入图片描述](https://img-blog.csdnimg.cn/4d8e9f6ffde442a28bc0254bccdc96d9.png)
##### step2. geoserver中添加数据存储
我这里是发布的多个tif，所以我选择ImageMosaic类型，弄好之后点击发布，配置好自己的发布参数，点击发布。
![在这里插入图片描述](https://img-blog.csdnimg.cn/33402abfb2eb455697766e2c8529c240.png)
发布完成之后可以在图层中预览，但是现在的图层是以wms方式来预览的
#####  setp3. 切片处理
![在这里插入图片描述](https://img-blog.csdnimg.cn/92ad8069e7c14bafab8ed47741b99901.png)
点击**tile Layers**项，选择要切片的图层之前，可以切换到**Gridsets**项，可以看到目前内置了几个坐标系的切片设置，如常见的4326坐标系，这个切片的设置跟后面openlayers展示wmts图层强关联，展示的时候再说
![在这里插入图片描述](https://img-blog.csdnimg.cn/9d155a4dfa2246a78affe8082f37b3d9.png)
回到切片**tile Layers**，点击**Seed/Truncate**进行切片
![在这里插入图片描述](https://img-blog.csdnimg.cn/a4134059a369412485cc23f172734ab1.png)
切片时选择自己的样式文件以及切片坐标系，点击submit进行切片
![在这里插入图片描述](https://img-blog.csdnimg.cn/cf9c5e3b4fea43c696a4780076d0f446.png)
点击submit后就会进行切片了，可以看到切片的进度，这里就不截图了，完成切片后回到**tile Layers**，点击这个即可预览wmts图层了
![在这里插入图片描述](https://img-blog.csdnimg.cn/258444c05d85465aa7a8a14ced4d6f4e.png)
##### setp4. openlayers展示wmts图层
我这里的版本是openlayers3，其它高版本的发布应该差不多，可能有细微差别，根据官方文档来看就好了
```javascript
function showWMTSLayer (url, layerId, layerName, zIndex) {
    return new Promise((resolve) => {
        const self = this;
        // 首先设置好WMTS瓦片地图的瓦片坐标系
        const projection = ol.proj.get('EPSG:4326');          // 获取web墨卡托投影坐标系
        const projectionExtent = projection.getExtent();      // web墨卡托投影坐标系的四至范围
        const width = ol.extent.getWidth(projectionExtent);   // web墨卡托投影坐标系的水平宽度，单位米
        const resolutions = [];                               // 瓦片地图分辨率
        const matrixIds = [];                                  //矩阵ID
        for (let z = 0; z < 11; z++) {
            resolutions[z] = width / (256 * Math.pow(2, z + 1));//注意这里的分辨率需要根据geoserver切片参数对应
            matrixIds[z] = "EPSG:4326:" + z;              // 注意这里的matrixId的格式为EPSG:4326:z
        }
        const wmtsTileGrid = new ol.tilegrid.WMTS({
            origin: ol.extent.getTopLeft(projectionExtent), // 原点（左上角）
            resolutions: resolutions,                       // 瓦片地图分辨率
            matrixIds: matrixIds,                           // 矩阵ID，就是瓦片坐标系z维度各个层级的标识
        });

        // WMTS数据源与地图
        const wmtsSource = new ol.source.WMTS({
            url: url,
            layer: layerName,                   // 图层名
            matrixSet: 'EPSG:4326',           // 投影坐标系参数矩阵集
            format: 'image/png',                // 图片格式
            projection: projection,             // 投影坐标系
            // 投影坐标系
            tileGrid: wmtsTileGrid
        });

        console.log(wmtsSource.getUrls())
        const xmlUrl = wmtsSource.getUrls()[0] + "?service=WMTS&version=1.0.0&request=GetCapabilities&layers=" + layerName;
        let extent = [];
        const parser = new ol.format.WMTSCapabilities();
        fetch(xmlUrl)
            .then(function (response) {
                return response.text();
            })
            .then(function (text) {
                const result = parser.read(text);
                const Layers = result.Contents.Layer;
                for (let i = 0; i < Layers.length; i++) {
                    if (Layers[i].Identifier === layerName) {
                        extent = Layers[i].WGS84BoundingBox;
                        break;
                    }
                }

                const wmtsLayer = new ol.layer.Tile({
                    source: wmtsSource,
                    zIndex: zIndex,
                    extent: extent
                })
                wmtsLayer.set("id", layerId);
                self.map.addLayer(wmtsLayer);
                resolve(true)
            });
    })
}
```
代码说明：代码中为啥做了个获取xml的操作，这个是根据**GetCapabilities**获取当前图层的属性，我这里获取的是图层的范围

上面切片的时候里面有个坐标系方案**Gridsets**，代码中的resolutions分辨率，需要根据切片方案来设置，如4326坐标系要openlayers和geoserver中对应（我估计这个可以自定义切片方案，只要这个设置相同就能显示，虽然没做过）
![在这里插入图片描述](https://img-blog.csdnimg.cn/dd6e668d097b4a09aa7e20bf4ba97b6c.png)
end