import TileLayer from "ol/layer/Tile";
import {XYZ} from "ol/source";
import {OlMapConfig} from "@/components/Maps/config/OlMapConfig";
import Map from "ol/Map";
import {View} from "ol";
import {defaults} from "ol/control";
import styles from './index.less';
import VectorLayer from "ol/layer/Vector";
import {Style, Fill, Stroke} from "ol/style";
import VectorSource from "ol/source/Vector";

export enum InitOLLayer {
  None
}

export class OlMap {
  map: Map;
  tdtVecLayer: TileLayer<XYZ>;
  tdtImgLayer: TileLayer<XYZ>;
  tdtCvaLayer: TileLayer<XYZ>;
  googleImgLayer: TileLayer<XYZ>;

  constructor(el: string, initLayer?: InitOLLayer) {

    this.map = new Map({
      view: new View({
        center: [113.8, 34.6],
        zoom: 3,
        projection: 'EPSG:4326',
      }),
      layers: [],
      target: el,
      controls: defaults({
        rotate: false,
        attribution: false,
        zoomOptions: {className: styles.zoom},
      }).extend([]),
    });

    this.tdtVecLayer = new TileLayer({
      className: 'stamen',
      source: new XYZ({
        url: 'http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=' + OlMapConfig.tk,
        wrapX: false,
        crossOrigin: "anonymous",
      })
    });

    this.tdtImgLayer = new TileLayer({
      // className: 'stamen',
      // visible: false,
      source: new XYZ({
        url: 'http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=' + OlMapConfig.tk,
        wrapX: false,
        crossOrigin: "anonymous",
      })
    });

    this.tdtCvaLayer = new TileLayer({
      className: 'stamen',
      source: new XYZ({
        url: 'http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=' + OlMapConfig.tk,
        wrapX: false,
        crossOrigin: "anonymous",
      })
    });

    this.googleImgLayer = new TileLayer({
      className: 'stamen',
      source: new XYZ({
        url: 'https://gac-geo.googlecnapps.cn/maps/vt?lyrs=s,m&gl=&x={x}&y={y}&z={z}',
        wrapX: false,
        crossOrigin: "anonymous",
      })
    })

    switch (initLayer) {
      case InitOLLayer.None:
        break;
      default:
        this.initDefaultLayer();
    }
  }

  initDefaultLayer() {
    // this.map.addLayer(this.tdtVecLayer);
    this.map.addLayer(this.tdtImgLayer);
    this.map.addLayer(this.tdtCvaLayer);
  }

  /**
   * 添加阴影图层
   * @param layer
   */
  addHighlightLayer(layer: any): any {
    // eslint-disable-next-line no-param-reassign
    layer = new VectorLayer({
      source: new VectorSource(),
      style: () => {
        return new Style({
          fill: new Fill({
            color: 'raba(0,0,0,1)'
          }),
          stroke: new Stroke({
            color: 'rgba(255, 255, 255, 1)',
            width: 1
          })
        });
      }
    });
    this.map.addLayer(layer);
    this.onBindLayerClick(layer);
    return layer;
  }

  /**
   * 图层监听修改
   * @param layer
   */
  onBindLayerClick(layer: any): void {
    layer.on('prerender', (evt: any) => {
      evt.context.shadowBlur = 25;
      evt.context.shadowColor = 'black';
    });
    layer.on('postrender', (evt: any) => {
      evt.context.shadowBlur = 0;
      evt.context.shadowColor = 'black';
    });
  }

  /**
   * 偏移位置
   * @param coordinates
   * @param leftOffset
   * @param rightOffSet
   */
  polygonOffset(coordinates: any, leftOffset: number = 0.111111, rightOffSet: number = 1.111111): number [] {
    const list: any = [];
    const offsetList: any = [];
    coordinates.forEach((e: number[]) => {
      e.forEach((item: any) => {
        const a: number[] = [];
        const b: number[] = [];
        for (let j = 0; j < item.length; j++) {
          item[j] = j == 0 ? item[j] + leftOffset : item[j] - rightOffSet;
          a.push(item[j]);
          b.push(j == 0 ? item[j] - leftOffset : item[j] + rightOffSet);
        }
        list.push(a);
        // offsetList.push(a);
      })
    })
    return [list, offsetList]
  }

  multiPolygonOffset(coordinates: any): number [] {
    const list: any = [];
    const offsetList: any = [];
    coordinates.forEach((item: number[]) => {
      list.push(this.polygonOffset(item)[0]);
      offsetList.push(this.polygonOffset(item)[1]);
    })
    return [list, offsetList]
  }
}
