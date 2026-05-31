/*
 * TaiKhoan.js
 * Script cũ cho trang tài khoản.
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

  function kiemtra(bien, reg, id, message) {
    if (bien != "") {
      if (!reg.test(bien)) {
        $(id).html(message);
      } else {
        $(id).html("");
      }
    } else {
      $(id).html("");
    }
  }

  function hienthi_email_sdt(bien) {
    if (bien != "") {
      if (reg_email.test(bien)) {
        $("#email").val(bien);
      }
      if (reg_sdt.test(bien)) {
        $("#phone").val(bien);
      }
    }
  }

  //Validate
  reg_name = /^([A-Z]{1}[a-z]*\s)+([A-Z]{1}[a-z]*)$/;
  reg_email = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  reg_sdt = /^[0-9]{10,11}$/;
  reg_cmnd = /^[0-9]{9}$/;
  reg_cccd = /^[0-9]{12}$/;
  reg_passport = /^[0-9]{9}$/;
  reg_mk = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()]{8,}$/;

  let user = JSON.parse(localStorage.getItem("user"));
  $("#tentaikhoan").html(user.ten);
  $("#hoten").val(user.ten);
  hienthi_email_sdt(user.email_sdt_1);
  hienthi_email_sdt(user.email_sdt_2);
  $("#address").val(user.diachi);
  $("#gioitinh").val(user.gioitinh);
  $("#ngaysinh").val(user.ngaysinh);
  $("#cmnd").val(user.cmnd_cccd);
  $("#ngaycap").val(user.ngaycap);
  $("#passport").val(user.passport);
  $("#ngayhethan").val(user.ngayhethan);
  $(".div_avatar img").attr("src", user.avatar);
  $("#muc_tai_khoan img").attr("src", user.avatar);

  var name,
    email,
    phone,
    address,
    gioitinh,
    ngaysinh,
    cmnd_cccd,
    ngaycap,
    passport,
    ngayhethan,
    avatar;
  let today = new Date();

  const fileUpload = document.querySelector("#avatar");
  fileUpload.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function () {
        const result = reader.result;
        $(".div_avatar img").attr("src", result);
        $("#muc_tai_khoan img").attr("src", result);
      };
      reader.readAsDataURL(file);
    }
  });

  name = $("#hoten").val();
  email = $("#email").val();
  phone = $("#phone").val();

  $("#hoten").blur(function (e) {
    e.preventDefault();
    name = $("#hoten").val();
    if (name == "") {
      $("#erro_ten").html("Vui lòng nhập họ và tên");
    } else if (!reg_name.test(removeAscent(name))) {
      $("#erro_ten").html(
        "Tên bắt đầu mỗi từ bằng chữ hoa, gồm ít nhất 2 từ, không chứa số và ký tự đặc biệt"
      );
    } else {
      $("#erro_ten").html("");
    }
  });

  $("#email").blur(function (e) {
    e.preventDefault();
    email = $("#email").val();
    kiemtra(email, reg_email, "#erro_email", "Email không hợp lệ");
  });

  $("#phone").blur(function (e) {
    e.preventDefault();
    phone = $("#phone").val();
    kiemtra(phone, reg_sdt, "#erro_sdt", "Số điện thoại không hợp lệ");

    if (phone == "" && email == "") {
      $("#erro_sdt").html("Vui lòng nhập số điện thoại hoặc email");
      $("#erro_email").html("Vui lòng nhập số điện thoại hoặc email");
    }
  });

  $("#address").blur(function (e) {
    e.preventDefault();
    address = $("#address").val();
  });

  $("#gioitinh").blur(function (e) {
    e.preventDefault();
    gioitinh = $("#gioitinh").val();
  });

  $("#ngaysinh").blur(function (e) {
    e.preventDefault();
    ngaysinh = $("#ngaysinh").val();
    ns = new Date(ngaysinh);
    if (today.getFullYear() - ns.getFullYear() < 16) {
      $("#erro_ngaysinh").html("Độ tuổi phải lớn hơn 16");
    } else {
      $("#erro_ngaysinh").html("");
    }
  });

  $("#cmnd").blur(function (e) {
    e.preventDefault();
    cmnd_cccd = $("#cmnd").val();
    if (cmnd_cccd != "") {
      if (!reg_cccd.test(cmnd_cccd) && !reg_cmnd.test(cmnd_cccd)) {
        $("#erro_cmnd_cccd").html("Số cmnd/cccd gồm 9 hoặc 12 chữ số");
      } else {
        $("#erro_cmnd_cccd").html("");
      }
    } else {
      $("#erro_cmnd_cccd").html("");
    }
  });

  $("#ngaycap").blur(function (e) {
    e.preventDefault();
    ngaycap = $("#ngaycap").val();

    if (ngaycap != "" && cmnd_cccd == "") {
      $("#erro_cmnd_cccd").html("Bạn chưa nhập số cmnd/cccd");
    } else if (new Date(ngaycap) > today) {
      $("#erro_ngaycap").html("Ngày cấp không hợp lệ");
    } else {
      $("#erro_ngaycap").html("");
    }
  });

  $("#passport").blur(function (e) {
    e.preventDefault();
    passport = $("#passport").val();
    kiemtra(
      passport,
      reg_passport,
      "#erro_passport",
      "Số passport gồm 9 chữ số"
    );
  });

  $("#ngayhethan").blur(function (e) {
    e.preventDefault();
    ngayhethan = $("#ngayhethan").val();
    if (ngayhethan != "" && passport == "") {
      $("#erro_passport").html("Bạn chưa nhập số passport");
    } else if (new Date(ngayhethan) < today) {
      $("#erro_ngayhethan").html("Passport đã hết hạn");
    } else {
      $("#erro_ngayhethan").html("");
    }
  });

  $("#btn_update_info").click(function (e) {
    e.preventDefault();
    name = $("#hoten").val();
    avatar = $(".div_avatar img").attr("src");
    if (name == "") {
      $("#erro_ten").html("Vui lòng nhập họ và tên");
    }
    if (ngaycap == null && cmnd_cccd != null) {
      $("#erro_ngaycap").html("Vui lòng chọn ngày cấp cmnd/cccd");
    }
    if (ngaycap != null && cmnd_cccd == null) {
      $("#erro_cmnd_cccd").html("Bạn chưa nhập số cmnd/cccd");
    }
    if (ngayhethan == null && passport != null) {
      $("#erro_ngayhethan").html("Vui lòng chọn ngày hết hạn passport");
    }
    if (ngayhethan != null && passport == null) {
      $("#erro_passport").html("Bạn chưa nhập số passport");
    }
    if (
      $("#erro_ten").html() == "" &&
      $("#erro_email").html() == "" &&
      $("#erro_sdt").html() == "" &&
      $("#erro_diachi").html() == "" &&
      $("#erro_gioitinh").html() == "" &&
      $("#erro_ngaysinh").html() == "" &&
      $("#erro_cmnd_cccd").html() == "" &&
      $("#erro_ngaycap").html() == "" &&
      $("#erro_passport").html() == "" &&
      $("#erro_ngayhethan").html() == ""
    ) {
      user.ten = name;
      user.email_sdt_1 = email;
      user.email_sdt_2 = phone;
      user.diachi = address;
      user.gioitinh = gioitinh;
      user.ngaysinh = ngaysinh;
      user.cmnd_cccd = cmnd_cccd;
      user.ngaycap = ngaycap;
      user.passport = passport;
      user.ngayhethan = ngayhethan;
      user.avatar = avatar;

      localStorage.setItem("user", JSON.stringify(user));

      users = JSON.parse(localStorage.getItem("users"));
      for (let i = 0; i < users.length; i++) {
        if (users[i].userID == user.userID) {
          users[i] = user;
          localStorage.setItem("users", JSON.stringify(users));
          break;
        }
      }

      alert("Cập nhật thông tin thành công");
      location.reload();
    }
  });

  $("#show_password").click(function () {
    if ($(this).is(":checked")) {
      $("#current_password").attr("type", "text");
      $("#new_password").attr("type", "text");
      $("#re_new_password").attr("type", "text");
    } else {
      $("#current_password").attr("type", "password");
      $("#new_password").attr("type", "password");
      $("#re_new_password").attr("type", "password");
    }
  });

  var current_password, new_password, re_new_password;

  $("#current_password").blur(function (e) {
    e.preventDefault();
    current_password = $("#current_password").val();
    if (current_password == "") {
      $("#erro_mk").html("Vui lòng nhập mật khẩu hiện tại");
    } else if (current_password != user.matkhau) {
      $("#erro_mk").html("Mật khẩu hiện tại không đúng");
    } else {
      $("#erro_mk").html("");
    }
  });

  $("#new_password").blur(function (e) {
    e.preventDefault();
    new_password = $("#new_password").val();
    if (new_password == "") {
      $("#erro_mkmoi").html("Vui lòng nhập mật khẩu mới");
    } else if (!reg_mk.test(new_password)) {
      $("#erro_mkmoi").html(
        "Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số"
      );
    } else {
      $("#erro_mkmoi").html("");
    }
  });

  $("#re_new_password").blur(function (e) {
    e.preventDefault();
    re_new_password = $("#re_new_password").val();
    if (re_new_password == "") {
      $("#erro_nhaplaimk").html("Vui lòng nhập lại mật khẩu mới");
    } else if (re_new_password != new_password) {
      $("#erro_nhaplaimk").html("Mật khẩu nhập lại không khớp");
    } else {
      $("#erro_nhaplaimk").html("");
    }
  });

  $("#btn_update_pass").click(function (e) {
    e.preventDefault();
    if (
      current_password == user.matkhau &&
      reg_mk.test(new_password) &&
      re_new_password == new_password
    ) {
      user.matkhau = new_password;
      localStorage.setItem("user", JSON.stringify(user));
      alert("Cập nhật mật khẩu thành công");
    }
  });

  $("#dangxuat").click(function (e) {
    e.preventDefault();
    localStorage.removeItem("user");
    localStorage.removeItem("dangnhap");
    window.location.href = "../index.html";
  });
});
