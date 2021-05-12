"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectFile = selectFile;
exports.Poster = void 0;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Poster = /*#__PURE__*/function () {
  function Poster(props) {
    var _this = this;

    _classCallCheck(this, Poster);

    _defineProperty(this, "onTouchstart", function (event) {
      var touches = event.touches;

      if (touches.length == 1) {
        _this.onStartClientX = touches[0].clientX;
        _this.onStartClientY = touches[0].clientY;
      } else if (touches.length >= 2) {
        for (var index = 0; index < touches.length; index++) {
          var element = touches[index];
          _this.startClientY[index] = element.clientX;
        }
      }
    });

    _defineProperty(this, "onTouchmove", function (event) {
      var touches = event.touches;

      if (touches.length == 1) {
        if (_this.ActivateZoom) {
          var x = touches[0].clientX - _this.onStartClientX;
          var y = touches[0].clientY - _this.onStartClientY;
          _this.onStartClientX = touches[0].clientX;
          _this.onStartClientY = touches[0].clientY;
          _this.translateX += x;
          _this.translateY += y;

          _this.setSelectImgId();
        } else {
          _this.onStartClientX = touches[0].clientX;
          _this.onStartClientY = touches[0].clientY;
        }
      } else if (touches.length >= 2) {
        var timeCallBack = function timeCallBack(touche) {
          window.requestAnimationFrame(function () {
            //得到缩放比例
            var scale = _this.getDistance(touche[0].clientY, touche[1].clientY) / _this.getDistance(_this.startClientY[0], _this.startClientY[1]);

            _this.lastScale = _this.lastScale == 1 ? scale : _this.lastScale;
            var scaleBase = scale / _this.lastScale;

            if (_this.ActivateZoom && _this.lastScale < scale) {
              // this.scale += 0.1;
              _this.scale *= scaleBase;

              if (_this.scale >= _this.maxScale) {
                _this.scale = _this.maxScale;
              } // console.log("放大：", this.scale);


              _this.setSelectImgId();
            } else if (_this.ActivateZoom && _this.lastScale > scale) {
              // this.scale -= 0.1;
              _this.scale *= scaleBase;

              if (_this.scale <= _this.minScale) {
                _this.scale = _this.minScale;
              } // console.log("缩小：", this.scale);


              _this.setSelectImgId();
            } // console.log('scale: ',scale, 'lastScale:',this.lastScale,'scale/lastScale:',scale/this.lastScale)
            // console.log('scale/lastScale:',scale/this.lastScale,scale,this.lastScale);


            _this.lastScale = scale;
          });
        };

        timeCallBack(touches);
      }

      _this.ActivateZoom = true; //阻止滚动

      event.preventDefault();
    });

    _defineProperty(this, "onTouchend", function () {
      _this.ActivateZoom = false;
      _this.lastScale = 1;
    });

    _defineProperty(this, "startDrawing", function (call) {
      _this.ctx.clearRect(0, 0, _this.canvas.width, _this.canvas.height);

      _this.drawImage(_this.getSelectImg);

      if (_this.imgList.length) {
        var imgList = _this.imgList;

        for (var i = 0; i < imgList.length; i++) {
          _this.drawImage(imgList[i]);
        }
      }

      if (_this.textList.length) {
        _this.ctx.save();

        var textList = _this.textList;

        for (var _i = 0; _i < textList.length; _i++) {
          var _this$getClientRect = _this.getClientRect(textList[_i]),
              x = _this$getClientRect.x,
              y = _this$getClientRect.y,
              width = _this$getClientRect.width; // console.log(textList[i].style.fontSize,textList[i].style)


          var _textList$_i$style = textList[_i].style,
              fontSize = _textList$_i$style.fontSize,
              fontFamily = _textList$_i$style.fontFamily,
              lineHeight = _textList$_i$style.lineHeight,
              color = _textList$_i$style.color;
          fontSize = fontSize ? parseInt(fontSize) : 12;
          fontFamily = fontFamily ? fontFamily : "STXihei, '\u534E\u6587\u7EC6\u9ED1', 'Microsoft YaHei', '\u5FAE\u8F6F\u96C5\u9ED1'";
          lineHeight = lineHeight ? parseInt(lineHeight) : fontSize * 1.4;
          var u = navigator.userAgent;
          var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
          var fontHeight = 0;
          if (!isIOS) fontHeight = fontSize > lineHeight ? 0 : (lineHeight - fontSize) / 2 * _this.ratio; // console.log(fontHeight);

          fontSize = fontSize * _this.ratio;
          lineHeight = lineHeight * _this.ratio; // 示例：ctx.font="20px '微软雅黑'";

          _this.ctx.font = "".concat(fontSize, "px ").concat(fontFamily);
          _this.ctx.fillStyle = color || "#000000"; // this.ctx.strokeStyle = color;

          _this.ctx.textBaseline = "top"; // console.log(fontSize,fontFamily,lineHeight,color);

          _this.ctx.wrapText(textList[_i].innerText, x, y + fontHeight, {
            maxWidth: width,
            lineHeight: lineHeight
          });
        }

        _this.ctx.restore();
      }

      var poster = _this.canvas.toDataURL("image/png", 1);

      call && call(poster);
    });

    _defineProperty(this, "drawImage", function (target) {
      var _this$getClientRect2 = _this.getClientRect(target),
          x = _this$getClientRect2.x,
          y = _this$getClientRect2.y,
          width = _this$getClientRect2.width,
          height = _this$getClientRect2.height;

      _this.ctx.drawImage(target, x, y, width, height);
    });

    if (!props.selectImgId || !props.contaienr) {
      console.error("posterSynthesis：selectImg，contaienr 是必传参数");
      return false;
    } else if (props.contaienr.tagName != "DIV") {
      console.error("posterSynthesis：传入的 contaienr 不是 div 元素");
      return false;
    } else if (props.imgListContainer && props.imgListContainer.tagName != "DIV" || props.textListContainer && props.textListContainer.tagName != "DIV") {
      console.error("posterSynthesis：传入的 imgListContainer,textListContainer 不是 div 元素");
      return false;
    }

    this.getSelectImg = props.selectImgId;

    try {
      this.getSelectImg.setAttribute("crossOrigin", "Anonymous");
    } catch (e) {
      console.error("crossOrigin:Anonymous 设置出错请允许跨域==>", e);
    }
    /**是否返回高清图 */


    this.HD = props.HD || false;
    /**图片合成列表容器 */

    this.imgListContainer = props.imgListContainer || null;
    /**图片合成列表 */

    this.imgList = [];
    /**文字合成列表容器 */

    this.textListContainer = props.textListContainer || null;
    /**文字合成列表 */

    this.textList = [];
    /**是否激活缩放 */

    this.ActivateZoom = false;
    /**上一次缩放比例 */

    this.lastScale = 1;
    /**记录缩放比例 */

    this.scale = 1;
    /**最小缩放尺寸 */

    this.minScale = props.minScale || 0.4;
    this.minScale = this.minScale < 0.1 ? this.minScale : this.minScale;
    /**最大缩放尺寸 */

    this.maxScale = props.maxScale || 3;
    /** 记录单指按下时的 X */

    this.onStartClientX = 0;
    /** 记录单指按下时的 Y */

    this.onStartClientY = 0;
    /** 记录双指按下的 两个手指 X轴 */

    this.startClientX = [0, 0];
    /** 记录双指按下的 两个手指 Y轴 */

    this.startClientY = [0, 0];
    /**当前移动距离 */

    this.translateX = 0;
    this.translateY = 0;
    /**当前显示设备的物理像素分辨率与CSS像素分辨率之比 */

    this.ratio = 1;
    this.contaienr = props.contaienr;
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    /**手指按到屏幕上 */

    this.contaienr.addEventListener("touchstart", this.onTouchstart, false);
    /**手指在屏幕上移动的时候触发 */

    this.contaienr.addEventListener("touchmove", this.onTouchmove, false);
    /**手指从屏幕上拿起的时候触发 */

    this.contaienr.addEventListener("touchend", this.onTouchend, false);

    if (this.imgListContainer) {
      var imgList = this.imgList = this.imgListContainer.getElementsByClassName("poster_img") || [];

      for (var i = 0; i < imgList.length; i++) {
        try {
          imgList[i].setAttribute("crossOrigin", "Anonymous");
        } catch (e) {
          console.error("crossOrigin:Anonymous 设置出错请允许跨域==>", e);
        }
      }
    }

    if (this.textListContainer) {
      this.textList = this.textListContainer.getElementsByClassName("poster_text") || [];
    }

    var canvas = this.canvas;
    canvas.width = this.contaienr.offsetWidth;
    canvas.height = this.contaienr.offsetHeight;

    if (this.HD) {
      var ratio = this.ratio = this.getPixelRatio(this.ctx);
      canvas.width *= ratio;
      canvas.height *= ratio;
    }
  }

  _createClass(Poster, [{
    key: "resetSelectImg",
    value: function resetSelectImg(src) {
      this.ActivateZoom = false;
      this.lastScale = 1;
      this.scale = 1;
      this.onStartClientX = 0;
      this.onStartClientY = 0;
      this.startClientX = [0, 0];
      this.startClientY = [0, 0];
      this.translateX = 0;
      this.translateY = 0;
      this.getSelectImg.src = src;
      this.setSelectImgId();
    }
  }, {
    key: "setSelectImgId",
    value: function setSelectImgId() {
      this.getSelectImg.style.transform = "translateX(".concat(this.translateX, "px) translateY(").concat(this.translateY, "px) scale(").concat(this.scale, ")");
    }
    /**手指按到屏幕上 */

  }, {
    key: "getDistance",
    value:
    /**勾股定理的一个方法 */
    function getDistance(p1, p2) {
      var x = p2 - p1,
          y = p2 - p1;
      return Math.sqrt(x * x + y * y);
    }
    /**
     * @param {HTMLElement} context
     * @returns {number} 返回当前显示设备的物理像素分辨率与CSS像素分辨率之比
     */

  }, {
    key: "getPixelRatio",
    value: function getPixelRatio(context) {
      var backingStore = context.backingStorePixelRatio || context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio || context.backingStorePixelRatio || 1;
      backingStore = backingStore > 1 ? backingStore : 1;
      return (window.devicePixelRatio || 1) / backingStore;
    }
    /**
     * @param {HTMLElement} target
     * @returns {Object} x,y,width,height 返回相对于父元素的坐标
     */

  }, {
    key: "getClientRect",
    value: function getClientRect(target) {
      // getBoundingClientRect(target) 相对于可视区
      var contaienr = this.contaienr;
      var x = target.getBoundingClientRect().x - contaienr.getBoundingClientRect().x,
          y = target.getBoundingClientRect().y - contaienr.getBoundingClientRect().y,
          width = target.getBoundingClientRect().width,
          height = target.getBoundingClientRect().height; // 处理图片模糊问题

      if (this.HD) {
        var ratio = this.ratio;

        if (ratio >= 1) {
          x = x * ratio;
          y = y * ratio;
          width = width * ratio;
          height = height * ratio;
        }
      }

      return {
        x: x,
        y: y,
        width: width,
        height: height
      };
    }
    /**
     *
     * @param { (call:string)=>void } call 回调函数，返回 base64 的图片格式。
     */

  }]);

  return Poster;
}();
/**
 *
 * @param {string} src  路劲
 * @param {Function} callback  回调函数
 * @returns {HTMLElement} 返回一个 images 元素
 */


