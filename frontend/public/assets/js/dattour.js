/*
 * dattour.js
 * Script JavaScript cho trang tĩnh cũ: dattour.
 * Chèn chú thích giải thích mục đích chính của file.
 */

var currentHref = window.location.href;

var id = currentHref.split("=")[1];
$.getJSON("../data/chitiettour.json", function (data) {
  var vt_id = parseInt(id) - 1;
  var tour = data.data[vt_id];
  var ngay_di = tour.contents[44].content.slice(8);

  $("#nd_tomtat").html(`
  
 
  <div class=' title_booking '>
      <h4 class="ps-4 pt-2 " id="ten_tour"> ${tour.title}  </h4>
  </div>

  <div class="p-3">
      <img src="${tour.img1}" class="img-fluid" alt="image">

      <div class="">

          <p class="title"><b> Địa điểm:</b>
          <p id="title"> ${tour.contents[5].content}</p>
          </p>
          <div class="entry">
              <div class="entry-inner">
                  <p>
                      <b>Khởi hành:</b> <span id="khoi_hanh">${ngay_di}</span>
                  </p>
                  <p>
                      <b>Thời gian :</b> <span id="thoi_gian">${tour.contents[1].content} </span>
                  </p>
                  <p>
                      <b> Nơi khởi hành:</b> <span id="noi_khoi_hanh">${tour.contents[47].content}</span>
                  </p>
              </div>
          </div>
      </div>

  </div>

  `);

  $("#don_nguoi_lon").html(tour.contents[54].content.slice(0, -1));
  $("#gia_nguoi_lon").html(tour.contents[54].content.slice(0, -1));
  $("#tong_gia").html(tour.contents[54].content.slice(0, -1));
  $("#don_tre_em").html(tour.contents[55].content.slice(0, -1));
  $("#don_tre_nho").html(tour.contents[56].content.slice(0, -1));
  $("#don_em_be").html(tour.contents[57].content.slice(0, -1));
});

