import React, { useEffect } from "react";
import "../CSS/notificationModal.css";

function NotificationModal({
  isOpen,
  onClose,
  onConfirm,
  message,
  successMessage,
}) {
  useEffect(() => {
    console.log("Modal isOpen:", isOpen);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = (e) => {
    e.preventDefault();
    onConfirm();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Confirmación de solicitud</h3>
        <p>{message}</p>

        {successMessage ? (
          <p className="success-message">{successMessage}</p>
        ) : (
          <div className="modal-buttons">
            <button className="button-small-yellow" onClick={handleConfirm}>
              Enviar
            </button>
            <button className="button-small-gray" onClick={onClose}>
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationModal;
