/*
 * QuenMatKhau.js
 * Script cũ cho trang quên mật khẩu.
 * Chèn chú thích giải thích mục đích chính của file.
 */

$(document).ready(function () {
  $("#send").click(function () {
    let email_sdt = $("#email_sdt").val();
    let reg_email = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    let reg_sdt = /^[0-9]{10,11}$/;
    if (email_sdt == "") {
      $("#erro").html("Vui lòng nhập email hoặc số điện thoại");
    } else if (reg_email.test(email_sdt)) {
      $("#noidung").html(
        "<h5 class=text-center>Mật khẩu đã được gửi vào email của bạn</h5>"
      );
    } else if (reg_sdt.test(email_sdt)) {
      $("#noidung").html(
        "<h5 class=text-center>Mật khẩu đã được gửi vào số điện thoại của bạn</h5>"
      );
    } else {
      $("#erro").html("Không hợp lệ");
    }
  });
});
