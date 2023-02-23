import * as Cesium from "cesium";
import {Constants} from "@/pages/cesiumTest/components/Constants";
import mapData from "@/assets/mapData/CHN.json";

export enum InitLayer {
  TDT = '天地图',
  OffLine = '本地资源',
  NONE = '无图层',
}

export class BasicMap {
  viewer: any;

  constructor(el: string, layers?: InitLayer) {
    Cesium.Ion.defaultAccessToken = Constants.IcoAccessToken;
    this.viewer = new Cesium.Viewer(el, {
      shouldAnimate: false,
      animation: false,       //动画
      homeButton: true,       //home键
      geocoder: false,         //地址编码
      baseLayerPicker: false, //图层选择控件
      timeline: true,        //时间轴
      fullscreenButton: false, //全屏显示
      infoBox: false,         //点击要素之后浮窗
      sceneModePicker: true,  //投影方式  三维/二维
      navigationInstructionsInitiallyVisible: false, //导航指令
      navigationHelpButton: false,     //帮助信息
      selectionIndicator: false, // 选择
      // scene3DOnly: true, //如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
      skyAtmosphere: false,
      contextOptions: {
        webgl: {
          alpha: true,
        },
      },
    });

    // 设置基本属性
    // this.viewer.scene.sun.show = false;
    // this.viewer.scene.moon.show = false;
    // this.viewer.scene.skyBox.show = false; //关闭天空盒，否则会显示天空颜色
    // this.viewer.scene.undergroundMode = true;
    // this.viewer.scene.globe.show = true;
    // this.viewer.scene.backgroundColor = new Cesium.Color(0, 0, 0, 0);
    // this.viewer.scene.screenSpaceCameraController.minimumZoomDistance = 1000;
    // this.viewer.scene.screenSpaceCameraController.maximumZoomDistance = 5600000;
    // if (Cesium.FeatureDetection.supportsImageRenderingPixelated()) {
    //   //判断是否支持图像渲染像素化处理
    //   this.viewer.resolutionScale = window.devicePixelRatio;
    // }
    // this.viewer.scene.fxaa = true;
    // this.viewer.scene.postProcessStages.fxaa.enabled = true;

    this.viewer.cesiumWidget.creditContainer.style.display = "none";      //去除版权信息
    this.viewer.scene.globe.enableLighting = false;        //添加光照阴影

    switch (layers) {
      case InitLayer.TDT: {
        this.initTDTLayers();
        break;
      }
      case InitLayer.OffLine: {
        this.initOffLineMaps();
        break;
      }
      case InitLayer.NONE: {
        break;
      }
      case undefined: {
        this.initDefaultLayers();
        break;
      }
    }
  }

  initTDTLayers() {
    this.viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
      //影像底图
      url: "http://t{s}.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=" + Constants.tdtToken,
      subdomains: Constants.subdomains,
      layer: "tdtImgLayer",
      style: "default",
      format: "image/jpeg",
      tileMatrixSetID: "GoogleMapsCompatible",    //使用谷歌的瓦片切片方式
    }));

    this.viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
      //影像注记
      url: "http://t{s}.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=" + Constants.tdtToken,
      subdomains: Constants.subdomains,
      layer: "tdtCiaLayer",
      style: "default",
      format: "image/jpeg",
      tileMatrixSetID: "GoogleMapsCompatible",
    }));

    // 叠加国界服务
    const iboMap = new Cesium.UrlTemplateImageryProvider({
      url: Constants.tdtUrl + 'DataServer?T=ibo_w&x={x}&y={y}&l={z}&tk=' + Constants.tdtToken,
      subdomains: Constants.subdomains,
      tilingScheme: new Cesium.WebMercatorTilingScheme(),
      maximumLevel: 10
    });
    this.viewer.imageryLayers.addImageryProvider(iboMap);
  }

  initDefaultLayers() {
    this.viewer.imageryLayers.addImageryProvider(new Cesium.IonImageryProvider({assetId: 3954}));
  }

  initOffLineMaps() {
    this.viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
      //影像地图
      url: 'cesium/Source/Assets/googleImages/google-grid/{z}/{x}/{y}.png',
      // subdomains: Constants.subdomains,
    }));
  }


// 只展示geojson地图
  _c_add_geojson_area(geojson: any) {
    console.log(geojson.features[0].geometry.coordinates[0]);
    const arr: any[] = [];
    geojson.features[0].geometry.coordinates[0][0].forEach((item: any) => {
      arr.push(item[0])
      arr.push(item[1])
    });
    console.log(arr);
    const polygonWithHole = new Cesium.PolygonGeometry({
      polygonHierarchy: new Cesium.PolygonHierarchy(
        Cesium.Cartesian3.fromDegreesArray([73.0, 53.0, 73.0, 0.0, 135.0, 0.0, 135.0, 53.0]),
        [new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(arr))]
      )
    });
    const geometry = Cesium.PolygonGeometry.createGeometry(polygonWithHole);
    const instances = [];
    // @ts-ignore
    instances.push(new Cesium.GeometryInstance({
      geometry: geometry,
      attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromCssColorString("#081122"))
      }
    }));

    // eslint-disable-next-line @typescript-eslint/no-shadow
    function addRect(instances: any, left: any, down: any, right: any, up: any) {
      instances.push(new Cesium.GeometryInstance({
        geometry: new Cesium.RectangleGeometry({
          rectangle: Cesium.Rectangle.fromDegrees(left, down, right, up)
        }),
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromCssColorString("#081122"))
        }
      }));
    }

    addRect(instances, -180.0, -90.0, 73.0, 90.0);
    addRect(instances, 135.0, -90.0, 180.0, 90.0);
    addRect(instances, 73.0, 53.0, 135.0, 90.0);
    addRect(instances, 73.0, -90.0, 135.0, 0.0);
    this.viewer.scene.primitives.add(new Cesium.Primitive({
      geometryInstances: instances,
      appearance: new Cesium.PerInstanceColorAppearance({
        flat: true,
        translucent: false
      }),
      asynchronous: false,
    }));
  }
}
