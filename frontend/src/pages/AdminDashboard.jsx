import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import API_BASE_URL from '../utils/apiConfig';
import { resolveImageUrl } from '../../public/assets/img/index/imagePath';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import Swal from 'sweetalert2'; 
import * as XLSX from 'xlsx'; 

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [tours, setTours] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [rentals, setRentals] = useState([]); // ĐÃ THÊM: STATE CHO THUÊ XE
  const [loading, setLoading] = useState(true);
  
  const [filterType, setFilterType] = useState('all'); 
  const [searchTerm, setSearchTerm] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    _id: '', title: '', city: '', price: '', duration: '', image: '', description: '', availableSeats: 20, startDate: '', endDate: '', category: '', featured: false
  });

  const [showBlogForm, setShowBlogForm] = useState(false);
  const [isEditingBlog, setIsEditingBlog] = useState(false);
  const [blogFormData, setBlogFormData] = useState({ _id: '', title: '', content: '', image: '', category: 'Cẩm Nang Du Lịch', featured: false });

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedTour, setSelectedTour] = useState(null);
  const [staffBookingForm, setStaffBookingForm] = useState({ tourId: '', name: '', email: '', phone: '', guestSize: 1, totalPrice: 0, paymentMethod: 'cash' });

  const [showUserForm, setShowUserForm] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [userFormData, setUserFormData] = useState({ _id: '', name: '', email: '', phone: '', password: '', role: 'user' });

  const [showImagePicker, setShowImagePicker] = useState(false);
  const [availableImages, setAvailableImages] = useState([
    'tour-1.jpg', 'tour-2.jpg', 'tour-3.jpg', 'tour-4.jpg', 'tour-5.jpg', 'tour-6.jpg',
    'ha-noi-en-370x370.jpg', 'Moc-Chau-370x370.jpg', 'ninh-binh-370x370.jpg',
    'CamPha_QuanNinh_Carousel.jpg', 'co-hong-da-lat-760x370.jpg', 'Vinh-ha-long.jpg',
    'anh-cau-rong-da-nang-phun-lua-dep_111044330.jpg', 'Bà-Nà-2.jpg', 'cau-vang-ba-na-hills.jpg',
    'han-quoc-370x370.jpg', 'tour-phansipan.png', 'about.png'
  ]);
  const [availableCategories, setAvailableCategories] = useState([]);

  const [userRole, setUserRole] = useState('user');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role || 'user');
      } catch (e) {
        setUserRole('user');
      }
    }
    fetchData(); 
  }, []);

  const menuItems = [
    { id: 'overview', icon: 'speedometer2', label: 'Tổng quan', roles: ['admin', 'staff'] }, 
    { id: 'tours', icon: 'map', label: 'Lịch trình Tour', roles: ['admin', 'staff'] }, 
    { id: 'bookings', icon: 'receipt', label: 'Quản lý Đoàn & Đơn', roles: ['admin', 'staff'] }, 
    { id: 'rentals', icon: 'car-front-fill', label: 'Yêu cầu Thuê xe', roles: ['admin', 'staff'] }, // ĐÃ THÊM: MENU THUÊ XE
    { id: 'blogs', icon: 'journal-text', label: 'Quản lý Blog', roles: ['admin', 'staff'] }, 
    { id: 'reviews', icon: 'star-half', label: 'Bình luận', roles: ['admin'] }, 
    { id: 'users', icon: 'people', label: 'Người dùng & Phân quyền', roles: ['admin'] }, 
    { id: 'revenue', icon: 'graph-up-arrow', label: 'Báo Cáo Thống Kê', roles: ['admin'] }
  ];

  const showNotification = (message, type = 'success') => {
    Swal.fire({
      icon: type === 'danger' ? 'error' : type,
      title: type === 'danger' ? 'Lỗi' : 'Thành công',
      text: message,
      timer: 2500,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const cfg = getAuthHeaders();
      // ĐÃ THÊM: GET API RENTALS VÀO MẢNG
      const [tourRes, bookRes, userRes, blogRes, reviewRes, catRes, rentalRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/tours`),
        axios.get(`${API_BASE_URL}/api/bookings`),
        axios.get(`${API_BASE_URL}/api/users`, cfg).catch(() => ({ data: { success: true, data: [] } })),
        axios.get(`${API_BASE_URL}/api/blogs`),
        axios.get(`${API_BASE_URL}/api/reviews/all`).catch(() => ({ data: { success: true, data: [] } })),
        axios.get(`${API_BASE_URL}/api/categories`).catch(() => ({ data: { success: true, data: [] } })),
        axios.get(`${API_BASE_URL}/api/rentals`, cfg).catch(() => ({ data: { success: true, data: [] } }))
      ]);

      setTours(tourRes.data.success ? tourRes.data.data : (tourRes.data || []));
      setBookings(bookRes.data.success ? bookRes.data.data : (bookRes.data || []));
      setUsers(userRes.data.success ? userRes.data.data : (userRes.data || []));
      setBlogs(blogRes.data.success ? blogRes.data.data : []);
      setReviews(reviewRes.data?.data || []);
      setAvailableCategories(catRes.data.success ? catRes.data.data.map(cat => cat.name) : []);
      setRentals(rentalRes.data?.data || []); // ĐÃ THÊM: GẮN DỮ LIỆU RENTALS
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = useMemo(() => {
    const today = new Date();
    return bookings.filter(b => {
      const bDate = new Date(b.createdAt);
      const matchesFilter = filterType === 'day' ? bDate.toDateString() === today.toDateString() :
                            filterType === 'month' ? (bDate.getMonth() === today.getMonth() && bDate.getFullYear() === today.getFullYear()) : true;
      const matchesSearch = b._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            b.tourId?.title?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [bookings, filterType, searchTerm]);

  const filteredTours = useMemo(() => {
    return tours.filter(t => (t.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                             (t.city || '').toLowerCase().includes(searchTerm.toLowerCase()));
  }, [tours, searchTerm]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
      (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter(b => (b.title || '').toLowerCase().includes(searchTerm.toLowerCase()));
  }, [blogs, searchTerm]);

  const revenueData = useMemo(() => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const paidBookings = bookings.filter(b => b.status === 'paid');

    const monthlyPaid = paidBookings.filter(b => {
      const d = new Date(b.createdAt);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    });
    const totalMonth = monthlyPaid.reduce((sum, b) => sum + (Number(b.totalPrice) || 0), 0);

    const todayPaid = paidBookings.filter(b => new Date(b.createdAt).toDateString() === now.toDateString());
    const totalToday = todayPaid.reduce((sum, b) => sum + (Number(b.totalPrice) || 0), 0);

    const tourCounts = {};
    paidBookings.forEach(b => {
      if (b.tourId?.title) {
        tourCounts[b.tourId.title] = (tourCounts[b.tourId.title] || 0) + 1;
      }
    });
    let popularTour = 'Chưa xác định';
    let maxCount = 0;
    Object.entries(tourCounts).forEach(([title, count]) => {
      if (count > maxCount) {
        maxCount = count;
        popularTour = title;
      }
    });

    return { totalMonth, totalToday, successCount: paidBookings.length, popularTour };
  }, [bookings]);

  const filteredRevenueBookings = useMemo(() => {
    let list = bookings.filter(b => b.status === 'paid');
    const today = new Date();

    if (filterType === 'day') {
      list = list.filter(b => new Date(b.createdAt).toDateString() === today.toDateString());
    } else if (filterType === 'month') {
      list = list.filter(b => {
        const d = new Date(b.createdAt);
        return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
      });
    }

    if (searchTerm) {
      list = list.filter(b => b._id.toLowerCase().includes(searchTerm.toLowerCase()) || (b.tourId?.title || '').toLowerCase().includes(searchTerm.toLowerCase()));
    }

    return list;
  }, [bookings, filterType, searchTerm]);

  const downloadExcel = (data, fileName) => {
    if(data.length === 0) return showNotification('Không có dữ liệu để xuất', 'warning');
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName}_${new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')}.xlsx`);
    showNotification('Tải file Excel thành công', 'success');
  };

  const exportUsersToExcel = () => {
    const dataToExport = filteredUsers.map((u, i) => ({
      "STT": i + 1,
      "Họ Tên": u.name || '',
      "Email": u.email || '',
      "Số Điện Thoại": u.phone || 'N/A',
      "Quyền Hạn": u.role === 'admin' ? 'Quản trị viên' : u.role === 'staff' ? 'Nhân viên' : 'Khách hàng'
    }));
    downloadExcel(dataToExport, "Danh_Sach_Nguoi_Dung");
  };

  const exportToursToExcel = () => {
    const dataToExport = filteredTours.map((t, i) => ({
      "STT": i + 1,
      "Tên Tour": t.title || '',
      "Thành Phố": t.city || '',
      "Giá Bán (VNĐ)": t.price || 0,
      "Thời Lượng": t.duration || '',
      "Danh Mục": t.category || '',
      "Trạng Thái": t.featured ? 'Nổi bật' : 'Bình thường'
    }));
    downloadExcel(dataToExport, "Danh_Sach_Tour");
  };

  const exportBookingsToExcel = () => {
    const dataToExport = filteredBookings.map((b, i) => ({
      "STT": i + 1,
      "Mã Đơn": '#' + String(b._id).substring(18).toUpperCase(),
      "Ngày Đặt": new Date(b.createdAt).toLocaleDateString('vi-VN'),
      "Khách Hàng": b.userId?.name || b.name || 'Khách vãng lai',
      "Số Điện Thoại": b.userId?.phone || b.phone || 'N/A',
      "Tên Tour": b.tourId?.title || 'Tour đã xóa',
      "Số Lượng Khách": b.guestSize || 1,
      "Tổng Tiền (VNĐ)": b.totalPrice || 0,
      "Trạng Thái": b.status === 'paid' ? 'Đã Thanh Toán' : b.status === 'cancelled' ? 'Đã Hủy' : 'Chờ Xử Lý'
    }));
    downloadExcel(dataToExport, "Lich_Su_Don_Dat_Tour");
  };

  const exportRevenueToExcel = () => {
    const dataToExport = filteredRevenueBookings.map((b, i) => ({
      "STT": i + 1,
      "Mã Đơn": '#' + String(b._id).substring(18).toUpperCase(),
      "Ngày Thanh Toán": new Date(b.createdAt).toLocaleDateString('vi-VN'),
      "Tên Khách Hàng": b.userId?.name || b.name || 'Khách vãng lai',
      "SĐT Liên Hệ": b.userId?.phone || b.phone || 'N/A',
      "Tour Đã Đặt": b.tourId?.title || 'Tour đã xóa',
      "Doanh Thu Mang Về (VNĐ)": b.totalPrice || 0,
      "Hình Thức": b.paymentMethod === 'vnpay' ? 'Cổng VNPay' : (b.paymentMethod === 'bank' ? 'Chuyển Khoản' : 'Tiền Mặt')
    }));
    downloadExcel(dataToExport, "Bao_Cao_Doanh_Thu_Chi_Tiet");
  };

  const handleBlogInputChange = (e) => setBlogFormData({...blogFormData, [e.target.name]: e.target.value});
  
  const handleSubmitBlog = async (e) => {
    e.preventDefault();
    try {
      const cfg = getAuthHeaders();
      if (!cfg) { showNotification('Bạn chưa đăng nhập hoặc token đã hết hạn!', 'danger'); return; }
      if (isEditingBlog) await axios.put(`${API_BASE_URL}/api/blogs/${blogFormData._id}`, blogFormData, cfg);
      else await axios.post(`${API_BASE_URL}/api/blogs`, blogFormData, cfg);
      showNotification('Lưu bài viết thành công!', 'success');
      setShowBlogForm(false); setIsEditingBlog(false); fetchData();
    } catch (error) { showNotification(`Lỗi khi lưu Blog: ${error.message}`, 'danger'); }
  };

  const handleDeleteBlog = async (id) => {
    Swal.fire({
      title: 'Xóa bài viết này?',
      text: "Hành động này không thể hoàn tác!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Đồng ý xóa'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const cfg = getAuthHeaders();
        if (!cfg) return showNotification('Bạn chưa đăng nhập!', 'danger');
        try { await axios.delete(`${API_BASE_URL}/api/blogs/${id}`, cfg); fetchData(); showNotification('Xóa bài viết thành công!', 'success'); }
        catch (error) { showNotification(`Lỗi xóa blog`, 'danger'); }
      }
    });
  };

  const handleDeleteReview = async (id) => {
    Swal.fire({ title: 'Xóa bình luận?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Xóa' }).then(async (result) => {
      if (result.isConfirmed) {
        try { await axios.delete(`${API_BASE_URL}/api/reviews/${id}`); fetchData(); showNotification('Xóa bình luận thành công!', 'success'); }
        catch (error) { showNotification('Lỗi xóa bình luận', 'danger'); }
      }
    });
  };

  const handleDeleteTour = async (id) => {
    if (userRole !== 'admin' && userRole !== 'staff') return showNotification('Chỉ Admin hoặc Nhân viên mới có quyền xóa Tour!', 'danger');
    Swal.fire({ title: 'Xóa Tour này?', text: "Tour sẽ biến mất khỏi hệ thống!", icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Xóa' }).then(async (result) => {
      if (result.isConfirmed) {
        const cfg = getAuthHeaders();
        if (!cfg) return showNotification('Bạn chưa đăng nhập!', 'danger');
        try { await axios.delete(`${API_BASE_URL}/api/tours/${id}`, cfg); fetchData(); showNotification('Xóa tour thành công!', 'success'); } 
        catch (error) { showNotification(`Xóa tour lỗi`, 'danger'); }
      }
    });
  };

  const handleUpdateStatus = async (id, newStatus) => {
    let actionText = newStatus === 'paid' ? 'Đã thanh toán (Hoàn tất)' : 'Hủy đơn hàng';
    Swal.fire({
      title: 'Cập nhật trạng thái?',
      text: `Chuyển đơn này sang: ${actionText}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: newStatus === 'paid' ? '#198754' : '#dc3545',
      confirmButtonText: 'Xác nhận'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try { 
          await axios.put(`${API_BASE_URL}/api/bookings/${id}`, { status: newStatus }); 
          showNotification('Cập nhật trạng thái thành công!', 'success'); 
          fetchData(); 
          setSelectedBooking(null); 
        } 
        catch (error) { showNotification('Lỗi cập nhật!', 'danger'); }
      }
    });
  };

  const handleDeleteUser = async (id) => { 
    Swal.fire({ title: 'Xóa tài khoản này?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Xóa' }).then(async (result) => {
      if (result.isConfirmed) {
        const cfg = getAuthHeaders();
        if (!cfg) return showNotification('Bạn chưa đăng nhập!', 'danger');
        try { await axios.delete(`${API_BASE_URL}/api/users/${id}`, cfg); fetchData(); showNotification('Xóa user thành công!', 'success'); } catch (e) { showNotification('Lỗi xóa user!', 'danger'); } 
      }
    });
  };

  // ĐÃ THÊM: HÀM CẬP NHẬT TRẠNG THÁI THUÊ XE
  const handleUpdateRental = async (id, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'processed' : 'pending';
    try {
      const cfg = getAuthHeaders();
      await axios.put(`${API_BASE_URL}/api/rentals/${id}`, { status: newStatus }, cfg);
      fetchData();
      showNotification('Cập nhật trạng thái thành công', 'success');
    } catch (error) { showNotification('Lỗi cập nhật', 'danger'); }
  };

  // ĐÃ THÊM: HÀM XÓA YÊU CẦU THUÊ XE
  const handleDeleteRental = async (id) => {
    Swal.fire({ title: 'Xóa yêu cầu này?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Xóa' }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const cfg = getAuthHeaders();
          await axios.delete(`${API_BASE_URL}/api/rentals/${id}`, cfg);
          fetchData();
          showNotification('Đã xóa yêu cầu', 'success');
        } catch (e) { showNotification('Lỗi xóa', 'danger'); }
      }
    });
  };

  const handleInputChange = (e) => { setFormData(prev => ({ ...prev, [e.target.name]: e.target.value })); };
  
  const resetForm = () => { 
    setFormData({ _id: '', title: '', city: '', price: '', duration: '', image: '', description: '', availableSeats: 20, startDate: '', endDate: '', category: '', featured: false }); 
    setIsEditing(false); 
    setShowForm(false); 
  };
  
  const handleEditClick = (tour) => { 
    setFormData({
      _id: tour._id || '',
      title: tour.title || '',
      city: tour.city || '',
      price: tour.price || '',
      duration: tour.duration || '',
      image: tour.image || '',
      description: tour.description || '',
      availableSeats: tour.availableSeats || 0,
      startDate: tour.startDate || '',
      endDate: tour.endDate || '',
      category: tour.category || '',
      featured: tour.featured || false
    }); 
    setIsEditing(true); 
    setShowForm(true); 
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const handleEditBlogClick = (b) => {
    setBlogFormData({
      _id: b._id || '',
      title: b.title || '',
      content: b.content || '',
      image: b.image || '',
      category: b.category || 'Cẩm Nang Du Lịch',
      featured: b.featured || false
    });
    setIsEditingBlog(true);
    setShowBlogForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const handleStaffBookingInputChange = (e) => {
    const { name, value } = e.target;
    setStaffBookingForm(prev => {
      const updated = { ...prev, [name]: name === 'guestSize' ? Number(value) : value };
      if (name === 'tourId' || name === 'guestSize') {
        const tour = tours.find(t => t._id === (name === 'tourId' ? value : prev.tourId));
        if (tour) {
          const guestSize = name === 'guestSize' ? Number(value) : Number(prev.guestSize);
          updated.totalPrice = guestSize * Number(tour.price || 0);
        } else {
          updated.totalPrice = 0;
        }
      }
      return updated;
    });
  };

  const resetStaffBookingForm = () => { setStaffBookingForm({ tourId: '', name: '', email: '', phone: '', guestSize: 1, totalPrice: 0, paymentMethod: 'cash' }); };

  const handleStaffBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      const { tourId, name, email, phone, guestSize, totalPrice, paymentMethod } = staffBookingForm;
      if (!tourId || !name || !phone || !guestSize || !totalPrice) {
        return showNotification('Vui lòng điền đầy đủ thông tin đặt tour cho khách.', 'danger');
      }
      await axios.post(`${API_BASE_URL}/api/bookings`, { tourId, name, email, phone, guestSize, totalPrice, paymentMethod });
      showNotification('Đã tạo đơn đặt tour cho khách hàng.', 'success');
      resetStaffBookingForm();
      fetchData();
    } catch (error) { showNotification(error.response?.data?.message || 'Lỗi khi tạo đơn đặt tour', 'danger'); }
  };

  const handleSubmitTour = async (e) => {
    e.preventDefault();
    try {
      const cfg = getAuthHeaders();
      if (!cfg) return showNotification('Bạn chưa đăng nhập!', 'danger');
      if (isEditing) await axios.put(`${API_BASE_URL}/api/tours/${formData._id}`, formData, cfg);
      else await axios.post(`${API_BASE_URL}/api/tours`, formData, cfg);
      resetForm(); fetchData(); showNotification('Lưu tour thành công!', 'success');
    } catch (error) { showNotification(`Lưu không thành công`, 'danger'); }
  };

  const handleUserInputChange = (e) => setUserFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  
  const resetUserForm = () => { 
    setUserFormData({ _id: '', name: '', email: '', phone: '', password: '', role: 'user' }); 
    setIsEditingUser(false); 
    setShowUserForm(false); 
  };
  
  const handleEditUserClick = (user) => { 
    setUserFormData({ 
      _id: user._id || '', 
      name: user.name || '', 
      email: user.email || '', 
      phone: user.phone || '', 
      password: '', 
      role: user.role || 'user' 
    }); 
    setIsEditingUser(true); 
    setShowUserForm(true); 
  };
  
  const handleSubmitUser = async (e) => {
    e.preventDefault();
    try {
      if (isEditingUser) {
        const cfg = getAuthHeaders();
        if (!cfg) return showNotification('Bạn chưa đăng nhập!', 'danger');
        await axios.put(`${API_BASE_URL}/api/users/${userFormData._id}`, userFormData, cfg);
      } else {
        await axios.post(`${API_BASE_URL}/api/auth/register`, userFormData);
      }
      resetUserForm(); fetchData(); showNotification('Lưu User thành công!', 'success');
    } catch (error) { showNotification(error.response?.data?.message || 'Lỗi lưu user!', 'danger'); }
  };

  const handleViewTour = (tour) => { setSelectedTour(tour); };
  const handleCloseTourModal = () => { setSelectedTour(null); };

  const stats = useMemo(() => {
    const paid = bookings.filter(b => b.status === 'paid');
    const totalRevenue = paid.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    return { totalRevenue, bookingTotal: bookings.length, tourCount: tours.length, userCount: users.length, blogCount: blogs.length };
  }, [bookings, tours, users, blogs]);

  const pieData = useMemo(() => {
    return [
      { name: 'Đã thanh toán', value: bookings.filter(b => b.status === 'paid').length },
      { name: 'Chờ xử lý', value: bookings.filter(b => b.status === 'pending' || b.status === 'pending_confirmation').length },
      { name: 'Đã hủy', value: bookings.filter(b => b.status === 'cancelled').length },
    ];
  }, [bookings]);
  const COLORS = ['#198754', '#ffc107', '#dc3545']; 

  const selectedBookingStats = useMemo(() => {
    if (!selectedBooking || !selectedBooking.tourId?._id) return null;
    const tourId = String(selectedBooking.tourId._id);
    const tourBookings = bookings.filter(b => String(b.tourId?._id) === tourId);
    const bookedSeats = tourBookings.filter(b => b.status !== 'cancelled').reduce((sum, b) => sum + (b.guestSize || 0), 0);
    const pendingSeats = tourBookings.filter(b => b.status === 'pending').reduce((sum, b) => sum + (b.guestSize || 0), 0);
    const totalSeats = Number(selectedBooking.tourId.availableSeats || 0);
    return { totalSeats, bookedSeats, pendingSeats, remainingSeats: Math.max(totalSeats - bookedSeats, 0), tourBookingsCount: tourBookings.length };
  }, [selectedBooking, bookings]);

  const selectedTourStats = useMemo(() => {
    if (!selectedTour || !selectedTour._id) return null;
    const tourId = String(selectedTour._id);
    const tourBookings = bookings.filter(b => String(b.tourId?._id) === tourId);
    const bookedSeats = tourBookings.filter(b => b.status !== 'cancelled').reduce((sum, b) => sum + (b.guestSize || 0), 0);
    const pendingSeats = tourBookings.filter(b => b.status === 'pending').reduce((sum, b) => sum + (b.guestSize || 0), 0);
    const totalSeats = Number(selectedTour.availableSeats || 0);
    const canceledSeats = tourBookings.filter(b => b.status === 'cancelled').reduce((sum, b) => sum + (b.guestSize || 0), 0);
    return { totalSeats, bookedSeats, pendingSeats, canceledSeats, remainingSeats: Math.max(totalSeats - bookedSeats, 0), totalBookings: tourBookings.length };
  }, [selectedTour, bookings]);

  if (loading) return (
    <div className="bg-light pb-5" style={{ minHeight: '100vh' }}>
      <div className="container-fluid px-4 mt-4">
        <div className="row g-4">
          <div className="col-12 col-lg-3 col-xl-2">
            <div className="skeleton shadow-sm" style={{ height: '80vh', borderRadius: '15px' }}></div>
          </div>
          
          <div className="col-12 col-lg-9 col-xl-10">
            <div className="skeleton mb-4" style={{ height: '40px', width: '30%', borderRadius: '8px' }}></div>
            
            <div className="row g-4 mb-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="col-md-4">
                  <div className="skeleton shadow-sm" style={{ height: '120px', borderRadius: '15px' }}></div>
                </div>
              ))}
            </div>
            
            <div className="row g-4">
              <div className="col-md-6">
                <div className="skeleton shadow-sm" style={{ height: '350px', borderRadius: '15px' }}></div>
              </div>
              <div className="col-md-6">
                <div className="skeleton shadow-sm" style={{ height: '350px', borderRadius: '15px' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-light pb-5" style={{ minHeight: '100vh', position: 'relative' }}>
      <style>{`
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1050; display: flex; justify-content: center; align-items: center; } 
        .modal-box { background: white; border-radius: 16px; width: 90%; max-width: 500px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.2); animation: scaleIn 0.3s ease; } @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
      
      <div className="container-fluid px-4 mt-4">
        <div className="row g-4">
          
          {/* ===================== SIDEBAR ===================== */}
          <div className="col-12 col-lg-3 col-xl-2">
            <div className="bg-dark text-white rounded-4 shadow-sm overflow-hidden sticky-top" style={{top: '75px'}}>
              <div className="p-4 text-center border-bottom border-secondary">
                <div className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 ${userRole === 'admin' ? 'bg-danger' : 'bg-info'}`} style={{width:'50px', height:'50px'}}>
                  <i className={`bi fs-3 text-white ${userRole === 'admin' ? 'bi-shield-lock-fill' : 'bi-person-badge'}`}></i>
                </div>
                <h6 className="fw-bold mb-0 small">
                  {userRole === 'admin' ? 'HỆ THỐNG QUẢN TRỊ' : 'TRANG NHÂN VIÊN'}
                </h6>
                <span className="badge bg-secondary mt-2">{userRole === 'admin' ? 'Admin' : 'Staff'}</span>
              </div>
              <div className="py-2">
                {menuItems.filter(item => item.roles.includes(userRole)).map(item => (
                  <div key={item.id} className={`p-3 cursor-pointer ${activeTab === item.id ? 'bg-info text-white' : ''}`} onClick={() => {setActiveTab(item.id); setSearchTerm('');}} style={{cursor: 'pointer'}}>
                    <i className={`bi bi-${item.icon} me-2`}></i> {item.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-9 col-xl-10">
            {/* OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="animation-fade-in">
                <h4 className="fw-bold mb-4">Chào {userRole === 'admin' ? 'Admin' : 'bạn'}, hôm nay công việc thế nào?</h4>
                <div className="row g-4">
                  {[{ label: 'Tổng số Tour', val: stats.tourCount, icon: 'map', color: 'primary' }, { label: 'Đơn đặt / Thông tin đoàn', val: stats.bookingTotal, icon: 'cart-check', color: 'success' }, { label: 'Thành viên', val: stats.userCount, icon: 'people', color: 'warning' }].map((item, idx) => (
                    <div className="col-md-4" key={idx}>
                      <div className={`card border-0 shadow-sm rounded-4 p-4 bg-${item.color} text-white position-relative`}>
                        <small className="opacity-75">{item.label}</small>
                        <h2 className="fw-bold mb-0 mt-2">{item.val}</h2>
                        <i className={`bi bi-${item.icon} position-absolute end-0 bottom-0 p-3 opacity-25 fs-1`}></i>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="row mt-5">
                  <div className="col-md-6 mb-4">
                    <div className="card border-0 shadow-sm rounded-4 h-100 p-4">
                      <h5 className="fw-bold text-secondary mb-4">Tỷ lệ Trạng thái Đơn hàng</h5>
                      <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                              {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <RechartsTooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6 mb-4">
                    <div className="card border-0 shadow-sm rounded-4 h-100 p-4 bg-info text-white">
                      <h5 className="fw-bold mb-4"><i className="bi bi-lightbulb-fill text-warning me-2"></i>Phân tích hệ thống</h5>
                      <p>Hiện tại hệ thống đang có <strong>{tours.length}</strong> tour đang mở bán.</p>
                      <p>Tỷ lệ đơn hàng thanh toán thành công đạt <strong>{bookings.length > 0 ? Math.round((pieData[0].value / bookings.length) * 100) : 0}%</strong>.</p>
                      <p>Hệ thống tự động hủy đơn (Cron Job) hoạt động ổn định giúp giải phóng các ghế giữ chỗ quá thời gian quy định.</p>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* QUẢN LÝ LỊCH TRÌNH TOUR */}
            {activeTab === 'tours' && (
              <div className="animation-fade-in">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="fw-bold mb-0">{userRole === 'admin' ? 'Quản lý Tour' : 'Xem Lịch trình Tour'}</h4>
                  <div className="d-flex gap-2">
                    {(userRole === 'admin' || userRole === 'staff') && (
                      <>
                        <button className="btn btn-outline-success rounded-pill px-3 shadow-sm fw-bold" onClick={exportToursToExcel}>
                          <i className="bi bi-file-earmark-excel-fill me-1"></i> Xuất Excel
                        </button>
                        <button className="btn btn-info text-white rounded-pill px-4 shadow-sm" onClick={() => setShowForm(!showForm)}>
                          {showForm ? 'Đóng form' : '+ Thêm mới'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                {showForm && (userRole === 'admin' || userRole === 'staff') && (
                  <div className="card border-0 shadow-sm p-4 mb-4 rounded-4 border-top border-info border-4">
                    <h5 className="fw-bold mb-3">{isEditing ? 'Cập nhật Tour' : 'Thêm Tour mới'}</h5>
                    <form onSubmit={handleSubmitTour}>
                      <div className="row g-3">
                        <div className="col-md-6"><label className="small fw-bold">Tên Tour</label><input type="text" className="form-control" name="title" value={formData.title || ''} onChange={handleInputChange} required /></div>
                        <div className="col-md-6"><label className="small fw-bold">Thành phố</label><input type="text" className="form-control" name="city" value={formData.city || ''} onChange={handleInputChange} required /></div>
                        <div className="col-md-3"><label className="small fw-bold">Giá (VNĐ)</label><input type="number" className="form-control" name="price" value={formData.price || ''} onChange={handleInputChange} required /></div>
                        <div className="col-md-3"><label className="small fw-bold">Thời lượng tour</label><input type="text" className="form-control" name="duration" value={formData.duration || ''} onChange={handleInputChange} placeholder="VD: 3 ngày 2 đêm" required /></div>
                        <div className="col-md-3"><label className="small fw-bold">Ghế trống</label><input type="number" className="form-control" name="availableSeats" value={formData.availableSeats || ''} onChange={handleInputChange} required /></div>
                        <div className="col-md-3"><label className="small fw-bold">Danh mục</label><select className="form-select" name="category" value={formData.category || ''} onChange={handleInputChange} required><option value="">-- Chọn danh mục --</option>{availableCategories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}</select></div>
                        <div className="col-md-6"><label className="small fw-bold">Ngày khởi hành</label><input type="text" className="form-control" name="startDate" value={formData.startDate || ''} onChange={handleInputChange} placeholder="VD: Thứ 7 hàng tuần" required /></div>
                        <div className="col-md-6"><label className="small fw-bold">Ngày kết thúc</label><input type="text" className="form-control" name="endDate" value={formData.endDate || ''} onChange={handleInputChange} placeholder="VD: Chủ nhật hàng tuần" required /></div>
                        <div className="col-md-12">
                          <label className="small fw-bold">Chọn Ảnh</label>
                          <div className="d-flex gap-2">
                            <input type="text" className="form-control" name="image" value={formData.image || ''} onChange={handleInputChange} placeholder="VD: tour-1.jpg hoặc /assets/img/index/tour-1.jpg" required />
                            <button type="button" className="btn btn-outline-info rounded-pill px-3" onClick={() => setShowImagePicker(!showImagePicker)}><i className="bi bi-image"></i> Chọn</button>
                          </div>
                          {formData.image && <div className="mt-2"><img src={formData.image.includes('/') ? resolveImageUrl(formData.image) : `/assets/img/index/${formData.image}`} alt="Preview" className="rounded" style={{width:'100px', height:'70px', objectFit:'cover'}} onError={(e) => {e.target.style.display='none'}} /></div>}
                        </div>
                        {showImagePicker && (
                          <div className="col-12 border rounded-3 p-3 bg-light">
                            <label className="small fw-bold mb-3 d-block">Chọn ảnh từ thư viện (Nhấp để chọn):</label>
                            <div className="row g-2">
                              {availableImages.map((img) => (
                                <div key={img} className="col-md-3 col-sm-4 col-6">
                                  <div
                                    className={`position-relative rounded-2 cursor-pointer overflow-hidden ${formData.image === img ? 'border-4 border-success' : 'border-1 border-secondary'}`}
                                    onClick={() => { setFormData({...formData, image: img}); setShowImagePicker(false); }}
                                    style={{cursor: 'pointer', aspectRatio: '3/2'}}
                                  >
                                    <img src={`/assets/img/index/${img}`} alt={img} style={{width:'100%', height:'100%', objectFit:'cover'}} />
                                    {formData.image === img && <i className="bi bi-check-circle-fill" style={{position:'absolute', bottom:'5px', right:'5px', color:'#10b981', fontSize:'20px', textShadow: '0 0 2px white'}}></i>}
                                  </div>
                                  <small className="text-muted text-center d-block text-truncate mt-1">{img}</small>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="col-12"><label className="small fw-bold">Mô tả Tour</label><textarea className="form-control" name="description" rows="4" value={formData.description || ''} onChange={handleInputChange} required></textarea></div>
                      </div>
                      <div className="d-flex gap-2 mt-4">
                        <button type="submit" className="btn btn-info text-white rounded-pill px-5 fw-bold flex-grow-1">{isEditing ? 'Cập nhật' : 'Thêm mới'}</button>
                        <button type="button" className="btn btn-outline-secondary rounded-pill px-5 fw-bold" onClick={resetForm}>Hủy</button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light"><tr><th>ẢNH</th><th>TÊN TOUR</th><th>LỊCH TRÌNH</th><th>TRẠNG THÁI</th><th className="text-center">HÀNH ĐỘNG</th></tr></thead>
                    <tbody>
                      {filteredTours.map(t => (
                        <tr key={t._id}>
                          <td><img src={resolveImageUrl(t.image)} className="rounded" style={{width:'50px', height:'35px', objectFit:'cover'}} /></td>
                          <td className="fw-bold">{t.title || 'Tour không tên'}</td>
                          <td className="text-muted small">
                            Khởi hành: <strong className="text-dark">{t.startDate || '---'}</strong><br/>
                            Kết thúc: <strong className="text-dark">{t.endDate || '---'}</strong><br/>
                            Chỗ trống: <strong className="text-danger">{t.availableSeats || 0}</strong> ghế
                          </td>
                          <td>
                            <span className={`badge ${t.availableSeats > 0 ? 'bg-success' : 'bg-danger'}`}>{t.availableSeats > 0 ? 'Còn chỗ' : 'Đã Đầy'}</span>
                          </td>
                          <td className="text-center">
                            <button className="btn btn-sm btn-info text-white rounded-pill me-2" onClick={() => handleViewTour(t)} title="Xem chi tiết tour"><i className="bi bi-eye"></i> Xem</button>
                            {(userRole === 'admin' || userRole === 'staff') && (
                              <>
                                <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEditClick(t)}><i className="bi bi-pencil"></i></button>
                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteTour(t._id)}><i className="bi bi-trash"></i></button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* QUẢN LÝ ĐOÀN & ĐƠN HÀNG */}
            {activeTab === 'bookings' && (
              <div className="animation-fade-in">
                {(userRole === 'staff' || userRole === 'admin') && (
                  <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="fw-bold mb-0">Đặt tour trực tiếp cho khách</h5>
                    </div>
                    <form className="row g-3" onSubmit={handleStaffBookingSubmit}>
                      <div className="col-md-6">
                        <label className="small fw-bold">Chọn Tour</label>
                        <select className="form-select" name="tourId" value={staffBookingForm.tourId || ''} onChange={handleStaffBookingInputChange} required>
                          <option value="">-- Chọn tour --</option>
                          {tours.map(t => (
                            <option key={t._id} value={t._id}>{t.title} - {t.city} ({Number(t.price || 0).toLocaleString()}đ)</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-3">
                        <label className="small fw-bold">Số khách</label>
                        <input type="number" className="form-control" name="guestSize" min="1" value={staffBookingForm.guestSize || ''} onChange={handleStaffBookingInputChange} required />
                      </div>
                      <div className="col-md-3">
                        <label className="small fw-bold">Tổng tiền (VNĐ)</label>
                        <input type="text" readOnly className="form-control" value={staffBookingForm.totalPrice ? staffBookingForm.totalPrice.toLocaleString() + ' đ' : '0 đ'} />
                      </div>
                      <div className="col-md-6"><label className="small fw-bold">Tên khách</label><input type="text" className="form-control" name="name" value={staffBookingForm.name || ''} onChange={handleStaffBookingInputChange} required /></div>
                      <div className="col-md-3"><label className="small fw-bold">Điện thoại</label><input type="text" className="form-control" name="phone" value={staffBookingForm.phone || ''} onChange={handleStaffBookingInputChange} required /></div>
                      <div className="col-md-3"><label className="small fw-bold">Email</label><input type="email" className="form-control" name="email" value={staffBookingForm.email || ''} onChange={handleStaffBookingInputChange} /></div>
                      <div className="col-12 d-flex gap-2 justify-content-end">
                        <button type="button" className="btn btn-outline-secondary rounded-pill" onClick={resetStaffBookingForm}>Xóa dữ liệu</button>
                        <button type="submit" className="btn btn-info text-white rounded-pill px-4">Tạo đơn</button>
                      </div>
                    </form>
                  </div>
                )}

              <div className="card border-0 shadow-sm rounded-4 p-4 overflow-hidden">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="fw-bold mb-0">Danh sách Đoàn / Khách đặt</h4>
                  <button className="btn btn-outline-success rounded-pill px-3 shadow-sm fw-bold" onClick={exportBookingsToExcel}>
                    <i className="bi bi-file-earmark-excel-fill me-1"></i> Xuất Excel
                  </button>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover align-middle small mb-0">
                    <thead className="table-light text-muted"><tr><th>MÃ ĐƠN</th><th>THÔNG TIN KHÁCH/ĐOÀN</th><th>TOUR</th><th>TIỀN</th><th>TRẠNG THÁI</th><th className="text-center">CẬP NHẬT TRẠNG THÁI</th></tr></thead>
                    <tbody>
                      {filteredBookings.map(b => (
                        <tr key={b._id}>
                          <td className="fw-bold">#{String(b._id).substring(18).toUpperCase()}</td>
                          <td>
                            <div className="fw-bold text-primary">{b.userId?.name || b.name || 'Khách vãng lai'}</div>
                            <div className="text-muted" style={{fontSize: '11px'}}><i className="bi bi-telephone-fill me-1"></i>{b.userId?.phone || b.phone || 'N/A'}</div>
                          </td>
                          <td className="text-truncate" style={{maxWidth: '180px'}}>{b.tourId?.title || 'Tour đã bị xóa hoặc không rõ'}</td>
                          <td className="fw-bold text-danger">{Number(b.totalPrice || 0).toLocaleString()}đ</td>
                          <td><span className={`badge rounded-pill px-3 py-2 ${b.status === 'paid' ? 'bg-success' : b.status === 'cancelled' ? 'bg-danger' : 'bg-warning text-dark'}`}>{b.status === 'paid' ? 'Đã Thanh Toán' : b.status === 'cancelled' ? 'Đã hủy' : 'Chờ xử lý'}</span></td>
                          
                          <td className="text-center">
                            <div className="d-flex justify-content-center gap-1">
                              {b.status !== 'paid' && b.status !== 'cancelled' && (
                                <>
                                  <button className="btn btn-sm btn-success rounded-pill" onClick={() => handleUpdateStatus(b._id, 'paid')} title="Đánh dấu Hoàn Tất"><i className="bi bi-check-lg"></i></button>
                                  <button className="btn btn-sm btn-danger rounded-pill" onClick={() => handleUpdateStatus(b._id, 'cancelled')} title="Hủy đơn"><i className="bi bi-x-lg"></i></button>
                                </>
                              )}
                              <button className="btn btn-sm btn-info text-white rounded-pill" onClick={() => setSelectedBooking(b)} title="Xem chi tiết Đoàn"><i className="bi bi-eye"></i></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              </div>
            )}

            {/* QUẢN LÝ NGƯỜI DÙNG */}
            {activeTab === 'users' && userRole === 'admin' && (
              <div className="animation-fade-in">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="fw-bold mb-0">Phân quyền & Quản lý Người dùng</h4>
                  <div className="d-flex gap-2">
                    <button className="btn btn-outline-success rounded-pill px-3 shadow-sm fw-bold" onClick={exportUsersToExcel}>
                      <i className="bi bi-file-earmark-excel-fill me-1"></i> Xuất Excel
                    </button>
                    <button className="btn btn-info text-white rounded-pill px-4 shadow-sm" onClick={() => {setShowUserForm(!showUserForm); setIsEditingUser(false); setUserFormData({ _id: '', name: '', email: '', phone: '', password: '', role: 'user' })}}>
                      {showUserForm ? 'Đóng form' : '+ Thêm Tài khoản'}
                    </button>
                  </div>
                </div>

                {showUserForm && (
                  <div className="card border-0 shadow-sm p-4 mb-4 rounded-4 border-top border-info border-4">
                    <h5 className="fw-bold mb-3">{isEditingUser ? 'Cập nhật Quyền' : 'Cấp Tài khoản mới'}</h5>
                    <form onSubmit={handleSubmitUser}>
                      <div className="row g-3">
                        <div className="col-md-6"><label className="small fw-bold">Họ tên</label><input type="text" className="form-control" name="name" value={userFormData.name || ''} onChange={handleUserInputChange} required /></div>
                        <div className="col-md-6"><label className="small fw-bold">Email</label><input type="email" className="form-control" name="email" value={userFormData.email || ''} onChange={handleUserInputChange} disabled={isEditingUser} required /></div>
                        <div className="col-md-6"><label className="small fw-bold">Số điện thoại</label><input type="text" className="form-control" name="phone" value={userFormData.phone || ''} onChange={handleUserInputChange} /></div>
                        
                        <div className="col-md-3">
                          <label className="small fw-bold">Phân quyền</label>
                          <select className="form-select border-info" name="role" value={userFormData.role || 'user'} onChange={handleUserInputChange}>
                            <option value="user">Khách hàng (User)</option>
                            <option value="staff">Nhân viên (Staff)</option>
                            <option value="admin">Quản trị viên (Admin)</option>
                          </select>
                        </div>

                        {!isEditingUser && <div className="col-md-3"><label className="small fw-bold">Mật khẩu</label><input type="password" className="form-control" name="password" value={userFormData.password || ''} onChange={handleUserInputChange} required /></div>}
                      </div>
                      <button type="submit" className="btn btn-info text-white mt-4 rounded-pill px-5 fw-bold shadow-sm">{isEditingUser ? 'Cập nhật' : 'Khởi tạo Tài khoản'}</button>
                    </form>
                  </div>
                )}

                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light small"><tr><th>STT</th><th>HỌ TÊN</th><th>EMAIL</th><th>PHÂN QUYỀN</th><th className="text-center">THAO TÁC</th></tr></thead>
                    <tbody>
                      {filteredUsers.map((u, i) => (
                        <tr key={u._id}>
                          <td className="text-muted">{i + 1}</td>
                          <td className="fw-bold">{u.name || 'N/A'}</td>
                          <td className="small">{u.email || 'N/A'}</td>
                          <td>
                            <span className={`badge px-3 py-2 rounded-pill ${u.role === 'admin' ? 'bg-danger' : u.role === 'staff' ? 'bg-primary' : 'bg-secondary'}`}>
                              {u.role === 'admin' ? 'Admin' : u.role === 'staff' ? 'Nhân viên' : 'Khách hàng'}
                            </span>
                          </td>
                          <td className="text-center">
                            <button className="btn btn-sm btn-outline-primary me-2 rounded-circle" onClick={() => handleEditUserClick(u)}><i className="bi bi-pencil"></i></button>
                            <button className="btn btn-sm btn-outline-danger rounded-circle" onClick={() => handleDeleteUser(u._id)}><i className="bi bi-trash"></i></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* QUẢN LÝ BLOG */}
            {activeTab === 'blogs' && (userRole === 'admin' || userRole === 'staff') && (
              <div className="animation-fade-in">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="fw-bold mb-0">Quản lý bài viết Blog</h4>
                  <button className="btn btn-info text-white rounded-pill px-4" onClick={() => {setShowBlogForm(!showBlogForm); setIsEditingBlog(false); setBlogFormData({title:'', content:'', image:'', category:'Cẩm Nang Du Lịch', featured:false})}}>
                    {showBlogForm ? 'Đóng' : '+ Viết bài mới'}
                  </button>
                </div>
                {showBlogForm && (
                  <div className="card border-0 shadow-sm p-4 mb-4 rounded-4 border-top border-info border-4">
                    <form onSubmit={handleSubmitBlog}>
                      <div className="row g-3">
                        <div className="col-md-8"><label className="small fw-bold">Tiêu đề bài viết</label><input type="text" className="form-control" name="title" value={blogFormData.title || ''} onChange={handleBlogInputChange} required /></div>
                        <div className="col-md-4"><label className="small fw-bold">Danh mục</label><select className="form-select" name="category" value={blogFormData.category || ''} onChange={handleBlogInputChange}><option value="Cẩm Nang Du Lịch">Cẩm Nang Du Lịch</option><option value="Kinh nghiệm">Kinh nghiệm</option><option value="Tin tức">Tin tức</option></select></div>
                        <div className="col-md-12">
                          <label className="small fw-bold">Chọn Ảnh Bìa</label>
                          <div className="d-flex gap-2">
                            <input type="text" className="form-control" name="image" value={blogFormData.image || ''} onChange={handleBlogInputChange} placeholder="/assets/img/index/ten-anh.jpg" required />
                            <button type="button" className="btn btn-outline-info rounded-pill px-3" onClick={() => setShowImagePicker(!showImagePicker)}><i className="bi bi-image"></i> Chọn</button>
                          </div>
                          {blogFormData.image && <div className="mt-2"><img src={blogFormData.image} alt="Preview" className="rounded" style={{width:'100px', height:'70px', objectFit:'cover'}} /></div>}
                        </div>
                        {showImagePicker && (
                          <div className="col-12 border rounded-3 p-3 bg-light">
                            <label className="small fw-bold mb-3 d-block">Chọn ảnh từ thư viện (Nhấp để chọn):</label>
                            <div className="row g-2">
                              {availableImages.map((img) => (
                                <div key={img} className="col-md-3 col-sm-4 col-6">
                                  <div
                                    className={`position-relative rounded-2 cursor-pointer overflow-hidden ${blogFormData.image === `/assets/img/index/${img}` ? 'border-4 border-success' : 'border-1 border-secondary'}`}
                                    onClick={() => { setBlogFormData({...blogFormData, image: `/assets/img/index/${img}`}); setShowImagePicker(false); }}
                                    style={{cursor: 'pointer', aspectRatio: '3/2'}}
                                  >
                                    <img src={`/assets/img/index/${img}`} alt={img} style={{width:'100%', height:'100%', objectFit:'cover'}} />
                                    {blogFormData.image === `/assets/img/index/${img}` && <i className="bi bi-check-circle-fill" style={{position:'absolute', bottom:'5px', right:'5px', color:'#10b981', fontSize:'20px', textShadow: '0 0 2px white'}}></i>}
                                  </div>
                                  <small className="text-muted text-center d-block text-truncate mt-1">{img}</small>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="col-12"><label className="small fw-bold">Nội dung bài viết</label><textarea className="form-control" name="content" rows="5" value={blogFormData.content || ''} onChange={handleBlogInputChange} required></textarea></div>
                      </div>
                      <button type="submit" className="btn btn-info text-white w-100 mt-3 rounded-pill fw-bold">ĐĂNG BÀI</button>
                    </form>
                  </div>
                )}
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light"><tr><th>ẢNH</th><th>TIÊU ĐỀ</th><th>DANH MỤC</th><th>NGÀY ĐĂNG</th><th className="text-center">HÀNH ĐỘNG</th></tr></thead>
                    <tbody>
                      {filteredBlogs.map(b => (
                        <tr key={b._id}>
                          <td><img src={b.image} className="rounded" style={{width:'50px', height:'35px', objectFit:'cover'}} /></td>
                          <td className="fw-bold text-truncate" style={{maxWidth:'300px'}}>{b.title || 'Bài viết không tên'}</td>
                          <td><span className="badge bg-light text-dark">{b.category || 'Không rõ'}</span></td>
                          <td>{b.createdAt ? new Date(b.createdAt).toLocaleDateString('vi-VN') : '---'}</td>
                          <td className="text-center">
                            <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEditBlogClick(b)}><i className="bi bi-pencil"></i></button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteBlog(b._id)}><i className="bi bi-trash"></i></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* QUẢN LÝ BÌNH LUẬN */}
            {activeTab === 'reviews' && userRole === 'admin' && (
              <div className="animation-fade-in card border-0 shadow-sm rounded-4 p-4">
                <h4 className="fw-bold mb-4">Quản lý Đánh giá & Bình luận</h4>
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light"><tr><th>KHÁCH HÀNG</th><th>TOUR/BLOG</th><th>SAO</th><th>NỘI DUNG</th><th>NGÀY</th><th className="text-center">HÀNH ĐỘNG</th></tr></thead>
                    <tbody>
                      {reviews.map(r => (
                        <tr key={r._id}>
                          <td><strong>{r.userId?.name || 'Ẩn danh'}</strong></td>
                          <td className="small">{r.tourId?.title || r.blogId?.title || 'Đã bị xóa'}</td>
                          <td><span className="text-warning fw-bold">{r.rating || 5} <i className="bi bi-star-fill"></i></span></td>
                          <td className="small text-muted">{r.comment || ''}</td>
                          <td style={{fontSize:'12px'}}>{r.createdAt ? new Date(r.createdAt).toLocaleDateString('vi-VN') : '---'}</td>
                          <td className="text-center">
                            <button className="btn btn-sm btn-danger rounded-pill" onClick={() => handleDeleteReview(r._id)}><i className="bi bi-trash"></i> Xóa</button>
                          </td>
                        </tr>
                      ))}
                      {reviews.length === 0 && <tr><td colSpan="6" className="text-center py-4 text-muted">Chưa có bình luận nào để quản lý.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ĐÃ THÊM: GIAO DIỆN QUẢN LÝ YÊU CẦU THUÊ XE */}
            {activeTab === 'rentals' && (userRole === 'admin' || userRole === 'staff') && (
              <div className="animation-fade-in card border-0 shadow-sm rounded-4 p-4">
                <h4 className="fw-bold mb-4"><i className="bi bi-car-front text-info me-2"></i>Quản lý Yêu cầu Thuê xe</h4>
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light"><tr><th>NGÀY GỬI</th><th>KHÁCH HÀNG</th><th>DÒNG XE</th><th>NGÀY ĐI</th><th>TRẠNG THÁI</th><th className="text-center">HÀNH ĐỘNG</th></tr></thead>
                    <tbody>
                      {rentals.map(r => (
                        <tr key={r._id}>
                          <td className="small text-muted">{new Date(r.createdAt).toLocaleDateString('vi-VN')}</td>
                          <td>
                            <div className="fw-bold text-dark">{r.name}</div>
                            <div className="small text-muted"><i className="bi bi-telephone-fill me-1"></i>{r.phone}</div>
                          </td>
                          <td className="fw-bold text-primary">{r.carType}</td>
                          <td className="text-danger fw-bold">{r.date}</td>
                          <td>
                            <span className={`badge rounded-pill px-3 py-2 ${r.status === 'processed' ? 'bg-success' : 'bg-warning text-dark'}`}>
                              {r.status === 'processed' ? 'Đã liên hệ' : 'Chờ gọi điện'}
                            </span>
                          </td>
                          <td className="text-center">
                            <button className={`btn btn-sm me-2 rounded-circle ${r.status === 'processed' ? 'btn-outline-secondary' : 'btn-success'}`} onClick={() => handleUpdateRental(r._id, r.status)} title="Đổi trạng thái">
                              <i className="bi bi-check2-all"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-danger rounded-circle" onClick={() => handleDeleteRental(r._id)}><i className="bi bi-trash"></i></button>
                          </td>
                        </tr>
                      ))}
                      {rentals.length === 0 && <tr><td colSpan="6" className="text-center py-4 text-muted">Chưa có yêu cầu thuê xe nào.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* BÁO CÁO DOANH THU */}
            {activeTab === 'revenue' && userRole === 'admin' && (
              <div className="animation-fade-in">
                
                <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 rounded-pill shadow-sm">
                  <div className="d-flex align-items-center w-50 px-3 border-end">
                    <i className="bi bi-search text-muted me-2"></i>
                    <input type="text" className="form-control border-0 shadow-none bg-transparent" placeholder="Tìm kiếm mã đơn hoặc tên tour..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  </div>
                  <div className="btn-group pe-2">
                    <button className={`btn btn-sm ${filterType === 'all' ? 'btn-info text-white fw-bold' : 'btn-light text-muted'}`} onClick={() => setFilterType('all')}>Tất cả</button>
                    <button className={`btn btn-sm ${filterType === 'day' ? 'btn-info text-white fw-bold' : 'btn-light text-muted'}`} onClick={() => setFilterType('day')}>Hôm nay</button>
                    <button className={`btn btn-sm ${filterType === 'month' ? 'btn-info text-white fw-bold' : 'btn-light text-muted'}`} onClick={() => setFilterType('month')}>Tháng này</button>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="fw-bold mb-0 text-dark"><i className="bi bi-graph-up-arrow text-primary me-2"></i>Báo Cáo Doanh Thu</h4>
                  <button className="btn btn-success fw-bold shadow-sm rounded-pill px-4" onClick={exportRevenueToExcel}>
                    <i className="bi bi-file-earmark-excel-fill me-2"></i> Xuất Báo Cáo Excel
                  </button>
                </div>
                
                <div className="row g-3 mb-4">
                  <div className="col-md-3">
                    <div className="rev-card rev-card-blue">
                      <div className="stat-label"><i className="bi bi-currency-dollar me-1"></i>DOANH THU THÁNG</div>
                      <div className="stat-value">{revenueData.totalMonth.toLocaleString()} VNĐ</div>
                      <div className="stat-sub"><i className="bi bi-arrow-up-short"></i> Cập nhật liên tục</div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="rev-card rev-card-white">
                      <div className="stat-label text-muted"><i className="bi bi-calendar-day me-1"></i>DOANH THU HÔM NAY</div>
                      <div className="stat-value text-dark">{revenueData.totalToday.toLocaleString()} VNĐ</div>
                      <div className="stat-sub text-success"><i className="bi bi-activity"></i> Hôm nay</div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="rev-card rev-card-green">
                      <div className="stat-label"><i className="bi bi-check-circle me-1"></i>ĐƠN THÀNH CÔNG</div>
                      <div className="stat-value">{revenueData.successCount}</div>
                      <div className="stat-sub">Đã thu tiền</div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="rev-card rev-card-white">
                      <div className="stat-label text-muted"><i className="bi bi-star me-1"></i>TOUR PHỔ BIẾN</div>
                      <div className="stat-value text-dark fs-5 text-truncate" title={revenueData.popularTour}>{revenueData.popularTour}</div>
                      <div className="stat-sub text-muted">Dựa trên lượt đặt</div>
                    </div>
                  </div>
                </div>

                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light text-muted small">
                      <tr><th>Mã Đơn</th><th>Ngày Đặt</th><th>Tên Tour</th><th>Khách Hàng</th><th>Tổng Tiền</th><th>Trạng Thái</th><th className="text-center">Thao tác</th></tr>
                    </thead>
                    <tbody>
                      {filteredRevenueBookings.map(b => (
                        <tr key={b._id}>
                          <td className="fw-bold text-secondary">#{String(b._id).substring(18).toUpperCase()}</td>
                          <td>{new Date(b.createdAt).toLocaleDateString('vi-VN')}</td>
                          <td className="fw-bold text-truncate" style={{maxWidth: '200px'}}>{b.tourId?.title || <span className="text-muted fst-italic">Tour đã xóa</span>}</td>
                          <td>{b.userId?.name || b.name || 'Khách vãng lai'}</td>
                          <td className="fw-bold text-primary">{b.totalPrice?.toLocaleString()}đ</td>
                          <td><span className="badge bg-success rounded-pill px-3 py-2">Đã Thanh Toán</span></td>
                          <td className="text-center">
                            <button className="btn btn-sm btn-link text-info text-decoration-none fw-bold" onClick={() => setSelectedBooking(b)}>[Xem]</button>
                          </td>
                        </tr>
                      ))}
                      {filteredRevenueBookings.length === 0 && (
                        <tr><td colSpan="7" className="text-center py-4 text-muted">Không có dữ liệu doanh thu nào.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* MODAL CHI TIẾT TOUR */}
      {selectedTour && (
        <div className="modal-overlay" onClick={handleCloseTourModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="p-3 bg-info text-white d-flex justify-content-between align-items-center">
              <h5 className="fw-bold mb-0">Chi tiết Tour</h5>
              <button className="btn-close btn-close-white" onClick={handleCloseTourModal}></button>
            </div>
            <div className="p-4">
              <div className="row mb-3"><div className="col-5 text-muted small">Tên Tour:</div><div className="col-7 fw-bold">{selectedTour.title}</div></div>
              <div className="row mb-3"><div className="col-5 text-muted small">Thành phố:</div><div className="col-7 fw-bold">{selectedTour.city}</div></div>
              <div className="row mb-3"><div className="col-5 text-muted small">Thời lượng:</div><div className="col-7 fw-bold">{selectedTour.duration}</div></div>
              <div className="row mb-3"><div className="col-5 text-muted small">Khởi hành:</div><div className="col-7 fw-bold">{selectedTour.startDate || 'Không có'}</div></div>
              <div className="row mb-3"><div className="col-5 text-muted small">Kết thúc:</div><div className="col-7 fw-bold">{selectedTour.endDate || 'Không có'}</div></div>
              <div className="row mb-3"><div className="col-5 text-muted small">Tổng chỗ:</div><div className="col-7 fw-bold">{selectedTourStats?.totalSeats ?? 'Chưa xác định'} chỗ</div></div>
              <div className="row mb-3"><div className="col-5 text-muted small">Đã đặt:</div><div className="col-7 fw-bold">{selectedTourStats?.bookedSeats ?? 'Chưa xác định'} chỗ</div></div>
              <div className="row mb-3"><div className="col-5 text-muted small">Còn trống:</div><div className="col-7 fw-bold">{selectedTourStats?.remainingSeats ?? 'Chưa xác định'} chỗ</div></div>
              <div className="row mb-3"><div className="col-5 text-muted small">Đang đặt:</div><div className="col-7 fw-bold">{selectedTourStats?.pendingSeats ?? 'Chưa xác định'} chỗ</div></div>
              <div className="row mb-3 pb-3 border-bottom"><div className="col-5 text-muted small">Hủy:</div><div className="col-7 fw-bold">{selectedTourStats?.canceledSeats ?? 'Chưa xác định'} chỗ</div></div>
              <div className="row mb-3"><div className="col-5 text-muted small">Mô tả:</div><div className="col-7 text-dark">{selectedTour.description || 'Chưa có mô tả'}</div></div>
              {selectedTour.itinerary?.length > 0 && (
                <div className="mt-4">
                  <div className="text-muted small mb-2">Lịch trình chi tiết:</div>
                  <div className="list-group list-group-flush">
                    {selectedTour.itinerary.map((item, idx) => (
                      <div key={idx} className="list-group-item px-0 py-2 border-0 bg-transparent">
                        <span className="fw-bold">Ngày {item.day}:</span> {item.title} {item.description ? `- ${item.description}` : ''}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL CHI TIẾT ĐOÀN/ĐƠN HÀNG */}
      {selectedBooking && (
        <div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="p-3 bg-info text-white d-flex justify-content-between align-items-center">
              <h5 className="fw-bold mb-0">Thông tin Đoàn / Booking</h5>
              <button className="btn-close btn-close-white" onClick={() => setSelectedBooking(null)}></button>
            </div>
            <div className="p-4">
              <div className="row mb-3"><div className="col-5 text-muted small">Mã đơn:</div><div className="col-7 fw-bold">#{String(selectedBooking._id).substring(18).toUpperCase()}</div></div>
              <div className="row mb-3"><div className="col-5 text-muted small">Tên Khách/Trưởng đoàn:</div><div className="col-7 fw-bold text-primary">{selectedBooking.userId?.name || selectedBooking.name || 'Khách vãng lai'}</div></div>
              <div className="row mb-3"><div className="col-5 text-muted small">Số điện thoại liên hệ:</div><div className="col-7 fw-bold text-dark">{selectedBooking.userId?.phone || selectedBooking.phone || 'Chưa cập nhật'}</div></div>
              <div className="row mb-3"><div className="col-5 text-muted small">Lịch trình Tour:</div><div className="col-7 fw-bold">{selectedBooking.tourId?.title || 'Tour đã bị xóa'}</div></div>
              <div className="row mb-3"><div className="col-5 text-muted small">Thời gian tour:</div><div className="col-7 fw-bold">{selectedBooking.tourId?.startDate || 'Không có'} → {selectedBooking.tourId?.endDate || 'Không có'}</div></div>
              <div className="row mb-3"><div className="col-5 text-muted small">Tổng chỗ:</div><div className="col-7 fw-bold">{selectedBookingStats?.totalSeats ?? 'Chưa xác định'} chỗ</div></div>
              <div className="row mb-3"><div className="col-5 text-muted small">Chỗ đã đặt:</div><div className="col-7 fw-bold">{selectedBookingStats?.bookedSeats ?? 'Chưa xác định'} chỗ</div></div>
              <div className="row mb-3"><div className="col-5 text-muted small">Chỗ còn trống:</div><div className="col-7 fw-bold">{selectedBookingStats?.remainingSeats ?? 'Chưa xác định'} chỗ</div></div>
              <div className="row mb-3 pb-3 border-bottom"><div className="col-5 text-muted small">Chỗ đang đặt:</div><div className="col-7 fw-bold">{selectedBookingStats?.pendingSeats ?? 'Chưa xác định'} chỗ</div></div>
              <div className="row mb-3 pb-3 border-bottom"><div className="col-5 text-muted small">Tình trạng xử lý:</div><div className="col-7"><span className={`badge ${selectedBooking.status === 'paid' ? 'bg-success' : selectedBooking.status === 'cancelled' ? 'bg-danger' : 'bg-warning text-dark'}`}>{selectedBooking.status === 'paid' ? 'Hoàn tất / Đã thanh toán' : selectedBooking.status === 'cancelled' ? 'Đã hủy' : 'Chờ xử lý'}</span></div></div>
              <div className="row align-items-center"><div className="col-5 fw-bold">Tổng thanh toán:</div><div className="col-7 fw-bold text-danger fs-4">{selectedBooking.totalPrice?.toLocaleString()} ₫</div></div>
              {selectedBooking.tourId?.itinerary?.length > 0 && (
                <div className="mt-4 pt-3 border-top">
                  <div className="text-muted small mb-2">Lịch trình chi tiết:</div>
                  <div className="list-group list-group-flush">
                    {selectedBooking.tourId.itinerary.map((item, idx) => (
                      <div key={idx} className="list-group-item px-0 py-2 border-0 bg-transparent">
                        <span className="fw-bold">Ngày {item.day}:</span> {item.title} {item.description ? `- ${item.description}` : ''}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;