import { useNavigate } from 'react-router-dom';
import { getCalendarDays, formatDate } from '../../../common/utils/dateUtils';

const DOW_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

function VacationOverlay({ type }) {
  if (!type) return null;
  const base = 'absolute left-0.5 right-0.5 border-2 border-orange-400 pointer-events-none rounded-sm';
  if (type === 'full')    return <div className={`${base} top-0.5 bottom-0.5`} />;
  if (type === 'half')    return <div className={`${base} top-0.5 h-1/2 border-b-0`} />;
  if (type === 'quarter') return <div className={`${base} top-0.5 h-1/4 border-b-0`} />;
  return null;
}

function DayCell({ date, isCurrentMonth, vacation, hasTodoDue, hasDiary, isToday, onClick }) {
  const dow = date.getDay();
  const textColor = !isCurrentMonth
    ? 'text-gray-300'
    : dow === 0 ? 'text-red-500'
    : dow === 6 ? 'text-blue-500'
    : 'text-gray-700';

  return (
    <div
      onClick={onClick}
      className={`relative border border-gray-100 cursor-pointer transition-colors select-none
        ${isCurrentMonth ? 'hover:bg-gray-50' : 'bg-gray-50/40 cursor-default'}
        ${isToday ? 'bg-blue-50' : ''}
      `}
      style={{ paddingBottom: '100%' }}
    >
      <div className="absolute inset-0 p-1">
        <VacationOverlay type={vacation} />
        <div className="flex justify-between items-start">
          <span className={`text-xs font-medium leading-none ${textColor} ${isToday ? 'font-bold' : ''}`}>
            {date.getDate()}
          </span>
          <div className="flex gap-0.5 mt-0.5">
            {hasTodoDue && <span className="block w-1.5 h-1.5 rounded-full bg-red-500" />}
            {hasDiary    && <span className="block w-1.5 h-1.5 rounded-full bg-blue-500" />}
          </div>
        </div>
        {isToday && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-400" />
        )}
      </div>
    </div>
  );
}

function Calendar({ year, month, calendarData, onPrevMonth, onNextMonth }) {
  const navigate = useNavigate();
  const days = getCalendarDays(year, month);
  const todayStr = formatDate(new Date());

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <button onClick={onPrevMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">◀</button>
        <h2 className="text-base font-bold text-gray-800">{year}년 {month + 1}월</h2>
        <button onClick={onNextMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">▶</button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {DOW_LABELS.map((d, i) => (
          <div key={d} className={`text-center text-xs font-medium py-1 ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-400'}`}>
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 flex-1 border-t border-l border-gray-100">
        {days.map(({ date, isCurrentMonth }) => {
          const dateStr = formatDate(date);
          const data = calendarData[dateStr] || {};
          return (
            <DayCell
              key={dateStr}
              date={date}
              isCurrentMonth={isCurrentMonth}
              vacation={data.vacation}
              hasTodoDue={!!data.hasTodoDue}
              hasDiary={!!data.hasDiary}
              isToday={dateStr === todayStr}
              onClick={() => isCurrentMonth && navigate(`/day/${dateStr}`)}
            />
          );
        })}
      </div>

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> 마감 할일
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> 일기 작성
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <span className="w-3 h-3 border-2 border-orange-400 inline-block rounded-sm" /> 휴가
        </div>
      </div>
    </div>
  );
}

export default Calendar;
