//var serverUrl = "http://192.168.1.12:10004";
//var serverUrl = "http://192.168.1.95:10004"; //马文军
//serverUrl = "http://182.92.191.75:10004";//线上
// var serverUrl = "http://127.0.0.1:10004";//线上
var serverUrl = "http://180.76.141.250:30030";

//var serverUrl ="";

var loginUrl = serverUrl + "/login/in"; //登录 userName=456&password=456&code=xxxx
var loginCodeUrl = serverUrl + "/login/verifyCode"; //登录验证码
var serverToken = '?token=bPra5sVLqHa24nmIdLBpXhnRP%2FtJhO1pr3vZ3v%2FOA8A%3D';
// app 快捷功能管理
// var functionPortAllList = serverUrl + '/functionPort/getAllList';

//获取轮播图全部列表
var getAllBannerLists = serverUrl + '/banner/getAllBannerLists';
//搜索轮播图
var getBannerListByTepes = serverUrl + '/banner/getBannerListByTepes';

//家长用户
var getUserList = serverUrl + '/user/getAllList'; //获取家长用户列表
var seekUserList = serverUrl + '/user/searchUser'; //搜索家长用户

//App快捷功能管理
var AppGetList = serverUrl + '/functionPort/getAllList'; //获取App快捷功能管理列表
var AppSeek = serverUrl + '/functionPort/getAllListByType'; //App快捷功能管理搜索


if (window.location.pathname.indexOf('login.html') < 0) {
    checkUser();
}

//===================公用方法=============================

function ajaxSubmit(url, getData, callback) {
    getData = getData || {};
    checkUser();
    var user = getUserInfo();
    getData.token = user.token;
    doAjax(url, getData, callback);
}

function ajaxWithUser(url, getData, callback) {
    getData = getData || {};
    checkUser();
    var user = getUserInfo();
    getData.token = user.token;
    myAjax(url, getData, callback);
}

function ajaxGet_withoutUser(url, getData, callback) {
    getData = getData || {};
    myAjax(url, getData, callback);
}


//打开新页
function openNewWindow(url, params) {
    var text = "";
    if (isNotBlank(params)) {
        text = "?";
        for (var key in params) {
            text = text + key + "=" + params[key] + "&"
        }
    }
    if (url.indexOf('login.html') == -1) {
        location.href = url + text;
    } else {
        location.href = url + text;
    }
}


function checkUser() {
    var user = getUserInfo();
    if (!user || !user.token) {
        openLogin();
    }
}

function setUserInfo(user) {
    sessionStorage.setItem('user_admin', JSON.stringify(user));
    var timestamp = (new Date()).valueOf();
    sessionStorage.setItem('user_admin_time', JSON.stringify(timestamp));
}

function removeUserInfo(user) {
    sessionStorage.setItem('user_admin', '');

}

function getUserInfo() {
    var timestamp = (new Date()).valueOf();
    var oldTimestamp = sessionStorage.getItem('user_admin_time');
    if (isBlank(oldTimestamp)) {
        return null;
    }
    if (timestamp - oldTimestamp > (60 * 60 * 24 * 7 * 1000)) {
        return null;
    }
    var user = sessionStorage.getItem('user_admin');
    if (isNotBlank(user)) {
        return JSON.parse(user);
    } else {
        return null;
    }
}
function getUserToken() {
    var user = getUserInfo();
    return encodeURIComponent(user.token);
}


function isFunction(func) {
    if (typeof (func) == "function") {
        return true;
    }
    return false;
}

function isJson(obj) {
    return typeof (obj) == "object" &&
        Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
}

function isNullJson(obj) {
    return isJson(obj) && JSON.stringify(obj) == '{}';
}


/**
 *常用函数
 */
function msgSuccess(result){
    layer.msg(result, {
        icon: 1,
        time:800,
        shade: 0.01
    });
}
function msgFail(result){
    layer.msg(result, {
        icon: 2,
        time:800,
        shade: 0.01
    });
}

function loading(type) {
    var type = type == undefined ? 1 : type;
    var index = layer.load(type, {
        shade: [0.1, '#fff']
    });
    return index;
}

function isBlank(data) {
    return (data == "" || typeof (data) == "undefined" || data == null) ? true : false;
}

