公司目前有个老项目，甲方说有个运行模块出错了，查看原因是一个sql更新超时了，一看数据表，条目数据居然有三千多万行

![在这里插入图片描述](https://img-blog.csdnimg.cn/56a5adfacd1a40788f2ae5dcc869be3a.png)

并且查询这个行数居然花了这么多时间
![在这里插入图片描述](https://img-blog.csdnimg.cn/1c1f5755655f49228a786713e1da54fc.png)

以为没有建索引，但是看了确实建了索引