import React from 'react';
import { X, CheckCircle, XCircle, Clock, Award, User } from 'lucide-react';

const AttemptModal = ({ attempt, isOpen, onClose }) => {
  if (!isOpen || !attempt) return null;

  const minutes = Math.floor((attempt.timeSpentSeconds || 0) / 60);
  const seconds = (attempt.timeSpentSeconds || 0) % 60;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '780px' }}>
        <div className="terminal-titlebar">
          <div className="terminal-dots">
            <span className="dot dot-red" onClick={onClose} style={{ cursor: 'pointer' }} />
            <span className="dot dot-yellow" />
            <span className="dot dot-green" />
          </div>
          <div className="terminal-title">
            <span>cat</span>
            <span className="active-term">attempt_{attempt.studentId}.log</span>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          {/* Header Summary */}
          <div
            style={{
              background: '#070a10',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              padding: '16px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '12px',
              marginBottom: '20px'
            }}
          >
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Candidate</div>
              <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '15px' }}>{attempt.studentName}</div>
              <div style={{ color: 'var(--neon-cyan)', fontSize: '12px' }}>{attempt.studentId}</div>
            </div>

            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Score / Grade</div>
              <div style={{ color: 'var(--neon-green)', fontWeight: 700, fontSize: '18px' }}>
                {attempt.score} / {attempt.totalQuestions}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{attempt.percentage}% Accuracy</div>
            </div>

            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Time Taken</div>
              <div style={{ color: 'var(--neon-amber)', fontWeight: 700, fontSize: '15px' }}>
                {minutes}m {seconds}s
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                {new Date(attempt.submittedAt).toLocaleDateString()} {new Date(attempt.submittedAt).toLocaleTimeString()}
              </div>
            </div>
          </div>

          {/* Category Breakdown Chips */}
          {attempt.categoryScores && (
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
                Category Breakdown
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {Object.entries(attempt.categoryScores).map(([cat, stat]) => (
                  <div
                    key={cat}
                    style={{
                      background: '#090d16',
                      border: '1px solid var(--border-color)',
                      borderRadius: '4px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      display: 'flex',
                      gap: '6px',
                      alignItems: 'center'
                    }}
                  >
                    <span style={{ color: 'var(--neon-cyan)', fontWeight: 600 }}>{cat}:</span>
                    <span style={{ color: stat.correct === stat.total ? 'var(--neon-green)' : '#ffffff' }}>
                      {stat.correct} / {stat.total}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Answers Audit List */}
          <h4 style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase' }}>
            Answer Responses Audit ({attempt.answers ? attempt.answers.length : 0} items)
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '350px', overflowY: 'auto' }}>
            {attempt.answers && attempt.answers.map((ans, idx) => (
              <div
                key={idx}
                style={{
                  background: '#0a0d14',
                  border: `1px solid ${ans.isCorrect ? 'rgba(0, 255, 102, 0.25)' : 'rgba(255, 51, 102, 0.25)'}`,
                  borderRadius: '4px',
                  padding: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--neon-cyan)' }}>
                    Q{ans.paperOrder || idx + 1} [{ans.category}]
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                    {ans.isCorrect ? (
                      <span style={{ color: 'var(--neon-green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle size={14} /> Correct
                      </span>
                    ) : (
                      <span style={{ color: 'var(--neon-red)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <XCircle size={14} /> Incorrect
                      </span>
                    )}
                  </div>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--text-main)', marginBottom: '8px' }}>
                  {ans.questionText}
                </p>

                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Candidate Chosen Option Index: <span style={{ color: '#ffffff', fontWeight: 600 }}>{ans.selectedOption === -1 ? 'SKIPPED' : `Option ${ans.selectedOption + 1}`}</span> | Correct Index: <span style={{ color: 'var(--neon-green)', fontWeight: 600 }}>Option {ans.correctIndex + 1}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-term btn-secondary" onClick={onClose}>
              Close Inspector
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttemptModal;
