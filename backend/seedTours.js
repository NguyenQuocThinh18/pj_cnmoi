/*
 * seedTours.js
 * File mã nguồn: seedTours.js.
 * Chèn chú thích giải thích mục đích chính của file.
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./models/Tour');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Kết nối thành công! Đang đổ 48 tour vào Database..."))
  .catch(err => console.error("❌ Lỗi kết nối:", err));

const tours = [
  // ========================== TOUR TRONG NƯỚC ==========================

  // --- 1. Tour Miền Tây ---
  { title: "Về Xứ Dừa Bến Tre: Hàm Luông - Cồn Phụng", city: "Bến Tre", price: 850000, duration: "1 ngày", availableSeats: 20, category: "Tour Miền Tây", image: "tour-1.jpg", featured: true, description: "Khám phá quê hương xứ Dừa, tham quan lò kẹo dừa và đi xuồng ba lá." },
  { title: "Cần Thơ: Chợ Nổi Cái Răng - Miệt Vườn", city: "Cần Thơ", price: 1100000, duration: "1 ngày", availableSeats: 15, category: "Tour Miền Tây", image: "tour-2.jpg", featured: false, description: "Trải nghiệm văn hóa sông nước và thưởng thức trái cây tại vườn." },
  { title: "An Giang: Rừng Tràm Trà Sư - Châu Đốc", city: "An Giang", price: 1850000, duration: "2 ngày 1 đêm", availableSeats: 12, category: "Tour Miền Tây", image: "Moc-Chau-370x370.jpg", featured: false, description: "Hành trình về vùng đất Thất Sơn huyền bí và rừng tràm xanh mướt." },
  { title: "Đồng Tháp Mười: Gò Tháp - Xẻo Quýt", city: "Đồng Tháp", price: 1250000, duration: "1 ngày", availableSeats: 30, category: "Tour Miền Tây", image: "tour-6.jpg", featured: false, description: "Tham quan di tích lịch sử và ngắm đầm sen rực rỡ." },

  // --- 2. Tour Miền Nam ---
  { title: "Sài Gòn City Tour: Dinh Độc Lập - Nhà Thờ Đức Bà", city: "TP.HCM", price: 950000, duration: "1 ngày", availableSeats: 20, category: "Tour Miền Nam", image: "ha-noi-en-370x370.jpg", featured: true, description: "Khám phá vẻ đẹp lịch sử và hiện đại của thành phố mang tên Bác." },
  { title: "Biển Xanh Vũng Tàu: Tượng Chúa Kitô - Hải Đăng", city: "Vũng Tàu", price: 1150000, duration: "1 ngày", availableSeats: 25, category: "Tour Miền Nam", image: "tour-4.jpg", featured: false, description: "Thư giãn bên bờ biển và tham quan các địa danh nổi tiếng." },
  { title: "Tây Ninh: Chinh phục đỉnh Núi Bà Đen", city: "Tây Ninh", price: 1450000, duration: "1 ngày", availableSeats: 18, category: "Tour Miền Nam", image: "CamPha_QuanNinh_Carousel.jpg", featured: false, description: "Trải nghiệm cáp treo hiện đại và chiêm bái tượng Phật Bà cao nhất Châu Á." },
  { title: "Đảo Ngọc Côn Đảo: Tâm linh & Nghỉ dưỡng", city: "Côn Đảo", price: 5900000, duration: "3 ngày 2 đêm", availableSeats: 10, category: "Tour Miền Nam", image: "tour-3.jpg", featured: true, description: "Hành trình thiêng liêng về vùng đất anh hùng và biển xanh cát trắng." },

  // --- 3. Tour Miền Trung ---
  { title: "Đà Nẵng: Bà Nà Hills - Cầu Vàng - làng Pháp", city: "Đà Nẵng", price: 4200000, duration: "3 ngày 2 đêm", availableSeats: 20, category: "Tour Miền Trung", image: "Bà-Nà-2.jpg", featured: true, description: "Trải nghiệm không gian châu Âu giữa lòng Đà Nẵng." },
  { title: "Phố Cổ Hội An: Thả đèn hoa đăng trên sông Hoài", city: "Quảng Nam", price: 2500000, duration: "2 ngày 1 đêm", availableSeats: 15, category: "Tour Miền Trung", image: "cau-vang-ba-na-hills.jpg", featured: false, description: "Tìm về không gian hoài cổ với những ngôi nhà tường vàng mái ngói." },
  { title: "Cố Đô Huế: Đại Nội - Lăng Tẩm - Sông Hương", city: "Huế", price: 3200000, duration: "3 ngày 2 đêm", availableSeats: 12, category: "Tour Miền Trung", image: "tour-5.jpg", featured: false, description: "Khám phá nét cung đình trầm mặc của kinh đô cuối cùng Việt Nam." },
  { title: "Quảng Bình: Động Thiên Đường - Suối Moọc", city: "Quảng Bình", price: 4500000, duration: "3 ngày 2 đêm", availableSeats: 10, category: "Tour Miền Trung", image: "ninh-binh-370x370.jpg", featured: false, description: "Chiêm ngưỡng kỳ quan hang động khô dài nhất Châu Á." },

  // --- 4. Tour Miền Bắc ---
  { title: "Vịnh Hạ Long: Du thuyền 5 sao - Hang Sửng Sốt", city: "Quảng Ninh", price: 3800000, duration: "2 ngày 1 đêm", availableSeats: 15, category: "Tour Miền Bắc", image: "Vinh-ha-long.jpg", featured: true, description: "Lênh đênh trên vịnh biển kỳ quan, ngắm hoàng hôn cực phẩm." },
  { title: "Sapa Fansipan: Chinh phục nóc nhà Đông Dương", city: "Lào Cai", price: 4100000, duration: "3 ngày 2 đêm", availableSeats: 12, category: "Tour Miền Bắc", image: "tour-phansipan.png", featured: true, description: "Săn mây trên đỉnh cao 3.143m và khám phá bản làng dân tộc." },
  { title: "Ninh Bình: Tràng An - Bái Đính - Hang Múa", city: "Ninh Bình", price: 1950000, duration: "1 ngày", availableSeats: 25, category: "Tour Miền Bắc", image: "ninh-binh-370x370.jpg", featured: false, description: "Tham quan phim trường Kong và ngôi chùa lớn nhất Đông Nam Á." },
  { title: "Mộc Châu: Thiên đường hoa mận - Đồi chè", city: "Sơn La", price: 2300000, duration: "2 ngày 1 đêm", availableSeats: 20, category: "Tour Miền Bắc", image: "Moc-Chau-370x370.jpg", featured: false, description: "Tận hưởng không khí trong lành vùng cao Bắc Bộ." },

  // --- 5. Tour Tây Nguyên ---
  { title: "Đà Lạt: Đồi Cỏ Hồng - Thung Lũng Tình Yêu", city: "Lâm Đồng", price: 2900000, duration: "3 ngày 2 đêm", availableSeats: 18, category: "Tour Tây Nguyên", image: "co-hong-da-lat-760x370.jpg", featured: true, description: "Tận hưởng không khí se lạnh và check-in nghìn góc sống ảo." },
  { title: "Buôn Ma Thuột: Thác Dray Nur - Buôn Đôn", city: "Đắk Lắk", price: 3500000, duration: "3 ngày 2 đêm", availableSeats: 15, category: "Tour Tây Nguyên", image: "tour-1.jpg", featured: false, description: "Khám phá thủ phủ cà phê và những con thác hùng vĩ." },
  { title: "Gia Lai: Biển Hồ T'Nưng - Thủy điện Yaly", city: "Gia Lai", price: 3200000, duration: "3 ngày 2 đêm", availableSeats: 10, category: "Tour Tây Nguyên", image: "tour-6.jpg", featured: false, description: "Ngắm 'đôi mắt Pleiku' trong xanh giữa đại ngàn Tây Nguyên." },
  { title: "Kon Tum: Nhà Thờ Gỗ - Cầu Treo Kon Klor", city: "Kon Tum", price: 2800000, duration: "2 ngày 1 đêm", availableSeats: 12, category: "Tour Tây Nguyên", image: "about.png", featured: false, description: "Chiêm ngưỡng kiến trúc gỗ độc đáo của đồng bào dân tộc." },

  // --- 6. Tour Biển Đảo ---
  { title: "Phú Quốc: VinWonders - Safari - Grand World", city: "Kiên Giang", price: 5400000, duration: "3 ngày 2 đêm", availableSeats: 20, category: "Tour Biển Đảo", image: "tour-4.jpg", featured: true, description: "Vui chơi thỏa thích tại thiên đường giải trí hàng đầu Việt Nam." },
  { title: "Nha Trang: Tour 4 Đảo - Tắm bùn khoáng", city: "Khánh Hòa", price: 3100000, duration: "3 ngày 2 đêm", availableSeats: 25, category: "Tour Biển Đảo", image: "anh-cau-rong-da-nang-phun-lua-dep_111044330.jpg", featured: false, description: "Khám phá vịnh biển đẹp nhất thế giới và thưởng thức hải sản." },
  { title: "Quy Nhơn: Kỳ Co - Eo Gió - Tịnh Xá", city: "Bình Định", price: 3800000, duration: "3 ngày 2 đêm", availableSeats: 15, category: "Tour Biển Đảo", image: "tour-2.jpg", featured: false, description: "Chiêm ngưỡng vẻ đẹp hoang sơ của Maldives phiên bản Việt." },
  { title: "Lý Sơn: Đỉnh Thới Lới - Cổng Tò Vò", city: "Quảng Ngãi", price: 4200000, duration: "3 ngày 2 đêm", availableSeats: 10, category: "Tour Biển Đảo", image: "tour-3.jpg", featured: false, description: "Khám phá vương quốc tỏi và những dấu tích núi lửa triệu năm." },

  // ========================== TOUR QUỐC TẾ ==========================

  // --- 7. Tour Châu Á ---
  { title: "Nhật Bản: Tokyo - Núi Phú Sĩ - Kyoto", city: "Tokyo", price: 34900000, duration: "6 ngày 5 đêm", availableSeats: 10, category: "Tour Châu Á", image: "han-quoc-370x370.jpg", featured: true, description: "Khám phá xứ sở hoa anh đào với hành trình đẳng cấp." },
  { title: "Thái Lan: Bangkok - Pattaya - Đảo San Hô", city: "Bangkok", price: 8500000, duration: "5 ngày 4 đêm", availableSeats: 30, category: "Tour Châu Á", image: "tour-5.jpg", featured: false, description: "Thiên đường mua sắm và giải trí sôi động bậc nhất khu vực." },
  { title: "Singapore - Malaysia: Liên tuyến quốc gia", city: "Singapore", price: 15500000, duration: "5 ngày 4 đêm", availableSeats: 20, category: "Tour Châu Á", image: "about.png", featured: false, description: "Check-in sư tử biển và tháp đôi Petronas nổi tiếng." },
  { title: "Hàn Quốc: Seoul - Nami - Everland", city: "Seoul", price: 16900000, duration: "5 ngày 4 đêm", availableSeats: 15, category: "Tour Châu Á", image: "han-quoc-370x370.jpg", featured: true, description: "Hành trình đến xứ sở Kim Chi với những phim trường lãng mạn." },

  // --- 8. Tour Châu Âu ---
  { title: "Pháp - Ý - Thụy Sĩ: Hành trình Tây Âu", city: "Paris", price: 79000000, duration: "10 ngày 9 đêm", availableSeats: 8, category: "Tour Châu Âu", image: "tour-3.jpg", featured: true, description: "Dạo bước dưới tháp Eiffel và đi thuyền Venice lãng mạn." },
  { title: "Đức - Hà Lan - Bỉ: Lễ hội hoa Tulip", city: "Amsterdam", price: 68000000, duration: "9 ngày 8 đêm", availableSeats: 10, category: "Tour Châu Âu", image: "tour-1.jpg", featured: false, description: "Chiêm ngưỡng vườn hoa Keukenhof lớn nhất thế giới." },
  { title: "Bắc Âu: Na Uy - Thụy Điển - Đan Mạch", city: "Oslo", price: 98000000, duration: "12 ngày 11 đêm", availableSeats: 5, category: "Tour Châu Âu", image: "tour-6.jpg", featured: false, description: "Khám phá vẻ đẹp kỳ vĩ của các vịnh hẹp và vùng Scandinavia." },
  { title: "Đông Âu: Áo - Czech - Hungary", city: "Prague", price: 72000000, duration: "10 ngày 9 đêm", availableSeats: 6, category: "Tour Châu Âu", image: "tour-2.jpg", featured: false, description: "Tìm hiểu kiến trúc cổ kính và văn hóa đặc sắc tại Đông Âu." },

  // --- 9. Tour Châu Phi ---
  { title: "Ai Cập: Kim Tự Tháp - Sông Nile", city: "Cairo", price: 59000000, duration: "8 ngày 7 đêm", availableSeats: 10, category: "Tour Châu Phi", image: "tour-6.jpg", featured: true, description: "Khám phá nền văn minh cổ đại và những bí ẩn của Pharaoh." },
  { title: "Nam Phi: Cape Town - Safari hoang dã", city: "Cape Town", price: 65000000, duration: "8 ngày 7 đêm", availableSeats: 8, category: "Tour Châu Phi", image: "tour-5.jpg", featured: false, description: "Ngắm thú hoang dã tại vườn quốc gia và đỉnh Núi Bàn." },
  { title: "Morocco: Casablanca - Xứ sở nghìn lẻ một đêm", city: "Marrakech", price: 69000000, duration: "10 ngày 9 đêm", availableSeats: 6, category: "Tour Châu Phi", image: "tour-1.jpg", featured: false, description: "Lạc lối giữa những khu chợ trung cổ rực rỡ màu sắc." },
  { title: "Kenya: Săn ảnh động vật mùa di cư", city: "Nairobi", price: 82000000, duration: "9 ngày 8 đêm", availableSeats: 5, category: "Tour Châu Phi", image: "tour-3.jpg", featured: false, description: "Trải nghiệm camping giữa thiên nhiên hoang dã vĩ đại nhất trái đất." },

  // --- 10. Tour Bắc Mỹ ---
  { title: "Hoa Kỳ: New York - Washington DC - Philadelphia", city: "New York", price: 85000000, duration: "9 ngày 8 đêm", availableSeats: 10, category: "Tour Bắc Mỹ", image: "ha-noi-en-370x370.jpg", featured: true, description: "Hành trình khám phá các biểu tượng quyền lực nhất thế giới." },
  { title: "Canada: Toronto - Montreal - Niagara Falls", city: "Toronto", price: 89000000, duration: "10 ngày 9 đêm", availableSeats: 8, category: "Tour Bắc Mỹ", image: "Moc-Chau-370x370.jpg", featured: false, description: "Ngắm mùa lá phong đỏ rực rỡ và thác nước hùng vĩ." },
  { title: "Mỹ - Bờ Tây: Los Angeles - Las Vegas", city: "Los Angeles", price: 76000000, duration: "8 ngày 7 đêm", availableSeats: 12, category: "Tour Bắc Mỹ", image: "tour-4.jpg", featured: false, description: "Vui chơi tại Hollywood và kinh đô ánh sáng giữa sa mạc." },
  { title: "Mexico: Cancun - Thành phố cổ Maya", city: "Cancun", price: 95000000, duration: "9 ngày 8 đêm", availableSeats: 6, category: "Tour Bắc Mỹ", image: "tour-2.jpg", featured: false, description: "Hòa mình vào biển Caribe và nền văn minh cổ đại." },

  // --- 11. Tour Nam Mỹ ---
  { title: "Brazil: Rio de Janeiro - Thác Iguazu", city: "Rio", price: 115000000, duration: "12 ngày 11 đêm", availableSeats: 5, category: "Tour Nam Mỹ", image: "tour-5.jpg", featured: true, description: "Vũ điệu Samba sôi động và kỳ quan thiên nhiên thác Iguazu." },
  { title: "Peru: Khám phá Machu Picchu huyền bí", city: "Cusco", price: 120000000, duration: "10 ngày 9 đêm", availableSeats: 4, category: "Tour Nam Mỹ", image: "tour-3.jpg", featured: false, description: "Chinh phục thành phố đã mất của người Inca trên đỉnh núi." },
  { title: "Argentina: Buenos Aires - Sông băng Perito", city: "Buenos Aires", price: 108000000, duration: "11 ngày 10 đêm", availableSeats: 5, category: "Tour Nam Mỹ", image: "tour-1.jpg", featured: false, description: "Thưởng thức Tango và ngắm nhìn những khối băng vĩnh cửu." },
  { title: "Chile: Đảo Phục Sinh - Santiago", city: "Santiago", price: 140000000, duration: "14 ngày 13 đêm", availableSeats: 3, category: "Tour Nam Mỹ", image: "tour-6.jpg", featured: false, description: "Khám phá những bức tượng Moai kỳ lạ giữa đại dương." },

  // --- 12. Tour Châu Đại Dương/Úc ---
  { title: "Nước Úc: Sydney - Nhà hát con sò", city: "Sydney", price: 48000000, duration: "7 ngày 6 đêm", availableSeats: 15, category: "Tour Châu Đại Dương/Úc", image: "about.png", featured: true, description: "Tận hưởng không gian thanh bình tại quốc gia đáng sống nhất." },
  { title: "Melbourne: Cung đường Great Ocean Road", city: "Melbourne", price: 52000000, duration: "8 ngày 7 đêm", availableSeats: 12, category: "Tour Châu Đại Dương/Úc", image: "tour-2.jpg", featured: false, description: "Ngắm 12 vị tông đồ trên cung đường biển đẹp nhất thế giới." },
  { title: "New Zealand: Queenstown - Làng Hobbit", city: "Auckland", price: 88000000, duration: "10 ngày 9 đêm", availableSeats: 8, category: "Tour Châu Đại Dương/Úc", image: "tour-4.jpg", featured: false, description: "Hành trình đến với bối cảnh bộ phim Chúa tể những chiếc nhẫn." },
  { title: "Perth: Đảo Rottnest - Check-in cùng Quokka", city: "Perth", price: 45000000, duration: "6 ngày 5 đêm", availableSeats: 10, category: "Tour Châu Đại Dương/Úc", image: "tour-1.jpg", featured: false, description: "Gặp gỡ loài vật hạnh phúc nhất hành tinh tại Tây Úc." }
];

const seedDB = async () => {
  try {
    await Tour.deleteMany({});
    console.log("🗑️ Đã dọn dẹp dữ liệu cũ.");
    await Tour.insertMany(tours);
    console.log("🚀 Đã đổ xong 48 tour vào 12 danh mục! Web của Thái giờ cực xịn rồi!");
    process.exit();
  } catch (error) {
    console.error("❌ Lỗi:", error);
    process.exit(1);
  }
};

seedDB();