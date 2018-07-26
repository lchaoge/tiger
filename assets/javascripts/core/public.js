/*
* v:1.0.0
* author:lily
* date:2016/06/01
* dateFormat
*/
define(['urlMapping', 'rtlPage', 'rtlLoad', 'rtlCalendar','rtlDialog','datetimepicker','rtlTableScroll'], function(urlMapping, rtlPage, rtlLoad, rtlNoteCalendar,rtlDialog,datetimepicker,rtlTableScroll){
    var publicNode = {};
    var isLocalHost = window.location.hostname.toLowerCase() == 'localhost';
    publicNode.getUrl = function(url,callback){
        callback(urlMapping[url]);
    };
    var _loading;
    publicNode.showLoading=function(){
        _loading = new rtlLoad();
    };
    publicNode.closeLoading=function(){
        _loading.hide();
    };
    publicNode.rtlPaging=function(options){
        /**
         * @type el String element id, size Number total page size, step Number page step,
         * @type desc String A=>all C=>count P=>page O=>other, descCount Number page total record count,
         * @type multi String S=>show whether to display the selection box,
         * @type multiDegrees Number degrees count and default is 10,
         * @type multiCallback Function when you change the selection box call back function,
         * @type callback Function when you click the number button or go button call back function.
         */
        new rtlPage({
            el: options.el,
            step: options.step || 2,
            size: options.size,//总页数
            desc: options.desc,//控制显示什么
            descCount: options.descCount,//总条数
            callback:function(data){
                options.callback(data);
            },
            multi:options.multi,//选择每页显示多少
            /*multiDegrees: options.multiDegrees,*/
            multiCallback: function(num, callback){
                options.multiCallback(num, callback);
            }
        });
    };
    publicNode.rtlTableScroll = function(options){
        new rtlTableScroll({
            elId:options.elId,
            isFixed:options.isFixed || 0,//1:固定表头
        });
    };
    /*异步获取数据接口*/
    publicNode.ajaxDataFetch = function(param){
        var url = urlMapping[param.url],
            returnObj = {};
        if(!url){
            returnObj.code = '9996';
            returnObj.msg = '请求的路由错误';
            return;
        }
        if(typeof param.type === 'undefined') param.type = 'GET';
        if(typeof param.data != 'string') param.data = JSON.stringify(param.data);
        $.ajax({
            type: isLocalHost? "GET" : param.type,
            url: url,
            dataType: 'json',
            async: true,
            cache: false,
            data: param.data,
            contentType: 'application/json;charset=utf-8',
            success: function (data) {
                if (typeof data === 'string') {
                    returnObj = JSON.parse(data);
                } else {
                    returnObj = data;
                }
                if (undefined != param.callback) param.callback(returnObj);
            },
            error: function () {
                publicNode.closeLoading();
                publicNode.showPrompt({
                    msg:'请求发生错误，请重试',
                    boxType: 'prompt',
                    type:'danger'
                });
            }
        });
    }
    /*转换路由*/
    publicNode.transitionRoute = function(url){
        return urlMapping[url];
    };
    /*页面提示信息框
     * options:{type: true, msg:"自定义"};type为TRUE的时候正确提示，false,null错误提示
     * */
    publicNode.showPrompt = function(options){
        /**
         * @type {{title: string [require] popup box title, callback: function [require] callback function when operating the pop-up box}}
         * @type {{msg: string [require] show message('this is message' for only show, 'this is ###100### pages and total ###300?f00### count' for change color style)}}
         * @type {{button: string [not require] <cancel> for only cancel button <confirm> for only confirm button}}
         * @type {{type: string [not require] default for warning <error> for danger <success> for success}}
         */
        new rtlDialog(options);
    }
    /*
    *获取日期
    *对Date的扩展，将 Date 转化为指定格式的String
     * 月(M)、日(d)、小时(h)、分(m)、秒(s)可以用 1-2 个占位符，
     * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
     *例子：
     *publicNode.dateFormat("yyyy-MM-dd hh:mm:ss.S","2016-07-02") ==> 2006-07-02 08:09:04.423
     *publicNode.dateFormat("yyyy-M-d h:m:s.S","2016/07/02")      ==> 2006-7-2 8:9:4.18
     *publicNode.dateFormat("yyyy-M-d h:m:s.S","2016/7/2")      ==> 2006-7-2 8:9:4.18
     * times:格式必须为：2016-07-02||2016/07/02
    */
    publicNode.dateFormat = function(fmt,times){
        if(fmt === "" && fmt === undefined){
            return null;
        }
        var date = new Date();
        if (undefined !== times && times!== "") {
            var timestamp = times;
            if(!(/[0-9]{13}/.test(times))){
                if(/^(\d{4})(-|\/)(\d{1,2})(-|\/)(\d{1,2})$/.test(times)){
                    timestamp = new Date((times+"").replace(/(-|年|月)/g,'/').replace(/日/g,"")).getTime();
                }else{
                    return null;
                }
            }
            date = new Date(parseInt(timestamp));
        }
        var o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };
    /*初始化日期控件的方法*/
    publicNode.dateCtrl = function(elId,isTime,startTime,endTime){
        publicNode.nodeReady({
            elId: elId,
            callback: function(node){
                var options = new Object();
                if(isTime){
                    var nowDate = publicNode.getDateFunc() + " 00:00:00:000",
                        nowTimes = new Date(nowDate).getTime();
                    options = {
                        language: 'zh-CN',
                        autoclose: 1,//自动关闭
                        todayHighlight: 1,//今天是否高亮
                        startView: 1,//制定显示时间格式类型
                        minView: 0,//最小值
                        maxView: 1,
                        forceParse: 0,//强制转换为日期
                        minuteStep: 30,//分钟阶段
                        startDate: new Date(nowTimes),
                        endDate: new Date(nowTimes + (1000*60*60*24-1000)),
                        initialDate: new Date(),//当天
                        format: 'hh:ii'//输出格式
                    };
                } else {
                    options = {
                        language: 'cn',
                        todayBtn: 1,
                        autoclose: 1,
                        forceParse: 0,
                        startView: 2,
                        minView: 2,
                        startDate: startTime?startTime:"",
                        endDate: endTime?endTime:"",
                        format: "yyyy-mm-dd",
                        initialDate:startTime?startTime:""
                    };
                }
                $(node).datetimepicker(options);
            }
        });
    };
    /*判断页面节点是否渲染完成*/
    var NodeReady = function(options){
        this.elId = options.elId;
        this.callback = options.callback;
        if(!this.elId) {
            throw new Error('element id is null');
        }
        if(!this.callback) {
            throw new Error('callback is null');
        }
        this.counter = 0;
    };
    NodeReady.prototype = {
        ready: function(){
            var _this = this;
            setTimeout(function () {
                if(_this.elId.indexOf(".") === 0){
                    var node = $(_this.elId)[0];
                }else {
                    var node = document.getElementById(_this.elId);
                }
                if (!node) {
                    _this.ready();
                    _this.counter++;
                    if (_this.counter > 30) {
                        _this.counter = 0;
                    }
                } else {
                    _this.counter = 0;
                    _this.callback(node);
                }
            }, 300);
        }
    };
    publicNode.nodeReady = function(options){
        new NodeReady(options).ready();
    };
    publicNode._IE = (function (){
        var v = 3, div = document.createElement('div'), all = div.getElementsByTagName('i');
        while (
            div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
                all[0]
            );
        return v > 4 ? v : false;
    }());
    return publicNode;
});