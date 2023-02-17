import React, {useEffect} from 'react';
import {InitOLLayer, OlMap} from "@/components/Maps/OlMap";
import TileLayer from "ol/layer/Tile";
import {OSM, XYZ} from "ol/source";
import {OlMapConfig} from "@/components/Maps/config/OlMapConfig";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import {GeoJSON} from "ol/format";
import {Fill, Style} from "ol/style";
import {getVectorContext} from "ol/render";
import Map from "ol/Map";
import style from './example.less';
import {Polygon} from "ol/geom";
import {Feature} from "ol";

const OLExample_1: React.FC = () => {

  useEffect(() => {
    const olMap: OlMap = new OlMap('olExample_1_map', InitOLLayer.None);
    const map: Map = olMap.map;

    const backgroundLayer: TileLayer<any> = new TileLayer({
      className: 'stamen',
      source: new XYZ({
        url: 'http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=' + OlMapConfig.tk,
        wrapX: false,
        crossOrigin: "anonymous",
      }),
    })
    const tdtImgLayer: TileLayer<any> = new TileLayer({
      className: 'stamen',
      source: new XYZ({
        url: 'http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=' + OlMapConfig.tk,
        wrapX: false,
        crossOrigin: "anonymous",
      }),
    });
    const tdtImgLayer2: TileLayer<any> = new TileLayer({
      source: new OSM()
    });
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const style: Style = new Style({
      fill: new Fill({
        color: 'black',
      }),
    })
    const style2: Style = new Style({
      fill: new Fill({
        color: 'rgb(163,124,117)'
      }),
    })

    const vectorSource = new VectorSource({
      url: './mapData/t1.geojson',
      format: new GeoJSON(),
    });
    const vectorLayer: VectorLayer<any> = new VectorLayer({
      style: null,
      source: vectorSource
    })

    // const vectorSource2 = new VectorSource({
    //   url: './mapData/switzerland.geojson',
    //   format: new GeoJSON(),
    // });
    const vectorSource2 = new VectorSource();
    const vectorLayer2: VectorLayer<any> = new VectorLayer({
      style: style2,
      source: vectorSource2
    })
    const newFeatures: any[] = [];
    vectorSource.once('change', (evt: any) => {
      const source = evt.target;
      if (source.getState() === 'ready') {
        const features = source.getFeatures();
        console.log(features)

        features.forEach((feature: any) => {
          if (feature.getGeometry().getType() === 'Polygon') {
            const polygon: Polygon = feature.getGeometry();
            const newPolygon: Polygon = new Polygon([]);
            if (polygon.getCoordinates().length > 0) {
              // eslint-disable-next-line @typescript-eslint/no-use-before-define
              const coordinates = polygonChange(polygon.getCoordinates());
              // polygon.setCoordinates([coordinates]);
              // feature.setGeometry(polygon);

              newPolygon.setCoordinates([coordinates]);
              newFeatures.push(new Feature({
                geometry: newPolygon,
                id: feature.get("id"),
                name: feature.get("name")
              }))
            }
          } else if(feature.getGeometry().getType() === 'MultiPolygon') {
            console.log(feature.getGeometry().getCoordinates())

          }
        })
        // console.log(newFeatures)
        // // console.log(vectorSource2.getFeatures())
        // // vectorSource2.clear();
        // vectorSource2.addFeatures(newFeatures);
        // vectorSource2.refresh();
        // console.log(vectorSource2.getFeatures())
      }
    });

    setTimeout(() => {
      vectorSource2.addFeatures(newFeatures)
      console.log(new GeoJSON().writeFeatures(newFeatures))
      console.log(vectorLayer2.getSource().getFeatures())
    }, 200)
    // tdtImgLayer.setOpacity(0.5)

    map.addLayer(backgroundLayer);
    map.addLayer(vectorLayer2);
    map.addLayer(tdtImgLayer);
    // map.addLayer(tdtImgLayer2);
    map.addLayer(vectorLayer);


    // tdtImgLayer2.setOpacity(0.5)

    // vectorLayer2.getSource().on("addfeature", () => {
    //   tdtImgLayer2.setExtent(vectorLayer2.getSource().getExtent())
    // })
    vectorLayer.getSource().on("addfeature", () => {
      tdtImgLayer.setExtent(vectorLayer.getSource().getExtent())
    })

    // tdtImgLayer2.on("postrender", (event: any) => {
    //   const vectorContext = getVectorContext(event);
    //   event.context.globalCompositeOperation = "destination-in";
    //   vectorLayer2.getSource().forEachFeature((feature: any) => {
    //     vectorContext.drawFeature(feature, style2);
    //   })
    //   event.context.globalCompositeOperation = 'source-over';
    // })
    tdtImgLayer.on("postrender", (event: any) => {
      const vectorContext = getVectorContext(event);
      event.context.globalCompositeOperation = "destination-in";
      vectorLayer.getSource().forEachFeature((feature: any) => {
        vectorContext.drawFeature(feature, style);
      })
      event.context.globalCompositeOperation = 'source-over';
    })

    console.log(map.getLayers())
    map.getView().setCenter([8.23, 46.86]);
    map.getView().setZoom(7);
    // map.setView(new View({
    //   center: [8.23, 46.86],
    //   zoom: 7
    // }))
  }, [])

  const polygonChange = (coordinates: any): any => {
    // console.log(coordinates)
    const list: any = [];
    coordinates.forEach((e, i) => {
      // console.log(e)
      e.forEach((item, m) => {
        const a: number[] = [];
        for (let j = 0; j < item.length; j++) {
          item[j] = item[j] - 0.111111;
          a.push(item[j]);
        }
        list.push(a);
      })
    })
    return list
  }
  // const polygonChange = (coordinates: number[]): any => {
  //   console.log(coordinates)
  //   return coordinates;
  // }

  return <>
    <div className={style.maps}>
      <div id={'olExample_1_map'} className={style.mapBox}/>
    </div>
  </>
}

export default OLExample_1;
