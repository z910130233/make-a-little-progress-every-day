import React, {useEffect} from "react";
import style from './index.less';
import * as Cesium from "cesium";
import {Cartesian3, HeadingPitchRoll, ImageryLayerCollection} from "cesium";
import {BasicMap, InitLayer} from "../../../components/Maps/BasicMap";

const BasicMapTest: React.FC = (props: any) => {

  useEffect(() => {
    const basicMap = new BasicMap('cesiumContainer1', InitLayer.TDT);
    // const olMap = new OlMap('openlayersMap');
    // console.log(olMap)
    const layers: ImageryLayerCollection = basicMap.viewer.scene.imageryLayers;
    basicMap.viewer.cesiumWidget.creditContainer.style.display = "none";
    basicMap.viewer.scene.globe.enableLighting = true;
    layers.addImageryProvider(
      new Cesium.SingleTileImageryProvider({
        url: '/icons/icon-128x128.png',
        rectangle: Cesium.Rectangle.fromDegrees(-75.0, 28.0, -67.0, 29.75),
      })
    );

    // basicMap.viewer.imageryLayers.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
    //   //影像注记
    //   // url: "http://t{s}.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=" + Constants.tdtToken,
    //   url: 'http://uniquesha.com:8001/newgeoserver/chinacover/wms?service=WMS&version=1.1.0&request=GetMap&layers=chinacover%3Aodm_orthophoto&srs=EPSG%3A4326&format=image/png',
    //   subdomains: Constants.subdomains,
    //   layers: "tileTestLayer",
    //   // style: "default",
    //   // format: "image/png",
    //   // tileMatrixSetID: "GoogleMapsCompatible",
    // }))

    // Create an initial camera view
    const initialPosition = Cartesian3.fromDegrees(-73.998114468289017509, 40.674512895646692812, 2631.082799425431);
    const initialOrientation = HeadingPitchRoll.fromDegrees(7.1077496389876024807, -31.987223091598949054, 0.025883251314954971306);
    const homeCameraView: any = {
      destination: initialPosition,
      orientation: {
        heading: initialOrientation.heading,
        pitch: initialOrientation.pitch,
        roll: initialOrientation.roll
      }
    };
    // Set the initial view
    // basicMap.viewer.scene.camera.setView(homeCameraView);

    setTimeout(() => {
      homeCameraView.duration = 2.0;
      homeCameraView.maximumHeight = 2000;
      homeCameraView.pitchAdjustHeight = 2000;
      homeCameraView.endTransform = Cesium.Matrix4.IDENTITY;
      // Override the default home button
      basicMap.viewer.homeButton.viewModel.command.beforeExecute.addEventListener((e: any) => {
        e.cancel = true;
        basicMap.viewer.scene.camera.flyTo(homeCameraView);
      });
    }, 8000)

    const viewer = basicMap.viewer;

    const redCorridor = viewer.entities.add({
      name: 'test',
      corridor: {
        positions: Cesium.Cartesian3.fromDegreesArray([
          -100.0,
          40.0,
          -105.0,
          40.0,
          -105.0,
          35.0,
        ]),
        width: 200000.0,
        height: 200000.0,
        extrudedHeight: 20000.0,
        outline: true,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 10000.0,
        cornerType: Cesium.CornerType.BEVELED,
        material: Cesium.Color.RED.withAlpha(0.5),
      }
    })
    // viewer.zoomTo(viewer.entities)
  }, []);

  const flayToLocation: any = (viewer: any) => {
    //飞到指定的坐标点
    const flyEntity = new Cesium.Entity({
      id: 'flyTmp',
      position: Cesium.Cartesian3.fromDegrees(116.37685970334466, 39.954266782491445),
      point: {
        pixelSize: 100,
        color: Cesium.Color.WHITE.withAlpha(0),
        outlineColor: Cesium.Color.WHITE.withAlpha(0),
        outlineWidth: 1
      }
    });

    viewer.entities.add(flyEntity);
    viewer.flyTo(flyEntity, {
      offset: {
        heading: Cesium.Math.toRadians(0.0),
        pitch: Cesium.Math.toRadians(-90),
        range: 200000
      },
      duration: 5, //持续时间
    });
  }


  return <>
    <div id='cesiumContainer1' className={style.mapBox}/>
    {/*<div id='cesiumContainer2' className={style.mapBox}/>*/}
    <div id='openlayersMap' className={style.mapBox}/>
  </>
}

export default BasicMapTest;
