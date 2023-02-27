# wms操作，根据wms图层获取extent范围

先了解一些概念，wms图层可以根据GetCapabilities获取文档，文档中有我所需要的数据，仅需解析就好，官方例子链接：https://openlayers.org/en/latest/examples/wms-capabilities.html

直接上代码
```javascript
return new Promise((resolve) => {
                const self = this;
                const wmsSource = new ol.source.ImageWMS({
                    url: url,
                    params: {
                        'FORMAT': 'image/png',
                        'VERSION': '1.1.0',
                        LAYERS: layerName,
                    }
                })
                const xmlUrl = wmsSource.getUrl() + "?service=WMS&version=1.1.0&request=GetCapabilities&layers=" + layerName;
                let extent = [];
                const parser = new ol.format.WMSCapabilities();
                fetch('http://localhost:8848/wegisGlobeSea/data/getcapabilities_1.3.0%20(1).xml')
                    .then(function (response) {
                        return response.text();
                    })
                    .then(function (text) {
                        const result = parser.read(text);
                        extent = result.Capability.Layer.Layer[2].BoundingBox[0].extent;

                        const wmsLayer = new ol.layer.Image({
                            source: wmsSource,
                            zIndex: 99999,
                            extent: extent
                        })
                        wmsLayer.set("id", layerId);
                        self.map.addLayer(wmsLayer);
                        resolve(true)
                    });
            })
```

# map操作，移动至extent范围中
```javascript
const CPIS_USA_layer = self.getLayer("CPIS_USA", self.map);
var extent = CPIS_USA_layer.getExtent();
var r = self.map.getView().getResolutionForExtent(extent, self.map.getSize());
// self.map.getView().setResolution(r);
// self.map.getView().setCenter(ol.extent.getCenter(extent));
self.map.getView().animate({
    center: ol.extent.getCenter(extent),
    resolution: r,
    duration: 1000
})
```