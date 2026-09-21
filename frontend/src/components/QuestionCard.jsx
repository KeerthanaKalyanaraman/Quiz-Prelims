import React from 'react';
import { Bookmark, RotateCcw } from 'lucide-react';
import { useQuiz } from '../QuizContext';

const optionLetters = ['A', 'B', 'C', 'D'];

const getCategoryClass = (cat) => {
  switch (cat) {
    case 'C': return 'badge-c';
    case 'C++': return 'badge-cpp';
    case 'Python': return 'badge-python';
    case 'Java': return 'badge-java';
    case 'OOP': return 'badge-oop';
    case 'SQL': return 'badge-sql';
    default: return 'badge-c';
  }
};

const QuestionCard = () => {
  const {
    questions,
    currentQuestion,
    currentIndex,
    answers,
    flagged,
    selectAnswer,
    toggleFlag
  } = useQuiz();

  if (!currentQuestion) {
    return (
      <div className="terminal-body" style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ color: 'var(--text-muted)' }}>[SYS-STATUS] Initializing question memory buffer...</p>
      </div>
    );
  }

  const selectedOption = answers[currentQuestion._id];
  const isFlagged = Boolean(flagged[currentQuestion._id]);

  // Format code blocks in question text if present
  const renderQuestionText = (text) => {
    // Check if text has code snippet
    if (text.includes('\n\n') || text.includes(';\n') || text.includes('{') || text.includes('import')) {
      const parts = text.split('\n\n');
      if (parts.length > 1) {
        return (
          <>
            <p style={{ fontSize: '15px', fontWeight: 500, color: '#ffffff', marginBottom: '12px' }}>
              {parts[0]}
            </p>
            <pre className="code-display">
              <code>{parts.slice(1).join('\n\n')}</code>
            </pre>
          </>
        );
      }
    }
    return (
      <p style={{ fontSize: '15px', fontWeight: 500, color: '#ffffff', marginBottom: '16px' }}>
        {text}
      </p>
    );
  };

  return (
    <div className="fade-in">
      {/* Header bar of question card */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '14px',
          marginBottom: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '13px', color: 'var(--neon-green)', fontWeight: 700 }}>
            QUESTION {currentIndex + 1} / {questions.length || 25}
          </span>
          <span className={`badge-cat ${getCategoryClass(currentQuestion.category)}`}>
            {currentQuestion.category}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            className={`btn-term ${isFlagged ? 'btn-amber' : 'btn-secondary'}`}
            onClick={() => toggleFlag(currentQuestion._id)}
            title="Flag question to review later"
          >
            <Bookmark size={14} />
            <span>{isFlagged ? 'FLAGGED FOR REVIEW' : 'FLAG QUESTION'}</span>
          </button>

          {selectedOption !== undefined && selectedOption !== -1 && (
            <button
              type="button"
              className="btn-term btn-secondary"
              onClick={() => selectAnswer(currentQuestion._id, -1)}
              title="Clear selection"
              style={{ fontSize: '11px', padding: '6px 10px' }}
            >
              <RotateCcw size={12} />
              <span>CLEAR</span>
            </button>
          )}
        </div>
      </div>

      {/* Question Text */}
      <div style={{ marginBottom: '20px' }}>
        {renderQuestionText(currentQuestion.text)}
      </div>

      {/* 4 Interactive Options */}
      <div className="options-container" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {currentQuestion.options.map((option, idx) => {
          const isSelected = selectedOption === idx;
          return (
            <div
              key={idx}
              className={`option-item ${isSelected ? 'selected' : ''}`}
              onClick={() => selectAnswer(currentQuestion._id, idx)}
            >
              <div className="option-key">
                {optionLetters[idx]}
              </div>
              <div className="option-text">
                {option}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCard;
