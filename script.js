"use strict";
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://mozilla.github.io/pdf.js/build/pdf.worker.js";
const base64Prefix = "data:application/pdf;base64,";

// --- DOM nodes --- //
const body = document.querySelector("body");
const startBtn = document.querySelector(".start-btn");
const startPageModal = document.querySelector(".modal-background");
const closeBtn = document.querySelector(".close-btn");
const outerModal = document.querySelector(".modal-background");
const uploadPDF = document.querySelector("#uploadPDF");

// --- FUNCTION --- //
// FN1 開啟、隱藏 class
function toggleHide(target) {
  target.classList.toggle("hide");
}

// FN2 轉檔
function readBlob(blod) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", reject);
    // 以 data: URL 格式（base64 編碼）的字串來表示讀入的資料內容。
    reader.readAsDataURL(blod);
  });
}

// --- EVENT LISTENER --- //
// EL-1 啟動、關閉 step1-modal
body.addEventListener("click", (e) => {
  if (e.target.matches(".toggle-step1-modal")) {
    toggleHide(startPageModal);
  }
});

// EL-2 當 PDF 上傳完畢，讓 PDF 轉檔、儲存、跳轉頁面
const canvas1 = new fabric.Canvas("forPDF-1");
uploadPDF.addEventListener("change", async (e) => {
  const pdfFile = await readBlob(e.target.files[0]);
  localStorage.setItem("file", pdfFile);
  window.location.assign("./pdf.html");
});
