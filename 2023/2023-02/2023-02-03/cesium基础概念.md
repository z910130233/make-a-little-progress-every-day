# cesium入门基础概念

## 一、坐标展现形式

在cesium中，对于坐标数值单位有三种：角度、弧度和坐标值

###  1.角度

角度就是我们所熟悉的经纬度，对于地球的坐标建立如下：

![](http://imgconvert.csdnimg.cn/aHR0cHM6Ly9pbWcyMDE4LmNuYmxvZ3MuY29tL2Jsb2cvMTAwOTA4MC8yMDE5MDcvMTAwOTA4MC0yMDE5MDcwMTIxMzUxODA5NC02Mjg2MzY1NTYucG5n?x-oss-process=image/format,png)

图中以本初子午线作为x和z的面，建立了一个空间坐标系。可知在纬度方向上，角1的范围为-90~90，即南纬90°~北纬90°，角2的范围是-180~180，即东经180°~西经180°。

### 2.弧度
角度还可以用弧度表示，初中数学知识，180°=Π。在cesium中很多函数的参数都是使用弧度作为单位。

### 3.坐标值

这个坐标值就如上图中所建立的坐标系，但是不同的是数值是我们所说的坐标系的数据，例如Cartesian3（笛卡尔坐标系）对象中的x、y、z所代表的数值。那么这个对象所代表的值是什么样的范围呢？我们使用可以将地图的0，0点作为经纬度转换为cartesian3对象，并将其输出例如：
```javascript
const point = Cesium.Cartesian3.fromDegrees(0,0,0);
console.log(point);
```
结果为(6378137, 0, 0)，为什么x坐标会是6378137呢？这是因为Cartesian3在创建的时候，是需要设置椭球体，也就是地球的。我们上面使用的方法的api如下

![](http://imgconvert.csdnimg.cn/aHR0cHM6Ly9pbWcyMDE4LmNuYmxvZ3MuY29tL2Jsb2cvMTAwOTA4MC8yMDE5MDgvMTAwOTA4MC0yMDE5MDgwMzEzNDQwOTQ5MS0xNjgzNzUxOTE4LnBuZw?x-oss-process=image/format,png)

第三个参数就是设置椭球体。默认是Ellipsoid.WGS84，我们把这个椭球体输出得到的是：(6378137, 6378137, 6356752.314245179)，可以看到这个x坐标的值就是我们（0，0）点最后转换后的X坐标的值，构建一下坐标系可能会更清楚些：

![](http://imgconvert.csdnimg.cn/aHR0cHM6Ly9pbWcyMDE4LmNuYmxvZ3MuY29tL2Jsb2cvMTAwOTA4MC8yMDE5MDgvMTAwOTA4MC0yMDE5MDgwMzE0MTEyMzAzNS0xNzA2NTExNTkucG5n?x-oss-process=image/format,png)

这样的话，如果经纬度坐标是（90，0）转换成笛卡尔坐标就是（0，6378137，0），经纬度（0，-90）就是（0，0，-6356752.314245179）。另外可以将笛卡尔坐标的单位理解成米，圆心就是椭球的中心。这样当我们想要对cesium中的物体进行米级别的控制使用笛卡尔坐标系的表示就很好控制。

## cesium中重要的坐标线对象
### 世界坐标（Cartesian3：笛卡尔空间直角坐标系）
```javascript
new Cesium.Cartesian3(x, y, z)
```

可以看作，以椭球中心为原点的空间直角坐标系中的一个点的坐标。

### 经纬度坐标（Degrees）
地理坐标系，坐标原点在椭球的质心。

经度：参考椭球面上某点的大地子午面与本初子午面间的两面角。东正西负。

纬度 ：参考椭球面上某点的法线与赤道平面的夹角。北正南负。

Cesuim中没有具体的经纬度对象，要得到经纬度首先需要计算为弧度，再进行转换。

### 地理坐标（Cartographic）
```javascript
new Cesium.Cartographic(longitude, latitude, height)
```
这里的地理坐标是用弧度表示的经纬度坐标，弧度即角度对应弧长是半径的倍数。

角度转弧度 π / 180 × 角度

弧度转角度 180 / π × 弧度

除直接用公式转换之外，也可以直接用 Cesium.Math.toRadians() 和 Cesium.Math.toDegrees() API 进行转换。

相互转换
### 经纬度（Degrees）转换为世界坐标（Cartesian3）
第一种方法：直接转换
```javascript
Cesium.Cartesian3.fromDegrees(longitude, latitude, height, ellipsoid, result) 
```
第二种方法：先转换成弧度再转换，借助 ellipsoid 对象
```javascript
const ellipsoid=viewer.scene.globe.ellipsoid;
const cartographic=Cesium.Cartographic.fromDegrees(lng,lat,alt);
const cartesian3=ellipsoid.cartographicToCartesian(cartographic);
```
### 世界坐标（Cartesian3）转换为经纬度（Degrees）
```javascript
var ellipsoid=viewer.scene.globe.ellipsoid;
var cartesian3=new Cesium.cartesian3(x,y,z);
var cartographic=ellipsoid.cartesianToCartographic(cartesian3);
var lat=Cesium.Math.toDegrees(cartograhphic.latitude);
var lng=Cesium.Math.toDegrees(cartograhpinc.longitude);
var alt=cartographic.height;
```
同理，得到弧度还可以用
```javascript
Cartographic.fromCartesian
```
### 弧度（Cartographic）和经纬度（Degrees）
经纬度转弧度
```javascript
Cesium.Math.toRadians(degrees) 
```
弧度转经纬度
```javascript
Cesium.Math.toDegrees(radians) 
```
### 屏幕坐标（Cartesian2）和世界坐标（Cartesian3）相互转换
屏幕坐标转世界坐标
```javascript
var pick1= new Cesium.Cartesian2(0, 0);
var cartesian = viewer.scene.globe.pick(viewer.camera.getPickRay(pick1),viewer.scene);
```
注意这里屏幕坐标一定要在球上，否则生成出的 cartesian 对象是 undefined

### 世界坐标转屏幕坐标
```javascript
Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, Cartesian3);
```
结果是 Cartesian2 对象，取出 X, Y 即为屏幕坐标。
