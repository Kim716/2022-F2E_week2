"use strict";
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://mozilla.github.io/pdf.js/build/pdf.worker.js";
const base64Prefix = "data:application/pdf;base64,";
// const pdf = new jsPDF();

// --- DATA --- //
const pdfFile = localStorage.getItem("file");

// --- DOM nodes --- //

// --- FUNCTIONS --- //
// FUNCTION 生出 PDF 畫面
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

// FUNCTION 讓 PDF 變成畫布的背景
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

// FN-3
const canvas1 = new fabric.Canvas("forPDF-1");

async function pdfTurnCanvas(data) {
  canvas1.requestRenderAll();
  const pdfData = await renderPDF(data);
  const pdfImage = await pdfToImage(pdfData);

  canvas1.setWidth(pdfImage.width / window.devicePixelRatio);
  canvas1.setHeight(pdfImage.height / window.devicePixelRatio);

  canvas1.setBackgroundImage(pdfImage, canvas1.renderAll.bind(canvas1));
}

// --- EVENT LISTENER --- //

// --- EXECUTE --- //
pdfTurnCanvas(pdfFile);
