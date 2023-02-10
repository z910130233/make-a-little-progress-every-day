import React, {useEffect} from 'react';
import {OlMap} from "@/components/Maps/OlMap";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import {GeoJSON} from "ol/format";
import mapData from "@/assets/mapData/CHN.json";
import {getVectorContext} from "ol/render";
import {Fill, Style} from "ol/style";
import TileLayer from "ol/layer/Tile";
import {OSM, Stamen} from "ol/source";
import {View} from "ol";
import {fromLonLat} from "ol/proj";
import Map from "ol/Map";

const OpenLayersTest: React.FC = () => {

  useEffect(() => {
    // const olMap: OlMap = new OlMap('myMap');
    // const map = olMap.map;
    //
    // const clipLayer = new VectorLayer({
    //   source: new VectorSource({
    //     features: new GeoJSON().readFeatures(mapData)
    //   }),
    //   // zIndex: 10,
    //   style: null,
    // })
    // // @ts-ignore
    // clipLayer.getSource().on("addfeature", function () {
    //   // @ts-ignore
    //   olMap.tdtImgLayer.setExtent(clipLayer.getSource().getExtent());
    // });
    // const style = new Style({
    //   fill: new Fill({
    //     color: "black"
    //   })
    // });
    // olMap.tdtImgLayer.on("postrender", function (e: any) {
    //   const vectorContext = getVectorContext(e);
    //   e.context.globalCompositeOperation = "destination-in";
    //   // @ts-ignore
    //   clipLayer.getSource().forEachFeature(function (feature) {
    //     vectorContext.drawFeature(feature, style);
    //   });
    //   e.context.globalCompositeOperation = "source-over";
    // });
    //
    // map.addLayer(clipLayer);
    //
    // // const clipFeature =
    // //   = new Feature({
    // //   geometry: new Polygon();
    // // })
    //
    // // const clipFeature: Feature<Geometry> = vectorSource.getFeatures()[0];
    // // vectorSource.getFeatures().forEach((item, index) => {
    // //   clipFeature = item;
    // // });
    // // @ts-ignore
    // // console.log(clipFeature)
    //
    // // vectorLayer.on("prerender", (event: any) => {
    // //   const vectorContext = getVectorContext(event);
    // //   event.context.globalCompositeOperation = 'source-over';
    // //   const ctx = event.context;
    // //   ctx.save();
    // //   vectorContext.drawFeature(clipFeature, new Style({
    // //       stroke: new Stroke({
    // //         color: '#3399CC',
    // //         width: 1.25,
    // //       }),
    // //     }
    // //   ));// 可以对边界设置一个样式
    // //   ctx.clip();
    // // })
    // // vectorLayer.on("postrender", (event: any) => {
    // //   const ctx = event.context;
    // //   ctx.restore();
    // // })
    // // @ts-ignore
    // // vectorLayer.setExtent(clipFeature.getGeometry().getExtent())
    // // map.addLayer(olMap.tdtImgLayer)
    //
    // console.log(olMap)
    //
    // const canvas = document.createElement('canvas')
    // console.log(canvas)
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    initClipTest()
  }, [])

  const initClipTest: any = () => {
    const background: any = new TileLayer({
      className: "stamen",
      source: new Stamen({
        layer: "toner"
      })
    });

    const base: any = new TileLayer({
      source: new OSM()
    });

    const clipLayer: any = new VectorLayer({
      style: null,
      source: new VectorSource({
        // url: "./mapData/CHN.geojson",
        url: "./mapData/switzerland.geojson",
        format: new GeoJSON()
      })
    });

//Giving the clipped layer an extent is necessary to avoid rendering when the feature is outside the viewport
    clipLayer.getSource().on("addfeature", function () {
      base.setExtent(clipLayer.getSource().getExtent());
    });

    const style = new Style({
      fill: new Fill({
        color: "black"
      })
    });

    base.on("postrender", function (e: any) {
      const vectorContext = getVectorContext(e);
      e.context.globalCompositeOperation = "destination-in";
      clipLayer.getSource().forEachFeature(function (feature: any) {
        console.log(feature)
        vectorContext.drawFeature(feature, style);
      });
      e.context.globalCompositeOperation = "source-over";
    });

    const map: any = new Map({
      layers: [base, clipLayer],
      target: "myMap",
      view: new View({
        center: fromLonLat([113.8, 34.6]),
        zoom: 7
      })
    });
  }

  return <>
    <div id={'myMap'} style={{width: 500, height: 500, background: 'transparent'}}/>
  </>
}

export default OpenLayersTest;
