# DB 구조 및 기술 스택

## 기술 스택

### Frontend
- **React** (PC 전용)
- **React Router** (페이지 라우팅)
- **CSS Framework**: Tailwind CSS 또는 Material-UI (선택)
- **마크다운 에디터**: react-markdown 또는 react-simplemde-editor
- **차트**: Chart.js 또는 Recharts

### Backend & Database
- **Firebase**
  - Firestore (NoSQL Database)
  - Authentication (Google 로그인 또는 이메일/비밀번호)
  - Hosting (배포)
  - Storage (이미지 업로드 시 사용)

### 배포
- GitHub Pages 또는 Firebase Hosting
- GitHub Actions (자동 배포)

---

## Firebase Firestore DB 구조

```
users/
  └─ {userId}/
      ├─ settings/
      │   ├─ totalVacation: 15 (총연차)
      │   ├─ yearlyGoal: 12000000 (연간 저축 목표)
      │   └─ monthlyGoals/
      │       ├─ 2026-01: 1000000
      │       ├─ 2026-02: 1000000
      │       └─ ...
      │
      ├─ calendar/
      │   ├─ 2026-02-01/
      │   │   ├─ vacation: "full" | "half" | "quarter" | null
      │   │   ├─ diary: "오늘은..."
      │   │   └─ createdAt: timestamp
      │   ├─ 2026-02-03/
      │   └─ ...
      │
      ├─ todos/
      │   ├─ {todoId}/
      │   │   ├─ title: "보고서 작성"
      │   │   ├─ deadline: "2026-02-05"
      │   │   ├─ category: "work" | "personal"
      │   │   ├─ urgent: true | false (긴급)
      │   │   ├─ completed: false
      │   │   ├─ createdDate: "2026-02-03" (등록한 날짜)
      │   │   └─ createdAt: timestamp
      │   └─ ...
      │
      ├─ yearGoals/
      │   ├─ 2026/
      │   │   ├─ yearGoal: "# 2026년 목표\n- ..."
      │   │   └─ monthGoals/
      │   │       ├─ 1: "# 1월 목표\n- ..."
      │   │       ├─ 2: "# 2월 목표\n- ..."
      │   │       └─ ...
      │   ├─ 2025/
      │   └─ ...
      │
      ├─ finance/
      │   ├─ assets/
      │   │   ├─ stock/
      │   │   │   ├─ {stockId}/
      │   │   │   │   ├─ name: "삼성전자"
      │   │   │   │   ├─ currentPrice: 72000 (수동 입력)
      │   │   │   │   ├─ lastUpdated: "2026-02-25"
      │   │   │   │   └─ purchases/
      │   │   │   │       ├─ {purchaseId}/
      │   │   │   │       │   ├─ date: "2026-02-01"
      │   │   │   │       │   ├─ quantity: 10
      │   │   │   │       │   └─ price: 60000
      │   │   │   │       └─ ...
      │   │   │   └─ ...
      │   │   │
      │   │   ├─ savings/ (적금)
      │   │   │   ├─ {savingsId}/
      │   │   │   │   ├─ name: "OO은행 정기적금"
      │   │   │   │   ├─ monthlyDeposit: 500000
      │   │   │   │   ├─ interestRate: 3.5
      │   │   │   │   ├─ period: 24 (개월)
      │   │   │   │   ├─ currentMonth: 12
      │   │   │   │   └─ expectedAmount: 12500000
      │   │   │   └─ ...
      │   │   │
      │   │   ├─ bonds/ (채권)
      │   │   │   ├─ {bondId}/
      │   │   │   │   ├─ name: "국고채 3년"
      │   │   │   │   ├─ investment: 5000000
      │   │   │   │   ├─ maturityDate: "2027-03-01"
      │   │   │   │   ├─ interestRate: 3.2
      │   │   │   │   └─ maturityAmount: 5480000
      │   │   │   └─ ...
      │   │   │
      │   │   ├─ funds/ (펀드)
      │   │   │   ├─ {fundId}/
      │   │   │   │   ├─ name: "글로벌주식펀드"
      │   │   │   │   ├─ investment: 3000000
      │   │   │   │   ├─ currentValue: 3380000 (수동)
      │   │   │   │   └─ lastUpdated: "2026-02-25"
      │   │   │   └─ ...
      │   │   │
      │   │   ├─ cash/ (현금/예금)
      │   │   │   ├─ {cashId}/
      │   │   │   │   ├─ name: "주거래은행"
      │   │   │   │   ├─ amount: 5000000
      │   │   │   │   └─ interestRate: 0.1
      │   │   │   └─ ...
      │   │   │
      │   │   └─ emergency/ (비상금)
      │   │       └─ amount: 2000000
      │   │
      │   ├─ debts/ (부채)
      │   │   ├─ {debtId}/
      │   │   │   ├─ name: "학자금대출"
      │   │   │   ├─ balance: 2000000
      │   │   │   ├─ interestRate: 2.5
      │   │   │   └─ monthlyPayment: 100000
      │   │   └─ ...
      │   │
      │   ├─ fixedExpenses/ (고정비)
      │   │   ├─ {expenseId}/
      │   │   │   ├─ name: "월세"
      │   │   │   ├─ amount: 1000000
      │   │   │   ├─ day: 1 (매월 1일)
      │   │   │   └─ paymentMethod: "자동이체" | "카드A" | "카드B"
      │   │   └─ ...
      │   │
      │   ├─ weeklyExpenses/ (주별 지출)
      │   │   ├─ 2026-02-W1/ (2월 1주차)
      │   │   │   ├─ budget: 700000
      │   │   │   ├─ expenses/
      │   │   │   │   ├─ {expenseId}/
      │   │   │   │   │   ├─ date: "2026-02-01"
      │   │   │   │   │   ├─ memo: "점심/커피" (선택)
      │   │   │   │   │   └─ amount: 20000
      │   │   │   │   └─ ...
      │   │   │   └─ total: 650000 (자동 계산)
      │   │   ├─ 2026-02-W2/
      │   │   └─ ...
      │   │
      │   └─ monthlyStats/ (월별 통계 - 자동 계산)
      │       ├─ 2026-01/
      │       │   ├─ income: 3500000
      │       │   ├─ expense: 2500000
      │       │   ├─ savings: 1000000
      │       │   └─ savingsRate: 28.6
      │       ├─ 2026-02/
      │       └─ ...
      │
      └─ profile/
          ├─ name: "jiseonMin"
          ├─ email: "user@example.com"
          └─ createdAt: timestamp
```

