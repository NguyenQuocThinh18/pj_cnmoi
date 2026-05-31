/*
 * ChiTietTour.js
 * Script cũ cho trang chi tiết tour.
 * Chèn chú thích giải thích mục đích chính của file.
 */

$(document).ready(function () {
  // Lấy tham số từ URL
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  // Lấy dữ liệu từ file JSON và xử lý
  $.getJSON("../data/ChiTietTour.json", (tours) => {
    const data = tours.data;
    // const tour = tours.data[6];

    const tour = data.find((item) => item.id == id);

    if (tour) {
      document.title = tour.title;
      updateHeader(tour);
      updateImagesContent(tour);
      updateThongTin1(tour);
      updateThongTin2(tour);
      updateLichTrinh(tour);
      updateChiTiet1(tour);
      updateChiTiet2(tour);
      updateLuuY(tour);
    }
    loadComments();
  });
  // Cập nhật phần header
  function updateHeader(tour) {
    $(".header-content").html(`
                <div class="col-4 col-md-8 col-12">
                    <h3 class=" mt-4 ">${tour.title}</h3>
                </div>
                <div class="col-8 col-md-4 col-12">
                    <div class="row">
                        <div class="col-4 col-md-4 col-12">
                            <h5 class="mt-4  ">${tour.Price}/ khách</h5>
                        </div>
                        <div class="col-4 col-md-4 col-12 ">
                            <button type="button" class="btn btn-lg btn-danger float-end mt-3 mb-4" style="width: 100%;" onclick="window.location.href='../html/DatTour.html?id=${tour.id}'"> Đặt ngay</button> 
                        </div>
                        <div class="col-4 col-md-4 col-12 ">
                        
                        <button type="button" class="btn btn-lg btn-light border border-dark float-end mt-3" style="width: 100%;" onclick="window.location.href='../html/LienHe.html'">Liên hệ</button>
                    </div>
                    </div>
                </div>
  `);
  }
  // Cập nhật phần images
  function updateImagesContent(tour) {
    $(".images-content").html(`
            <div class="col-7 col-md-7 col-12 ">
                <div class="box_img position-relative">
                    <img src="${tour.img1}" alt="" >
                    <div class="img_dark position-absolute top-0 start-0 bg-dark w-100 h-100">
                    </div>
                    <div class="img_title position-absolute start-50 translate-middle">
                        <span class="font_DPTBlacksword fs-3 text-white">${tour.contents[73].content}</span>
                    </div>
                </div>
            </div>
            <div class="col-5 col-md-5 col-12">
                <div class="row mb-2">
                    <div class="col-6 col-md-6 col-12">
                        <div class="box_img position-relative">
                            <img src="${tour.img2}"  alt="">
                            <div class="img_dark position-absolute top-0 start-0 bg-dark w-100 h-100">
                            </div>

                            <div class="img_title position-absolute start-50 translate-middle">
                                <span class="font_DPTBlacksword fs-3 text-white">${tour.contents[74].content}</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-6 col-md-6 col-12">
                        <div class="box_img position-relative ">
                            <img src="${tour.img3}" alt="">
                            <div class="img_dark position-absolute top-0 start-0 bg-dark w-100 h-100">
                            </div>

                            <div class="img_title position-absolute start-50 translate-middle">
                                <span class="font_DPTBlacksword fs-3 text-white">${tour.contents[75].content}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                    <div class="col-12 col-md-12 col-12">
                        <div class="box_img position-relative" >
                            <img src="${tour.img4}" alt="" >
                            <div class="img_dark position-absolute top-0 start-0 bg-dark w-100 h-100">
                            </div>

                            <div class="img_title position-absolute start-50 translate-middle">
                                <span class="font_DPTBlacksword fs-3 text-white">${tour.contents[76].content}</span>
                            </div>
                        </div>
                    </div>

            
            </div>
  `);
  }
  // Cập nhật phần thông tin
  function updateThongTin1(tour) {
    $(".thongtin1").html(`
         <div class="col-3 col-md-3 col-12 ">
                            <div class="bi bi-alarm-fill text-center">
                                <h5>Thời gian</h5>
                            </div>
                            <h5 class="text-center">${tour.contents[1].content}</h5>
                        </div>
                        <div class="col-3 col-md-3 col-12 ">
                            <div class="bi bi-airplane-fill text-center">
                                <h5>Phương tiện di chuyển</h5>
                            </div>
                            <h5 class="text-center">${tour.contents[3].content}</h5>
                        </div>
                        <div class="col-3 col-md-3 col-12 ">
                            <div class="bi bi-map-fill text-center">
                                <h5>Điểm tham quan</h5>
                            </div>
                            <h5>${tour.contents[5].content}</h5>
                        </div>
                        <div class="col-3 col-md-3 col-12 ">
                            <div class="bi bi-cup-hot-fill text-center">
                                <h5>Ẩm thực</h5>
                            </div>
                            <h5 >${tour.contents[7].content}</h5>
                            
                        </div>
  `);
  }
  function updateThongTin2(tour) {
    $(".thongtin2").html(`
         <div class="col-3 col-md-3 col-12">
                            <div class="bi bi-building-fill text-center">
                                <h5>Khách sạn</h5>
                            </div>
                            <h5 class="text-center">${tour.contents[9].content}</h5>
                        </div>
                        <div class="col-3 col-md-3 col-12 ">
                            <div class="bi bi-calendar-fill text-center">
                                <h5>Thời gian lý tưởng</h5>
                            </div>

                            <h5 class="text-center">${tour.contents[11].content}</h5>
                        </div>
                        <div class="col-3 col-md-3 col-12 ">
                            <div class="bi bi-people-fill text-center">
                                <h5>Đối tượng thích hợp</h5>
                            </div>

                            <h5 class="text-center">${tour.contents[13].content}</h5>
                        </div>
                        <div class="col-3 col-md-3 col-12 ">
                            <div class="bi bi-gift-fill text-center">
                                <h5>Ưu đãi</h5>
                            </div>

                            <h5 >${tour.contents[15].content}</h5>
                        </div>
  `);
  }
  // Cập nhật phần Lịch trình
  function updateLichTrinh(tour) {
    $(".sticky_list").html(`   
                    <ul class="nav flex-column img-thumbnail container-fluid">
                        <li class="nav-item">
                            <a href="#ngay1" class="nav-link float-md-start" >
                                <h5>Ngày 1</h5>
                                <div class="m-2">${tour.contents[17].content}</div>
                            </a>
                          
                        </li>
                        <li class="nav-item">
                            <a href="#ngay2" class="nav-link float-md-start " >
                                <h5>Ngày 2</h5>
                                <div class="m-2">${tour.contents[18].content}</div>
                            </a>
               
                        </li>
                        <li class="nav-item">
                            <a href="#ngay3" class="nav-link float-md-start " >
                                <h5>Ngày 3</h5>
                                <div class="m-2">${tour.contents[19].content} </div>
                            </a>
                       
                        </li>
                    </ul>
                
              
  `);
    $(".lichtrinh").html(`
        <h4 id="ngay1">${tour.contents[20].content}</h4>
        <div class="text">
            ${tour.contents[21].content}<p></p>

            ${tour.contents[22].content}
            <p></p>
            <div class="row d-flex align-items-center justify-content-center"> <img
                    src="${tour.contents[23].content}" alt=""
                    >
            </div>
            ${tour.contents[24].content} <p></p>
            <div class="row d-flex align-items-center justify-content-center"> <img
                    src="${tour.contents[25].content}" alt=""
                    >

            </div>

            ${tour.contents[26].content}
            <p></p>

            <div class="fw-bold ">${tour.contents[27].content}</div>
            <hr>
        </div>
        <h4 id="ngay2">${tour.contents[28].content}</h4>
        <div class="text">
            ${tour.contents[29].content}<p></p>

            ${tour.contents[30].content} <p></p>

            <div class="row d-flex align-items-center justify-content-center"> <img
                    src="${tour.contents[31].content}"  alt=""
                   >
            </div>

            ${tour.contents[32].content} <p></p>


            <div class="row d-flex align-items-center justify-content-center"> <img
                    src="${tour.contents[33].content}"  alt=""
                    >
            </div>

            <div class="fw-bold ">${tour.contents[34].content}</div>
            <hr>
        </div>
        <h4 id="ngay3">${tour.contents[35].content}</h4>
        <div class="text">
            ${tour.contents[36].content}<p></p>

            ${tour.contents[37].content}<p></p>


            <div class="row  d-flex align-items-center justify-content-center"> <img
                    src="${tour.contents[38].content}"  alt=""
                    >
            </div>
            ${tour.contents[39].content}<p></p>
            ${tour.contents[40].content}<p></p>

            <div class="row  d-flex align-items-center justify-content-center"> <img
                    src="${tour.contents[41].content}"  alt=""
                    >
            </div>

            ${tour.contents[42].content} <p></p>

            <div class="fw-bold mb-5">${tour.contents[43].content}</div>
        </div>
        
  `);
  }
  // Cập nhật phần chi tiết tour
  function updateChiTiet1(tour) {
    $(".chitiet1").html(`
            <div class="col-6 col-md-6 col-12 mt-4 img-thumbnail " style="width:45%;">
                <h4 class="text-center">Chi tiết tour</h4>
                <h5>Thông tin chuyến bay</h5>
                <div class="row mt-4 ">
                    <div class="col-5 col-md-5 col-12 text-center fw-bold">
                        ${tour.contents[44].content}
                        <table class="table mt-5 text-center">
                            <thead>
                                <tr>
                                    <th>${tour.contents[45].content}</th>

                                    <th>${tour.contents[46].content}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>${tour.contents[47].content}</th>
                                    <th>${tour.contents[48].content}</th>
                                </tr>
                            </tbody>
                        </table>

                    </div>
                    <div class="col-5 col-md-5 col-12 text-center fw-bold">
                        ${tour.contents[49].content}
                        <table class="table mt-5  text-center">
                            <thead>
                                <tr>
                                    <th>${tour.contents[50].content}</th>

                                    <th>${tour.contents[51].content}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>${tour.contents[52].content}</th>
                                    <th>${tour.contents[53].content}</th>
                                </tr>
                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
            <div class="col-6 col-md-6 col-12 mt-4 img-thumbnail" style="width:45%; margin-left:10%">
                <h4 class="text-center mt-2">Giá tour & phụ thu phòng đơn</h4>
                <div class="row">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Loại khách</th>
                                <th>Giá tour</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Người lớn (Từ 12 tuổi trở lên)</td>
                                <td>${tour.contents[54].content}</td>
                            </tr>
                            <tr>
                                <td>Trẻ em (Từ 5 - 11 tuổi)</td>
                                <td>${tour.contents[55].content}</td>
                            </tr>
                            <tr>
                                <td>Trẻ nhỏ (Từ 2 - 4 tuổi)</td>
                                <td>${tour.contents[56].content}</td>
                            </tr>
                            <tr>
                                <td>Em bé (Dưới 2 tuổi)</td>
                                <td>${tour.contents[57].content}</td>
                            </tr>
                            <tr>
                                <th>Phụ thu phòng đơn</th>
                                <th>${tour.contents[58].content}</th>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
  `);
  }
  function updateChiTiet2(tour) {
    $(".chitiet2").html(`
        <div class="col-6 col-md-6 col-12 mt-4 img-thumbnail" style="width:45%">
                <h4 class="text-center mt-2">Thông tin tập trung</h4>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Ngày giờ tập trung</th>
                                <td>${tour.contents[59].content}</td>
                            </tr>
                            <tr>
                                <th>Nơi tập trung</th>
                                <td>${tour.contents[60].content}</td>
                            </tr>
                            
                        </thead>
                    </table>
                </div>
                <div class="col-6 col-md-6 col-12 mt-4 img-thumbnail" style="width:45%; margin-left:10%">
                    <h4 class="text-center">Thông tin hướng dẫn viên</h4>
                    <table class="table mt-2">
                        <thead>
                            <tr>
                                <th>Hướng dẫn viên dẫn đoàn</th>
                                <th>Hướng dẫn viên tiễn</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="">
                                <td>${tour.contents[61].content}</td>
                                <td>${tour.contents[62].content}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <hr class="mt-4">
  `);
  }
  // Cập nhật phần lưu ý
  function updateLuuY(tour) {
    let luuyHTML = `
    <h4 id="note" class="mt-3">Những thông tin cần lưu ý</h4>
    <div class="ms-3 fw-bold">`;

    for (let i = 63; i <= 72; i++) {
      luuyHTML += `${tour.contents[i].content}<p></p>`;
    }

    luuyHTML += `</div>`;

    $(".luuy").html(luuyHTML);
  }
  // Hiển thị comment
  function loadComments() {
    const comments = JSON.parse(localStorage.getItem("comments")) || [];
    const commentList = $(".comment-list");

    comments
      .filter((comment) => comment.tourId == id)
      .forEach((comment) => {
        commentList.append(`
          <div class="comment-item mt-3">
            <h6>${comment.name}</h6>
            <p class="comment-text">${comment.content}</p>
            <div class="comment-date">
              <span>${comment.date}</span>
            </div>
          </div>
        `);
      });
  }

  // Xử lý sự kiện gửi comment
  $("#form-comment").on("submit", function (e) {
    e.preventDefault();
    const name = $("#comment-name").val();
    const email = $("#comment-email").val();
    const content = $("#comment-content").val();

    // Kiểm tra dữ liệu ( name không chứa ký tự đặc biệt, email phải đúng định dạng, content không được để trống)
    if (!name || !email || !content) {
      $("#name-error").text(name ? "" : "Vui lòng nhập tên của bạn");
      $("#email-error").text(email ? "" : "Vui lòng nhập email của bạn");
      $("#content-error").text(
        content ? "" : "Vui lòng nhập nội dung bình luận"
      );
      return;
    }

    const regexName = /^[^~`!@#$%^&*()_+-=\[\]\;:"'<>?,./]*$/;
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!regexName.test(name)) {
      $("#name-error").text("Tên không được chứa ký tự đặc biệt");
      return;
    }

    if (!regexEmail.test(email)) {
      $("#email-error").text("Email không đúng định dạng");
      return;
    }

    if (!regexName.test(content)) {
      $("#content-error").text("Nội dung không được chứa ký tự đặc biệt");
      return;
    }

    if (name && email && content) {
      const comments = JSON.parse(localStorage.getItem("comments")) || [];
      const date = new Date().toLocaleDateString();
      const tourId = id;

      comments.push({ tourId, name, email, content, date });
      localStorage.setItem("comments", JSON.stringify(comments));

      $(".comment-list").append(`
      <div class="comment-item mt-3">
        <h6>${name}</h6>
        <p class="comment-text">${content}</p>
        <div class="comment-date">
          <span>${date}</span>
        </div>
      </div>
    `);

      // Reset form
      $("#form-comment").trigger("reset");
    }
  });
});
