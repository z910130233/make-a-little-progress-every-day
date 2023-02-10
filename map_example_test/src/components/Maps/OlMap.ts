import TileLayer from "ol/layer/Tile";
import {XYZ} from "ol/source";
import {OlMapConfig} from "@/components/Maps/config/OlMapConfig";
import Map from "ol/Map";
import {View} from "ol";
import {defaults} from "ol/control";
import styles from './index.less';

export enum InitOLLayer {
  None
}

export class OlMap {
  map: Map;
  tdtVecLayer: TileLayer<XYZ>;
  tdtImgLayer: TileLayer<XYZ>;
  tdtCvaLayer: TileLayer<XYZ>;

  constructor(el: string, initLayer?: InitOLLayer) {

    this.map = new Map({
      view: new View({
        center: [113.8, 34.6],
        zoom: 5,
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
      source: new XYZ({
        url: 'http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=' + OlMapConfig.tk,
        wrapX: false,
        crossOrigin: "anonymous",
      }),
      zIndex: 1,
    });

    this.tdtImgLayer = new TileLayer({
      // visible: false,
      source: new XYZ({
        url: 'http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=' + OlMapConfig.tk,
        wrapX: false,
        crossOrigin: "anonymous",
      }),
      zIndex: 2,
    });

    this.tdtCvaLayer = new TileLayer({
      source: new XYZ({
        url: 'http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=' + OlMapConfig.tk,
        wrapX: false,
        crossOrigin: "anonymous",
      }),
      zIndex: 10,
    });

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
}
