/*
 * ChiTietBlog.js
 * Script cũ cho trang blog chi tiết.
 * Chèn chú thích giải thích mục đích chính của file.
 */

$(document).ready(function () {
  // Lấy tham số từ URL
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get("slug");

  // Lấy dữ liệu từ file JSON và xử lý
  $.getJSON("../data/blog.json", (blogs) => {
    const data = blogs.data;
    const blog = data.find((item) => item.slug === slug);

    if (blog) {
      document.title = blog.title;
      updateHeader(blog);
      updateBlogContent(blog);
      updateSuggestions(data, slug);
    }

    loadComments();
  });

  // Cập nhật phần header
  function updateHeader(blog) {
    $(".blog-header").html(`
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb mb-2">
        <li class="breadcrumb-item fs-6"><a href="/">Trang chủ</a></li>
        <li class="breadcrumb-item fs-6"><a href="./Blog.html">Blog du lịch</a></li>
        <li class="breadcrumb-item active fs-6" aria-current="page">${blog.title}</li>
      </ol>
    </nav>
    <div class="divider"></div>
    <div class="blog-header-content mt-4">
      <h1 class="fs-3">${blog.title}</h1>
    </div>
  `);
  }

  // Cập nhật phần nội dung blog
  function updateBlogContent(blog) {
    const contentContainer = $(".blog-body");
    const tocContainer = $(".blog-table-contents");
    let index = 1;

    blog.content_blocks.forEach((block) => {
      switch (block.type) {
        case "p":
          contentContainer.append(`<p>${block.content}</p>`);
          break;
        case "img":
          contentContainer.append(
            `<div class="blog-img"><img class="w-100" src="${block.content}" alt="${blog.title}" /></div>`
          );
          break;
        case "h5":
          const id = `heading-${index}`;
          contentContainer.append(`<h5 id="${id}">${block.content}</h5>`);
          tocContainer.append(
            `<a class="fs-6" href="#${id}">${index}. ${block.content}</a>`
          );
          index++;
          break;
      }
    });
  }

  // Cập nhật phần đề xuất
  function updateSuggestions(data, slug) {
    const suggestContainer = $(".blog-suggest");
    const suggestBlogs = data.filter((item) => item.slug !== slug).slice(0, 3);

    suggestBlogs.forEach((item) => {
      suggestContainer.append(`
      <div class="blog-suggest-item col-12">
        <a href="./ChiTietBlog.html?slug=${item.slug}">
          <img src="${item.img}" alt="${item.title}" />
          <h5 class="mt-2">${item.title}</h5>
        </a>
      </div>
    `);
    });
  }

  // Hiển thị comment
  function loadComments() {
    const comments = JSON.parse(localStorage.getItem("comments")) || [];
    const commentList = $(".comment-list");

    comments
      .filter((comment) => comment.blogId === slug)
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
      const blogId = slug;

      comments.push({ blogId, name, email, content, date });
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
