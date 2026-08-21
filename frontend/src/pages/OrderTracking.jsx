import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bike, MapPin, Clock, ShieldCheck, Phone, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const OrderTracking = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);

  // Simulation loop mimicking real-time server events via WebSockets
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setStep((currentStep) => {
            if (currentStep < 4) {
              return currentStep + 1;
            }
            clearInterval(timer);
            return currentStep;
          });
          return 0;
        }
        return prev + 5;
      });
    }, 400);

    return () => clearInterval(timer);
  }, []);

  const restaurantName = state?.restaurantName || "Selected Kitchen";
  const orderTotal = state?.total || 299;

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
        
        {/* Left column: Status Indicators */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ backgroundColor: '#fff', padding: '24px', border: '1px solid #e9e9eb', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <span style={{ color: '#fc8019', fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px' }}>LIVE ORDER TRACKING</span>
            <h1 style={{ margin: '8px 0 2px 0', fontSize: '28px', color: '#282c3f' }}>
              {step === 1 && "Accepting your order..."}
              {step === 2 && "Kitchen is preparing your food..."}
              {step === 3 && "Delivery executive is on the way..."}
              {step === 4 && "Order delivered successfully!"}
            </h1>
            <p style={{ color: '#7e808c', fontSize: '14px', margin: '0 0 20px 0' }}>Arriving from {restaurantName}</p>

            {/* Stepper progress track */}
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', margin: '30px 0' }}>
              <div style={{ position: 'absolute', top: '15px', left: '0', right: '0', height: '4px', backgroundColor: '#e9e9eb', zIndex: 1 }}>
                <div style={{ width: `${((step - 1) * 33.3) + (progress * 0.333)}%`, height: '100%', backgroundColor: '#fc8019', transition: 'width 0.4s' }} />
              </div>
              <StepMilestone number={1} current={step} label="Confirmed" />
              <StepMilestone number={2} current={step} label="Preparing" />
              <StepMilestone number={3} current={step} label="Dispatched" />
              <StepMilestone number={4} current={step} label="Arrived" />
            </div>
          </div>

          {/* Delivery Partner Profile Card */}
          {step >= 3 && (
            <div style={{ backgroundColor: '#fff', padding: '20px', border: '1px solid #e9e9eb', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ backgroundColor: '#f1f1f6', padding: '12px', borderRadius: '50%' }}><Bike color='#fc8019' size={28} /></div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '16px', color: '#282c3f' }}>Rohan Kumar</h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#7e808c' }}>Your delivery executive • Verified Professional</p>
                </div>
              </div>
              <button onClick={() => showToast('Calling Rohan...', 'info')} style={{ padding: '10px 16px', backgroundColor: '#fff', border: '1px solid #fc8019', color: '#fc8019', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={16} /> Contact</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StepMilestone = ({ number, current, label }) => {
  const isDone = current > number;
  const isCurrent = current === number;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, position: 'relative' }}>
      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: isDone || isCurrent ? '#fc8019' : '#fff', border: '2px solid', borderColor: isDone || isCurrent ? '#fc8019' : '#cbd5e1', color: isDone || isCurrent ? '#fff' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' }}>
        {isDone ? <CheckCircle2 size={16} /> : number}
      </div>
      <span style={{ fontSize: '12px', marginTop: '8px', fontWeight: isCurrent ? 'bold' : '500', color: isCurrent ? '#282c3f' : '#7e808c' }}>{label}</span>
    </div>
  );
};

export default OrderTracking;
