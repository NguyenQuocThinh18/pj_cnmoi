/*
 * DangNhap.js
 * Script JavaScript cho trang tĩnh cũ: DangNhap.
 * Chèn chú thích giải thích mục đích chính của file.
 */

$(document).ready(function () {
  $("#btndn").click(function (e) {
    e.preventDefault();
    let email_sdt = $("#email_sdt").val();
    let password = $("#password").val();
    if (email_sdt != "" && password != "") {
      // Lấy thông tin user từ localStorage
      let users = JSON.parse(localStorage.getItem("users"));

      // Kiểm tra thông tin đăng nhập
      let find = 0;

      if (users != null) {
        for (let i = 0; i < users.length; i++) {
          if (
            (email_sdt == users[i].email_sdt_1 ||
              email_sdt == users[i].email_sdt_2) &&
            password == users[i].matkhau
          ) {
            let dangnhap = 1;
            localStorage.setItem("dangnhap", JSON.stringify(dangnhap));

            let user = users[i];
            localStorage.setItem("user", JSON.stringify(user));

            find = 1;

            window.location.href = "../index.html";
            break;
          }
        }
        if (find == 0) {
          alert("Sai thông tin đăng nhập");
        }
      } else {
        alert("Chưa có tài khoản nào được đăng ký");
      }
    } else {
      alert("Vui lòng nhập đây đủ thông tin đăng nhập");
    }
  });
});
