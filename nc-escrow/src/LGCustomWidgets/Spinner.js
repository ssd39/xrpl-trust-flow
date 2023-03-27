import { LGraphNode, LiteGraph } from "litegraph.js";
const SpinnerWidget = {
  name: "spinner",
  type: "spinner",
  lastAngle: 0,
  isStarted: false,
  // other properties will be provided by the parent node
};

SpinnerWidget.computeSize = function (width) {
  // return the desired size of the spinner widget
  return [30, 30]; // for example, 30x30 pixels
};

/**
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {LGraphNode} node
 * @param {number} width
 * @param {number} posY
 * @param {number} height
 */

SpinnerWidget.draw = function (ctx, node, width, posY, height) {
  if (!this.isStarted) {
    this.isStarted = true;

    let superCb = node.onRemoved;
    if(superCb){
        superCb = superCb.bind(node)
    }

    node.onRemoved = () => {
      if (superCb) {
        superCb();
      }
      this.isStarted = false;
    };
    const redraw = () => {
      if (this.isStarted) {
        node.setDirtyCanvas(true, true);
        window.requestAnimationFrame(redraw);
      }
    };
    window.requestAnimationFrame(redraw);
  }
  // draw a spinning disk in the center of the widget
  const centerX = node.size[0] / 2;
  const centerY = node.size[1] / 2;
  const radius = Math.min(node.size[0] * 0.1);

  const startAngle = 0.5 * Date.now() % 360;
  const endAngle = startAngle + 50;

  ctx.beginPath();
  ctx.arc(
    centerX,
    centerY,
    radius,
    (startAngle * Math.PI) / 180,
    (endAngle * Math.PI) / 180
  );
  ctx.lineWidth = 5;
  ctx.strokeStyle = "#AAA";
  ctx.stroke();
};

export default SpinnerWidget;
