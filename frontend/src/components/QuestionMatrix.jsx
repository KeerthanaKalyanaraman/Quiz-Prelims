import React from 'react';
import { useQuiz } from '../QuizContext';

const QuestionMatrix = () => {
  const {
    questions,
    currentIndex,
    goToQuestion,
    answers,
    flagged
  } = useQuiz();

  const answeredCount = questions.filter(
    (q) => answers[q._id] !== undefined && answers[q._id] !== -1
  ).length;

  const flaggedCount = questions.filter(
    (q) => flagged[q._id]
  ).length;

  const unansweredCount = questions.length - answeredCount;

  return (
    <div style={{ background: '#090d16', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <h3 style={{ fontSize: '13px', color: 'var(--neon-cyan)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Question Matrix ({questions.length || 25})
        </h3>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          JUMP TO QUESTION
        </span>
      </div>

      {/* 1-26 Grid */}
      <div className="matrix-grid">
        {questions.map((q, idx) => {
          const isCurrent = idx === currentIndex;
          const isAnswered = answers[q._id] !== undefined && answers[q._id] !== -1;
          const isFlagged = Boolean(flagged[q._id]);

          let statusClass = '';
          if (isCurrent) statusClass += ' active';
          if (isAnswered) statusClass += ' answered';
          if (isFlagged) statusClass += ' flagged';

          return (
            <button
              key={q._id || idx}
              type="button"
              className={`matrix-btn ${statusClass}`}
              onClick={() => goToQuestion(idx)}
              title={`Question ${idx + 1} (${q.category})`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Legend & Stats */}
      <div
        style={{
          marginTop: '16px',
          paddingTop: '12px',
          borderTop: '1px solid #141c2c',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          fontSize: '11px',
          textAlign: 'center'
        }}
      >
        <div style={{ background: 'rgba(0, 255, 102, 0.08)', padding: '6px', borderRadius: '4px', border: '1px solid rgba(0, 255, 102, 0.2)' }}>
          <div style={{ color: 'var(--neon-green)', fontWeight: 700 }}>{answeredCount}</div>
          <div style={{ color: 'var(--text-muted)' }}>Answered</div>
        </div>

        <div style={{ background: 'rgba(255, 176, 0, 0.08)', padding: '6px', borderRadius: '4px', border: '1px solid rgba(255, 176, 0, 0.2)' }}>
          <div style={{ color: 'var(--neon-amber)', fontWeight: 700 }}>{flaggedCount}</div>
          <div style={{ color: 'var(--text-muted)' }}>Flagged</div>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '6px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
          <div style={{ color: '#ffffff', fontWeight: 700 }}>{unansweredCount}</div>
          <div style={{ color: 'var(--text-muted)' }}>Remaining</div>
        </div>
      </div>
    </div>
  );
};

export default QuestionMatrix;