function isNotBlank(data) {
    return (data == "" || typeof (data) == "undefined" || data == null) ? false : true;
}
function getRadioChecked(name) {
    var t = [];
    $('input[name="' + name + '"]:checked').each(function () {
        t.push($(this).val());
    });
    return t;
}
function setRadioChecked(name, value) {
    $("input[name='" + name + "']:radio").each(function () {
        var data = $(this).val();
        if (value == data) {
            $(this).prop('checked', true);
        }

    });
}

function setCheckChecked(name, value) {
    for (var i = 0; i < value.length; i++) {
        $("input[name='" + name + "']:checkbox").each(function () {
            var data = $(this).val();
            if (value[i] == data) {
                $(this).prop('checked', true);
            }
        });
    }
}

function htmlRadio(data, fieldName) {
    var html = "";
    for (var i = 0; i < data.length; i++) {
        html += '<div class="radio radio-info radio-inline">';
        html += '        <input type="radio" id="' + fieldName + data[i].id + '"  name="' + fieldName + '" value ="' + data[i].id + '"  data-value="' + data[i].id + '">';
        html += '<label for="' + fieldName + data[i].id + '">' + data[i].name + ' </label>';
        html += '</div>';
    }
    return html;
}

function htmlCheckBox(data, fieldName) {
    var html = "";
    for (var i = 0; i < data.length; i++) {
        html += '<div class="checkbox checkbox-success checkbox-inline">';
        html += '<input type="checkbox" id="' + fieldName + data[i].id + '" name="' + fieldName + '"  value ="' + data[i].id + '"  data-value="' + data[i].id + '">';
        html += '<label for="' + fieldName + data[i].id + '">' + data[i].name + ' </label>';
        html += '</div>';

    }
    return html;
}

function multipleSelect(data, dom) {
    var content = "";
    for (var i = 0; i < data.length; i++) {
        content += '<option value="' + data[i].id + '">' + data[i].name + '</option>'
    }

    $(dom).empty();
    $(dom).append(content);
    //更新内容刷新到相应的位置
    $(dom).selectpicker('render');
    $(dom).selectpicker('refresh');
}

//空校验
function showValidate(dom) {
    $(dom).parent().find('.validate').show().delay(3000).hide(300);
}

function showValidateMsg(dom, msg) {
    $(dom).parent().find('.validate').show().delay(3000).hide(300);
    $(dom).parent().find('.validate').text(msg);
}

//表单重置
function resetForm(dom) {
    $(dom)[0].reset();
}

//动态填写下拉框
function changeSelect(id, obj) {
    var optionStr = '';
    for (var i = 0; i < obj.length; i++) {
        optionStr = optionStr + "<option value='" + obj[i].id + "'>" + obj[i].name + "</option>"
    }
    $("#" + id).html(optionStr);
}

//动态填写下拉框
function appendSelect(id, obj, msg) {
    var selectMsg = isBlank(msg) ? "请选择" : msg;
    var optionStr = '';
    optionStr = optionStr + "<option value=''>" + selectMsg + "</option>";
    for (var i = 0; i < obj.length; i++) {
        optionStr = optionStr + "<option value='" + obj[i].id + "'>" + obj[i].name + "</option>"
    }
    $("#" + id).html(optionStr);
}

//时间戳
function formatDateTime(timeStamp) {
    var date = new Date();
    date.setTime(timeStamp);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
};

//年月日
function formatDateTimeYMD(timeStamp, flag) {
    var date = new Date();
    date.setTime(timeStamp);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    if (flag) {
        return y + '年' + m + '月' + d + '日';
    } else {
        return y + '-' + m + '-' + d;
    }

};

//克隆对象
function cloneObj(obj) {
    var str, newobj = obj.constructor === Array ? [] : {};
    if (typeof obj !== 'object') {
        return;
    } else if (window.JSON) {
        str = JSON.stringify(obj), //系列化对象
            newobj = JSON.parse(str); //还原
    } else {
        for (var i in obj) {
            newobj[i] = typeof obj[i] === 'object' ?
                cloneObj(obj[i]) : obj[i];
        }
    }
    return newobj;
};

//通用处理函数
function handleCommon(url, params, msgStr, func) {
    layer.msg(msgStr, {
        shade: [0.1, '##f5f5f5'],
        time: 0 //不自动关闭
        ,
        btn: ['确定', '取消'],
        yes: function (index) {
            layer.close(index);
            myAjax(url, params, func);
        },
        btn2: function (index, layero) {
        }
    });
}


/*--------------图片上传-----------*/
function uploadIcon() {
    $("#uploadForm input").click();
}

