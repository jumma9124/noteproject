import { useNavigate } from 'react-router-dom';
import { getCalendarDays, formatDate } from '../../../common/utils/dateUtils';

const DOW_LABELS = ['월', '화', '수', '목', '금', '토', '일'];

const VACATION_LABEL = { full: '연차', half: '반차', quarter: '반반차' };

function DayCell({ date, isCurrentMonth, vacation, hasTodoDue, hasDiary, isToday, holiday, onClick }) {
  const dow = date.getDay();
  const textColor = !isCurrentMonth
    ? 'text-gray-300'
    : holiday   ? 'text-red-500'
    : dow === 0  ? 'text-red-500'
    : dow === 6  ? 'text-blue-500'
    : 'text-gray-700';

  return (
    <div
      onClick={onClick}
      className={`border border-gray-100 cursor-pointer transition-colors select-none
        ${isCurrentMonth ? 'hover:bg-gray-50' : 'bg-gray-50/40 cursor-default'}
        ${isToday ? 'bg-blue-50' : ''}
      `}
    >
      <div className="h-full p-2 flex flex-col justify-between">
        {/* 상단: 날짜 + 점 */}
        <div className="flex justify-between items-start">
          <span className={`text-sm font-medium leading-none ${textColor} ${isToday ? 'font-bold' : ''}`}>
            {date.getDate()}
          </span>
          <div className="flex gap-0.5">
            {hasTodoDue && <span className="block w-2 h-2 rounded-full bg-red-500" />}
            {hasDiary    && <span className="block w-2 h-2 rounded-full bg-blue-500" />}
          </div>
        </div>
        {/* 하단: 휴가 텍스트 */}
        {vacation && (
          <div className="flex justify-end">
            <span className="text-orange-500 bg-orange-50 rounded px-1 leading-tight" style={{ fontSize: '9px' }}>
              {VACATION_LABEL[vacation]}
            </span>
          </div>
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
    <div className="bg-white rounded-xl shadow-sm p-4 flex-1 flex flex-col min-h-0">
      <div className="flex items-center justify-between mb-3">
        <button onClick={onPrevMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">◀</button>
        <h2 className="text-base font-bold text-gray-800">{year}년 {month + 1}월</h2>
        <button onClick={onNextMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">▶</button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {DOW_LABELS.map((d, i) => (
          <div key={d} className={`text-center text-xs font-medium py-1 ${i === 5 ? 'text-blue-400' : i === 6 ? 'text-red-400' : 'text-gray-400'}`}>
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 flex-1 min-h-0 border-t border-l border-gray-100" style={{ gridAutoRows: '1fr' }}>
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
              holiday={!!data.holiday}
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
          <span className="text-orange-500 bg-orange-50 rounded px-1" style={{ fontSize: '9px' }}>연차</span> 휴가
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <span className="text-red-500 font-medium">12</span> 공휴일
        </div>
      </div>
    </div>
  );
}

export default Calendar;
