/*
 * Dashboard.jsx
 * Trang tổng quan nội dung.
 * Chèn chú thích giải thích mục đích chính của file.
 */

import { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../utils/apiConfig';

function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/bookings`);
        setBookings(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Tính toán các con số thống kê
  const totalRevenue = bookings.filter(b => b.status === 'paid').reduce((sum, b) => sum + b.totalPrice, 0);
  const totalGuests = bookings.reduce((sum, b) => sum + (b.guestSize || 0), 0);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
            Hệ thống quản trị
          </h1>
          <p className="text-gray-600 text-lg">Theo dõi hoạt động kinh doanh và đơn đặt tour của bạn.</p>
        </div>

        {/* CÁC CARD THỐNG KÊ NHANH */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:scale-105 transform">
            <div className="flex items-center gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl text-white shadow-lg">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Tổng doanh thu</p>
                <p className="text-3xl font-black text-gray-900">{totalRevenue.toLocaleString('vi-VN')} ₫</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:scale-105 transform">
            <div className="flex items-center gap-6">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-2xl text-white shadow-lg">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Số đơn đặt tour</p>
                <p className="text-3xl font-black text-gray-900">{bookings.length} đơn</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:scale-105 transform">
            <div className="flex items-center gap-6">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-2xl text-white shadow-lg">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Tổng số khách</p>
                <p className="text-3xl font-black text-gray-900">{totalGuests} khách</p>
              </div>
            </div>
          </div>
        </div>

        {/* BẢNG DỮ LIỆU */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="p-8 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-2xl font-bold text-gray-800">Chi tiết các đơn hàng</h2>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg">
              Xuất file Excel
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm uppercase tracking-wider font-bold">
                  <th className="px-8 py-5">Mã Đơn</th>
                  <th className="px-8 py-5">Khách Hàng</th>
                  <th className="px-8 py-5">Tour / Ngày đặt</th>
                  <th className="px-8 py-5">Tổng tiền</th>
                  <th className="px-8 py-5 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((booking, index) => (
                  <tr key={booking._id} className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                    <td className="px-8 py-6 font-mono text-sm text-gray-500 font-semibold">#{booking._id.slice(-6).toUpperCase()}</td>
                    <td className="px-8 py-6">
                      <div className="font-bold text-gray-900 text-lg">{booking.userId?.name || 'Ẩn danh'}</div>
                      <div className="text-sm text-gray-500">{booking.userId?.email}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="font-semibold text-blue-600 text-lg truncate max-w-[250px]">{booking.tourId?.title}</div>
                      <div className="text-sm text-gray-500">{new Date(booking.createdAt).toLocaleDateString('vi-VN')}</div>
                    </td>
                    <td className="px-8 py-6 font-black text-gray-900 text-lg">
                      {booking.totalPrice.toLocaleString('vi-VN')} ₫
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-4 py-2 rounded-full text-sm font-bold tracking-wide shadow-md ${
                        booking.status === 'paid'
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                        : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white'
                      }`}>
                        {booking.status === 'paid' ? 'ĐÃ TRẢ TIỀN' : 'CHỜ THANH TOÁN'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;