/*--------------图片上传后台-----------*/
$("#uploadForm input").change(function () {

    var formData = new FormData($(this).parent()[0]);
    $.ajax({
        url: 'http://store.quakoo.com/storage/guoguo/handle', //Server script to process data
        type: 'POST',
        data: formData,
        sync: false,
        cache: false,
        contentType: false,
        processData: false,
        dataType: "json",
        success: function (result) {
            if (result.ok != undefined) {
                $('#photoCover').val(result.ok);
                $("#iconView").attr('src', result.ok);
                $("#iconView").show();
                var data = JSON.stringify(result);
                $("#cover").val(result.ok);
            } else {
                layer.msg('上传失败！', {
                    icon: 2
                });
            }

        },
        error: function () {
            layer.msg('上传失败！', {
                icon: 2
            });
        }
    });
})

//缩略图
function ImageThumb(value, width, height) {
    var im = value.split(",")[0];
    var title = value.indexOf("http");
    var content = "";
    if (im && title == 0) {
        var index = im.lastIndexOf(".");
        var first = im.substr(0, index);
        var last = im.substr(index, im.length);
        var str = "_" + width + "_" + height;
        var imgsrc = first + str + last;
        content += "<img class='img' src='" + imgsrc + "' onclick=imageViewer('" + value + "') />";
        return content;
    } else {
        return '-';
    }
}

//缩略图
function ImageThumb(value, width, height, flag) {
    var im = value.split(",")[0];
    var title = value.indexOf("http");
    var content = "";
    if (im && title == 0) {
        var index = im.lastIndexOf(".");
        var first = im.substr(0, index);
        var last = im.substr(index, im.length);
        var str = "_" + width + "_" + height;
        var imgsrc = first + str + last;

        if (flag) {
            content += "<img class='img' src='" + imgsrc + "' onclick=imageViewer('" + value + "') />";
        } else {
            content += "<img class='img' src='" + imgsrc + "' onclick=viewImg('" + value + "') />";
        }

        return content;
    } else {
        return '-';
    }
}


function imageViewer(value) {
    $("#imgView").html("");
    var imgList = ImgList(value);
    $("#imgView").html(imgList);
    //$("#imgView").find('li').attr("display","none");
    var viewer = new Viewer(document.getElementById('imgView'), {
        url: 'data-original',
        hidden: function () {
            viewer.destroy();
        }
    });
    $("#imgView").find('img')[0].click();
}

function ImgList(value) {
    var imgs = value.split(",");
    var content = "";
    for (var i = 0, l = imgs.length; i < l; i++) {
        if (isNotBlank(imgs[i])) {
            content += '<li><img data-original=' + imgs[i] + ' src=' + imgs[i] + ' alt=图片' + i + '></li>';
        }
    }

    return content;
}

/*------------------图片轮播----------------*/
function viewImg(value) {
    var imgs = value.split(",");
    var json = ViewerList(imgs);
    layer.photos({
        photos: json,
        anim: 5,
        shade: 0.1
    }); //0-6的选择，指定弹出图片动画类型，默认随机
}

var ViewerList = function (imgs) {
    var json = {
        "title": "呵呵", //相册标题
        "id": 123, //相册id
        "start": 0, //初始显示的图片序号，默认0 -->
        "data": new Array() //相册包含的图片，数组格式
    }
    if (imgs.length < 2) {
        json.data.push({
            'src': imgs[0], //原图地址
            'thumb': imgs[0] //缩略图地址
        });
    } else {
        for (var i = 0; i < imgs.length - 1; i++) {
            json.data.push({
                'src': imgs[i], //原图地址
                'thumb': imgs[i] //缩略图地址
            });
        }
    }
    return json;
}



//tips
function MyTips(id, data) {
    var html = "", str =data, str1 = data.substring(0,20);
    var l = data.length;
    if (l > 20) {
        html += '<span id=' + id + '\ onmouseover =\'showDesc(' + id + "," + JSON.stringify(str) + ')\' >';
        html += str1 + "...";
    } else {
        html += '<span>'
        html += str;
    }
    html += "</span>";
    return html;
}

function showDesc(id, desc) {
    var html = "<p>" + desc + "</p>"
    layer.tips("<span style='color:black'>" + html + "</span>", id, {
        tips: [1, '#3595CC'],
        time: 3000
    });
}
/*--------------图片上传插件-----------*/


