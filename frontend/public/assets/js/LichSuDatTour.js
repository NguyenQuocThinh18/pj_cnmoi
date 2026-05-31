/*
 * LichSuDatTour.js
 * Script cũ cho lịch sử đặt tour.
 * Chèn chú thích giải thích mục đích chính của file.
 */

$(document).ready(function () {
  function huyTour(index) {
    let user = JSON.parse(localStorage.getItem("user"));
    let users = JSON.parse(localStorage.getItem("users"));
    let dattour = user.dattour;
    dattour.splice(index, 1);
    user.dattour = dattour;
    localStorage.setItem("user", JSON.stringify(user));
    for (let i = 0; i < users.length; i++) {
      if (users[i].userID == user.userID) {
        users[i] = user;
        break;
      }
    }
    localStorage.setItem("users", JSON.stringify(users));
    window.location.reload();
  }

  let user = JSON.parse(localStorage.getItem("user"));
  $("#tentaikhoan").html(user.ten);
  $("#muc_tai_khoan img").attr("src", user.avatar);

  let dattour = user.dattour;

  if (dattour != null && dattour.length > 0) {
    $("#dattour").html("");
    for (let i = 0; i < dattour.length; i++) {
      $("#dattour").append(`
                <div class="card mb-3">
                    <div class="card-header bg-success text-white">
                        <h5 class="card-title"> Tên Tour: ${dattour[i].tenTour}</h5>
                    </div>
                    <div class="card-body">
                        <p class="card-text">Địa điểm: ${dattour[i].diadiem}</p>
                        <p class="card-text">Ngày khởi hành: ${dattour[i].khoihanh}</p>
                        <p class="card-text">Thời gian: ${dattour[i].tg}</p>
                        <p class="card-text">Nơi khởi hành: ${dattour[i].noikh}</p>
                        <p class="card-text">Ngày đăng ký: ${dattour[i].ngaydk}</p>
                        <p class="card-text">Số lượng người: ${dattour[i].soluong}</p>
                        <p class="card-text">Phương thưc thanh toán: ${dattour[i].thanhtoan}</p>
                        <p class="card-text">Tổng tiền: ${dattour[i].tongtien}</p>
                        <p class="card-text">Ghi chú: ${dattour[i].ghichu}</p>
                        <button class="btn btn-danger" id="delete">Hủy tour</button>
                        <a class="btn btn-primary" href="./ChiTietTour.html?id=${dattour[i].idTour}">Chi tiết tour</a>
                    </>
                </div>
            `);
    }
  }

  $("#dattour").on("click", "#delete", function () {
    if (confirm("Bạn có chắc chắn muốn hủy tour này không?")) {
      let index = $(this).closest(".card").index();
      huyTour(index);
    }
  });

  $("#dangxuat").click(function (e) {
    e.preventDefault();
    localStorage.removeItem("user");
    localStorage.removeItem("dangnhap");
    window.location.href = "../index.html";
  });
});
