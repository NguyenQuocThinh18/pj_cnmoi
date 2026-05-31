/*
 * Blog.js
 * Script cũ xử lý danh sách blog.
 * Chèn chú thích giải thích mục đích chính của file.
 */

$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search); //Tạo đối tượng lấy URL trang
  const page = urlParams.get("page") || 1; //Lấy chỉ số trang hiện tại
  const pageSize = 20; //Số lượng item/trang

  $.getJSON("../data/blog.json", function (blogs) {
    let data = blogs.data;
    let html = "";

    renderPagination(data.length);
    renderBlogs(data);
  });

  function renderBlogs(data) {
    let html = "";
    // Lấy item đủ cho một trang (có kích thước là 20 item/trang)
    data.slice((page - 1) * pageSize, page * pageSize).forEach((item) => {
      const url = `./ChiTietBlog.html?slug=${item.slug}`;

      html += `
            <div class="col-12 col-md-4 col-lg-3 mb-4">
              <div class="card-blog">
                <div class="card-blog-header">
                  <a href="${url}">
                    <img
                      class="card-blog-img"
                      alt="blog"
                      src="${item.img}"
                    />
                  </a>
                </div>
                <div class="card-blog-body">
                  <a href="${url}" class="card-blog-title">
                    <h5>
                      ${item.title}
                    </h5>
                  </a>
                  <p class="card-blog-description">
                    ${item.description}
                  </p>
                </div>
                <div class="card-blog-footer">
                  <a class="card-blog-link" href="${url}">
                    Xem chi tiết
                  </a>
                </div>
              </div>
            </div>
      `;
    });

    $(".blog-list").html(html);
  }

  function renderPagination(total) {
    const pageCount = Math.ceil(total / pageSize);

    $(".pagination").append(
      `<li class="page-item">
        <a class="page-link" href="./Blog.html?page=${page - 1}"><</a>
      </li>`
    );

    for (let i = 1; i <= pageCount; i++) {
      $(".pagination").append(`
        <li class="page-item">
          <a class="page-link" href="./Blog.html?page=${i}">${i}</a>
        </li>
      `);
    }

    $(".pagination").append(
      `<li class="page-item">
        <a class="page-link" href="./Blog.html?page=${
          page < pageCount ? parseInt(page) + 1 : pageCount
        }">></a>
      </li>`
    );

    $(".pagination .page-item").each(function () {
      if ($(this).find("a").text() == page) {
        $(this).addClass("active");
      }
    });

    if (page == 1) {
      $(".pagination .page-item:first-child").addClass("disabled");
    }

    if (page == pageCount) {
      $(".pagination .page-item:last-child").addClass("disabled");
    }
  }
});
