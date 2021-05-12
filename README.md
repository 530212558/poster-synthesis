# Public Component
## 下载依赖：
```node
    npm i poster-synthesis --save
```
##HTML

```HTML
    <div
      class="canvas-contaienr"
      id="canvasContaienr"
    >
      <!-- 部分手机下面，比如小米，SAMSUNG的noteII系列 只能设置行内 crossorigin="Anonymous" 才能不污染画布 -->
      <img
        crossorigin="Anonymous"
        src="https://static.xiongmaoboshi.com/cms_media/8170ae31893248f5aa413249d4e56d96.png"
        id="selectImgId"
        class="img"
        style="transform: translateX(0px) translateY(0px) scale(1)"
      />
      <div id="imgListContainer">
        <img
          crossorigin="Anonymous"
          src="https://business.xiongmaoboshi.com/dpshop/res/img/Pop01-2-1610333672775-322.png"
          class="poster_img poster_img_default"
        />
        <img
          crossorigin="Anonymous"
          src="https://user-gold-cdn.xitu.io/2019/12/3/16ecad05e04bdf0e?imageView2/0/w/1280/h/960/format/webp/ignore-error/1"
          class="poster_img qrcode"
          style="right: 25px; bottom: 54px"
        />
      </div>
      <div id="textListContainer">
        <span class="poster_text text-span"
          style="font-size: 12px;
          line-height: 18px;
          font-family: STXihei, '华文细黑', 'Microsoft YaHei', '微软雅黑';"
        >
          mmm4日，@张继科 立春发表新诗，被网友发现诗中暗藏“景甜”二字，随后@景甜 留言：
        </span>
        <span class="poster_text text-span"
          style="font-size: 12px;
          line-height: 18px;
          color: rgba(255,0,0,1);
          bottom: 98px;
          font-family: STXihei, '华文细黑', 'Microsoft YaHei', '微软雅黑';"
        >
         景甜 留言：
        </span>
      </div>
    </div>
```

##style

```css
      .canvas-contaienr {
        width: 100%;
        height: 558px;
        margin: 0 auto;
        margin-bottom: 25px;
        position: relative;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;

        background-size: 100% 100%;
        box-shadow: 0px 10px 17px 0px rgba(1, 169, 199, 0.26);
      }
      .canvas-contaienr img {
        -webkit-user-select: none;
        -ms-user-select: none;
        -moz-user-select: none;
        -khtml-user-select: none;
        user-select: none;
        /*禁止长按保存*/
        pointer-events: none;
      }
      .canvas-contaienr .img {
        max-width: 100%;
        height: auto;
        z-index: -1;
      }
      .canvas-contaienr .poster_img_default {
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
      .canvas-contaienr .poster_img {
        position: absolute;
      }
      .canvas-contaienr .qrcode {
        width: 85px;
        height: 85px;
      }
      .canvas-contaienr .poster_text {
        position: absolute;
      }
      .canvas-contaienr .text-span {
        left: 40px;
        bottom: 46px;
        width: 200px;
      }
```

##javaScript

```javascript
/**
    poster 是海报合成插件
    selectFile 是一个用js 实现的图片选择器
*/
import { Poster, selectFile } from 'poster-synthesis';
var getSelectImgId = document.getElementById("selectImgId");
var imgListContainer = document.getElementById("imgListContainer");
var textListContainer = document.getElementById("textListContainer");
var contaienr = document.getElementById("canvasContaienr");

var synthesis = new Poster({
  selectImgId: getSelectImgId,
  imgListContainer,
  textListContainer,
  contaienr,
  // 是否生成高清图（同时也会加大图片大小）
  HD: true,
  // 最小缩放比例(最小0.1)默认0.4
  minScale: 0.4,
  // 最大缩放比例默认3
  maxScale: 3,
});
// poster api
// 生成自定义海报。
synthesis.startDrawing((src) => {
    console.log(src);
});
// 更改前景图
synthesis.setBackgroundTemplate(
    "https://business.xiongmaoboshi.com/dpshop/res/img/Pop02-2-1610333691008-736.png"
);
// 重新选择合成图片
selectFile(function (src) {
    synthesis.resetSelectImg(src);
});
```
