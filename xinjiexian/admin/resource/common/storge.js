var fileName;
var videoUrl;
var playDom, valDom, viewDomPub, videoId, uploadAuth, uploadAddress,realPath,index;

function include_js(path) {
    var sobj = document.createElement('script');
    sobj.type = "text/javascript";
    sobj.src = path;
    var headobj = document.getElementsByTagName('head')[0];
    headobj.appendChild(sobj);
}

include_js('../resource/js/plugins/aliyun/es6-promise.min.js');
include_js('../resource/js/plugins/aliyun/aliyun-upload-sdk1.3.1.min.js');
include_js('../resource/js/plugins/aliyun/aliyun-oss-sdk4.13.2.min.js');

var videoHtml = '<div  class="wrapper wrapper-content animated fadeInRight showVideoView" style="display: none">\n' +
    '    <div class="ibox float-e-margins">\n' +
    '        <div class="ibox-content">\n' +
    '            <div class="row row-lg">\n' +
    '                <div class="col-sm-12">\n' +
    '                    <video id="video" controls src="" >\n' +
    '                    </video>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>';

var showProgress = '<div  class="wrapper wrapper-content animated fadeInRight showProgress" style="display: none">\n' +
    '    <div class="ibox float-e-margins">\n' +
    '        <div class="ibox-content" >\n' +
    '        <form method="get" class="form-horizontal" id="showProgress"></form>'+
    '        </div>\n' +
    '    </div>\n' +
    '</div>';


var formHtml = '  <form style="opacity: 0" action="" id="uploadAliyun" autocomplete="off" enctype="multipart/form-data">\n' +
    '        <input style="height: 0;width: 0;" type="file" name="file"    />\n' +
    '    </form>';
$("body").append(formHtml);

$("body").append(videoHtml);
$("body").append(showProgress);
var uploader;

setTimeout(function () {
    uploader = new AliyunUpload.Vod({
        // 文件上传失败
        'onUploadFailed': function (uploadInfo, code, message) {
            layer.close(index);
            layer.msg('上传失败！', {
                icon: 5
            });
//            console.log("onUploadFailed: file:" + uploadInfo.file.name + ",code:" + code + ", message:" + message);
        },

        // 文件上传完成
        'onUploadSucceed': function (uploadInfo) {
            layer.msg('上传成功！', {
                icon: 6
            });
            layer.close(index);
            var real = videoUrl + videoId + "." + fileName.split(".")[1];
            $(valDom).val(real);
            realPath = real;
            // setTimeout(function () {
            //     $(viewDomPub + " video").attr("src", real);
            //     $(viewDomPub + " video").attr("controls", "controls");
            //     $(viewDomPub + " video").removeAttr("poster");
            // },1000);

            $(viewDomPub).html("");
//            console.log("onUploadSucceed: " + uploadInfo.file.name + ", endpoint:" + uploadInfo.endpoint + ", bucket:" + uploadInfo.bucket + ", object:" + uploadInfo.object);
        },
        // 文件上传进度
        'onUploadProgress': function (uploadInfo, totalSize, loadedPercent) {
            var msg =  (loadedPercent * 100.00).toFixed(2) + '%';
            $("#showProgress #progressDiv").css("width",msg);
            $("#showProgress #progressSpan").html(msg+" 完成");
            console.log("onUploadProgress:file:" + uploadInfo.file.name + ", fileSize:" + totalSize + ", percent:" + (loadedPercent * 100.00).toFixed(2) + "%");
        },
        // STS临时账号会过期，过期时触发函数
        'onUploadTokenExpired': function (uploadInfo) {
//            console.log("onUploadTokenExpired");
            //刷新
        },
        onUploadCanceled: function (uploadInfo) {
//            console.log("onUploadCanceled:file:" + uploadInfo.file.name);
        },
        // 开始上传
        'onUploadstarted': function (uploadInfo) {
            if (!uploadInfo.videoId)//这个文件没有上传异常
            {

                uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress, videoId);
            }
            else
            //如果videoId有值，根据videoId刷新上传凭证
            {
                ajaxUpload(serverUrl + "/storage/refreshUploadVideo", {"videoId": videoId}, function (data) {
                    if (data && data.success && data.data) {
                        $("#uploadAuth").val(data.data.uploadAuth);

                        var uploadAuth = data.data.uploadAuth;

                        uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress);
                    }

                })

            }

        }
        ,
        'onUploadEnd': function (uploadInfo) {
            console.log("onUploadEnd: uploaded all the files");
        }
    });
}, 2000);


