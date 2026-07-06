import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Cpu, 
  FolderGit2, 
  Briefcase,
  Award, 
  Trophy, 
  Image, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  LogOut,
  Code
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import ThemeToggle from '../common/ThemeToggle';

const ADMIN_ITEMS = [
  { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" />, exact: true },
  { name: 'Skills', path: '/admin/skills', icon: <Cpu className="w-5 h-5" /> },
  { name: 'Projects', path: '/admin/projects', icon: <FolderGit2 className="w-5 h-5" /> },
  { name: 'Experiences', path: '/admin/experiences', icon: <Briefcase className="w-5 h-5" /> },
  { name: 'Certificates', path: '/admin/certificates', icon: <Award className="w-5 h-5" /> },
  { name: 'Achievements', path: '/admin/achievements', icon: <Trophy className="w-5 h-5" /> },
  { name: 'Media Uploads', path: '/admin/media', icon: <Image className="w-5 h-5" /> },
  { name: 'Messages', path: '/admin/messages', icon: <MessageSquare className="w-5 h-5" />, badge: true },
  { name: 'Analytics', path: '/admin/analytics', icon: <BarChart3 className="w-5 h-5" /> },
  { name: 'Settings', path: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
];

export const Sidebar = ({ unreadCount = 0 }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      await logout();
      navigate('/admin/login');
    }
  };

  return (
    <aside className="w-16 md:w-60 bg-slate-900 text-slate-400 flex flex-col h-screen fixed top-0 left-0 border-r border-slate-800 z-30 transition-colors duration-300">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-slate-800">
        <div className="flex items-center gap-2 text-white font-bold text-lg">
          <Code className="w-6 h-6 text-indigo-400" />
          <span className="hidden md:inline">AdminPanel</span>
        </div>
        <ThemeToggle />
      </div>

      {/* Nav Menu */}
      <nav className="flex-grow p-2.5 md:p-4 space-y-1.5 overflow-y-auto">
        {ADMIN_ITEMS.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.exact}
            className={({ isActive }) =>
              `flex items-center md:justify-between justify-center px-2.5 md:px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                  : 'hover:bg-slate-800 hover:text-slate-200'
              }`
            }
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span className="hidden md:inline">{item.name}</span>
            </div>
            {item.badge && unreadCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse hidden md:inline">
                {unreadCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center md:justify-start justify-center gap-3 px-2.5 md:px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-950/35 hover:text-red-400 transition-colors"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </aside>
  );
};
export default Sidebar;
