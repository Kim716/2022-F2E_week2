"use strict";

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

// EL-4 當 PDF 上傳完畢，跳轉頁面
uploadPDF.addEventListener("change", () => {
  window.location.assign("./pdf.html");
});
