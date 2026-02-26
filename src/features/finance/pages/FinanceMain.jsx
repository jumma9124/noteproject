import { useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer,
  LineChart, Line, CartesianGrid,
} from 'recharts';

// ─── MOCK DATA ───────────────────────────────────────────────────────────────
const WEEKLY_BUDGET   = 700000;
const MONTHLY_INCOME  = 3500000;
const MONTHLY_EXPENSE = 2800000;

const MOCK_ASSETS = [
  { id: 'stock',     label: '주식',   amount: 21000000, color: '#6366f1' },
  { id: 'savings',   label: '적금',   amount: 15000000, color: '#22c55e' },
  { id: 'deposit',   label: '예금',   amount:  8000000, color: '#3b82f6' },
  { id: 'cash',      label: '현금',   amount:  5000000, color: '#f59e0b' },
  { id: 'guarantee', label: '보증금', amount:  3800000, color: '#8b5cf6' },
  { id: 'emergency', label: '비상금', amount:  2000000, color: '#06b6d4' },
];
const MOCK_DEBT = 3000000;

const MOCK_STOCKS_INIT = [
  { id: 's1', name: '삼성전자', currentPrice: 72000,
    purchases: [
      { id: 'p1', date: '2026-02-01', qty: 10, price: 60000 },
      { id: 'p2', date: '2026-02-03', qty: 15, price: 68000 },
    ] },
  { id: 's2', name: '카카오', currentPrice: 48000,
    purchases: [{ id: 'p3', date: '2026-01-15', qty: 20, price: 45000 }] },
  { id: 's3', name: '현대차', currentPrice: 115000,
    purchases: [{ id: 'p4', date: '2026-01-20', qty: 5, price: 120000 }] },
];

const MOCK_SAVINGS_INIT = [
  { id: 'sa1', name: 'OO은행 정기적금', monthly: 500000, rate: 3.5, totalMonths: 24, elapsed: 12 },
  { id: 'sa2', name: '청년우대적금',    monthly: 300000, rate: 5.0, totalMonths: 12, elapsed: 6  },
];

const MOCK_BONDS_INIT = [
  { id: 'b1', name: '국고채 3년', invested: 5000000, maturity: '2027-03', rate: 3.2 },
];

const MOCK_FUNDS_INIT = [
  { id: 'f1', name: '글로벌주식펀드', invested: 3000000, currentValue: 3375000 },
];

const MOCK_DEPOSITS_INIT = [
  { id: 'd1', name: '주거래은행',  amount: 5000000, rate: 0.1 },
  { id: 'd2', name: '비상금통장', amount: 2000000, rate: 1.5 },
];

const MOCK_DEBTS_INIT = [
  { id: 'de1', name: '학자금대출', balance: 2000000, rate: 2.5, monthly: 100000 },
  { id: 'de2', name: '카드할부',   balance: 1000000, rate: 5.0, monthly: 200000 },
];

const MOCK_EXPENSES_INIT = [
  { id: 'e1', date: '2026-02-23', memo: '점심/커피', amount: 20000 },
  { id: 'e2', date: '2026-02-24', memo: '교통/식비', amount: 15000 },
  { id: 'e3', date: '2026-02-25', memo: '',          amount: 10000 },
];

const MOCK_FIXED_INIT = [
  { id: 'fc1', name: '월세',     amount: 1000000, day: 1,  method: '자동이체' },
  { id: 'fc2', name: '통신비',   amount:  100000, day: 5,  method: '카드A'   },
  { id: 'fc3', name: '넷플릭스', amount:   15000, day: 15, method: '카드B'   },
  { id: 'fc4', name: '헬스장',   amount:   80000, day: 1,  method: '카드A'   },
];

const MOCK_ASSET_TREND = [
  { month: '9월', net: 4650 }, { month: '10월', net: 4720 },
  { month: '11월', net: 4800 }, { month: '12월', net: 4910 },
  { month: '1월', net: 4910 }, { month: '2월', net: 4980 },
];
const MOCK_SAVINGS_RATE = [
  { month: '9월', rate: 12 }, { month: '10월', rate: 15 },
  { month: '11월', rate: 18 }, { month: '12월', rate: 14 },
  { month: '1월', rate: 15 }, { month: '2월', rate: 20 },
];
const MOCK_MONTHLY_TREND = [
  { month: '10월', amount: 210 }, { month: '11월', amount: 245 },
  { month: '12월', amount: 230 }, { month: '1월',  amount: 250 },
  { month: '2월',  amount: 280 },
];
const MOCK_WEEKLY = [
  { week: '1주차', spent: 800000, over: true  },
  { week: '2주차', spent: 500000, over: false },
  { week: '3주차', spent: 200000, current: true },
  { week: '4주차', spent: 0,      upcoming: true },
];

const MOCK_GOALS_INIT = {
  yearGoal: 12000000,
  months: [
    { month: 1,  target: 1000000, actual: 900000  },
    { month: 2,  target: 1000000, actual: 450000  },
    { month: 3,  target: 1000000, actual: null    },
    { month: 4,  target: 1000000, actual: null    },
    { month: 5,  target: 1000000, actual: null    },
    { month: 6,  target: 1000000, actual: null    },
    { month: 7,  target: 1000000, actual: null    },
    { month: 8,  target: 1000000, actual: null    },
    { month: 9,  target: 1000000, actual: null    },
    { month: 10, target: 1000000, actual: null    },
    { month: 11, target: 1000000, actual: null    },
    { month: 12, target: 1000000, actual: null    },
  ],
};

// ─── UTILS ───────────────────────────────────────────────────────────────────
const fmt     = (n) => (n / 10000).toFixed(0) + '만원';
const fmtShort = (n) => (n / 10000).toFixed(0) + '만';
const fmtN    = (n) => n.toLocaleString() + '원';
const calcAvg = (purchases) => {
  const qty  = purchases.reduce((s, p) => s + p.qty,         0);
  const cost = purchases.reduce((s, p) => s + p.price * p.qty, 0);
  return qty > 0 ? Math.round(cost / qty) : 0;
};

const TABS       = ['대시보드', '자산 관리', '지출 입력', '고정비', '통계', '목표'];
const ASSET_TABS = ['주식', '적금', '채권', '펀드', '예금/현금', '부채'];
const METHODS    = ['자동이체', '카드A', '카드B', '카드C', '현금'];

