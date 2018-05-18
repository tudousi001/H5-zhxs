/**
 * SZJSBridge
 */

'use strict';

var PalauAPI = (function() {

    var uniqueId = 1;
    var responseCallbacks = {};

    var _handleMessageFromObjC = function(callbackId, responseData) {
        var responseCallback = responseCallbacks[callbackId];
        console.log("callbackId: " + callbackId);
        console.log("responseCallback: " + responseCallback);
        if (!responseCallback) { return; }
        responseCallback(responseData);
    }

    var log = function(msg) {
        SZJSBridge.log(msg);
    }

    //返回上一页
    var back = function() {
        SZJSBridge.pop();
    }

    //dispath
    var dispatch = function() {
        var count = arguments.length;
        switch (count){
            case 1:{
                SZJSBridge.dispatch(arguments[0]);
            }
            break;
            case 2:{
                var callbackId = 'palau_'+(uniqueId++)+'_'+new Date().getTime();
                responseCallbacks[callbackId] = arguments[1];
                SZJSBridge.dispatchWithCallback(arguments[0],callbackId);
            }
            break;
        }
    }

    //pay
    var pay = function(platform, orderNo, uid, responseCallback) {
        var callbackId = 'palau_'+(uniqueId++)+'_'+new Date().getTime();
        responseCallbacks[callbackId] = responseCallback;
        SZJSBridge.pay(platform, orderNo, uid, callbackId);
    }

	//带图片的分享
	var share = function(platform, title, content, url, image, responseCallback) {
        var callbackId = 'palau_'+(uniqueId++)+'_'+new Date().getTime();
        responseCallbacks[callbackId] = responseCallback;
        SZJSBridge.share(platform, title, content, url, image, callbackId);
    }

    //share
//    var share = function(platform, title, content, url, responseCallback) {
//        var callbackId = 'palau_'+(uniqueId++)+'_'+new Date().getTime();
//        responseCallbacks[callbackId] = responseCallback;
//        SZJSBridge.share(platform, title, content, url, callbackId);
//    }

    var api = {
        log : log,
        back : back,
        dispatch : dispatch,
        pay : pay,
        share : share,
        user : {},
        location : {},
        device : {},
        keychainIOS : {},
        cache : {},
        preferences : {},
        event : {},
        media : {},
        view : {},
        file : {},
        _handleMessageFromObjC : _handleMessageFromObjC
    }

    api.user.userInfo = function() {
        var userInfo = SZJSBridge.getUserInfo();
        return JSON.parse(userInfo);
    }

    api.user.login = function(responseCallback) {
        var callbackId = 'palau_'+(uniqueId++)+'_'+new Date().getTime();
        responseCallbacks[callbackId] = responseCallback;
        SZJSBridge.login(callbackId);
    }

    api.user.refreshToken = function (responseCallback) {
        var callbackId = 'palau_'+(uniqueId++)+'_'+new Date().getTime();
        responseCallbacks[callbackId] = responseCallback;
        SZJSBridge.refreshToken(callbackId);
    }

    api.device.deviceInfo = function() {
        var deviceInfo = SZJSBridge.getDeviceInfo();
        return JSON.parse(deviceInfo);
    }

    api.device.deviceId = function() {
        return api.device.deviceInfo.deviceId;
    }

    api.device.dial = function(phoneNumber) {
        return SZJSBridge.dial(phoneNumber);
    }

    //获取定位
    api.location.requestLocation = function(responseCallback) {
        var callbackId = 'palau_'+(uniqueId++)+'_'+new Date().getTime();
        responseCallbacks[callbackId] = function(response) {
          responseCallback(JSON.parse(response));
        };
        SZJSBridge.requestLocation(callbackId);
    }

   //持续定位
   api.location.subscribeToLocationUpdates = function(responseCallback) {
       var callbackId = 'palau_'+(uniqueId++)+'_'+new Date().getTime();
       responseCallbacks[callbackId] = function(response) {
         responseCallback(JSON.parse(response));
       };
       SZJSBridge.subscribeToLocationUpdates(callbackId);
   }

    api.keychainIOS.passwordForAccount = function(account) {
        return SZJSBridge.passwordForAccount(account);
    }

    api.keychainIOS.deletePasswordForAccount = function(account) {
        return SZJSBridge.deletePasswordForAccount(account);
    }

    api.keychainIOS.setPasswordForAccount = function(account, password) {
        return SZJSBridge.setPasswordForAccount(password, account);
    }

    api.cache.valueForKey = function(key) {
    return SZJSBridge.objectForKey(key);
    }

    api.cache.setValueForKey = function(key, value) {
    SZJSBridge.setObjectForKey(value, key);
    }

    api.cache.removeValueForKey = function(key) {
    SZJSBridge.removeObjectForKey(key);
    }

    api.preferences.preferencesForKey = function(key) {
    return SZJSBridge.objectPreferencesForKey(key);
    }

    api.preferences.setPreferencesForKey = function(key, value) {
    SZJSBridge.setObjectPreferencesForKey(value, key);
    }

    api.preferences.removePreferencesForKey = function(key) {
    SZJSBridge.removePreferencesForKey(key);
    }

    api.event.addEventListener = function(eventName, responseCallback) {
        var callbackId = 'palau_'+(uniqueId++)+'_'+new Date().getTime();
        responseCallbacks[callbackId] = responseCallback;
        SZJSBridge.addEventListenerCallback(eventName, callbackId);
    }

    api.event.removeEventListener = function(eventName) {
        SZJSBridge.removeEventListener(eventName);
    }

    api.event.sendEvent = function(eventName) {
        SZJSBridge.sendEvent(eventName);
    }

    //点播
    api.media.playVideo = function(url) {
        SZJSBridge.playVideo(url);
    }

    //直播
    api.media.playLive = function(url) {
        SZJSBridge.playLive(url);
    }

    //关闭播放器
    api.media.closeVideo = function() {
        SZJSBridge.closeVideo();
    }

    api.media.playAudio = function (url) {
        SZJSBridge.playAudio(url);
    }
    api.media.playLocalAudio = function (dir,filaName) {
        SZJSBridge.playLocalAudio(dir,filaName);
    }
    //浏览图片
    api.media.openImage = function(url, index) {
        SZJSBridge.viewImages(url, index);
    }


    //显示原生导航栏
    api.view.showHeader = function() {
        SZJSBridge.showHeader();
    }

    //隐藏原生导航栏
    api.view.hideHeader = function() {
        SZJSBridge.hideHeader();
    }

    //显示loading
    api.view.showLoading = function() {
        SZJSBridge.showLoading();
    }

    //隐藏loading
    api.view.hideLoading = function() {
        SZJSBridge.hideLoading();
    }

    //开启缩放
    api.view.enableZoom = function(responseCallback) {
        var callbackId = 'palau_'+(uniqueId++)+'_'+new Date().getTime();
        responseCallbacks[callbackId] = responseCallback;
        SZJSBridge.enableZoom(callbackId);
    }

    api.file.fileDownload = function(dir,fileName,url,responseCallback){
        console.log("fileDownload")
        var callbackId = 'palau_'+(uniqueId++)+'_'+new Date().getTime();
        responseCallbacks[callbackId] = responseCallback;
        SZJSBridge.fileDownload(dir,fileName,url,callbackId);
    }

    api.file.fileDelete=function (dir,fileName) {
        return SZJSBridge.fileDelete(dir,fileName);
    }
    api.file.fileList=function (dir) {
        return SZJSBridge.fileList(dir);
    }
    return api;

})();

//module.exports = PalauAPI;
