import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { useQuiz } from '../QuizContext';

const Timer = () => {
  const { timeRemaining } = useQuiz();

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const isCritical = timeRemaining <= 180; // under 3 mins
  const isWarning = timeRemaining <= 600 && !isCritical; // under 10 mins

  let statusColor = 'var(--neon-green)';
  let glowColor = 'var(--glow-sm)';
  if (isCritical) {
    statusColor = 'var(--neon-red)';
    glowColor = '0 0 10px rgba(255, 51, 102, 0.4)';
  } else if (isWarning) {
    statusColor = 'var(--neon-amber)';
    glowColor = 'var(--glow-amber-sm)';
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 14px',
        borderRadius: '4px',
        background: '#070a10',
        border: `1px solid ${statusColor}`,
        boxShadow: glowColor,
        color: statusColor,
        fontFamily: 'var(--font-mono)',
        fontSize: '14px',
        fontWeight: '700',
        letterSpacing: '1px'
      }}
    >
      {isCritical ? (
        <AlertTriangle size={15} style={{ animation: 'blink 1s infinite' }} />
      ) : (
        <Clock size={15} />
      )}
      <span>TIMER: {formattedTime}</span>
    </div>
  );
};

export default Timer;