---

## 데이터 계산 로직

### 1. 연차 계산
```javascript
// 사용연차 자동 계산
usedVacation = 
  (연차 개수 × 1) + 
  (반차 개수 × 0.5) + 
  (반반차 개수 × 0.25)

// 남은연차
remainingVacation = totalVacation - usedVacation
```

### 2. 할일 D-day 계산
```javascript
// D-day 계산
const today = new Date()
const deadline = new Date(todo.deadline)
const dday = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24))
// D-2, D-5 등으로 표시
```

### 3. 주식 평단가 계산
```javascript
// 평균 매수가 계산
const totalAmount = purchases.reduce((sum, p) => sum + (p.quantity × p.price), 0)
const totalQuantity = purchases.reduce((sum, p) => sum + p.quantity, 0)
const avgPrice = totalAmount / totalQuantity

// 수익률 계산
const currentValue = totalQuantity × currentPrice
const profit = currentValue - totalAmount
const profitRate = (profit / totalAmount) × 100
```

### 4. 주별 예산 계산
```javascript
// 고정비 제외한 월별 변동비
const monthlyVariable = monthlyBudget - fixedExpensesTotal

// 주별 예산 (4주로 나눔)
const weeklyBudget = monthlyVariable / 4

// 남은 예산
const remaining = weeklyBudget - weeklyTotal
```

### 5. 순자산 계산
```javascript
// 총 자산
const totalAssets = 
  stockTotal + 
  savingsTotal + 
  bondsTotal + 
  fundsTotal + 
  cashTotal + 
  emergencyFund + 
  deposit

// 순자산
const netWorth = totalAssets - totalDebts
```

---

## 인덱싱 및 쿼리 최적화

### Firestore 인덱스 필요 쿼리

1. **할일 조회** (미완료 + D-day 순)
```
Collection: todos
Fields: completed (Ascending), deadline (Ascending)
```

2. **카테고리별 할일**
```
Collection: todos
Fields: category (Ascending), deadline (Ascending)
```

3. **주별 지출 조회**
```
Collection: weeklyExpenses
Fields: userId, date (Descending)
```

---

## 보안 규칙 (Firestore Security Rules)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 사용자는 자신의 데이터만 읽기/쓰기 가능
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 폴더 구조 (React)

```
my-life-dashboard/
├─ public/
├─ src/
│   ├─ components/
│   │   ├─ common/
│   │   │   ├─ Navbar.jsx
│   │   │   ├─ Loading.jsx
│   │   │   └─ ErrorBoundary.jsx
│   │   ├─ diary/
│   │   │   ├─ Calendar.jsx
│   │   │   ├─ TodoList.jsx
│   │   │   ├─ DayDetail.jsx
│   │   │   └─ YearGoals.jsx
│   │   ├─ finance/
│   │   │   ├─ Dashboard.jsx
│   │   │   ├─ AssetChart.jsx
│   │   │   ├─ StockDetail.jsx
│   │   │   ├─ WeeklyExpense.jsx
│   │   │   └─ Statistics.jsx
│   │   └─ portfolio/
│   │       └─ ...
│   ├─ pages/
│   │   ├─ DiaryMain.jsx
│   │   ├─ FinanceMain.jsx
│   │   ├─ PortfolioMain.jsx
│   │   └─ Settings.jsx
│   ├─ services/
│   │   ├─ firebase.js (Firebase 설정)
│   │   ├─ auth.js
│   │   ├─ diaryService.js
│   │   └─ financeService.js
│   ├─ hooks/
│   │   ├─ useTodos.js
│   │   ├─ useAssets.js
│   │   └─ useAuth.js
│   ├─ utils/
│   │   ├─ dateUtils.js
│   │   ├─ calculators.js (평단가, D-day 등)
│   │   └─ formatters.js
│   ├─ App.jsx
│   └─ index.js
├─ .gitignore
├─ package.json
└─ README.md
```

---

## 개발 우선순위

### Phase 1 - MVP (다이어리)
1. Firebase 설정 및 인증
2. 메인 달력 화면
3. 날짜 상세 페이지 (휴가, 할일, 일기)
4. 전체 할일 페이지
5. 연도별 목표 페이지

### Phase 2 - 돈관리
1. 메인 대시보드 (자산 현황)
2. 자산별 세부 페이지
3. 주별 지출 입력
4. 고정비 설정
5. 통계/목표

### Phase 3 - 포트폴리오
(추후 구상)

### Phase 4 - 최적화
- 성능 개선
- UI/UX 다듬기
- 에러 핸들링
- 데이터 백업/복원

---

## 환경 변수 (.env)

```
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

---

## Git 브랜치 전략

```
main (배포용)
└─ develop (개발용)
    ├─ feature/diary
    ├─ feature/finance
    └─ feature/portfolio
```

---

## 배포 자동화 (GitHub Actions)

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          channelId: live
```
