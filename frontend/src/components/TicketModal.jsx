/*
 * TicketModal.jsx
 * Modal hiển thị vé hoặc QR check-in.
 * Chèn chú thích giải thích mục đích chính của file.
 */

import { Modal } from 'react-bootstrap';
import { QRCodeSVG } from 'qrcode.react';

const TicketModal = ({ show, onHide, booking, tourData }) => {
  if (!booking || !tourData) return null;

  return (
    <Modal show={show} onHide={onHide} centered size="md">
      <Modal.Header closeButton className="border-0 pb-0"></Modal.Header>
      <Modal.Body className="text-center px-4 pb-5">
        <div className="ticket-header mb-4">
          <i className="bi bi-check-circle-fill text-success display-4"></i>
          <h4 className="fw-bold mt-2 text-uppercase">Vé Điện Tử</h4>
          <p className="text-muted small">Mã đơn hàng: #{booking._id.substring(0, 8).toUpperCase()}</p>
        </div>

        <div className="qr-box p-3 bg-white border rounded-4 d-inline-block mb-4 shadow-sm">
          <QRCodeSVG 
            value={`TOUR-ID: ${booking._id} | CUSTOMER: ${booking.userId}`} 
            size={180}
            level={"H"}
            includeMargin={true}
          />
        </div>

        <div className="tour-info-ticket text-start bg-light p-3 rounded-4 mb-3">
          <div className="mb-2">
            <small className="text-muted d-block text-uppercase fw-bold" style={{fontSize: '10px'}}>Tên hành trình</small>
            <span className="fw-bold text-dark">{tourData.title}</span>
          </div>
          <div className="row">
            <div className="col-6 mb-2">
              <small className="text-muted d-block text-uppercase fw-bold" style={{fontSize: '10px'}}>Ngày khởi hành</small>
              <span className="fw-bold">{tourData.startDate || 'Hàng ngày'}</span>
            </div>
            <div className="col-6 mb-2">
              <small className="text-muted d-block text-uppercase fw-bold" style={{fontSize: '10px'}}>Số lượng khách</small>
              <span className="fw-bold">{booking.guestSize} Người</span>
            </div>
          </div>
          <div className="border-top pt-2 mt-2 d-flex justify-content-between">
            <span className="small fw-bold">TRẠNG THÁI:</span>
            <span className="badge bg-success">ĐÃ THANH TOÁN</span>
          </div>
        </div>

        <p className="small text-muted fst-italic mb-0">
          * Vui lòng xuất trình mã này tại quầy làm thủ tục hoặc điểm đón khách.
        </p>
      </Modal.Body>
      <div className="text-center pb-4">
        <button className="btn btn-outline-info rounded-pill px-4 btn-sm" onClick={() => window.print()}>
          <i className="bi bi-printer me-2"></i>In vé ngay
        </button>
      </div>
    </Modal>
  );
};

export default TicketModal;