//hiển thị thanh toan radio
function HienRadio(vt_xuat_hien) {
  if (vt_xuat_hien === "Thanh_toan1") {
    document.getElementById("Thanh_toan2").style.display = "none";
    document.getElementById("Thanh_toan1").style.display = "block";
  } else {
    document.getElementById("Thanh_toan1").style.display = "none";
    document.getElementById("Thanh_toan2").style.display = "block";
  }
}
//tăng giảm số lượng
function changeValue(spanId, tang_giam) {
  var gia_tri = parseInt(document.getElementById(spanId).textContent);
  gia_tri += tang_giam;
  // đk số lượng
  if (spanId === "sl_nguoi_lon") {
    gia_tri = Math.max(1, gia_tri);
    if (gia_tri === 1) {
      // đk không  giảm sl người lớn
      document.getElementById("btn_giam_gt").disabled = true;
    } else {
      document.getElementById("btn_giam_gt").disabled = false;
    }
  } else {
    gia_tri = Math.max(0, gia_tri);
  }
  document.getElementById(spanId).textContent = gia_tri;
  /// thêm bảng thông tin khách hàng khi số lượng người lớn tăng giảm
  if (spanId === "sl_nguoi_lon") {
    if (tang_giam === 1) {
      let sl = $("#sl_nguoi_lon").html();

      let khachHangInfo = `
    <div class="shadow-lg rounded_boder m-3" id="kh${sl}" name="tt_kh">
        <div class="title_booking">
            <h4 class="ps-4 pt-2">Thông tin hành khách ${sl} </h4>
        </div>
        <div class="p-3">
            <div class="row">
                <label class="pb-1 form-label col-4">Họ và tên</label>
                <p class="col-7">
                    <input type="text" id="ip_ht_kh${sl}" class="form-control" placeholder="Nhập họ tên" style="width: 100%;" name="ht_kh">
                </p>
            </div>
            <div class="row">
                <label class="pb-1 form-label col-4">Giới tính</label>
                <p class="col-7">
                    <select required class="form-control title form-select" style="width: 100%;" name="gioi_kh" id="ip_gioi_kh${sl}">
                        <option value="Nam" class="form">Nam</option>
                        <option value="Nữ">Nữ</option>
                    </select>
                </p>
            </div>
            <div class="row">
                <label class="pb-1 form-label col-4">Ngày sinh</label>
                <p class="col-7">
                    <input type="date" class="form-control" id="ip_sinh_kh${sl}" name="sinh_kh" style="width: 100%;">
                </p>
            </div>
        </div>
    </div>
`;

      $("#TT_khach_hang").append(khachHangInfo);
    } else if (tang_giam === -1) {
      const node = document.getElementById("TT_khach_hang").lastElementChild;
      node.parentNode.removeChild(node);
    }
  }
}
// sd tiếng Việt
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
if (user && user.cmnd_cccd) {
  $("#ip_CCCD").val(user.cmnd_cccd);
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

function cap_nhat_gia(vt) {
  const vt_sl = "sl_" + vt;
  let sl = parseInt(document.getElementById(vt_sl).textContent); //span
  const vt_don_gia = "don_" + vt;
  let don_gia = document.getElementById(vt_don_gia).textContent;
  // Loại bỏ các ký tự không phải số và chuyển đổi thành một số
  const number_don_gia = parseInt(don_gia.replace(/\D/g, ""));
  let number_tong_tien = sl * number_don_gia;
  let tong_tien = number_tong_tien.toLocaleString();
  const vi_tri_gia = "gia_" + vt;
  document.getElementById(vi_tri_gia).textContent = tong_tien;
}

function cap_nhat_tong_gia() {
  let gia_nguoi_lon = document.getElementById("gia_nguoi_lon").textContent;
  const number_NL = parseInt(gia_nguoi_lon.replace(/\D/g, ""));
  let gia_tre_em = document.getElementById("gia_tre_em").textContent;
  const number_TE = parseInt(gia_tre_em.replace(/\D/g, ""));
  let gia_tre_nho = document.getElementById("gia_tre_nho").textContent;
  const number_TN = parseInt(gia_tre_nho.replace(/\D/g, ""));
  let gia_em_be = document.getElementById("gia_em_be").textContent;
  const number_EB = parseInt(gia_em_be.replace(/\D/g, ""));
  let number_tong_gia = number_NL + number_TE + number_TN + number_EB;
  let tong_gia = number_tong_gia.toLocaleString();
  document.getElementById("tong_gia").textContent = tong_gia;
}

//kiểm tra thông tin và hiện modal
$("#btn_dat_tour").click(function (e) {
  e.preventDefault();
  $("#check_title").html($("#title").html());
  $("#check_nkh").html($("#khoi_hanh").html());
  $("#check_tongtien").html($("#tong_gia").html());
  $("#check_ghichu").html($("#ghi_chu").html());
  $("#check_tour").html($("#ten_tour").html());
  if (
    kt_HoTen() &&
    kt_sdt() &&
    kt_email() &&
    kt_DiaChi() &&
    kt_CCCD() &&
    kt_ThanhToan() &&
    kt_tt_hk()
  ) {
    $("#modalId").modal("show");

    var ht = $("#ip_hovaten").val();
    $("#check_ht").html(ht);

    var CCCD = $("#ip_CCCD").val();
    $("#check_CCCD").html(CCCD);

    var sdt = $("#sdt").val();

    $("#check_sdt").html(sdt);
    var ghichu = $("#ghi_chu").val();

    $("#check_ghichu").html(ghichu);

    var sl =
      parseInt($("#sl_nguoi_lon").html()) +
      parseInt($("#sl_tre_em").html()) +
      parseInt($("#sl_tre_nho").html()) +
      parseInt($("#sl_em_be").html());
    $("#check_sl").html(sl);

    var genderValue = $("input[name='Thanh_toan']:checked").val();
    $("#check_tt").html(genderValue);
  }
});

// cập nhật tour lên local

function capnhat() {
  var currentDate = new Date();
  var day = currentDate.getDate();
  var month = currentDate.getMonth() + 1;
  var year = currentDate.getFullYear();
  var day = day + "/" + month + "/" + year;
  var sl =
    parseInt($("#sl_nguoi_lon").html()) +
    parseInt($("#sl_tre_em").html()) +
    parseInt($("#sl_tre_nho").html()) +
    parseInt($("#sl_em_be").html());

  let tt_hk = [];
  let sl_hk = $("#sl_nguoi_lon").html();
  for (let i = 1; i <= parseInt(sl_hk); i++) {
    let ht_hk = "#ip_ht_kh" + i;
    let gioi_hk = "#ip_gioi_kh" + i;
    let sinh_hk = "#ip_sinh_kh" + i;

    // Tạo đối tượng `kh` với các thuộc tính tương ứng
    let kh = {};
    kh["ht_hk"] = $(ht_hk).val();
    kh["gioi_hk"] = $(gioi_hk).val();
    kh["sinh_hk"] = $(sinh_hk).val();

    tt_hk.push(kh);
  }

  let dt = user.dattour;
  if (dt == null) {
    dt = [];
  }

  dt.push({
    diadiem: $("#title").html(),
    khoihanh: $("#khoi_hanh").html(),
    tg: $("#thoi_gian").html(),
    noikh: $("#noi_khoi_hanh").html(),
    ngaydk: day,
    soluong: sl,
    thanhtoan: $("input[name='Thanh_toan']:checked").val(),
    tongtien: $("#tong_gia").html(),
    ghichu: $("#check_ghichu").html(),
    idTour: id,
    tenTour: $("#ten_tour").html(),
    tt_hk: tt_hk,
  });

  user.dattour = dt;
  localStorage.setItem("user", JSON.stringify(user));

  users = JSON.parse(localStorage.getItem("users"));
  for (let i = 0; i < users.length; i++) {
    if (users[i].userID == user.userID) {
      users[i] = user;
      break;
    }
  }

  localStorage.setItem("users", JSON.stringify(users));
  alert("Đặt tour thành công");
}

// hoten
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
//CCCD
function kt_CCCD() {
  let cccd = $("#ip_CCCD").val();
  let reg_cccd_01 = /[0-9]{12}$/;
  let reg_cccd_02 = /[0-9]{9}$/;

  if (cccd != "") {
    if (!reg_cccd_01.test(cccd) && !reg_cccd_02.test(cccd)) {
      $("#loi_CCCD").html("Số CMND/CCCD phải 9 số hoặc 12 số ");
      return false;
    } else {
      $("#loi_CCCD").html("");
      return true;
    }
  } else {
    $("#loi_CCCD").html("Không để trống");
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

// kiểm tra radio phương thức thanh toán
function kt_ThanhToan() {
  // Lấy đối tượng radio buttons
  var thanh_toan1 = document.getElementById("tt1");
  var thanh_toan2 = document.getElementById("tt2");

  // Kiểm tra radio nào đã được chọn
  if (thanh_toan1.checked || thanh_toan2.checked) {
    return true;
  } else {
    alert("Chọn cách thức thanh toán");
    return false;
  }
}
// kiểm tra nhập thông tin hành khách
function kt_tt_hk() {
  let sl = $("#sl_nguoi_lon").html();
  for (let i = 1; i <= parseInt(sl); i++) {
    let ht_hk = "#ip_ht_kh" + i;
    let sinh_hk = "#ip_sinh_kh" + i;
    if ($(ht_hk).val() === "") {
      alert("Điền đầy đủ thông tin hành khách ");
      return false;
    }
    if ($(sinh_hk).val() === "") {
      alert("Điền đầy đủ thông tin hành khách ");
      return false;
    }
  }
  return true;
}
