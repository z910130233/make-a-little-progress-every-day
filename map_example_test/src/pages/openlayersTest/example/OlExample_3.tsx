import React, {useEffect} from "react";
import {InitOLLayer, OlMap} from "@/components/Maps/OlMap";
import {Fill, Stroke, Style} from "ol/style";
import VectorSource from "ol/source/Vector";
import {GeoJSON} from "ol/format";
import VectorLayer from "ol/layer/Vector";
import {getVectorContext} from "ol/render";
import style from "./example.less";
import TileLayer from "ol/layer/Tile";
import {Stamen} from "ol/source";
import {MultiPolygon, Polygon} from "ol/geom";
import {Feature} from "ol";

const OlExample_3: React.FC = () => {

  useEffect(() => {
    const olMap: OlMap = new OlMap('olExampleMap3', InitOLLayer.None);
    const map: any = olMap.map;

    const base = new TileLayer({
      source: new Stamen({
        layer: 'toner',
      }),
    });
    // map.addLayer(base)

    // eslint-disable-next-line @typescript-eslint/no-shadow
    const style: Style = new Style({
      fill: new Fill({
        color: 'rgb(149,149,149)'
      }),
    })
    const style2: Style = new Style({
      fill: new Fill({
        color: 'rgb(149,149,149, 0.6)'
      }),
      stroke: new Stroke({
        color: 'rgb(250,214,214, 0.1)'
      })
    })
    const vectorSource: VectorSource = new VectorSource({
      url: './mapData/t1.geojson',
      format: new GeoJSON(),
    })
    const vectorLayer: any = new VectorLayer({
      source: vectorSource,
      style: null
    })

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
        console.log(new GeoJSON().writeFeatures(features))
        features.forEach((feature: any) => {
          if (feature.getGeometry().getType() === 'Polygon') {
            const polygon: Polygon = feature.getGeometry();
            const newPolygon: Polygon = new Polygon([]);
            const newMultiPolygon: MultiPolygon = new MultiPolygon([]);
            console.log(polygon.getCoordinates())
            if (polygon.getCoordinates().length > 0) {
              const coordinates: any = olMap.polygonOffset(polygon.getCoordinates(), -0, 0.2);
              console.log(coordinates)
              newPolygon.setCoordinates([coordinates[0]]);
              // newMultiPolygon.setCoordinates(coordinates[1]);
              newFeatures.push(new Feature({
                geometry: newPolygon,
              }))
            }
          } else if(feature.getGeometry().getType() === 'MultiPolygon') {
            const newPolygon: MultiPolygon = new MultiPolygon([]);
            const coordinates: any = olMap.multiPolygonOffset(feature.getGeometry().getCoordinates());
            console.log(coordinates[1])
            // newPolygon.setCoordinates([coordinates[0]]);
            newPolygon.setCoordinates(coordinates[1][1]);
            newFeatures.push(new Feature({
              geometry: newPolygon,
            }))
          }
        })
      }
    });

    setTimeout(() => {
      console.log(newFeatures)
      console.log(new GeoJSON().writeFeatures(newFeatures))
      vectorSource2.addFeatures(newFeatures)
    }, 200)

    map.addLayer(vectorLayer2);
    map.addLayer(olMap.googleImgLayer);
    map.addLayer(vectorLayer);

    vectorLayer.getSource().on("addfeature", () => {
      olMap.googleImgLayer.setExtent(vectorLayer.getSource().getExtent())
    })
    olMap.googleImgLayer.on("postrender", (event: any) => {
      const vectorContext = getVectorContext(event);
      event.context.globalCompositeOperation = "destination-in";
      vectorLayer.getSource().forEachFeature((feature: any) => {
        vectorContext.drawFeature(feature, style);
      })
      event.context.globalCompositeOperation = 'source-over';
    })

    map.getView().setCenter([8.23, 46.86]);
    map.getView().setZoom(7);

  }, [])

  return <>
    <div id={'olExampleMap3'} className={style.mapBox}/>
  </>
}

export default OlExample_3;
