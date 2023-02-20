import React, {useEffect} from 'react';
import {InitOLLayer, OlMap} from "@/components/Maps/OlMap";
import VectorSource from "ol/source/Vector";
import {GeoJSON} from "ol/format";
import VectorLayer from "ol/layer/Vector";
import style from "./example.less";
import {Fill, Stroke, Style} from 'ol/style';

const OlExample_2: React.FC = () => {

  useEffect(() => {
    const olMap: OlMap = new OlMap('olExampleMap2', InitOLLayer.None);
    const map = olMap.map;

    map.addLayer(olMap.tdtVecLayer);

    const vectorSource = new VectorSource({
      url: './mapData/newCHNSingle.geojson',
      format: new GeoJSON(),
    })
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        stroke: new Stroke({
          lineDash: [1, 2, 3, 4, 5, 6],
          lineDashOffset: 10,
          color: 'black',
          width: 2
        })
      })
    })
    map.addLayer(vectorLayer);

    //添加阴影的图层
    const highlightLayer: any = olMap.addHighlightLayer(vectorLayer);

    vectorSource.once('change', (evt: any) => {
      const source = evt.target;
      if (source.getState() === 'ready') {
        source.forEachFeature((f: any) => {
          highlightLayer.setStyle(() => {
              return new Style({
                fill: new Fill({color: (f.style && f.style.getFill) ? f.style.getFill().getColor() : '#aaa'}),
                stroke: new Stroke({color: 'rgba(255, 255, 255, 0.2)', width: 5})
              });
            }
          );
          highlightLayer.getSource().addFeature(f);
        })
      }
    })
  }, [])

  return <>
    <div id={'olExampleMap2'} className={style.mapBox}/>
  </>
}

export default OlExample_2;