/*-----------------------ajax请求------------------------------*/
function myAjax(url, param, func) {
    if (!url.startsWith(serverUrl)) {
        url = serverUrl + url;
    }

    param = param || {};

    //var index = loading();
    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        data: param,
        complete: function (xhr, status) {
            //拦截器实现超时跳转到登录页面
            // 通过xhr取得响应头
            var REDIRECT = xhr.getResponseHeader("REDIRECT");
            //如果响应头中包含 REDIRECT 则说明是拦截器返回的
            if (REDIRECT == "REDIRECT") {
                var win = window;
                while (win != win.top) {
                    win = win.top;
                }
                //重新跳转到 login.html
                win.location.href = xhr.getResponseHeader("CONTEXTPATH");
            }
        },
        success: function (data) {

            if (data && data.success) {
                //layer.close(index);
                if (typeof func == 'function') {
                    func(data, param);
                }
            } else {
                //layer.close(index);
                if (data && data.code == 400) {
                    openLogin();
                }
                layer.msg("<em style='color:red'>" + data.msg + "</em>", {time: 1200, icon: 5});
            }

        },
        error: function () {
            //layer.close(index);
            layer.msg("请求出错", {
                icon: 2
            });
        }

    });
}

function doAjax(url, param, func) {
    if (!url.startsWith(serverUrl)) {
        url = serverUrl + url;
    }

    param = param || {};

    var index = loading(2);
    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        data: param,
        complete: function (xhr, status) {
            //拦截器实现超时跳转到登录页面
            // 通过xhr取得响应头
            var REDIRECT = xhr.getResponseHeader("REDIRECT");
            //如果响应头中包含 REDIRECT 则说明是拦截器返回的
            if (REDIRECT == "REDIRECT") {
                var win = window;
                while (win != win.top) {
                    win = win.top;
                }
                //重新跳转到 login.html
                win.location.href = xhr.getResponseHeader("CONTEXTPATH");
            }
        },
        success: function (data) {
            layer.close(index);
            if (data && data.success) {
                if (typeof func == 'function') {
                    func(data, param);
                }
            } else {
                if (data && data.code == 400) {
                    openLogin();
                }
                layer.msg("<em style='color:red'>" + data.msg + "</em>", {time: 1200, icon: 5});
            }

        },
        error: function () {
            layer.close(index);
            layer.msg("请求出错", {
                icon: 2
            });
        }

    });
}

function openLogin() {

    window.location.href = "/admin/login/login.html"

}

//刷新页面
function reLoad() {
    setTimeout(function () {
        window.location.reload();
    }, 1500);
}

//刷新表格
function handleTable(data, type, url) {
    if (type == 1) { //更新一行
        $table.bootstrapTable('updateByUniqueId', {
            id: data.id,
            row: data
        });
    } else if (type == 2) { //删除一行
        $table.bootstrapTable('removeByUniqueId', data.id);
    } else if (type == 3) { //刷新数据
        $table.bootstrapTable('refresh', {
            url: url
        });
    } else if (type == 4) { //删除很多行
        $table.bootstrapTable('remove', {
            field: 'id',
            values: [data]
        });
    } else if (type == 5) { //分页刷新表格
        $table.bootstrapTable('refreshOptions', {
            pageNumber: 1
        });
    }
}

/**
 * 构建form表单，以post方式提交
 * @param actionUrl  提交路径
 * @param parms      提交参数
 * @returns {___form0}
 */
function construtForm(actionUrl, parms) {
    var form = document.createElement("form");
    form.style.display = 'none';
    ;
    form.action = actionUrl;
    form.method = "post";
    document.body.appendChild(form);


    for (var key in parms) {
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = parms[key];
        form.appendChild(input);

    }
    return form;
}


//地区切换

function areaChange() {
    var value = $(this).val();
    if (value == 2) {
        $(".totalarea").show();
    } else {
        $(".totalarea").hide();
    }
}

/*---------------CKeditor --------*/
var MyCKeditor = {
    getData: function () { //获取数据
        return CKEDITOR.instances.newContent.getData();
    },
    setData: function (data) { //设置数据
        CKEDITOR.instances.newContent.setData(data);
    }
}

/*-------------------------------新开Tab------------------*/
/**
 * 示例： addMenuItem("https://www.baidu.com","百度");
 */
