import React, {useEffect} from "react";
import {BasicMap} from "@/components/Maps/BasicMap";
import style from "./example.less";
import * as Cesium from "cesium";

const Example_3: React.FC = () => {

  useEffect(() => {
    const basicMap: BasicMap = new BasicMap("Example_3");
    const viewer: any = basicMap.viewer;

    const wyoming = viewer.entities.add({
      polygon: {
        hierarchy: Cesium.Cartesian3.fromDegreesArray([
          -109.080842, 45.002073, -105.91517, 45.002073, -104.058488, 44.996596,
          -104.053011, 43.002989, -104.053011, 41.003906, -105.728954, 40.998429,
          -107.919731, 41.003906, -109.04798, 40.998429, -111.047063, 40.998429,
          -111.047063, 42.000709, -111.047063, 44.476286, -111.05254, 45.002073,
        ]),
        height: 200000,
        extrudedHeight: 250000,
        material: Cesium.Color.RED.withAlpha(0.5),
        outline: true,
        outlineColor: Cesium.Color.BLACK,
      },
    });

    // viewer.flyTo(wyoming);
    test(viewer, wyoming);
  }, [])

  const test = async (viewer: any, wyoming: any): Promise<any> => {
    const result = await viewer.flyTo(wyoming);
    if (result) {
      viewer.selectedEntity = wyoming;
    }

    wyoming.position = Cesium.Cartesian3.fromDegrees(-107.724, 42.68);
    viewer.trackedEntity = wyoming;
  }

  return <>
    <div id={"Example_3"} className={style.mapBox}/>
  </>
}

export default Example_3;
