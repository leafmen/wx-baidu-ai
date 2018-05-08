var express=require('express');
var router=express.Router();
var fs=require('fs');
var Multiparty =require('multiparty');
var ffmpeg=require('fluent-ffmpeg');//创建一个ffmpeg命令
var AipSpeechServer=require('baidu-aip-sdk').speech;
 
//设置appid/appkey/appsecret
var APP_ID = "";
var API_KEY = "";
var SECRET_KEY = "";
 
// 新建一个对象，建议只保存一个对象调用服务接口
var client =new AipSpeechServer(APP_ID, API_KEY, SECRET_KEY);
router.post('/recognition', function(req, res, next){
  //生成multiparty对象，并配置上传目标路径
  var form =new Multiparty.Form({ uploadDir: './public/audio'});
  //上传完成后处理
  form.parse(req, function(err, fields, files){
    var filesTemp=JSON.stringify(files, null, 2);
    if(err){
      //console.log('parse error: '+err);
      res.json({
        ret: -1,
        data:{},
        msg: '未知错误'
      });
    }else{
      //console.log('parse files: '+filesTemp);
      var inputFile = files.fffile[0];
      var uploadedPath=inputFile.path;
      var newFilePath = uploadedPath.slice(0, -3) + "wav";
      var mp3FilePath = uploadedPath.slice(0, -3) + "mp3";      
      var command = new ffmpeg({ source: uploadedPath, nolog: true });

      //Set the path to where FFmpeg is installed
      command.setFfmpegPath("D:\\ffmpeg\\bin\\ffmpeg.exe") //I forgot to include "ffmpeg.exe"
      .saveToFile(newFilePath)
      .on('error', function(err){
        console.log(err)
      })
      .on('end', function(){
        //调用百度语音合成接口
        var voice = fs.readFileSync(newFilePath);
        var voiceBuffer=new Buffer(voice);
        client.recognize(voiceBuffer, 'wav', 16000).then(function(result){
          //console.log('<recognize>: ' + JSON.stringify(result));
          res.end(JSON.stringify(result));     
        }, function(err){
          console.log(err);
        });
        //语音识别 end
 
        // //删除上传的临时音频文件
        // fs.unlink(uploadedPath, function(err){
        //   if(err){
        //     console.log(uploadedPath+'文件删除失败');
        //     console.log(err);
        //   }else{
        //     console.log(uploadedPath+'文件删除成功');
        //   }
        // });
        // //删除mp3转成wav格式的音频
        // fs.unlink(newFilePath, function(err){
        //   if(err){
        //     console.log(newFilePath + '文件删除失败');
        //     console.log(err);
        //   }else{
        //     console.log(newFilePath + '文件删除成功');
        //   }
        // });
      });
    }
  });
});
 
module.exports=router;