function addMenuItem(dataUrl, menuName, paramFlag) {
    var timestamp = $.now();
    var dataTime = (timestamp.toString()).substring((timestamp.toString()).length - 5);
    // 获取标识数据
    var flag = true;
    if (dataUrl == undefined || $.trim(dataUrl).length == 0) return false;

    var menuName = menuName,
        dataIndex = dataTime;
    var dataSrc = dataUrl.split('?')[0];
    // 选项卡菜单已存在
    $('.J_menuTab', window.parent.document).each(function () {
        if ($(this).data('id') == dataSrc) {
            if (!$(this).hasClass('active')) {
                $(this).addClass('active').siblings('.J_menuTab').removeClass('active');
                // 显示tab对应的内容区
                $('.J_mainContent .J_iframe', window.parent.document).each(function () {
                    if ($(this).data('id') == dataSrc) {
                        $(this).show().siblings('.J_iframe').hide();
                        return false;
                    }
                });
                refreshTab(dataUrl);
            }
            flag = false;
            return false;
        }
    });

    // 选项卡菜单不存在
    if (flag) {
        var str = '<a href="javascript:;" class="active J_menuTab" data-id="' + dataSrc + '">' + menuName + ' <i class="fa fa-times-circle"></i></a>';
        $('.J_menuTab', window.parent.document).removeClass('active');

        // 添加选项卡对应的iframe
        var str1 = '<iframe class="J_iframe" name="iframe' + dataIndex + '" width="100%" height="100%" src="' + dataUrl + '" frameborder="0" data-id="' + dataSrc + '" seamless></iframe>';
        $('.J_mainContent', window.parent.document).find('iframe.J_iframe').hide().parents('.J_mainContent').append(str1);

        //            var loading = layer.load();
        //
        //            $('.J_mainContent iframe:visible', window.parent.document).load(function () {
        //                    //iframe加载完成后隐藏loading提示
        //                    layer.close(loading);
        //            });

        $('.J_menuTabs .page-tabs-content', window.parent.document).append(str);

    }
    return false;
}

//刷新iframe
function refreshTab(dataUrl) {
    var dataSrc = dataUrl.split('?')[0];
    var target = $('.J_iframe[data-id="' + dataSrc + '"]', window.parent.document);
    //显示loading提示
    var loading = layer.load();
    target.attr('src', dataUrl).load(function () {
        //关闭loading提示
        layer.close(loading);
    });
}

//时间选择
function timeSelectInit() {
    $('#startTime').datepicker({
        autoclose: true,
        todayHighlight: true,
        language: "zh-CN",
        clearBtn: true, //清除按钮
        format: "yyyy-mm-dd" //日期显示格式
    }).on('changeDate', function (e) {
        var startTime = new Date(e.date.valueOf());
        $('#endTime').datepicker('setStartDate', startTime);
    });

    //结束时间：
    $('#endTime').datepicker({
        autoclose: true,
        todayHighlight: true,
        clearBtn: true, //清除按钮
        language: "zh-CN", //语言设置
        format: "yyyy-mm-dd" //日期显示格式
    }).on('changeDate', function (e) {
        var startTime = new Date(e.date.valueOf());
        $('#startTime').datepicker('setEndDate', startTime);
    });
}



function transTime(value) {
    var s = value.split('----');
    var st = s[0].replace(/(^\s*)|(\s*$)/g, "");
    var et = s[1].replace(/(^\s*)|(\s*$)/g, "");
    return {
        start: new Date(st).getTime(),
        end: new Date(et).getTime()
    }
}


String.prototype.startsWith = String.prototype.startsWith || function (prefix) {
    return this.slice(0, prefix.length > this.length ? this.length : prefix.length) === prefix;
};


var getQueryParam = function(){
    var loc = location.search;
    var url = loc.substring(1,loc.length);
    var str = url.split("&");
    var json = {};
    for(x in str){
        var s = str[x].split("=");
        json[s[0]] = decodeURI(s[1]);
    }
    // console.log(json);
    return json;
};

//展示layer的消息
function showMsg(msg, icon) {
    layer.msg("<em style='color:red'>" + data.msg + "</em>", {time: 1200, icon: icon || 1});
}

function getCommitPagerParam(params) {
    return {
        token: getUserInfo().token,
        page: (params.offset / params.limit) + 1,
        size: params.limit
    };
}
//校验数字
function ValidateNumber(e, pnumber) {
    if (!/^\d+$/.test(pnumber)) {
        e.value = /^\d+/.exec(e.value);
    }
    return false;
}

