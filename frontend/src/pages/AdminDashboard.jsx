/*
 * AdminDashboard.jsx
 * React page component cho trang AdminDashboard.
 * Chèn chú thích giải thích mục đích chính của file.
 */

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../utils/apiConfig';
import { resolveImageUrl } from '../../public/assets/img/index/imagePath';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import Swal from 'sweetalert2'; 
import * as XLSX from 'xlsx'; 
import { io } from 'socket.io-client'; 

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [tours, setTours] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [rentals, setRentals] = useState([]); 
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filterType, setFilterType] = useState('all'); 
  const [rentalFilter, setRentalFilter] = useState('all'); 
  const [searchTerm, setSearchTerm] = useState('');

  // --- BỘ LỌC NGÀY KHỞI HÀNH & ĐIỀU HÀNH CHECK-IN QUÉT QR ---
  const [checkInDate, setCheckInDate] = useState(new Date().toISOString().split('T')[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [html5QrScanner, setHtml5QrScanner] = useState(null);

  // --- TRẠNG THÁI FORM TOUR ---
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    _id: '', title: '', city: '', price: '', duration: '', image: '', description: '', availableSeats: 20, startDate: '', endDate: '', category: '', featured: false
  });

  // --- TRẠNG THÁI FORM BLOG ---
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [isEditingBlog, setIsEditingBlog] = useState(false);
  const [blogFormData, setBlogFormData] = useState({ _id: '', title: '', content: '', image: '', category: 'Cẩm Nang Du Lịch', featured: false });

  // --- TRẠNG THÁI FORM THUÊ XE ---
  const [showRentalForm, setShowRentalForm] = useState(false);
  const [isEditingRental, setIsEditingRental] = useState(false);
  const [rentalFormData, setRentalFormData] = useState({
    _id: '', name: '', phone: '', email: '', carType: 'Xe 16 Chỗ', date: '', endDate: '', destination: '', rentalType: 'driver'
  });

  // --- TRẠNG THÁI FORM QUẢN LÝ XE ---
  const [showCarForm, setShowCarForm] = useState(false);
  const [isEditingCar, setIsEditingCar] = useState(false);
  const [carFormData, setCarFormData] = useState({
    _id: '', name: '', carType: 'Van', seats: 16, pricePerDay: 1000000, description: '', image: '', features: [], licensePlate: '', manufacturer: '', yearManufactured: new Date().getFullYear()
  });

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedTour, setSelectedTour] = useState(null);
  const [staffBookingForm, setStaffBookingForm] = useState({ tourId: '', name: '', email: '', phone: '', guestSize: 1, totalPrice: 0, paymentMethod: 'cash' });

  const [showUserForm, setShowUserForm] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [userFormData, setUserFormData] = useState({ _id: '', name: '', email: '', phone: '', password: '', role: 'user' });

  const [availableCategories, setAvailableCategories] = useState([]);
  const [userRole, setUserRole] = useState('user');

  // KẾT NỐI MÁY QUÉT QR HTML5 QUA CDN
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://unpkg.com/html5-qrcode";
    script.async = true;
    document.body.appendChild(script);
    return () => { if (document.body.contains(script)) document.body.removeChild(script); };
  }, []);

  // LẮNG NGHE CHUÔNG BÁO ĐỘNG REAL-TIME TỪ KHÁCH THUÊ XE
  useEffect(() => {
    const socket = io(API_BASE_URL);

    socket.on('new-rental-request', (newRequest) => {
      setRentals(prev => [newRequest, ...prev]);
      const alarmSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-84.wav');
      alarmSound.play().catch(() => console.log("Cần click chuột tương tác trình duyệt trước để mở quyền âm thanh"));

      Swal.fire({
        icon: 'info',
        title: 'YÊU CẦU THUÊ XE MỚI! 🚗',
        text: `Khách hàng ${newRequest.name} vừa đăng ký thuê xe ${newRequest.carType}.`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 4500
      });
    });

    return () => {
      socket.disconnect(); 
    };
  }, []);

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
    { id: 'checkin', icon: 'qr-code-scan', label: 'Khởi Hành & Check-in', roles: ['admin', 'staff'] }, // 👈 TAB ĐIỀU HÀNH
    { id: 'rentals', icon: 'car-front-fill', label: 'Yêu cầu Thuê xe', roles: ['admin', 'staff'] }, 
    { id: 'cars', icon: 'car-front', label: 'Quản lý Kho Xe', roles: ['admin', 'staff'] }, 
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
    if (!token || token === 'null' || token === 'undefined') return null;
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const cfg = getAuthHeaders();
      const isAdmin = (() => {
        try {
          const t = localStorage.getItem('token');
          if (!t) return false;
          const payload = JSON.parse(atob(t.split('.')[1]));
          return payload && payload.role === 'admin';
        } catch (e) {
          return false;
        }
      })();
      const [tourRes, bookRes, userRes, blogRes, reviewRes, catRes, rentalRes, carRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/tours`),
        axios.get(`${API_BASE_URL}/api/bookings`),
        (isAdmin ? axios.get(`${API_BASE_URL}/api/users`, cfg).catch(() => ({ data: { success: true, data: [] } })) : Promise.resolve({ data: { success: true, data: [] } })),
        axios.get(`${API_BASE_URL}/api/blogs`),
        axios.get(`${API_BASE_URL}/api/reviews/all`).catch(() => ({ data: { success: true, data: [] } })),
        axios.get(`${API_BASE_URL}/api/categories`).catch(() => ({ data: { success: true, data: [] } })),
        axios.get(`${API_BASE_URL}/api/rentals`, cfg).catch(() => ({ data: { success: true, data: [] } })),
        axios.get(`${API_BASE_URL}/api/cars`).catch(() => ({ data: { success: true, data: [] } }))
      ]);

      setTours(tourRes.data.success ? tourRes.data.data : (tourRes.data || []));
      setBookings(bookRes.data.success ? bookRes.data.data : (bookRes.data || []));
      setUsers(userRes.data.success ? userRes.data.data : (userRes.data || []));
      setBlogs(blogRes.data.success ? blogRes.data.data : []);
      setReviews(reviewRes.data?.data || []);
      setAvailableCategories(catRes.data.success ? catRes.data.data.map(cat => cat.name) : []);
      setRentals(rentalRes.data?.data || []);
      setCars(carRes.data?.data || []); 
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================================
  // ⚡ LOGIC XỬ LÝ QUÉT QR MÃ VÉ VÀ ĐIỂM DANH LÊN XE
  // =========================================================================
  const executeCheckIn = async (bookingId) => {
    try {
      const cfg = getAuthHeaders();
      if (!cfg) { showNotification('Bạn chưa đăng nhập!', 'danger'); navigate('/login'); return false; }

      const res = await axios.put(`${API_BASE_URL}/api/bookings/${bookingId}/checkin`, {}, cfg);
      if (res.data.success) {
        const beep = new Audio('https://assets.mixkit.co/active_storage/sfx/911/911-500.wav');
        beep.play().catch(() => {});
        Swal.fire({ icon: 'success', title: 'CHECK-IN THÀNH CÔNG! ✅', text: res.data.message, timer: 3000 });
        fetchData(); 
        return true;
      }

      showNotification(res.data.message || 'Mã vé không hợp lệ hoặc đã quét!', 'danger');
      return false;
    } catch (error) {
      const status = error.response?.status;
      const errorMessage = error.response?.data?.message || error.message || 'Mã vé không hợp lệ hoặc đã quét!';
      if (status === 401 || status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        showNotification('Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.', 'danger');
        navigate('/login');
      } else {
        Swal.fire('Lỗi Check-in', errorMessage, 'error');
      }
      return false;
    }
  };

  const startQRScanner = () => {
    if (!window.Html5QrcodeScanner) {
      return Swal.fire('Thông báo', 'Hệ thống quét đang tải thư viện, vui lòng thử lại sau 2 giây!', 'info');
    }
    setIsScanning(true);
    setTimeout(() => {
      const scanner = new window.Html5QrcodeScanner("qr-reader-box", { fps: 10, qrbox: 250 });
      scanner.render(async (decodedText) => {
        scanner.clear();
        setIsScanning(false);
        await executeCheckIn(decodedText); 
      }, (error) => {});
      setHtml5QrScanner(scanner);
    }, 300);
  };

  const stopQRScanner = () => {
    if (html5QrScanner) { html5QrScanner.clear(); setHtml5QrScanner(null); }
    setIsScanning(false);
  };

  const handleTourFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBlogFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBlogFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const sanitizePhoneInput = (value) => {
    return String(value || '').replace(/\D/g, '');
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim().toLowerCase());
  };

  const getTodayDateString = () => new Date().toISOString().split('T')[0];

  const handleRentalInputChange = (e) => {
    const { name, value } = e.target;
    setRentalFormData(prev => ({
      ...prev,
      [name]: name === 'phone' ? sanitizePhoneInput(value) : value
    }));
  };

  const resetRentalForm = () => {
    setRentalFormData({ _id: '', name: '', phone: '', email: '', carType: 'Xe 16 Chỗ', date: '', endDate: '', destination: '', rentalType: 'driver' });
    setIsEditingRental(false);
    setShowRentalForm(false);
  };

  const handleEditRentalClick = (r) => {
    setRentalFormData({
      _id: r._id || '', name: r.name || '', phone: r.phone || '', email: r.email || '', carType: r.carType || 'Xe 16 Chỗ',
      date: r.date || '', endDate: r.endDate || '', destination: r.destination || '', rentalType: r.rentalType || 'driver'
    });
    setIsEditingRental(true);
    setShowRentalForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const handleSubmitRental = async (e) => {
    e.preventDefault();
    try {
      const cfg = getAuthHeaders();
      if (!cfg) return showNotification('Bạn chưa đăng nhập!', 'danger');

      const submitData = { ...rentalFormData };
      const todayString = getTodayDateString();
      const rentalDate = submitData.date ? new Date(submitData.date) : null;
      const endDate = submitData.endDate ? new Date(submitData.endDate) : null;

      if (!submitData.name?.trim()) return showNotification('Vui lòng nhập tên khách hàng.', 'danger');
      if (!submitData.phone) return showNotification('Vui lòng nhập số điện thoại.', 'danger');
      if (!/^[0-9]+$/.test(submitData.phone)) return showNotification('Số điện thoại chỉ được chứa chữ số.', 'danger');
      if (submitData.phone.length < 9) return showNotification('Số điện thoại phải có ít nhất 9 chữ số.', 'danger');
      if (!submitData.email) return showNotification('Vui lòng nhập email.', 'danger');
      if (!isValidEmail(submitData.email)) return showNotification('Email không hợp lệ.', 'danger');
      if (!submitData.destination?.trim()) return showNotification('Vui lòng nhập lộ trình / điểm đến.', 'danger');
      if (!submitData.date) return showNotification('Vui lòng chọn ngày khởi hành.', 'danger');
      if (rentalDate < new Date(todayString)) return showNotification('Ngày khởi hành không được trước hôm nay.', 'danger');
      if (!submitData.endDate) return showNotification('Vui lòng chọn ngày kết thúc thuê.', 'danger');
      if (endDate < rentalDate) return showNotification('Ngày kết thúc phải sau hoặc bằng ngày khởi hành.', 'danger');

      if (isEditingRental) {
        await axios.put(`${API_BASE_URL}/api/rentals/${submitData._id}`, submitData, cfg);
        showNotification('Cập nhật thông tin phiếu thuê xe thành công!', 'success');
      } else {
        delete submitData._id;
        await axios.post(`${API_BASE_URL}/api/rentals`, submitData, cfg);
        showNotification('Thêm mới phiếu thuê xe du lịch thành công!', 'success');
      }
      resetRentalForm();
      fetchData();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Gặp lỗi khi đồng bộ dữ liệu xe lên server!', 'danger');
    }
  };

  const handleUpdateRental = async (id, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'processed' : 'pending';
    try {
      const cfg = getAuthHeaders();
      await axios.put(`${API_BASE_URL}/api/rentals/${id}`, { status: newStatus }, cfg);
      fetchData();
      showNotification('Cập nhật trạng thái thành công', 'success');
    } catch (error) { showNotification('Lỗi cập nhật', 'danger'); }
  };

  const handleDeleteRental = async (id) => {
    Swal.fire({ title: 'Xóa yêu cầu này?', text: "Dữ liệu bến bãi sẽ bị gỡ vĩnh viễn khỏi máy chủ!", icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Xóa' }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const cfg = getAuthHeaders();
          await axios.delete(`${API_BASE_URL}/api/rentals/${id}`, cfg);
          fetchData();
          showNotification('Đã gỡ phiếu yêu cầu thành công', 'success');
        } catch (e) { showNotification('Lỗi xóa', 'danger'); }
      }
    });
  };

  const handleCarInputChange = (e) => {
    const { name, value } = e.target;
    setCarFormData(prev => ({ ...prev, [name]: name === 'seats' || name === 'pricePerDay' || name === 'yearManufactured' ? Number(value) : value }));
  };

  const handleCarFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCarFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const resetCarForm = () => {
    setCarFormData({ _id: '', name: '', carType: 'Van', seats: 16, pricePerDay: 1000000, description: '', image: '', features: [], licensePlate: '', manufacturer: '', yearManufactured: new Date().getFullYear() });
    setIsEditingCar(false);
    setShowCarForm(false);
  };

  const handleEditCarClick = (car) => {
    setCarFormData({
      _id: car._id || '', name: car.name || '', carType: car.carType || 'Van', seats: car.seats || 16, pricePerDay: car.pricePerDay || 1000000,
      description: car.description || '', image: car.image || '', features: car.features || [], licensePlate: car.licensePlate || '',
      manufacturer: car.manufacturer || '', yearManufactured: car.yearManufactured || new Date().getFullYear()
    });
    setIsEditingCar(true);
    setShowCarForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitCar = async (e) => {
    e.preventDefault();
    try {
      const cfg = getAuthHeaders();
      if (!cfg) return showNotification('Bạn chưa đăng nhập!', 'danger');

      const submitData = { ...carFormData };

      if (isEditingCar) {
        await axios.put(`${API_BASE_URL}/api/cars/${submitData._id}`, submitData, cfg);
        showNotification('Cập nhật thông tin xe thành công!', 'success');
      } else {
        delete submitData._id; 
        await axios.post(`${API_BASE_URL}/api/cars`, submitData, cfg);
        showNotification('Thêm xe mới thành công!', 'success');
      }
      resetCarForm();
      fetchData();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Lỗi khi lưu thông tin xe!';
      showNotification(errorMessage, 'danger');
    }
  };

  const handleDeleteCar = async (id) => {
    Swal.fire({ title: 'Xóa xe này?', text: "Dữ liệu xe sẽ bị xóa vĩnh viễn!", icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Xóa' }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const cfg = getAuthHeaders();
          await axios.delete(`${API_BASE_URL}/api/cars/${id}`, cfg);
          fetchData();
          showNotification('Xóa xe thành công', 'success');
        } catch (e) { showNotification('Lỗi xóa xe', 'danger'); }
      }
    });
  };

  // --- CÁC HÀM FILTER DỮ LIỆU ĐÃ FIX LỖI TIME TRẮNG MÀN HÌNH ---
  const departuresData = useMemo(() => {
    const dayBookings = bookings.filter(b => {
      if (b.status !== 'paid') return false; 
      try {
        const bDate = new Date(b.createdAt).toISOString().split('T')[0];
        return bDate === checkInDate;
      } catch (e) { return false; }
    });

    const groups = {};
    dayBookings.forEach(b => {
      const tourId = b.tourId?._id;
      if (!tourId) return;

      if (!groups[tourId]) {
        groups[tourId] = { tour: b.tourId, totalExpected: 0, totalCheckedIn: 0, passengerList: [] };
      }

      const size = Number(b.guestSize || 1);
      groups[tourId].totalExpected += size;
      if (b.checkedIn === true) groups[tourId].totalCheckedIn += size;
      
      groups[tourId].passengerList.push(b);
    });

    return Object.values(groups);
  }, [bookings, checkInDate]);

  const filteredBookings = useMemo(() => {
    const today = new Date();
    return bookings.filter(b => {
      try {
        const bDate = new Date(b.createdAt);
        const matchesFilter = filterType === 'day' ? bDate.toDateString() === today.toDateString() :
                              filterType === 'month' ? (bDate.getMonth() === today.getMonth() && bDate.getFullYear() === today.getFullYear()) : true;
        const matchesSearch = b._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              b.tourId?.title?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
      } catch (e) { return false; }
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

  const filteredCars = useMemo(() => {
    return cars.filter(c => 
      (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
      (c.licensePlate || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [cars, searchTerm]);

  const revenueData = useMemo(() => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const paidBookings = bookings.filter(b => b.status === 'paid');

    const monthlyPaid = paidBookings.filter(b => {
      try {
        const d = new Date(b.createdAt);
        return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
      } catch(e) { return false; }
    });
    const totalMonth = monthlyPaid.reduce((sum, b) => sum + (Number(b.totalPrice) || 0), 0);

    const todayPaid = paidBookings.filter(b => {
      try { return new Date(b.createdAt).toDateString() === now.toDateString(); } catch(e){ return false; }
    });
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
      if (count > maxCount) { maxCount = count; popularTour = title; }
    });

    return { totalMonth, totalToday, successCount: paidBookings.length, popularTour };
  }, [bookings]);

  const filteredRevenueBookings = useMemo(() => {
    let list = bookings.filter(b => b.status === 'paid');
    const today = new Date();

    if (filterType === 'day') {
      list = list.filter(b => {
        try { return new Date(b.createdAt).toDateString() === today.toDateString(); } catch(e){ return false;}
      });
    } else if (filterType === 'month') {
      list = list.filter(b => {
        try { const d = new Date(b.createdAt); return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear(); } catch(e){ return false;}
      });
    }

    if (searchTerm) {
      list = list.filter(b => b._id.toLowerCase().includes(searchTerm.toLowerCase()) || (b.tourId?.title || '').toLowerCase().includes(searchTerm.toLowerCase()));
    }

    return list;
  }, [bookings, filterType, searchTerm]);

  const orderStatusCounts = useMemo(() => {
    const counts = { pending: 0, paid: 0, cancelled: 0, processed: 0 };
    bookings.forEach((b) => {
      const status = String(b.status || 'pending').toLowerCase();
      if (!counts[status]) counts[status] = 0;
      counts[status] += 1;
    });
    return counts;
  }, [bookings]);

  const stats = useMemo(() => ({
    tourCount: tours.length,
    bookingTotal: bookings.length,
    userCount: users.length,
  }), [tours.length, bookings.length, users.length]);

  const pieData = useMemo(() => ([
    { name: 'Chờ xử lý', value: orderStatusCounts.pending },
    { name: 'Đã thanh toán', value: orderStatusCounts.paid },
    { name: 'Đã hủy', value: orderStatusCounts.cancelled },
    { name: 'Đã xử lý', value: orderStatusCounts.processed },
  ]), [orderStatusCounts]);

  const COLORS = ['#0d6efd', '#20c997', '#ffc107', '#dc3545'];

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
      "STT": i + 1, "Họ Tên": u.name || '', "Email": u.email || '', "Số Điện Thoại": u.phone || 'N/A', "Quyền Hạn": u.role === 'admin' ? 'Quản trị viên' : u.role === 'staff' ? 'Nhân viên' : 'Khách hàng'
    }));
    downloadExcel(dataToExport, "Danh_Sach_Nguoi_Dung");
  };

  const exportToursToExcel = () => {
    const dataToExport = filteredTours.map((t, i) => ({
      "STT": i + 1, "Tên Tour": t.title || '', "Thành Phố": t.city || '', "Giá Bán (VNĐ)": t.price || 0, "Thời Lượng": t.duration || '', "Danh Mục": t.category || '', "Trạng Thái": t.featured ? 'Nổi bật' : 'Bình thường'
    }));
    downloadExcel(dataToExport, "Danh_Sach_Tour");
  };

  const exportBookingsToExcel = () => {
    const dataToExport = filteredBookings.map((b, i) => ({
      "STT": i + 1, "Mã Đơn": '#' + String(b._id).substring(18).toUpperCase(), "Ngày Đặt": new Date(b.createdAt).toLocaleDateString('vi-VN'), "Khách Hàng": b.userId?.name || b.name || 'Khách vãng lai', "Số Điện Thoại": b.userId?.phone || b.phone || 'N/A', "Tên Tour": b.tourId?.title || 'Tour đã xóa', "Số Lượng Khách": b.guestSize || 1, "Tổng Tiền (VNĐ)": b.totalPrice || 0, "Trạng Thái": b.status === 'paid' ? 'Đã Thanh Toán' : b.status === 'cancelled' ? 'Đã Hủy' : 'Chờ Xử Lý'
    }));
    downloadExcel(dataToExport, "Lich_Su_Don_Dat_Tour");
  };

  const exportRevenueToExcel = () => {
    const dataToExport = filteredRevenueBookings.map((b, i) => ({
      "STT": i + 1, "Mã Đơn": '#' + String(b._id).substring(18).toUpperCase(), "Ngày Thanh Toán": new Date(b.createdAt).toLocaleDateString('vi-VN'), "Tên Khách Hàng": b.userId?.name || b.name || 'Khách vãng lai', "SĐT Liên Hệ": b.userId?.phone || b.phone || 'N/A', "Tour Đã Đặt": b.tourId?.title || 'Tour đã xóa', "Doanh Thu Mang Về (VNĐ)": b.totalPrice || 0, "Hình Thức": b.paymentMethod === 'vnpay' ? 'Cổng VNPay' : (b.paymentMethod === 'bank' ? 'Chuyển Khoản' : 'Tiền Mặt')
    }));
    downloadExcel(dataToExport, "Bao_Cao_Doanh_Thu_Chi_Tiet");
  };

  const handleBlogInputChange = (e) => setBlogFormData({...blogFormData, [e.target.name]: e.target.value});
  
  const handleSubmitBlog = async (e) => {
    e.preventDefault();
    try {
      const cfg = getAuthHeaders();
      if (!cfg) { showNotification('Bạn chưa đăng nhập hoặc token đã hết hạn!', 'danger'); return; }
      
      const submitData = {...blogFormData};
      if (!submitData.image) {
        return showNotification('Vui lòng chọn ảnh bìa cho bài viết.', 'danger');
      }
      if (isEditingBlog) {
        await axios.put(`${API_BASE_URL}/api/blogs/${submitData._id}`, submitData, cfg);
        showNotification('Lưu bài viết thành công!', 'success');
      } else {
        delete submitData._id;
        await axios.post(`${API_BASE_URL}/api/blogs`, submitData, cfg);
        showNotification('Đăng bài mới thành công!', 'success');
      }
      setShowBlogForm(false); setIsEditingBlog(false); fetchData();
    } catch (error) { showNotification(`Lỗi khi lưu Blog: ${error.response?.data?.message || error.message}`, 'danger'); }
  };

  const handleDeleteBlog = async (id) => {
    Swal.fire({ title: 'Xóa bài viết này?', text: "Hành động này không thể hoàn tác!", icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Đồng ý xóa' }).then(async (result) => {
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

  const handleInputChange = (e) => { setFormData(prev => ({ ...prev, [e.target.name]: e.target.value })); };
  
  const resetForm = () => { 
    setFormData({ _id: '', title: '', city: '', price: '', duration: '', image: '', description: '', availableSeats: 20, startDate: '', endDate: '', category: '', featured: false }); 
    setIsEditing(false); setShowForm(false); 
  };
  
  const handleEditClick = (tour) => { 
    setFormData({
      _id: tour._id || '', title: tour.title || '', city: tour.city || '', price: tour.price || '', duration: tour.duration || '',
      image: tour.image || '', description: tour.description || '', availableSeats: tour.availableSeats || 0,
      startDate: tour.startDate || '', endDate: tour.endDate || '', category: tour.category || '', featured: tour.featured || false
    }); 
    setIsEditing(true); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const handleEditBlogClick = (b) => {
    setBlogFormData({ _id: b._id || '', title: b.title || '', content: b.content || '', image: b.image || '', category: b.category || 'Cẩm Nang Du Lịch', featured: b.featured || false });
    setIsEditingBlog(true); setShowBlogForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const handleStaffBookingInputChange = (e) => {
    const { name, value } = e.target;
    setStaffBookingForm(prev => {
      const updated = {
        ...prev,
        [name]: name === 'guestSize' ? Number(value) : name === 'phone' ? sanitizePhoneInput(value) : value
      };
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
      if (!/^[0-9]+$/.test(phone)) return showNotification('Số điện thoại chỉ được chứa chữ số.', 'danger');
      if (phone.length < 9) return showNotification('Số điện thoại phải có ít nhất 9 chữ số.', 'danger');
      if (email && !isValidEmail(email)) return showNotification('Email không hợp lệ.', 'danger');
      await axios.post(`${API_BASE_URL}/api/bookings`, { tourId, name, email, phone, guestSize, totalPrice, paymentMethod });
      showNotification('Đã tạo đơn đặt tour cho khách hàng.', 'success');
      resetStaffBookingForm(); fetchData();
    } catch (error) { showNotification(error.response?.data?.message || 'Lỗi khi tạo đơn đặt tour', 'danger'); }
  };

  const handleSubmitTour = async (e) => {
    e.preventDefault();
    try {
      const cfg = getAuthHeaders();
      if (!cfg) return showNotification('Bạn chưa đăng nhập!', 'danger');
      
      const submitData = {...formData};
      if (!submitData.startDate || !submitData.endDate) {
        return showNotification('Vui lòng chọn ngày khởi hành và ngày kết thúc.', 'danger');
      }
      if (new Date(submitData.startDate) > new Date(submitData.endDate)) {
        return showNotification('Ngày kết thúc phải cùng ngày hoặc sau ngày khởi hành.', 'danger');
      }
      if (!submitData.image) {
        return showNotification('Vui lòng tải lên ảnh tour trước khi lưu.', 'danger');
      }
      
      if (isEditing) {
        await axios.put(`${API_BASE_URL}/api/tours/${submitData._id}`, submitData, cfg);
        showNotification('Cập nhật tour thành công!', 'success');
      } else {
        delete submitData._id; 
        await axios.post(`${API_BASE_URL}/api/tours`, submitData, cfg);
        showNotification('Thêm tour mới thành công!', 'success');
      }
      resetForm(); fetchData(); 
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Lưu không thành công';
      showNotification(errorMessage, 'danger');
    }
  };

  const handleUserInputChange = (e) => setUserFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const resetUserForm = () => { setUserFormData({ _id: '', name: '', email: '', phone: '', password: '', role: 'user' }); setIsEditingUser(false); setShowUserForm(false); };
  
  const handleEditUserClick = (user) => { 
    setUserFormData({ _id: user._id || '', name: user.name || '', email: user.email || '', phone: user.phone || '', password: '', role: user.role || 'user' }); 
    setIsEditingUser(true); setShowUserForm(true); 
  };
  
  const handleSubmitUser = async (e) => {
    e.preventDefault();
    try {
      if (isEditingUser) {
        const cfg = getAuthHeaders();
        if (!cfg) return showNotification('Bạn chưa đăng nhập!', 'danger');
        await axios.put(`${API_BASE_URL}/api/users/${userFormData._id}`, userFormData, cfg);
        showNotification('Cập nhật User thành công!', 'success');
      } else {
        const submitData = {...userFormData};
        delete submitData._id;
        await axios.post(`${API_BASE_URL}/api/auth/register`, submitData);
        showNotification('Khởi tạo User thành công!', 'success');
      }
      resetUserForm(); fetchData(); 
    } catch (error) { showNotification(error.response?.data?.message || 'Lỗi lưu user!', 'danger'); }
  };

  const handleViewTour = (tour) => { setSelectedTour(tour); };
  const handleCloseTourModal = () => { setSelectedTour(null); };
  const handleViewBooking = (booking) => { setSelectedBooking(booking); };
  const handleCloseBookingModal = () => { setSelectedBooking(null); };

  if (loading) return (
    <div className="bg-light pb-5" style={{ minHeight: '100vh' }}>
      <div className="container-fluid px-4 mt-4">
        <div className="row g-4">
          <div className="col-12 col-lg-3 col-xl-2"><div className="skeleton shadow-sm" style={{ height: '80vh', borderRadius: '15px' }}></div></div>
          <div className="col-12 col-lg-9 col-xl-10">
            <div className="skeleton mb-4" style={{ height: '40px', width: '30%', borderRadius: '8px' }}></div>
            <div className="row g-4 mb-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="col-md-4"><div className="skeleton shadow-sm" style={{ height: '120px', borderRadius: '15px' }}></div></div>
              ))}
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
        .table-warning-light { background-color: #fffbeb !important; }
        .table-success-light { background-color: #f0fdf4 !important; }
        .bg-success-light { background-color: #dcfce7; }
        .bg-warning-light { background-color: #fef9c3; }
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
                <h6 className="fw-bold mb-0 small">{userRole === 'admin' ? 'HỆ THỐNG QUẢN TRỊ' : 'TRANG NHÂN VIÊN'}</h6>
                <span className="badge bg-secondary mt-2">{userRole === 'admin' ? 'Admin' : 'Staff'}</span>
              </div>
              <div className="py-2">
                {menuItems.filter(item => item.roles.includes(userRole)).map(item => (
                  <div key={item.id} className={`p-3 cursor-pointer ${activeTab === item.id ? 'bg-info text-white' : ''}`} onClick={() => {setActiveTab(item.id); setSearchTerm(''); stopQRScanner();}} style={{cursor: 'pointer'}}>
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
                  {[{ label: 'Tổng số Tour', val: stats.tourCount, icon: 'map', color: 'primary' }, { label: 'Đơn đặt / Thông đoàn', val: stats.bookingTotal, icon: 'cart-check', color: 'success' }, { label: 'Thành viên', val: stats.userCount, icon: 'people', color: 'warning' }].map((item, idx) => (
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
                        <button className="btn btn-outline-success rounded-pill px-3 shadow-sm fw-bold" onClick={exportToursToExcel}><i className="bi bi-file-earmark-excel-fill me-1"></i> Xuất Excel</button>
                        <button className="btn btn-info text-white rounded-pill px-4 shadow-sm" onClick={() => setShowForm(!showForm)}>{showForm ? 'Đóng form' : '+ Thêm mới'}</button>
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
                        <div className="col-md-6"><label className="small fw-bold">Ngày khởi hành</label><input type="date" className="form-control" name="startDate" value={formData.startDate || ''} onChange={handleInputChange} required /></div>
                        <div className="col-md-6"><label className="small fw-bold">Ngày kết thúc</label><input type="date" className="form-control" name="endDate" value={formData.endDate || ''} onChange={handleInputChange} required /></div>
                        
                        <div className="col-md-12">
                          <label className="small fw-bold text-primary"><i className="bi bi-folder2-open me-1"></i> Tải ảnh từ thiết bị của bạn</label>
                          <input type="file" className="form-control border-info" accept="image/*" onChange={handleTourFileChange} required={!isEditing} />
                          {formData.image && (
                            <div className="mt-3">
                              <span className="small text-muted d-block mb-1">Hình ảnh đang chọn:</span>
                              <img src={formData.image.startsWith('data:') ? formData.image : (formData.image.includes('/') ? resolveImageUrl(formData.image) : `/assets/img/index/${formData.image}`)} alt="Preview" className="rounded shadow-sm border border-secondary" style={{width:'150px', height:'100px', objectFit:'cover'}} onError={(e) => {e.target.style.display='none'}} />
                            </div>
                          )}
                        </div>

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
                          <td><img src={t.image?.startsWith('data:') ? t.image : resolveImageUrl(t.image)} className="rounded" style={{width:'50px', height:'35px', objectFit:'cover'}} /></td>
                          <td className="fw-bold">{t.title || 'Tour không tên'}</td>
                          <td className="text-muted small">Khởi hành: <strong>{t.startDate || '---'}</strong><br/>Ghế trống: <strong className="text-danger">{t.availableSeats || 0}</strong> ghế</td>
                          <td><span className={`badge ${t.availableSeats > 0 ? 'bg-success' : 'bg-danger'}`}>{t.availableSeats > 0 ? 'Còn chỗ' : 'Đã Đầy'}</span></td>
                          <td className="text-center">
                            <button className="btn btn-info text-white rounded-pill me-2" onClick={() => handleViewTour(t)}><i className="bi bi-eye"></i> Xem</button>
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
                          {tours.map(t => <option key={t._id} value={t._id}>{t.title} - {t.city || ''} ({Number(t.price || 0).toLocaleString()}đ)</option>)}
                        </select>
                      </div>
                      <div className="col-md-3"><label className="small fw-bold">Số khách</label><input type="number" className="form-control" name="guestSize" min="1" value={staffBookingForm.guestSize || ''} onChange={handleStaffBookingInputChange} required /></div>
                      <div className="col-md-3"><label className="small fw-bold">Tổng tiền (VNĐ)</label><input type="text" readOnly className="form-control" value={staffBookingForm.totalPrice ? staffBookingForm.totalPrice.toLocaleString() + ' đ' : '0 đ'} /></div>
                      <div className="col-md-6"><label className="small fw-bold">Tên khách</label><input type="text" className="form-control" name="name" value={staffBookingForm.name || ''} onChange={handleStaffBookingInputChange} required /></div>
                      <div className="col-md-3"><label className="small fw-bold">Điện thoại</label><input type="tel" inputMode="numeric" pattern="\d*" maxLength={15} className="form-control" name="phone" value={staffBookingForm.phone || ''} onChange={handleStaffBookingInputChange} required /></div>
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
                    <button className="btn btn-outline-success rounded-pill px-3 shadow-sm fw-bold" onClick={exportBookingsToExcel}><i className="bi bi-file-earmark-excel-fill me-1"></i> Xuất Excel</button>
                  </div>
                  <table className="table table-hover align-middle small mb-0">
                    <thead className="table-light text-muted"><tr><th>MÃ ĐƠN</th><th>THÔNG TIN KHÁCH/ĐOÀN</th><th>TOUR</th><th>TIỀN</th><th>TRẠNG THÁI</th><th className="text-center">CẬP NHẬT TRẠNG THÁI</th></tr></thead>
                    <tbody>
                      {filteredBookings.map(b => (
                        <tr key={b._id}>
                          <td className="fw-bold">#{String(b._id).substring(18).toUpperCase()}</td>
                          <td><div className="fw-bold text-primary">{b.userId?.name || b.name || 'Khách vãng lai'}</div><div className="text-muted"><i className="bi bi-telephone-fill me-1"></i>{b.userId?.phone || b.phone || 'N/A'}</div></td>
                          <td>{b.tourId?.title || 'Tour đã bị xóa'}</td>
                          <td className="fw-bold text-danger">{Number(b.totalPrice || 0).toLocaleString()}đ</td>
                          <td><span className={`badge rounded-pill px-3 py-2 ${b.status === 'paid' ? 'bg-success' : b.status === 'cancelled' ? 'bg-danger' : 'bg-warning text-dark'}`}>{b.status === 'paid' ? 'Đã Thanh Toán' : b.status === 'cancelled' ? 'Đã hủy' : 'Chờ xử lý'}</span></td>
                          <td className="text-center">
                            <div className="d-flex justify-content-center gap-1">
                              {b.status !== 'paid' && b.status !== 'cancelled' && (
                                <>
                                  <button className="btn btn-sm btn-success rounded-pill" onClick={() => handleUpdateStatus(b._id, 'paid')}><i className="bi bi-check-lg"></i></button>
                                  <button className="btn btn-sm btn-danger rounded-pill" onClick={() => handleUpdateStatus(b._id, 'cancelled')}><i className="bi bi-x-lg"></i></button>
                                </>
                              )}
                              <button className="btn btn-sm btn-info text-white rounded-pill" onClick={() => handleViewBooking(b)}><i className="bi bi-eye"></i></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* ⚡ TAB ĐIỀU HÀNH KHỞI HÀNH & SOÁT VÉ QR CODE CHECK-IN */}
            {/* ========================================================================= */}
            {activeTab === 'checkin' && (userRole === 'admin' || userRole === 'staff') && (
              <div className="animation-fade-in">
                
                {/* THANH ĐIỀU CHỈNH NGÀY KHỞI HÀNH VÀ QUÉT MÃ QR */}
                <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                  <div className="row align-items-center g-3">
                    <div className="col-12 col-md-5">
                      <label className="form-label small fw-bold text-muted"><i className="bi bi-calendar-event-fill text-info me-1"></i> Chọn ngày khởi hành:</label>
                      <input 
                        type="date" 
                        className="form-control border-info rounded-pill px-3 fw-bold" 
                        value={checkInDate} 
                        onChange={(e) => setCheckInDate(e.target.value)} 
                      />
                    </div>
                    <div className="col-12 col-md-7 text-md-end pt-md-4">
                      {!isScanning ? (
                        <button className="btn btn-info text-white rounded-pill px-4 shadow-sm fw-bold animate-bounce" onClick={startQRScanner}>
                          <i className="bi bi-qr-code-scan me-2"></i> BẬT CAMERA QUÉT VÉ QR
                        </button>
                      ) : (
                        <button className="btn btn-danger text-white rounded-pill px-4 shadow-sm fw-bold" onClick={stopQRScanner}>
                          <i className="bi bi-camera-video-off-fill me-2"></i> TẮT CAMERA QUÉT
                        </button>
                      )}
                    </div>
                  </div>

                  {/* KHUNG HIỂN THỊ CAMERA QUÉT QR MÃ VÉ */}
                  {isScanning && (
                    <div className="mt-4 p-3 bg-dark rounded-4 text-center border border-info border-3 mx-auto" style={{maxWidth: '350px'}}>
                      <div id="qr-reader-box" style={{width: '100%', borderRadius: '12px', overflow: 'hidden', backgroundColor: 'black'}}></div>
                      <span className="small text-info d-block mt-3 px-2 animate-pulse"><i className="bi bi-broadcast me-1"></i> Hướng camera vào mã QR trên vé khách...</span>
                    </div>
                  )}
                </div>

                {/* DANH SÁCH CÁC CHUYẾN TOUR KHỞI HÀNH THEO NGÀY ĐÃ CHỌN */}
                <h4 className="fw-bold mb-3 text-dark"><i className="bi bi-bus-front text-success me-2"></i>Giám sát Lượt khởi hành ngày: {new Date(checkInDate).toLocaleDateString('vi-VN')}</h4>
                
                {departuresData.length === 0 ? (
                  <div className="card border-0 shadow-sm rounded-4 p-5 text-center text-muted fst-italic">
                    <i className="bi bi-slash-circle-fill text-secondary fs-1 mb-2"></i>
                    <h5>Không có chuyến tour nào khởi hành vào ngày đã chọn!</h5>
                    <p className="small mb-0">Hệ thống chỉ tính những đoàn khách của ngày này đã thanh toán hóa đơn thành công.</p>
                  </div>
                ) : (
                  departuresData.map(group => (
                    <div key={group.tour._id} className="card border-0 shadow-sm rounded-4 p-4 mb-4 border-start border-success border-5">
                      {/* Tiêu đề & Tiến độ soát vé của xe */}
                      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-3 border-bottom pb-3">
                        <div>
                          <h5 className="fw-bold text-dark mb-1 text-uppercase">{group.tour.title}</h5>
                          <span className="small text-muted"><i className="bi bi-geo-alt-fill text-danger me-1"></i>Điểm đến: {group.tour.city} | <i className="bi bi-clock-fill text-warning me-1"></i>Thời lượng: {group.tour.duration}</span>
                        </div>
                        <div className="text-sm-end mt-2 mt-sm-0">
                          <span className="fs-5 fw-bold text-success">{group.totalCheckedIn}</span> 
                          <span className="text-muted"> / {group.totalExpected} Khách có mặt</span>
                          
                          {/* Thanh phần trăm tiến độ lên xe */}
                          <div className="progress mt-1 rounded-pill" style={{height: '8px', minWidth: '15px'}}>
                            <div 
                              className="progress-bar bg-success rounded-pill" 
                              role="progressbar" 
                              style={{ width: `${(group.totalCheckedIn / group.totalExpected) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Danh sách hành khách/đoàn của chuyến đi */}
                      <div className="table-responsive">
                        <table className="table table-hover table-sm align-middle mb-0 small">
                          <thead className="table-light text-muted">
                            <tr>
                              <th>MÃ ĐƠN</th>
                              <th>TRƯỞNG ĐOÀN</th>
                              <th className="text-center">SỐ LƯỢNG</th>
                              <th>ĐIỆN THOẠI</th>
                              <th>TRẠNG THÁI LÊN XE</th>
                              <th className="text-center">ĐIỂM DANH THỦ CÔNG</th>
                            </tr>
                          </thead>
                          <tbody>
                            {group.passengerList.map(p => (
                              <tr key={p._id} className={p.checkedIn === true ? 'table-success-light' : ''}>
                                <td className="fw-bold text-secondary">#{String(p._id).substring(18).toUpperCase()}</td>
                                <td className="fw-bold text-dark">{p.name || p.userId?.name}</td>
                                <td className="text-center fw-bold">{p.guestSize} Người</td>
                                <td className="text-muted">{p.phone || p.userId?.phone}</td>
                                <td>
                                  {p.checkedIn === true ? (
                                    <span className="badge bg-success-light text-success px-3 py-1 rounded-pill fw-bold border border-success"><i className="bi bi-check-circle-fill me-1"></i> Đã lên xe ✅</span>
                                  ) : (
                                    <span className="badge bg-warning-light text-warning px-3 py-1 rounded-pill fw-bold border border-warning"><i className="bi bi-exclamation-triangle-fill me-1"></i> Chờ soát vé ⏳</span>
                                  )}
                                </td>
                                <td className="text-center">
                                  {p.checkedIn !== true ? (
                                    <button className="btn btn-sm btn-success rounded-pill px-3 shadow-sm fw-bold" onClick={() => executeCheckIn(p._id)}>
                                      <i className="bi bi-person-check-fill me-1"></i> Xác nhận có mặt
                                    </button>
                                  ) : (
                                    <button className="btn btn-sm btn-outline-secondary rounded-pill px-3 disabled" disabled>
                                      <i className="bi bi-shield-check me-1"></i> Hoàn tất
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* QUẢN LÝ NGƯỜI DÙNG */}
            {activeTab === 'users' && userRole === 'admin' && (
              <div className="animation-fade-in">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="fw-bold mb-0">Phân quyền & Quản lý Người dùng</h4>
                  <div className="d-flex gap-2">
                    <button className="btn btn-outline-success rounded-pill px-3 shadow-sm fw-bold" onClick={exportUsersToExcel}><i className="bi bi-file-earmark-excel-fill me-1"></i> Xuất Excel</button>
                    <button className="btn btn-info text-white rounded-pill px-4 shadow-sm" onClick={() => {setShowUserForm(!showUserForm); setIsEditingUser(false); setUserFormData({ _id: '', name: '', email: '', phone: '', password: '', role: 'user' })}}>{showUserForm ? 'Đóng form' : '+ Thêm Tài khoản'}</button>
                  </div>
                </div>

                {showUserForm && (
                  <div className="card border-0 shadow-sm p-4 mb-4 rounded-4 border-top border-info border-4">
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
                    <thead className="table-light text-muted small"><tr><th>STT</th><th>HỌ TÊN</th><th>EMAIL</th><th>PHÂN QUYỀN</th><th className="text-center">THAO TÁC</th></tr></thead>
                    <tbody>
                      {filteredUsers.map((u, i) => (
                        <tr key={u._id}>
                          <td>{i + 1}</td>
                          <td className="fw-bold">{u.name || 'N/A'}</td>
                          <td>{u.email || 'N/A'}</td>
                          <td><span className={`badge px-3 py-2 rounded-pill ${u.role === 'admin' ? 'bg-danger' : u.role === 'staff' ? 'bg-primary' : 'bg-secondary'}`}>{u.role === 'admin' ? 'Admin' : u.role === 'staff' ? 'Nhân viên' : 'Khách hàng'}</span></td>
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
                  <button className="btn btn-info text-white rounded-pill px-4" onClick={() => {setShowBlogForm(!showBlogForm); setIsEditingBlog(false); setBlogFormData({title:'', content:'', image:'', category:'Cẩm Nang Du Lịch', featured:false})}}>{showBlogForm ? 'Đóng' : '+ Viết bài mới'}</button>
                </div>
                {showBlogForm && (
                  <div className="card border-0 shadow-sm p-4 mb-4 rounded-4 border-top border-info border-4">
                    <form onSubmit={handleSubmitBlog}>
                      <div className="row g-3">
                        <div className="col-md-8"><label className="small fw-bold">Tiêu đề bài viết</label><input type="text" className="form-control" name="title" value={blogFormData.title || ''} onChange={handleBlogInputChange} required /></div>
                        <div className="col-md-4"><label className="small fw-bold">Danh mục</label><select className="form-select" name="category" value={blogFormData.category || ''} onChange={handleBlogInputChange}><option value="Cẩm Nang Du Lịch">Cẩm Nang Du Lịch</option><option value="Kinh nghiệm">Kinh nghiệm</option><option value="Tin tức">Tin tức</option></select></div>
                        <div className="col-md-12">
                          <label className="small fw-bold text-primary"><i className="bi bi-image-fill me-1"></i> Tải ảnh bìa bài viết từ laptop</label>
                          <input type="file" className="form-control border-info" accept="image/*" onChange={handleBlogFileChange} />
                        </div>
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
                          <td className="fw-bold text-truncate" style={{maxWidth:'300px'}}>{b.title || ''}</td>
                          <td><span className="badge bg-light text-dark">{b.category || ''}</span></td>
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
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* --- 🔥 TAB QUẢN LÝ YÊU CẦU THUÊ XE --- */}
            {activeTab === 'rentals' && (userRole === 'admin' || userRole === 'staff') && (
              <div className="animation-fade-in">
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-2">
                  <h4 className="fw-bold mb-0"><i className="bi bi-car-front text-info me-2"></i>Quản lý Yêu cầu Thuê xe</h4>
                  
                  <div className="d-flex gap-2 align-items-center">
                    <select 
                      className="form-select form-select-sm border-info rounded-pill px-3 fw-bold text-dark" style={{width: '200px'}}
                      value={rentalFilter} onChange={(e) => setRentalFilter(e.target.value)}
                    >
                      <option value="all">Tất cả trạng thái</option>
                      <option value="pending">Chờ gọi điện tư vấn ⏳</option>
                      <option value="processed">Đã liên hệ xử lý ✅</option>
                    </select>
                    
                    <button className="btn btn-sm btn-info text-white rounded-pill px-3 shadow-sm fw-bold" onClick={() => { setShowRentalForm(!showRentalForm); setIsEditingRental(false); if(showRentalForm) resetRentalForm(); }}>
                      {showRentalForm ? 'Đóng phom' : '+ Thêm phiếu xe'}
                    </button>
                  </div>
                </div>

                {showRentalForm && (
                  <div className="card border-0 shadow-sm p-4 mb-4 rounded-4 border-top border-info border-4 animation-fade-in">
                    <h5 className="fw-bold mb-3 text-info">{isEditingRental ? '✏️ Cập nhật phiếu thuê xe' : '🚗 Nhập phiếu đặt xe trực tiếp qua tổng đài (Hotline)'}</h5>
                    <form onSubmit={handleSubmitRental}>
                      <div className="row g-3">
                        <div className="col-md-4"><label className="small fw-bold">Tên khách hàng *</label><input type="text" className="form-control" name="name" value={rentalFormData.name || ''} onChange={handleRentalInputChange} required /></div>
                        <div className="col-md-4"><label className="small fw-bold">Số điện thoại *</label><input type="tel" className="form-control" name="phone" inputMode="numeric" pattern="\d*" maxLength={15} value={rentalFormData.phone || ''} onChange={handleRentalInputChange} required /></div>
                        <div className="col-md-4"><label className="small fw-bold">Địa chỉ Email *</label><input type="email" className="form-control" name="email" value={rentalFormData.email || ''} onChange={handleRentalInputChange} required /></div>
                        
                        <div className="col-md-6"><label className="small fw-bold">Lộ trình / Điểm đến *</label><input type="text" className="form-control" name="destination" placeholder="VD: Đi Vũng Tàu..." value={rentalFormData.destination || ''} onChange={handleRentalInputChange} required /></div>
                        <div className="col-md-3">
                          <label className="small fw-bold">Dòng xe đăng ký</label>
                          <select className="form-select" name="carType" value={rentalFormData.carType || 'Xe 16 Chỗ'} onChange={handleRentalInputChange}>
                            <option value="Xe 4 - 7 Chỗ">Xe 4 - 7 Chỗ</option>
                            <option value="Xe 16 Chỗ">Xe 16 Chỗ</option>
                            <option value="Xe 29 - 45 Chỗ">Xe 29 - 45 Chỗ</option>
                          </select>
                        </div>
                        <div className="col-md-3">
                          <label className="small fw-bold">Hình thức dịch vụ</label>
                          <select className="form-select" name="rentalType" value={rentalFormData.rentalType || 'driver'} onChange={handleRentalInputChange}>
                            <option value="driver">Cần tài xế phục vụ</option>
                            <option value="self">Thuê xe tự lái</option>
                          </select>
                        </div>

                        <div className="col-md-6"><label className="small fw-bold">Ngày khởi hành *</label><input type="date" className="form-control" name="date" min={getTodayDateString()} value={rentalFormData.date || ''} onChange={handleRentalInputChange} required /></div>
                        <div className="col-md-6"><label className="small fw-bold">Ngày kết thúc thuê *</label><input type="date" className="form-control" name="endDate" min={rentalFormData.date || getTodayDateString()} value={rentalFormData.endDate || ''} onChange={handleRentalInputChange} required /></div>
                      </div>
                      <div className="d-flex gap-2 mt-4 justify-content-end">
                        <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={resetRentalForm}>Hủy bỏ</button>
                        <button type="submit" className="btn btn-info text-white rounded-pill px-5 fw-bold">{isEditingRental ? 'Cập nhật phiếu' : 'Lưu thông tin'}</button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>NGÀY GỬI</th>
                          <th>KHÁCH HÀNG</th>
                          <th>CHI TIẾT XE & LỘ TRÌNH</th>
                          <th>THỜI GIAN</th>
                          <th>TRẠNG THÁI</th>
                          <th className="text-center">HÀNH ĐỘNG</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rentals
                          .filter(r => rentalFilter === 'all' ? true : r.status === rentalFilter)
                          .map(r => (
                            <tr key={r._id} className={r.status === 'pending' ? 'table-warning-light' : ''}>
                              <td className="small text-muted">{new Date(r.createdAt).toLocaleDateString('vi-VN')}</td>
                              <td>
                                <div className="fw-bold text-dark">{r.name || ''}</div>
                                <div className="small text-muted mb-1"><i className="bi bi-telephone-fill me-1"></i>{r.phone || ''}</div>
                                <div style={{fontSize:'11px'}} className="text-muted"><i className="bi bi-envelope-at me-1"></i>{r.email || 'N/A'}</div>
                              </td>
                              <td>
                                <span className="badge bg-primary mb-1">{r.carType || ''}</span> <br/>
                                <small className="fw-bold text-secondary">Lộ trình: </small><span className="small">{r.destination || 'Nội thành'}</span> <br/>
                                <small className="fw-bold text-secondary">Hình thức: </small><span className="small text-info fw-bold">{r.rentalType === 'self' ? 'Tự lái' : 'Có tài xế'}</span>
                              </td>
                              <td className="small">
                                Đi: <strong>{r.date || ''}</strong> <br/>
                                Về: <strong>{r.endDate || 'Trong ngày'}</strong>
                              </td>
                              <td><span className={`badge rounded-pill px-3 py-2 ${r.status === 'processed' ? 'bg-success' : 'bg-warning text-dark'}`}>{r.status === 'processed' ? 'Đã liên hệ' : 'Chờ gọi điện'}</span></td>
                              <td className="text-center">
                                <div className="d-flex justify-content-center gap-1">
                                  <button className={`btn btn-sm rounded-circle ${r.status === 'processed' ? 'btn-outline-secondary' : 'btn-success text-white'}`} onClick={() => handleUpdateRental(r._id, r.status)} title="Duyệt trạng thái"><i className="bi bi-check2-all"></i></button>
                                  <button className="btn btn-sm btn-outline-primary rounded-circle" onClick={() => handleEditRentalClick(r)} title="Sửa"><i className="bi bi-pencil"></i></button>
                                  <button className="btn btn-sm btn-outline-danger rounded-circle" onClick={() => handleDeleteRental(r._id)} title="Xóa"><i className="bi bi-trash"></i></button>
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

            {/* --- 🚗 TAB QUẢN LÝ XE KHO XE --- */}
            {activeTab === 'cars' && (userRole === 'admin' || userRole === 'staff') && (
              <div className="animation-fade-in">
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-2">
                  <h4 className="fw-bold mb-0"><i className="bi bi-car-front text-success me-2"></i>Quản lý Kho Xe</h4>
                  <button className="btn btn-sm btn-success text-white rounded-pill px-3 shadow-sm fw-bold" onClick={() => {
                    const nextVisible = !showCarForm;
                    setShowCarForm(nextVisible);
                    setIsEditingCar(false);
                    if (nextVisible) {
                      setCarFormData({ _id: '', name: '', carType: 'Van', seats: 16, pricePerDay: 1000000, description: '', image: '', features: [], licensePlate: '', manufacturer: '', yearManufactured: new Date().getFullYear() });
                    }
                  }}>
                    {showCarForm ? 'Đóng form' : '+ Thêm xe mới'}
                  </button>
                </div>

                {showCarForm && (
                  <div className="card border-0 shadow-sm p-4 mb-4 rounded-4 border-top border-success border-4 animation-fade-in">
                    <h5 className="fw-bold mb-3 text-success">{isEditingCar ? '✏️ Cập nhật thông tin xe' : '🚗 Thêm xe mới vào hệ thống'}</h5>
                    <form onSubmit={handleSubmitCar}>
                      <div className="row g-3">
                        <div className="col-md-4"><label className="small fw-bold">Tên xe *</label><input type="text" className="form-control" name="name" value={carFormData.name || ''} onChange={handleCarInputChange} required /></div>
                        <div className="col-md-4"><label className="small fw-bold">Loại xe *</label><input type="text" className="form-control" name="carType" value={carFormData.carType || ''} onChange={handleCarInputChange} required /></div>
                        <div className="col-md-4"><label className="small fw-bold">Biển số xe *</label><input type="text" className="form-control" name="licensePlate" value={carFormData.licensePlate || ''} onChange={handleCarInputChange} required /></div>
                        
                        <div className="col-md-3"><label className="small fw-bold">Số ghế *</label><input type="number" className="form-control" name="seats" min="1" value={carFormData.seats || 16} onChange={handleCarInputChange} required /></div>
                        <div className="col-md-3"><label className="small fw-bold">Giá/ngày (VNĐ) *</label><input type="number" className="form-control" name="pricePerDay" min="0" value={carFormData.pricePerDay || ''} onChange={handleCarInputChange} required /></div>
                        <div className="col-md-3"><label className="small fw-bold">Hãng sản xuất</label><input type="text" className="form-control" name="manufacturer" value={carFormData.manufacturer || ''} onChange={handleCarInputChange} /></div>
                        <div className="col-md-3"><label className="small fw-bold">Năm sản xuất</label><input type="number" className="form-control" name="yearManufactured" value={carFormData.yearManufactured || new Date().getFullYear()} onChange={handleCarInputChange} /></div>
                        
                        <div className="col-md-12"><label className="small fw-bold">Mô tả xe</label><textarea className="form-control" name="description" rows="2" value={carFormData.description || ''} onChange={handleCarInputChange}></textarea></div>
                        <div className="col-md-12"><label className="small fw-bold">Hình ảnh xe</label><input type="file" className="form-control" accept="image/*" onChange={handleCarFileChange} /></div>
                        
                        {carFormData.image && <div className="col-md-12"><img src={carFormData.image} alt="preview" style={{maxWidth: '200px', maxHeight: '150px'}} className="rounded border shadow-sm" /></div>}
                      </div>
                      <div className="d-flex gap-2 mt-4 justify-content-end">
                        <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={resetCarForm}>Hủy bỏ</button>
                        <button type="submit" className="btn btn-success text-white rounded-pill px-5 fw-bold">{isEditingCar ? 'Cập nhật xe' : 'Thêm xe'}</button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>TÊN XE</th>
                          <th>LOẠI</th>
                          <th>BIỂN SỐ</th>
                          <th>GHẾ</th>
                          <th>GIÁ/NGÀY</th>
                          <th>TRẠNG THÁI</th>
                          <th className="text-center">HÀNH ĐỘNG</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCars.map(car => (
                            <tr key={car._id}>
                              <td className="small fw-bold">{car.name || ''}</td>
                              <td className="small">{car.carType || ''}</td>
                              <td className="small text-info fw-bold">{car.licensePlate || 'N/A'}</td>
                              <td className="small text-center"><span className="badge bg-primary">{car.seats || 0} chỗ</span></td>
                              <td className="small fw-bold text-danger">{car.pricePerDay?.toLocaleString('vi-VN')} VNĐ</td>
                              <td className="text-center"><span className={`badge rounded-pill px-3 py-2 ${car.status === 'available' ? 'bg-success' : car.status === 'rented' ? 'bg-warning text-dark' : 'bg-secondary'}`}>{car.status === 'available' ? 'Sẵn sàng' : car.status === 'rented' ? 'Đang cho thuê' : 'Bảo trì'}</span></td>
                              <td className="text-center">
                                <div className="d-flex justify-content-center gap-1">
                                  <button className="btn btn-sm btn-outline-primary rounded-circle" onClick={() => handleEditCarClick(car)} title="Sửa"><i className="bi bi-pencil"></i></button>
                                  <button className="btn btn-sm btn-outline-danger rounded-circle" onClick={() => handleDeleteCar(car._id)} title="Xóa"><i className="bi bi-trash"></i></button>
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
                  <button className="btn btn-success fw-bold shadow-sm rounded-pill px-4" onClick={exportRevenueToExcel}><i className="bi bi-file-earmark-excel-fill me-2"></i> Xuất Báo Cáo Excel</button>
                </div>
                
                <div className="row g-3 mb-4">
                  <div className="col-md-3">
                    <div className="rev-card rev-card-blue">
                      <div className="stat-label"><i className="bi bi-currency-dollar me-1"></i>DOANH THU THÁNG</div>
                      <div className="stat-value">{revenueData.totalMonth.toLocaleString()} VNĐ</div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="rev-card rev-card-white">
                      <div className="stat-label text-muted"><i className="bi bi-calendar-day me-1"></i>DOANH THU HÔM NAY</div>
                      <div className="stat-value text-dark">{revenueData.totalToday.toLocaleString()} VNĐ</div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="rev-card rev-card-green">
                      <div className="stat-label"><i className="bi bi-check-circle me-1"></i>ĐƠN THÀNH CÔNG</div>
                      <div className="stat-value">{revenueData.successCount}</div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="rev-card rev-card-white">
                      <div className="stat-label text-muted"><i className="bi bi-star me-1"></i>TOUR PHỔ BIẾN</div>
                      <div className="stat-value text-dark fs-5 text-truncate" title={revenueData.popularTour}>{revenueData.popularTour}</div>
                    </div>
                  </div>
                </div>

                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light text-muted small"><tr><th>Mã Đơn</th><th>Ngày Đặt</th><th>Tên Tour</th><th>Tổng Tiền</th><th>Trạng Thái</th></tr></thead>
                    <tbody>
                      {filteredRevenueBookings.map(b => (
                        <tr key={b._id}>
                          <td className="fw-bold text-secondary">#{String(b._id).substring(18).toUpperCase()}</td>
                          <td>{new Date(b.createdAt).toLocaleDateString('vi-VN')}</td>
                          <td className="fw-bold text-truncate" style={{maxWidth: '200px'}}>{b.tourId?.title || <span className="text-muted fst-italic">Tour đã xóa</span>}</td>
                          <td className="fw-bold text-primary">{b.totalPrice?.toLocaleString()}đ</td>
                          <td><span className="badge bg-success rounded-pill px-3 py-2">Đã Thanh Toán</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {selectedTour && (
        <div className="modal-overlay" onClick={handleCloseTourModal}>
          <div className="modal-box p-4" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h5 className="fw-bold mb-1">{selectedTour.title || 'Chi tiết Tour'}</h5>
                <div className="text-muted small">{selectedTour.city ? `Điểm đến: ${selectedTour.city}` : 'Không có điểm đến'}</div>
              </div>
              <button type="button" className="btn btn-sm btn-outline-secondary" onClick={handleCloseTourModal}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <img
              src={selectedTour.image?.startsWith('data:') ? selectedTour.image : resolveImageUrl(selectedTour.image)}
              alt={selectedTour.title}
              className="rounded mb-3 w-100"
              style={{ maxHeight: '260px', objectFit: 'cover' }}
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80'; }}
            />
            <div className="row g-3 mb-3">
              <div className="col-12">
                <div className="d-flex flex-wrap gap-2">
                  <span className="badge bg-info text-white">Giá: {Number(selectedTour.price || 0).toLocaleString()} đ</span>
                  <span className="badge bg-success text-white">Thời lượng: {selectedTour.duration || 'Không xác định'}</span>
                  <span className="badge bg-warning text-dark">Chỗ trống: {selectedTour.availableSeats || 0}</span>
                  <span className="badge bg-secondary text-white">Danh mục: {selectedTour.category || 'Chưa phân loại'}</span>
                </div>
              </div>
              <div className="col-md-6">
                <strong>Ngày khởi hành</strong>
                <div>{selectedTour.startDate || '---'}</div>
              </div>
              <div className="col-md-6">
                <strong>Ngày kết thúc</strong>
                <div>{selectedTour.endDate || '---'}</div>
              </div>
              <div className="col-12">
                <strong>Mô tả</strong>
                <p className="text-muted mb-0">{selectedTour.description || 'Không có mô tả chi tiết.'}</p>
              </div>
            </div>
            <div className="text-end">
              <button type="button" className="btn btn-secondary rounded-pill" onClick={handleCloseTourModal}>Đóng</button>
            </div>
          </div>
        </div>
      )}

      {selectedBooking && (
        <div className="modal-overlay" onClick={handleCloseBookingModal}>
          <div className="modal-box p-4" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h5 className="fw-bold mb-1">Chi tiết Đơn đặt</h5>
                <div className="text-muted small">Mã đơn: #{String(selectedBooking._id || '').substring(18).toUpperCase()}</div>
              </div>
              <button type="button" className="btn btn-sm btn-outline-secondary" onClick={handleCloseBookingModal}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <strong>Khách hàng</strong>
                <div>{selectedBooking.userId?.name || selectedBooking.name || 'Khách vãng lai'}</div>
              </div>
              <div className="col-md-6">
                <strong>Điện thoại</strong>
                <div>{selectedBooking.userId?.phone || selectedBooking.phone || '---'}</div>
              </div>
              <div className="col-md-6">
                <strong>Tour</strong>
                <div>{selectedBooking.tourId?.title || 'Tour đã xóa'}</div>
              </div>
              <div className="col-md-6">
                <strong>Số khách</strong>
                <div>{selectedBooking.guestSize || 1} người</div>
              </div>
              <div className="col-md-6">
                <strong>Trạng thái</strong>
                <div>{selectedBooking.status === 'paid' ? 'Đã thanh toán' : selectedBooking.status === 'cancelled' ? 'Đã hủy' : 'Chờ xử lý'}</div>
              </div>
              <div className="col-md-6">
                <strong>Tổng tiền</strong>
                <div>{Number(selectedBooking.totalPrice || 0).toLocaleString()} đ</div>
              </div>
              <div className="col-md-12">
                <strong>Ghi chú</strong>
                <p className="text-muted mb-0">{selectedBooking.note || selectedBooking.message || 'Không có ghi chú thêm.'}</p>
              </div>
            </div>
            <div className="text-end">
              <button type="button" className="btn btn-secondary rounded-pill" onClick={handleCloseBookingModal}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;