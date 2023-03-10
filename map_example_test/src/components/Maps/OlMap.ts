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
        // url: 'https://gac-geo.googlecnapps.cn/maps/vt?lyrs=s,m&gl=&x={x}&y={y}&z={z}',
        url: 'http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=' + OlMapConfig.tk,
        wrapX: false,
        crossOrigin: "anonymous",
        tileLoadFunction: function (imageTile: any, src: string) {
          // ???????????? ????????????????????????
          let img = new Image()
          // img.crossOrigin = ''
          // ????????????????????????????????????????????????????????????????????????????????????
          img.setAttribute('crossOrigin', 'anonymous')
          img.onload = function () {
            let canvas = document.createElement('canvas')
            let w = img.width
            let h = img.height
            canvas.width = w
            canvas.height = h
            let context: any = canvas.getContext('2d')
            context.filter = 'grayscale(98%) invert(100%) sepia(20%) hue-rotate(180deg) saturate(1600%) brightness(80%) contrast(90%)'
            // context.filter = 'sepia(100%)'
            context.drawImage(img, 0, 0, w, h, 0, 0, w, h)
            imageTile.getImage().src = canvas.toDataURL('image/png')
          }
          img.src = src
        },
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
   * ??????????????????
   * @param layer
   */
  addHighlightLayer(layer: any): any {
    // eslint-disable-next-line no-param-reassign
    layer = new VectorLayer({
      source: new VectorSource(),
      style: () => {
        return new Style({
          fill: new Fill({
            color: 'rgba(0,0,0,1)'
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
   * ??????????????????
   * @param layer
   */
  onBindLayerClick(layer: any): void {
    layer.on('prerender', (evt: any) => {
      evt.context.shadowBlur = 25;
      evt.context.shadowColor = 'rgb(107,185,226)';
    });
    // layer.on('postrender', (evt: any) => {
    //   evt.context.shadowBlur = 0;
    //   evt.context.shadowColor = 'rgb(205,95,134)';
    // });
  }

  /**
   * ????????????
   * @param coordinates
   * @param leftOffset
   * @param rightOffSet
   * return list: ???????????????????????????offsetList: ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
   */
  polygonOffset(coordinates: any, leftOffset: number = 0.111111, rightOffSet: number = 1.111111): number [] {
    const list: any = [];
    const offsetList: any = [];
    coordinates.forEach((e: number[]) => {
      const o: any = [];
      e.forEach((item: any, index: number) => {
        const a: any = [item[0] + leftOffset, item[1] - rightOffSet];
        list.push(a);

        const of: any = [];
        const nextOffPoint: any = index === e.length - 1 ? e[0] : e[index + 1];
        for (let i = 0; i < 6; i++) {
          if (i === 0) of.push(a);
          if (i === 1) of.push([nextOffPoint[0] + leftOffset, nextOffPoint[1] - rightOffSet]);
          if (i === 2) of.push(nextOffPoint);
          if (i === 3) of.push(item);
          if (i === 4) of.push(a);
        }
        o.push(of);
        offsetList.push(o);
      })
    })
    return [list, offsetList]
  }

  /**
   * multiPolygon?????????????????????
   * @param coordinates
   * @param leftOffset
   * @param rightOffSet
   * return ??????polygonOffset
   */
  multiPolygonOffset(coordinates: any, leftOffset: number = 0.111111, rightOffSet: number = 1.111111): number [] {
    const list: any = [];
    const offsetList: any = [];
    coordinates.forEach((item: number[]) => {
      list.push(this.polygonOffset(item)[0], leftOffset, rightOffSet);
      offsetList.push(this.polygonOffset(item)[1], leftOffset, rightOffSet);
    })
    return [list, offsetList]
  }
}
