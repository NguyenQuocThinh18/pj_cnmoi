/*
 * LienHe.js
 * Script cũ cho trang liên hệ.
 * Chèn chú thích giải thích mục đích chính của file.
 */

$.getJSON("../data/ChiTietTour.json", function (data) {
  var tour = data.data;
  let sl = tour.length;
  console.log(sl);
  for (var i = 0; i < sl; i++) {
    // Tạo một div mới
    let them = "";
    them += `
        <div class="border-bottom ">
            <a href="../html/ChiTietTour.html?id=${tour[i].id}" class="btn p-1 hover_btn" style="text-decoration: none; color: black;"
            >
                <div class="row">
                    <img src="${tour[i].img1}" alt="" class="col-5 img-fluid p-0">
                    <span class="col-7 px-1">
                        <p class="m-1"><b>${tour[i].title}</b></p>
                        <p><i class="bi bi-cash m-1"></i>100000</p>
                    </span>
                </div>
            </a>
        </div>`;

    // Lấy thẻ div bên ngoài để thêm innerDiv vào
    var outerDiv = document.getElementById("them");
    // Gán nội dung HTML vào outerDiv
    outerDiv.innerHTML += them;
  }
});

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

reg_name = /^([A-Z]{1}[a-z]*\s)+([A-Z]{1}[a-z]*)$/; /// sd trong tt local
reg_email = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/; /// sd trong tt local
reg_dienthoai = /^((09)|(08)|(07)|(06)|(05)|(04)|(03)|(02))[0-9]{8}$/;
//Hiển thị thông tin đã có trên localStrage
let user = JSON.parse(localStorage.getItem("user"));
if (user && user.ten) {
  $("#ip_hovaten").val(user.ten);
}
function hienthi_email_sdt(bien) {
  if (bien != "") {
    if (reg_email.test(bien)) {
      $("#ip_email").val(bien);
    } else {
      $("#sdt").val(bien);
    }
  }
}

if (user && user.diachi) {
  $("#dia_chi").val(user.diachi);
}
if (user && user.email_sdt_1) {
  hienthi_email_sdt(user.email_sdt_1);
}
if (user && user.email_sdt_2) {
  hienthi_email_sdt(user.email_sdt_2);
}
function kt_HoTen() {
  let name = $("#ip_hovaten").val();
  if (name == "") {
    $("#loi_hovaten").html("Vui lòng nhập họ và tên");
  } else if (!reg_name.test(removeAscent(name))) {
    $("#loi_hovaten").html(
      "Tên bắt đầu mỗi từ bằng chữ hoa, gồm ít nhất 2 từ, không chứa số "
    );
    return false;
  } else {
    $("#loi_hovaten").html("");
    return true;
  }
}

//sdt
function kt_sdt() {
  let dienthoai = $("#sdt").val();
  if (dienthoai != "") {
    if (!reg_dienthoai.test(dienthoai)) {
      $("#loi_sdt").html("Điện thoại phải là 10 chữ số");
      return false;
    } else {
      $("#loi_sdt").html("");
      return true;
    }
  } else {
    $("#loi_sdt").html("Không để trống");
    return false;
  }
}

//gmail
function kt_email() {
  let email = $("#ip_email").val();
  if (email != "") {
    if (!reg_email.test(email)) {
      $("#loi_email").html("Email không đúng định dạng");
      return false;
    } else {
      $("#loi_email").html("");
      return true;
    }
  } else {
    $("#loi_email").html("Không được để trông ");
    return false;
  }
}
// địa chỉ
function kt_DiaChi() {
  let dia_chi = $("#dia_chi").val();
  if (dia_chi != "") {
    $("#loi_dia_chi").html("");
    return true;
  } else {
    $("#loi_dia_chi").html("Không để trống");
    return false;
  }
}
function kt_tieude() {
  let tieude = $("#tieude").val();
  if (tieude != "") {
    $("#loi_tieu_de").html("");
    return true;
  } else {
    $("#loi_tieu_de").html("Không để trống");
    return false;
  }
}
function kt_nd() {
  let nd = $("#nd").val();
  if (nd != "") {
    $("#loi_nd").html("");
    return true;
  } else {
    $("#loi_nd").html("Không để trống");
    return false;
  }
}
$("#btn_dat_tour").click(function (e) {
  if (
    kt_HoTen() &&
    kt_sdt() &&
    kt_email() &&
    kt_DiaChi() &&
    kt_nd() &&
    kt_tieude()
  ) {
    let name = $("#ip_hovaten").val();
    let dienthoai = $("#sdt").val();
    let email = $("#ip_email").val();
    let dia_chi = $("#dia_chi").val();
    let tieude = $("#tieude").val();
    let nd = $("#nd").val();
    let dt = JSON.parse(localStorage.getItem("lienhe")) || [];
    dt.push({
      name: name,
      dienthoai: dienthoai,
      dia_chi: dia_chi,
      tieude: tieude,
      nd: nd,
    });
    localStorage.setItem("lienhe", JSON.stringify(dt));
    alert("Gửi liên hệ thành công");
  }
});
