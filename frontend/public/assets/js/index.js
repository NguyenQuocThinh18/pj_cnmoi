/*
 * index.js
 * Script JavaScript cho trang tĩnh cũ: index.
 * Chèn chú thích giải thích mục đích chính của file.
 */

$(document).ready(function () {
  $.getJSON("../data/TopTourTrongNuoc.json", function (data) {
    let tours = data.tours;
    RenderTour(tours, "carousel_card_1");
  });

  $.getJSON("../data/TopTourQuocTe.json", function (data) {
    let tours = data.tours;
    RenderTour(tours, "carousel_card_2");
  });

  $.getJSON("../data/CamNangDuLich.json", function (data) {
    let blogs = data.blogs;
    RenderBlog(blogs, "render_blog");
  });

  function RenderTour(tours, id_render) {
    let html = "";
    index = 0;
    tours.forEach((tour) => {
      if (index == 0)
        html += `
          <div class="carousel-item active">
              <div class="cards-wrapper">
                  <div class="card" style="width: 18rem;">
        `;
      else if (index % 3 == 0 && index != tours.lenght - 1)
        html += `
              </div>
          </div>
          <div class="carousel-item">
              <div class="cards-wrapper">
                <div class="card" style="width: 18rem;">
        `;
      else if (index == tours.lenght - 1) {
        html += `
              </div>
          </div>
      `;
      } else
        html += `
          <div class="card d-none d-lg-block" style="width: 18rem;">
        `;
      html += `
          <img src="${tour.img}" class="card-img-top" alt="...">
          <div class="card-body">
              <h5 class="card-title text-center">${tour.title}</h5>
              <div class="card-text">
                  <p>
                      <i class="bi bi-clock"></i>
                      <span>${tour.time}</span>
                  </p>
                  <p>
                      <i class="bi bi-calendar"></i>
                      <span>${tour.date}</span>
                  </p>
                  <p>
                      <i class="bi bi-geo-alt-fill"></i>
                      <span>${tour.location}</span>
                  </p>
                  <p>
                      <i class="bi bi-cash"></i>
                      <span>${tour.price}</span>
                  </p>
              </div>
              <a href="./html/ChiTietTour.html?id=${tour.id}" class="btn btn-info text-white">Xem
                  chi tiết</a>
          </div>
        </div>
        `;
      index++;
    });
    $(`#${id_render} .carousel-inner`).html(html);
  }

  function RenderBlog(blogs, id_render) {
    let html = "";
    index = 0;
    blogs.forEach((blog) => {
      if (index == 0) {
        html += `
        <div class="col-lg-6 col-12">
        <div class="box_blog m-auto" style="width: 90%;">
            <img src="${blog.img}"
                alt="" width="100%">
            <a class="text-decoration-none text-black"
                href="${blog.href}">
                <h3 class="text-center">${blog.title}</h3>
            </a>
            <p>
                ${blog.content}
            </p>
        </div>
        </div>
        <div class="col-lg-6 col-12">
        `;
      } else {
        html += `
        <div class="row align-items-center pb-1">
        <div class="col-lg-6 col-12">
        <img src="${blog.img}" alt="" width="100%">
        </div>
        <div class="col-lg-6 col-12">
            <a class="text-decoration-none text-black" href="${blog.href}">
              <h3 class="fs-5">${blog.title}</h3>
            </a>
            <p style="font-size: 16px;">${blog.content}</p>
        </div>
        </div>
        `;
      }
      if (index == blogs.lenght - 1) {
        html += `</div>`;
      }
      index++;
    });
    $(`#${id_render}`).html(html);
  }

  /*====================================search==============================*/

  // Xử lý sự kiện khi click vào nút tìm kiếm
  $("#tìmKiếmBtn").click(function (event) {
    event.preventDefault(); // Ngăn chặn hành động mặc định sự kiện xảy ra - gửi dữ liệu mẫu và làm mới trang  // Để ta thực hiện các xử lý tìm kiếm dữ liệu mà không cần tải lại trang

    var địaĐiểm = $("#location").val().toLowerCase();
    /*
    $("#location"):là một phần của jQuery ,chọn phần tử HTML có id là "location".
      .val():là một phương thức của jQuery, trả về giá trị của phần tử trước. Trong trường hợp này, giá trị trả về là giá trị của phần tử nhập liệu văn bản (input) với id là "location".
        .toLowerCase(): là một phương thức của JavaScript được gọi trên chuỗi, nó chuyển đổi tất cả các ký tự trong chuỗi thành chữ thường.
*/
    var nơiKhởiHành = $("#location-start").val().toLowerCase();
    var ngàyKhởiHành = $("#check-out-date").val();
    var ngàyChuyểnĐổi = new Date(ngàyKhởiHành);
    var ngàyDạngChuỗi =
      ngàyChuyểnĐổi.getDate().toString().padStart(2, "0") +
      "/" +
      (ngàyChuyểnĐổi.getMonth() + 1).toString().padStart(2, "0") +
      "/" +
      ngàyChuyểnĐổi.getFullYear().toString();
    /*
      var ngàyChuyểnĐổi = new Date(ngàyKhởiHành);:  tạo một đối tượng Date từ chuỗi ngày tháng được lấy.
      var ngàyDạngChuỗi = ngàyChuyểnĐổi.getDate().toString().padStart(2, "0") + "/" + (ngàyChuyểnĐổi.getMonth() + 1).toString().padStart(2, "0") + "/" + ngàyChuyểnĐổi.getFullYear().toString();:  Dòng này chuyển đổi đối tượng Date đã tạo ở trước thành một chuỗi ngày tháng  định dạng "DD/MM/YYYY".
            .getDate().toString().padStart(2, "0"): Lấy ngày trong tháng từ đối tượng Date, chuyển đổi thành chuỗi, sau đó sử dụng phương thức padStart(2, "0") để thêm số 0 vào đầu chuỗi nếu ngày chỉ có một chữ số.
            (ngàyChuyểnĐổi.getMonth() + 1).toString().padStart(2, "0"): Lấy tháng từ đối tượng Date, cộng thêm 1 vì tháng trong JavaScript bắt đầu từ 0, sau đó chuyển đổi thành chuỗi và thêm số 0 vào đầu chuỗi nếu tháng chỉ có một chữ số.
            ngàyChuyểnĐổi.getFullYear().toString(): Lấy năm từ đối tượng Date, chuyển đổi thành chuỗi.*/

    //Khai báo mảng danh sách sẽ chưa kết quả tìm kiếm
    var kếtQuảTìmKiếm = [];
    //Đọc file json tìm  tour phù hợp
    $.getJSON("data/TourTrongNuoc.json", function (data) {
      $.each(data.data, function (index, tour) {
        if (
          //Điều kiện này kiểm tra xem biến địa Điểm có giá trị rỗng HOẶC itinerary của tour có chứa địa Điểm hay không (chữ hoa hoặc chữ thường do .toLowerCase())
          // .includes() TRONG ĐÓ được sử dụng để kiểm tra xem một chuỗi có chứa một chuỗi con khác không (tour1.itinerary có chưa địaĐiểm không)
          (địaĐiểm === "" || tour.itinerary.toLowerCase().includes(địaĐiểm)) &&
          (nơiKhởiHành === "" ||
            tour.departureLocation.toLowerCase().includes(nơiKhởiHành)) && // Tương tự địa điểm
          (ngàyKhởiHành === "" || tour.DepartureDate === ngàyDạngChuỗi) // so sánh ngày đã được định dạng khớp với data
        ) {
          kếtQuảTìmKiếm.push(tour); // tìm ra thì đẩy vào danh sách kết quả
        }
      });
      //Tưởng tự  Đọc file json tìm  tour phù hợp của các tour nước ngoài
      $.getJSON("data/TourNuocNgoai.json", function (data2) {
        $.each(data2.data, function (index, tour2) {
          if (
            (địaĐiểm === "" ||
              tour2.itinerary.toLowerCase().includes(địaĐiểm)) &&
            (nơiKhởiHành === "" ||
              tour2.departureLocation.toLowerCase().includes(nơiKhởiHành)) &&
            (ngàyKhởiHành === "" || tour2.DepartureDate === ngàyDạngChuỗi)
          ) {
            kếtQuảTìmKiếm.push(tour2);
          }
        });
        // sau khi gọi hàm hiển thị kết quả với tham số là ds tour đã tìm được
        hiểnThịKếtQuảTìmKiếm(kếtQuảTìmKiếm);
      });
    });
  });
  //Hàm hiển thị kết quả tìm được bằng thanh tìm kiếm
  function hiểnThịKếtQuảTìmKiếm(kếtQuảTìmKiếm) {
    //tạo biến lưu vị trí hiển thị kết quả
    var $kếtQuảDiv = $("#kếtQuảTìmKiếm");
    //tạo HTML cho liên kết và tiêu đề phần tìm kiếm
    var nav = `<nav aria-label="breadcrumb" class="pt-3"><ol class="breadcrumb mb-2">
          <a  class="breadcrumb-item fs-6 text-decoration-none" href="/">Trang chủ</a>
      
              <a  class="breadcrumb-item fs-6 text-decoration-none  active" href="#">Danh Sách Tìm kiếm</a>
          </>
      </ol>
  </nav>`;
    var headerTimKiem = `<div style="text-align:center;">
                  <h2 class="fs-4 mt-4"><span class="ms-1">Danh sách tour hợp lệ</span></h2>
              </div>`;

    // Xóa nội dung cũ trong kết quả hiển thị
    $("#nav").empty();
    $("#header_TimKiem").empty();
    $("#kếtQuảTìmKiếm").empty();
    $(".content_destination").empty();
    $(".content_newTour").empty();
    $(".content_blog").empty();
    $(".content_about").empty();

    //Nếu không tìm ra thì thông báo kh tìm thấy
    if (kếtQuảTìmKiếm.length === 0) {
      $("#nav").html(nav);
      $kếtQuảDiv.append("<p>Không tìm thấy tour phù hợp.</p>");
    } else {
      var totalTours = kếtQuảTìmKiếm.length;
      // Hiển thị kết quả tìm kiếm ban đầu
      const initialTourCardsHTML = renderTourCards(
        kếtQuảTìmKiếm,
        totalTours,
        0,
        totalTours
      ); //Tạo biến lấy HTML danh sách các tour hợp lệ
      //Hiển thị
      $("#nav").html(nav);
      $("#header_TimKiem").html(headerTimKiem);
      $($kếtQuảDiv).html(initialTourCardsHTML); //Danh sách hiển thị ở vị trí đã tạo trước
    }
  }

  // Hàm renderTourCards được sử dụng để tạo HTML cho danh sách các tour
  // Tham số:
  // - list: Mảng chứa thông tin về các tour.
  // - totalTours: Số lượng tổng các tour trong danh sách.
  // - startIndex: Chỉ mục bắt đầu của danh sách tour cần render.
  // - numTours: Số lượng tour cần render bắt đầu từ startIndex.
  function renderTourCards(list, totalTours, startIndex, numTours) {
    let tourCardsHTML = "";
    for (let i = startIndex; i < startIndex + numTours; i++) {
      if (i < totalTours) {
        const tour = list[i];
        tourCardsHTML += `
          <div class="col-12 col-md-4 col-lg-3 mb-4">
              <div class="card-tour" >
                        <div class="card-tour-header">
                        <a href="./ChiTietTour.html?id=${tour.id}">
                          <img src="img/${tour.img}" class="card-img-top" alt="...">
                          </a>
                        </div>
                        <div class="card-tour-body">
                        <a href="./ChiTietTour.html?id=${tour.id}">
                        <h5 class="card-title text-center mt-1 text-secondary" ">${tour.title}</h5>
                        </a>
                          
                          <div class="text-dark small" style="opacity: 0.5; margin-left: 5%;">
                              <p><i class="bi bi-clock "></i> ${tour.duration}</p>
                              <p><i class="bi bi-calendar"></i> ${tour.DepartureDate}</p>
                              <p><i class="bi bi-send-fill"></i> ${tour.itinerary}</p>
                              <p><i class="bi bi-cash"></i> ${tour.Price} ₫</p>
                          </div>
                        </div>
                        
                        <div  class="card-tour-footer" >
                              <a class="card-tour-link" href="./html/ChiTietTour.html?id=${tour.id}">Xem chi tiết</a>
                        </div>
                     
                  
              </div>
          </div>
      `;
        //href="./ChiTietTour.html?id=${tour.id}" là 1 URL,được sử dụng để chỉ định địa chỉ URL mà liên kết sẽ dẫn đến khi được nhấp vào.
        //${tour.id} là một biến JavaScript được chèn vào trong chuỗi bằng cú pháp ${...}. Giá trị của biến này sẽ được thay thế vào chuỗi khi mã JavaScript được thực thi. Trong trường hợp này, nó sẽ được thay thế bằng giá trị của thuộc tính id của tour, điều này giúp định danh duy nhất cho mỗi tour.
      }
    }
    return tourCardsHTML;
  }
});
