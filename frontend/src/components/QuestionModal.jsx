import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import api from '../api/client';

const CATEGORIES = ['C', 'C++', 'Python', 'Java', 'OOP', 'SQL'];

const QuestionModal = ({ question, isOpen, onClose, onSaveSuccess }) => {
  const [formData, setFormData] = useState({
    text: '',
    options: ['', '', '', ''],
    correctIndex: 0,
    category: 'C',
    paperOrder: 1,
    explanation: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (question) {
      setFormData({
        text: question.text || '',
        options: question.options && question.options.length === 4 ? [...question.options] : ['', '', '', ''],
        correctIndex: question.correctIndex !== undefined ? question.correctIndex : 0,
        category: question.category || 'C',
        paperOrder: question.paperOrder || 1,
        explanation: question.explanation || ''
      });
    } else {
      setFormData({
        text: '',
        options: ['', '', '', ''],
        correctIndex: 0,
        category: 'C',
        paperOrder: 1,
        explanation: ''
      });
    }
    setErrorMsg('');
  }, [question, isOpen]);

  if (!isOpen) return null;

  const handleOptionChange = (index, value) => {
    const updated = [...formData.options];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, options: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.text.trim()) {
      setErrorMsg('Question text is required.');
      return;
    }

    for (let i = 0; i < 4; i++) {
      if (!formData.options[i].trim()) {
        setErrorMsg(`Option ${i + 1} cannot be empty.`);
        return;
      }
    }

    setLoading(true);
    try {
      if (question && question._id) {
        // Update existing question
        await api.put(`/admin/questions/${question._id}`, formData);
      } else {
        // Create new question
        await api.post('/admin/questions', formData);
      }
      onSaveSuccess();
      onClose();
    } catch (err) {
      console.error('Save failed:', err);
      setErrorMsg(err.response?.data?.message || 'Error saving question.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="terminal-titlebar">
          <div className="terminal-dots">
            <span className="dot dot-red" onClick={onClose} style={{ cursor: 'pointer' }} />
            <span className="dot dot-yellow" />
            <span className="dot dot-green" />
          </div>
          <div className="terminal-title">
            <span>nano</span>
            <span className="active-term">
              {question ? `edit_question_${question.paperOrder}.spec` : 'new_question.spec'}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
          {errorMsg && (
            <div
              style={{
                background: 'rgba(255, 51, 102, 0.1)',
                border: '1px solid var(--neon-red)',
                color: 'var(--neon-red)',
                padding: '10px',
                borderRadius: '4px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px'
              }}
            >
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="term-input-group">
              <label className="term-label">Category</label>
              <select
                className="term-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="term-input-group">
              <label className="term-label">Paper Order (1 - 25)</label>
              <input
                type="number"
                min="1"
                max="50"
                className="term-input"
                value={formData.paperOrder}
                onChange={(e) => setFormData({ ...formData, paperOrder: parseInt(e.target.value, 10) || 1 })}
                required
              />
            </div>
          </div>

          <div className="term-input-group">
            <label className="term-label">Question Text (Markdown/Code supported)</label>
            <textarea
              className="term-textarea"
              rows={4}
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              placeholder="Enter question text or code snippet..."
              required
            />
          </div>

          <div className="term-input-group">
            <label className="term-label">Options (Exactly 4 choices)</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['Option A', 'Option B', 'Option C', 'Option D'].map((label, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={formData.correctIndex === idx}
                    onChange={() => setFormData({ ...formData, correctIndex: idx })}
                    title="Mark as correct answer"
                    style={{ accentColor: 'var(--neon-green)', cursor: 'pointer', transform: 'scale(1.2)' }}
                  />
                  <input
                    type="text"
                    className="term-input"
                    value={formData.options[idx]}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    placeholder={`${label}...`}
                    required
                  />
                </div>
              ))}
            </div>
            <span style={{ fontSize: '11px', color: 'var(--neon-green)', marginTop: '4px', display: 'block' }}>
              ● Select the radio button corresponding to the correct answer choice.
            </span>
          </div>

          <div className="term-input-group">
            <label className="term-label">Detailed Solution Explanation</label>
            <textarea
              className="term-textarea"
              rows={3}
              value={formData.explanation}
              onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
              placeholder="Explain why this option is correct for the student review..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" className="btn-term btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-term btn-primary" disabled={loading}>
              <Save size={14} />
              <span>{loading ? 'Saving...' : 'Save Question'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionModal;
