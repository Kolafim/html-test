/**
 * Created by Liangy on 2016/9/20.
 */

if("undefined" == typeof version_static) var version_static = 10001;

var DOC = $(document);
var BODY = $(document.body);
var WINDOW = $(window);

Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

function set_cookie(name, value, expires, path, domain, secure)
{
    var today = new Date();
    today.setTime( today.getTime() );

    if ( expires )
    {
        expires = expires * 1000 * 60 * 60 * 24;
    }
    var expires_date = new Date( today.getTime() + (expires) );

    document.cookie = name + "=" +encodeURIComponent( value ) +
    ( ( expires ) ? ";expires=" + expires_date.toGMTString() : "" ) +
    ( ( path ) ? ";path=" + path : "" ) +
    ( ( domain ) ? ";domain=" + domain : "" ) +
    ( ( secure ) ? ";secure" : "" );
}

function get_cookie(name) {
    var start = document.cookie.indexOf(name + "=");
    var len = start + name.length + 1;
    if ((!start) && (name != document.cookie.substring(0, name.length )))
    {
        return null;
    }
    if (start == -1) return null;
    var end = document.cookie.indexOf(";", len);
    if (end == -1) end = document.cookie.length;
    return (decodeURIComponent(document.cookie.substring(len, end)));
}

/* loading & success 【待替换 删除】 */
var LoadingToast = $("#loadingToast");
var Toast = $("#toast");
var Toast_ico = $("#toast .weui-icon_toast");
var Toast_text = $("#toast .weui-toast__content");
var Toast_timeout = '';
var Toast_op = {
    ico:0,
    text:'已完成',
    ico_arr : ['weui-icon-success-no-circle weui-icon_toast','weui-icon-info-circle weui-icon_toast small']
};
var closeLoadingToast = function(){
    LoadingToast.fadeOut(100);
};
var showLoadingToast = function(){
    LoadingToast.fadeIn(100);
};
var showToast = function(op,callback){
    if(op){
        Toast_op.ico = op.ico?op.ico:0;
        Toast_op.text = op.text?op.text:'已完成';
    }
    if(Toast_timeout) clearTimeout(Toast_timeout);
    Toast_ico.attr("class",Toast_op.ico_arr[Toast_op.ico]);
    Toast_text.text(Toast_op.text);
    Toast.fadeIn(100,function(){
        Toast_timeout = setTimeout(function(){
            Toast.fadeOut(120);
            if('function' == typeof callback) callback();
        },850);
    });
};

/* 反馈UI */
var g_ui = {
    dom:{
        LoadingToast : $("#loadingToast"),
        Toast : $("#toast"),
        Toast_ico : $("#toast .weui-icon_toast"),
        Toast_text : $("#toast .weui-toast__content"),
        Dialog : $("#dialog"),
        Dialog_theme : $("#dialog .weui-dialog"),
        Dialog_title : $("#dialog .weui-dialog__title"),
        Dialog_text : $("#dialog .weui-dialog__bd"),
        Dialog_btn_n : $("#dialog .weui-dialog__btn_default"),
        Dialog_btn_y : $("#dialog .weui-dialog__btn_primary")
    },
    _var : {
        Toast_timeout:'',
        Toast_op : {
            ico:0,
            text:'已完成',
            time:1600,
            ico_arr : ['weui-icon-success-no-circle weui-icon_toast','weui-icon-info-circle weui-icon_toast small']
        },
        Dialog_op : {
            theme : 0,
            theme_arr : ['weui-dialog', 'weui-dialog weui-skin_android'],
            title : '提醒',
            text : '',
            btn : ['返回','确定'],
            yes : function(){},
            no : function(){}
        },
        panel:$("#fixed_panel"),
        panel_target:[],
        panel_btn_event:0,
        panel_container:[],
        panel_close_event:''
    },
    close : function(_name){
        if(_name == 'confirm') g_ui.dom.Dialog.fadeOut(100);

        g_ui.dom.Dialog_btn_n.off("click");
        g_ui.dom.Dialog_btn_y.off("click");
    },
    msg : function(_op,callback){
        var _t = this;

        var _ico = _op.ico?_op.ico:_t._var.Toast_op.ico;
        var _text = _op.text?_op.text:_t._var.Toast_op.text;
        var _time = _op.time?_op.time:_t._var.Toast_op.time;
        if(_t._var.Toast_timeout) clearTimeout(_t._var.Toast_timeout);
        _t.dom.Toast_ico.attr("class",_t._var.Toast_op.ico_arr[_ico]);
        _t.dom.Toast_text.text(_text);
        _t.dom.Toast.fadeIn(100,function(){
            _t._var.Toast_timeout = setTimeout(function(){
                _t.dom.Toast.fadeOut(120);
                if('function' == typeof callback) callback();
            },_time);
        });
    },
    confirm : function(_op,_yes,_no){
        var _t = this;
        if(_op){
            _t._var.Dialog_op.theme = _op.theme?_op.theme:0;
            _t._var.Dialog_op.title = _op.title?_op.title:'提醒';
            _t._var.Dialog_op.text = _op.text?_op.text:'';
            _t._var.Dialog_op.btn = _op.btn?_op.btn:['返回','确定'];

            _t.dom.Dialog_theme.attr('class',_t._var.Dialog_op.theme_arr[_t._var.Dialog_op.theme]);
            _t.dom.Dialog_title.text(_t._var.Dialog_op.title);
            _t.dom.Dialog_text.html(_t._var.Dialog_op.text);

            _t.dom.Dialog_btn_y.text(_t._var.Dialog_op.btn[1]).off("click").on("click",function(){
                _t.close('confirm');
                if('function' == typeof _yes) _yes();
            });
            _t.dom.Dialog_btn_n.text(_t._var.Dialog_op.btn[0]).off("click").on("click",function(){
                _t.close('confirm');
                if('function' == typeof _no) _no();
            }).show();
            _t.dom.Dialog.fadeIn(100);
        }else{
            console.log("g_ui.confirm内_op参数错误");
        }
    },
    alert : function(_op,_yes){
        var _t = this;
        if(_op){
            _t._var.Dialog_op.theme = _op.theme?_op.theme:0;
            _t._var.Dialog_op.title = _op.title?_op.title:'提醒';
            _t._var.Dialog_op.text = _op.text?_op.text:'';
            _t._var.Dialog_op.btn = _op.btn?_op.btn:['确定'];

            _t.dom.Dialog_theme.attr('class',_t._var.Dialog_op.theme_arr[_t._var.Dialog_op.theme]);
            _t.dom.Dialog_title.text(_t._var.Dialog_op.title);
            _t.dom.Dialog_text.html(_t._var.Dialog_op.text);

            _t.dom.Dialog_btn_y.text(_t._var.Dialog_op.btn[0]).off("click").on("click",function(){
                _t.close('confirm');
                if('function' == typeof _yes) _yes();
            });
            _t.dom.Dialog_btn_n.hide();
            _t.dom.Dialog.fadeIn(100);
        }else{
            console.log("g_ui.alert内_op参数错误");
        }
    },
    loading : function(){
        this.dom.LoadingToast.fadeIn(100);
    },
    closeLoading : function(){
        this.dom.LoadingToast.fadeOut(100);
    },
    panel:function(jq,callback){
        if(jq && jq.length == 1){
            if($("#g_ui_trans_pointer").length > 0){
                g_ui.closePanel(1);
            }
            if(!g_ui._var.panel_btn_event){
                g_ui._var.panel_btn_event = 1;
                g_ui._var.panel_container = $("#fixed_panel .fp-container");
                $("#fixed_panel").on("click",".fp-close",function(){
                    g_ui.closePanel();
                });
            }

            g_ui._var.panel_target = jq;
            jq.wrap('<div id="g_ui_trans_pointer" style="display: none;"></div>');
            g_ui._var.panel_container.append(g_ui._var.panel_target);
            g_ui._var.panel.removeClass("off");

            if('function' == typeof callback) callback();
        }
    },
    closeEvent:function(func){
        g_ui._var.panel_close_event = func;
    },
    closePanel:function(mod){
        mod = mod || 0;
        var _bool = true;
        if(!mod && g_ui._var.panel_close_event && 'function' == typeof g_ui._var.panel_close_event){
            _bool = g_ui._var.panel_close_event();
            g_ui._var.panel_close_event = '';
            if('undefined' == typeof _bool) _bool = true;
        }
        if(_bool){
            var _t_p = $("#g_ui_trans_pointer");
            if(_t_p.length>0 && g_ui._var.panel_target){
                _t_p.before(g_ui._var.panel_target).remove();
            }
            g_ui._var.panel.addClass("off");
        }
    }

};


/**
 *  Scroll & Resize   事件管理
 *
 *      SRCtr.ScrollT       滚动条位置
 *      SRCtr.WWStatus      页面宽度 <= 800 = 1
 *      (array) SRCtr.SFunc  滚动事件数组
 *      (array) SRCtr.RFunc  视窗大小变化事件数组
 *
 **/
