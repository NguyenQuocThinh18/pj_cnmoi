/*
 * DangKy.js
 * Script cũ xử lý form đăng ký trang tĩnh.
 * Chèn chú thích giải thích mục đích chính của file.
 */

$(document).ready(function () {
  function removeAscent(str) {
    if (str === null || str === undefined) return str;

    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");

    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");

    return str;
  }

  reg_name = /^([A-Z]{1}[a-z]*\s)+([A-Z]{1}[a-z]*)$/;
  reg_email = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  reg_sdt = /^[0-9]{10,11}$/;
  reg_password =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[a-zA-Z\d!@#$%^&*()]{8,}$/;

  var name, email_sdt, password, confirm_password;

  $("#name").blur(function (e) {
    e.preventDefault();
    name = $("#name").val();
    if (name == "") {
      $("#erro_name").html("Vui lòng nhập họ và tên");
    } else if (!reg_name.test(removeAscent(name))) {
      $("#erro_name").html(
        "Tên bắt đầu mỗi từ bằng chữ hoa, gồm ít nhất 2 từ, không chứa số và ký tự đặc biệt"
      );
    } else {
      $("#erro_name").html("");
    }
  });

  $("#email_sdt").blur(function (e) {
    e.preventDefault();
    email_sdt = $("#email_sdt").val();
    if (email_sdt == "") {
      $("#erro_email_sdt").html("Vui lòng nhập email hoặc số điện thoại");
    } else if (!reg_email.test(email_sdt) && !reg_sdt.test(email_sdt)) {
      $("#erro_email_sdt").html("Email hoặc số điện thoại không hợp lệ");
    } else {
      let users = JSON.parse(localStorage.getItem("users"));
      if (users != null) {
        for (let i = 0; i < users.length; i++) {
          if (
            users[i].email_sdt_1 == email_sdt ||
            users[i].email_sdt_2 == email_sdt
          ) {
            $("#erro_email_sdt").html("Email hoặc số điện thoại đã tồn tại");
            break;
          } else {
            $("#erro_email_sdt").html("");
          }
        }
      } else {
        $("#erro_email_sdt").html("");
      }
    }
  });

  $("#password").blur(function (e) {
    e.preventDefault();
    password = $("#password").val();
    if (password == "") {
      $("#erro_password").html("Vui lòng nhập mật khẩu");
    } else if (!reg_password.test(password)) {
      $("#erro_password").html(
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt"
      );
    } else {
      $("#erro_password").html("");
    }
  });

  $("#confirm_password").blur(function (e) {
    e.preventDefault();
    confirm_password = $("#confirm_password").val();
    if (confirm_password == "") {
      $("#erro_confirm_password").html("Vui lòng nhập lại mật khẩu");
    } else if (confirm_password != password) {
      $("#erro_confirm_password").html("Mật khẩu không khớp");
    } else {
      $("#erro_confirm_password").html("");
    }
  });

  $("#btn_dk").click(function (e) {
    e.preventDefault();
    if (
      reg_name.test(removeAscent(name)) &&
      (reg_email.test(email_sdt) || reg_sdt.test(email_sdt)) &&
      reg_password.test(password) &&
      confirm_password == password
    ) {
      //Lưu thông tin vào localStorage
      let lastID = localStorage.getItem("lastID");
      if (lastID == null) {
        lastID = 0;
      } else {
        lastID = parseInt(lastID);
      }

      let user = {
        userID: lastID + 1,
        ten: name,
        email_sdt_1: email_sdt,
        matkhau: password,
        avatar:
          "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png",
        dattour: null,
      };

      localStorage.setItem("lastID", user.userID);

      users = JSON.parse(localStorage.getItem("users"));
      if (users == null) {
        users = [];
      }
      users.push(user);
      localStorage.setItem("users", JSON.stringify(users));

      if (
        confirm(
          "Đăng ký thành công. Bạn có muốn chuyển đến trang đăng nhập không?"
        )
      ) {
        window.location.href = "DangNhap.html";
      }
    }
  });
});