exports.Poster = Poster;

function createAnonymousImg(src, callback) {
  return new Promise(function (resovlve, reject) {
    try {
      var img = document.createElement("img");
      img.setAttribute("crossOrigin", "Anonymous");
      img.src = src;

      img.onload = function () {
        callback(img);
        resovlve(img);
        img = null;
      };
    } catch (e) {
      console.error("crossOrigin:Anonymous 设置出错请允许跨域==>", e);
      reject(e);
    }
  });
}
/*
 * 标记 input 输入框
 * */


var inputSelectFile = null;
/**
 *
 * @param {function} callback   回调函数
 * @param {'base64'|'blob'} type    选中的图片返回类型（默认 blob）
 */

function selectFile(callback, type) {
  var input = inputSelectFile;

  var main = function main() {
    if (input.files) {
      var file = input.files[0];

      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG|webp)$/.test(file.name)) {// alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种');
      } else {
        var reader = new FileReader();

        reader.onload = function (e) {
          var data; // 把Array Buffer转化为blob 如果是base64不需要

          if (_typeof(e.target.result) === "object") {
            data = window.URL.createObjectURL(new Blob([e.target.result]));
          } else {
            data = e.target.result;
          }

          callback(data);
        };

        if (type == "base64") {
          // 转化为 base64
          reader.readAsDataURL(file);
        } else {
          // 转化为 blob
          reader.readAsArrayBuffer(file);
        }
      }
    }

    console.log(input); //  有时候回触发多次回调，所以要添加一个&&判断是否存在。

    input && document.body.removeChild(input);
    inputSelectFile = null;
    input = null;
  };

  if (!inputSelectFile) {
    inputSelectFile = input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/jpg,image/png,image/webp";
    input.style.display = "none"; // input.id =

    document.body.appendChild(input);
    input.addEventListener("change", main);
  }

  input.click();
}

CanvasRenderingContext2D.prototype.wrapText = function (text, x, y) {
  var props = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  if (typeof text != "string" || typeof x != "number" || typeof y != "number") {
    return;
  }

  var maxWidth = props.maxWidth,
      lineHeight = props.lineHeight;
  var context = this;
  var canvas = context.canvas;

  if (!maxWidth || maxWidth <= 0) {
    maxWidth = canvas && canvas.width || 300;
  }

  if (!lineHeight || lineHeight <= 0) {
    lineHeight = canvas && parseInt(window.getComputedStyle(canvas).lineHeight) || parseInt(window.getComputedStyle(document.body).lineHeight);
  } // 字符分隔为数组


  var arrText = text.split("");
  var line = "";

  for (var n = 0; n < arrText.length; n++) {
    var testLine = line + arrText[n];
    var testWidth = context.measureText(testLine).width;

    if (testWidth >= maxWidth && n > 0) {
      context.fillText(line, x, y); // context.strokeText(line, x, y);

      line = arrText[n];
      y += lineHeight;
    } else {
      line = testLine;
    }
  }

  context.fillText(line, x, y); // context.strokeText(line, x, y);
};
