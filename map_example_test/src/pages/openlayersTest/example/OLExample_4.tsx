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

const OLExample_4: React.FC = () => {

  useEffect(() => {
    const olMap: OlMap = new OlMap('olExampleMap3', InitOLLayer.None);
    const map: any = olMap.map;
    olMap.tdtCvaLayer.setVisible(false);

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

    //定义渐变颜色
    const pixelRatio = window.devicePixelRatio;
    const canvas = document.createElement('canvas');
    const context: any = canvas.getContext('2d');
    const pixel = 1600 * pixelRatio;  //实际上不只这么宽的屏幕像素，按照实际的来
    const gradient = context.createLinearGradient(0, 0, pixel, 0);
    let his: boolean = false;
    for (let i = 0; i < pixel; i += 20) {
      if (his) gradient.addColorStop(i / pixel, 'rgb(28,54,103)');
      else gradient.addColorStop(i / pixel, 'rgb(78,111,1379)');
      his = !his;
    }

    const nextStyle: Style = new Style({
      fill: new Fill({
        color: gradient,
      }),
      stroke: new Stroke({
        color: 'rgb(250,214,214, 0.1)'
      })
    })
    const nextStyle2: Style = new Style({
      fill: new Fill({
        color: gradient,
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

    const level1Source = new VectorSource();
    const level1Layer: VectorLayer<any> = new VectorLayer({
      style: nextStyle,
      source: level1Source,
      opacity: 0.8
    })
    const level2Source = new VectorSource();
    const level2Layer: VectorLayer<any> = new VectorLayer({
      style: nextStyle2,
      source: level2Source,
      opacity: 0.3
    })
    const newFeatures1: any[] = [];
    const newFeatures2: any[] = [];
    vectorSource.once('change', (evt: any) => {
      const source = evt.target;
      if (source.getState() === 'ready') {
        const features = source.getFeatures();
        features.forEach((feature: any) => {
          if (feature.getGeometry().getType() === 'Polygon') {      //这个例子是Polygon类型，创建新的偏移要素，添加进图层
            const polygon: Polygon = feature.getGeometry();
            const newPolygon1: Polygon = new Polygon([]);
            const newPolygon2: Polygon = new Polygon([]);
            if (polygon.getCoordinates().length > 0) {
              const coordinates1: any = olMap.polygonOffset(polygon.getCoordinates(), -0.001, 0.1);
              const coordinates2: any = olMap.polygonOffset(polygon.getCoordinates(), -0.001, 0.18);
              newPolygon1.setCoordinates([coordinates1[0]]);
              newPolygon2.setCoordinates([coordinates2[0]]);
              newFeatures1.push(new Feature({
                geometry: newPolygon1,
              }))
              newFeatures2.push(new Feature({
                geometry: newPolygon2,
              }))
            }
          } else if (feature.getGeometry().getType() === 'MultiPolygon') {
            const newPolygon: MultiPolygon = new MultiPolygon([]);
            const coordinates: any = olMap.multiPolygonOffset(feature.getGeometry().getCoordinates());
            newPolygon.setCoordinates([coordinates[0]]);
            // newPolygon.setCoordinates(coordinates[1][1]);
            newFeatures1.push(new Feature({
              geometry: newPolygon,
            }))
          }
        })
      }
    });

    //为啥延时触发，是因为懒得做同步处理*.*
    setTimeout(() => {
      level1Source.addFeatures(newFeatures1)
      level2Source.addFeatures(newFeatures2)
    }, 500)

    map.addLayer(level1Layer);
    map.addLayer(level2Layer);
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


    //添加阴影的图层
    const highlightLayer: any = olMap.addHighlightLayer(level2Layer);
    highlightLayer.setZIndex(-1)
    // highlightLayer.setOpacity(0.5)
    level2Source.once('change', (evt: any) => {
      const source = evt.target;
      if (source.getState() === 'ready') {
        source.forEachFeature((f: any) => {
          highlightLayer.setStyle(() => {
              return new Style({
                fill: new Fill({color: (f.style && f.style.getFill) ? f.style.getFill().getColor() : 'rgba(255,255,255,1)'}),
                // stroke: new Stroke({color: 'rgba(255, 255, 255, 0.2)', width: 5})
              });
            }
          );
          highlightLayer.getSource().addFeature(f);
        })
      }
    })

    map.on('precompose', (evt: any) => {
      console.log(evt)
      // let ctx = evt.context;
      // ctx.filter = 'grayscale' + '(100%)';
    })

    map.getView().setCenter([8.23, 46.86]);
    map.getView().setZoom(7);

  }, [])

  return <>
    <div id={'olExampleMap3'} className={style.mapBox}/>
  </>
}

export default OLExample_4;
