/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var createNewItem = __webpack_require__(1);

	function PicEditor(conf) {
	    var _this = this;
	    var defaultConf = {
	        picConfList: [],
	        container: document.body
	    }
	    this._conf = {};
	    this.itemMap = {};
	    $.extend(this._conf, defaultConf, conf);
	    // 初始化控件css
	    this._appendStyle();
	    // 初始化每个涂层
	    this._addItem(this._conf.picConfList);
	}

	PicEditor.prototype._addItem = function(picConfList, index) {
	    var _this = this;
	    var index = index || 1;
	    $.map(picConfList, function(item) {
	        _this._renderLayer(item, index);
	        index++;
	    });
	}

	PicEditor.prototype._appendStyle = function() {
	    var html = '<style>' +
	        '    .editItem {' +
	        '        position: absolute;' +
	        '    }' +
	        '    .editItem-edit:after {' +
	        '        content: "";' +
	        '        position: absolute;' +
	        '        left: -2px;' +
	        '        top: -2px;' +
	        '        right: -2px;' +
	        '        bottom: -2px;' +
	        '        border: 1px #000 solid;' +
	        '        display: block;' +
	        '        overflow: hidden;' +
	        '        z-index: 1;' +
	        '    }' +
	        '    .editItem-edit div.act {' +
	        '        position: absolute;' +
	        '        width: 16px;' +
	        '        height: 16px;' +
	        '        border-radius: 8px;' +
	        '        overflow: hidden;' +
	        '        background: #333;' +
	        '        color: #FF0000;' +
	        '        z-index: 3;' +
	        '    }' +
	        '    .editItem-edit div.act.rotate {' +
	        '        bottom: -8px;' +
	        '        right: -8px;' +
	        '        background: #444;' +
	        '    }' +
	        '    .editItem-edit div.act.rotate:after {' +
	        '        content: "";' +
	        '        position: absolute;' +
	        '        display: inline-block;' +
	        '        height: 6px;' +
	        '        width: 6px;' +
	        '        top: 3px;' +
	        '        left: 3px;' +
	        '        border-top: 2px solid white;' +
	        '        border-right: 2px solid white;' +
	        '        border-bottom: 2px solid white;' +
	        '        border-left: 2px solid transparent;' +
	        '        border-radius: 30px;' +
	        '    }' +
	        '    .editItem-edit div.act.rotate:before {' +
	        '        content: "";' +
	        '        position: absolute;' +
	        '        display: inline-block;' +
	        '        width: 0;' +
	        '        height: 0;' +
	        '        border-top: 3px solid transparent;' +
	        '        border-right: 3px solid #fff;' +
	        '        border-bottom: 3px solid transparent;' +
	        '        top: 3px;' +
	        '        left: 3px;' +
	        '        transform: rotate(-45deg);' +
	        '    }' +
	        '    .editItem-edit div.act.delete {' +
	        '        top: -8px;' +
	        '        left: -8px;' +
	        '        background: #444;' +
	        '    }' +
	        '    .editItem-edit .resize-tl {' +
	        '        top: -8px;' +
	        '        left: -8px;' +
	        '    }' +
	        '    .editItem-edit .resize-tr {' +
	        '        top: -8px;' +
	        '        right: -8px;' +
	        '    }' +
	        '    .editItem-edit .resize-bl {' +
	        '        bottom: -8px;' +
	        '        left: -8px;' +
	        '    }' +
	        '    .editItem-edit .resize-br {' +
	        '        bottom: -8px;' +
	        '        right: -8px;' +
	        '    }' +
	        '</style>';
	    $(this._conf.container).append(html);
	}

	PicEditor.prototype._renderLayer = function(item, index) {
	    var conf = this._buildItemConf(item, index);
	    if (item.itemUrl) {
	        this._renderByUrl(item, index, conf);
	    } else if (item.itemFile) {
	        var fr = new FileReader();
	        var _this = this;
	        fr.onload = function() {
	            item.itemUrl = this.result;
	            _this._renderLayer(item, index);
	        };
	        fr.onerror = function(e) {
	            console.log(e);
	        }
	        fr.readAsDataURL(item.itemFile);
	    }
	}

	PicEditor.prototype._renderByUrl = function(item, index, conf) {
	    var img = new Image();
	    var _this = this;
	    //img.setAttribute('crossOrigin', 'Anonymous');
	    img.onload = function() {
	        conf.itemDom = this;
	        _this.itemMap[index] = createNewItem(conf, _this._conf.container);
	    }
	    img.src = item.itemUrl;

	}

	PicEditor.prototype._buildItemConf = function(item, index) {
	    var _conf = {};
	    if (item.isRoot) {
	        $.extend(_conf, {
	            zIndex: index,
	        }, item);
	    } else {
	        $.extend(_conf, {
	            zIndex: index,
	            isShowRotate: true,
	            isShowDelete: true,
	            canMove: true,
	            canResize: true,
	            canRotate: true
	        }, item);
	    }
	    return _conf;
	}

	PicEditor.prototype._getPicConf = function() {
	    var _this = this;
	    var res = [];
	    $.map(Object.keys(this.itemMap), function(index) {
	        var item = _this.itemMap[index];
	        if (item.deleted) {
	            return;
	        } else {
	            res.push(item);
	        }
	    });
	    return res;
	}


	PicEditor.prototype._getScaleObj = function(targetW, targetH, srcW, srcH) {
	    var _scale1 = targetW / srcW;
	    var _scale2 = targetH / srcH;
	    var scale = _scale1 < _scale2 ? _scale1 : _scale2;
	    var _w = srcW * scale;
	    var _h = srcH * scale;
	    return {
	        offW: (targetW - _w) / 2,
	        offH: (targetH - _h) / 2,
	        scale: scale
	    }
	}

	PicEditor.prototype._buildBolbFile = function(canvas, done) {
	    done && done(canvas.toDataURL());
	    //canvas.toBlob(function(blob) {
	    //    done && done(blob);
	    //});
	}

	PicEditor.prototype._drawImage = function(ctx, p, img, scaleObj) {
	    ctx.save();
	    ctx.scale(scaleObj.scale, scaleObj.scale);
	    if (p.angle) {
	        var offW = scaleObj.offW + p.left + p.width / 2;
	        var offH = scaleObj.offH + p.top + p.height / 2;
	        ctx.translate(offW, offH);
	        ctx.rotate(p.angle * Math.PI / 180);
	        ctx.translate(-offW, -offH);
	    }
	    ctx.drawImage(img, scaleObj.offW + p.left, scaleObj.offH + p.top, p.width, p.height);
	    ctx.restore();
	}

	/**
	 * 得到编辑完成之后的图片文件
	 *
	 * @param {int} targetW 输出的宽度 [可选]
	 * @param {int} targetH 输出的高度 [可选]
	 * @param {function} done 获取图片的回调函数，第一个参数是blob文件
	 */
	PicEditor.prototype.getPicFile = function(targetW, targetH, done) {
	    if (typeof targetW == 'function') {
	        done = targetW;
	        targetW = this._conf.container.width();
	        targetH = this._conf.container.height();
	    }
	    var list = this._getPicConf();
	    var scaleObj = this._getScaleObj(targetW, targetH, this._conf.container.width(), this._conf.container.height());
	    // 创建一个canvas
	    var canvas = $('<canvas></canvas>')[0];
	    var ctx = canvas.getContext('2d');
	    var _this = this;
	    canvas.height = targetH;
	    canvas.width = targetW;
	    // 把每个涂层画到canvas中
	    $.map(list, function(item, index) {
	        var p = item.properties;
	        _this._drawImage(ctx, p, item.itemDom, scaleObj);
	        if (index == list.length - 1) {
	            _this._buildBolbFile(canvas, done);
	        }
	    });
	}

	/**
	 * 获取编辑器配置信息
	 *
	 * @returns {array}
	 */
	PicEditor.prototype.getPicConf = function() {
	    var list = this._getPicConf();
	    var res = [];
	    $.map(list, function(item) {
	        var _item = {};
	        $.map(['itemType', 'zIndex', 'itemUrl', 'properties', 'isRoot'], function(key) {
	            void 0 != item[key] && (_item[key] = item[key]);
	        });
	        if (!$.isEmptyObject(_item)) {
	            res.push(_item);
	        }
	    });
	    return res;
	}

	/**
	 * 增加新图层
	 *
	 * @param {array} picConfList 图层列表
	 */
	PicEditor.prototype.addLayer = function(picConfList) {
	    var _picConfList = picConfList || [];
	    this._addItem(picConfList, Object.keys(this.itemMap).length + 1);
	}

	//  hack toBlob method
	if (!HTMLCanvasElement.prototype.toBlob) {
	    Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
	        value: function(callback, type, quality) {
	            var binStr = atob(this.toDataURL(type, quality).split(',')[1]),
	                len = binStr.length,
	                arr = new Uint8Array(len);
	            for (var i = 0; i < len; i++) {
	                arr[i] = binStr.charCodeAt(i);
	            }
	            callback(new Blob([arr], {
	                type: type || 'image/png'
	            }));
	        }
	    });
	}


	window.PicEditor = PicEditor;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 *
	 * 本库用于创建可以处理的对象。
	 * 需要依赖jq，以及 Hammer
	 */
	var Hammer = __webpack_require__(2);


	/**
	 *
	 * @param {Number} w		当前width
	 * @param {Number} h		当前height
	 * @param {Number} W		外框width
	 * @param {Number} H		外框height
	 * @param {Boolean} isInside	是否框内元素
	 * @descript 根据外框获得新的尺寸大小
	 */


	function getNewSizeByFrame(w, h, W, H, isInside) {
	    if (w <= W && h <= H && isInside) {
	        return {
	            width: w,
	            height: h
	        };
	    }
	    var jw = 0,
	        jh = 0,
	        nw, nh;
	    if (w < h) {
	        nh = H;
	        nw = w * nh / h;
	        if (nw > W) {
	            jw = nw - W;
	            nw = W;
	            nh -= jw * h / w;
	        }
	    } else {
	        nw = W;
	        nh = nw * h / w;
	        if (nh > H) {
	            jh = nh - H;
	            nh = H;
	            nw -= jh * w / h;
	        }
	    }
	    return {
	        width: nw,
	        height: nh
	    };
	}

	/**
	 *
	 * @param {Number} cx	当前的x坐标
	 * @param {Number} cy	当前的y坐标
	 * @param {Number} ox	圆心的x坐标
	 * @param {Number} oy	圆心的y坐标
	 * @descript 通过 4 轴来确定一个新的坐标位置，得到一个角度
	 */
	function getCurDegree(cx, cy, ox, oy) {
	    var iw, ih;
	    // 我们以y0 位正方向，右螺旋（0，90，180，270）
	    if (cx > ox) {
	        iw = cx - ox;
	        if (cy > oy) { // 0 - 90
	            ih = cy - oy;
	            return !ih ? 90 : Math.atan(ih / iw) * 180 / Math.PI;
	        } else { // 270 - 360
	            ih = oy - cy;
	            return !ih ? 0 : 270 + Math.atan(iw / ih) * 180 / Math.PI;
	        }
	    } else { //cx <= ox
	        iw = ox - cx;
	        if (cy > oy) { // 90 - 180
	            if (!iw) {
	                return 90;
	            }
	            ih = cy - oy;
	            return !ih ? 180 : 90 + Math.atan(iw / ih) * 180 / Math.PI;
	        } else { // 180 - 270
	            // cy <= oy
	            if (!iw) {
	                return 270;
	            }
	            ih = oy - cy;
	            return !ih ? 180 : 180 + Math.atan(ih / iw) * 180 / Math.PI;
	        }
	    }
	}


	/**
	 *
	 * @param {Number} w		宽
	 * @param {Number} h		高
	 * @param {Number} l		左
	 * @param {Number} t		顶
	 * @descript 获得一个基本的对象的初始化属性
	 */
	function getTransformProperties(w, h, l, t) {
	    var radius = Math.sqrt(w * w + h * h);
	    return {
	        scale: 1, // 缩放
	        width: w, // 当前的宽
	        height: h, // 当前的高
	        left: l, // 当前的left
	        top: t, // 当前的top
	        angle: 0, // 当前角度
	        relativeY: 0, // 相对的y
	        radius: radius, // 当前的半径
	        center: [w / 2, h / 2], // 初始中心
	        originWidth: w, // 初始的宽
	        originHeight: h, // 初始的高
	        orginAngle: 0, // 初始角度
	        originRadius: radius, // 初始的半径
	    };
	}

	/**
	 *
	 * @param {Object} conf			配置对象
	 * 						isRoot			是否主对象
	 * 						itemDom			如果是img|svg,应该是已经存在有dom对象了，属于直接拿过来的
	 * 						itemType			img|lineframe|svg	元素类型
	 * 						shapeType			lineframe - line|circular|box 该类型下的子类别
	 * 						isShowRotate		是否显示旋转
	 * 						isShowResize		是否显示缩放
	 * 						isShowDelete		是否显示删除
	 * 						canRotate			是否可以旋转
	 * 						canResize			是否可以缩放
	 * 						canMove				否可以移动
	 * 						limitWidth []	限制的宽度范围 min，max
	 * 						limitHeight []	限制的高度范围 min，max
	 * 						limitTop []		限制的顶部范围 min，max
	 * 						limitLeft []	限制的左边范围 min，max
	 * 	@param {jqueryElement} $parent	需要插入的节点
	 *
	 * @descript 创建一个新的可编辑的对象
	 */
	function createNewItem(conf, $parent) {
	    //1. 获得元素，以及相应的尺寸等。如没位置，默认中间位置产生
	    //2. 塞入节点里
	    //3. 绑定相应的事件
	    //4. 节点的属性需要在全局的控制对象里
	    $parent = $parent || $(document.body);
	    var itemObj = createItemContainer(conf, $parent),
	        mc = new Hammer.Manager(itemObj.$elm.get(0));
	    console.log(itemObj);
	    mc.add(new Hammer.Pan({
	        threshold: 0,
	        pointers: 0
	    }));
	    mc.add(new Hammer.Rotate({
	        threshold: 0
	    })).recognizeWith(mc.get('pan'));
	    mc.add(new Hammer.Pinch({
	        threshold: 0
	    })).recognizeWith([mc.get('pan'), mc.get('rotate')]);
	    mc.on('rotatestart rotatemove', itemObj.funcs.rotate = funcRotate(itemObj));
	    mc.on('pinchstart pinchmove', itemObj.funcs.pinch = funcPinch(itemObj));
	    mc.on('panstart panmove', itemObj.funcs.pan = funcPan(itemObj));
	    mc.on("hammer.input", itemObj.funcs.input = funcHInpute(itemObj));
	    itemObj.funcs.delete = funcDelete(itemObj);
	    itemObj.$elm.on('click', '.delete', itemObj.funcs.delete.bind(itemObj));
	    return itemObj;
	}

	var nzIndex = 0;

	function createItemContainer(conf, $parent) {
	    var $div = $('<div></div>'),
	        $elmItem, elmItem, newSize, parentWidth = $($parent).width(),
	        elmItemH, elmItemW,
	        parentHeight = $($parent).height(),
	        re = {};
	    $div.addClass('editItem');
	    if (/^img|svg$/.test(conf.itemType)) {
	        elmItem = conf.itemDom;
	        $elmItem = $(conf.itemDom);
	        elmItemW = elmItem.width;
	        elmItemH = elmItem.height;
	        if (/^svg$/.test(conf.itemType) && typeof elmItemW == 'object') {
	            // 如果是svg标签 需要特殊获取宽高
	            elmItemW = parseInt($elmItem.attr('width'));
	            elmItemH = parseInt($elmItem.attr('height'));
	        }
	        newSize = getNewSizeByFrame(elmItemW, elmItemH, parentWidth, parentHeight, !(conf.isRoot && conf.itemType === 'img'));
	        re.properties = $.extend(getTransformProperties(newSize.width, newSize.height, (parentWidth - newSize.width) / 2, (parentHeight - newSize.height) / 2), conf.properties);
	        $elmItem.css({
	            width: '100%',
	            height: '100%'
	        });
	        $div.addClass('editItem-edit').css({
	            left: re.properties.left + 'px',
	            top: re.properties.top + 'px',
	            width: re.properties.width + 'px',
	            height: re.properties.height + 'px',
	            zIndex: conf.zIndex || ++nzIndex,
	            transform: 'rotate(' + re.properties.angle + 'deg)',
	        }).append($elmItem);
	        $($parent).append($div);
	        re.$elm = $div;
	    } else {

	    }
	    if (conf.isShowRotate) {
	        $div.append($('<div class="act rotate"></div>'));
	    }
	    if (conf.isShowDelete) {
	        $div.append($('<div class="act delete">' +
	            '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 16 16">' +
	            '<path fill="#444" d="M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM8 14.5c-3.59 0-6.5-2.91-6.5-6.5s2.91-6.5 6.5-6.5 6.5 2.91 6.5 6.5-2.91 6.5-6.5 6.5z"></path>' +
	            '<path fill="#fff" d="M10.5 4l-2.5 2.5-2.5-2.5-1.5 1.5 2.5 2.5-2.5 2.5 1.5 1.5 2.5-2.5 2.5 2.5 1.5-1.5-2.5-2.5 2.5-2.5z"></path>' +
	            '</svg>' + '</div>'));
	    }
	    if (conf.isShowResize && !conf.isShowRotate && !conf.isShowDelete) {
	        // 拖拽这个和其他操作 互斥，但是在功能上并不互斥
	        $div.append('<div class="act resize-tl"></div><div class="act resize-tr"></div><div class="act resize-bl"></div><div class="act resize-br"></div>');
	    }
	    re.funcs = {};
	    $.extend(re, conf);
	    return re;
	}

	/**
	 *
	 * @param {Object} conf		操作配置表
	 * @descript 用于产生一个新的旋转函数
	 */
	function funcRotate(conf) {
	    var confProps = conf.properties,
	        $elm = conf.$elm,
	        oldAngle, originAngle;
	    return function(ev) {
	        if (conf.isRoot || !conf.canRotate) {
	            return;
	        }
	        if (ev.type === 'rotatestart') {
	            originAngle = confProps.angle;
	            oldAngle = ev.rotation;
	            return;
	        }
	        confProps.angle = originAngle + (ev.rotation - oldAngle);
	        $elm.css('transform', 'rotate(' + confProps.angle + 'deg)');
	    };
	}

	/**
	 *
	 * @param {Object} conf		操作配置表
	 * @descript 用于产生一个新的缩放函数
	 */
	function funcPinch(conf) {
	    var confProps = conf.properties,
	        $elm = conf.$elm,
	        oldScale, newScale, newLeft, newTop, newWidth, newHeight,
	        oldLeft, oldTop, oldWidth, oldHeight;
	    return function(ev) {
	        if (conf.isRoot || !conf.canResize) {
	            return;
	        }
	        if (ev.type === 'pinchstart') {
	            oldScale = confProps.scale;
	            oldLeft = confProps.left;
	            oldTop = confProps.top;
	            oldWidth = confProps.width;
	            oldHeight = confProps.height;
	            return;
	        }
	        newScale = ev.scale;
	        //confProps.scale = newScale;
	        newWidth = newScale * oldWidth;
	        newHeight = newScale * oldHeight;
	        newLeft = oldLeft - (newWidth - oldWidth) / 2;
	        newTop = oldTop - (newHeight - oldHeight) / 2;
	        confProps.width = newWidth;
	        confProps.height = newHeight;
	        confProps.left = newLeft;
	        confProps.top = newTop;
	        $elm.css({
	            width: confProps.width + 'px',
	            height: confProps.height + 'px',
	            left: confProps.left + 'px',
	            top: confProps.top + 'px'
	        });
	    };
	}

	/**
	 *
	 * @param {Object} conf		操作配置表
	 * @descript 用于产生一个新的触碰函数，含旋转，拖拽，缩放等
	 */
	function funcPan(conf) {
	    var startX, startY, deltaX, deltaY, nDeltaX, nDeltaY, classMatch = /\b(rotate|resize-(tl|tr|bl|br))\b/,
	        isMain, isRotate, isResize, isResizeTL, isResizeTR, isResizeBL, isResizeBR,
	        oldCenterX, oldCenterY, oldLeft, oldTop, oldWidth, oldHeight, oldRadius, oldAngle,
	        originAngle, newRaidus, newAngle,
	        confProps = conf.properties,
	        $elm = conf.$elm;
	    return function(ev) {
	        var target = ev.target,
	            targetClass = target.className,
	            evC = ev.center;
	        if (!classMatch.test(targetClass) && !conf.canMove) {
	            return;
	        }
	        nDeltaX = ev.deltaX;
	        nDeltaY = ev.deltaY;
	        if (/^panstart/.test(ev.type)) {
	            startX = evC.x;
	            startY = evC.y;
	            deltaX = nDeltaX;
	            deltaY = nDeltaY;
	            isMain = !classMatch.test(targetClass);
	            isRotate = /\brotate\b/.test(targetClass);
	            isResize = /\bresize-(tl|tr|bl|br)\b/.test(targetClass);
	            isResizeTL = /\bresize-tl\b/.test(targetClass); // 会修改left，top
	            isResizeTR = /\bresize-tr\b/.test(targetClass); // 会修改top
	            isResizeBL = /\bresize-bl\b/.test(targetClass); // 会修改left
	            isResizeBR = /\bresize-br\b/.test(targetClass); // 只修改
	            originAngle = confProps.angle;
	            oldLeft = confProps.left;
	            oldTop = confProps.top;
	            oldWidth = confProps.width;
	            oldHeight = confProps.height;
	            oldCenterX = oldLeft + confProps.center[0];
	            oldCenterY = oldTop + confProps.center[1];
	            oldAngle = getCurDegree(startX, startY, oldCenterX, oldCenterY);
	            oldRadius = Math.abs(Math.sqrt(Math.pow(oldCenterX - startX, 2) + Math.pow(oldCenterY - startY, 2)));
	            //console.log(['begin', oldWidth, oldHeight, oldRadius]);
	            return;
	        }
	        // 如果是isMain，则只执行拖拽
	        if (isMain) {
	            confProps.left = oldLeft + nDeltaX;
	            confProps.top = oldTop + nDeltaY;
	            $elm.css({
	                left: confProps.left + 'px',
	                top: confProps.top + 'px'
	            });
	        } else if (isRotate) {
	            newAngle = getCurDegree(evC.x, evC.y, oldCenterX, oldCenterY);
	            newRaidus = Math.abs(Math.sqrt(Math.pow(oldCenterX - evC.x, 2) + Math.pow(oldCenterY - evC.y, 2)));
	            confProps.scale = newRaidus / oldRadius;
	            confProps.angle = originAngle + (newAngle - oldAngle);
	            confProps.width = oldWidth * confProps.scale;
	            confProps.height = oldHeight * confProps.scale;
	            confProps.left = oldLeft - (confProps.width - oldWidth) / 2;
	            confProps.top = oldTop - (confProps.height - oldHeight) / 2;
	            //console.log(['process', newWidth, newHeight, newRaidus]);
	            $elm.css({
	                width: confProps.width + 'px',
	                height: confProps.height + 'px',
	                left: confProps.left + 'px',
	                top: confProps.top + 'px',
	                transform: 'rotate(' + confProps.angle + 'deg)'
	            });
	        } else if (isResize) {
	            if (isResizeTL || isResizeBL) {
	                confProps.left = oldLeft + nDeltaX;
	                confProps.width = oldWidth - nDeltaX;
	            } else {
	                confProps.width = oldWidth + nDeltaX;
	            }
	            if (isResizeTL || isResizeTR) {
	                confProps.top = oldTop + nDeltaY;
	                confProps.height = oldHeight - nDeltaY;
	            } else {
	                confProps.height = oldHeight + nDeltaY;
	            }
	            $elm.css({
	                width: confProps.width + 'px',
	                height: confProps.height + 'px',
	                left: confProps.left + 'px',
	                top: confProps.top + 'px'
	            });
	        }
	    };
	}

	/**
	 *
	 * @param {Object} conf		操作配置表
	 * @descript 执行删除操作
	 */
	function funcDelete(conf) {
	    return function(ev) {
	        this.$elm.remove();
	        this.deleted = true;
	    };
	}

	/**
	 *
	 * @param {Object} conf		操作配置表
	 * @descript 用于产生一个新的数据返回函数
	 */
	function funcHInpute(conf) {
	    return function(ev) {
	        if (ev.isFinal) {} else {}
	    };
	}

	// 对外接口
	//window.createNewItem = createNewItem;
	module.exports = createNewItem;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*! Hammer.JS - v2.0.6 - 2016-01-06
	 * http://hammerjs.github.io/
	 *
	 * Copyright (c) 2016 Jorik Tangelder;
	 * Licensed under the  license */
	!function(a,b,c,d){"use strict";function e(a,b,c){return setTimeout(j(a,c),b)}function f(a,b,c){return Array.isArray(a)?(g(a,c[b],c),!0):!1}function g(a,b,c){var e;if(a)if(a.forEach)a.forEach(b,c);else if(a.length!==d)for(e=0;e<a.length;)b.call(c,a[e],e,a),e++;else for(e in a)a.hasOwnProperty(e)&&b.call(c,a[e],e,a)}function h(b,c,d){var e="DEPRECATED METHOD: "+c+"\n"+d+" AT \n";return function(){var c=new Error("get-stack-trace"),d=c&&c.stack?c.stack.replace(/^[^\(]+?[\n$]/gm,"").replace(/^\s+at\s+/gm,"").replace(/^Object.<anonymous>\s*\(/gm,"{anonymous}()@"):"Unknown Stack Trace",f=a.console&&(a.console.warn||a.console.log);return f&&f.call(a.console,e,d),b.apply(this,arguments)}}function i(a,b,c){var d,e=b.prototype;d=a.prototype=Object.create(e),d.constructor=a,d._super=e,c&&ha(d,c)}function j(a,b){return function(){return a.apply(b,arguments)}}function k(a,b){return typeof a==ka?a.apply(b?b[0]||d:d,b):a}function l(a,b){return a===d?b:a}function m(a,b,c){g(q(b),function(b){a.addEventListener(b,c,!1)})}function n(a,b,c){g(q(b),function(b){a.removeEventListener(b,c,!1)})}function o(a,b){for(;a;){if(a==b)return!0;a=a.parentNode}return!1}function p(a,b){return a.indexOf(b)>-1}function q(a){return a.trim().split(/\s+/g)}function r(a,b,c){if(a.indexOf&&!c)return a.indexOf(b);for(var d=0;d<a.length;){if(c&&a[d][c]==b||!c&&a[d]===b)return d;d++}return-1}function s(a){return Array.prototype.slice.call(a,0)}function t(a,b,c){for(var d=[],e=[],f=0;f<a.length;){var g=b?a[f][b]:a[f];r(e,g)<0&&d.push(a[f]),e[f]=g,f++}return c&&(d=b?d.sort(function(a,c){return a[b]>c[b]}):d.sort()),d}function u(a,b){for(var c,e,f=b[0].toUpperCase()+b.slice(1),g=0;g<ia.length;){if(c=ia[g],e=c?c+f:b,e in a)return e;g++}return d}function v(){return qa++}function w(b){var c=b.ownerDocument||b;return c.defaultView||c.parentWindow||a}function x(a,b){var c=this;this.manager=a,this.callback=b,this.element=a.element,this.target=a.options.inputTarget,this.domHandler=function(b){k(a.options.enable,[a])&&c.handler(b)},this.init()}function y(a){var b,c=a.options.inputClass;return new(b=c?c:ta?M:ua?P:sa?R:L)(a,z)}function z(a,b,c){var d=c.pointers.length,e=c.changedPointers.length,f=b&Aa&&d-e===0,g=b&(Ca|Da)&&d-e===0;c.isFirst=!!f,c.isFinal=!!g,f&&(a.session={}),c.eventType=b,A(a,c),a.emit("hammer.input",c),a.recognize(c),a.session.prevInput=c}function A(a,b){var c=a.session,d=b.pointers,e=d.length;c.firstInput||(c.firstInput=D(b)),e>1&&!c.firstMultiple?c.firstMultiple=D(b):1===e&&(c.firstMultiple=!1);var f=c.firstInput,g=c.firstMultiple,h=g?g.center:f.center,i=b.center=E(d);b.timeStamp=na(),b.deltaTime=b.timeStamp-f.timeStamp,b.angle=I(h,i),b.distance=H(h,i),B(c,b),b.offsetDirection=G(b.deltaX,b.deltaY);var j=F(b.deltaTime,b.deltaX,b.deltaY);b.overallVelocityX=j.x,b.overallVelocityY=j.y,b.overallVelocity=ma(j.x)>ma(j.y)?j.x:j.y,b.scale=g?K(g.pointers,d):1,b.rotation=g?J(g.pointers,d):0,b.maxPointers=c.prevInput?b.pointers.length>c.prevInput.maxPointers?b.pointers.length:c.prevInput.maxPointers:b.pointers.length,C(c,b);var k=a.element;o(b.srcEvent.target,k)&&(k=b.srcEvent.target),b.target=k}function B(a,b){var c=b.center,d=a.offsetDelta||{},e=a.prevDelta||{},f=a.prevInput||{};(b.eventType===Aa||f.eventType===Ca)&&(e=a.prevDelta={x:f.deltaX||0,y:f.deltaY||0},d=a.offsetDelta={x:c.x,y:c.y}),b.deltaX=e.x+(c.x-d.x),b.deltaY=e.y+(c.y-d.y)}function C(a,b){var c,e,f,g,h=a.lastInterval||b,i=b.timeStamp-h.timeStamp;if(b.eventType!=Da&&(i>za||h.velocity===d)){var j=b.deltaX-h.deltaX,k=b.deltaY-h.deltaY,l=F(i,j,k);e=l.x,f=l.y,c=ma(l.x)>ma(l.y)?l.x:l.y,g=G(j,k),a.lastInterval=b}else c=h.velocity,e=h.velocityX,f=h.velocityY,g=h.direction;b.velocity=c,b.velocityX=e,b.velocityY=f,b.direction=g}function D(a){for(var b=[],c=0;c<a.pointers.length;)b[c]={clientX:la(a.pointers[c].clientX),clientY:la(a.pointers[c].clientY)},c++;return{timeStamp:na(),pointers:b,center:E(b),deltaX:a.deltaX,deltaY:a.deltaY}}function E(a){var b=a.length;if(1===b)return{x:la(a[0].clientX),y:la(a[0].clientY)};for(var c=0,d=0,e=0;b>e;)c+=a[e].clientX,d+=a[e].clientY,e++;return{x:la(c/b),y:la(d/b)}}function F(a,b,c){return{x:b/a||0,y:c/a||0}}function G(a,b){return a===b?Ea:ma(a)>=ma(b)?0>a?Fa:Ga:0>b?Ha:Ia}function H(a,b,c){c||(c=Ma);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return Math.sqrt(d*d+e*e)}function I(a,b,c){c||(c=Ma);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return 180*Math.atan2(e,d)/Math.PI}function J(a,b){return I(b[1],b[0],Na)+I(a[1],a[0],Na)}function K(a,b){return H(b[0],b[1],Na)/H(a[0],a[1],Na)}function L(){this.evEl=Pa,this.evWin=Qa,this.allow=!0,this.pressed=!1,x.apply(this,arguments)}function M(){this.evEl=Ta,this.evWin=Ua,x.apply(this,arguments),this.store=this.manager.session.pointerEvents=[]}function N(){this.evTarget=Wa,this.evWin=Xa,this.started=!1,x.apply(this,arguments)}function O(a,b){var c=s(a.touches),d=s(a.changedTouches);return b&(Ca|Da)&&(c=t(c.concat(d),"identifier",!0)),[c,d]}function P(){this.evTarget=Za,this.targetIds={},x.apply(this,arguments)}function Q(a,b){var c=s(a.touches),d=this.targetIds;if(b&(Aa|Ba)&&1===c.length)return d[c[0].identifier]=!0,[c,c];var e,f,g=s(a.changedTouches),h=[],i=this.target;if(f=c.filter(function(a){return o(a.target,i)}),b===Aa)for(e=0;e<f.length;)d[f[e].identifier]=!0,e++;for(e=0;e<g.length;)d[g[e].identifier]&&h.push(g[e]),b&(Ca|Da)&&delete d[g[e].identifier],e++;return h.length?[t(f.concat(h),"identifier",!0),h]:void 0}function R(){x.apply(this,arguments);var a=j(this.handler,this);this.touch=new P(this.manager,a),this.mouse=new L(this.manager,a)}function S(a,b){this.manager=a,this.set(b)}function T(a){if(p(a,db))return db;var b=p(a,eb),c=p(a,fb);return b&&c?db:b||c?b?eb:fb:p(a,cb)?cb:bb}function U(a){this.options=ha({},this.defaults,a||{}),this.id=v(),this.manager=null,this.options.enable=l(this.options.enable,!0),this.state=gb,this.simultaneous={},this.requireFail=[]}function V(a){return a&lb?"cancel":a&jb?"end":a&ib?"move":a&hb?"start":""}function W(a){return a==Ia?"down":a==Ha?"up":a==Fa?"left":a==Ga?"right":""}function X(a,b){var c=b.manager;return c?c.get(a):a}function Y(){U.apply(this,arguments)}function Z(){Y.apply(this,arguments),this.pX=null,this.pY=null}function $(){Y.apply(this,arguments)}function _(){U.apply(this,arguments),this._timer=null,this._input=null}function aa(){Y.apply(this,arguments)}function ba(){Y.apply(this,arguments)}function ca(){U.apply(this,arguments),this.pTime=!1,this.pCenter=!1,this._timer=null,this._input=null,this.count=0}function da(a,b){return b=b||{},b.recognizers=l(b.recognizers,da.defaults.preset),new ea(a,b)}function ea(a,b){this.options=ha({},da.defaults,b||{}),this.options.inputTarget=this.options.inputTarget||a,this.handlers={},this.session={},this.recognizers=[],this.element=a,this.input=y(this),this.touchAction=new S(this,this.options.touchAction),fa(this,!0),g(this.options.recognizers,function(a){var b=this.add(new a[0](a[1]));a[2]&&b.recognizeWith(a[2]),a[3]&&b.requireFailure(a[3])},this)}function fa(a,b){var c=a.element;c.style&&g(a.options.cssProps,function(a,d){c.style[u(c.style,d)]=b?a:""})}function ga(a,c){var d=b.createEvent("Event");d.initEvent(a,!0,!0),d.gesture=c,c.target.dispatchEvent(d)}var ha,ia=["","webkit","Moz","MS","ms","o"],ja=b.createElement("div"),ka="function",la=Math.round,ma=Math.abs,na=Date.now;ha="function"!=typeof Object.assign?function(a){if(a===d||null===a)throw new TypeError("Cannot convert undefined or null to object");for(var b=Object(a),c=1;c<arguments.length;c++){var e=arguments[c];if(e!==d&&null!==e)for(var f in e)e.hasOwnProperty(f)&&(b[f]=e[f])}return b}:Object.assign;var oa=h(function(a,b,c){for(var e=Object.keys(b),f=0;f<e.length;)(!c||c&&a[e[f]]===d)&&(a[e[f]]=b[e[f]]),f++;return a},"extend","Use `assign`."),pa=h(function(a,b){return oa(a,b,!0)},"merge","Use `assign`."),qa=1,ra=/mobile|tablet|ip(ad|hone|od)|android/i,sa="ontouchstart"in a,ta=u(a,"PointerEvent")!==d,ua=sa&&ra.test(navigator.userAgent),va="touch",wa="pen",xa="mouse",ya="kinect",za=25,Aa=1,Ba=2,Ca=4,Da=8,Ea=1,Fa=2,Ga=4,Ha=8,Ia=16,Ja=Fa|Ga,Ka=Ha|Ia,La=Ja|Ka,Ma=["x","y"],Na=["clientX","clientY"];x.prototype={handler:function(){},init:function(){this.evEl&&m(this.element,this.evEl,this.domHandler),this.evTarget&&m(this.target,this.evTarget,this.domHandler),this.evWin&&m(w(this.element),this.evWin,this.domHandler)},destroy:function(){this.evEl&&n(this.element,this.evEl,this.domHandler),this.evTarget&&n(this.target,this.evTarget,this.domHandler),this.evWin&&n(w(this.element),this.evWin,this.domHandler)}};var Oa={mousedown:Aa,mousemove:Ba,mouseup:Ca},Pa="mousedown",Qa="mousemove mouseup";i(L,x,{handler:function(a){var b=Oa[a.type];b&Aa&&0===a.button&&(this.pressed=!0),b&Ba&&1!==a.which&&(b=Ca),this.pressed&&this.allow&&(b&Ca&&(this.pressed=!1),this.callback(this.manager,b,{pointers:[a],changedPointers:[a],pointerType:xa,srcEvent:a}))}});var Ra={pointerdown:Aa,pointermove:Ba,pointerup:Ca,pointercancel:Da,pointerout:Da},Sa={2:va,3:wa,4:xa,5:ya},Ta="pointerdown",Ua="pointermove pointerup pointercancel";a.MSPointerEvent&&!a.PointerEvent&&(Ta="MSPointerDown",Ua="MSPointerMove MSPointerUp MSPointerCancel"),i(M,x,{handler:function(a){var b=this.store,c=!1,d=a.type.toLowerCase().replace("ms",""),e=Ra[d],f=Sa[a.pointerType]||a.pointerType,g=f==va,h=r(b,a.pointerId,"pointerId");e&Aa&&(0===a.button||g)?0>h&&(b.push(a),h=b.length-1):e&(Ca|Da)&&(c=!0),0>h||(b[h]=a,this.callback(this.manager,e,{pointers:b,changedPointers:[a],pointerType:f,srcEvent:a}),c&&b.splice(h,1))}});var Va={touchstart:Aa,touchmove:Ba,touchend:Ca,touchcancel:Da},Wa="touchstart",Xa="touchstart touchmove touchend touchcancel";i(N,x,{handler:function(a){var b=Va[a.type];if(b===Aa&&(this.started=!0),this.started){var c=O.call(this,a,b);b&(Ca|Da)&&c[0].length-c[1].length===0&&(this.started=!1),this.callback(this.manager,b,{pointers:c[0],changedPointers:c[1],pointerType:va,srcEvent:a})}}});var Ya={touchstart:Aa,touchmove:Ba,touchend:Ca,touchcancel:Da},Za="touchstart touchmove touchend touchcancel";i(P,x,{handler:function(a){var b=Ya[a.type],c=Q.call(this,a,b);c&&this.callback(this.manager,b,{pointers:c[0],changedPointers:c[1],pointerType:va,srcEvent:a})}}),i(R,x,{handler:function(a,b,c){var d=c.pointerType==va,e=c.pointerType==xa;if(d)this.mouse.allow=!1;else if(e&&!this.mouse.allow)return;b&(Ca|Da)&&(this.mouse.allow=!0),this.callback(a,b,c)},destroy:function(){this.touch.destroy(),this.mouse.destroy()}});var $a=u(ja.style,"touchAction"),_a=$a!==d,ab="compute",bb="auto",cb="manipulation",db="none",eb="pan-x",fb="pan-y";S.prototype={set:function(a){a==ab&&(a=this.compute()),_a&&this.manager.element.style&&(this.manager.element.style[$a]=a),this.actions=a.toLowerCase().trim()},update:function(){this.set(this.manager.options.touchAction)},compute:function(){var a=[];return g(this.manager.recognizers,function(b){k(b.options.enable,[b])&&(a=a.concat(b.getTouchAction()))}),T(a.join(" "))},preventDefaults:function(a){if(!_a){var b=a.srcEvent,c=a.offsetDirection;if(this.manager.session.prevented)return void b.preventDefault();var d=this.actions,e=p(d,db),f=p(d,fb),g=p(d,eb);if(e){var h=1===a.pointers.length,i=a.distance<2,j=a.deltaTime<250;if(h&&i&&j)return}if(!g||!f)return e||f&&c&Ja||g&&c&Ka?this.preventSrc(b):void 0}},preventSrc:function(a){this.manager.session.prevented=!0,a.preventDefault()}};var gb=1,hb=2,ib=4,jb=8,kb=jb,lb=16,mb=32;U.prototype={defaults:{},set:function(a){return ha(this.options,a),this.manager&&this.manager.touchAction.update(),this},recognizeWith:function(a){if(f(a,"recognizeWith",this))return this;var b=this.simultaneous;return a=X(a,this),b[a.id]||(b[a.id]=a,a.recognizeWith(this)),this},dropRecognizeWith:function(a){return f(a,"dropRecognizeWith",this)?this:(a=X(a,this),delete this.simultaneous[a.id],this)},requireFailure:function(a){if(f(a,"requireFailure",this))return this;var b=this.requireFail;return a=X(a,this),-1===r(b,a)&&(b.push(a),a.requireFailure(this)),this},dropRequireFailure:function(a){if(f(a,"dropRequireFailure",this))return this;a=X(a,this);var b=r(this.requireFail,a);return b>-1&&this.requireFail.splice(b,1),this},hasRequireFailures:function(){return this.requireFail.length>0},canRecognizeWith:function(a){return!!this.simultaneous[a.id]},emit:function(a){function b(b){c.manager.emit(b,a)}var c=this,d=this.state;jb>d&&b(c.options.event+V(d)),b(c.options.event),a.additionalEvent&&b(a.additionalEvent),d>=jb&&b(c.options.event+V(d))},tryEmit:function(a){return this.canEmit()?this.emit(a):void(this.state=mb)},canEmit:function(){for(var a=0;a<this.requireFail.length;){if(!(this.requireFail[a].state&(mb|gb)))return!1;a++}return!0},recognize:function(a){var b=ha({},a);return k(this.options.enable,[this,b])?(this.state&(kb|lb|mb)&&(this.state=gb),this.state=this.process(b),void(this.state&(hb|ib|jb|lb)&&this.tryEmit(b))):(this.reset(),void(this.state=mb))},process:function(a){},getTouchAction:function(){},reset:function(){}},i(Y,U,{defaults:{pointers:1},attrTest:function(a){var b=this.options.pointers;return 0===b||a.pointers.length===b},process:function(a){var b=this.state,c=a.eventType,d=b&(hb|ib),e=this.attrTest(a);return d&&(c&Da||!e)?b|lb:d||e?c&Ca?b|jb:b&hb?b|ib:hb:mb}}),i(Z,Y,{defaults:{event:"pan",threshold:10,pointers:1,direction:La},getTouchAction:function(){var a=this.options.direction,b=[];return a&Ja&&b.push(fb),a&Ka&&b.push(eb),b},directionTest:function(a){var b=this.options,c=!0,d=a.distance,e=a.direction,f=a.deltaX,g=a.deltaY;return e&b.direction||(b.direction&Ja?(e=0===f?Ea:0>f?Fa:Ga,c=f!=this.pX,d=Math.abs(a.deltaX)):(e=0===g?Ea:0>g?Ha:Ia,c=g!=this.pY,d=Math.abs(a.deltaY))),a.direction=e,c&&d>b.threshold&&e&b.direction},attrTest:function(a){return Y.prototype.attrTest.call(this,a)&&(this.state&hb||!(this.state&hb)&&this.directionTest(a))},emit:function(a){this.pX=a.deltaX,this.pY=a.deltaY;var b=W(a.direction);b&&(a.additionalEvent=this.options.event+b),this._super.emit.call(this,a)}}),i($,Y,{defaults:{event:"pinch",threshold:0,pointers:2},getTouchAction:function(){return[db]},attrTest:function(a){return this._super.attrTest.call(this,a)&&(Math.abs(a.scale-1)>this.options.threshold||this.state&hb)},emit:function(a){if(1!==a.scale){var b=a.scale<1?"in":"out";a.additionalEvent=this.options.event+b}this._super.emit.call(this,a)}}),i(_,U,{defaults:{event:"press",pointers:1,time:251,threshold:9},getTouchAction:function(){return[bb]},process:function(a){var b=this.options,c=a.pointers.length===b.pointers,d=a.distance<b.threshold,f=a.deltaTime>b.time;if(this._input=a,!d||!c||a.eventType&(Ca|Da)&&!f)this.reset();else if(a.eventType&Aa)this.reset(),this._timer=e(function(){this.state=kb,this.tryEmit()},b.time,this);else if(a.eventType&Ca)return kb;return mb},reset:function(){clearTimeout(this._timer)},emit:function(a){this.state===kb&&(a&&a.eventType&Ca?this.manager.emit(this.options.event+"up",a):(this._input.timeStamp=na(),this.manager.emit(this.options.event,this._input)))}}),i(aa,Y,{defaults:{event:"rotate",threshold:0,pointers:2},getTouchAction:function(){return[db]},attrTest:function(a){return this._super.attrTest.call(this,a)&&(Math.abs(a.rotation)>this.options.threshold||this.state&hb)}}),i(ba,Y,{defaults:{event:"swipe",threshold:10,velocity:.3,direction:Ja|Ka,pointers:1},getTouchAction:function(){return Z.prototype.getTouchAction.call(this)},attrTest:function(a){var b,c=this.options.direction;return c&(Ja|Ka)?b=a.overallVelocity:c&Ja?b=a.overallVelocityX:c&Ka&&(b=a.overallVelocityY),this._super.attrTest.call(this,a)&&c&a.offsetDirection&&a.distance>this.options.threshold&&a.maxPointers==this.options.pointers&&ma(b)>this.options.velocity&&a.eventType&Ca},emit:function(a){var b=W(a.offsetDirection);b&&this.manager.emit(this.options.event+b,a),this.manager.emit(this.options.event,a)}}),i(ca,U,{defaults:{event:"tap",pointers:1,taps:1,interval:300,time:250,threshold:9,posThreshold:10},getTouchAction:function(){return[cb]},process:function(a){var b=this.options,c=a.pointers.length===b.pointers,d=a.distance<b.threshold,f=a.deltaTime<b.time;if(this.reset(),a.eventType&Aa&&0===this.count)return this.failTimeout();if(d&&f&&c){if(a.eventType!=Ca)return this.failTimeout();var g=this.pTime?a.timeStamp-this.pTime<b.interval:!0,h=!this.pCenter||H(this.pCenter,a.center)<b.posThreshold;this.pTime=a.timeStamp,this.pCenter=a.center,h&&g?this.count+=1:this.count=1,this._input=a;var i=this.count%b.taps;if(0===i)return this.hasRequireFailures()?(this._timer=e(function(){this.state=kb,this.tryEmit()},b.interval,this),hb):kb}return mb},failTimeout:function(){return this._timer=e(function(){this.state=mb},this.options.interval,this),mb},reset:function(){clearTimeout(this._timer)},emit:function(){this.state==kb&&(this._input.tapCount=this.count,this.manager.emit(this.options.event,this._input))}}),da.VERSION="2.0.6",da.defaults={domEvents:!1,touchAction:ab,enable:!0,inputTarget:null,inputClass:null,preset:[[aa,{enable:!1}],[$,{enable:!1},["rotate"]],[ba,{direction:Ja}],[Z,{direction:Ja},["swipe"]],[ca],[ca,{event:"doubletap",taps:2},["tap"]],[_]],cssProps:{userSelect:"none",touchSelect:"none",touchCallout:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"}};var nb=1,ob=2;ea.prototype={set:function(a){return ha(this.options,a),a.touchAction&&this.touchAction.update(),a.inputTarget&&(this.input.destroy(),this.input.target=a.inputTarget,this.input.init()),this},stop:function(a){this.session.stopped=a?ob:nb},recognize:function(a){var b=this.session;if(!b.stopped){this.touchAction.preventDefaults(a);var c,d=this.recognizers,e=b.curRecognizer;(!e||e&&e.state&kb)&&(e=b.curRecognizer=null);for(var f=0;f<d.length;)c=d[f],b.stopped===ob||e&&c!=e&&!c.canRecognizeWith(e)?c.reset():c.recognize(a),!e&&c.state&(hb|ib|jb)&&(e=b.curRecognizer=c),f++}},get:function(a){if(a instanceof U)return a;for(var b=this.recognizers,c=0;c<b.length;c++)if(b[c].options.event==a)return b[c];return null},add:function(a){if(f(a,"add",this))return this;var b=this.get(a.options.event);return b&&this.remove(b),this.recognizers.push(a),a.manager=this,this.touchAction.update(),a},remove:function(a){if(f(a,"remove",this))return this;if(a=this.get(a)){var b=this.recognizers,c=r(b,a);-1!==c&&(b.splice(c,1),this.touchAction.update())}return this},on:function(a,b){var c=this.handlers;return g(q(a),function(a){c[a]=c[a]||[],c[a].push(b)}),this},off:function(a,b){var c=this.handlers;return g(q(a),function(a){b?c[a]&&c[a].splice(r(c[a],b),1):delete c[a]}),this},emit:function(a,b){this.options.domEvents&&ga(a,b);var c=this.handlers[a]&&this.handlers[a].slice();if(c&&c.length){b.type=a,b.preventDefault=function(){b.srcEvent.preventDefault()};for(var d=0;d<c.length;)c[d](b),d++}},destroy:function(){this.element&&fa(this,!1),this.handlers={},this.session={},this.input.destroy(),this.element=null}},ha(da,{INPUT_START:Aa,INPUT_MOVE:Ba,INPUT_END:Ca,INPUT_CANCEL:Da,STATE_POSSIBLE:gb,STATE_BEGAN:hb,STATE_CHANGED:ib,STATE_ENDED:jb,STATE_RECOGNIZED:kb,STATE_CANCELLED:lb,STATE_FAILED:mb,DIRECTION_NONE:Ea,DIRECTION_LEFT:Fa,DIRECTION_RIGHT:Ga,DIRECTION_UP:Ha,DIRECTION_DOWN:Ia,DIRECTION_HORIZONTAL:Ja,DIRECTION_VERTICAL:Ka,DIRECTION_ALL:La,Manager:ea,Input:x,TouchAction:S,TouchInput:P,MouseInput:L,PointerEventInput:M,TouchMouseInput:R,SingleTouchInput:N,Recognizer:U,AttrRecognizer:Y,Tap:ca,Pan:Z,Swipe:ba,Pinch:$,Rotate:aa,Press:_,on:m,off:n,each:g,merge:pa,extend:oa,assign:ha,inherit:i,bindFn:j,prefixed:u});var pb="undefined"!=typeof a?a:"undefined"!=typeof self?self:{};pb.Hammer=da, true?!(__WEBPACK_AMD_DEFINE_RESULT__ = function(){return da}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):"undefined"!=typeof module&&module.exports?module.exports=da:a[c]=da}(window,document,"Hammer");


/***/ }
/******/ ]);