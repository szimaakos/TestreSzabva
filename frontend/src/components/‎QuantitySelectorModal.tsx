import React, { useState } from "react";
import "./‎QuantitySelectorModal.css";

interface QuantitySelectorModalProps {
  initialQuantity: number;
  onConfirm: (quantity: number) => void;
  onClose: () => void;
}

const QuantitySelectorModal: React.FC<QuantitySelectorModalProps> = ({
  initialQuantity,
  onConfirm,
  onClose,
}) => {
  const [quantity, setQuantity] = useState<number>(initialQuantity);

  const handleSubmit = () => {
    if (quantity > 0) {
      onConfirm(quantity);
    } else {
      alert("Kérlek, érvényes számot adj meg!");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Adag beállítása</h3>
        <div className="modal-body">
          <label htmlFor="quantityInput">Adagok száma:</label>
          <input
            id="quantityInput"
            type="number"
            value={quantity}
            min="1"
            onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
          />
        </div>
        <div className="modal-actions">
          <button className="confirm-button" onClick={handleSubmit}>
            Megerősít
          </button>
          <button className="cancel-button" onClick={onClose}>
            Mégse
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuantitySelectorModal;