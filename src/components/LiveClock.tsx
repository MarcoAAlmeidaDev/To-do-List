
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const LiveClock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'America/Sao_Paulo',
    });
  };

  return (
    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
      <Clock className="w-5 h-5" />
      <div className="flex flex-col">
        <span className="text-sm font-medium">
          {formatDate(currentTime)}
        </span>
        <span className="text-lg font-mono font-bold">
          {formatTime(currentTime)}
        </span>
      </div>
    </div>
  );
};

export default LiveClock;
