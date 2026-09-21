import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from './api/client';

const QuizContext = createContext();

const TOTAL_QUIZ_DURATION_SECONDS = 20 * 60; // 20 minutes

// Fisher-Yates array shuffle to swap/randomize question order for each candidate
const shuffleArray = (array) => {
  if (array.length === 0) return [];
  const arr = [...array];
  
  // Keep the 25th question fixed if there are exactly 25 questions
  const hasFixedLastQuestion = arr.length === 25;
  const lastQuestion = hasFixedLastQuestion ? arr.pop() : null;

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  
  if (hasFixedLastQuestion) {
    arr.push(lastQuestion);
  }
  
  return arr;
};

export const QuizProvider = ({ children }) => {
  // Student registration & state
  const [candidate, setCandidate] = useState(() => {
    const saved = localStorage.getItem('quiz_candidate');
    return saved ? JSON.parse(saved) : { name: '', studentId: '', acceptedTerms: false };
  });

  const [rawQuestions, setRawQuestions] = useState([]);
  const [questions, setQuestions] = useState(() => {
    const saved = localStorage.getItem('quiz_questions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(() => {
    const saved = localStorage.getItem('quiz_answers');
    return saved ? JSON.parse(saved) : {};
  });
  const [flagged, setFlagged] = useState(() => {
    const saved = localStorage.getItem('quiz_flagged');
    return saved ? JSON.parse(saved) : {};
  });

  const [quizStarted, setQuizStarted] = useState(() => {
    return localStorage.getItem('quiz_started') === 'true';
  });
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState(() => {
    const saved = localStorage.getItem('quiz_result');
    return saved ? JSON.parse(saved) : null;
  });

  const [timeRemaining, setTimeRemaining] = useState(() => {
    const saved = localStorage.getItem('quiz_time_remaining');
    return saved ? parseInt(saved, 10) : TOTAL_QUIZ_DURATION_SECONDS;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Admin authentication state
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('adminToken') || null);
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('adminUser');
    return saved ? JSON.parse(saved) : null;
  });

  // Save student data to local storage on changes to survive accidental refreshes
  useEffect(() => {
    localStorage.setItem('quiz_candidate', JSON.stringify(candidate));
  }, [candidate]);

  useEffect(() => {
    localStorage.setItem('quiz_answers', JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    localStorage.setItem('quiz_flagged', JSON.stringify(flagged));
  }, [flagged]);

  useEffect(() => {
    localStorage.setItem('quiz_started', quizStarted ? 'true' : 'false');
  }, [quizStarted]);

  useEffect(() => {
    if (quizResult) {
      localStorage.setItem('quiz_result', JSON.stringify(quizResult));
    }
  }, [quizResult]);

  useEffect(() => {
    if (quizStarted && !quizSubmitted) {
      localStorage.setItem('quiz_time_remaining', timeRemaining.toString());
    }
  }, [timeRemaining, quizStarted, quizSubmitted]);

  // Fetch Questions from API
  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/quiz/questions');
      if (res.data.success) {
        setRawQuestions(res.data.questions);
        // If candidate already has an active quiz session, preserve their shuffled order
        const saved = localStorage.getItem('quiz_questions');
        if (saved) {
          try {
            setQuestions(JSON.parse(saved));
          } catch (e) {
            setQuestions(res.data.questions);
          }
        } else {
          setQuestions(res.data.questions);
        }
      }
    } catch (err) {
      console.error('Error loading quiz questions:', err);
      setError('Could not load quiz questions from server. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Answer selection
  const selectAnswer = (questionId, optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  // Toggle flag for review
  const toggleFlag = (questionId) => {
    setFlagged((prev) => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  // Navigation
  const goToQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentIndex(index);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Submit Quiz Attempt
  const submitQuiz = useCallback(async () => {
    if (quizSubmitted) return;
    setLoading(true);
    setError(null);

    const timeSpentSeconds = TOTAL_QUIZ_DURATION_SECONDS - timeRemaining;

    // Build answers payload: [{ questionId, selectedOption }]
    const answersPayload = questions.map((q) => ({
      questionId: q._id,
      selectedOption: answers[q._id] !== undefined ? answers[q._id] : -1
    }));

    try {
      const res = await api.post('/quiz/submit', {
        studentName: candidate.name,
        studentId: candidate.studentId,
        answers: answersPayload,
        timeSpentSeconds
      });

      if (res.data.success) {
        setQuizResult(res.data);
        setQuizSubmitted(true);
        // Clear active quiz state
        localStorage.removeItem('quiz_answers');
        localStorage.removeItem('quiz_flagged');
        localStorage.removeItem('quiz_time_remaining');
        localStorage.removeItem('quiz_started');
      }
    } catch (err) {
      console.error('Submission failed:', err);
      setError('Failed to submit quiz attempt to backend.');
    } finally {
      setLoading(false);
    }
  }, [quizSubmitted, timeRemaining, questions, answers, candidate]);

  // Countdown timer logic
  useEffect(() => {
    let interval = null;
    if (quizStarted && !quizSubmitted && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            submitQuiz(); // Auto submit when time expires
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [quizStarted, quizSubmitted, timeRemaining, submitQuiz]);

  // Start candidate quiz with a unique swapped/shuffled question order
  const startCandidateQuiz = (candidateData) => {
    setCandidate(candidateData);
    const source = rawQuestions.length > 0 ? rawQuestions : questions;
    const shuffled = shuffleArray(source);
    setQuestions(shuffled);
    localStorage.setItem('quiz_questions', JSON.stringify(shuffled));
    localStorage.setItem('quiz_started', 'true');
    setQuizStarted(true);
    setCurrentIndex(0);
    setAnswers({});
    setFlagged({});
    setTimeRemaining(TOTAL_QUIZ_DURATION_SECONDS);
  };

  // Reset quiz (for testing or taking a new attempt)
  const resetQuiz = () => {
    localStorage.removeItem('quiz_answers');
    localStorage.removeItem('quiz_flagged');
    localStorage.removeItem('quiz_time_remaining');
    localStorage.removeItem('quiz_started');
    localStorage.removeItem('quiz_result');
    localStorage.removeItem('quiz_candidate');
    localStorage.removeItem('quiz_questions');

    setCandidate({ name: '', studentId: '', acceptedTerms: false });
    setAnswers({});
    setFlagged({});
    setCurrentIndex(0);
    setQuizStarted(false);
    setQuizSubmitted(false);
    setQuizResult(null);
    setTimeRemaining(TOTAL_QUIZ_DURATION_SECONDS);
    if (rawQuestions.length > 0) {
      setQuestions(rawQuestions);
    }
  };

  // Admin Login
  const loginAdmin = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/admin/login', { username, password });
      if (res.data.success) {
        const token = res.data.token;
        const user = res.data.admin;
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminUser', JSON.stringify(user));
        setAdminToken(token);
        setAdminUser(user);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Authentication failed';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // Admin Logout
  const logoutAdmin = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setAdminToken(null);
    setAdminUser(null);
  };

  return (
    <QuizContext.Provider
      value={{
        candidate,
        setCandidate,
        questions,
        currentIndex,
        currentQuestion: questions[currentIndex] || null,
        answers,
        flagged,
        quizStarted,
        setQuizStarted,
        startCandidateQuiz,
        quizSubmitted,
        quizResult,
        timeRemaining,
        loading,
        error,
        adminToken,
        adminUser,
        fetchQuestions,
        selectAnswer,
        toggleFlag,
        goToQuestion,
        nextQuestion,
        prevQuestion,
        submitQuiz,
        resetQuiz,
        loginAdmin,
        logoutAdmin
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
