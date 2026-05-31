/*
 * TourTrongNuoc.js
 * Script cũ cho tour trong nước.
 * Chèn chú thích giải thích mục đích chính của file.
 */


$(document).ready(function () {
  // Lấy tham số type từ URL
  const urlParams = new URLSearchParams(window.location.search);
  const type = urlParams.get("type");
// Khai báo các biến và danh sách tour theo miền Bắc, miền Trung, miền Nam
  var nav = ``;
  var headerMienBac = ``;
  var mienbaclist = [];
  var headerMienTrung = ``;
  var mientrunglist = [];
  var headerMienNam = ``;
  var miennamlist = [];
  var clickMore = `<button id="load_more_button" class="btn btn-primary mt-3">Hiển thị thêm</button>`;
  var numToursToShow = 8; // số lượng tour đã được hiển thị(Trong hàm  loadMoreTours), sau khi nhấn vào nút "Hiển thị thêm", giá trị biến thay đổi
// Lấy dữ liệu từ tệp JSON TourTrongNuoc.json
  //lọc các tour đẩy vào danh sách phân theo miền bắc, trung, nam
  $.getJSON("../data/TourTrongNuoc.json", function (data) {
    data.data.forEach((tour) => {
      if (tour.region === "Miền Bắc") {
        mienbaclist.push(tour);
      } else if (tour.region === "Miền Trung") {
        mientrunglist.push(tour);
      } else if (tour.region === "Miền Nam") {
        miennamlist.push(tour);
      }
    });
    /* Nếu biến type(URL) === "MienBac" thì hiển thị danh sách tour miền bắc
       Nếu biến type(URL) === "MienTrung" thì hiển thị danh sách tour miền trung
      Nếu biến type(URL) === "MienNam" thì hiển thị danh sách tour miền nam
      Còn không                        thì hiển thị carousel các tour nổi bật
     */
    if (type === "MienBac") {
      //Tạo HTML  liên kết phân cấp và tiêu đề cho miền Bắc
      nav = `<nav aria-label="breadcrumb">
              <ol class="breadcrumb mb-2">
                 <a class="breadcrumb-item fs-6 text-decoration-none " href="/" >Trang chủ</a>
                 <a class="breadcrumb-item fs-6 text-decoration-none " href="./TourTrongNuoc.html">Tour trong nước</a>
                 <a class="breadcrumb-item fs-6 text-decoration-none active" href="#" >Miền Bắc</a>
              </ol>
            </nav>`;
      headerMienBac = `<h1 class=" fs-2 text-center mt-5 mb-3" style="  color: white; text-shadow: 1px 1px 2px black, 0 0 25px blue, 0 0 5px darkblue; ">Miền Bắc</h1>
                       <div style="text-align:center;">
                           <h2 class="fs-4"><span class="ms-1">Danh sách tour</span></h2>
                       </div>`;
      // Lấy số lượng tour tổng cộng của miền Bắc VÀ Lấy danh sách tour ban đầu bằng hàm renderTourCards
      var totalTours = mienbaclist.length;
      const initialTourCardsHTML = renderTourCards(mienbaclist, totalTours, 0, 8);

      // Hiển thị liên kết phân cấp, tiêu đề cho miền Bắc, danh sách tour ban đầu và nút "Hiển thị thêm"
      $("#nav").html(nav);
      $("#header_MienBac").html(headerMienBac);
      $("#list_tour_MienBac").html(initialTourCardsHTML);
      $(".load_more_MienBac").html(clickMore);
      // Xử lý sự kiện khi click vào nút "Hiển thị thêm"
      $("#load_more_button").click(function () {
        //gọi hàm loadMoreTours ĐỂ hiển thị các tour tiếp theo (8 tour) vào vị trí có id "list_tour_MienBac".
        loadMoreTours(mienbaclist, totalTours,"list_tour_MienBac");
      });
    }
    //Tương tự miền bắc - hiển thị danh sách tour miền trung
    else if (type === "MienTrung") {
      nav = `<nav aria-label="breadcrumb">
              <ol class="breadcrumb mb-2">
                <a class="breadcrumb-item fs-6 text-decoration-none " href="/" >Trang chủ</a>
                <a class="breadcrumb-item fs-6 text-decoration-none " href="./TourTrongNuoc.html">Tour trong nước</a>
                <a class="breadcrumb-item fs-6 text-decoration-none active" href="#" >Miền Trung</a>
               </ol>
            </nav>`;
      headerMienTrung = `<h1 class=" fs-2 text-center mt-4 mb-3" style="  color: white; text-shadow: 1px 1px 2px black, 0 0 25px blue, 0 0 5px darkblue; ">Miền Trung</h1>
                          <div style="text-align:center;">
                                <h2 class="fs-4"><span class="ms-1">Danh sách tour</span></h2>
                          </div>`;

      var totalTours = mientrunglist.length; 
      const initialTourCardsHTML = renderTourCards(mientrunglist, totalTours, 0, 8);

      $("#nav").html(nav);
      $("#header_MienTrung").html(headerMienTrung);
      $("#list_tour_MienTrung").html(initialTourCardsHTML);
      $(".load_more_MienTrung").html(clickMore);

      $("#load_more_button").click(function () {
        loadMoreTours(mientrunglist, totalTours,"list_tour_MienTrung");
      });
    }
    //Tương tự miền bắc - hiển thị danh sách tour miền nam
     else if (type === "MienNam") {
      nav = `<nav aria-label="breadcrumb">
              <ol class="breadcrumb mb-2">
                <a class="breadcrumb-item fs-6 text-decoration-none " href="/" >Trang chủ</a>
                <a class="breadcrumb-item fs-6 text-decoration-none " href="./TourTrongNuoc.html">Tour trong nước</a>
                <a class="breadcrumb-item fs-6 text-decoration-none active" href="#" >Miền Nam</a>
              </ol>
           </nav>`;
      headerMienNam = `<h1 class=" fs-2 text-center mt-4 mb-3" style="  color: white; text-shadow: 1px 1px 2px black, 0 0 25px blue, 0 0 5px darkblue; ">Miền Nam</h1>
                          <div style="text-align:center;">
                                <h2 class="fs-4"><span class="ms-1">Danh sách tour</span></h2>
                          </div>`;

      var totalTours = miennamlist.length; 
      const initialTourCardsHTML = renderTourCards(miennamlist, totalTours, 0, 8);

      $("#nav").html(nav);
      $("#header_MienNam").html(headerMienNam);
      $("#list_tour_MienNam").html(initialTourCardsHTML);
      $(".load_more_MienNam").html(clickMore);

      $("#load_more_button").click(function () {
        loadMoreTours(miennamlist, totalTours,"list_tour_MienNam");
      });
     } 
     //Type không là các miền Bắc Trung Nam hoặc không phù hợp
     // Hiển thị danh sách tour nổi bật từ cả ba miền
    else {
      // Tạo HTML liên kết phân cấp và tiêu đề cho miền Bắc, miền Trung, miền Nam
      nav = `<nav aria-label="breadcrumb">
              <ol class="breadcrumb mb-2">
                      <a class="breadcrumb-item fs-6 text-decoration-none " href="/" >Trang chủ</a>
                      <a class="breadcrumb-item fs-6 text-decoration-none  active" href="./TourTrongNuoc.html">Tour trong nước</a>
              </ol>
        </nav>`;
      headerMienBac = `<h1 class=" fs-2 text-center mt-5 mb-3" style="  color: white;text-shadow: 1px 1px 2px black, 0 0 25px blue, 0 0 5px darkblue; ">Miền Bắc</h1>
                            <div style="text-align:center;">
                                <h2 class="fs-4"><span class="ms-1">Tour nổi bật</span></h2>
                                <p><a href="./TourTrongNuoc.html?type=MienBac" id="link_to_MB">xem thêm</a></p>
                            </div>`;
      headerMienTrung = `<h1 class=" fs-2 text-center mt-5 mb-3" style="  color: white;text-shadow: 1px 1px 2px black, 0 0 25px blue, 0 0 5px darkblue; ">Miền Trung</h1>
                            <div style="text-align:center;">
                                <h2 class="fs-4"><span class="ms-1">Tour nổi bật</span></h2>
                                <p><a href="./TourTrongNuoc.html?type=MienTrung" id="link_to_MT">xem thêm</a></p>
                            </div>`;
      headerMienNam = `<h1 class=" fs-2 text-center mt-5 mb-3" style="  color: white;text-shadow: 1px 1px 2px black, 0 0 25px blue, 0 0 5px darkblue; ">Miền Nam</h1>
                            <div style="text-align:center;">
                                <h2 class="fs-4"><span class="ms-1">Tour nổi bật</span></h2>
                                <p><a href="./TourTrongNuoc.html?type=MienNam" id="link_to_MN">xem thêm</a></p>
                            </div>`;

      //Tạo HTML cho phần đầu của Carousel 3 miền bắc trung nam
      var carouselHeaderBac = `
      <section class="content_newTour">
      <div class="container px-lg-5 py-5">
          <div id="carousel_card_1" class="carousel slide" data-bs-ride="carousel">
              <div class="carousel-inner ">
    `;
      var carouselHeaderTrung = `<section class="content_newTour">
      <div class="container px-lg-5 py-5">
          <div id="carousel_card_2" class="carousel slide" data-bs-ride="carousel">
              <div class="carousel-inner ">
    `;
      var carouselHeaderNam = `<section class="content_newTour">
      <div class="container px-lg-5 py-5">
          <div id="carousel_card_3" class="carousel slide" data-bs-ride="carousel">
              <div class="carousel-inner ">
    `;
       //Gọi hàm RenderTour để đọc dữ liệu danh sách 3 miền VÀ tạo HTML cho phần  content carousel (danh sách các tour)
      var carouselContentMienBac = RenderTour(mienbaclist);
      var carouselContentMienTrung = RenderTour(mientrunglist);
      var carouselContentMienNam = RenderTour(miennamlist);
      //Tạo HTML cho phần cuối của Carousel 3 miền bắc trung nam
      var carouselFooterBac = `
      </div>
                        <button class="carousel-control-prev" type="button" data-bs-target="#carousel_card_1"
                            data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Previous</span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#carousel_card_1"
                            data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>
            </section>
       <hr>
    `;
      var carouselFooterTrung = `
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carousel_card_2"
          data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carousel_card_2"
          data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
      </button>
  </div>
</div>
</section>
        <hr>
    `;
      var carouselFooterNam = `
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carousel_card_3"
          data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carousel_card_3"
          data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
      </button>
  </div>
</div>
</section>
        
    `;
    

      // Hiển thị liên kết phân cấp, tiêu đề cho miền Bắc Trung Nam , carousel bắc trung nam 
      $("#nav").html(nav);

      $("#header_MienBac").html(headerMienBac);
      $("#carousel_MienBac").html(//gôp HTML 3 phần của carousel
        carouselHeaderBac + carouselContentMienBac + carouselFooterBac
      );
      $("#header_MienTrung").html(headerMienTrung);
      $("#carousel_MienTrung").html(//gôp HTML 3 phần của carousel
        carouselHeaderTrung + carouselContentMienTrung + carouselFooterTrung
      );
      $("#header_MienNam").html(headerMienNam);
      $("#carousel_MienNam").html(//gôp HTML 3 phần của carousel
        carouselHeaderNam + carouselContentMienNam + carouselFooterNam
      );

    }
  });








// Xử lý sự kiện khi click vào nút tìm kiếm
$("#tìmKiếmBtn").click(function (event) {
  
  
    event.preventDefault();// Ngăn chặn hành động mặc định sự kiện xảy ra - gửi dữ liệu mẫu và làm mới trang  // Để ta thực hiện các xử lý tìm kiếm dữ liệu mà không cần tải lại trang

    var địaĐiểm = $("#location").val().toLowerCase();/*
    $("#location"):là một phần của jQuery ,chọn phần tử HTML có id là "location".
      .val():là một phương thức của jQuery, trả về giá trị của phần tử trước. Trong trường hợp này, giá trị trả về là giá trị của phần tử nhập liệu văn bản (input) với id là "location".
        .toLowerCase(): là một phương thức của JavaScript được gọi trên chuỗi, nó chuyển đổi tất cả các ký tự trong chuỗi thành chữ thường.
*/
    var nơiKhởiHành = $("#location-start").val().toLowerCase();
    var ngàyKhởiHành = $("#check-out-date").val();
    var ngàyChuyểnĐổi = new Date(ngàyKhởiHành);
    var ngàyDạngChuỗi = ngàyChuyểnĐổi.getDate().toString().padStart(2, "0") +
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
    $.getJSON("../data/TourTrongNuoc.json", function (data) {
        $.each(data.data, function (index, tour) {
            if (//Điều kiện này kiểm tra xem biến địa Điểm có giá trị rỗng HOẶC itinerary của tour có chứa địa Điểm hay không (chữ hoa hoặc chữ thường do .toLowerCase())
              // .includes() TRONG ĐÓ được sử dụng để kiểm tra xem một chuỗi có chứa một chuỗi con khác không (tour1.itinerary có chưa địaĐiểm không)
                (địaĐiểm === "" || tour.itinerary.toLowerCase().includes(địaĐiểm)) &&
                (nơiKhởiHành === "" ||
                    tour.departureLocation.toLowerCase().includes(nơiKhởiHành)) &&// Tương tự địa điểm
                (ngàyKhởiHành === "" || tour.DepartureDate === ngàyDạngChuỗi) // so sánh ngày đã được định dạng khớp với data
            ) {
                kếtQuảTìmKiếm.push(tour); // tìm ra thì đẩy vào danh sách kết quả
            }
        });
        //Tưởng tự  Đọc file json tìm  tour phù hợp của các tour nước ngoài
        $.getJSON("../data/TourNuocNgoai.json", function (data2) {
            $.each(data2.data, function (index, tour2) {
                if (
                    (địaĐiểm === "" || tour2.itinerary.toLowerCase().includes(địaĐiểm)) &&
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





//HÀM

//Hàm hiển thị kết quả tìm được bằng thanh tìm kiếm
function hiểnThịKếtQuảTìmKiếm(kếtQuảTìmKiếm) {
  //tạo biến lưu vị trí hiển thị kết quả
  var $kếtQuảDiv = $("#kếtQuảTìmKiếm");
  //tạo HTML cho liên kết và tiêu đề phần tìm kiếm
  var nav = `<nav aria-label="breadcrumb"><ol class="breadcrumb mb-2">
  <a class="breadcrumb-item fs-6 text-decoration-none " href="/" >Trang chủ</a>
  <a class="breadcrumb-item fs-6 text-decoration-none  active" href="./TourTrongNuoc.html">Danh Sách tìm kiếm</a>
      </ol>
  </nav>`;
  var headerTimKiem = `<div style="text-align:center;">
                  <h2 class="fs-4 mt-4"><span class="ms-1">Danh sách tour hợp lệ</span></h2>
              </div>`;

  // Xóa nội dung cũ trong kết quả hiển thị
  $("#nav").empty();
  $("#header_TimKiem").empty();
  $("#kếtQuảTìmKiếm").empty();
  $("#MienBac").empty();
  $("#MienTrung").empty();
  $("#MienNam").empty();

//Nếu không tìm ra thì thông báo kh tìm thấy 
  if (kếtQuảTìmKiếm.length === 0) {
      $("#nav").html(nav);
      $kếtQuảDiv.append("<p>Không tìm thấy tour phù hợp.</p>");
  } else {
      var totalTours = kếtQuảTìmKiếm.length;
      // Hiển thị kết quả tìm kiếm ban đầu
      const initialTourCardsHTML = renderTourCards(kếtQuảTìmKiếm,totalTours,0, totalTours);//Tạo biến lấy HTML danh sách các tour hợp lệ
      //Hiển thị
      $("#nav").html(nav);
      $("#header_TimKiem").html(headerTimKiem);
      $($kếtQuảDiv).html(initialTourCardsHTML);//Danh sách hiển thị ở vị trí đã tạo trước
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
                          <img src="${tour.img}" class="card-img-top" alt="...">
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
                              <a class="card-tour-link" href="./ChiTietTour.html?id=${tour.id}">Xem chi tiết</a>
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

/**
 * Hàm này nhận vào một danh sách các tour và tạo ra mã HTML để hiển thị chúng dưới dạng các thẻ div trong một carousel.
 * Chỉ hiển thị tối đa 8 tour đầu tiên.
 *
 * @param {Array} tours - Danh sách các tour cần hiển thị.
 * @returns {string} - Mã HTML chứa thông tin của các tour.
 */
function RenderTour(tours) {
  let html = "";
  let endIndex = Math.min(8, tours.length); // Chỉ hiển thị tối đa 8 tour đầu tiên...hoặc lấy giá trị là độ dài của tour nếu độ dài nhỏ hơn 8
  for (let i = 0; i < endIndex; i++) {
      const tour = tours[i];
      if (i % 4 === 0) {
          // Bắt đầu một mục carousel mới- mỗi carousel có 4 tour
          html += `<div class=" carousel-item ${i === 0 ? 'active' : ''}"><div class=" cards-wrapper">`;//nếu là vị trí đầu tiên thì thêm class active
      }

      html += `
          <div class="card" style="width: 18rem;">
          <div class="card-tour-header">
          <a href="./ChiTietTour.html?id=${tour.id}">
            <img src="${tour.img}" class="card-img-top" alt="...">
            </a>
          </div>
              <div class="card-body">
                  <h5 class="card-title text-center">${tour.title}</h5>
                  <div class="text-dark small" style="opacity: 0.5; margin-left: 5%;">
                              <p><i class="bi bi-clock "></i> ${tour.duration}</p>
                              <p><i class="bi bi-calendar"></i> ${tour.DepartureDate}</p>
                              <p><i class="bi bi-send-fill"></i> ${tour.itinerary}</p>
                              <p><i class="bi bi-cash"></i> ${tour.Price} ₫</p>
                          </div>
                  <div  class="card-tour-footer" >
                  <a class="card-tour-link" href="./ChiTietTour.html?id=${tour.id}">Xem chi tiết</a>
            </div>
              </div>
          </div>
      `;

      if ((i + 1) % 4 === 0 || i === endIndex - 1) {// chuẩn bị qua carousel mới thì đóng lại carousel cũ, hoặc đóng khi đã đến tour cuối
          html += `</div></div>`;
      }
  }
  return html;
}
/**
 * Hàm này load thêm tour vào trang web khi người dùng nhấn nút "Hiển thị thêm".
 *
 * @param {Array} list - Danh sách các tour cần hiển thị.
 * @param {number} totalTours - Tổng số tour trong danh sách.
 * @param {string} elementID - ID của phần tử HTML mà tour sẽ được thêm vào.
 */
function loadMoreTours(list, totalTours, elementID) {
  const tourCardsHTML = renderTourCards(list, totalTours, numToursToShow, 8);//lấy HTML của 8 tour tiếp theo, numToursToShow là số tour đã hiển thị
  $(`#${elementID}`).append(tourCardsHTML);//Chèn HTML vào vị trí ID tham số của hàm

  const remainingTours = totalTours - numToursToShow; // kiểm tra số tour còn lại 
  if (remainingTours > 0 && remainingTours < 9) { // nếu còn từ 8 tour trở lại thì ẩn  nút hiển thị thêm
      $("#load_more_button").hide();
  }

  numToursToShow += 8; //cộng số tour đã hiển thị thêm 8
}


});
