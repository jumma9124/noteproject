import { useState } from 'react';
import { signInWithGoogle } from '../services/auth';

function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError('로그인에 실패했습니다. 다시 시도해주세요.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-md p-12 w-full max-w-sm flex flex-col items-center gap-8">

        {/* 로고 & 타이틀 */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-5xl">📋</span>
          <h1 className="text-2xl font-bold text-gray-800">My Dashboard</h1>
        </div>

        {/* 로그인 버튼 */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="flex items-center gap-3 w-full justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 active:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {/* Google SVG 아이콘 */}
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.86l6.08-6.08C34.5 3.1 29.56 1 24 1 14.82 1 7.07 6.48 3.72 14.22l7.07 5.49C12.53 13.45 17.83 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.52 24.5c0-1.56-.14-3.06-.4-4.5H24v8.52h12.67c-.55 2.94-2.2 5.43-4.68 7.1l7.18 5.57C43.32 37.06 46.52 31.26 46.52 24.5z"/>
            <path fill="#FBBC05" d="M10.79 28.71A14.53 14.53 0 0 1 9.5 24c0-1.64.28-3.23.79-4.71L3.22 13.8A23.93 23.93 0 0 0 1 24c0 3.77.9 7.34 2.5 10.48l7.29-5.77z"/>
            <path fill="#34A853" d="M24 47c5.42 0 9.97-1.8 13.3-4.88l-7.18-5.57C28.3 38.07 26.26 38.5 24 38.5c-6.17 0-11.47-3.95-13.21-9.79l-7.07 5.49C7.07 41.52 14.82 47 24 47z"/>
          </svg>
          {loading ? '로그인 중...' : 'Google로 로그인'}
        </button>

        {/* 에러 메시지 */}
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
}

export default Login;
