import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthChange } from './services/auth';
import PrivateRoute from './components/common/PrivateRoute';
import Login from './pages/Login';
import DiaryMain from './pages/DiaryMain';
import TodosPage from './pages/TodosPage';
import YearGoalsPage from './pages/YearGoalsPage';
import FinanceMain from './pages/FinanceMain';
import Settings from './pages/Settings';

// 개발 중 로그인 우회 — 배포 전 false로 변경
const DEV_SKIP_AUTH = true;

function App() {
  const [user, setUser] = useState(undefined); // undefined = 로딩 중

  useEffect(() => {
    if (DEV_SKIP_AUTH) {
      setUser({ uid: 'dev', displayName: 'Dev User' });
      return;
    }
    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  // Firebase 인증 상태 확인 중
  if (user === undefined) return null;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/"
          element={<PrivateRoute user={user}><DiaryMain /></PrivateRoute>}
        />
        <Route
          path="/todos"
          element={<PrivateRoute user={user}><TodosPage /></PrivateRoute>}
        />
        <Route
          path="/goals"
          element={<PrivateRoute user={user}><YearGoalsPage /></PrivateRoute>}
        />
        <Route
          path="/finance"
          element={<PrivateRoute user={user}><FinanceMain /></PrivateRoute>}
        />
        <Route
          path="/settings"
          element={<PrivateRoute user={user}><Settings /></PrivateRoute>}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
