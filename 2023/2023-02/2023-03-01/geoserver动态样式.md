# geoserver sld样式配置之栅格配置

#### 业务中使用到了geoserver，但是对gis知识这方面知之甚少，所以边学边用，查看了翻译的中文文档（英文能力有限）https://www.osgeo.cn/geoserver-user-manual/styling/sld/reference/rastersymbolizer.html

#### 业务需要，需动态设置最大最小值以及多个值的情况，所以需要使用文档中的cql表达式，如下：

```javascript
<ColorMapEntry color="#00FF00" quantity="${env('low',3)}" label="Low" opacity="1"/>
<ColorMapEntry color="#FFFF00" quantity="${env('medium',10)}" label="Medium" opacity="1"/>
<ColorMapEntry color="#FF0000" quantity="${env('high',1000)}" label="High" opacity="1"/>
```
#### 使用时本地openlayers加载wms图层时将ENV参数添加到url中一起调用，即可实现动态样式
http://localhost:8080/geoserver/wms?REQUEST=GetMap&VERSION=1.0.0&...&ENV=low:10;medium:100;high:500
