import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/',        label: '달력',      icon: '📅' },
  { to: '/todos',   label: '전체 할일', icon: '✓'  },
  { to: '/goals',   label: '연도 목표', icon: '📋' },
  { to: '/finance', label: '돈관리',    icon: '💰' },
  { to: '/settings',label: '설정',      icon: '⚙️' },
];

function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 h-12 flex items-center gap-1 shrink-0">
      <span className="font-bold text-gray-800 mr-4">My Dashboard</span>
      {navItems.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`
          }
        >
          <span>{icon}</span>
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default Navbar;
