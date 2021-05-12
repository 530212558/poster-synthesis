export class Poster {
  constructor(props) {
    if (!props.selectImgId || !props.contaienr) {
      console.error("posterSynthesis：selectImg，contaienr 是必传参数");
      return false;
    } else if (props.contaienr.tagName != "DIV") {
      console.error("posterSynthesis：传入的 contaienr 不是 div 元素");
      return false;
    } else if (
      (props.imgListContainer && props.imgListContainer.tagName != "DIV") ||
      (props.textListContainer && props.textListContainer.tagName != "DIV")
    ) {
      console.error(
        "posterSynthesis：传入的 imgListContainer,textListContainer 不是 div 元素"
      );
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
    this.minScale = props.minScale||0.4;
    this.minScale = this.minScale<0.1?this.minScale:this.minScale;
    /**最大缩放尺寸 */
    this.maxScale = props.maxScale||3;
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
      let imgList = (this.imgList =
        this.imgListContainer.getElementsByClassName("poster_img") || []);
      for (let i = 0; i < imgList.length; i++) {
        try {
          imgList[i].setAttribute("crossOrigin", "Anonymous");
        } catch (e) {
          console.error("crossOrigin:Anonymous 设置出错请允许跨域==>", e);
        }
      }
    }
    if (this.textListContainer) {
      this.textList =
        this.textListContainer.getElementsByClassName("poster_text") || [];
    }

    const canvas = this.canvas;
    canvas.width = this.contaienr.offsetWidth;
    canvas.height = this.contaienr.offsetHeight;
    if (this.HD) {
      const ratio = (this.ratio = this.getPixelRatio(this.ctx));
      canvas.width *= ratio;
      canvas.height *= ratio;
    }
  }
  resetSelectImg(src) {
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
  setSelectImgId() {
    this.getSelectImg.style.transform = `translateX(${this.translateX}px) translateY(${this.translateY}px) scale(${this.scale})`;
  }
  /**手指按到屏幕上 */
  onTouchstart = (event) => {
    const touches = event.touches;
    if (touches.length == 1) {
      this.onStartClientX = touches[0].clientX;
      this.onStartClientY = touches[0].clientY;
    } else if (touches.length >= 2) {
      for (let index = 0; index < touches.length; index++) {
        const element = touches[index];
        this.startClientY[index] = element.clientX;
      }
    }
  };
  /**手指在屏幕上移动的时候触发 */
  onTouchmove = (event) => {
    const touches = event.touches;
    if (touches.length == 1) {
      if (this.ActivateZoom) {
        const x = touches[0].clientX - this.onStartClientX;
        const y = touches[0].clientY - this.onStartClientY;

        this.onStartClientX = touches[0].clientX;
        this.onStartClientY = touches[0].clientY;

        this.translateX += x;
        this.translateY += y;
        this.setSelectImgId();
      } else {
        this.onStartClientX = touches[0].clientX;
        this.onStartClientY = touches[0].clientY;
      }
    } else if (touches.length >= 2) {
      const timeCallBack = (touche) => {
        window.requestAnimationFrame(()=>{
          //得到缩放比例
          const scale =
              this.getDistance(touche[0].clientY, touche[1].clientY) /
              this.getDistance(this.startClientY[0], this.startClientY[1]);
          this.lastScale = this.lastScale==1?scale:this.lastScale;
          const scaleBase = scale/this.lastScale;
          if (this.ActivateZoom && this.lastScale < scale) {
            // this.scale += 0.1;
            this.scale *= scaleBase;
            if (this.scale >= this.maxScale) {
              this.scale = this.maxScale;
            }
            // console.log("放大：", this.scale);
            this.setSelectImgId();
          } else if (this.ActivateZoom && this.lastScale > scale) {
            // this.scale -= 0.1;
            this.scale *= scaleBase;
            if (this.scale <= this.minScale) {
              this.scale = this.minScale;
            }
            // console.log("缩小：", this.scale);
            this.setSelectImgId();
          }
          // console.log('scale: ',scale, 'lastScale:',this.lastScale,'scale/lastScale:',scale/this.lastScale)
          // console.log('scale/lastScale:',scale/this.lastScale,scale,this.lastScale);
          this.lastScale = scale;

        })
      }
      timeCallBack(touches);
    }
    this.ActivateZoom = true;

    //阻止滚动
    event.preventDefault();
  };
  /**手指从屏幕上拿起的时候触发 */
  onTouchend = () => {
    this.ActivateZoom = false;
    this.lastScale = 1;
  };
  /**勾股定理的一个方法 */
  getDistance(p1, p2) {
    let x = p2 - p1,
      y = p2 - p1;
    return Math.sqrt(x * x + y * y);
  }
  /**
   * @param {HTMLElement} context
   * @returns {number} 返回当前显示设备的物理像素分辨率与CSS像素分辨率之比
   */
  getPixelRatio(context) {

    let backingStore =
      context.backingStorePixelRatio ||
      context.webkitBackingStorePixelRatio ||
      context.mozBackingStorePixelRatio ||
      context.msBackingStorePixelRatio ||
      context.oBackingStorePixelRatio ||
      context.backingStorePixelRatio ||
      1;
    backingStore = backingStore > 1 ? backingStore : 1;
    return (window.devicePixelRatio || 1) / backingStore;
  }
  /**
   * @param {HTMLElement} target
   * @returns {Object} x,y,width,height 返回相对于父元素的坐标
   */
  getClientRect(target) {
    // getBoundingClientRect(target) 相对于可视区
    const contaienr = this.contaienr;
    let x =
        target.getBoundingClientRect().x - contaienr.getBoundingClientRect().x,
      y =
        target.getBoundingClientRect().y - contaienr.getBoundingClientRect().y,
      width = target.getBoundingClientRect().width,
      height = target.getBoundingClientRect().height;

    // 处理图片模糊问题
    if (this.HD) {
      const ratio = this.ratio;
      if (ratio >= 1) {
        x = x * ratio;
        y = y * ratio;
        width = width * ratio;
        height = height * ratio;
      }
    }
    return {
      x,
      y,
      width,
      height,
    };
  }
  /**
   *
   * @param { (call:string)=>void } call 回调函数，返回 base64 的图片格式。
   */
  startDrawing = (call) => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawImage(this.getSelectImg);

    if (this.imgList.length) {
      let imgList = this.imgList;
      for (let i = 0; i < imgList.length; i++) {
        this.drawImage(imgList[i]);
      }
    }

    if (this.textList.length) {
      this.ctx.save();
      let textList = this.textList;
      for (let i = 0; i < textList.length; i++) {
        const { x, y, width } = this.getClientRect(textList[i]);
        // console.log(textList[i].style.fontSize,textList[i].style)
        let { fontSize, fontFamily, lineHeight, color } = textList[i].style;
        fontSize = fontSize ? parseInt(fontSize) : 12;
        fontFamily = fontFamily
          ? fontFamily
          : `STXihei, '华文细黑', 'Microsoft YaHei', '微软雅黑'`;
        lineHeight = lineHeight ? parseInt(lineHeight) : fontSize * 1.4;

        let u = navigator.userAgent;
        let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        let fontHeight = 0;
        if (!isIOS)
          fontHeight =
            fontSize > lineHeight
              ? 0
              : ((lineHeight - fontSize) / 2) * this.ratio;
        // console.log(fontHeight);

        fontSize = fontSize * this.ratio;
        lineHeight = lineHeight * this.ratio;

        // 示例：ctx.font="20px '微软雅黑'";
        this.ctx.font = `${fontSize}px ${fontFamily}`;
        this.ctx.fillStyle = color || "#000000";
        // this.ctx.strokeStyle = color;
        this.ctx.textBaseline = "top";
        // console.log(fontSize,fontFamily,lineHeight,color);

        this.ctx.wrapText(textList[i].innerText, x, y + fontHeight, {
          maxWidth: width,
          lineHeight: lineHeight,
        });
      }
      this.ctx.restore();
    }

    let poster = this.canvas.toDataURL("image/png", 1);
    call && call(poster);
  };
  /**
   * @param {HTMLImageElement} target
   */
  drawImage = (target) => {
    let { x, y, width, height } = this.getClientRect(target);
    this.ctx.drawImage(target, x, y, width, height);
  };
}

