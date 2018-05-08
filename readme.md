# 介绍

尝试使用微信小程序和百度的语音识别接口 应用到ERP项目中

# 技术关键字

1. 微信小程序
2. 百度语音接口(baidu-aip-sdk)
3. nodejs,express
4. fluent-ffmegp


# 环境

1. windows 10
2. vs code  1.21.1
3. 微信小程序开发工具 1.02.1803210
4. 腾讯云服务

# 输入

在微信小程序端，按下开始录音按钮，开始录音

## 输出

你说的话是：

## 微信小程序端（index.js）

```javascript
// 录音对象
const recorderManager = wx.getRecorderManager();

function sendRecord(src) {
  var obj = {
    // 需要替换为本地或外网的地址（server端服务映射的地址）
    url: "http://ai.xxx.com:3001/baiduAI2/recognition",
    filePath: src,
    name: "fffile",
    header: {
      'Content-Type': 'application/json'
    },
    success: function (result) {
      var data = JSON.parse(result.data);
      // msg 为最终语音识别的字符串
      var msg = data.result;
      // 获取当前页面对象
      var page = getCurrentPages()[0];
      page.setData({ msg: msg });
    },
    fail: function (err) {
      console.log(err);
    }
  };
  wx.uploadFile(obj)
}

```

# 后台(server)需要替换的参数

## routes/aiSpeechRecognition.js

```javascript

// #region 创建百度授权 
// 设置APPID/AK/SK
var APP_ID = "xxx";
var API_KEY = "xxx";
var SECRET_KEY = "xxx";

```
# ffmpeg环境配置
1. 下载ffmpeg https://blog.csdn.net/yy3097/article/details/51063950
2. 把ffmpeg文件夹拷贝到D盘根目录
3. win10-我的电脑（此电脑）-右键属性-高级系统设置-环境变量，分别在用户变量和系统变量下做如下操作：
    增加用户变量：
    变量名：FFMPEG_PATH
    变量值：D:\ffmpeg\bin

    变量名：FFPROBE_PATH
    变量值：D:\ffmpeg\bin

    增加系统变量：
    Path:;D:\ffmpeg\bin


# 启动

1. 下载项目

   ```json
   git clone https://github.com/leafmen/wx_baidu_ai.git
   ```

2. 使用微信小程序打开 **client** 目录

3. 配置  后台的接口地址

4. 打开 **server** 后台文件夹

5. 输入 `npm i` 安装依赖

6. 输入 命令 启动项目 **node index**

7. 手机微信扫一扫小程序 - 语音输入 "大吉大利" 

# 注意事项

1. 当使用微信开发工具 发送的语音文件的格式是 **aac**,但是使用手机微信发送的格式是 **m4a**  这里直接处理的是m4a  转码工具是ffmpeg,转成wav后发送到百度语音识别接口 

2. 注意 开发阶段需要打开小程序开发工具内的 **不校验安全域名....**的选项

3. 当调用百度接口的时候,需要填写上自己的相关信息

4. 百度AI http://ai.baidu.com/docs/#/ASR-Online-Node-SDK/top

# 联系方式

可以通过邮件联系 leafmen@126.com