var SRCtr = {
    WWStatus : 0, /* 页面宽度 <= 800 = 1 */
    ScrollT:0, /* 滚动条位置 */
    SFunc : [],
    RFunc : [],
    SInterval:[30,50], /* scroll 触发间隔时间 */
    Sisrun: 0,
    STimer : null,
    RTimer : null,
    init:function(){
        var _t = this;

        _t.WWStatus = ($(document.body).width() > 800)?0:1;
        _t.ScrollT = $(document).scrollTop();

        DOC.on("scroll", function () {
            if(_t.SFunc.length > 0){
                if(!_t.Sisrun){
                    _t.Sisrun = 1;
                    setTimeout(function(){
                        _t.Sisrun = 0;
                    },_t.SInterval[_t.WWStatus]);
                    _t.ScrollT = $(document).scrollTop();
                    for(var _i=0;_i < _t.SFunc.length;_i++) {
                        if ('function' == typeof _t.SFunc[_i]) _t.SFunc[_i]();
                    }
                }
                if (_t.STimer)  {
                    clearTimeout(_t.STimer);
                    _t.STimer = '';
                }
                _t.STimer = setTimeout(function(){
                    _t.ScrollT = $(document).scrollTop();
                    for(var _i=0;_i < _t.SFunc.length;_i++) {
                        if ('function' == typeof _t.SFunc[_i]) _t.SFunc[_i]();
                    }
                }, _t.SInterval[_t.WWStatus]*0.8);
            }
        });
        WINDOW.on('resize', function () {
            if(_t.RFunc.length > 0){
                if (_t.RTimer)  {
                    clearTimeout(_t.RTimer);
                    _t.RTimer = '';
                }
                _t.RTimer = setTimeout(function(){
                    _t.WWStatus = ($(document.body).width() > 800)?0:1;
                    for(var _i=0;_i < _t.RFunc.length;_i++) {
                        if ('function' == typeof _t.RFunc[_i]) _t.RFunc[_i]();
                    }
                }, 200);
            }
        });
    }
};


/**
 *
 * mod = 'loadimg'
 *      图片加载完成事件 load(event) [not-med] 含此属性时不添加 [data-med]、[data-size] 参数 （配合 PhotoSwipe）
 */