/**
 *
 * @param {string} src  路劲
 * @param {Function} callback  回调函数
 * @returns {HTMLElement} 返回一个 images 元素
 */
function createAnonymousImg(src, callback) {
  return new Promise((resovlve, reject) => {
    try {
      let img = document.createElement("img");
      img.setAttribute("crossOrigin", "Anonymous");
      img.src = src;
      img.onload = () => {
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
let inputSelectFile = null;

/**
 *
 * @param {function} callback   回调函数
 * @param {'base64'|'blob'} type    选中的图片返回类型（默认 blob）
 */
export function selectFile(callback, type) {
  let input = inputSelectFile;
  const main = () => {
    if (input.files) {
      let file = input.files[0];
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG|webp)$/.test(file.name)) {
        // alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种');
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          let data;
          // 把Array Buffer转化为blob 如果是base64不需要
          if (typeof e.target.result === "object") {
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
    // console.log(input);
    //  有时候回触发多次回调，所以要添加一个&&判断是否存在。
    input && document.body.removeChild(input);
    inputSelectFile = null;
    input = null;
  };
  if (!inputSelectFile) {
    inputSelectFile = input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/jpg,image/png,image/webp";
    input.style.display = "none";
    // input.id =
    document.body.appendChild(input);
    input.addEventListener("change", main);
  }
  input.click();
}

CanvasRenderingContext2D.prototype.wrapText = function (
  text,
  x,
  y,
  props = {}
) {
  if (typeof text != "string" || typeof x != "number" || typeof y != "number") {
    return;
  }
  let { maxWidth, lineHeight } = props;
  var context = this;
  var canvas = context.canvas;
  if (!maxWidth || maxWidth <= 0) {
    maxWidth = (canvas && canvas.width) || 300;
  }
  if (!lineHeight || lineHeight <= 0) {
    lineHeight =
      (canvas && parseInt(window.getComputedStyle(canvas).lineHeight)) ||
      parseInt(window.getComputedStyle(document.body).lineHeight);
  }
  // 字符分隔为数组
  var arrText = text.split("");
  var line = "";

  for (var n = 0; n < arrText.length; n++) {
    var testLine = line + arrText[n];
    var testWidth = context.measureText(testLine).width;
    if (testWidth >= maxWidth && n > 0) {
      context.fillText(line, x, y);
      // context.strokeText(line, x, y);
      line = arrText[n];
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
  // context.strokeText(line, x, y);
};