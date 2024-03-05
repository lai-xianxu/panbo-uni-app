<template>
  <view class="draw-lock">
    <canvas
      @touchstart="touchstart"
      @touchmove="touchmove"
      @touchend="touchend"
      :disable-scroll="disableScroll"
      :style="{ width: size + 'px', height: size + 'px' }"
      :canvas-id="canvasId"
    ></canvas>
  </view>
</template>

<script>
/**
 * look 手势解锁
 * @description 此组件一般用于手机屏幕解锁。
 * @tutorial https://www.uviewui.com/components/loadMore.html
 * @property {Boolean}	        disableScroll	当在 canvas 中移动时且有绑定手势事件时，禁止屏幕滚动以及下拉刷新（默认 true ）
 * @property {String | Number}	size			区域大小，单位px（默认 250 ）
 * @property {String}			activeColor		方块以及连线激活的颜色（默认 '#00a2dc' ）
 * @property {String}	        activeOutColor	方块激活外围的颜色（默认 '#a5d5e1' ）
 * @property {String}	        squareColor		未激活的方块颜色（默认 '#eeeeee' ）
 * @property {Object}			customScale		各项比例系数 ( 不建议修改 )
 * @property {String}			canvasId		canvas 的唯一标识（默认 'lookCanvas' ）
 * @event {Function} complete   手势滑动完成时触发
 * @example <s-look @complete="onComplete" />
 */
