/*
 * GioiThieu.js
 * Script JavaScript cho trang tĩnh cũ: GioiThieu.
 * Chèn chú thích giải thích mục đích chính của file.
 */

document.addEventListener("DOMContentLoaded", function () {
  var links = document.querySelectorAll(".title_booking a");
  links.forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault(); // Ngăn chặn hành động mặc định của liên kết
      var targetId = this.getAttribute("href").substring(1); // Lấy id của mục tiêu từ href
      var targetElement = document.getElementById(targetId); // Tìm phần tử mục tiêu
      if (targetElement) {
        var targetPosition = targetElement.offsetTop - 70; // Tính toán vị trí của mục tiêu và trừ đi 70px
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth", // Cuộn mượt
        });
      }
    });
  });
});