var global_js = {
    _var : {
        route : {
            touchSlide : '/static/js/TouchSlide.1.1.js?v='+version_static,
            lazyload : '/static/js/jquery.lazyload.min.js?v='+version_static,
            validform : '/static/js/Validform.min.js?v='+version_static,
            upload : '/static/js/upload_form_data.js?v='+version_static,
            region : '/static/js/region.js?v='+version_static,
            uedit : ['/static/uedit/ueditor.config.js?v=2','/static/uedit/ueditor.all.js?v=4'],
            photoSwipe_css : ['/static/photoSwipe/photoswipe.min.css','/static/photoSwipe/default-skin.min.css'],
            photoSwipe_js : ['/static/photoSwipe/photoswipe.min.js','/static/photoSwipe/photoswipe-ui-default.min.js'],
            //photoClip : '/static/js/jquery.photoClip.min.js',
            photoClip : ['/static/js/iscroll-zoom.js','/static/js/hammer.min.js','/static/js/jquery.photoClip.min.js'],
            hammer : '/static/js/hammer.min.js',
            iscroll_zoom : '/static/js/iscroll-zoom.js',
            emojify : '/static/js/emojify_new.js',
            swiper:'/static/swiper/swiper.new.min.js',
            map:(location.protocol=='https:'?'https:':'http:')+'//map.qq.com/api/js?v=2.exp&libraries=convertor&callback=map_init',
            wxsdk:'http://res.wx.qq.com/open/js/jweixin-1.2.0.js'
        },
        isload : {},
        loadFail : {},
        geo_options:{
            enableHighAccuracy:true,
            maximumAge:1000
        },
        photoSwipe_doms:'',
        gallerySelector:[],
        photoSwipe_init:{},
        slideLoad_main:{},
        fixedEvent_var:[],
        wx_qr_hash_init:0,
        wx_qr_interval:'',
        _AAS : {
            event_list : [],
            main:'',
            list:''
        }
    },
    _func : {
        none:function(){},
        setImgNaturalDimensions: function(t, callback) {
            var nWidth, nHeight;
            if (t.naturalWidth) { // 现代浏览器
                nWidth = t.naturalWidth;
                nHeight = t.naturalHeight;
                $(t).attr({"data-size":nWidth+"x"+nHeight,"data-med": t.src});
                if('function' == typeof callback) callback(nWidth, nHeight);
            } else { // IE6/7/8
                var _image = new Image();
                _image.src = t.src;
                _image.onload = function() {
                    $(t).attr({"data-size":_image.width+"x"+_image.height,"data-med": _image.src});
                    if('function' == typeof callback) callback(_image.width, _image.height)
                }
            }

        },
        getImgNaturalDimensions: function(_url, callback) {
            var _image = new Image();
            _image.src = _url;
            var nWidth, nHeight;
            if (_image.naturalWidth) { // 现代浏览器
                nWidth = _image.naturalWidth;
                nHeight = _image.naturalHeight;
                callback(_image.width, _image.height);
            } else { // IE6/7/8
                _image.onload = function() {
                    callback(_image.width, _image.height)
                }
            }
        },
        getLocation : function(){
            if(navigator.geolocation){
                //浏览器支持geolocation


            }else{
                //浏览器不支持geolocation
            }
        },
        loadimg_run : function(_jq){
            try{
                var arc_content_1 = _jq || $("[mod='loadimg'] [data-original][data-original!=''][data-original!=undefined]:not([end-init])");
                //arc_content_1.attr("end-init","1");
                arc_content_1.lazyload({
                    //effect : "fadeIn",
                    failure_limit : 10,
                    //skip_invisible : false,
                    threshold : 200,
                    load: function(){
                        var _t = $(this);
                        if(!_t.attr("not-med")){
                            var _p_url = _t.attr("data-original");
                            global_js._func.getImgNaturalDimensions(_p_url,function(w,h){
                                _t.attr("data-size",w+"x"+h).attr("data-med",_p_url);
                            });
                        }
                        _t.removeAttr("data-original");
                    }
                });
                /* 安卓APP页面初始化时应触发滚动事件 */
                //DOC.trigger("scroll");
            }catch(e){}
        },
        parseThumbnailElements : function(s) {
            // parse slide data (url, title, size ...) from DOM elements
            // (children of gallerySelector)

            var items = [],
                size,
                item;
            if(!global_js._var.photoSwipe_doms) global_js._var.photoSwipe_doms = $(global_js._var.gallerySelector[0]);
            global_js._var.photoSwipe_doms.each(function(){
                var _t_d = $(this);
                var _t_pic = _t_d.attr("data-med");
                if(!_t_pic) return true;

                size = _t_d.attr("data-size").split('x');

                item = {
                    src: _t_pic,
                    msrc:_t_pic,
                    w: parseInt(size[0], 10),
                    h: parseInt(size[1], 10),
                    el:_t_d
                };
                items.push(item);
            });
            return items;
        },
        onThumbnailsClick : function(_this,_i_id) {
            //点击图片锚点
            var _e_t = _this;
            var _index = 0;
            var _i = -1;
            global_js._var.photoSwipe_doms = $(global_js._var.gallerySelector[_i_id-1]);
            global_js._var.photoSwipe_doms.each(function(){
                var __t = $(this);
                if(this == _e_t) {
                    _i = _index;
                    return false;
                }
                _index+=1;
            });
            if(_i >= 0) {
                // open PhotoSwipe if valid index found
                global_js._func.openPhotoSwipe(_i);
            }
            return false;
        },
        openPhotoSwipe : function(index, galleryElement, disableAnimation, fromURL) {
            var pswpElement = document.querySelectorAll('.pswp')[0],
                options,
                items;

            items = global_js._func.parseThumbnailElements();

            if(!items[index]) return false;

            // define options (if needed)
            options = {
                // define gallery index (for URL)
                galleryUID: items[index].el.attr('data-pswp-uid') || 1,

                getThumbBoundsFn: function(index) {
                    // See Options -> getThumbBoundsFn section of documentation for more info
                    /*var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                     pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                     rect = thumbnail.getBoundingClientRect();*/

                    //var _find_img = items[index].el.find("img");
                    var _find_img = items[index].el;
                    var thumbnail = _find_img.length>0?_find_img[0]:items[index].el[0];
                    var pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
                    var rect = thumbnail.getBoundingClientRect();
                    return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
                },
                shareEl : false,
                fullscreenEl : false,
                isClickableElement: function(el) {
                    return el.tagName === 'IMG' || el.tagName === 'DIV' || el.tagName === 'P';
                },
                bgOpacity : 0.85,
                tapToClose : true,
                tapToToggleControls : false,
                //clickToCloseNonZoomable: false,
                //closeOnVerticalDrag:false,
                //closeOnScroll:false,
                //pinchToClose:false,
                showAnimationDuration:200,
                hideAnimationDuration:200,
                loop:false //是否允许滑动从头循环到尾
            };

            // PhotoSwipe opened from URL
            if(fromURL) {
                if(options.galleryPIDs) {
                    // parse real index when custom PIDs are used
                    // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                    for(var j = 0; j < items.length; j++) {
                        if(items[j].pid == index) {
                            options.index = j;
                            break;
                        }
                    }
                } else {
                    // in URL indexes start from 1
                    options.index = parseInt(index, 10) - 1;
                }
            } else {
                options.index = parseInt(index, 10);
            }

            // exit if index not found
            if( isNaN(options.index) ) {
                return;
            }

            if(disableAnimation) {
                options.showAnimationDuration = 0;
            }

            // Pass data to PhotoSwipe and initialize it
            var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
            gallery.init();
            //console.log(pswpElement.className);
        },
        photoswipeParseHash : function() {
            // parse picture index and gallery index from URL (#&pid=1&gid=2)
            var hash = window.location.hash.substring(1),
                params = {};

            if(hash.length < 5) {
                return params;
            }

            var vars = hash.split('&');
            for (var i = 0; i < vars.length; i++) {
                if(!vars[i]) {
                    continue;
                }
                var pair = vars[i].split('=');
                if(pair.length < 2) {
                    continue;
                }
                params[pair[0]] = pair[1];
            }

            if(params.gid) {
                params.gid = parseInt(params.gid, 10);
            }

            return params;
        },
        fixedEvent_run : function(_index,_bool,_mod){
            _bool = _bool || 0;
            _mod = _mod || 0;

            if('undefined' != typeof _index){
                var _t = global_js._var.fixedEvent_var[_index];
                if(_t){
                    if(_mod == 1) {
                        if (SRCtr.ScrollT >= _t.targetPositionY - _t.headerHeight) {
                            _t.footerPosition   = _t.main.offset().top + _t.main.outerHeight(true);
                            if(_t.footerPosition < _t.targetHeight + _t.targetPositionY + 20) return false;
                            var targetBottomNewPosition = SRCtr.ScrollT + _t.targetHeight + _t.headerHeight;
                            if (_t.footerPosition < targetBottomNewPosition) {
                                if (_t.status != 1) {
                                    _t.status = 1;
                                    _t.target.css({
                                        "position": "absolute",
                                        "top"     : "auto",
                                        "left"    : "auto",
                                        "bottom"  : "0",
                                        "right"   : "0"
                                    });
                                }
                            } else {
                                if (_t.status != 2 || _bool) {
                                    _t.status = 2;
                                    _t.target.css({
                                        "position": "fixed",
                                        "top"     : _t.headerHeight + "px",
                                        "left"    : _t.targetPositionX + "px",
                                        "right"   : "auto",
                                        "height"  : _t.targetHeight + "px"
                                    });
                                    _t.targetPXTemp = _t.targetPositionX;
                                }
                            }
                        } else {
                            if (_t.status != 0) {
                                _t.status = 0;
                                if(_nostatic) _t.target.css({"position": "absolute","left": "0","top": "0"});
                                else _t.target.css({"position": "static"});
                            }
                        }
                    }else if(_mod == 2){
                        if (SRCtr.ScrollT >= _t.targetPositionY - _t.headerHeight) {
                            if (_t.status != 2 || _bool) {
                                _t.status = 2;
                                _t.target.css({
                                    "position": "fixed",
                                    "top"     : _t.headerHeight + "px",
                                    "left"    : _t.targetPositionX + "px",
                                    "right"   : "auto",
                                    "height"  : _t.targetHeight + "px"
                                });
                                _t.targetPXTemp = _t.targetPositionX;
                            }
                        }else{
                            if (_t.status != 0) {
                                _t.status = 0;
                                if(_nostatic) _t.target.css({"position": "absolute","left": "0","top": "0"});
                                else _t.target.css({"position": "static"});
                            }
                        }
                    }else{
                        if(_t.width_s && _t.width > 0) _t.target.css({"width":_t.width+'px'});
                        if (SRCtr.ScrollT >= _t.targetPositionY) {
                            if (_t.status != 1) {
                                _t.status = 1;
                                _t.target.css({
                                    "position": "fixed",
                                    "top": "0",
                                    "left": _t.targetPositionX + "px",
                                    "right": "auto"
                                });
                            }
                        } else {
                            if (_t.status != 0) {
                                _t.status = 0;
                                _t.target.css({"position": (_t.position_temp?_t.position_temp:"static"),"left":'0'});
                            }
                        }
                    }
                }
            }
        },
        wx_qr_checkpath:function(){
            var path_arr = location.href.split("#");
            var _path = 0;
            if(path_arr.length > 1){
                var path = path_arr[path_arr.length-1];
                if(path) {
                    _path = path.match(/wxqr=1/g);
                }
            }
            return _path;
        },
        wx_view_image:function(current,arr){
            //console.log(current);
            //console.log(arr);
            try{
                wx.previewImage({
                    current: current, // 当前显示图片的http链接
                    urls: arr // 需要预览的图片http链接列表
                });
            }catch(e){
                g_ui.msg({text:'调用微信SDK出错',ico:1});
            }
        }
    },

    /* 依赖加载 */
    loadRoute : function(name,callback,_fail,arr_rest) {
        var _t = this;
        if (_t._var.isload[name]) {
            try{
                if('function' == typeof callback) callback();
            }catch(e){
                console.log("callback Error:"+ e.message);
            }
            return false;
        }else{
            if(_t._var.route[name]){
                var _op = {cache: true};
                if($.type(_t._var.route[name]) == 'array'){
                    _op.url = _t._var.route[name][arr_rest?(_t._var.route[name].length-arr_rest):0];
                    if(_op.url.match(/.+\.js$|.+\.js\?[0-9v=]+/)) _op.dataType = 'script';
                    jQuery.ajax(_op).done(function (resp) {
                        if(name.match(/^.+_css$/)){
                            //var __doms = $.parseHTML("<style class='xhr_style'>"+resp+"</style>");
                            $("head").append("<style class='xhr_style'>"+resp+"</style>");
                        }
                        _t._var.loadFail[name] = 0;

                        arr_rest = arr_rest?(arr_rest-1):(_t._var.route[name].length-1);
                        if(arr_rest<1){
                            _t._var.isload[name] = 1;
                        }
                        _t.loadRoute(name,callback,_fail,arr_rest);
                    }).fail(function () {
                        console.log("fail");
                        if (_t._var.loadFail[name]) {
                            if(_t._var.loadFail[name] < 3){
                                _t._var.loadFail[name] += 1;
                                _t.loadRoute(name,callback,_fail,arr_rest);
                            }else{
                                if('function' == typeof _fail) _fail();
                            }
                        }else {
                            _t._var.loadFail[name] = 1;
                            _t.loadRoute(name,callback,_fail,arr_rest);
                        }
                    });
                }else{
                    _op.url = _t._var.route[name];
                    if(_op.url.match(/.+\.js$|.+\.js\?[0-9v=]+/)) _op.dataType = 'script';
                    jQuery.ajax(_op).done(function () {
                        _t._var.isload[name] = 1;
                        _t._var.loadFail[name] = 0;
                        try {
                            if('function' == typeof callback) callback();
                        } catch (e) {
                            console.log("callback Error:"+ e.message);
                        }
                    }).fail(function () {
                        if (_t._var.loadFail[name]) {
                            if(_t._var.loadFail[name] < 3){
                                _t._var.loadFail[name] += 1;
                                _t.loadRoute(name,callback,_fail);
                            }else{
                                if('function' == typeof _fail) _fail();
                            }
                        }else {
                            _t._var.loadFail[name] = 1;
                            _t.loadRoute(name,callback,_fail);
                        }
                    });
                }
            }

        }
    },

    /* 鼠标点击 - 替身用 */
    ac_dom : function(_jq,_attr){
        _attr = _attr || 'ac';
        if(_jq.length > 0)
            _jq.on("click",function(){
                var _t_ac = $(this).attr(_attr);
                if(_t_ac) {
                    // IE
                    if(document.all) {
                        $(_t_ac)[0].click();
                    }
                    // 其它浏览器
                    else {
                        var _e = document.createEvent("MouseEvents");
                        _e.initEvent("click", true, true);
                        $(_t_ac)[0].dispatchEvent(_e);
                    }
                }
            });
    },
    ac_click:function(_jq){
        if(document.all) {
            _jq[0].click();
        }
        // 其它浏览器
        else {
            var _e = document.createEvent("MouseEvents");
            _e.initEvent("click", true, true);
            _jq[0].dispatchEvent(_e);
        }
    },

    /* 获取地理位置 */
    geolocation : function(callback){
        if (navigator.geolocation) {
            //console.log("浏览器支持!");

            navigator.geolocation.getCurrentPosition(function(position){
                /* 成功 */
                //返回用户位置
                //经度
                var longitude =position.coords.longitude;
                //纬度
                var latitude = position.coords.latitude;

                if('function' == typeof callback)
                callback([longitude,latitude]);

                /*//使用百度地图API
                //创建地图实例
                var map =new BMap.Map("container");

                //创建一个坐标
                var point =new BMap.Point(longitude,latitude);
                //地图初始化，设置中心点坐标和地图级别
                map.centerAndZoom(point,15);*/
            },function(error){
                /* 失败 */
                var _em = [];
                switch(error.code){
                    case 1:
                        _em = ["位置服务被拒绝"];
                        break;

                    case 2:
                        _em = ["暂获取不到地理位置信息"];
                        break;

                    case 3:
                        _em = ["获取地理位置超时"];
                        break;

                    case 4:
                        _em = ["未知错误"];
                        break;
                }
                if('function' == typeof callback)
                    callback(_em);

            },global_js._var.geo_options);

        } else {
            //console.log("浏览器不支持地理位置信息!");
            if('function' == typeof callback)
                callback(["环境不支持获取地理位置"]);
        }
    },
    setGeoCookie : function(){
        if(!get_cookie("geo_position")) {
            global_js.geolocation(function(arr){
                if(arr.length == 2){
                    set_cookie("geo_position",arr.join(","),"1","/");
                }else{
                    console.log(arr[0]);
                }
            });

        }
    },

    /* 图片懒加载 */
    loadimg : function(_jq){
        _jq = _jq || $("[mod='loadimg'] [data-original][data-original!=''][data-original!=undefined]:not([end-init])");
        if(_jq.length <= 0) return false;
        _jq.attr("end-init","1");
        global_js.loadRoute('lazyload',function(){
            if(global_js._var.isload['lazyload']){
                global_js._func.loadimg_run(_jq);
            }
        },function(){
            _jq.each(function(){
                var _t = $(this);
                if(_t[0].nodeName == 'IMG'){
                    _t.attr("src",$(this).attr("data-original"));
                }else{
                    /* 待完善 */

                }
            });
        });

    },

    /* 图片墙 & 图片查看 */
    initPhotoSwipe : function(gallerySelector,parents,haswx) {
        var _ob = this;
        parents = parents || '';
        if(_ob._var.photoSwipe_init[gallerySelector+parents]) return false;
        _ob._var.photoSwipe_init[gallerySelector+parents] = 1;
        if('undefined' == typeof _ob._var.photoSwipe_wx_timer) _ob._var.photoSwipe_wx_timer = '';
        if(parents && haswx && 'number' == typeof ISWX && ISWX && 'number' == typeof ISPC && !ISPC){
            $("body > div "+parents).each(function(){
                var _p_t = $(this);
                var _img_arr = [];
                _p_t.find(gallerySelector).each(function(){
                    var _g_t = $(this);
                    var _img_src = _g_t.attr("data-med") || _g_t.attr("data-original");
                    if(_img_src) {
                        _img_arr.push(_img_src.match(/^\//)?(location.origin+_img_src):_img_src);
                    }
                });
                _p_t.on("click",gallerySelector,function(){
                    var __i_t = $(this);
                    var _current_src = __i_t.attr("data-med") || __i_t.attr("data-original") || __i_t.attr("src");
                    if(_current_src.match(/^\//)) _current_src = location.origin+_current_src;
                    if(_ob._var.photoSwipe_wx_timer) clearInterval(_ob._var.photoSwipe_wx_timer);
                    if('object' == typeof wx && 'number' == typeof wxsdk && wxsdk){
                        _ob._func.wx_view_image(_current_src,_img_arr);
                    }else{
                        var _timer_count = 0;
                        _ob._var.photoSwipe_wx_timer = setInterval(function(){
                            if('object' == typeof wx && 'number' == typeof wxsdk && wxsdk){
                                if(_ob._var.photoSwipe_wx_timer) clearInterval(_ob._var.photoSwipe_wx_timer);
                                _ob._func.wx_view_image(_current_src,_img_arr);
                            }else{
                                if(_timer_count >= 150){
                                    if(_ob._var.photoSwipe_wx_timer) clearInterval(_ob._var.photoSwipe_wx_timer);
                                    if(g_ui) g_ui.msg({text:'微信参数出错！',ico:1});
                                    else alert('微信参数出错！稍后再尝试');
                                }
                                _timer_count += 1;
                            }
                        },200);
                    }
                });
            });
        }else{
            _ob.loadRoute('photoSwipe_css',function(){
                _ob.loadRoute('photoSwipe_js',function(){
                    _ob._var.photoSwipe_doms = '';
                    var _index = _ob._var.gallerySelector.push(gallerySelector);

                    $("body > div").on("click",gallerySelector,function(){_ob._func.onThumbnailsClick(this,_index)});

                    // Parse URL and open gallery if it contains #&pid=3&gid=1
                    var hashData = _ob._func.photoswipeParseHash();
                    if(hashData.pid && hashData.gid) {
                        _ob._func.openPhotoSwipe( hashData.pid , '', true, true );
                    }
                });
            });
        }
    },


    /* 随机数(最小为1) */
    random : (function(){
        var today = new Date();
        var seed = today.getTime();
        function rnd(){
            seed = ( seed * 9301 + 49297 ) % 233280;
            return seed / ( 233280.0 );
        }
        return function rand(number){
            // return Math.ceil(rnd(seed) * number);
            return Math.ceil(rnd() * number);
        };
    })(),


    /**
     *  滑动异步加载
     *      var obj = global_js.slideLoad({main:''});
     *      (func) obj.done(resp) 请求成功后执行,重写用
     *      (func) obj.fail(resp) 请求3次失败后执行,重写用
     *      (bool) obj.is_on      事件中是否执行下去，默认false
     *  [以下为非必须]
     *      (func) obj.load(url,data,type) type默认get
     *      (obj) obj.ssn_arr      数据ID数组，用于排除重复
     */
    slideLoad : function(op){
        var _ob = this;
        if('object' != typeof op) return false;
        if(_ob._var.slideLoad_main[op.main]) return false;
        _ob._var.slideLoad_main[op.main] = {};

        _ob._var.slideLoad_main[op.main].main_jq = $(op.main);
        _ob._var.slideLoad_main[op.main].loading_jq = _ob._var.slideLoad_main[op.main].main_jq.find(".loading");
        _ob._var.slideLoad_main[op.main].more_loading_jq = _ob._var.slideLoad_main[op.main].main_jq.find(".more-loading");
        _ob._var.slideLoad_main[op.main].nodata_jq = _ob._var.slideLoad_main[op.main].main_jq.find(".no-data");
        _ob._var.slideLoad_main[op.main].nodata_text_jq = _ob._var.slideLoad_main[op.main].nodata_jq.find(".no-data-text");

        _ob._var.slideLoad_main[op.main].get_page_isrun = 0;/* 是否正在请求 */
        _ob._var.slideLoad_main[op.main].failCount = 0;/* 请求失败次数 */
        _ob._var.slideLoad_main[op.main].is_on = op.is_on || 0;/* 是否允许事件执行下去 */
        _ob._var.slideLoad_main[op.main].isend = 0;/* 是否已加载到尾页 */
        _ob._var.slideLoad_main[op.main].ssn_arr = {}; /* 数据ID数组，用于排除重复 */
        _ob._var.slideLoad_main[op.main].page_index = op.page || 2;
        _ob._var.slideLoad_main[op.main].page_total = op.total || 2;
        _ob._var.slideLoad_main[op.main].total = 1;/* 请求得出的数据数量 */
        _ob._var.slideLoad_main[op.main].url = op.url || '';


        _ob._var.slideLoad_main[op.main].done = function(resp){};   /* 用于重写 */
        _ob._var.slideLoad_main[op.main].fail = function(){};       /* 用于重写 */

        _ob._var.slideLoad_main[op.main].load = function(_url,_data,_type){
            _url = _url || _ob._var.slideLoad_main[op.main].url;
            if('object' == typeof op.data) op.data.page = _ob._var.slideLoad_main[op.main].page_index;
            else op.data = {page:_ob._var.slideLoad_main[op.main].page_index};
            _data = _data || op.data;
            _type = _type || op.type;
            var load_obj = _ob._var.slideLoad_main[op.main];
            if(!load_obj.get_page_isrun){
                //console.log(load_obj.page_index+"|"+load_obj.page_total);
                if(load_obj.page_index <= load_obj.page_total){
                    load_obj.get_page_isrun = 1;
                    //load_obj.is_on = 0;
                    load_obj.more_loading_jq.hide();
                    load_obj.nodata_jq.hide();
                    load_obj.loading_jq.show();
                    $.ajax({
                        url : _url,
                        type: _type || 'get',
                        data: _data,
                        dataType:"json"
                    }).done(function (resp) {
                        load_obj.loading_jq.hide();
                        load_obj.done(resp);
                        load_obj.get_page_isrun = 0;
                        if(load_obj.isend) load_obj.is_on = 0;
                        /*
                        if(load_obj.more_loading_jq.length > 0 && load_obj.page_index < load_obj.page_total) {
                            load_obj.more_loading_jq.show();
                            //console.log("没有加载项了");
                            load_obj.is_on = 0;
                        }
                        */
                        //console.log(load_obj.page_index+"|"+load_obj.page_total);
                        if(load_obj.page_index <= load_obj.page_total){
                            if(load_obj.page_index > 3 && load_obj.more_loading_jq.length > 0) {
                                load_obj.more_loading_jq.show();
                                /* 此时有按钮不再滚动请求 */
                                load_obj.is_on = 0;
                            }
                        }else if(load_obj.total > 0) {
                            if(load_obj.nodata_jq.length > 0) {
                                if(load_obj.page_total > 0) load_obj.nodata_text_jq.text('已经是页尾了');
                                load_obj.nodata_jq.show();
                            }
                            load_obj.is_on = 0;
                        }else {
                            load_obj.is_on = 0;
                        }
                    }).fail(function () {
                        //load_obj.is_on = 1;
                        /* layer.msg("访问服务器超时",{icon:2}); */
                        if(load_obj.failCount<3){
                            load_obj.failCount+=1;
                            load_obj.load(_url,_data,_type);
                        }else{
                            load_obj.loading_jq.hide();
                            load_obj.more_loading_jq.show();
                            load_obj.fail();
                            load_obj.get_page_isrun = 0;
                        }
                    });
                }else{
                    load_obj.more_loading_jq.hide();
                    console.log("没有加载项了");
                    /* 不再请求 */
                    load_obj.is_on = 0;
                }
            }
        };
        if(_ob._var.slideLoad_main[op.main].more_loading_jq.length > 0){
            _ob._var.slideLoad_main[op.main].more_loading_jq.on("click",function(){
                _ob._var.slideLoad_main[op.main].load();
            });
        }

        _ob._var.slideLoad_main[op.main].window_height = WINDOW.height();
        _ob._var.slideLoad_main[op.main].body_height = DOC.height();
        _ob._var.slideLoad_main[op.main].scroll_temp = 0;
        _ob._var.slideLoad_main[op.main].scrollrun = function(){
            var scrollT = SRCtr.ScrollT;
            if (_ob._var.slideLoad_main[op.main].window_height + scrollT - _ob._var.slideLoad_main[op.main].body_height > -80) {
                _ob._var.slideLoad_main[op.main].load();
            }
            _ob._var.slideLoad_main[op.main].scroll_temp = scrollT;
        };

        _ob._var.slideLoad_main[op.main].sf_index = SRCtr.SFunc.push(function(){
            if(_ob._var.slideLoad_main[op.main].is_on){
                if(_ob._var.slideLoad_main[op.main].more_loading_jq.length > 0){
                    if(_ob._var.slideLoad_main[op.main].page_index <= 3){
                        _ob._var.slideLoad_main[op.main].scrollrun();
                    }else{
                        _ob._var.slideLoad_main[op.main].more_loading_jq.show();
                        _ob._var.slideLoad_main[op.main].is_on = 0;
                    }
                }else{
                    _ob._var.slideLoad_main[op.main].scrollrun();
                }
            }

        });
        _ob._var.slideLoad_main[op.main].rf_index = SRCtr.RFunc.push(function(){
            _ob._var.slideLoad_main[op.main].window_height = WINDOW.height();
            _ob._var.slideLoad_main[op.main].body_height = DOC.height();
        });
        if(_ob._var.slideLoad_main[op.main].is_on) _ob._var.slideLoad_main[op.main].scrollrun();

        return _ob._var.slideLoad_main[op.main];
    },
    btnLoad : function(op){
        var _ob = this;
        if('object' != typeof op) return false;
        if(_ob._var.slideLoad_main[op.main]) return false;
        _ob._var.slideLoad_main[op.main] = {};

        _ob._var.slideLoad_main[op.main].main_jq = $(op.main);
        _ob._var.slideLoad_main[op.main].loading_jq = _ob._var.slideLoad_main[op.main].main_jq.find(".loading");
        _ob._var.slideLoad_main[op.main].more_loading_jq = _ob._var.slideLoad_main[op.main].main_jq.find(".more-loading");
        _ob._var.slideLoad_main[op.main].nodata_jq = _ob._var.slideLoad_main[op.main].main_jq.find(".no-data");
        _ob._var.slideLoad_main[op.main].nodata_text_jq = _ob._var.slideLoad_main[op.main].nodata_jq.find(".no-data-text");

        _ob._var.slideLoad_main[op.main].get_page_isrun = 0;/* 是否正在请求 */
        _ob._var.slideLoad_main[op.main].failCount = 0;/* 请求失败次数 */
        _ob._var.slideLoad_main[op.main].is_on = op.is_on || 0;/* 初始化时是否执行一次 */
        _ob._var.slideLoad_main[op.main].ssn_arr = {}; /* 数据ID数组，用于排除重复 */
        _ob._var.slideLoad_main[op.main].page_index = op.page || 1;
        _ob._var.slideLoad_main[op.main].page_total = op.total || 2;

        _ob._var.slideLoad_main[op.main].done = function(resp){};   /* 用于重写 */
        _ob._var.slideLoad_main[op.main].fail = function(){};       /* 用于重写 */

        _ob._var.slideLoad_main[op.main].load = function(_url,_data,_type){
            _url = _url || op.url;
            if('object' == typeof op.data) op.data.page = _ob._var.slideLoad_main[op.main].page_index;
            else op.data = {page:_ob._var.slideLoad_main[op.main].page_index};
            _data = _data || op.data;
            _type = _type || op.type;
            var load_obj = _ob._var.slideLoad_main[op.main];
            if(!load_obj.get_page_isrun){
                //console.log(load_obj.page_index+"|"+load_obj.page_total);
                if(load_obj.page_index <= load_obj.page_total){
                    load_obj.get_page_isrun = 1;
                    load_obj.more_loading_jq.hide();
                    load_obj.nodata_jq.hide();
                    load_obj.loading_jq.show();
                    $.ajax({
                        url : _url,
                        type: _type || 'get',
                        data: _data,
                        dataType:"json"
                    }).done(function (resp) {
                        load_obj.loading_jq.hide();
                        load_obj.done(resp);
                        load_obj.get_page_isrun = 0;
                        if(load_obj.page_index < load_obj.page_total){
                            if(load_obj.more_loading_jq.length > 0) {
                                load_obj.more_loading_jq.show();
                            }
                        }else{
                            if(load_obj.nodata_jq.length > 0) {
                                load_obj.nodata_text_jq.text('已经是页尾了');
                                load_obj.nodata_jq.show();
                            }
                        }

                    }).fail(function () {
                        if(load_obj.failCount<3){
                            load_obj.failCount+=1;
                            load_obj.load(_url,_data,_type);
                        }else{
                            load_obj.loading_jq.hide();
                            load_obj.more_loading_jq.show();
                            load_obj.fail();
                            load_obj.get_page_isrun = 0;
                        }
                    });
                }else{
                    load_obj.more_loading_jq.hide();
                    console.log("没有加载项了");
                }
            }
        };
        if(_ob._var.slideLoad_main[op.main].more_loading_jq.length > 0){
            _ob._var.slideLoad_main[op.main].more_loading_jq.on("click",function(){
                _ob._var.slideLoad_main[op.main].load();
            });
            if(_ob._var.slideLoad_main[op.main].is_on) _ob._var.slideLoad_main[op.main].more_loading_jq.trigger('click');
        }

        return _ob._var.slideLoad_main[op.main];
    },

    /**
     * go top
     *    class: gotop-btn
     */
    go_top:{
        dom:[],
        run:function(){
            BODY.animate({scrollTop:0},180);
        },
        init:function(){
            var _t = this;
            _t.dom = $(".gotop-btn");
            if(_t.dom.length > 0){
                _t.dom.on("click",_t.run);
                SRCtr.SFunc.push(function(){
                    if(SRCtr.ScrollT>100) _t.dom.removeClass("off");
                    else _t.dom.addClass("off");
                });
            }
        }
    },

    /* 浮动块 */
    fixedEvent : function(op,_mod){
        _mod = _mod || 0;
        if(op && op.target){
            var _index = global_js._var.fixedEvent_var.push({})-1;
            var _t = global_js._var.fixedEvent_var[_index];
            if(_mod == 1){
                /*try{
                    _t.target          = $(".fixedEvent-target");
                    _t.main            = $(".fixedEvent-main");
                    _t.head            = $(".fixedEvent-head");

                    if(_targetstr) _t.target = $(_targetstr);

                    if(_t.target.length<=0 || _t.main.length <= 0) return;
                    _t.targetHeight    = _t.target.outerHeight(true);
                    _t.targetPositionX = 0;
                    _t.targetPositionY = _t.target.offset().top;
                    _t.footerPosition  = 0;
                    _t.headerHeight    = _t.head.length<1?0:_t.head.outerHeight(true);
                    _t.status = 0;
                    _t.targetPXTemp    = _t.targetPositionX;
                    if (!SRCtr.WWStatus && _t.targetHeight > 0) _t.updateTargetPX();

                    _t.SFIndex_1 = SRCtr.SFunc.push(function(){
                        if(_t.target.length<1 || !_t.target.is(":visible")) return;
                        if (_t.targetHeight > 0) _t.run();
                    });
                    _t.RFIndex_1 = SRCtr.RFunc.push(function(){
                        if(_t.target.length<1 || !_t.target.is(":visible")) return;
                        if (_t.targetHeight > 0) _t.updateTargetPX(1);
                    });
                }catch(e){
                    console.log("Error:" + e.message);
                }*/
            }else{
                _t.target = op.target;
                _t.target_bg = _t.target.parent();
                _t.width_s = op.width || true;
                if(_t.width_s) {
                    _t.width = _t.target_bg.outerWidth();
                    if(_t.width > 0) _t.target.css({"width":_t.width+'px'});
                    if(_t.target.hasClass("hide")) _t.target.removeClass('hide');
                }
                //_t.head = op.head;
                _t.targetHeight = 0;
                _t.targetPositionX = _t.target_bg.offset().left;
                _t.targetPXTemp    = _t.targetPositionX;
                _t.targetPositionY = -1;
                _t.status = 0;
                _t.th_temp = 0;
                _t.position_temp = _t.target.css("position");

                _t.SFIndex = SRCtr.SFunc.push(function(){

                    if(_t.target.length <= 0) {
                        //SRCtr.SFunc.splice(_t.SFIndex,1);
                        return false;
                    }
                    if(_t.targetPositionY < 0) _t.targetPositionY = _t.target.offset().top;
                    if (_t.targetHeight <= 0) _t.targetHeight = _t.target.outerHeight(true);
                    if (_t.targetHeight > 0) {
                        if(_t.targetHeight != _t.th_temp){
                            _t.th_temp = _t.targetHeight;
                            if(_t.target_bg.length >= 1) _t.target_bg.css("height",_t.targetHeight+"px");
                        }
                        global_js._func.fixedEvent_run(_index);
                    }
                });
                _t.RFIndex = SRCtr.RFunc.push(function(){
                    if(_t.target.length<=0) return;
                    _t.targetPositionX = _t.target_bg.offset().left;
                    if(_t.width_s) _t.width = _t.target_bg.outerWidth();
                    _t.status = 3;
                    global_js._func.fixedEvent_run(_index);
                });
            }
            return _index;
        }
        return false;
    },

    /* 弹出 wx qr */
    open_wx_qr : function(op){
        var _t = this;
        try{
            op = op || {};
            var _url = op.url || '/server/pay/weChatNativePay';
            var _url2 = op.url2 || '/server/pay/checkNativePayStatus';
            var _type = op.type || 'service';
            var _s_url = op.s_url || '';
            if(!op.id) {
                console.log("没有找到对应的ID");
                return false;
            }
            g_ui.loading();
            $.ajax({
                url:_url,type:'post',data:{order_type:_type,order_id:op.id,amount:op.amount},dataType:'json'
            }).done(function(resp){
                g_ui.closeLoading();
                //console.log(resp);
                if(resp.err_code == 0) {
                    var _src = resp.data;
                    var qr_main = $("#wx_qr_main");
                    if(qr_main.length < 1){
                        $(".weui-footer").before('<div id="wx_qr_main" style="display: none"><p><img id="wx_qr_img"/></p><p>扫描上面的二维码</p><p>即可完成支付</p></div>');
                        qr_main = $("#wx_qr_main");
                    }
                    $("#wx_qr_img").attr("src",_src);
                    if(!_t._var.wx_qr_hash_init) {
                        _t._var.wx_qr_hash_init = 1;
                        WINDOW.on("hashchange",function(){
                            if(qr_main.length > 0){
                                var _path = _t._func.wx_qr_checkpath();
                                if(_path){
                                    g_ui.panel(qr_main,function(){
                                        qr_main.show();
                                    });
                                    g_ui.closeEvent(function(){
                                        history.go(-1);
                                        return false;
                                    });
                                }else{
                                    g_ui.closeEvent('');
                                    qr_main.hide();
                                    g_ui.closePanel();
                                }
                            }else{
                                console.log("无效打开方式");
                            }
                        });
                        _t._var.wx_qr_interval = setInterval(function(){

                            $.ajax({
                                url:_url2,type:'post',data:{order_type:_type,order_id:op.id},dataType:'json'
                            }).done(function(resp2){
                                //console.log(resp2);
                                if(resp2.err_code == 0) {
                                    if(_t._var.wx_qr_interval) clearInterval(_t._var.wx_qr_interval);
                                    _t._var.wx_qr_interval = '';
                                    var _path = _t._func.wx_qr_checkpath();
                                    if(_path){
                                        history.go(-1);
                                    }
                                    g_ui.msg({text:'支付成功'},function(){
                                        if(_s_url) location.href=_s_url;
                                        else location.reload();
                                    });
                                }
                            }).fail(function(){
                                console.log("检查支付时网络出错");
                            });
                        },3000);
                    }
                    var _path = _t._func.wx_qr_checkpath();
                    if(_path){
                        WINDOW.trigger('hashchange');
                    }else{
                        location.href = location.pathname+'#wxqr=1';
                    }

                }else{
                    g_ui.msg({ico:1,text:resp.msg});
                }
            }).fail(function(){
                g_ui.closeLoading();
                g_ui.msg({ico:1,text:'网络错误'});
            });
        }catch(e){
            console.log(e.message);
        }

    },

    /* 局部滚动 */
    enAbleScroll : function(e) {
        var obj = $(e.currentTarget);
        e = e.originalEvent;
        e.stopPropagation();

        if(e.type == "touchstart") {
            global_js._var.cell_scroll_start = e.changedTouches[0].pageY;
        }else{
            //e.stopImmediatePropagation();
            //console.log(obj.innerHeight() + "+" + obj[0].scrollTop +">=" + obj[0].scrollHeight);

            //e.cancelBubble = false;

            var delta = 0;
            if(e.type == "touchmove"){
                if(global_js._var.cell_scroll_start != undefined){
                    delta = e.changedTouches[0].pageY - global_js._var.cell_scroll_start;
                }
            }else{
                if (e.wheelDelta) { /* IE/Opera. */
                    delta = e.wheelDelta/120;
                } else if (e.detail) { /** Mozilla case. */
                delta = -e.detail/3;
                }
            }

            if(obj.innerHeight() + obj[0].scrollTop >= obj[0].scrollHeight) {
                //console.log('bottom');
                if(delta < 0 ) {
                    console.log('to bottom!!');
                    e.preventDefault();
                    return false;
                }
            }
            if(obj.scrollTop() === 0) {
                //console.log('top');
                if(delta > 0) {
                    console.log('to top!!');
                    e.preventDefault();
                    return false;
                }
            }
        }
        //return false;
    },
    /*
     * mod: 0 - 4 对应 按照 分钟 - 月 为最大单位语意
     */
    getDateDiff : function (dateTimeStamp,mod){
        mod = mod || 4;
        var minute = 1000 * 60;
        var hour = minute * 60;
        var day = hour * 24;
        var halfamonth = day * 15;
        var month = day * 30;
        var year = month * 12;
        var now = new Date().getTime();
        if(!(dateTimeStamp-0)) return false;
        var diffValue = now - dateTimeStamp;
        if(diffValue < 0){return false;}

        var default_format = 'M月d日';
        if(diffValue/year >= 1) default_format = 'yyyy年M月d日';

        if(mod >= 4){
            var monthC = diffValue/month;
            if(monthC >= 2){
                return new Date(dateTimeStamp).Format('M月d日');
            }else if(month > 1){
                return parseInt(monthC) + "个月前";
            }
        }
        if(mod >= 3){
            var weekC =diffValue/(7*day);
            if(mod == 3 && weekC >= 2) return new Date(dateTimeStamp).Format(default_format);
            if(weekC>=1) return parseInt(weekC) + "周前";
        }
        if(mod >= 2){
            var dayC =diffValue/day;
            if(mod == 2 && dayC >= 2) return new Date(dateTimeStamp).Format(default_format);
            if(dayC>=1) return parseInt(dayC) +"天前";
        }
        if(mod >= 1){
            var hourC =diffValue/hour;
            if(mod == 2 && hourC >= 2) return new Date(dateTimeStamp).Format(default_format);
            if(hourC>=1) return parseInt(hourC) +"小时前";
        }
        if(mod >= 0){
            var minC =diffValue/minute;
            if(mod == 2 && minC >= 2) return new Date(dateTimeStamp).Format(default_format);
            if(minC>=1){
                return parseInt(minC) +"分钟前";
            }else
                return "刚刚";
        }
        return false;
    },
    AAS : {
        upload : function(mod){
            mod = mod || 0;
            var _str = '';
            if(global_js._var._AAS.event_list.length > 0){
                for(var _ii=0;_ii<global_js._var._AAS.event_list.length;_ii++){
                    _str += '<div class="weui-actionsheet__cell" data-id="'+(_ii+1)+'">'+global_js._var._AAS.event_list[_ii].name+'</div>'
                }
                global_js._var._AAS.list.html('').append(_str);
            }
        },
        clear : function(){
            global_js._var._AAS.event_list = [];
            if(global_js._var._AAS.list) global_js._var._AAS.list.html('');
        },
        add : function(name,func){
            if(name && 'function' == typeof func){
                var __index = global_js._var._AAS.event_list.push({
                    name:name,
                    func:func
                });
                if(!global_js._var._AAS.main) global_js.AAS.init();
                global_js._var._AAS.list.append('<div class="weui-actionsheet__cell" data-id="'+__index+'">'+name+'</div>');
                return __index;
            }
        },
        show : function(){
            global_js._var._AAS.main.show();
            setTimeout(function(){
                global_js._var._AAS.main.removeClass("off");
            },10);
        },
        init : function(){
            $("#fixed_panel").after('<div class="weui-skin_android trans-opacity off" id="androidActionsheet" style="display: none">'+
            '<div class="weui-mask"></div>'+
            '<div class="weui-actionsheet">'+
            '<div class="weui-actionsheet__menu"></div>'+
            '</div>'+
            '</div>');
            global_js._var._AAS.main = $("#androidActionsheet");
            global_js._var._AAS.list = global_js._var._AAS.main.find(".weui-actionsheet__menu");
            global_js._var._AAS.main.on('webkitTransitionEnd transitionend',function(){
                if(global_js._var._AAS.main.hasClass("off"))global_js._var._AAS.main.hide();
            }).on("click",".weui-mask",function(){
                global_js._var._AAS.main.addClass("off");
            }).on("click",".weui-actionsheet__cell",function(){
                var __t = $(this);
                var __id = __t.attr("data-id");
                if(global_js._var._AAS.event_list[__id-1] && 'function' == typeof global_js._var._AAS.event_list[__id-1].func){
                    global_js._var._AAS.event_list[__id-1].func(__t);
                }
                global_js._var._AAS.main.addClass("off");
            })
        }
    }
};


/*
 * [contenteditable=true] 富文本编辑
 *
 */
global_js.inputor_obj = {

    check:function(__st){
        if(__st.length > 0){
            var _ct = __st.clone();
            _ct.find(".placeholder").remove();
            _ct.find("img[data-text]").each(function(){
                var _img_t = $(this);
                _img_t.before(_img_t.attr("data-text")).remove();
            });
            _ct.find("img[data-img]").each(function(){
                var _img_p = $(this);
                _img_p.before('[:img='+_img_p.attr("src")+':]').remove();
            });

            var _first = _ct.contents().filter(function() {
                return this.nodeType === 3;
            });


            var _first_text = _first.text();
            if(_first_text) {
                /* 除去首位无容器文本 */
                _first.remove();
                _ct.prepend("<p>"+_first_text+"</p>");
            }

            _ct.children("div, p").each(function(){
                var _p = $(this);
                _p.before("<p>"+_p.text()+"</p>").remove();
            });
            /*_ct.find("style, a, script, input, button, .placeholder").remove();
             _ct.find("*").removeAttr("id").removeAttr("onclick").removeAttr("class");
             var _imgs = _ct.find("img");
             _imgs.each(function(){
             var _img_t = $(this);
             _img_t.attr("data-original",_img_t.attr("src"));
             }).removeAttr("src");

             if(_ct.text().replace(/^\\s+|\\s+$/g,"") || _ct.find("img").length > 0) return _ct.html();
             */

            if(_ct.text().replace(/^\\s+|\\s+$/g,"")) {
                return _ct.html().replace(/\[:img=([-_:\.\/a-zA-Z0-9]+):\]/gi,'<img class="data-img" _src="$1" data-original="$1" />');
            } else return false;
        }
    },
    init:function(){
        var _t = this;
        _t._jq = $(".inputor[contenteditable=true]");
        if(_t._jq.length > 0){
            _t._jq.each(function(){
                var __t = $(this);
                if(__t.attr("placeholder")){
                    __t.prepend("<small class='placeholder'>"+__t.attr("placeholder")+"</small>");
                    __t.on("focus",function(){
                        __t.find(".placeholder").remove();
                    });
                }
                __t.append("<div><br></div>");
            });

            /* 缓存用？ */
            /*document.onselectionchange = function () {
             var __st = 0;
             if (window.getSelection && window.getSelection().getRangeAt) {
             __st = $(window.getSelection().getRangeAt(0).endContainer.parentNode).parents(".inputor") || $(window.getSelection().getRangeAt(0).endContainer.parentNode);
             if(__st.length > 0){
             if(__st.find(":visible:not(.placeholder)").text() || __st.find("img").length > 0) _t.setPlaceholder(_t,__st,1);
             else _t.setPlaceholder(_t,__st,0);
             }
             }
             };*/
        }
    }
};

/* emojis */
global_js.emojify_config = {
    emojify_tag_type : 'div',           // Only run emojify.js on this element
    only_crawl_id    : null,            // Use to restrict where emojify.js applies
    img_dir          : '/static/image/emoji/',  // Directory for emoji images
    ignored_tags     : {                // Ignore the following tags
        'SCRIPT'  : 1,
        'TEXTAREA': 1,
        'A'       : 1,
        'PRE'     : 1,
        'CODE'    : 1
    },
    url_attr        : ''   //loadimg用'data-original'
};
global_js.emojis = {
    dom:{
        inputor:[],
        inputor_now:[],
        open_btn:[],
        container:[],
        ac:[]
    },
    timer:0,
    is_init:0,
    default_src:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXY3j37t1/AAliA8r60tGjAAAAAElFTkSuQmCC',
    img_url:'/static/image/emoji/',
    item:[
        "smile", "smiley", "sweat_smile","angry", "astonished", "blush","wink","anguished","cold_sweat","confounded","confused","cry","disappointed","disappointed_relieved","dizzy_face",
        "expressionless","fearful","flushed","frowning","grimacing","grin","grinning","heart_eyes","hushed","innocent","joy","kissing","kissing_heart","laughing","mask","neutral_face",
        "open_mouth","pensive","persevere","rage","relaxed","relieved","scream","sleeping","sleepy","smirk","sob","stuck_out_tongue_closed_eyes","sweat","tired_face","yum",
        "no_good","ok_woman","ghost","trollface",

        "grey_question","gift","bird", "heart", "kiss", "coffee", "anger", "alien","birthday", "pig", "pill","zzz", "+1",

    ],
    range:{
        lastEditRange:''/* 最后光标对象 */
    },
    range_homing : function(_t){
        if(_t.dom.inputor_now.length <= 0) return false;
        // 编辑框设置焦点
        _t.dom.inputor_now.focus();
        // 获取选定对象
        var selection = getSelection();
        // 判断是否有最后光标对象存在

        if (_t.range.lastEditRange) {
            // 存在最后光标对象，选定对象清除所有光标并添加最后光标还原之前的状态
            try{
                selection.removeAllRanges();
                selection.addRange(_t.range.lastEditRange)
            }catch(e){
                console.log("global_js.emojis.range_homing() 内发生错误");
            }

        }
        return selection;
    },
    po_last : function(obj) {
        var _t = global_js.emojis;
        if("undefined" == typeof obj.length) obj=$(obj);
        if(obj.length > 0) {
            _t.dom.inputor_now = obj;
            var selection = _t.range_homing(_t);
            var _inputor = $(selection.anchorNode).parents("[contenteditable]");
            if(_inputor.length > 0) {
                _t.dom.inputor_now = _inputor;
            }

            // 设置最后光标对象
            _t.range.lastEditRange = selection.getRangeAt(0);
            return selection;
        }else{
            return false;
        }
    },
    inputor_event:function(){
        if(global_js.emojis.dom.inputor.length <= 0) global_js.emojis.dom.inputor = $("[contenteditable]");
        /* 记录最后光标对象 */
        global_js.emojis.dom.inputor.on('keyup click',function() {
            var selection = getSelection();
            var _inputor = $(selection.anchorNode).parents("[contenteditable]");
            if(_inputor.length > 0) {
                global_js.emojis.dom.inputor_now = _inputor;
            }

            // 设置最后光标对象
            global_js.emojis.range.lastEditRange = selection.getRangeAt(0)
        });
    },
    addimg:function(_src){
        if(!_src) return false;
        var _t = global_js.emojis;
        var selection = _t.range_homing(_t);
        if(!selection){
            if(_t.dom.inputor.length > 0){
                selection = _t.po_last(_t.dom.inputor[0]);
            }else{
                return false;
            }
        }

        // 如果是文本节点则先获取光标对象
        var range = selection.getRangeAt(0);

        /* 插入节点 */
        var emojiElement = document.createElement('img');
        emojiElement.setAttribute('src', _src);
        emojiElement.setAttribute('class', 'data-img');
        emojiElement.setAttribute('data-img', '1');
        range.insertNode(emojiElement);
        //console.log(range);

        var _range2 = _t.range.lastEditRange;
        // 光标移动到到原来的位置加上新内容的长度
        if(_range2.endContainer){
            if(_range2.endContainer.nodeName == 'DIV' || _range2.endContainer.nodeName == 'P'){
                range.setStart(_range2.endContainer, _range2.endOffset+1);
            }else{
                //如果是在文本节点
                range.setStart(_range2.endContainer.nextElementSibling.nextSibling, 0);
            }
        }else{
            console.log(_range2);
        }

        // 光标开始和光标结束重叠
        range.collapse(true);
        // 清除选定对象的所有光标对象
        selection.removeAllRanges();
        // 插入新的光标对象
        selection.addRange(range);

        // 无论如何都要记录最后光标对象
        _t.range.lastEditRange = selection.getRangeAt(0);
    },
    range_init:function(_t){
        _t.inputor_event();

        /* 表情点击事件 */
        _t.dom.ac.on("click",function() {
            var selection = _t.range_homing(_t);
            if(!selection){
                if(_t.dom.inputor.length > 0){
                    selection = _t.po_last(_t.dom.inputor[0]);
                }else{
                    return false;
                }
            }

            var _img_name = $(this).children("img").attr("data-text");

            // 如果是文本节点则先获取光标对象
            var range = selection.getRangeAt(0);

            /*
             //插入文本
             // 获取光标对象的范围界定对象，一般就是textNode对象
             var textNode = range.startContainer;
             // 获取光标位置
             var rangeStartOffset = range.startOffset;
             // 文本节点在光标位置处插入新的表情内容
             textNode.insertData(rangeStartOffset, emojiInput.value);
             // 光标移动到到原来的位置加上新内容的长度
             range.setStart(textNode, rangeStartOffset + emojiInput.value.length);
             */


            /* 插入节点 */
            var emojiElement = document.createElement('img');
            emojiElement.setAttribute('src', _t.img_url+_img_name+'.png');
            emojiElement.setAttribute('class', 'emoji');
            emojiElement.setAttribute('data-text', ':'+_img_name+':');
            range.insertNode(emojiElement);

            var _range2 = _t.range.lastEditRange;
            // 光标移动到到原来的位置加上新内容的长度
            if(_range2.endContainer){
                if(_range2.endContainer.nodeName == 'DIV' || _range2.endContainer.nodeName == 'P'){
                    range.setStart(_range2.endContainer, _range2.endOffset+1);
                }else{
                    //如果是在文本节点
                    range.setStart(_range2.endContainer.nextElementSibling.nextSibling, 0);
                }
            }else{
                console.log(_range2);
            }

            // 光标开始和光标结束重叠
            range.collapse(true);
            // 清除选定对象的所有光标对象
            selection.removeAllRanges();
            // 插入新的光标对象
            selection.addRange(range);

            // 无论如何都要记录最后光标对象
            _t.range.lastEditRange = selection.getRangeAt(0);
        });
    },
    close_event_on : 0,
    close_event : function(e){
        if(global_js.emojis.close_event_on != 1) return false;
        var _click_t = $(e.target);
        if(_click_t.length > 0 && !_click_t.is("#emoji-main") && !_click_t.is("[open-emoji]")){
            global_js.emojis.dom.container.hide();
        }
        return false;
    },
    init:function(){
        var _t = this;
        _t.dom.open_btn = $("[open-emoji]");
        _t.dom.container = $("#emoji-main");
        _t.dom.inputor = $("[contenteditable]");

        if(_t.dom.open_btn.length <= 0 || _t.is_init) return false;

        _t.is_init = 1;

        /* 导入emoji列表 */
        for(var _i=0;_i<_t.item.length;_i++){
            _t.dom.container.append('<div class="emoji-item"><img _src="'+_t.default_src+'" src="'+_t.img_url+_t.item[_i]+'.png" data-text="'+_t.item[_i]+'"/></div>');
        }

        _t.dom.ac = _t.dom.container.find(".emoji-item");

        _t.range_init(_t);

        $(document).on("click","div:not(a div)",function(e){
            //console.log($(this));
            if(!_t.timer) {
                _t.timer = setTimeout(function(){
                    clearTimeout(_t.timer);
                    _t.timer = 0;
                },100);
                if($(this).parents("[open-emoji]").length <= 0) {
                    _t.close_event(e);
                }
            }
        });

        _t.dom.open_btn.on("click",function(){
            var _btn_t = $(this);

            //var _point = _btn_t.offset();
            /*_t.main_ui=layer.open({
             type: 1,
             title: false,
             closeBtn: false, //不显示关闭按钮
             shift: 2,
             //scrollbar:false,
             shadeClose: true, //开启遮罩关闭
             content:_t.dom.container,
             success:function(){
             global_js.toggleimg(_t.dom.container.find("[data-original]"));
             },
             end:function(){ }
             });*/
            if(_t.dom.container.is(":visible")) {
                _t.dom.container.hide();
                _t.close_event_on = 0;
            }else {
                //_t.dom.container.css({'top':_point.top+'px','left':_point.left+'px'}).show();
                _t.dom.container.show();
                _t.close_event_on = 1;
                //_t.range_homing(_t);
                //global_js.loadimg(_t.dom.container.find("[data-original]"));
            }
            return false;
        });

    }
};

/**
 * 微信环境使用微信JSSDK 图片选择上传
 * 异步条件：window.wxsdk = 1  && ISWX = 1
 * event click -> global_js.wx_upload.choose($(this), select funtion, complete function, select MAX count);
 * return:
 *      - select function : ($(this), index)
 *      - complete function : ({code:(1:成功 || 0:失败)，msg}, index)
 */
global_js.wx_upload = {
    _choose_timer : '',
    _img_arr : [],
    _img_index:0,
    _is_run:0,
    _wx_upload_fail:0,
    _wx_get_img_fail:0,
    _get_img:function(pid,sid,_complete){
        $.ajax({
            url:'/api/common/getWcMedia',type:'post',data:{media_id:sid},dataType:'json'
        }).done(function(resp){
            global_js.wx_upload._is_run = 0;
            global_js.wx_upload._wx_upload_run();
            if('function' == typeof _complete) _complete(resp,pid);
        }).fail(function(){
            if(global_js.wx_upload._wx_get_img_fail < 3){
                global_js.wx_upload._wx_get_img_fail += 1;
                global_js.wx_upload._get_img(pid,sid,_complete);
            }else{
                console.log('serverid获取微信图片出错');
                if('function' == typeof _complete) _complete({code:0,msg:'ajax: serverid获取微信图片出错'},pid);
                global_js.wx_upload._is_run = 0;
                global_js.wx_upload._wx_upload_run();
            }
        });
    },
    _wx_upload : function (pid,img_id,_complete) {
        wx.uploadImage({
            localId: img_id,
            isShowProgressTips: 0, //默认为1，显示进度提示
            success: function(res) {
                //images.serverId.push(res.serverId);
                global_js.wx_upload._get_img(pid,res.serverId,_complete);
            },fail: function(res) {
                if(_wx_upload_fail < 3){
                    _wx_upload_fail += 1;
                    global_js.wx_upload._wx_upload(pid,img_id);
                }else{
                    console.log('微信SDK上传失败');
                    if('function' == typeof _complete) _complete({code:0,msg:'wxsdk: 微信SDK上传失败'},pid);
                    global_js.wx_upload._is_run = 0;
                    global_js.wx_upload._wx_upload_run();
                }
            }
        });
    },
    _wx_upload_run : function(){
        var _img_id = '';
        var _pid = 0;
        var _complete = function(){};
        if(global_js.wx_upload._is_run) return false;
        for(var __ri=0;__ri<global_js.wx_upload._img_arr.length;__ri++){
            if(global_js.wx_upload._img_arr[__ri]) {
                _pid = global_js.wx_upload._img_arr[__ri].id;
                _img_id = global_js.wx_upload._img_arr[__ri].data;
                _complete = global_js.wx_upload._img_arr[__ri].complete;
                global_js.wx_upload._img_arr[__ri] = 0;
                break;
            }
        }
        if(_img_id){
            global_js.wx_upload._is_run = 1;
            global_js.wx_upload._wx_upload(_pid,_img_id,_complete);
        }
    },
    _wx_choose : function(si,select,complete,count){
        wx.chooseImage({
            count: (count-0)>0?(count-0):9, // 数量，默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            success: function (res) {
                for(var __ri=0;__ri<res.localIds.length;__ri++){
                    if(res.localIds[__ri]){
                        if('function' == typeof select) select(si,global_js.wx_upload._img_index);
                        global_js.wx_upload._img_arr.push({
                            id:global_js.wx_upload._img_index,
                            data:res.localIds[__ri],
                            complete:complete
                        });
                        global_js.wx_upload._img_index += 1;
                    }
                }
                global_js.wx_upload._wx_upload_run();
            }
        });
    },
    choose:function(si,select,complete,count){
        if(global_js.wx_upload._choose_timer) clearInterval(global_js.wx_upload._choose_timer);
        if('object' == typeof wx && wxsdk){
            global_js.wx_upload._wx_choose(si,select,complete,count);
        }else{
            var _timer_count = 0;
            global_js.wx_upload._choose_timer = setInterval(function(){
                if('object' == typeof wx && wxsdk){
                    if(global_js.wx_upload._choose_timer) clearInterval(global_js.wx_upload._choose_timer);
                    global_js.wx_upload._wx_choose(si,select,complete,count);
                }else{
                    if(_timer_count >= 150){
                        if(global_js.wx_upload._choose_timer) clearInterval(global_js.wx_upload._choose_timer);
                        if(g_ui) g_ui.msg({text:'微信参数出错！',ico:1});
                        else alert('微信参数出错！稍后再尝试');
                    }
                    _timer_count += 1;
                }
            },200);
        }
    }

};

(function(){

    /*
     *  文本框内容缓存
     * attr: g-catch (input,textarea)
     */
    var g_catch = new Object();
    g_catch.jq = [];
    g_catch.jq_1 = [];
    g_catch.temp_val = '';
    g_catch.temp_name = '';
    g_catch.get = function(mod){
        mod = mod || 0;
        var _jq = g_catch.jq;
        if(mod==1) _jq = g_catch.jq_1;
        _jq.each(function(){
            var _t = $(this);
            var _t_name = _t.attr('name');
            if(_t.val() == '' || _t.is("[type=radio], [type=checkbox], select")){
                var _get_cookie = get_cookie('info_text_'+_t.attr("[g-catch]")+'_'+_t_name);
                if(_get_cookie != '' && _get_cookie != null && _get_cookie != 'null'){
                    if(_t[0].tagName == "TEXTAREA") {
                        setTimeout(function(){
                            _t.text(_get_cookie);
                        },1);
                    }else if(_t.is("[type=radio], [type=checkbox]")){
                        setTimeout(function() {
                            _t.filter("[value=" + _get_cookie + "]").prop("checked", true);
                        },1);
                    }else{
                        setTimeout(function(){
                            _t.val(_get_cookie);
                        },1);
                    }
                }
            }
            if(mod == 0) g_catch.save(_t);
        });
    };
    g_catch.save = function(_t){
        _t.on("blur change",function(e){
            var _t = $(this);
            if(e.type == "blur" && _t.is("[type=radio], [type=checkbox], select")) return false;
            var __val = _t.val();
            var __name = _t.attr("name");
            if(__val!='') {
                if(g_catch.temp_name != __name || g_catch.temp_val != __val){
                    g_catch.temp_val = __val;
                    g_catch.temp_name = __name;
                    set_cookie('info_text_'+_t.attr("[g-catch]")+'_'+__name, __val, 30,'/');
                }
            } else set_cookie('info_text_'+_t.attr("[g-catch]")+'_'+__name,'',0,'/');

            //console.log(get_cookie('info_text_'+_t.attr("[g-catch]")+'_'+__name)+"|"+__val);
        });
    };
    g_catch.init = function(){
        g_catch.jq = $("input[g-catch], textarea[g-catch], select[g-catch]");
        g_catch.jq_1 = $("input[g-catch-1], textarea[g-catch-1], select[g-catch-1]");
        if(g_catch.jq.length > 0){
            g_catch.get();
        }else{
            /*console.log("没有[g-catch]项");*/
        }
        if(g_catch.jq_1.length > 0){
            g_catch.jq_1.each(function() {
                g_catch.save($(this));
            });
        }

    };
    g_catch.init();
    global_js.g_catch_get = g_catch.get;

    /* 鼠标点击 - 替身用 */
    global_js.ac_dom($("[data-click]"),"data-click");

    /* 获取坐标 */
    //global_js.setGeoCookie();


    /* loadimg init */
    if('function'==typeof loadimgstart) loadimgstart();
    global_js.loadimg();
    global_js.loadimg($("[mod='loadimg2'] [data-original][data-original!=''][data-original!=undefined]:not([end-init])"));


    /* inputor 初始化 */
    global_js.inputor_obj.init();

    /* scroll & resize 初始化 */
    SRCtr.init();

    /* banner 初始化用 */
    if(jQuery("#focusBox img").length > 1) {
        global_js.loadRoute('touchSlide', function () {
            if('function'==typeof touchstart) touchstart();
            TouchSlide({
                slideCell:"#focusBox",
                titCell:".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
                mainCell:".bd ul",
                effect:"leftLoop",
                switchLoad:'_src',
                autoPage:true,//自动分页
                autoPlay:true,//自动播放
                delayTime:200,//切换效果时间
                interTime:6500//切换间隔
            });
        });
    }else{
        if('function'==typeof touchstart) touchstart();
        jQuery("#focusBox img").each(function(){
            var _img_t = $(this);
            var _src = _img_t.attr("_src");
            if(_src){
                _img_t.attr("src",_src).removeAttr("_src");
            }
        });
    }

    /* 输入框 不允许 emoji表情 */
    BODY.on("blur keyup input"," input[delemoji], textarea[delemoji]",function(){
        var patt=/([\ud800-\udbff][\udc00-\udfff]|[\u263a])/g; // 检测utf16字符正则
        $(this).val($(this).val().replace(patt,''));
    });

    /* go top */
    global_js.go_top.init();

    /* 局部滚动限制 .cell-scroll */
    if(SRCtr.WWStatus >= 0){
        DOC.on('mousewheel touchmove touchstart','.cell-scroll',global_js.enAbleScroll);
    }


}());
