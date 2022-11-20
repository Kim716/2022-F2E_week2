"use strict";
const base64Prefix = "data:application/pdf;base64,";

// --- DOM nodes --- //
const startBtn = document.querySelector(".start-btn");
const startPageModal = document.querySelector(".modal-background");
const closeBtn = document.querySelector(".close-btn");
const outerModal = document.querySelector(".modal-background");
const uploadPDF = document.querySelector("#uploadPDF");

// --- FUNCTION --- //
// FN-1
function showModal(modal) {
  modal.classList.remove("hide");
}

// FN-2
function closeModal(modal) {
  modal.classList.add("hide");
}

// FN-3 轉檔
function readBlob(blod) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", reject);
    // 以 data: URL 格式（base64 編碼）的字串來表示讀入的資料內容。
    reader.readAsDataURL(blod);
  });
}

// FN-4 儲存 PDF 到 local
async function storePDFdata(pdfData) {
  // 將檔案處理成 base64
  pdfData = await readBlob(pdfData);

  // 刪除 base64 的前綴，並解碼
  const data = atob(pdfData.substring(base64Prefix.length));
  localStorage.setItem("file", JSON.stringify(data));
}

// --- EVENT LISTENER --- //
// EL-1
startBtn.addEventListener("click", (e) => {
  showModal(startPageModal);
});

// EL-2
closeBtn.addEventListener("click", (e) => {
  closeModal(startPageModal);
});

// EL-3 點擊 modal 外圍可以關掉
outerModal.addEventListener("click", (e) => {
  if (e.target.matches(".modal-background")) {
    closeModal(startPageModal);
  }
});

// EL-4 當 PDF 上傳完畢，將檔案存在local，並跳轉頁面
uploadPDF.addEventListener("change", async (e) => {
  if (e.target.files[0] === undefined) return;

  await storePDFdata(e.target.files[0]);
  window.location.assign("./pdf.html");
});
