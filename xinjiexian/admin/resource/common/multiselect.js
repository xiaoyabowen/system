/**
 * Created by Administrator on 2018/1/17.
 */
function initSelectSubject(dom,url,multiple){
    var subject = $(dom);//元素
    var Select2 = subject.select2({
        ajax: {
            url:serverUrl +  url,
            type: "post",
            dataType: "json",
            data: function (params) {
                return {
                    name: params.term, // 搜索参数
                };
            },
            processResults: function (data, params) {
                for (var i = 0; i < data.length; i++) {
                    data[i].id = data[i].id || data[i].uid;
                    data[i].text = data[i].name || data[i].realName;
                }
                return {
                    results: data
                };
            },
            cache: true
        },
        placeholder: "请输入名称搜索",
        allowClear: true,    //选中之后，可手动点击删除
        escapeMarkup: function (markup) { return markup; }, // 让template的html显示效果，否则输出代码
        minimumInputLength: 1,    //搜索框至少要输入的长度，此处设置后需输入才显示结果
        language: "zh-CN",         //中文
        multiple:multiple, //是否多选
        width: 'resolve',
        closeOnSelect:false,
        templateResult: formatSubject, // 自定义下拉选项的样式模板
        templateSelection: formatSubjectSelection     // 自定义选中选项的样式模板
    });

    return Select2;
}

function formatSubject(item) {
    if (item.loading) return item;
    var markup = '<div> <p class="text-primary">学科名称：' + item.name|| item.text + '</p>';
    //markup += '这里可以添加其他选项...';
    markup += ' </div>';
    return markup;
}

function formatSubjectSelection(item) {
    return item.name || item.text;
}
//回显数据
function echoSelect2(dom,value){
    $.each(value,function(index,value){
        $(dom).append(new Option(value.name, value.id, false, true));
    });
    $(dom).trigger("change");
}

function fromServer(dom,url,params) {
    this.dom = dom;
    this.params = params || {};
    this.url = serverUrl+ url;
    this.result = {};
}
fromServer.prototype = {
    init: function () {
        var  _this = this;
        var dom = _this.dom;
        var params = _this.params;
        var url = _this.url;
        var result = _this.result;
        $(dom).typeahead({
            source: function (query, process) {
                //query是输入的值
                var q = query.replace(/'/g,"");//去掉单引号
                params.name = $.trim(q);
                $.ajax({
                    url: url,
                    type: "post",
                    data: params,
                    dataType: "json"
                }).then(function(data){
                    var result = transResult(data);
                    if (isNotBlank(result)) {
                        process(result);
                    }else{
                        var t = [{name:"未查询到"+$.trim(q),id:0,realName:"未查询到"+$.trim(q)}];
                        process(t);
                    }

                }, function(){
                    layer.msg('请求出错');
                });
            },
            minLength : 2,
            items: 10,
            delay: 500,
            updater: function (obj) {
                if(obj.id == 0){
                    return "";
                }
                _this.emptyObject(result);
                result.id = obj.id;
                result.name= obj.realName;
                return obj.realName;
            }
        });
        $(dom).blur(function(){
            var value = $(this).val();
            if(isBlank(value)){
                _this.emptyObject(result)
            }
        });
    },
    emptyObject: function (obj) {
        for ( key in obj ) {
            delete obj[key];
        }
    },
    getResult:function () {
        var  _this = this;
        return _this.result;
    }
}
function transResult(eData){
    var data = {};
    if (eData && eData.length>0) {
        for (var i = 0; i < eData.length; i++) {
            var name = "姓名:"+eData[i].name+"&nbsp&nbsp&nbsp ";
            eData[i].realName = eData[i].name;

            if(eData[i].phone){
                name += "手机:"+eData[i].phone;
            }
            eData[i].name = name;
        }
    }
   return eData;
}