export default {
  name: 'draw-lock',
  props: {
    // 当在 canvas 中移动时且有绑定手势事件时，禁止屏幕滚动以及下拉刷新
    disableScroll: {
      type: Boolean,
      default: true,
    },
    // 初始化显示答案
    defaultValue: {
      type: Array,
      default: () => [],
    },
    // 区域大小
    size: {
      type: [String, Number],
      default: 250,
    },
    // 方块以及连线激活的颜色
    activeColor: {
      type: String,
      default: '#17BCEF',
    },
    // 方块激活外围的颜色
    activeOutColor: {
      type: String,
      default: '#378cfd',
    },
    // 未激活的方块颜色
    squareColor: {
      type: String,
      default: 'transparent',
    },
    // 外圆边框线大小
    borderWidth: {
      type: [String, Number],
      default: 1,
    },
    // 外圆边框线颜色
    borderColor: {
      type: String,
      default: '#cccccc',
    },
    // 外圆边框线颜色
    activeBorderColor: {
      type: String,
      default: '#17BCEF',
    },
    // 各项比例系数 ( 不建议修改 )
    customScale: {
      type: Object,
      default: () => {},
    },
    // canvas 的唯一标识
    canvasId: {
      type: String,
      default: 'lookCanvas',
    },
  },
  data() {
    // 区域大小的比例系数
    const scale = {
      // 方块半径的比例
      squareRadius: 5 / 250,
      // 方块区域的比例
      squreContainerRadius: 70 / 250,
      // 方块间隔比例
      squreInterval: 20 / 250,
      // 方块触摸激活半径的比例
      squreTouchRadius: 20 / 250,
      // 方块激活外圆半径比例
      squreOutRadius: 22 / 250,
      // 方块激活外圆边距比例
      squreOutPaddingRadius: 4 / 250,
      // 线条宽度比例
      lineWidth: 1 / 250,
      // 自定义系数
      ...this.customScale,
    };

    return {
      context: null,

      // 方格数组
      squareData: [],
      // 连接序号
      order: [],

      scale,
    };
  },
  computed: {
    squareRadius() {
      // 方块半径
      return parseInt(this.size * this.scale.squareRadius);
    },
    squareContainerRadius() {
      // 方块区域半径
      return parseInt((this.size * this.scale.squreContainerRadius) / 2);
    },
    squreInterval() {
      // 方块间的间隔距离
      return parseInt(this.size * this.scale.squreInterval);
    },
    squreTouchRadius() {
      // 方块触摸激活半径
      return parseInt(this.size * this.scale.squreTouchRadius);
    },
    squreOutRadius() {
      // 方块激活外圆半径
      return parseInt(this.size * this.scale.squreOutRadius);
    },
    squreOutPaddingRadius() {
      // 方块激活外圆半径
      return parseInt(this.size * this.scale.squreOutPaddingRadius);
    },
    lineWidth() {
      // 线条宽度
      return parseInt(this.size * this.scale.lineWidth);
    },
  },
  mounted() {
    this.context = uni.createCanvasContext(this.canvasId, this);
    this.initSquareData();
    this.defaultValue.forEach((value) => {
      this.squareData[value - 1].active = true;
      const x =
        (this.squareData[value - 1].startSquare[0] +
          this.squareData[value - 1].endSquare[0]) /
        2;
      const y =
        (this.squareData[value - 1].startSquare[1] +
          this.squareData[value - 1].endSquare[1]) /
        2;
      this.order.push({
        x,
        y,
        value,
      });
    });
    this.renderCanvas();
  },
  methods: {
    touchstart(e) {
      this.clearData();
      // 手指触摸动作开始
      const touche = e.touches[0];
      this.diffSquare(touche);
      this.renderCanvas();
    },
    touchmove(e) {
      // 手指触摸后移动
      const touche = e.touches[0];
      this.diffSquare(touche);
      this.renderCanvas(touche);
    },
    touchend() {
      // 手指触摸动作结束
      if (this.order.length > 0) {
        // 提交答案
        this.$emit(
          'complete',
          this.order.map((item) => item.value)
        );
      }
      setTimeout(() => {
        this.renderCanvas();
      });
      setTimeout(() => {
        this.clearData();
        this.renderCanvas();
				this.$emit('completeTimeout');
      }, 800);
    },
    clearData() {
      // 清除/重置 渲染数据
      this.order = [];
      this.squareData = [];
      this.initSquareData();
    },
    diffSquare({ x, y }) {
      // 比较点是否在方格里面
      this.squareData.some((item, index) => {
        if (
          item.startSquare[0] <= x &&
          x <= item.endSquare[0] &&
          item.startSquare[1] <= y &&
          y <= item.endSquare[1]
        ) {
          // 记录方块激活标志，并记录中心点
          item.active = true;
          const x = (item.startSquare[0] + item.endSquare[0]) / 2;
          const y = (item.startSquare[1] + item.endSquare[1]) / 2;

          const isFlag = this.order.some((or) => or.x == x && or.y == y);
          if (!isFlag) {
            this.order.push({
              x,
              y,
              value: index + 1,
            });
          }
          return true;
        }
      });
    },
    initSquareData() {
      // 初始化方格数组
      for (let i = 0; i < 9; i++) {
        // 第 几 行
        const row = parseInt(i / 3) + 1;

        // 一个方块区域直径加一个方块间隔
        const groupDistance =
          this.squreInterval + this.squareContainerRadius * 2;
        // 左右两边剩余的间隔距离 ( 比例系数不满足下可以居中 )
        const surplusDistance =
          (this.size -
            (this.squreInterval * 2 + this.squareContainerRadius * 2 * 3)) /
          2;

        const startX =
          (i % 3) * groupDistance +
          (this.squareContainerRadius - this.squreTouchRadius) +
          surplusDistance;
        const startY =
          (row - 1) * groupDistance +
          (this.squareContainerRadius - this.squreTouchRadius) +
          surplusDistance;
        const endX =
          (i % 3) * groupDistance +
          (this.squareContainerRadius + this.squreTouchRadius) +
          surplusDistance;
        const endY =
          (row - 1) * groupDistance +
          (this.squareContainerRadius + this.squreTouchRadius) +
          surplusDistance;

        this.squareData.push({
          // 是否被选中
          active: false,
          startSquare: [startX, startY],
          endSquare: [endX, endY],
        });
      }
    },
    renderCanvas(touche) {
      // 绘制方块颜色
      this.squareData.forEach((item) => {
        if (item.active) {
          // 画激活外圆边框线
          // 设置填充颜色
          this.context.setFillStyle(this.activeBorderColor);
          this.context.beginPath();
          this.context.arc(
            (item.startSquare[0] + item.endSquare[0]) / 2,
            (item.startSquare[1] + item.endSquare[1]) / 2,
            this.squreOutRadius + +this.borderWidth,
            0,
            2 * Math.PI
          );
          this.context.fill();
          this.context.closePath();

          // 画激活外圆边距 固定白色和背景同色以达到隐藏效果
          this.context.setFillStyle('#fff');
          this.context.beginPath();
          this.context.arc(
            (item.startSquare[0] + item.endSquare[0]) / 2,
            (item.startSquare[1] + item.endSquare[1]) / 2,
            this.squreOutRadius,
            0,
            2 * Math.PI
          );
          this.context.fill();
          this.context.closePath();

          // 画激活外圆
          // 设置填充颜色
          this.context.setFillStyle(this.activeOutColor);
          this.context.beginPath();
          this.context.arc(
            (item.startSquare[0] + item.endSquare[0]) / 2,
            (item.startSquare[1] + item.endSquare[1]) / 2,
            this.squreOutRadius - this.squreOutPaddingRadius,
            0,
            2 * Math.PI
          );
          this.context.fill();
          this.context.closePath();

          // 设置填充颜色
          this.context.setFillStyle(this.activeColor);
        } else {
          // 画激活外圆边框线
          // 设置填充颜色
          this.context.setFillStyle(this.borderColor);
          this.context.beginPath();
          this.context.arc(
            (item.startSquare[0] + item.endSquare[0]) / 2,
            (item.startSquare[1] + item.endSquare[1]) / 2,
            this.squreOutRadius + +this.borderWidth,
            0,
            2 * Math.PI
          );
          this.context.fill();
          this.context.closePath();

          // 画激活外圆 固定白色和背景同色以达到隐藏效果
          this.context.setFillStyle('#fff');
          this.context.beginPath();
          this.context.arc(
            (item.startSquare[0] + item.endSquare[0]) / 2,
            (item.startSquare[1] + item.endSquare[1]) / 2,
            this.squreOutRadius,
            0,
            2 * Math.PI
          );
          this.context.fill();
          this.context.closePath();
        }

        this.context.beginPath();
        this.context.arc(
          (item.startSquare[0] + item.endSquare[0]) / 2,
          (item.startSquare[1] + item.endSquare[1]) / 2,
          this.squareRadius,
          0,
          2 * Math.PI
        );
        this.context.fill();
        this.context.closePath();
      });

      // 绘制连线路径
      if (touche && this.order[this.order.length - 1]) {
        const { x: startX, y: startY } = this.order[this.order.length - 1];
        const { x: endX, y: endY } = touche;
        this.context.beginPath();
        // 设置边框颜色
        this.context.setStrokeStyle(this.activeColor);
        // 设置连线宽度
        this.context.setLineWidth(this.lineWidth);
        this.context.moveTo(startX, startY);
        this.context.lineTo(endX, endY);
        this.context.stroke();
        this.context.closePath();
      }

      // 绘制连线
      this.order.forEach((item, index) => {
        if (!this.order[index - 1]) return;
        const { x: startX, y: startY } = this.order[index - 1];
        const { x: endX, y: endY } = item;
        this.context.beginPath();
        // 设置边框颜色
        this.context.setStrokeStyle(this.activeColor);
        // 设置连线宽度
        this.context.setLineWidth(this.lineWidth);
        this.context.moveTo(startX, startY);
        this.context.lineTo(endX, endY);
        this.context.stroke();
        this.context.closePath();
      });

      this.context.draw();
    },
  },
};
</script>
