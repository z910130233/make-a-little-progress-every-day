# POLYGON多边形错位偏移 根据偏移量，顶点组成新的MultiPolygon

基础geojson知识：https://www.jianshu.com/p/852d7ad081b3

偏移图层，粉红色为原图层，绿色为设置偏移量后的图层，紫色为勾勒出来的新图层（为多个面组合而成），效果如下：
![在这里插入图片描述](https://img-blog.csdnimg.cn/681854df5aa6493fb965ada947b08eed.png)

起初我以为能做成一个面来组成偏移后的，后面经过勾勒后达不到那种效果，所以采取顶点和顶点相连达到面和面组合，最后形成的数据格式也应该相当于是MultiPolygon格式

