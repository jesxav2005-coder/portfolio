import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, X, Code2 } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const NAV_ITEMS = [
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Experiences', href: '#experience' },
  { name: 'Education', href: '#education' },
  { name: 'Projects', href: '#projects' },
  { name: 'Certificates', href: '#certificates' },
  { name: 'Achievements', href: '#achievements' },
  { name: 'Contact', href: '#contact' },
];

export const Navbar = ({ profile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (!isAdminPage) {
        const scrollPosition = window.scrollY + 200; // Offset for navbar height
        for (const item of NAV_ITEMS) {
          const el = document.querySelector(item.href);
          if (el) {
            const top = el.offsetTop;
            const height = el.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
              setActiveSection(item.href);
              break;
            }
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once initially

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAdminPage]);

  const closeMenu = () => setIsOpen(false);

  // Helper to scroll to element
  const handleScrollToSection = (e, id) => {
    closeMenu();
    if (isAdminPage) return; // Allow normal anchor click if not on home page

    e.preventDefault();
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Update URL hash
      window.history.pushState(null, '', id);
    }
  };

  const getNavLinkClass = (itemHref) => {
    const isActive = activeSection === itemHref;
    return `text-sm lg:text-base xl:text-lg font-semibold transition-all duration-250 pb-1 border-b-2 ${
      isActive 
        ? 'text-indigo-600 border-indigo-600 dark:text-violet-500 dark:border-transparent' 
        : 'text-slate-400 border-transparent hover:text-indigo-600 dark:hover:text-violet-500'
    }`;
  };

  const getMobileNavLinkClass = (itemHref) => {
    const isActive = activeSection === itemHref;
    return `block px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
      isActive 
        ? 'text-indigo-600 bg-indigo-50 dark:bg-slate-800/30 dark:text-violet-500' 
        : 'text-slate-400 hover:text-indigo-600 dark:hover:text-violet-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
    }`;
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        isScrolled ? 'scrolled py-3' : 'py-5'
      }`}
    >
      <div className="max-w-7xl lg:max-w-[85vw] xl:max-w-[80vw] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12 lg:h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link 
              to="/" 
              onClick={(e) => {
                if (!isAdminPage) {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  window.history.pushState(null, '', '/');
                }
              }}
              className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-xl lg:text-2xl xl:text-3xl tracking-tight"
            >
              <Code2 className="w-6 h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 animate-pulse" />
              <span>{profile?.full_name ? `${profile.full_name.split(' ')[0]}.dev` : 'Portfolio'}</span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          {!isAdminPage && (
            <div className="hidden md:flex items-center space-x-8 lg:space-x-10 xl:space-x-12">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleScrollToSection(e, item.href)}
                  className={getNavLinkClass(item.href)}
                >
                  {item.name}
                </a>
              ))}
            </div>
          )}

          {/* Right Side Toggles & Actions */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <ThemeToggle />
            {isAdminPage ? (
              <Link
                to="/"
                className="text-xs lg:text-sm xl:text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 shadow-sm hover:shadow-[0_4px_16px_rgba(30,64,175,0.15)] dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-violet-500 dark:hover:text-slate-950 dark:hover:shadow-[0_0_12px_rgba(15,240,252,0.5)] px-4 py-2 lg:px-6 lg:py-3 rounded-lg"
              >
                View Portfolio
              </Link>
            ) : (
              <Link
                to="/admin"
                className="text-xs lg:text-sm xl:text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 shadow-sm hover:shadow-[0_4px_16px_rgba(30,64,175,0.15)] dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-violet-500 dark:hover:text-slate-950 dark:hover:shadow-[0_0_12px_rgba(15,240,252,0.5)] px-4 py-2 lg:px-6 lg:py-3 rounded-lg"
              >
                Admin Panel
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            {!isAdminPage && (
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Toggle Menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Slide-down */}
      {isOpen && !isAdminPage && (
        <div className="md:hidden bg-white border-b border-slate-200 dark:bg-[#0A0A0F] dark:border-slate-800 animate-fadeIn">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleScrollToSection(e, item.href)}
                className={getMobileNavLinkClass(item.href)}
              >
                {item.name}
              </a>
            ))}
            <div className="pt-2 px-3">
              <Link
                to="/admin"
                onClick={closeMenu}
                className="w-full block text-center text-sm font-semibold text-white bg-indigo-600 neon-glow px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow-sm hover:shadow-[0_4px_16px_rgba(30,64,175,0.15)] dark:bg-indigo-500 dark:hover:bg-violet-500 dark:hover:text-slate-950 dark:hover:shadow-[0_0_12px_rgba(15,240,252,0.5)]"
              >
                Admin Panel
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
export default Navbar;
