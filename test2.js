"use strict";
// 用 CDN 方式引入，需先設定環境
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://mozilla.github.io/pdf.js/build/pdf.worker.js";

// --- DOM nodes --- //
const canvas = document.querySelector("#forPDF");
const ctx = canvas.getContext("2d");
const selectPDF = document.querySelector(".selectPDF");

// --- FUNCTION --- //
// FUNCTION render PDF
async function renderPDF(data) {
  const pdfDoc = await pdfjsLib.getDocument(data).promise;
  const pdfPage = await pdfDoc.getPage(1);
  const viewport = pdfPage.getViewport({ scale: 1 });

  // 設定 canvas 大小和 PDF 一樣
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  pdfPage.render({
    canvasContext: ctx,
    viewport, // TODO viewport: viewport
  });
}

// --- EVENT LISTENER --- //
// EVENT LISTENER 監聽檔案的傳入
selectPDF.addEventListener("change", (event) => {
  // console.log(event.target.files);
  // print: FileList {0: File, length: 1}
  if (event.target.files[0] === undefined) return;

  const file = event.target.files[0];
  console.log(file);
  // 產生 fileReader 物件
  const fileReader = new FileReader();
  fileReader.readAsArrayBuffer(file);
  fileReader.addEventListener("load", () => {
    // 取出 readAsArrayBuffer 產生的結果：ArrayBuffer，並用來渲染
    const typedarray = new Uint8Array(fileReader.result);
    renderPDF(typedarray);
  });
});
