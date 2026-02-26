import { useState } from 'react';
import Calendar from '../components/Calendar';
import { getDday, formatDday } from '../../../common/utils/dateUtils';

// 임시 목데이터 (Firebase 연동 전)
const MOCK_CALENDAR_DATA = {
  '2026-02-03': { vacation: 'full',    hasDiary: true,  hasTodoDue: false },
  '2026-02-10': { vacation: 'half',    hasDiary: false, hasTodoDue: true  },
  '2026-02-15': { vacation: 'quarter', hasDiary: true,  hasTodoDue: true  },
  '2026-02-20': {                      hasDiary: true,  hasTodoDue: false },
  '2026-02-26': {                      hasDiary: false, hasTodoDue: true  },
};

const MOCK_TODOS = [
  { id: '1', title: '보고서 작성',    deadline: '2026-02-28', category: 'work',     urgent: true,  completed: false },
  { id: '2', title: '주간 미팅 준비', deadline: '2026-03-03', category: 'work',     urgent: false, completed: false },
  { id: '3', title: '운동하기',       deadline: '2026-02-27', category: 'personal', urgent: false, completed: false },
  { id: '4', title: '병원 예약',      deadline: '2026-03-01', category: 'personal', urgent: true,  completed: false },
];

const TOTAL_VACATION = 15;
const USED_VACATION = 3.5;

function TodoItem({ todo }) {
  const dday = getDday(todo.deadline);
  const ddayColor =
    dday < 0  ? 'text-red-600' :
    dday === 0 ? 'text-red-500' :
    dday <= 3  ? 'text-orange-500' : 'text-gray-400';

  return (
    <li className={`flex items-center gap-2 text-sm px-2 py-1.5 rounded-lg ${todo.urgent ? 'border border-red-200 bg-red-50' : ''}`}>
      <span className={`text-xs font-bold w-11 shrink-0 ${ddayColor}`}>{formatDday(dday)}</span>
      <span className="text-gray-700 truncate">{todo.title}</span>
      {todo.urgent && <span className="text-xs text-red-400 shrink-0">긴급</span>}
    </li>
  );
}

function DiaryMain() {
  const today = new Date();
  const [year, setYear]   = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const handlePrevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  };
  const handleNextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  };

  const workTodos    = MOCK_TODOS.filter(t => t.category === 'work'     && !t.completed).sort((a, b) => getDday(a.deadline) - getDday(b.deadline));
  const personalTodos = MOCK_TODOS.filter(t => t.category === 'personal' && !t.completed).sort((a, b) => getDday(a.deadline) - getDday(b.deadline));

  return (
    <div className="flex flex-1 gap-4 p-4 overflow-hidden" style={{ height: 'calc(100vh - 48px)' }}>

      <div className="flex-1 min-w-0">
        <Calendar year={year} month={month} calendarData={MOCK_CALENDAR_DATA} onPrevMonth={handlePrevMonth} onNextMonth={handleNextMonth} />
      </div>

      <div className="w-72 flex flex-col gap-3 shrink-0">
        <div className="bg-white rounded-xl shadow-sm px-4 py-3">
          <div className="flex justify-around text-sm">
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-xs text-gray-400">총연차</span>
              <span className="font-bold text-gray-800">{TOTAL_VACATION}</span>
            </div>
            <div className="w-px bg-gray-100" />
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-xs text-gray-400">사용</span>
              <span className="font-bold text-orange-500">{USED_VACATION}</span>
            </div>
            <div className="w-px bg-gray-100" />
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-xs text-gray-400">남음</span>
              <span className="font-bold text-green-600">{TOTAL_VACATION - USED_VACATION}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 flex-1 flex flex-col overflow-hidden">
          <h3 className="text-sm font-bold text-gray-700 mb-2">💼 회사 할일</h3>
          {workTodos.length === 0
            ? <p className="text-xs text-gray-400">미완료 할일 없음</p>
            : <ul className="flex flex-col gap-1 overflow-y-auto">{workTodos.map(t => <TodoItem key={t.id} todo={t} />)}</ul>
          }
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 flex-1 flex flex-col overflow-hidden">
          <h3 className="text-sm font-bold text-gray-700 mb-2">🙋 개인 할일</h3>
          {personalTodos.length === 0
            ? <p className="text-xs text-gray-400">미완료 할일 없음</p>
            : <ul className="flex flex-col gap-1 overflow-y-auto">{personalTodos.map(t => <TodoItem key={t.id} todo={t} />)}</ul>
          }
        </div>
      </div>
    </div>
  );
}

export default DiaryMain;
