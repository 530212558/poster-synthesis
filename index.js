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
            //??????????????????
            var scale = _this.getDistance(touche[0].clientY, touche[1].clientY) / _this.getDistance(_this.startClientY[0], _this.startClientY[1]);

            _this.lastScale = _this.lastScale == 1 ? scale : _this.lastScale;
            var scaleBase = scale / _this.lastScale;

            if (_this.ActivateZoom && _this.lastScale < scale) {
              // this.scale += 0.1;
              _this.scale *= scaleBase;

              if (_this.scale >= _this.maxScale) {
                _this.scale = _this.maxScale;
              } // console.log("?????????", this.scale);


              _this.setSelectImgId();
            } else if (_this.ActivateZoom && _this.lastScale > scale) {
              // this.scale -= 0.1;
              _this.scale *= scaleBase;

              if (_this.scale <= _this.minScale) {
                _this.scale = _this.minScale;
              } // console.log("?????????", this.scale);


              _this.setSelectImgId();
            } // console.log('scale: ',scale, 'lastScale:',this.lastScale,'scale/lastScale:',scale/this.lastScale)
            // console.log('scale/lastScale:',scale/this.lastScale,scale,this.lastScale);


            _this.lastScale = scale;
          });
        };

        timeCallBack(touches);
      }

      _this.ActivateZoom = true; //????????????

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
          lineHeight = lineHeight * _this.ratio; // ?????????ctx.font="20px '????????????'";

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
      console.error("posterSynthesis???selectImg???contaienr ???????????????");
      return false;
    } else if (props.contaienr.tagName != "DIV") {
      console.error("posterSynthesis???????????? contaienr ?????? div ??????");
      return false;
    } else if (props.imgListContainer && props.imgListContainer.tagName != "DIV" || props.textListContainer && props.textListContainer.tagName != "DIV") {
      console.error("posterSynthesis???????????? imgListContainer,textListContainer ?????? div ??????");
      return false;
    }

    this.getSelectImg = props.selectImgId;

    try {
      this.getSelectImg.setAttribute("crossOrigin", "Anonymous");
    } catch (e) {
      console.error("crossOrigin:Anonymous ???????????????????????????==>", e);
    }
    /**????????????????????? */


    this.HD = props.HD || false;
    /**???????????????????????? */

    this.imgListContainer = props.imgListContainer || null;
    /**?????????????????? */

    this.imgList = [];
    /**???????????????????????? */

    this.textListContainer = props.textListContainer || null;
    /**?????????????????? */

    this.textList = [];
    /**?????????????????? */

    this.ActivateZoom = false;
    /**????????????????????? */

    this.lastScale = 1;
    /**?????????????????? */

    this.scale = 1;
    /**?????????????????? */

    this.minScale = props.minScale || 0.4;
    this.minScale = this.minScale < 0.1 ? this.minScale : this.minScale;
    /**?????????????????? */

    this.maxScale = props.maxScale || 3;
    /** ???????????????????????? X */

    this.onStartClientX = 0;
    /** ???????????????????????? Y */

    this.onStartClientY = 0;
    /** ????????????????????? ???????????? X??? */

    this.startClientX = [0, 0];
    /** ????????????????????? ???????????? Y??? */

    this.startClientY = [0, 0];
    /**?????????????????? */

    this.translateX = 0;
    this.translateY = 0;
    /**?????????????????????????????????????????????CSS????????????????????? */

    this.ratio = 1;
    this.contaienr = props.contaienr;
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    /**????????????????????? */

    this.contaienr.addEventListener("touchstart", this.onTouchstart, false);
    /**??????????????????????????????????????? */

    this.contaienr.addEventListener("touchmove", this.onTouchmove, false);
    /**??????????????????????????????????????? */

    this.contaienr.addEventListener("touchend", this.onTouchend, false);

    if (this.imgListContainer) {
      var imgList = this.imgList = this.imgListContainer.getElementsByClassName("poster_img") || [];

      for (var i = 0; i < imgList.length; i++) {
        try {
          imgList[i].setAttribute("crossOrigin", "Anonymous");
        } catch (e) {
          console.error("crossOrigin:Anonymous ???????????????????????????==>", e);
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
    /**????????????????????? */

  }, {
    key: "getDistance",
    value:
    /**??????????????????????????? */
    function getDistance(p1, p2) {
      var x = p2 - p1,
          y = p2 - p1;
      return Math.sqrt(x * x + y * y);
    }
    /**
     * @param {HTMLElement} context
     * @returns {number} ???????????????????????????????????????????????????CSS?????????????????????
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
     * @returns {Object} x,y,width,height ?????????????????????????????????
     */

  }, {
    key: "getClientRect",
    value: function getClientRect(target) {
      // getBoundingClientRect(target) ??????????????????
      var contaienr = this.contaienr;
      var x = target.getBoundingClientRect().x - contaienr.getBoundingClientRect().x,
          y = target.getBoundingClientRect().y - contaienr.getBoundingClientRect().y,
          width = target.getBoundingClientRect().width,
          height = target.getBoundingClientRect().height; // ????????????????????????

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
     * @param { (call:string)=>void } call ????????????????????? base64 ??????????????????
     */

  }]);

  return Poster;
}();
/**
 *
 * @param {string} src  ??????
 * @param {Function} callback  ????????????
 * @returns {HTMLElement} ???????????? images ??????
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
      console.error("crossOrigin:Anonymous ???????????????????????????==>", e);
      reject(e);
    }
  });
}
/*
 * ?????? input ?????????
 * */


var inputSelectFile = null;
/**
 *
 * @param {function} callback   ????????????
 * @param {'base64'|'blob'} type    ???????????????????????????????????? blob???
 */

function selectFile(callback, type) {
  var input = inputSelectFile;

  var main = function main() {
    if (input.files) {
      var file = input.files[0];

      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG|webp)$/.test(file.name)) {// alert('?????????????????????.gif,jpeg,jpg,png,bmp????????????');
      } else {
        var reader = new FileReader();

        reader.onload = function (e) {
          var data; // ???Array Buffer?????????blob ?????????base64?????????

          if (_typeof(e.target.result) === "object") {
            data = window.URL.createObjectURL(new Blob([e.target.result]));
          } else {
            data = e.target.result;
          }

          callback(data);
        };

        if (type == "base64") {
          // ????????? base64
          reader.readAsDataURL(file);
        } else {
          // ????????? blob
          reader.readAsArrayBuffer(file);
        }
      }
    }

    console.log(input); //  ??????????????????????????????????????????????????????&&?????????????????????

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
  } // ?????????????????????


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
