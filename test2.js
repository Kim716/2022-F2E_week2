"use strict";
// 用 CDN 方式引入，需先設定環境
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://mozilla.github.io/pdf.js/build/pdf.worker.js";

const base64Prefix = "data:application/pdf;base64,";
const pdf = new jsPDF();

// --- DOM nodes --- //
// const canvas = document.querySelector("#forPDF");
// const ctx = canvas.getContext("2d");
const selectPDF = document.querySelector(".selectPDF");
const sign = document.querySelector(".sign");
const downloadBtn = document.querySelector(".download");

// --- FUNCTION --- //
// FUNCTION render PDF
// async function renderPDF(data) {
//   const pdfDoc = await pdfjsLib.getDocument(data).promise;
//   const pdfPage = await pdfDoc.getPage(1);
//   const viewport = pdfPage.getViewport({ scale: 1 });

//   // 設定 canvas 大小和 PDF 一樣
//   canvas.width = viewport.width;
//   canvas.height = viewport.height;

//   pdfPage.render({
//     canvasContext: ctx,
//     viewport, // TODO viewport: viewport
//   });
// }

// FUNCTION 轉檔
function readBlob(blod) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", reject);
    // 以 data: URL 格式（base64 編碼）的字串來表示讀入的資料內容。
    reader.readAsDataURL(blod);
  });
}

// FUNCTION 生出 PDF 畫面
async function renderPDF(pdfData) {
  // 將檔案處理成 base64
  pdfData = await readBlob(pdfData);

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

// const canvas = new fabric.Canvas('canvas');
const canvas = new fabric.Canvas("forPDF");

// --- EVENT LISTENER --- //
// EVENT LISTENER 監聽檔案的傳入
// selectPDF.addEventListener("change", (event) => {
//   // console.log(event.target.files);
//   // print: FileList {0: File, length: 1}
//   if (event.target.files[0] === undefined) return;

//   const file = event.target.files[0];
//   // 產生 fileReader 物件
//   const fileReader = new FileReader();
//   fileReader.readAsArrayBuffer(file);
//   fileReader.addEventListener("load", () => {
//     // 取出 readAsArrayBuffer 產生的結果：ArrayBuffer，並用來渲染
//     const typedarray = new Uint8Array(fileReader.result);
//     renderPDF(typedarray);
//   });
// });

// EVENT LISTENER 監聽檔案的傳入
console.log(canvas);
selectPDF.addEventListener("change", async (event) => {
  // console.log(readBlob(event.target.files[0]));
  canvas.requestRenderAll();
  const pdfData = await renderPDF(event.target.files[0]);
  const pdfImage = await pdfToImage(pdfData);
  console.log(pdfImage);

  canvas.setWidth(pdfImage.width / window.devicePixelRatio);
  canvas.setHeight(pdfImage.height / window.devicePixelRatio);

  canvas.setBackgroundImage(pdfImage, canvas.renderAll.bind(canvas));
});

// EVENT LISTENER 點擊圖片可以擺放他
sign.addEventListener("click", () => {
  if (!sign.src) return;

  fabric.Image.fromURL(sign.src, function (img) {
    // 設定簽名出現的位置還有大小，後續可以調整
    img.top = 400;
    img.scaleX = 0.5;
    img.scaleY = 0.5;
    canvas.add(img);
  });
});

// EVENT LISTENER 點擊下載即可下載
downloadBtn.addEventListener("click", () => {
  // 將 canvas 存為圖片
  const image = canvas.toDataURL("image/png");
  // 設定圖片在 PDF 的位置及大小
  const width = pdf.internal.pageSize.width;
  const height = pdf.internal.pageSize.height;
  pdf.addImage(image, "png", 0, 0, width, height);

  //為檔案取名並下載
  pdf.save("download.pdf");
});

// --- EXECUTE --- //
// 載入頁面時，要呈現已經有的簽名
if (localStorage.getItem("img")) {
  sign.src = localStorage.getItem("img");
}
