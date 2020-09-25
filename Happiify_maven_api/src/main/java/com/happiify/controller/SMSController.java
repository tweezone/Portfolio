package com.happiify.controller;

import java.util.Map;

import com.happiify.model.SMSResponeModel;
import com.yunpian.sdk.YunpianClient;
import com.yunpian.sdk.model.Result;
import com.yunpian.sdk.model.SmsSingleSend;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SMSController {


    @RequestMapping(value="sms/sendsms", method = RequestMethod.POST)
    public SMSResponeModel sendsms(@RequestBody Map<String, String> requestMap) {
       // return fileItemService.fetchAllFileItems(userId);
       //初始化clnt,使用单例方式
        YunpianClient clnt = new YunpianClient("ce98d30b7bc991877acb1b315bbad6cd").init();

        String phone = requestMap.get("phone");
        String verifyCode = requestMap.get("verifyCode");
        //发送短信API
        Map<String, String> param = clnt.newParam(2);
        param.put(YunpianClient.MOBILE, phone);
        param.put(YunpianClient.TEXT, "【Happiify Inc.】您的验证码是"+verifyCode);
        Result<SmsSingleSend> r = clnt.sms().single_send(param);
        //获取返回结果，返回码:r.getCode(),返回码描述:r.getMsg(),API结果:r.getData(),其他说明:r.getDetail(),调用异常:r.getThrowable()
        int iCode = r.getCode();
        //账户:clnt.user().* 签名:clnt.sign().* 模版:clnt.tpl().* 短信:clnt.sms().* 语音:clnt.voice().* 流量:clnt.flow().* 隐私通话:clnt.call().*

        //释放clnt
        SMSResponeModel model=new SMSResponeModel(iCode);
        clnt.close();
        return model;
    }
}