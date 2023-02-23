import React, {useEffect} from "react";
import {BasicMap, InitLayer} from "@/components/Maps/BasicMap";
import style from "./example.less";
import * as Cesium from "cesium";
import {Resource} from "cesium";
import {Slider, Space} from "antd";

export let globalViewer: any = null;
export let globalM: any = null;
export let globalTileset: any = null;
const Example_2: React.FC = () => {

  useEffect(() => {
    const basicMap: BasicMap = new BasicMap('Example_2', InitLayer.NONE);
    const viewer: any = basicMap.viewer;
    globalViewer = viewer;
    viewer.terrainProvider = Cesium.createWorldTerrain();

    // Add Cesium OSM Buildings.
    // const buildingsTileset = viewer.scene.primitives.add(Cesium.createOsmBuildings());
    // Fly the camera to Denver, Colorado at the given longitude, latitude, and height.
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(-104.9965, 39.74248, 4000)
    });

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    addBuildingGeoJSON(viewer);

    // STEP 4 CODE
    // Hide individual buildings in this area using 3D Tiles Styling language.
    // buildingsTileset.style = new Cesium.Cesium3DTileStyle({
    //   // Create a style rule to control each building's "show" property.
    //   show: {
    //     conditions : [
    //       // Any building that has this elementId will have `show = false`.
    //       ['${elementId} === 332469316', false],
    //       ['${elementId} === 332469317', false],
    //       ['${elementId} === 235368665', false],
    //       ['${elementId} === 530288180', false],
    //       ['${elementId} === 530288179', false],
    //       // If a building does not have one of these elementIds, set `show = true`.
    //       [true, true]
    //     ]
    //   },
    //   // Set the default color style for this particular 3D Tileset.
    //   // For any building that has a `cesium#color` property, use that color, otherwise make it white.
    //   color: "Boolean(${feature['cesium#color']}) ? color(${feature['cesium#color']}) : color('#ffffff')"
    // });

    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(function (e: any) {
      const pick = viewer.scene.pick(e.position);
      console.log(pick)
      if (pick && pick.id) {
        console.log(pick.id)
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    addCustomBuildingModel(viewer);
  }, [])

  const addCustomBuildingModel = async (viewer: any): Promise<any> => {
    // STEP 6 CODE
    // Add the 3D Tileset you created from your Cesium ion account.
    // const buildingResource = await new Resource({url: './cesiumModel/PSFS.glb'});
    // // const buildingResource = await Cesium.IonResource.fromAssetId(1556898);
    // console.log(buildingResource)


    const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
      Cesium.Cartesian3.fromDegrees(-104.9909, 39.73579, 1577)
    )
    const s = Cesium.Cartesian3.fromDegrees(-104.9909, 39.73579, 1577);
    console.log(s)
    console.log(modelMatrix)
    const newBuildingTileset = viewer.scene.primitives.add(
      Cesium.Model.fromGltf({
        id: 'PSFS',
        url: './cesiumModel/PSFS.glb', // 本地文件
        modelMatrix: modelMatrix,
        scale: 1 // 放大倍数
      })
    )
    const heightOffset = 1577;
    newBuildingTileset.readyPromise.then((tileset: any) => {
      globalTileset = tileset;
      const translation = Cesium.Cartesian3.fromArray([-1270753.1306562328, -4745529.953671659, 4056477.7507437915]);
      const ms = Cesium.Matrix4.fromTranslation(translation);
      // console.log(m)
      tileset.modelMatrix = ms;

      const cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);
      const surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
      const m = Cesium.Transforms.eastNorthUpToFixedFrame(surface);
      globalM = m;


      console.log(tileset)
      // tileset.modelMatrix = m;
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      // changeHeight(tileset, heightOffset);
    });

    // Move the camera to the new building.
    viewer.flyTo(newBuildingTileset);
  }

  const changeHeight = (tileset: any, rHeight: number): void => {
    const height = Number(rHeight);
    if (isNaN(height)) {
      return;
    }
    const cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);
    const surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
    const offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height);
    const translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
    tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
  }

  const addBuildingGeoJSON = async (viewer: any): Promise<any> => {
    const geojsonUrl = await new Resource({url: './mapData/buildRemove.geojson'})
    const geojson = await Cesium.GeoJsonDataSource.load(geojsonUrl, {clampToGround: true});
    console.log(geojson)
    const dataSource = await viewer.dataSources.add(geojson);
    // By default, polygons in CesiumJS will be draped over all 3D content in the scene.
    // Modify the polygons so that this draping only applies to the terrain, not 3D buildings.
    for (const entity of dataSource.entities.values) {
      console.log(entity)
      entity.polygon.classificationType = Cesium.ClassificationType.TERRAIN;
    }

    viewer.flyTo(dataSource);
  }

  const onChange1 = (value: number | [number, number]) => {
    if (typeof value === "number") {
      const ms = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(value));
      const rotate = Cesium.Matrix4.fromRotationTranslation(ms);
      Cesium.Matrix4.multiply(globalM, rotate, globalM);
      globalTileset.modelMatrix = globalM;
    }
  };
  const onChange2 = (value: number | [number, number]) => {
    if (typeof value === "number") {
      const ms = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(value));
      const rotate = Cesium.Matrix4.fromRotationTranslation(ms);
      Cesium.Matrix4.multiply(globalM, rotate, globalM);
      globalTileset.modelMatrix = globalM;
    }
  };
  const onChange3 = (value: number | [number, number]) => {
    if (typeof value === "number") {
      const ms = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(value));
      const rotate = Cesium.Matrix4.fromRotationTranslation(ms);
      Cesium.Matrix4.multiply(globalM, rotate, globalM);
      globalTileset.modelMatrix = globalM;
    }
  };

  const onChange5 = (value: number) => {
    console.log(value)
  }
  const onChange6 = (value: number) => {
    console.log(value)
  }
  const onChange7 = (value: number) => {
    console.log(value)
  }
  const onChange8 = (value: number) => {
    console.log(value)
  }

  return <>
    <div id={'Example_2'} className={style.mapBox}/>
    <div className={style.toolBox}>
      <div>
        <div>X</div>
        <Slider defaultValue={0} min={-3.6} max={3.6} step={0.01} onChange={onChange1}/>
      </div>
      <div>
        <div>Y</div>
        <Slider defaultValue={0} min={-3.6} max={3.6} step={0.01} onChange={onChange2}/>
      </div>
      <div>
        <div>Z</div>
        <Slider defaultValue={0} min={-3.6} max={3.6} step={0.01} onChange={onChange3}/>
      </div>

      <div className={style.offsetBox}>
        <div className={style.verticals}><Slider vertical defaultValue={0} min={-3.6} max={3.6} step={0.01}
                                                 onChange={onChange5}/></div>
        <div className={style.noVerticals}>
          <Slider defaultValue={0} min={-3.6} max={3.6} step={0.01} onChange={onChange6}/>
          <Slider defaultValue={0} min={-3.6} max={3.6} step={0.01} onChange={onChange7}/>
        </div>
        <div className={style.verticals}><Slider vertical defaultValue={0} min={-3.6} max={3.6} step={0.01}
                                                 onChange={onChange8}/></div>
      </div>
    </div>
  </>
}

export default Example_2;
