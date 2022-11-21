"use strict";
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://mozilla.github.io/pdf.js/build/pdf.worker.js";
const base64Prefix = "data:application/pdf;base64,";
// const pdf = new jsPDF();

// --- DATA --- //
const pdfFile = localStorage.getItem("file");

// --- DOM nodes --- //
const hideBtn = document.querySelector(".hide-sidebar");
const showBtn = document.querySelector(".show-sidebar");
const leftSideBar = document.querySelector(".pdf-sidebar-left");
const leftPages = document.querySelector(".pdf-pages");
const centerPanel = document.querySelector(".show-pdf");
const modal1 = document.querySelector(".modal-1");
// DOM 簽名相關
// const drawSignBtn = document.querySelector(".draw-signature");
const showImage = document.querySelector(".show-img");
const clearBtn = document.querySelector(".clear-btn");
const saveBtn = document.querySelector(".save-btn");
const modal2 = document.querySelector(".modal-2");
const canvas1 = new fabric.Canvas("forPDF-1");

// 簽名的 canvas set
const canvasSign = document.querySelector("#signature-canvas");
const ctx = canvasSign.getContext("2d");
let isPainting = false;

ctx.lineWidth = 4;
ctx.lineCap = "round";

// --- FUNCTIONS 關於渲染出可以編輯的 PDF --- //
// FN1-1 生出 PDF 畫面
async function renderPDF(pdfData) {
  // 刪除 base64 的前綴，並解碼
  const data = atob(pdfData.substring(base64Prefix.length));

  // 抓取 PDF 第一頁
  const pdfDoc = await pdfjsLib.getDocument({ data }).promise;
  const pdfPage = await pdfDoc.getPage(1);

  // 設定尺寸&產生canvas
  const viewport = pdfPage.getViewport({ scale: window.devicePixelRatio });
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  // 設定 canvas 大小和 PDF 一樣
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const renderContext = {
    canvasContext: context, // 剛創建的canvas
    viewport, // TODO viewport: viewport
  };

  const renderTask = pdfPage.render(renderContext);

  // 回傳做好的 PDF canvas
  return renderTask.promise.then(() => canvas);
}

// FN1-2 讓 PDF 變成畫布的背景
async function pdfToImage(pdfData) {
  // 設定 PDF 轉成圖片時的比例
  const scale = 1 / window.devicePixelRatio;

  // 回傳圖片
  return new fabric.Image(pdfData, {
    id: "renderedPDF",
    scaleX: scale,
    scaleY: scale,
  });
}

// FN1-3
async function pdfTurnCanvas(data) {
  canvas1.requestRenderAll();
  const pdfData = await renderPDF(data);
  const pdfImage = await pdfToImage(pdfData);

  canvas1.setWidth(pdfImage.width / window.devicePixelRatio);
  canvas1.setHeight(pdfImage.height / window.devicePixelRatio);

  canvas1.setBackgroundImage(pdfImage, canvas1.renderAll.bind(canvas1));
}

// --- FUNCTIONS 關於繪製簽名--- //
// FN2-1 取得滑鼠或手指在canvas上的x,y位置
function getPaintPosition(e) {
  const canvasSize = canvasSign.getBoundingClientRect();

  return {
    x: e.clientX - canvasSize.x,
    y: e.clientY - canvasSize.y,
  };
}

// FN2-2 開啟畫圖狀態
function startPosition(e) {
  e.preventDefault(); //TODO
  isPainting = true;
}

// FN2-3 畫圖
function draw(e) {
  if (!isPainting) return;

  const paintPosition = getPaintPosition(e);

  ctx.lineTo(paintPosition.x, paintPosition.y);
  ctx.stroke();
}

// FN2-4 結束畫圖狀態
function endPosition(e) {
  isPainting = false;
  ctx.beginPath();
}

// FN2-5 清空畫面
function resetCanvas() {
  ctx.clearRect(0, 0, canvasSign.width, canvasSign.height);
}

// FN2-6 儲存圖片
function saveImage() {
  const newImg = canvasSign.toDataURL("image/png");
  showImage.src = newImg;
  localStorage.setItem("img", newImg);
}

// FN3 放置簽名
function addSignatureOnPDF(signatureImg) {
  fabric.Image.fromURL(signatureImg, function (img) {
    // 設定簽名出現的位置還有大小，後續可以調整
    img.top = 400;
    img.scaleX = 0.5;
    img.scaleY = 0.5;
    canvas1.add(img);
  });
}

// --- EVENT LISTENER --- //
// EL-1 隱藏/開啟左側欄
leftSideBar.addEventListener("click", (e) => {
  if (e.target.matches(".hide-sidebar") || e.target.matches(".show-sidebar")) {
    hideBtn.classList.toggle("hide");
    showBtn.classList.toggle("hide");
    leftPages.classList.toggle("hide");
    centerPanel.classList.toggle("show-pdf-grow");
  }
});

// EL-2 啟動畫圖版
modal1.addEventListener("click", (e) => {
  if (e.target.matches(".draw-signature")) {
    modal1.classList.toggle("hide");
    modal2.classList.toggle("hide");
  }
});

// EL-3 畫圖相關
canvasSign.addEventListener("mousedown", startPosition);
canvasSign.addEventListener("mouseup", endPosition);
canvasSign.addEventListener("mouseleave", endPosition);
canvasSign.addEventListener("mousemove", draw);

// EL-4 清空畫面
clearBtn.addEventListener("click", resetCanvas);

// EL-5 儲存圖片、並關閉繪圖
saveBtn.addEventListener("click", () => {
  saveImage();
  modal2.classList.add("hide");
});

// EL-6 點擊圖片可以擺放他
showImage.addEventListener("click", (e) => {
  const signatureImg = e.target.src;
  console.log(signatureImg);
  if (!signatureImg) return;
  addSignatureOnPDF(signatureImg);
});

// --- EXECUTE --- //
pdfTurnCanvas(pdfFile);
