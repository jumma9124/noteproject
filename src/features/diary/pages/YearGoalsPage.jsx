import { useState } from 'react';

const MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

const MOCK_GOALS = {
  2026: {
    yearGoals: [
      { id: 'y1', text: '책 20권 읽기',    achieved: false },
      { id: 'y2', text: '운동 습관 만들기', achieved: false },
    ],
    monthGoals: {
      0: [{ id: 'm1', text: '2권 읽기',     achieved: true  }],
      1: [{ id: 'm2', text: '3권 읽기',     achieved: false }, { id: 'm3', text: '헬스장 등록', achieved: false }],
      2: [{ id: 'm4', text: '1권 읽기',     achieved: false }],
    },
  },
};

function YearGoalsPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());

  const init = MOCK_GOALS[year] || { yearGoals: [], monthGoals: {} };
  const [yearGoals,  setYearGoals]  = useState(init.yearGoals);
  const [monthGoals, setMonthGoals] = useState(init.monthGoals);

  const [formText,  setFormText]  = useState('');
  const [formMonth, setFormMonth] = useState(today.getMonth());

  const handleYearChange = (delta) => {
    const next = year + delta;
    const nextData = MOCK_GOALS[next] || { yearGoals: [], monthGoals: {} };
    setYear(next);
    setYearGoals(nextData.yearGoals);
    setMonthGoals(nextData.monthGoals);
  };

  const handleAdd = () => {
    if (!formText.trim()) return;
    const newGoal = { id: Date.now().toString(), text: formText.trim(), achieved: false };
    if (formMonth === -1) {
      setYearGoals(prev => [...prev, newGoal]);
    } else {
      setMonthGoals(prev => ({
        ...prev,
        [formMonth]: [...(prev[formMonth] || []), newGoal],
      }));
    }
    setFormText('');
  };

  const handleYearToggle = (id) =>
    setYearGoals(prev => prev.map(g => g.id === id ? { ...g, achieved: !g.achieved } : g));
  const handleYearDelete = (id) =>
    setYearGoals(prev => prev.filter(g => g.id !== id));

  const handleMonthToggle = (idx, id) =>
    setMonthGoals(prev => ({
      ...prev,
      [idx]: (prev[idx] || []).map(g => g.id === id ? { ...g, achieved: !g.achieved } : g),
    }));
  const handleMonthDelete = (idx, id) =>
    setMonthGoals(prev => ({
      ...prev,
      [idx]: (prev[idx] || []).filter(g => g.id !== id),
    }));

  const renderGoalItems = (goals, onToggle, onDelete) =>
    goals.length === 0
      ? <p className="text-xs text-gray-300">목표 없음</p>
      : goals.map(goal => (
          <div key={goal.id} className="flex items-center gap-1.5 group py-0.5 break-inside-avoid">
            <button
              onClick={() => onToggle(goal.id)}
              className={`w-3.5 h-3.5 rounded border shrink-0 flex items-center justify-center transition-colors ${
                goal.achieved ? 'bg-blue-500 border-blue-500' : 'border-gray-300 hover:border-blue-300'
              }`}
            >
              {goal.achieved && <span className="text-white leading-none" style={{ fontSize: '8px' }}>✓</span>}
            </button>
            <span className={`flex-1 text-xs ${goal.achieved ? 'line-through text-gray-400' : 'text-gray-700'}`}>
              {goal.text}
            </span>
            <button
              onClick={() => onDelete(goal.id)}
              className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all shrink-0"
              style={{ fontSize: '10px' }}
            >
              ✕
            </button>
          </div>
        ));

  return (
    <div className="flex flex-1 gap-4 p-4 overflow-hidden min-h-0">

      {/* 메인: 연간 목표 + 12달 그리드 */}
      <div className="flex-1 min-w-0 flex flex-col gap-3 min-h-0">

        {/* 연간 목표 — 높이 고정, 컬럼으로 옆으로 확장 */}
        <div className="bg-white rounded-xl shadow-sm px-4 py-3 shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-1">
              <button onClick={() => handleYearChange(-1)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500 transition-colors text-xs">◀</button>
              <span className="text-sm font-bold text-gray-800 w-14 text-center">{year}년</span>
              <button onClick={() => handleYearChange(1)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500 transition-colors text-xs">▶</button>
            </div>
            <span className="text-xs font-medium text-gray-400">연간 목표</span>
          </div>
          {/* 고정 높이 + columns로 항목 넘치면 옆 컬럼으로 */}
          <div style={{ height: '110px', columns: '180px', columnGap: '32px', overflow: 'hidden' }}>
            {renderGoalItems(yearGoals, handleYearToggle, handleYearDelete)}
          </div>
        </div>

        {/* 12달 그리드 — 남은 공간 꽉 채움, 각 카드 내부 스크롤 */}
        <div
          className="flex-1 min-h-0 grid grid-cols-4 gap-3"
          style={{ gridTemplateRows: 'repeat(3, 1fr)' }}
        >
          {MONTHS.map((label, idx) => {
            const isCurrentMonth = today.getFullYear() === year && today.getMonth() === idx;
            const goals = monthGoals[idx] || [];
            return (
              <div
                key={idx}
                className={`bg-white rounded-xl shadow-sm p-3 flex flex-col min-h-0 overflow-hidden ${
                  isCurrentMonth ? 'ring-2 ring-blue-300' : ''
                }`}
              >
                <span className={`text-xs font-bold shrink-0 mb-1.5 ${isCurrentMonth ? 'text-blue-500' : 'text-gray-700'}`}>
                  {label}
                </span>
                <div className="flex-1 min-h-0 overflow-y-auto">
                  {renderGoalItems(
                    goals,
                    (id) => handleMonthToggle(idx, id),
                    (id) => handleMonthDelete(idx, id),
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 오른쪽: 추가 폼 */}
      <div className="w-64 shrink-0">
        <div className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-gray-700">목표 추가</h3>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-400">내용</label>
            <input
              type="text"
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-300 transition-colors"
              placeholder="목표를 입력하세요"
              value={formText}
              onChange={e => setFormText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-400">기간</label>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => setFormMonth(-1)}
                className={`py-2 rounded-lg text-sm font-medium transition-colors border ${
                  formMonth === -1
                    ? 'bg-blue-50 text-blue-600 border-blue-300'
                    : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                }`}
              >
                연간 목표
              </button>
              <div className="grid grid-cols-4 gap-1">
                {MONTHS.map((label, idx) => (
                  <button
                    key={idx}
                    onClick={() => setFormMonth(idx)}
                    className={`py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                      formMonth === idx
                        ? 'bg-blue-50 text-blue-600 border-blue-300'
                        : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {idx + 1}월
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={!formText.trim()}
            className={`py-2 rounded-lg text-sm font-medium transition-colors ${
              formText.trim()
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            추가
          </button>
        </div>
      </div>

    </div>
  );
}

export default YearGoalsPage;
