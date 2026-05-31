/*
 * seedBlogs.js
 * File mã nguồn: seedBlogs.js.
 * Chèn chú thích giải thích mục đích chính của file.
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Blog = require('./models/Blog');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Đã kết nối MongoDB - Đang đổ 16 bài Blog mẫu..."))
  .catch(err => console.error("❌ Lỗi kết nối:", err));

const blogs = [
  // ========================== 1. CẨM NANG DU LỊCH ==========================
  {
    title: "Bí kíp du lịch Miền Tây mùa nước nổi từ A-Z",
    content: "Mùa nước nổi Miền Tây thường bắt đầu từ tháng 8 đến tháng 11 âm lịch. Đây là thời điểm tuyệt vời nhất để trải nghiệm nét văn hóa sông nước độc đáo...",
    category: "Cẩm Nang Du Lịch",
    image: "/assets/img/index/tour-1.jpg",
    featured: true
  },
  {
    title: "5 món đồ không thể thiếu khi đi tour quốc tế",
    content: "Để có một chuyến đi nước ngoài trọn vẹn, bạn cần chuẩn bị kỹ lưỡng về hộ chiếu, bảo hiểm du lịch, ổ cắm điện đa năng...",
    category: "Cẩm Nang Du Lịch",
    image: "/assets/img/index/tour-3.jpg",
    featured: false
  },
  {
    title: "Làm sao để săn được tour giá rẻ mà chất lượng?",
    content: "Việc lựa chọn thời điểm đặt tour và theo dõi các chương trình khuyến mãi của các công ty uy tín là chìa khóa giúp bạn tiết kiệm chi phí...",
    category: "Cẩm Nang Du Lịch",
    image: "/assets/img/index/ha-noi-en-370x370.jpg",
    featured: false
  },
  {
    title: "Những lưu ý an toàn khi tham gia tour lặn ngắm san hô",
    content: "Lặn biển là hoạt động thú vị nhưng đòi hỏi bạn phải tuân thủ nghiêm ngặt các quy tắc an toàn và hướng dẫn của chuyên gia...",
    category: "Cẩm Nang Du Lịch",
    image: "/assets/img/index/tour-4.jpg",
    featured: false
  },

  // ========================== 2. ĐẶC SẢN MIỀN TÂY ==========================
  {
    title: "Kẹo dừa Bến Tre - Hương vị ngọt ngào của quê hương",
    content: "Nhắc đến Bến Tre là nhắc đến xứ dừa. Kẹo dừa không chỉ là một món ăn chơi mà còn là kết tinh của sự khéo léo, cần cù của người dân nơi đây...",
    category: "Đặc Sản Miền Tây",
    image: "/assets/img/index/tour-1.jpg",
    featured: true
  },
  {
    title: "Hủ tiếu Mỹ Tho - Đậm đà bản sắc vùng đất Tiền Giang",
    content: "Sợi hủ tiếu dai ngon hòa quyện cùng nước dùng ngọt thanh từ xương ống tạo nên thương hiệu vang danh khắp cả nước...",
    category: "Đặc Sản Miền Tây",
    image: "/assets/img/index/Moc-Chau-370x370.jpg",
    featured: false
  },
  {
    title: "Bánh xèo miền Tây - Giòn rụm khó cưỡng",
    content: "Chiếc bánh xèo vàng ươm, to tròn với nhân tôm thịt, giá đỗ ăn kèm với hàng chục loại rau rừng là món ăn không thể bỏ qua...",
    category: "Đặc Sản Miền Tây",
    image: "/assets/img/index/tour-2.jpg",
    featured: false
  },
  {
    title: "Mùa nào thức nấy: Các loại trái cây đặc trưng Miền Tây",
    content: "Từ sầu riêng Cái Mơn, vú sữa Lò Rèn đến xoài cát Hòa Lộc, Miền Tây luôn đãi khách bằng những thức quà ngọt lành nhất...",
    category: "Đặc Sản Miền Tây",
    image: "/assets/img/index/co-hong-da-lat-760x370.jpg",
    featured: false
  },

  // ========================== 3. ĐỊA ĐIỂM DU LỊCH ==========================
  {
    title: "Khám phá vẻ đẹp Cồn Phụng - Điểm đến lý tưởng tại Bến Tre",
    content: "Nằm giữa dòng sông Tiền thơ mộng, Cồn Phụng không chỉ có cảnh sắc hữu tình mà còn có những công trình kiến trúc Đạo Dừa độc đáo...",
    category: "Địa Điểm Du Lịch",
    image: "/assets/img/index/about.png",
    featured: true
  },
  {
    title: "Chợ nổi Cái Răng - Nét văn hóa buôn bán trên sông",
    content: "Tiếng máy nổ, tiếng mời gọi mua hàng và hàng trăm chiếc ghe chở đầy nông sản tạo nên một không khí nhộn nhịp khó quên...",
    category: "Địa Điểm Du Lịch",
    image: "/assets/img/index/tour-2.jpg",
    featured: false
  },
  {
    title: "Rừng tràm Trà Sư - Bức tranh thiên nhiên xanh mướt",
    content: "Ngồi trên chiếc xuồng ba lá lướt nhẹ trên thảm bèo xanh, bạn sẽ cảm nhận được sự bình yên tuyệt đối của thiên nhiên An Giang...",
    category: "Địa Điểm Du Lịch",
    image: "/assets/img/index/ninh-binh-370x370.jpg",
    featured: false
  },
  {
    title: "Mũi Cà Mau - Nơi cuối cùng của bản đồ hình chữ S",
    content: "Cột mốc tọa độ quốc gia và biểu tượng con tàu hướng ra biển khơi là niềm tự hào của mỗi người con Việt Nam khi đặt chân đến đây...",
    category: "Địa Điểm Du Lịch",
    image: "/assets/img/index/CamPha_QuanNinh_Carousel.jpg",
    featured: false
  },

  // ========================== 4. VĂN HÓA MIỀN TÂY ==========================
  {
    title: "Đờn ca tài tử - Di sản văn hóa phi vật thể nhân loại",
    content: "Âm thanh của tiếng đàn kìm, đàn tranh vang vọng giữa đêm trăng miệt vườn đã trở thành linh hồn của người dân Nam Bộ...",
    category: "Văn Hóa Miền Tây",
    image: "/assets/img/index/han-quoc-370x370.jpg", 
    featured: true
  },
  {
    title: "Lễ hội Ok Om Bok - Ngày hội lớn của người Khmer",
    content: "Lễ hội cúng trăng và đua ghe Ngo là dịp để người dân cầu mong một mùa màng tươi tốt và thể hiện tinh thần đoàn kết cộng đồng...",
    category: "Văn Hóa Miền Tây",
    image: "/assets/img/index/tour-6.jpg",
    featured: false
  },
  {
    title: "Ý nghĩa chiếc áo bà ba và khăn rằn Nam Bộ",
    content: "Hình ảnh người phụ nữ Miền Tây trong chiếc áo bà ba nền nã và chiếc khăn rằn quấn cổ đã trở thành biểu tượng của sự dịu dàng, đảm đang...",
    category: "Văn Hóa Miền Tây",
    image: "/assets/img/index/anh-cau-rong-da-nang-phun-lua-dep_111044330.jpg",
    featured: false
  },
  {
    title: "Tập quán sinh hoạt trên sông của người dân Tây Nam Bộ",
    content: "Từ việc đi lại, giao thương đến các hoạt động sinh hoạt thường ngày, con nước luôn gắn liền với vận mệnh của con người nơi đây...",
    category: "Văn Hóa Miền Tây",
    image: "/assets/img/index/tour-1.jpg",
    featured: false
  }
];

const seedDB = async () => {
  try {
    await Blog.deleteMany({});
    console.log("🗑️ Đã dọn dẹp dữ liệu Blog cũ.");
    await Blog.insertMany(blogs);
    console.log("🌱 Đã đổ 16 bài Blog vào 4 danh mục thành công!");
    process.exit();
  } catch (error) {
    console.error("❌ Lỗi:", error);
    process.exit(1);
  }
};

seedDB();