/*
 * ChatWidget.jsx
 * Widget chat nổi, hỗ trợ chat nhân viên và AI.
 * Chèn chú thích giải thích mục đích chính của file.
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Dùng để gọi API khi chat với AI
import io from 'socket.io-client';
import API_BASE_URL from '../utils/apiConfig';

// Khởi tạo socket nhưng không tự động kết nối ngay lập tức.
const socket = io(API_BASE_URL, { autoConnect: false });

function ChatWidget() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // Kiểm soát widget chat đóng/mở
  
  // chatMode: điều hướng nội dung chat
  // 'menu' = menu lựa chọn, 'live' = kết nối nhân viên, 'ai' = chat bot
  const [chatMode, setChatMode] = useState('menu'); 
  const [message, setMessage] = useState(''); // Nội dung người dùng nhập
  const [chatLog, setChatLog] = useState([]); // Lưu lịch sử tin nhắn đã hiển thị
  const messagesEndRef = useRef(null); // Dùng để scroll xuống cuối chat
  const chatModeRef = useRef(chatMode); // Giữ giá trị chế độ chat mới nhất cho callback

  const [currentUser, setCurrentUser] = useState('');
  const [currentUserRole, setCurrentUserRole] = useState('user');
  const [isBotTyping, setIsBotTyping] = useState(false); // Hiển thị trạng thái AI đang trả lời

  // Lấy thông tin User hoặc tạo Khách ảo
  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      setCurrentUser(user.name);
      setCurrentUserRole(user.role || 'user');
    } else {
      let guestName = sessionStorage.getItem('guestName');
      if (!guestName) {
        guestName = `Khách_${Math.floor(Math.random() * 1000)}`;
        sessionStorage.setItem('guestName', guestName);
      }
      setCurrentUser(guestName);
      setCurrentUserRole('guest');
    }
  }, []);

  // Lắng nghe tin nhắn từ nhân viên (Chỉ chạy khi ở chế độ 'live')
  useEffect(() => {
    chatModeRef.current = chatMode;
  }, [chatMode]);

  useEffect(() => {
    const handleReceive = (data) => {
      if (chatModeRef.current === 'live') {
        setChatLog((prev) => {
          const last = prev[prev.length - 1];
          if (last && last.sender === data.sender && last.text === data.text && last.role === data.role) {
            return prev;
          }
          return [...prev, data];
        });
      }
    };
    socket.on('receive_message', handleReceive);
    return () => socket.off('receive_message', handleReceive);
  }, []);

  // Cuộn xuống tin nhắn cuối cùng
  useEffect(() => {
    if (chatMode === 'live' || chatMode === 'ai') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatLog, isOpen, chatMode, isBotTyping]);

  // --- CHẾ ĐỘ CHAT VỚI NHÂN VIÊN ---
  const startLiveChat = () => {
    // Nếu socket chưa kết nối thì kết nối đến server
    if (!socket.connected) {
      socket.connect();
    }
    // Tham gia phòng Support_Room để nhân viên hỗ trợ có thể gửi và nhận tin nhắn
    socket.emit('join_room', "Support_Room");
    setChatLog([{ 
      sender: 'Hệ thống', 
      text: 'Đang kết nối với nhân viên, bạn vui lòng đợi nhé...', 
      role: 'system', 
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) 
    }]);
    setChatMode('live');
  };

  // --- CHẾ ĐỘ CHAT VỚI AI ---
  const startAiChat = () => {
    // Khởi tạo lịch sử chat cho chế độ AI
    setChatLog([{ 
      sender: '🤖 VietBot', 
      text: `Chào ${currentUser.split(' ').pop()}! Mình là Trợ lý AI của Du Lịch Việt. Mình có thể giúp gì cho bạn hôm nay?`, 
      role: 'bot', 
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) 
    }]);
    setChatMode('ai');
  };

  const handleSend = async (e) => {
    e.preventDefault(); // Ngăn form submit gây reload trang
    if (message.trim() !== '') {
      const msgText = message;
      setMessage(''); // Xóa nội dung input ngay khi người dùng gửi
      
      const currentTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      const userMsg = { sender: currentUser, text: msgText, time: currentTime, role: currentUserRole };

      // 1. Hiển thị tin nhắn người dùng lên giao diện ngay lập tức
      setChatLog((prev) => {
        const last = prev[prev.length - 1];
        if (last && last.sender === userMsg.sender && last.text === userMsg.text && last.role === userMsg.role) {
          return prev;
        }
        return [...prev, userMsg];
      });

      // 2. Xử lý gửi tin nhắn theo chế độ đang bật
      if (chatMode === 'live') {
        // Gửi tin nhắn đến server Socket để nhân viên có thể nhận
        socket.emit('send_message', { ...userMsg, room: "Support_Room" });
      } else if (chatMode === 'ai') {
        // Gửi tin nhắn đến API AI và chờ phản hồi
        setIsBotTyping(true);
        try {
          const res = await axios.post(`${API_BASE_URL}/api/chat/ai`, { message: msgText });
          const botMsg = { 
            sender: '🤖 VietBot', 
            text: res.data.text, 
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }), 
            role: 'bot' 
          };
          setChatLog((prev) => [...prev, botMsg]);
        } catch (error) {
          setChatLog((prev) => [...prev, { 
            sender: '🤖 VietBot', 
            text: 'Xin lỗi, hệ thống AI đang quá tải. Bạn vui lòng thử lại sau hoặc chat với nhân viên nhé!', 
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }), 
            role: 'bot' 
          }]);
        } finally {
          setIsBotTyping(false); // Tắt trạng thái gõ của bot
        }
      }
    }
  };

  const handleMenuClick = (path) => {
    setIsOpen(false); 
    navigate(path);   
  };

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999 }}>
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="btn btn-info text-white rounded-circle shadow-lg d-flex align-items-center justify-content-center hover-scale"
          style={{ width: '60px', height: '60px' }}
        >
          <i className="bi bi-chat-dots-fill fs-3"></i>
        </button>
      )}

      {isOpen && (
        <div className="card shadow-lg border-0 rounded-4 overflow-hidden" style={{ width: '350px', height: '480px', display: 'flex', flexDirection: 'column' }}>
          
          {/* HEADER CHAT */}
          <div className="bg-info text-white p-3 d-flex justify-content-between align-items-center shadow-sm z-1">
            <div className="d-flex align-items-center">
              {(chatMode === 'live' || chatMode === 'ai') && (
                <button onClick={() => setChatMode('menu')} className="btn btn-sm text-white p-0 me-2 border-0" title="Quay lại Menu">
                  <i className="bi bi-arrow-left fs-5"></i>
                </button>
              )}
              <h6 className="mb-0 fw-bold">
                <i className="bi bi-headset me-2"></i> 
                {chatMode === 'ai' ? 'Trợ lý AI' : 'CSKH Du Lịch Việt'}
              </h6>
            </div>
            <button onClick={() => setIsOpen(false)} className="btn-close btn-close-white"></button>
          </div>

          {/* NỘI DUNG CHAT */}
          {chatMode === 'menu' ? (
            <div className="card-body bg-light d-flex flex-column align-items-center p-4">
              <div className="bg-white p-3 rounded-4 shadow-sm text-center mb-4 w-100 border">
                <h5 className="fw-bold text-info mb-2">👋 Xin chào!</h5>
                <p className="text-muted small mb-0">Bạn muốn được tư vấn bằng cách nào ạ?</p>
              </div>
              
              <div className="w-100 d-flex flex-column gap-3">

                {/* NÚT NHÂN VIÊN */}
                <button className="btn btn-info text-white rounded-pill fw-bold shadow-sm py-2 text-start px-4 d-flex align-items-center hover-scale" onClick={startLiveChat}>
                  <i className="bi bi-person-lines-fill fs-4 me-3"></i> 
                  <div>
                    <div className="lh-1 mb-1">Chat với Nhân viên</div>
                    <small className="fw-normal" style={{fontSize: '11px'}}>Hỗ trợ trực tuyến trong giờ HC</small>
                  </div>
                </button>

                {/* NÚT AI đã ẩn theo yêu cầu */}
                <div className="text-center text-muted my-1 small">-- hoặc truy cập nhanh --</div>
                <button className="btn btn-outline-secondary rounded-pill text-start px-4 small" onClick={() => handleMenuClick('/tour-trong-nuoc')}>
                  🌍 Xem danh sách Tour
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="card-body" style={{ overflowY: 'auto', flexGrow: 1, backgroundColor: '#f8f9fa' }}>
                {chatLog.map((msg, index) => {
                  const isSystem = msg.role === 'system';
                  if (isSystem) return <div key={index} className="text-center text-muted small my-2">{msg.text}</div>;

                  // Logic phân Trái/Phải: Tin nhắn của MÌNH thì nằm PHẢI, của NGƯỜI KHÁC/BOT thì nằm TRÁI
                  const isMyMessage = msg.sender === currentUser;
                  const isBotOrStaff = msg.role === 'admin' || msg.role === 'staff' || msg.role === 'bot';
                  
                  return (
                    <div key={index} className={`mb-3 ${isMyMessage ? 'text-end' : 'text-start'}`}>
                      <div 
                        className={`d-inline-block p-2 px-3 rounded-4 shadow-sm ${isMyMessage ? 'bg-info text-white' : isBotOrStaff ? 'bg-white border text-dark' : 'bg-secondary text-white'}`} 
                        style={{ 
                          maxWidth: '85%', 
                          textAlign: 'left',
                          borderBottomRightRadius: isMyMessage ? '4px' : '16px',
                          borderBottomLeftRadius: !isMyMessage ? '4px' : '16px'
                        }}
                      >
                        <small className={`d-block fw-bold mb-1 ${isMyMessage ? 'text-light' : 'text-info'}`} style={{ fontSize: '11px', opacity: 0.9 }}>
                          {isMyMessage ? 'Bạn' : msg.sender}
                        </small>
                        {/* Hỗ trợ render text có xuống dòng (\n) từ AI */}
                        <span style={{ fontSize: '14px' }} dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }}></span>
                      </div>
                      <div style={{ fontSize: '10px' }} className="text-muted mt-1 px-1">{msg.time}</div>
                    </div>
                  );
                })}

                {/* HIỆU ỨNG TYPING KHI AI ĐANG NGHĨ */}
                {isBotTyping && (
                  <div className="text-start mb-3">
                    <div className="d-inline-block p-2 px-3 rounded-4 shadow-sm bg-white border">
                      <span className="spinner-grow spinner-grow-sm text-info align-middle" role="status" aria-hidden="true" style={{width: '1rem', height: '1rem'}}></span>
                      <small className="ms-2 text-muted fw-bold">VietBot đang suy nghĩ...</small>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <div className="p-3 bg-white border-top">
                <form onSubmit={handleSend} className="d-flex gap-2">
                  <input 
                    type="text" 
                    className="form-control rounded-pill bg-light border-0 px-3" 
                    placeholder={chatMode === 'ai' ? "Hỏi VietBot điều gì đó..." : "Nhập câu hỏi..."} 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    disabled={isBotTyping} // Khóa ô nhập khi AI đang gõ
                  />
                  <button type="submit" className="btn btn-info text-white rounded-circle shadow-sm" style={{ width: '40px', height: '40px', flexShrink: 0 }} disabled={isBotTyping}>
                    <i className="bi bi-send-fill"></i>
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ChatWidget;