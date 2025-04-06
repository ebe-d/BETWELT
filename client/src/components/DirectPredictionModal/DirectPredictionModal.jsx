import React, { useState, useEffect } from 'react';
import styles from './directpredictionmodal.module.css';
import { useModal } from '../../context/ModalContext';

const DirectPredictionModal = ({ isOpen, onClose, event, onConfirm }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [predictionAmount, setPredictionAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { openModal, closeModal } = useModal();

  console.log("DirectPredictionModal rendered for event:", event?.name);

  // Reset form when modal opens or event changes
  useEffect(() => {
    if (isOpen) {
      setSelectedOption(null);
      setPredictionAmount('');
      setError('');
      setSuccess('');
      setIsSubmitting(false);
      // Use the modal context to update the global modal state
      openModal();
    }
    
    return () => {
      if (isOpen) {
        closeModal();
      }
    };
  }, [isOpen, event, openModal, closeModal]);

  // Handle modal close with cleanup
  const handleClose = () => {
    closeModal();
    onClose();
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d+(\.\d{0,2})?$/.test(value)) {
      setPredictionAmount(value);
      setError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedOption) {
      setError('Please select Yes or No');
      return;
    }
    
    const amount = parseFloat(predictionAmount);
    
    if (!predictionAmount || isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    // Get the selected odds based on the option
    const odds = selectedOption === 'yes' ? 
      (event.odds?.yes || event.odds?.option1 || 2.0) : 
      (event.odds?.no || event.odds?.option2 || 1.5);
    
    // Calculate potential winnings
    const potentialWinnings = amount * odds;
    
    setIsSubmitting(true);
    setSuccess('Processing your prediction...');

    // Send the prediction data to the parent component for processing
    onConfirm({
      eventId: event.id,
      eventName: event.name || event.title,
      option: selectedOption,
      amount,
      odds,
      potentialWinnings
    });
    
    // Reset form state after submission
    setIsSubmitting(false);
    setSuccess('Prediction placed successfully!');
    setPredictionAmount('');
    setSelectedOption(null);
    
    // Close the modal after a short delay
    setTimeout(() => {
      handleClose();
    }, 1500);
  };

  if (!isOpen) {
    return null;
  }

  // Determine the available options and odds
  let yesOdds = event.odds?.yes || event.odds?.option1 || 2.0;
  let noOdds = event.odds?.no || event.odds?.option2 || 1.5;

  return (
    <div className={styles.modalOverlay} onClick={(e) => {
      if (e.target.className === styles.modalOverlay) {
        handleClose();
      }
    }}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Place Your Prediction</h2>
          <button className={styles.closeButton} onClick={handleClose}>×</button>
        </div>
        
        <div className={styles.eventInfo}>
          <h3>{event.name || event.title}</h3>
          <div className={styles.eventMeta}>
            <span>{event.category}</span>
            {event.date && <span>{new Date(event.date).toLocaleDateString()}</span>}
          </div>
        </div>
        
        <form className={styles.predictionForm} onSubmit={handleSubmit}>
          <div className={styles.optionsSection}>
            <h4>Select Your Prediction</h4>
            <div className={styles.optionsGrid}>
              <button 
                type="button"
                className={`${styles.optionButton} ${styles.yesOption} ${selectedOption === 'yes' ? styles.selected : ''}`}
                onClick={() => setSelectedOption('yes')}
              >
                Yes
                <span className={styles.odds}>{yesOdds}</span>
              </button>
              
              <button 
                type="button"
                className={`${styles.optionButton} ${styles.noOption} ${selectedOption === 'no' ? styles.selected : ''}`}
                onClick={() => setSelectedOption('no')}
              >
                No
                <span className={styles.odds}>{noOdds}</span>
              </button>
            </div>
          </div>
          
          <div className={styles.amountSection}>
            <h4>Enter Prediction Amount</h4>
            <div className={styles.amountInput}>
              <span className={styles.currencySymbol}>PDX</span>
              <input
                type="text"
                value={predictionAmount}
                onChange={handleAmountChange}
                placeholder="0.00"
                disabled={isSubmitting}
              />
            </div>
            
            <div className={styles.quickAmounts}>
              <button type="button" onClick={() => setPredictionAmount('10')}>$10</button>
              <button type="button" onClick={() => setPredictionAmount('25')}>$25</button>
              <button type="button" onClick={() => setPredictionAmount('50')}>$50</button>
              <button type="button" onClick={() => setPredictionAmount('100')}>$100</button>
            </div>
          </div>
          
          {selectedOption && predictionAmount && !isNaN(parseFloat(predictionAmount)) && parseFloat(predictionAmount) > 0 && (
            <div className={styles.payoutSection}>
              <div className={styles.payoutInfo}>
                <span>Potential Payout:</span>
                <span className={styles.payoutAmount}>
                  ${(parseFloat(predictionAmount) * (selectedOption === 'yes' ? yesOdds : noOdds)).toFixed(2)}
                </span>
              </div>
            </div>
          )}
          
          {error && <div className={styles.errorMessage}>{error}</div>}
          {success && <div className={styles.successMessage}>{success}</div>}
          
          <div className={styles.formActions}>
            <button 
              type="button" 
              className={styles.cancelButton}
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={!selectedOption || !predictionAmount || isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Place Prediction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DirectPredictionModal; 