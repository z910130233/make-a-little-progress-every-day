近期有个小demo需要通过**geoserver**发布tif影像，一搜网上基本上都是通过java或者python调用封装好的rest请求，但是本地环境有限，懒得搭建其它的，查看了geoserver提供的REST文档直接请求发布，更加方便快捷。
**资料**

 - [geoserver REST文档](https://www.osgeo.cn/geoserver-user-manual/rest/index.html#rest)
 - 请求工具postman或者其它

刚做的时候是真的痛苦呀
![在这里插入图片描述](https://img-blog.csdnimg.cn/8db37db30b39423c8349ea55956dc3e4.png)
刚开始以为发布图层就是直接去Layers这个分类里面去找，一看第一行说明，我淦！！！咋这么多请求方式，然后找了一个试了一个都不好使（主要是请求方式不对）
![在这里插入图片描述](https://img-blog.csdnimg.cn/eb1347810a5d44a5a590f6c3b0bd380d.png)
最后没办法了，去查看了java版的处理过程源码：
![在这里插入图片描述](https://img-blog.csdnimg.cn/28d68a30a3594ee0a3fb6b279fb09495.png)
这边给出了这个示例，根据示例中的url找到这个请求：
![在这里插入图片描述](https://img-blog.csdnimg.cn/90e9a078e0634ca996bd87dc5a5935ec.png)
## 发布GeoTiff
上面说了一大堆，其实跟我们这个关系并不大，因为我们要用的是PUT请求，不是POST请求，这两个请求参数大差不差，基本一致。先给出请求的参数：
![在这里插入图片描述](https://img-blog.csdnimg.cn/0bbae7d826cc4c39a4b846ee6471712b.png)
请求说明：

 - 请求方式：PUT
 - url中的{workspaceName}对应工作空间名称，{store}对应图层名称，标题![在这里插入图片描述](https://img-blog.csdnimg.cn/e803a01f72e64f4cba8d4568884a29bf.png)
 - external：对应本地的tif文件，那么请求的正文就是本地tif的绝对路径（如果是其它的参数，则请求的正文要么是文件的url地址或者上传文件）
 - 注意：请求头加上“Authorization” = “账号:密码” 进行Base64加密，然后密文加上 “Basic ” + 密文（注意空格），例：![在这里插入图片描述](https://img-blog.csdnimg.cn/e866e9f8e51740ecbbff455ff8b3d1f7.png)
最后点击请求，请求在geoserver中查看已发布好的图层，以上是发布tif图层的操作。

## 修改图层样式
修改图层样式就简单很多了，直接对图层这部分修改就好了，请求的url如下（PUT请求）：
![在这里插入图片描述](https://img-blog.csdnimg.cn/ee3acd4733684aa487787ec4f4f2e61a.png)
**注意：** 请求的layerbody中如果是以**application/json** 需要用layer包裹起来（坑），如：

```javascript
{
	"layer": {
		"defaultStyle": {
			"name": "工作命名:样式名称"
		}
	}
}
```
