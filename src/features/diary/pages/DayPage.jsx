import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const WEEKDAY = ['일', '월', '화', '수', '목', '금', '토'];
const VACATION_OPTIONS = [
  { key: 'full',    label: '연차' },
  { key: 'half',    label: '반차' },
  { key: 'quarter', label: '반반차' },
];

// 임시 목데이터 (Firebase 연동 전)
const MOCK_DAY_DATA = {
  '2026-02-26': {
    vacation: null,
    isHoliday: false,
    diary: '',
  },
  '2026-02-03': {
    vacation: 'full',
    isHoliday: false,
    diary: '오늘은 연차를 써서 푹 쉬었다. 오랜만에 집에서 책도 읽고 산책도 다녀왔다.',
  },
};

// 전체 할일 목데이터 (DiaryMain과 공유 — Firebase 연동 후 제거)
const MOCK_TODOS = [
  { id: '1',  title: '보고서 작성',          deadline: '2026-02-28', category: 'work',     urgent: true,  completed: false },
  { id: '2',  title: '주간 미팅 준비',        deadline: '2026-03-03', category: 'work',     urgent: false, completed: false },
  { id: '3',  title: '프로젝트 기획서 제출',  deadline: '2026-03-05', category: 'work',     urgent: true,  completed: false },
  { id: '4',  title: '팀 회식 장소 예약',     deadline: '2026-03-07', category: 'work',     urgent: false, completed: false },
  { id: '5',  title: '월간 성과 정리',        deadline: '2026-03-10', category: 'work',     urgent: false, completed: false },
  { id: '6',  title: '신규 직원 온보딩',      deadline: '2026-03-12', category: 'work',     urgent: false, completed: false },
  { id: '7',  title: '클라이언트 미팅',       deadline: '2026-03-14', category: 'work',     urgent: true,  completed: false },
  { id: '8',  title: '분기 예산 검토',        deadline: '2026-03-17', category: 'work',     urgent: false, completed: false },
  { id: '9',  title: '사내 교육 신청',        deadline: '2026-03-20', category: 'work',     urgent: false, completed: false },
  { id: '10', title: '연간 계획서 수정',      deadline: '2026-03-25', category: 'work',     urgent: false, completed: false },
  { id: '11', title: '운동하기',              deadline: '2026-02-27', category: 'personal', urgent: false, completed: false },
  { id: '12', title: '병원 예약',             deadline: '2026-03-01', category: 'personal', urgent: true,  completed: false },
  { id: '13', title: '독서 30분',             deadline: '2026-03-04', category: 'personal', urgent: false, completed: false },
  { id: '14', title: '부모님 전화',           deadline: '2026-03-06', category: 'personal', urgent: false, completed: false },
  { id: '15', title: '자동차 보험 갱신',      deadline: '2026-03-08', category: 'personal', urgent: true,  completed: false },
  { id: '16', title: '집 청소',               deadline: '2026-03-11', category: 'personal', urgent: false, completed: false },
  { id: '17', title: '여행 숙소 예약',        deadline: '2026-03-13', category: 'personal', urgent: false, completed: false },
  { id: '18', title: '영어 공부',             deadline: '2026-03-16', category: 'personal', urgent: false, completed: false },
  { id: '19', title: '친구 생일 선물',        deadline: '2026-03-19', category: 'personal', urgent: false, completed: false },
  { id: '20', title: '재테크 공부',           deadline: '2026-03-22', category: 'personal', urgent: false, completed: false },
  { id: '21', title: '보고서 최종 검토',      deadline: '2026-02-26', category: 'work',     urgent: true,  completed: false },
  { id: '22', title: '헬스장 등록',           deadline: '2026-02-26', category: 'personal', urgent: false, completed: false },
];

