# geoserver忘记密码恢复

geoserver版本忘记了，应该大同小异，我是发布在tomcat里面的，所以目录由tomcat的webapps为根目录

修改文件路径 webapps/geoserver/data/security/usergroup/default/users.xml

xml内容为：
```xml
<?xml version="1.0" encoding="UTF-8"?>

<userRegistry xmlns="http://www.geoserver.org/security/users" version="1.0">
    <users>
        <user enabled="true" name="admin" password="digest1:D9miJH/hVgfxZJscMafEtbtliG0ROxhLfsznyWfG38X2pda2JOSV4POi55PQI4tw"/>
    </users>
    <groups/>
</userRegistry>

```

由此可见，password为加密的密文，直接修改为默认的密码保存即可
###  默认的账号密码为admin:geoserver
修改password为："digest1:D9miJH/hVgfxZJscMafEtbtliG0ROxhLfsznyWfG38X2pda2JOSV4POi55PQI4tw"
