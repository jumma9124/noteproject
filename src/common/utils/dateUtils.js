// 달력 그리드용 날짜 배열 생성 (6주 × 7일)
export function getCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days = [];

  // 월요일 시작: (일=0 → 6, 월=1 → 0, ..., 토=6 → 5)
  const startDow = (firstDay.getDay() + 6) % 7;
  for (let i = startDow - 1; i >= 0; i--) {
    days.push({ date: new Date(year, month, -i), isCurrentMonth: false });
  }

  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push({ date: new Date(year, month, d), isCurrentMonth: true });
  }

  const remaining = days.length % 7 === 0 ? 0 : 7 - (days.length % 7);
  for (let d = 1; d <= remaining; d++) {
    days.push({ date: new Date(year, month + 1, d), isCurrentMonth: false });
  }

  return days;
}

// Date → 'YYYY-MM-DD'
export function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// D-day 계산 (양수=미래, 0=오늘, 음수=지남)
export function getDday(deadline) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(deadline);
  d.setHours(0, 0, 0, 0);
  return Math.ceil((d - today) / (1000 * 60 * 60 * 24));
}

// D-day 텍스트 포맷
export function formatDday(dday) {
  if (dday === 0) return 'D-day';
  if (dday < 0) return `D+${Math.abs(dday)}`;
  return `D-${dday}`;
}

// 연차 사용량 계산
export function calcUsedVacation(calendarData) {
  return Object.values(calendarData).reduce((sum, data) => {
    if (data.vacation === 'full') return sum + 1;
    if (data.vacation === 'half') return sum + 0.5;
    if (data.vacation === 'quarter') return sum + 0.25;
    return sum;
  }, 0);
}