function DayPage() {
  const { date } = useParams();
  const navigate = useNavigate();

  const dateObj = new Date(date + 'T00:00:00');
  const year  = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day   = dateObj.getDate();
  const dow   = WEEKDAY[dateObj.getDay()];
  const isSunday   = dateObj.getDay() === 0;
  const isSaturday = dateObj.getDay() === 6;

  const init = MOCK_DAY_DATA[date] || {};
  const [vacation,   setVacation]  = useState(init.vacation  ?? null);
  const [isHoliday,  setIsHoliday] = useState(init.isHoliday ?? false);
  const [diary,      setDiary]     = useState(init.diary     ?? '');
  const [diarySaved, setDiarySaved] = useState(false);

  // 이 날짜가 마감일인 전체 할일 필터링
  const [todos, setTodos] = useState(
    MOCK_TODOS.filter(t => t.deadline === date)
  );

  const dateTextColor =
    isHoliday  ? 'text-red-500'
    : isSunday   ? 'text-red-500'
    : isSaturday ? 'text-blue-500'
    : 'text-gray-800';

  const handleVacation = (type) => setVacation(v => v === type ? null : type);

  const handleSaveDiary = () => {
    setDiarySaved(true);
    setTimeout(() => setDiarySaved(false), 2000);
  };

  const handleToggleTodo = (id) =>
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));

  return (
    <div className="flex flex-1 gap-4 p-4 overflow-hidden min-h-0">

      {/* 왼쪽: 일기 */}
      <div className="flex-1 min-w-0 flex flex-col min-h-0 bg-white rounded-xl shadow-sm p-5">
        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors shrink-0"
          >
            ◀
          </button>
          <h1 className={`text-lg font-bold ${dateTextColor}`}>
            {year}년 {month}월 {day}일 ({dow})
          </h1>
          {isHoliday && (
            <span className="text-xs bg-red-50 text-red-400 px-2 py-0.5 rounded-full">공휴일</span>
          )}
          {vacation && (
            <span className="text-xs bg-orange-50 text-orange-400 px-2 py-0.5 rounded-full">
              {vacation === 'full' ? '연차' : vacation === 'half' ? '반차' : '반반차'}
            </span>
          )}
        </div>

        {/* 일기 textarea */}
        <div className="flex-1 flex flex-col min-h-0">
          <label className="text-xs font-medium text-gray-400 mb-2">오늘의 일기</label>
          <textarea
            className="flex-1 min-h-0 resize-none border border-gray-200 rounded-lg p-3 text-sm text-gray-700 leading-relaxed focus:outline-none focus:border-blue-300 focus:ring-1 focus:ring-blue-200 transition-colors"
            placeholder="오늘 하루를 기록해보세요..."
            value={diary}
            onChange={e => { setDiary(e.target.value); setDiarySaved(false); }}
          />
          <div className="flex justify-end items-center gap-3 mt-3">
            {diarySaved && <span className="text-xs text-green-500">저장되었습니다</span>}
            <button
              onClick={handleSaveDiary}
              className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
            >
              저장
            </button>
          </div>
        </div>
      </div>

      {/* 오른쪽 사이드바 */}
      <div className="w-72 flex flex-col gap-3 shrink-0 overflow-hidden min-h-0">

        {/* 휴가 / 공휴일 설정 */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-sm font-bold text-gray-700 mb-3">휴가 설정</h3>
          <div className="flex gap-2 mb-3">
            {VACATION_OPTIONS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleVacation(key)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                  vacation === key
                    ? 'bg-orange-100 text-orange-600 border-orange-300'
                    : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">공휴일</span>
            <button
              onClick={() => {
                if (!isHoliday) setVacation(null);
                setIsHoliday(h => !h);
              }}
              className={`relative w-10 h-5 rounded-full transition-colors ${isHoliday ? 'bg-red-400' : 'bg-gray-200'}`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  isHoliday ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* 오늘의 할일 (마감일 기준) */}
        <div className="bg-white rounded-xl shadow-sm p-4 flex-1 min-h-0 flex flex-col overflow-hidden">
          <h3 className="text-sm font-bold text-gray-700 mb-3">오늘 마감 할일</h3>

          <ul className="flex flex-col gap-1 flex-1 min-h-0 overflow-y-auto">
            {todos.length === 0
              ? <p className="text-xs text-gray-400">마감 할일 없음</p>
              : todos.map(todo => (
                  <li key={todo.id} className={`flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-gray-50 ${todo.urgent ? 'border border-red-100 bg-red-50' : ''}`}>
                    <button
                      onClick={() => handleToggleTodo(todo.id)}
                      className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors ${
                        todo.completed
                          ? 'bg-blue-500 border-blue-500 text-white'
                          : 'border-gray-300 hover:border-blue-300'
                      }`}
                    >
                      {todo.completed && <span className="text-white text-xs leading-none">✓</span>}
                    </button>
                    <span className={`text-xs px-1.5 py-0.5 rounded shrink-0 ${
                      todo.category === 'work'
                        ? 'bg-blue-50 text-blue-500'
                        : 'bg-green-50 text-green-600'
                    }`}>
                      {todo.category === 'work' ? '회사' : '개인'}
                    </span>
                    <span className={`flex-1 text-sm truncate ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                      {todo.title}
                    </span>
                    {todo.urgent && <span className="text-xs text-red-400 shrink-0">긴급</span>}
                  </li>
                ))
            }
          </ul>

          {/* 할일 추가는 전체 할일 페이지에서 */}
          <div className="pt-3 border-t border-gray-100 mt-3">
            <button
              onClick={() => navigate('/todos')}
              className="w-full py-1.5 text-xs text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors border border-dashed border-gray-200 hover:border-blue-200"
            >
              + 할일 추가는 전체 할일 페이지에서
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default DayPage;
