/*
 * AppUpdateNotification.jsx
 * Component hiển thị thông báo cập nhật app
 */

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { checkAppVersion } from '../utils/notificationUtils';

const APP_VERSION = '1.0.0'; // Cập nhật version này khi có bản mới

const AppUpdateNotification = () => {
  const [showUpdate, setShowUpdate] = useState(false);
  const [updateData, setUpdateData] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  // Kiểm tra cập nhật khi component mount
  useEffect(() => {
    checkForUpdates();

    // Kiểm tra cập nhật mỗi 1 giờ
    const interval = setInterval(checkForUpdates, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const checkForUpdates = async () => {
    setIsChecking(true);
    try {
      const data = await checkAppVersion(APP_VERSION);

      if (data && data.updateAvailable) {
        setUpdateData(data);
        setShowUpdate(true);

        // Nếu là cập nhật bắt buộc, không cho đóng thông báo
        if (data.isRequired) {
          showUpdateAlert(data, true);
        }
      }
    } catch (error) {
      console.error('Lỗi kiểm tra cập nhật:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const showUpdateAlert = (data, isRequired = false) => {
    Swal.fire({
      title: '📱 Có phiên bản mới!',
      html: `
        <div style="text-align: left;">
          <p><strong>Phiên bản hiện tại:</strong> ${data.currentVersion}</p>
          <p><strong>Phiên bản mới:</strong> ${data.latestVersion}</p>
          ${data.description ? `<p><strong>Nội dung cập nhật:</strong> ${data.description}</p>` : ''}
          ${data.isCritical ? '<p style="color: red;"><strong>⚠️ Cập nhật quan trọng - vui lòng cập nhật ngay</strong></p>' : ''}
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Cập nhật ngay',
      cancelButtonText: isRequired ? null : 'Để sau',
      allowOutsideClick: isRequired ? false : true,
      allowEscapeKey: isRequired ? false : true,
      showCancelButton: !isRequired
    }).then((result) => {
      if (result.isConfirmed) {
        handleUpdate(data);
      }
    });
  };

  const handleUpdate = (data) => {
    // Nếu có download URL (cho mobile app)
    if (data.downloadUrl) {
      window.open(data.downloadUrl, '_blank');
    } else {
      // Cho web app, reload trang để lấy phiên bản mới
      window.location.reload();
    }
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  if (!showUpdate || !updateData) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      backgroundColor: '#ff6b6b',
      color: 'white',
      padding: '12px 16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 9999,
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      animation: 'slideDown 0.3s ease-in-out'
    }}>
      <style>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>

      <span style={{ fontSize: '14px', fontWeight: '500' }}>
        📱 Có phiên bản mới! Phiên bản {updateData.latestVersion} đã sẵn sàng.
      </span>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => handleUpdate(updateData)}
          style={{
            backgroundColor: 'white',
            color: '#ff6b6b',
            border: 'none',
            padding: '6px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '12px'
          }}
        >
          Cập nhật
        </button>
        {!updateData.isRequired && (
          <button
            onClick={handleDismiss}
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              padding: '6px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Để sau
          </button>
        )}
      </div>
    </div>
  );
};

export default AppUpdateNotification;
