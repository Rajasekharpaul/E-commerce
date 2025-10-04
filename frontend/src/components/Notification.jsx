import { useEffect, useState } from 'react';
import './Notification.css';

let externalNotify;

export function useNotifier() {
  const [_, setTick] = useState(0);
  useEffect(() => {
    return () => { externalNotify = undefined; };
  }, []);
  return (type, message) => {
    if (externalNotify) externalNotify(type, message);
    setTick(t => t + 1);
  };
}

export default function Notification() {
  const [msg, setMsg] = useState(null);
  useEffect(() => {
    externalNotify = (type, text) => {
      setMsg({ type, text });
      setTimeout(() => setMsg(null), 2500);
    };
  }, []);
  if (!msg) return null;
  return (
    <div className={`toast ${msg.type}`}>{msg.text}</div>
  );
}


