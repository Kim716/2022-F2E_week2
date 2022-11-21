"use strict";

// --- DOM nodes --- //
const canvas = document.querySelector("#signature-canvas");
const showImage = document.querySelector(".show-img");
const clearBtn = document.querySelector(".clear-btn");
const saveBtn = document.querySelector(".save-btn");

// --- CANVAS set --- //
const ctx = canvas.getContext("2d");
let isPainting = false;

ctx.lineWidth = 4;
ctx.lineCap = "round";

// --- FUNCTION --- //
// FUNCTION 取得滑鼠或手指在canvas上的x,y位置
function getPaintPosition(event) {
  const canvasSize = canvas.getBoundingClientRect();
  console.log(event);
  console.log(canvasSize);
  console.log(event.clientX, event.clientY, canvasSize.x, canvasSize.y);

  return {
    x: event.clientX - canvasSize.x,
    y: event.clientY - canvasSize.y,
  };
}

// FUNCTION 開啟畫圖狀態
function startPosition(event) {
  event.preventDefault(); //TODO
  isPainting = true;
}

// FUNCTION 結束畫圖狀態
function endPosition(event) {
  isPainting = false;
  // 產生新路徑，為下一段繪圖做準備
  // 不能擺在 draw() 裡，這樣線會不連貫，會一直開啟新路徑
  // 擺在 startPosition() 可行，但不知道為何會選擇這裡
  ctx.beginPath();
}

// FUNCTION 畫圖
function draw(event) {
  if (!isPainting) return;

  const paintPosition = getPaintPosition(event);

  ctx.lineTo(paintPosition.x, paintPosition.y);
  ctx.stroke();
}

// FUNCTION 清空畫面
function resetCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// FUNCTION 儲存圖片
function saveImage() {
  const newImg = canvas.toDataURL("image/png");
  showImage.src = newImg;
  localStorage.setItem("img", newImg);
}

// --- EVENT LISTENER --- //
// EVENT LISTENER 畫圖相關
canvas.addEventListener("mousedown", startPosition);
canvas.addEventListener("mouseup", endPosition);
canvas.addEventListener("mouseleave", endPosition);
canvas.addEventListener("mousemove", draw);

// EVENT LISTENER 清空畫面
clearBtn.addEventListener("click", resetCanvas);

// EVENT LISTENER 儲存圖片
saveBtn.addEventListener("click", saveImage);