//上传文件的input 点击上传按钮
//viewDom 预览播放的地址
//
function initUploadForm(clickDom,progressDom,  viewDom,  showVal) {

    playDom = progressDom;
    valDom = showVal;
    viewDomPub = progressDom;
    var inputDom = $("#uploadAliyun input");
    $(clickDom).click(function () {
        $(inputDom).click();
    });

    $(viewDom).click(function () {
        showVideoView()
    });
    $(inputDom).change(function () {
        var filePath = $($(inputDom)[0]).val();

        var videoHtml = ' <div class="form-group">\n' +
            '                        <label class="col-sm-2 control-label">视频预览</label>' +
            '                        <div  class="col-sm-4">' +
            '                            <video id="video"  src="' + filePath + '"  poster="../resource/img/images.png">' +
            '                            </video>' +
            '                        </div>' +
            '                       <div class="col-sm-1 ">' +
            '                            <button class=" btn btn-default upload" type="button" onclick="starUploadFile()">开始上传</button>' +
            '                       </div>' +
            '                    </div>';


        // $(viewDom).html(videoHtml);
        _starUploadFile(inputDom)
    });

}


function starUploadFile() {
    _starUploadFile($("#uploadAliyun input"))
}

function _starUploadFile(inputDom) {

    var fp = $(inputDom);
    var lg = fp[0].files.length; // get length
    var items = fp[0].files;

    for (var i = 0; i < lg; i++) {
        fileName = items[i].name; // get file name
    }
    var userData = '{"Vod":{"UserData":{"IsShowWaterMark":"true","Priority":"7"}}}';
    uploader.addFile(items[0], null, null, null, userData);

    if (fileName) {
        ajaxUpload(serverUrl + "/storage/createUploadVideo", {
            "fileName": fileName,
            "name": name
        }, function (data) {
            if (data && data.success && data.data) {

                videoId = data.data.videoId;
                uploadAuth = data.data.uploadAuth;
                uploadAddress = data.data.uploadAddress;
                videoUrl = data.data.returnUrl;
                var showProgress =
                    '                   <div class="form-group">' +
                    '                        <div  class="col-sm-6 col-sm-offset-2">' +
                    '                            <div class="progress progress-striped active">' +
                    '                                <div class="progress-bar progress-bar-success" role="progressbar"' +
                    '                                     aria-valuenow="60" aria-valuemin="0" id="progressDiv" aria-valuemax="100"' +
                    '                                     style="width: 0%;">' +
                    '                                    <span class="sr-only" id="progressSpan">0% 完成</span>' +
                    '                                </div>' +
                    '                            </div>' +
                    '                        </div>' +
                    '                    </div>';
                // $(viewDomPub).append(showProgress);
                showUploadProgress();
                uploader.startUpload();

            }

        })
    }
}

//上传文件
function ajaxUpload(url, param, callback) {
    // var index = loading();
    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        data: param,
        success: function (data) {

            if (data && data.success) {
                // layer.close(index);
                if (typeof callback == 'function') {
                    callback(data, param);
                }
            } else {
                // layer.close(index);
                layer.msg("<em style='color:red'>" + data.msg + "</em>", {time: 1200, icon: 5});
            }

        },
        error: function () {
            // layer.close(index);
            layer.msg("请求出错", {
                icon: 2
            });
        }

    });

}

function showVideoView() {
    if(!realPath){
        layer.msg("你还没有上传视频", {
            icon: 2
        });
    }
    var index = layer.open({
        type: 1,shade: 0.01,
        skin: 'layui-layer-demo', //样式类名
        area: ['600px','600px'],
        anim: 2,
        shadeClose: true, //开启遮罩关闭
        content: $('.showVideoView'),
        zIndex:500,
        btn2: function(){},
        success: function(layero, index){

            $(".showVideoView video").attr("src",realPath);
        }
    });

}

function showUploadProgress() {

    index = layer.open({
        type: 1,shade: 0.01,
        skin: 'layui-layer-demo', //样式类名
        area: ['600px','200px'],
        anim: 2,
        shadeClose: true, //开启遮罩关闭
        content: $('.showProgress'),
        zIndex:500,
        btn2: function(){},
        success: function(layero, index){
            var showProgress =
                '                   <div class="form-group">' +
                '                        <div  class="col-sm-6 col-sm-offset-2">' +
                '                            <div class="progress progress-striped active">' +
                '                                <div class="progress-bar progress-bar-success" role="progressbar"' +
                '                                     aria-valuenow="60" aria-valuemin="0" id="progressDiv" aria-valuemax="100"' +
                '                                     style="width: 0%;">' +
                '                                    <span class="sr-only" id="progressSpan">0% 完成</span>' +
                '                                </div>' +
                '                            </div>' +
                '                        </div>' +
                '                    </div>';

            $("#showProgress").append(showProgress);

        }
    });

}