// ─── 공통 인풋 스타일 ─────────────────────────────────────────────────────────
const inp = 'border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-300 transition-colors w-full';

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
function Dashboard() {
  const totalAsset  = MOCK_ASSETS.reduce((s, a) => s + a.amount, 0);
  const netAsset    = totalAsset - MOCK_DEBT;
  const monthlySave = MONTHLY_INCOME - MONTHLY_EXPENSE;
  const goalPct     = Math.round((1800000 / 12000000) * 100);

  const pieData = [
    ...MOCK_ASSETS.map(a => ({ name: a.label, value: a.amount, color: a.color })),
    { name: '부채', value: MOCK_DEBT, color: '#ef4444' },
  ];

  return (
    <div className="flex flex-1 gap-4 p-4 overflow-hidden min-h-0">
      <div className="flex-1 min-w-0 flex flex-col gap-3 min-h-0">
        {/* 요약 */}
        <div className="bg-white rounded-xl shadow-sm px-5 py-3 shrink-0">
          <div className="flex items-center gap-6 flex-wrap">
            {[['총 자산', fmt(totalAsset), 'text-gray-800'], ['총 부채', '-' + fmt(MOCK_DEBT), 'text-red-500'], ['순 자산 ⭐', fmt(netAsset), 'text-blue-600']].map(([label, val, cls]) => (
              <div key={label} className="flex flex-col gap-0.5">
                <span className="text-xs text-gray-400">{label}</span>
                <span className={`text-lg font-bold ${cls}`}>{val}</span>
              </div>
            ))}
            <div className="w-px h-8 bg-gray-100 mx-1" />
            {[['이달 수입', '+' + fmt(MONTHLY_INCOME), 'text-green-600'], ['이달 지출', '-' + fmt(MONTHLY_EXPENSE), 'text-red-400'], ['이달 저축', '+' + fmt(monthlySave), 'text-blue-500']].map(([label, val, cls]) => (
              <div key={label} className="flex flex-col gap-0.5">
                <span className="text-xs text-gray-400">{label}</span>
                <span className={`text-base font-bold ${cls}`}>{val}</span>
              </div>
            ))}
          </div>
        </div>
        {/* 파이차트 + 목록 */}
        <div className="bg-white rounded-xl shadow-sm p-4 flex-1 min-h-0 flex gap-4 overflow-hidden">
          <div className="flex items-center justify-center shrink-0" style={{ width: 220 }}>
            <PieChart width={220} height={220}>
              <Pie data={pieData} cx={110} cy={110} innerRadius={55} outerRadius={100} dataKey="value" strokeWidth={1}>
                {pieData.map((_, i) => <Cell key={i} fill={pieData[i].color} />)}
              </Pie>
              <Tooltip formatter={(v) => fmt(v)} />
            </PieChart>
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5 overflow-y-auto">
            {MOCK_ASSETS.map(asset => {
              const pct = Math.round((asset.amount / totalAsset) * 100);
              return (
                <div key={asset.id} className="flex items-center gap-3 px-2 py-1 rounded-lg hover:bg-gray-50">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: asset.color }} />
                  <span className="text-sm text-gray-700 w-16 shrink-0">{asset.label}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, backgroundColor: asset.color }} />
                  </div>
                  <span className="text-xs text-gray-400 w-7 text-right shrink-0">{pct}%</span>
                  <span className="text-sm font-medium text-gray-700 w-24 text-right shrink-0">{fmt(asset.amount)}</span>
                </div>
              );
            })}
            <div className="border-t border-gray-100 mt-1 pt-1">
              <div className="flex items-center gap-3 px-2 py-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400 shrink-0" />
                <span className="text-sm text-red-500 w-16 shrink-0">부채</span>
                <div className="flex-1" />
                <span className="text-sm font-medium text-red-500 w-24 text-right">-{fmt(MOCK_DEBT)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 오른쪽 */}
      <div className="w-72 shrink-0 flex flex-col gap-3 min-h-0 overflow-hidden">
        <div className="bg-white rounded-xl shadow-sm p-4 shrink-0">
          <h3 className="text-sm font-bold text-gray-700 mb-3">🎯 2026년 저축 목표</h3>
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>{fmt(1800000)} 달성</span><span>목표 {fmt(12000000)}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 mb-1">
            <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${goalPct}%` }} />
          </div>
          <span className="text-xs text-blue-500 font-medium">{goalPct}% 달성</span>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 shrink-0">
          <h3 className="text-sm font-bold text-gray-700 mb-3">📅 2월 주별 예산 <span className="text-xs text-gray-400 font-normal">({fmtShort(WEEKLY_BUDGET)}/주)</span></h3>
          <div className="flex flex-col gap-2">
            {MOCK_WEEKLY.map(w => {
              const pct = Math.round((w.spent / WEEKLY_BUDGET) * 100);
              return (
                <div key={w.week}>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className={`font-medium ${w.current ? 'text-blue-500' : 'text-gray-600'}`}>{w.week}{w.current ? ' (진행중)' : ''}</span>
                    <span className={w.over ? 'text-red-500' : w.upcoming ? 'text-gray-300' : 'text-gray-500'}>
                      {w.upcoming ? '-' : `${fmtShort(w.spent)}/${fmtShort(WEEKLY_BUDGET)}`}{w.over ? ' ⚠️' : ''}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${w.over ? 'bg-red-400' : w.current ? 'bg-blue-400' : w.upcoming ? 'bg-gray-100' : 'bg-green-400'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 flex-1 min-h-0">
          <h3 className="text-sm font-bold text-gray-700 mb-3">📊 월별 지출 추이</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_MONTHLY_TREND} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => `${v}만원`} />
              <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ─── STOCKS SECTION ──────────────────────────────────────────────────────────
function StocksSection() {
  const [stocks,      setStocks]      = useState(MOCK_STOCKS_INIT);
  const [selectedId,  setSelectedId]  = useState(null);
  const [priceInput,  setPriceInput]  = useState('');
  const [newPurchase, setNewPurchase] = useState({ date: '', qty: '', price: '' });
  const [addingStock, setAddingStock] = useState(false);
  const [newStock,    setNewStock]    = useState({ name: '', currentPrice: '' });

  const selected = stocks.find(s => s.id === selectedId);

  const selectStock = (s) => { setSelectedId(s.id); setPriceInput(s.currentPrice.toString()); setAddingStock(false); };

  const handleUpdatePrice = () => {
    if (!priceInput || !selectedId) return;
    setStocks(prev => prev.map(s => s.id === selectedId ? { ...s, currentPrice: parseInt(priceInput) } : s));
  };

  const handleAddPurchase = () => {
    if (!newPurchase.date || !newPurchase.qty || !newPurchase.price) return;
    setStocks(prev => prev.map(s => s.id === selectedId ? {
      ...s, purchases: [...s.purchases, { id: Date.now().toString(), date: newPurchase.date, qty: parseInt(newPurchase.qty), price: parseInt(newPurchase.price) }]
    } : s));
    setNewPurchase({ date: '', qty: '', price: '' });
  };

  const handleAddStock = () => {
    if (!newStock.name || !newStock.currentPrice) return;
    const s = { id: Date.now().toString(), name: newStock.name, currentPrice: parseInt(newStock.currentPrice), purchases: [] };
    setStocks(prev => [...prev, s]);
    setNewStock({ name: '', currentPrice: '' });
    setAddingStock(false);
    selectStock(s);
  };

  const handleDeleteStock = (id) => {
    setStocks(prev => prev.filter(s => s.id !== id));
    if (selectedId === id) { setSelectedId(null); setAddingStock(false); }
  };

  return (
    <div className="flex flex-1 gap-3 min-h-0 overflow-hidden">
      <div className="flex-1 min-w-0 bg-white rounded-xl shadow-sm p-4 flex flex-col min-h-0">
        <div className="flex justify-between items-center mb-3 shrink-0">
          <h3 className="text-sm font-bold text-gray-700">주식 보유 종목</h3>
          <button onClick={() => { setSelectedId(null); setAddingStock(true); }} className="text-xs px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600">+ 종목 추가</button>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white">
              <tr className="text-xs text-gray-400 border-b border-gray-100">
                {['종목명', '평단가', '현재가', '수량', '수익률', '평가금액', ''].map(h => <th key={h} className={`pb-2 font-medium ${h === '종목명' ? 'text-left' : 'text-right'}`}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {stocks.map(stock => {
                const avg     = calcAvg(stock.purchases);
                const qty     = stock.purchases.reduce((s, p) => s + p.qty, 0);
                const pctVal  = avg > 0 ? ((stock.currentPrice - avg) / avg * 100).toFixed(1) : '0.0';
                const profit  = parseFloat(pctVal) >= 0;
                return (
                  <tr key={stock.id} onClick={() => selectStock(stock)} className={`border-b border-gray-50 cursor-pointer transition-colors group ${selectedId === stock.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                    <td className="py-2.5 font-medium text-gray-800">{stock.name}</td>
                    <td className="py-2.5 text-right text-gray-500 text-xs">{avg > 0 ? fmtN(avg) : '-'}</td>
                    <td className="py-2.5 text-right text-gray-600">{fmtN(stock.currentPrice)}</td>
                    <td className="py-2.5 text-right text-gray-500 text-xs">{qty}주</td>
                    <td className={`py-2.5 text-right font-medium ${profit ? 'text-red-500' : 'text-blue-500'}`}>{profit ? '+' : ''}{pctVal}%</td>
                    <td className="py-2.5 text-right text-gray-700">{fmt(stock.currentPrice * qty)}</td>
                    <td className="py-2.5 text-right"><button onClick={e => { e.stopPropagation(); handleDeleteStock(stock.id); }} className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 text-xs">✕</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="shrink-0 border-t border-gray-100 pt-2 mt-2 flex justify-between text-sm">
          <span className="text-gray-500">총 주식 평가액</span>
          <span className="font-bold text-gray-800">{fmt(stocks.reduce((s, st) => s + st.currentPrice * st.purchases.reduce((q, p) => q + p.qty, 0), 0))}</span>
        </div>
      </div>
      {/* 오른쪽 패널 */}
      <div className="w-80 shrink-0 bg-white rounded-xl shadow-sm p-4 flex flex-col gap-3 min-h-0 overflow-y-auto">
        {addingStock && !selectedId && (<>
          <h3 className="text-sm font-bold text-gray-700 shrink-0">새 종목 추가</h3>
          <input className={inp} placeholder="종목명" value={newStock.name} onChange={e => setNewStock(p => ({...p, name: e.target.value}))} />
          <input className={inp} type="number" placeholder="현재가 (원)" value={newStock.currentPrice} onChange={e => setNewStock(p => ({...p, currentPrice: e.target.value}))} />
          <button onClick={handleAddStock} disabled={!newStock.name || !newStock.currentPrice} className="py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 disabled:bg-gray-100 disabled:text-gray-400">추가</button>
        </>)}
        {selected && (<>
          <div className="flex items-center justify-between shrink-0">
            <h3 className="text-sm font-bold text-gray-700">{selected.name}</h3>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 shrink-0">
            <p className="text-xs text-gray-400 mb-2">현재가 업데이트</p>
            <div className="flex gap-2">
              <input className={inp} type="number" value={priceInput} onChange={e => setPriceInput(e.target.value)} />
              <button onClick={handleUpdatePrice} className="px-3 py-2 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 shrink-0">저장</button>
            </div>
          </div>
          <div className="shrink-0">
            <p className="text-xs font-medium text-gray-400 mb-2">매수 내역</p>
            <table className="w-full text-xs">
              <thead><tr className="text-gray-400 border-b border-gray-100">{['날짜','수량','매수가','금액'].map(h => <th key={h} className={`pb-1.5 font-medium ${h==='날짜'?'text-left':'text-right'}`}>{h}</th>)}</tr></thead>
              <tbody>
                {selected.purchases.map(p => (
                  <tr key={p.id} className="border-b border-gray-50">
                    <td className="py-1.5 text-gray-600">{p.date}</td>
                    <td className="py-1.5 text-right text-gray-600">{p.qty}주</td>
                    <td className="py-1.5 text-right text-gray-600">{p.price.toLocaleString()}</td>
                    <td className="py-1.5 text-right text-gray-600">{fmt(p.price * p.qty)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between text-xs mt-1 pt-1 border-t border-gray-100 text-gray-500 font-medium">
              <span>평균 매수가: {fmtN(calcAvg(selected.purchases))}</span>
              <span>총 {selected.purchases.reduce((s, p) => s + p.qty, 0)}주</span>
            </div>
          </div>
          <div className="shrink-0">
            <p className="text-xs font-medium text-gray-400 mb-2">매수 추가</p>
            <div className="flex flex-col gap-1.5">
              <input className={inp} type="date" value={newPurchase.date} onChange={e => setNewPurchase(p => ({...p, date: e.target.value}))} />
              <div className="flex gap-1.5">
                <input className={inp} type="number" placeholder="수량" value={newPurchase.qty} onChange={e => setNewPurchase(p => ({...p, qty: e.target.value}))} />
                <input className={inp} type="number" placeholder="매수가 (원)" value={newPurchase.price} onChange={e => setNewPurchase(p => ({...p, price: e.target.value}))} />
              </div>
              <button onClick={handleAddPurchase} disabled={!newPurchase.date || !newPurchase.qty || !newPurchase.price} className="py-1.5 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 disabled:bg-gray-100 disabled:text-gray-400">매수 추가</button>
            </div>
          </div>
        </>)}
        {!selected && !addingStock && (
          <div className="flex flex-1 items-center justify-center text-gray-400 text-sm text-center">종목을 선택하거나<br/>새로 추가해주세요</div>
        )}
      </div>
    </div>
  );
}

// ─── SAVINGS SECTION ─────────────────────────────────────────────────────────
function SavingsSection() {
  const [items,  setItems]  = useState(MOCK_SAVINGS_INIT);
  const [editId, setEditId] = useState(null);
  const [form,   setForm]   = useState({ name: '', monthly: '', rate: '', totalMonths: '', elapsed: '' });

  const handleEdit   = (item) => { setEditId(item.id); setForm({ name: item.name, monthly: item.monthly, rate: item.rate, totalMonths: item.totalMonths, elapsed: item.elapsed }); };
  const handleDelete = (id) => { setItems(prev => prev.filter(i => i.id !== id)); if (editId === id) { setEditId(null); setForm({ name: '', monthly: '', rate: '', totalMonths: '', elapsed: '' }); } };
  const handleSubmit = () => {
    if (!form.name || !form.monthly) return;
    const parsed = { name: form.name, monthly: parseInt(form.monthly), rate: parseFloat(form.rate)||0, totalMonths: parseInt(form.totalMonths)||0, elapsed: parseInt(form.elapsed)||0 };
    if (editId) { setItems(prev => prev.map(i => i.id === editId ? { ...i, ...parsed } : i)); setEditId(null); }
    else { setItems(prev => [...prev, { id: Date.now().toString(), ...parsed }]); }
    setForm({ name: '', monthly: '', rate: '', totalMonths: '', elapsed: '' });
  };

  return (
    <div className="flex flex-1 gap-3 min-h-0 overflow-hidden">
      <div className="flex-1 min-w-0 bg-white rounded-xl shadow-sm p-4 flex flex-col min-h-0">
        <h3 className="text-sm font-bold text-gray-700 mb-3 shrink-0">적금 목록</h3>
        <div className="flex-1 min-h-0 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white"><tr className="text-xs text-gray-400 border-b border-gray-100">{['적금명','월납입','이율','진행','예상만기금액',''].map(h=><th key={h} className={`pb-2 font-medium ${h==='적금명'?'text-left':'text-right'}`}>{h}</th>)}</tr></thead>
            <tbody>
              {items.map(item => {
                const expected = item.monthly * item.totalMonths * (1 + item.rate / 100 / 2);
                return (
                  <tr key={item.id} onClick={() => handleEdit(item)} className={`border-b border-gray-50 cursor-pointer group transition-colors ${editId===item.id?'bg-blue-50':'hover:bg-gray-50'}`}>
                    <td className="py-2.5 font-medium text-gray-800">{item.name}</td>
                    <td className="py-2.5 text-right text-gray-600">{fmt(item.monthly)}</td>
                    <td className="py-2.5 text-right text-gray-600">{item.rate}%</td>
                    <td className="py-2.5 text-right text-gray-500 text-xs">{item.elapsed}/{item.totalMonths}개월</td>
                    <td className="py-2.5 text-right text-gray-700">{fmt(expected)}</td>
                    <td className="py-2.5 text-right"><button onClick={e=>{e.stopPropagation();handleDelete(item.id);}} className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 text-xs">✕</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="shrink-0 border-t border-gray-100 pt-2 mt-2 flex justify-between text-sm">
          <span className="text-gray-500">월 납입 합계</span>
          <span className="font-bold text-gray-800">{fmt(items.reduce((s,i)=>s+i.monthly,0))}</span>
        </div>
      </div>
      <div className="w-72 shrink-0 bg-white rounded-xl shadow-sm p-4 flex flex-col gap-3">
        <h3 className="text-sm font-bold text-gray-700">{editId ? '적금 수정' : '적금 추가'}</h3>
        {[['name','적금명','text'],['monthly','월 납입액 (원)','number'],['rate','이율 (%)','number'],['totalMonths','총 기간 (개월)','number'],['elapsed','납입 기간 (개월)','number']].map(([k,ph,t])=>(
          <input key={k} className={inp} type={t} placeholder={ph} value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} />
        ))}
        <div className="flex gap-2">
          {editId && <button onClick={()=>{setEditId(null);setForm({name:'',monthly:'',rate:'',totalMonths:'',elapsed:''});}} className="flex-1 py-2 border border-gray-200 text-gray-500 text-sm rounded-lg hover:bg-gray-50">취소</button>}
          <button onClick={handleSubmit} disabled={!form.name||!form.monthly} className="flex-1 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 disabled:bg-gray-100 disabled:text-gray-400">{editId?'수정':'추가'}</button>
        </div>
      </div>
    </div>
  );
}

// ─── BOND SECTION ────────────────────────────────────────────────────────────
function BondSection() {
  const [items,  setItems]  = useState(MOCK_BONDS_INIT);
  const [editId, setEditId] = useState(null);
  const [form,   setForm]   = useState({ name: '', invested: '', maturity: '', rate: '' });

  const handleEdit   = (item) => { setEditId(item.id); setForm({ name: item.name, invested: item.invested, maturity: item.maturity, rate: item.rate }); };
  const handleDelete = (id) => { setItems(prev => prev.filter(i => i.id !== id)); if (editId===id) { setEditId(null); setForm({name:'',invested:'',maturity:'',rate:''}); } };
  const handleSubmit = () => {
    if (!form.name || !form.invested) return;
    const parsed = { name: form.name, invested: parseInt(form.invested), maturity: form.maturity, rate: parseFloat(form.rate)||0 };
    if (editId) { setItems(prev => prev.map(i => i.id===editId ? {...i,...parsed} : i)); setEditId(null); }
    else setItems(prev => [...prev, { id: Date.now().toString(), ...parsed }]);
    setForm({name:'',invested:'',maturity:'',rate:''});
  };

  return (
    <div className="flex flex-1 gap-3 min-h-0 overflow-hidden">
      <div className="flex-1 min-w-0 bg-white rounded-xl shadow-sm p-4 flex flex-col min-h-0">
        <h3 className="text-sm font-bold text-gray-700 mb-3 shrink-0">채권 목록</h3>
        <div className="flex-1 min-h-0 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white"><tr className="text-xs text-gray-400 border-b border-gray-100">{['채권명','투자액','만기일','이율','만기금액',''].map(h=><th key={h} className={`pb-2 font-medium ${h==='채권명'?'text-left':'text-right'}`}>{h}</th>)}</tr></thead>
            <tbody>
              {items.map(item => {
                const years   = (new Date(item.maturity + '-01') - new Date()) / (1000*60*60*24*365);
                const matAmt  = item.invested * (1 + item.rate/100 * Math.max(years, 0));
                return (
                  <tr key={item.id} onClick={()=>handleEdit(item)} className={`border-b border-gray-50 cursor-pointer group transition-colors ${editId===item.id?'bg-blue-50':'hover:bg-gray-50'}`}>
                    <td className="py-2.5 font-medium text-gray-800">{item.name}</td>
                    <td className="py-2.5 text-right text-gray-600">{fmt(item.invested)}</td>
                    <td className="py-2.5 text-right text-gray-500 text-xs">{item.maturity}</td>
                    <td className="py-2.5 text-right text-gray-600">{item.rate}%</td>
                    <td className="py-2.5 text-right text-gray-700">{fmt(matAmt)}</td>
                    <td className="py-2.5 text-right"><button onClick={e=>{e.stopPropagation();handleDelete(item.id);}} className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 text-xs">✕</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="w-72 shrink-0 bg-white rounded-xl shadow-sm p-4 flex flex-col gap-3">
        <h3 className="text-sm font-bold text-gray-700">{editId ? '채권 수정' : '채권 추가'}</h3>
        {[['name','채권명','text'],['invested','투자액 (원)','number'],['maturity','만기일 (YYYY-MM)','text'],['rate','이율 (%)','number']].map(([k,ph,t])=>(
          <input key={k} className={inp} type={t} placeholder={ph} value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} />
        ))}
        <div className="flex gap-2">
          {editId && <button onClick={()=>{setEditId(null);setForm({name:'',invested:'',maturity:'',rate:''});}} className="flex-1 py-2 border border-gray-200 text-gray-500 text-sm rounded-lg hover:bg-gray-50">취소</button>}
          <button onClick={handleSubmit} disabled={!form.name||!form.invested} className="flex-1 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 disabled:bg-gray-100 disabled:text-gray-400">{editId?'수정':'추가'}</button>
        </div>
      </div>
    </div>
  );
}

// ─── FUND SECTION ────────────────────────────────────────────────────────────
function FundSection() {
  const [items,  setItems]  = useState(MOCK_FUNDS_INIT);
  const [editId, setEditId] = useState(null);
  const [form,   setForm]   = useState({ name: '', invested: '', currentValue: '' });

  const handleEdit   = (item) => { setEditId(item.id); setForm({ name: item.name, invested: item.invested, currentValue: item.currentValue }); };
  const handleDelete = (id) => { setItems(prev => prev.filter(i => i.id !== id)); if (editId===id) { setEditId(null); setForm({name:'',invested:'',currentValue:''}); } };
  const handleSubmit = () => {
    if (!form.name || !form.invested) return;
    const parsed = { name: form.name, invested: parseInt(form.invested), currentValue: parseInt(form.currentValue)||parseInt(form.invested) };
    if (editId) { setItems(prev => prev.map(i => i.id===editId ? {...i,...parsed} : i)); setEditId(null); }
    else setItems(prev => [...prev, { id: Date.now().toString(), ...parsed }]);
    setForm({name:'',invested:'',currentValue:''});
  };

  return (
    <div className="flex flex-1 gap-3 min-h-0 overflow-hidden">
      <div className="flex-1 min-w-0 bg-white rounded-xl shadow-sm p-4 flex flex-col min-h-0">
        <h3 className="text-sm font-bold text-gray-700 mb-3 shrink-0">펀드 목록</h3>
        <div className="flex-1 min-h-0 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white"><tr className="text-xs text-gray-400 border-b border-gray-100">{['펀드명','투자액','현재가','수익률','평가금액',''].map(h=><th key={h} className={`pb-2 font-medium ${h==='펀드명'?'text-left':'text-right'}`}>{h}</th>)}</tr></thead>
            <tbody>
              {items.map(item => {
                const pct    = ((item.currentValue - item.invested) / item.invested * 100).toFixed(1);
                const profit = parseFloat(pct) >= 0;
                return (
                  <tr key={item.id} onClick={()=>handleEdit(item)} className={`border-b border-gray-50 cursor-pointer group transition-colors ${editId===item.id?'bg-blue-50':'hover:bg-gray-50'}`}>
                    <td className="py-2.5 font-medium text-gray-800">{item.name}</td>
                    <td className="py-2.5 text-right text-gray-600">{fmt(item.invested)}</td>
                    <td className="py-2.5 text-right text-gray-500 text-xs">수동</td>
                    <td className={`py-2.5 text-right font-medium ${profit?'text-red-500':'text-blue-500'}`}>{profit?'+':''}{pct}%</td>
                    <td className="py-2.5 text-right text-gray-700">{fmt(item.currentValue)}</td>
                    <td className="py-2.5 text-right"><button onClick={e=>{e.stopPropagation();handleDelete(item.id);}} className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 text-xs">✕</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="w-72 shrink-0 bg-white rounded-xl shadow-sm p-4 flex flex-col gap-3">
        <h3 className="text-sm font-bold text-gray-700">{editId ? '펀드 수정' : '펀드 추가'}</h3>
        {[['name','펀드명','text'],['invested','투자액 (원)','number'],['currentValue','현재 평가액 (원)','number']].map(([k,ph,t])=>(
          <input key={k} className={inp} type={t} placeholder={ph} value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} />
        ))}
        <div className="flex gap-2">
          {editId && <button onClick={()=>{setEditId(null);setForm({name:'',invested:'',currentValue:''}); }} className="flex-1 py-2 border border-gray-200 text-gray-500 text-sm rounded-lg hover:bg-gray-50">취소</button>}
          <button onClick={handleSubmit} disabled={!form.name||!form.invested} className="flex-1 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 disabled:bg-gray-100 disabled:text-gray-400">{editId?'수정':'추가'}</button>
        </div>
      </div>
    </div>
  );
}

// ─── DEPOSIT SECTION ─────────────────────────────────────────────────────────
function DepositSection() {
  const [items,  setItems]  = useState(MOCK_DEPOSITS_INIT);
  const [editId, setEditId] = useState(null);
  const [form,   setForm]   = useState({ name: '', amount: '', rate: '' });

  const handleEdit   = (item) => { setEditId(item.id); setForm({ name: item.name, amount: item.amount, rate: item.rate }); };
  const handleDelete = (id) => { setItems(prev => prev.filter(i => i.id !== id)); if (editId===id) { setEditId(null); setForm({name:'',amount:'',rate:''}); } };
  const handleSubmit = () => {
    if (!form.name || !form.amount) return;
    const parsed = { name: form.name, amount: parseInt(form.amount), rate: parseFloat(form.rate)||0 };
    if (editId) { setItems(prev => prev.map(i => i.id===editId ? {...i,...parsed} : i)); setEditId(null); }
    else setItems(prev => [...prev, { id: Date.now().toString(), ...parsed }]);
    setForm({name:'',amount:'',rate:''});
  };

  return (
    <div className="flex flex-1 gap-3 min-h-0 overflow-hidden">
      <div className="flex-1 min-w-0 bg-white rounded-xl shadow-sm p-4 flex flex-col min-h-0">
        <h3 className="text-sm font-bold text-gray-700 mb-3 shrink-0">예금 / 현금</h3>
        <div className="flex-1 min-h-0 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white"><tr className="text-xs text-gray-400 border-b border-gray-100">{['계좌명','금액','이율',''].map(h=><th key={h} className={`pb-2 font-medium ${h==='계좌명'?'text-left':'text-right'}`}>{h}</th>)}</tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} onClick={()=>handleEdit(item)} className={`border-b border-gray-50 cursor-pointer group transition-colors ${editId===item.id?'bg-blue-50':'hover:bg-gray-50'}`}>
                  <td className="py-2.5 font-medium text-gray-800">{item.name}</td>
                  <td className="py-2.5 text-right text-gray-700 font-medium">{fmt(item.amount)}</td>
                  <td className="py-2.5 text-right text-gray-500 text-xs">{item.rate}%</td>
                  <td className="py-2.5 text-right"><button onClick={e=>{e.stopPropagation();handleDelete(item.id);}} className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 text-xs">✕</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="shrink-0 border-t border-gray-100 pt-2 mt-2 flex justify-between text-sm">
          <span className="text-gray-500">합계</span>
          <span className="font-bold text-gray-800">{fmt(items.reduce((s,i)=>s+i.amount,0))}</span>
        </div>
      </div>
      <div className="w-72 shrink-0 bg-white rounded-xl shadow-sm p-4 flex flex-col gap-3">
        <h3 className="text-sm font-bold text-gray-700">{editId ? '수정' : '계좌 추가'}</h3>
        {[['name','계좌명','text'],['amount','금액 (원)','number'],['rate','이율 (%)','number']].map(([k,ph,t])=>(
          <input key={k} className={inp} type={t} placeholder={ph} value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} />
        ))}
        <div className="flex gap-2">
          {editId && <button onClick={()=>{setEditId(null);setForm({name:'',amount:'',rate:''}); }} className="flex-1 py-2 border border-gray-200 text-gray-500 text-sm rounded-lg hover:bg-gray-50">취소</button>}
          <button onClick={handleSubmit} disabled={!form.name||!form.amount} className="flex-1 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 disabled:bg-gray-100 disabled:text-gray-400">{editId?'수정':'추가'}</button>
        </div>
      </div>
    </div>
  );
}

// ─── DEBT SECTION ────────────────────────────────────────────────────────────
function DebtSection() {
  const [items,  setItems]  = useState(MOCK_DEBTS_INIT);
  const [editId, setEditId] = useState(null);
  const [form,   setForm]   = useState({ name: '', balance: '', rate: '', monthly: '' });

  const handleEdit   = (item) => { setEditId(item.id); setForm({ name: item.name, balance: item.balance, rate: item.rate, monthly: item.monthly }); };
  const handleDelete = (id) => { setItems(prev => prev.filter(i => i.id !== id)); if (editId===id) { setEditId(null); setForm({name:'',balance:'',rate:'',monthly:''}); } };
  const handleSubmit = () => {
    if (!form.name || !form.balance) return;
    const parsed = { name: form.name, balance: parseInt(form.balance), rate: parseFloat(form.rate)||0, monthly: parseInt(form.monthly)||0 };
    if (editId) { setItems(prev => prev.map(i => i.id===editId ? {...i,...parsed} : i)); setEditId(null); }
    else setItems(prev => [...prev, { id: Date.now().toString(), ...parsed }]);
    setForm({name:'',balance:'',rate:'',monthly:''});
  };

  return (
    <div className="flex flex-1 gap-3 min-h-0 overflow-hidden">
      <div className="flex-1 min-w-0 bg-white rounded-xl shadow-sm p-4 flex flex-col min-h-0">
        <h3 className="text-sm font-bold text-gray-700 mb-3 shrink-0">부채 목록</h3>
        <div className="flex-1 min-h-0 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white"><tr className="text-xs text-gray-400 border-b border-gray-100">{['부채명','잔액','이자율','월 상환',''].map(h=><th key={h} className={`pb-2 font-medium ${h==='부채명'?'text-left':'text-right'}`}>{h}</th>)}</tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} onClick={()=>handleEdit(item)} className={`border-b border-gray-50 cursor-pointer group transition-colors ${editId===item.id?'bg-blue-50':'hover:bg-gray-50'}`}>
                  <td className="py-2.5 font-medium text-gray-800">{item.name}</td>
                  <td className="py-2.5 text-right text-red-500 font-medium">-{fmt(item.balance)}</td>
                  <td className="py-2.5 text-right text-gray-500 text-xs">{item.rate}%</td>
                  <td className="py-2.5 text-right text-gray-600">{fmt(item.monthly)}</td>
                  <td className="py-2.5 text-right"><button onClick={e=>{e.stopPropagation();handleDelete(item.id);}} className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 text-xs">✕</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="shrink-0 border-t border-gray-100 pt-2 mt-2 flex justify-between text-sm">
          <span className="text-gray-500">총 부채 / 월 상환</span>
          <span className="font-bold text-red-500">-{fmt(items.reduce((s,i)=>s+i.balance,0))} / {fmt(items.reduce((s,i)=>s+i.monthly,0))}</span>
        </div>
      </div>
      <div className="w-72 shrink-0 bg-white rounded-xl shadow-sm p-4 flex flex-col gap-3">
        <h3 className="text-sm font-bold text-gray-700">{editId ? '부채 수정' : '부채 추가'}</h3>
        {[['name','부채명','text'],['balance','잔액 (원)','number'],['rate','이자율 (%)','number'],['monthly','월 상환액 (원)','number']].map(([k,ph,t])=>(
          <input key={k} className={inp} type={t} placeholder={ph} value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} />
        ))}
        <div className="flex gap-2">
          {editId && <button onClick={()=>{setEditId(null);setForm({name:'',balance:'',rate:'',monthly:''});}} className="flex-1 py-2 border border-gray-200 text-gray-500 text-sm rounded-lg hover:bg-gray-50">취소</button>}
          <button onClick={handleSubmit} disabled={!form.name||!form.balance} className="flex-1 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 disabled:bg-gray-100 disabled:text-gray-400">{editId?'수정':'추가'}</button>
        </div>
      </div>
    </div>
  );
}

// ─── ASSET MANAGEMENT ────────────────────────────────────────────────────────
function AssetManagement() {
  const [assetTab, setAssetTab] = useState('주식');
  return (
    <div className="flex flex-1 flex-col min-h-0 overflow-hidden p-4 gap-3">
      <div className="flex gap-1 shrink-0">
        {ASSET_TABS.map(t => (
          <button key={t} onClick={() => setAssetTab(t)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${assetTab===t?'bg-gray-800 text-white':'text-gray-500 hover:bg-gray-100'}`}>{t}</button>
        ))}
      </div>
      {assetTab === '주식'    && <StocksSection  />}
      {assetTab === '적금'    && <SavingsSection />}
      {assetTab === '채권'    && <BondSection    />}
      {assetTab === '펀드'    && <FundSection    />}
      {assetTab === '예금/현금' && <DepositSection />}
      {assetTab === '부채'    && <DebtSection    />}
    </div>
  );
}

// ─── EXPENSE INPUT ───────────────────────────────────────────────────────────
function ExpenseInput() {
  const [expenses, setExpenses] = useState(MOCK_EXPENSES_INIT);
  const [form,     setForm]     = useState({ date: '', memo: '', amount: '' });
  const [editId,   setEditId]   = useState(null);

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const remaining = WEEKLY_BUDGET - total;

  const handleEdit   = (item) => { setEditId(item.id); setForm({ date: item.date, memo: item.memo, amount: item.amount }); };
  const handleDelete = (id)   => { setExpenses(prev => prev.filter(e => e.id !== id)); if (editId===id) { setEditId(null); setForm({date:'',memo:'',amount:''}); } };
  const handleSubmit = () => {
    if (!form.date || !form.amount) return;
    const parsed = { date: form.date, memo: form.memo, amount: parseInt(form.amount) };
    if (editId) { setExpenses(prev => prev.map(e => e.id===editId ? {...e,...parsed} : e)); setEditId(null); }
    else setExpenses(prev => [...prev, { id: Date.now().toString(), ...parsed }]);
    setForm({ date: '', memo: '', amount: '' });
  };

  return (
    <div className="flex flex-1 gap-4 p-4 overflow-hidden min-h-0">
      <div className="flex-1 min-w-0 flex flex-col gap-3 min-h-0">
        {/* 주간 예산 현황 */}
        <div className="bg-white rounded-xl shadow-sm p-4 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-700">💸 2026년 2월 4주차 지출</h3>
            <span className="text-xs text-gray-400">예산 {fmt(WEEKLY_BUDGET)}/주</span>
          </div>
          <div className="flex gap-6">
            <div><p className="text-xs text-gray-400">지출</p><p className="text-base font-bold text-red-500">{fmt(total)}</p></div>
            <div><p className="text-xs text-gray-400">남은 예산</p><p className={`text-base font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-500'}`}>{remaining >= 0 ? '' : '-'}{fmt(Math.abs(remaining))}{remaining < 0 ? ' ⚠️' : ''}</p></div>
          </div>
          <div className="mt-3 w-full bg-gray-100 rounded-full h-2">
            <div className={`h-2 rounded-full ${total > WEEKLY_BUDGET ? 'bg-red-400' : 'bg-blue-400'}`} style={{ width: `${Math.min(total/WEEKLY_BUDGET*100, 100)}%` }} />
          </div>
        </div>
        {/* 지출 내역 */}
        <div className="bg-white rounded-xl shadow-sm p-4 flex-1 min-h-0 flex flex-col">
          <h3 className="text-sm font-bold text-gray-700 mb-3 shrink-0">지출 내역</h3>
          <div className="flex-1 min-h-0 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white"><tr className="text-xs text-gray-400 border-b border-gray-100">{['날짜','메모','금액',''].map(h=><th key={h} className={`pb-2 font-medium ${h==='날짜'||h==='메모'?'text-left':'text-right'}`}>{h}</th>)}</tr></thead>
              <tbody>
                {[...expenses].sort((a,b)=>a.date.localeCompare(b.date)).map(item => (
                  <tr key={item.id} onClick={()=>handleEdit(item)} className={`border-b border-gray-50 cursor-pointer group transition-colors ${editId===item.id?'bg-blue-50':'hover:bg-gray-50'}`}>
                    <td className="py-2.5 text-gray-500 text-xs w-24">{item.date}</td>
                    <td className="py-2.5 text-gray-700">{item.memo || <span className="text-gray-300">-</span>}</td>
                    <td className="py-2.5 text-right font-medium text-gray-800">{item.amount.toLocaleString()}원</td>
                    <td className="py-2.5 text-right"><button onClick={e=>{e.stopPropagation();handleDelete(item.id);}} className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 text-xs">✕</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="shrink-0 border-t border-gray-100 pt-2 mt-2 flex justify-between text-sm">
            <span className="text-gray-500">주간 총 지출</span>
            <span className="font-bold text-gray-800">{fmt(total)}</span>
          </div>
        </div>
      </div>
      {/* 추가 폼 */}
      <div className="w-72 shrink-0 bg-white rounded-xl shadow-sm p-4 flex flex-col gap-3">
        <h3 className="text-sm font-bold text-gray-700">{editId ? '지출 수정' : '지출 추가'}</h3>
        <div className="flex flex-col gap-1.5"><label className="text-xs text-gray-400">날짜</label><input className={inp} type="date" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))} /></div>
        <div className="flex flex-col gap-1.5"><label className="text-xs text-gray-400">메모 (선택)</label><input className={inp} placeholder="점심, 교통비..." value={form.memo} onChange={e=>setForm(p=>({...p,memo:e.target.value}))} /></div>
        <div className="flex flex-col gap-1.5"><label className="text-xs text-gray-400">금액 (원)</label><input className={inp} type="number" placeholder="0" value={form.amount} onChange={e=>setForm(p=>({...p,amount:e.target.value}))} onKeyDown={e=>e.key==='Enter'&&handleSubmit()} /></div>
        <div className="flex gap-2 mt-1">
          {editId && <button onClick={()=>{setEditId(null);setForm({date:'',memo:'',amount:''});}} className="flex-1 py-2 border border-gray-200 text-gray-500 text-sm rounded-lg hover:bg-gray-50">취소</button>}
          <button onClick={handleSubmit} disabled={!form.date||!form.amount} className="flex-1 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 disabled:bg-gray-100 disabled:text-gray-400">{editId?'수정':'추가'}</button>
        </div>
      </div>
    </div>
  );
}

// ─── FIXED COSTS ─────────────────────────────────────────────────────────────
function FixedCosts() {
  const [items,  setItems]  = useState(MOCK_FIXED_INIT);
  const [editId, setEditId] = useState(null);
  const [form,   setForm]   = useState({ name: '', amount: '', day: '', method: '자동이체' });

  const handleEdit   = (item) => { setEditId(item.id); setForm({ name: item.name, amount: item.amount, day: item.day, method: item.method }); };
  const handleDelete = (id)   => { setItems(prev => prev.filter(i => i.id !== id)); if (editId===id) { setEditId(null); setForm({name:'',amount:'',day:'',method:'자동이체'}); } };
  const handleSubmit = () => {
    if (!form.name || !form.amount) return;
    const parsed = { name: form.name, amount: parseInt(form.amount), day: parseInt(form.day)||1, method: form.method };
    if (editId) { setItems(prev => prev.map(i => i.id===editId ? {...i,...parsed} : i)); setEditId(null); }
    else setItems(prev => [...prev, { id: Date.now().toString(), ...parsed }]);
    setForm({name:'',amount:'',day:'',method:'자동이체'});
  };

  const total = items.reduce((s, i) => s + i.amount, 0);

  return (
    <div className="flex flex-1 gap-4 p-4 overflow-hidden min-h-0">
      <div className="flex-1 min-w-0 bg-white rounded-xl shadow-sm p-4 flex flex-col min-h-0">
        <h3 className="text-sm font-bold text-gray-700 mb-3 shrink-0">🔄 고정비 목록</h3>
        <div className="flex-1 min-h-0 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white"><tr className="text-xs text-gray-400 border-b border-gray-100">{['항목','금액','결제일','결제수단',''].map(h=><th key={h} className={`pb-2 font-medium ${h==='항목'?'text-left':'text-right'}`}>{h}</th>)}</tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} onClick={()=>handleEdit(item)} className={`border-b border-gray-50 cursor-pointer group transition-colors ${editId===item.id?'bg-blue-50':'hover:bg-gray-50'}`}>
                  <td className="py-2.5 font-medium text-gray-800">{item.name}</td>
                  <td className="py-2.5 text-right font-medium text-gray-800">{fmt(item.amount)}</td>
                  <td className="py-2.5 text-right text-gray-500 text-xs">매월 {item.day}일</td>
                  <td className="py-2.5 text-right text-gray-500 text-xs">{item.method}</td>
                  <td className="py-2.5 text-right"><button onClick={e=>{e.stopPropagation();handleDelete(item.id);}} className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 text-xs">✕</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="shrink-0 border-t border-gray-100 pt-2 mt-2 flex justify-between text-sm">
          <span className="text-gray-500">월 고정비 합계</span>
          <span className="font-bold text-gray-800">{fmt(total)}</span>
        </div>
      </div>
      <div className="w-72 shrink-0 bg-white rounded-xl shadow-sm p-4 flex flex-col gap-3">
        <h3 className="text-sm font-bold text-gray-700">{editId ? '고정비 수정' : '고정비 추가'}</h3>
        {[['name','항목명','text'],['amount','금액 (원)','number'],['day','결제일 (일)','number']].map(([k,ph,t])=>(
          <input key={k} className={inp} type={t} placeholder={ph} value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} />
        ))}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-gray-400">결제수단</label>
          <select className={inp} value={form.method} onChange={e=>setForm(p=>({...p,method:e.target.value}))}>
            {METHODS.map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          {editId && <button onClick={()=>{setEditId(null);setForm({name:'',amount:'',day:'',method:'자동이체'});}} className="flex-1 py-2 border border-gray-200 text-gray-500 text-sm rounded-lg hover:bg-gray-50">취소</button>}
          <button onClick={handleSubmit} disabled={!form.name||!form.amount} className="flex-1 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 disabled:bg-gray-100 disabled:text-gray-400">{editId?'수정':'추가'}</button>
        </div>
      </div>
    </div>
  );
}

// ─── STATISTICS ──────────────────────────────────────────────────────────────
function FinanceStats() {
  return (
    <div className="flex flex-1 gap-4 p-4 overflow-hidden min-h-0">
      <div className="flex-1 min-w-0 flex flex-col gap-3 min-h-0">
        <div className="bg-white rounded-xl shadow-sm p-4 flex-1 min-h-0 flex flex-col">
          <h3 className="text-sm font-bold text-gray-700 mb-3 shrink-0">📈 순자산 증가 추이 (만원)</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_ASSET_TREND} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                <Tooltip formatter={(v) => `${v}만원`} />
                <Line type="monotone" dataKey="net" stroke="#6366f1" strokeWidth={2} dot={{ r: 4, fill: '#6366f1' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="flex-1 min-w-0 flex flex-col gap-3 min-h-0">
        <div className="bg-white rounded-xl shadow-sm p-4 flex-1 min-h-0 flex flex-col">
          <h3 className="text-sm font-bold text-gray-700 mb-3 shrink-0">💰 월별 저축률 (%)</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_SAVINGS_RATE} margin={{ top: 8, right: 16, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip formatter={(v) => `${v}%`} />
                <Bar dataKey="rate" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 shrink-0">
          <h3 className="text-sm font-bold text-gray-700 mb-3">연도별 순자산 증감</h3>
          <div className="flex flex-col gap-2">
            {[['2024', '+580만원', 'text-green-600'], ['2025', '+720만원', 'text-green-600'], ['2026', '+70만원 (진행중)', 'text-blue-500']].map(([year, val, cls]) => (
              <div key={year} className="flex justify-between items-center py-1.5 border-b border-gray-50">
                <span className="text-sm text-gray-600">{year}년</span>
                <span className={`text-sm font-bold ${cls}`}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── GOALS ───────────────────────────────────────────────────────────────────
function FinanceGoals() {
  const [goals,    setGoals]    = useState(MOCK_GOALS_INIT);
  const [yearInp,  setYearInp]  = useState(goals.yearGoal.toString());
  const [yearSaved, setYearSaved] = useState(false);

  const totalActual  = goals.months.reduce((s, m) => s + (m.actual || 0), 0);
  const yearGoalPct  = Math.round((totalActual / goals.yearGoal) * 100);

  const handleSaveYear = () => {
    setGoals(p => ({ ...p, yearGoal: parseInt(yearInp) || p.yearGoal }));
    setYearSaved(true);
    setTimeout(() => setYearSaved(false), 2000);
  };

  const handleTargetChange = (monthIdx, val) => {
    setGoals(p => ({ ...p, months: p.months.map((m, i) => i === monthIdx ? { ...m, target: parseInt(val) || 0 } : m) }));
  };

  return (
    <div className="flex flex-1 gap-4 p-4 overflow-hidden min-h-0">
      <div className="flex-1 min-w-0 flex flex-col gap-3 min-h-0 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-sm p-4 shrink-0">
          <h3 className="text-sm font-bold text-gray-700 mb-3">🎯 2026년 저축 목표</h3>
          <div className="flex gap-3 items-center mb-3">
            <input className={`${inp} w-48`} type="number" value={yearInp} onChange={e => setYearInp(e.target.value)} />
            {yearSaved && <span className="text-xs text-green-500">저장됨</span>}
            <button onClick={handleSaveYear} className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600">저장</button>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>현재 {fmt(totalActual)} 달성</span><span>목표 {fmt(goals.yearGoal)}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 mb-1">
            <div className="h-2.5 bg-blue-500 rounded-full" style={{ width: `${Math.min(yearGoalPct, 100)}%` }} />
          </div>
          <span className="text-xs text-blue-500 font-medium">{yearGoalPct}% 달성</span>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-sm font-bold text-gray-700 mb-3">월별 저축 목표 / 달성</h3>
          <table className="w-full text-sm">
            <thead><tr className="text-xs text-gray-400 border-b border-gray-100">{['월','목표','달성','달성률'].map(h=><th key={h} className={`pb-2 font-medium ${h==='월'?'text-left':'text-right'}`}>{h}</th>)}</tr></thead>
            <tbody>
              {goals.months.map((m, i) => {
                const pct = m.actual != null ? Math.round((m.actual / m.target) * 100) : null;
                return (
                  <tr key={m.month} className="border-b border-gray-50">
                    <td className="py-2 text-gray-700 font-medium">{m.month}월</td>
                    <td className="py-2 text-right">
                      <input type="number" className="w-28 text-right text-sm border border-gray-200 rounded px-2 py-0.5 focus:outline-none focus:border-blue-300" value={m.target} onChange={e => handleTargetChange(i, e.target.value)} />
                    </td>
                    <td className="py-2 text-right text-gray-600">{m.actual != null ? fmt(m.actual) : <span className="text-gray-300">-</span>}</td>
                    <td className={`py-2 text-right font-medium ${pct == null ? 'text-gray-300' : pct >= 100 ? 'text-green-600' : pct >= 50 ? 'text-orange-500' : 'text-red-500'}`}>
                      {pct != null ? `${pct}%` : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── FINANCE MAIN ────────────────────────────────────────────────────────────
function FinanceMain() {
  const [tab, setTab] = useState('대시보드');
  return (
    <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
      <div className="bg-white border-b border-gray-100 px-4 flex gap-1 shrink-0">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 ${tab===t ? 'text-blue-600 border-blue-500' : 'text-gray-400 border-transparent hover:text-gray-600'}`}>{t}</button>
        ))}
      </div>
      {tab === '대시보드'  && <Dashboard />}
      {tab === '자산 관리' && <AssetManagement />}
      {tab === '지출 입력' && <ExpenseInput />}
      {tab === '고정비'    && <FixedCosts />}
      {tab === '통계'      && <FinanceStats />}
      {tab === '목표'      && <FinanceGoals />}
    </div>
  );
}

export default FinanceMain;
