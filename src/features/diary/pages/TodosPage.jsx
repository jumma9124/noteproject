import { useState } from 'react';

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

const EMPTY_FORM = { title: '', deadline: '', category: 'work', urgent: false };

function getDday(deadline) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(deadline + 'T00:00:00');
  return Math.ceil((d - today) / (1000 * 60 * 60 * 24));
}

function formatDday(dday) {
  if (dday < 0)  return `D+${Math.abs(dday)}`;
  if (dday === 0) return 'D-Day';
  return `D-${dday}`;
}

function TodosPage() {
  const [todos,      setTodos]      = useState(
    [...MOCK_TODOS].sort((a, b) => getDday(a.deadline) - getDday(b.deadline))
  );
  const [filter,     setFilter]     = useState('incomplete'); // 'all' | 'incomplete' | 'completed'
  const [tab,        setTab]        = useState('work');       // 'work' | 'personal'
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [editId,     setEditId]     = useState(null);
  const [dragId,     setDragId]     = useState(null);
  const [dragOverId, setDragOverId] = useState(null);

  const handleToggle = (id) =>
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));

  const handleDelete = (id) => {
    if (editId === id) { setEditId(null); setForm(EMPTY_FORM); }
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const handleEdit = (todo) => {
    setEditId(todo.id);
    setForm({ title: todo.title, deadline: todo.deadline, category: todo.category, urgent: todo.urgent });
    setTab(todo.category);
  };

  const handleSubmit = () => {
    if (!form.title.trim() || !form.deadline) return;
    if (editId) {
      setTodos(prev => prev.map(t => t.id === editId ? { ...t, ...form, title: form.title.trim() } : t));
      setEditId(null);
    } else {
      setTodos(prev => [...prev, { id: Date.now().toString(), ...form, title: form.title.trim(), completed: false }]);
    }
    setForm(EMPTY_FORM);
  };

  const handleCancel = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
  };

  const handleDragStart = (id) => setDragId(id);

  const handleDrop = (targetId) => {
    if (!dragId || dragId === targetId) { setDragId(null); setDragOverId(null); return; }
    setTodos(prev => {
      const items = [...prev];
      const fromIdx = items.findIndex(t => t.id === dragId);
      const toIdx   = items.findIndex(t => t.id === targetId);
      const [moved] = items.splice(fromIdx, 1);
      items.splice(toIdx, 0, moved);
      return items;
    });
    setDragId(null);
    setDragOverId(null);
  };

  const filtered = todos
    .filter(t => t.category === tab)
    .filter(t => filter === 'all' ? true : filter === 'incomplete' ? !t.completed : t.completed)
    .sort(filter === 'incomplete' ? undefined : (a, b) => getDday(b.deadline) - getDday(a.deadline));

  const workCount     = todos.filter(t => t.category === 'work'     && !t.completed).length;
  const personalCount = todos.filter(t => t.category === 'personal' && !t.completed).length;

  return (
    <div className="flex flex-1 gap-4 p-4 overflow-hidden min-h-0">

      {/* 왼쪽: 할일 목록 */}
      <div className="flex-1 min-w-0 flex flex-col min-h-0 bg-white rounded-xl shadow-sm p-5">

        {/* 탭 + 필터 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1">
            <button
              onClick={() => setTab('work')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                tab === 'work' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              💼 회사 {workCount > 0 && <span className="ml-1 text-xs">{workCount}</span>}
            </button>
            <button
              onClick={() => setTab('personal')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                tab === 'personal' ? 'bg-green-500 text-white' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              🙋 개인 {personalCount > 0 && <span className="ml-1 text-xs">{personalCount}</span>}
            </button>
          </div>
          <div className="flex gap-1">
            {[['incomplete', '미완료'], ['all', '전체'], ['completed', '완료']].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                  filter === key ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 목록 */}
        <ul className="flex flex-col gap-1 flex-1 min-h-0 overflow-y-auto">
          {filtered.length === 0
            ? <p className="text-sm text-gray-400 mt-4 text-center">할일이 없습니다</p>
            : filtered.map(todo => {
                const dday = getDday(todo.deadline);
                const ddayColor =
                  todo.completed ? 'text-gray-300' :
                  dday < 0  ? 'text-red-600' :
                  dday === 0 ? 'text-red-500' :
                  dday <= 3  ? 'text-orange-500' : 'text-gray-400';
                const isEditing = editId === todo.id;

                return (
                  <li
                    key={todo.id}
                    draggable
                    onDragStart={() => handleDragStart(todo.id)}
                    onDragOver={e => { e.preventDefault(); setDragOverId(todo.id); }}
                    onDragLeave={() => setDragOverId(null)}
                    onDrop={() => handleDrop(todo.id)}
                    onClick={() => !isEditing && handleEdit(todo)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors group select-none
                      ${dragId === todo.id ? 'opacity-40' : ''}
                      ${dragOverId === todo.id && dragId !== todo.id ? 'border-t-2 border-blue-400' : ''}
                      ${isEditing ? 'bg-blue-50 border border-blue-200' : todo.urgent && !todo.completed ? 'border border-red-100 bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'}
                    `}
                  >
                    <button
                      onClick={e => { e.stopPropagation(); handleToggle(todo.id); }}
                      className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors ${
                        todo.completed ? 'bg-blue-500 border-blue-500' : 'border-gray-300 hover:border-blue-300'
                      }`}
                    >
                      {todo.completed && <span className="text-white text-xs leading-none">✓</span>}
                    </button>
                    <span className={`text-xs font-bold w-12 shrink-0 ${ddayColor}`}>
                      {todo.completed ? '완료' : formatDday(dday)}
                    </span>
                    <span className={`flex-1 text-sm truncate ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                      {todo.title}
                    </span>
                    <span className="text-xs text-gray-400 shrink-0">{todo.deadline}</span>
                    {todo.urgent && !todo.completed && <span className="text-xs text-red-400 shrink-0">긴급</span>}
                    <button
                      onClick={e => { e.stopPropagation(); handleDelete(todo.id); }}
                      className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all text-xs shrink-0"
                    >
                      ✕
                    </button>
                  </li>
                );
              })
          }
        </ul>
      </div>

      {/* 오른쪽: 추가 / 편집 폼 */}
      <div className="w-72 shrink-0 flex flex-col gap-3 min-h-0">
        <div className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-gray-700">
            {editId ? '할일 수정' : '할일 추가'}
          </h3>

          {/* 제목 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-400">제목</label>
            <input
              type="text"
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-300 transition-colors"
              placeholder="할일을 입력하세요"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          {/* 마감일 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-400">마감일</label>
            <input
              type="date"
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-300 transition-colors"
              value={form.deadline}
              onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
            />
          </div>

          {/* 카테고리 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-400">카테고리</label>
            <div className="flex gap-2">
              <button
                onClick={() => setForm(f => ({ ...f, category: 'work' }))}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors border ${
                  form.category === 'work'
                    ? 'bg-blue-50 text-blue-600 border-blue-300'
                    : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                }`}
              >
                💼 회사
              </button>
              <button
                onClick={() => setForm(f => ({ ...f, category: 'personal' }))}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors border ${
                  form.category === 'personal'
                    ? 'bg-green-50 text-green-600 border-green-300'
                    : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                }`}
              >
                🙋 개인
              </button>
            </div>
          </div>

          {/* 긴급 */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">긴급</span>
            <button
              onClick={() => setForm(f => ({ ...f, urgent: !f.urgent }))}
              className={`relative w-10 h-5 rounded-full transition-colors ${form.urgent ? 'bg-red-400' : 'bg-gray-200'}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.urgent ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>

          {/* 버튼 */}
          <div className="flex gap-2 pt-1">
            {editId && (
              <button
                onClick={handleCancel}
                className="flex-1 py-2 rounded-lg text-sm text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
            )}
            <button
              onClick={handleSubmit}
              disabled={!form.title.trim() || !form.deadline}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                form.title.trim() && form.deadline
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {editId ? '수정 완료' : '추가'}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

export default TodosPage;
