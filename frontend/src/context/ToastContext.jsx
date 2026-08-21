import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

const ICONS = {
  success: <CheckCircle2 size={18} className="text-green-600" />,
  error: <XCircle size={18} className="text-red-600" />,
  info: <Info size={18} className="text-blue-600" />,
};

let nextId = 1;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => dismiss(id), duration);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-5 right-5 z-[2000] flex flex-col gap-2 w-80 max-w-[calc(100vw-2.5rem)]">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="flex items-start gap-3 bg-white border border-gray-200 shadow-lg rounded-xl px-4 py-3 text-sm text-gray-800 animate-[fadeIn_0.2s_ease]"
          >
            {ICONS[t.type]}
            <span className="flex-1">{t.message}</span>
            <button onClick={() => dismiss(t.id)} className="text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
