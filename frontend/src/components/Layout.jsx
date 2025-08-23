import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  HeartHandshake, 
  Settings, 
  ClipboardList, 
  Users, 
  User,
  ChevronDown,
  Search,
  Bell,
  Menu,
  X,
  LogOut,
  Settings as SettingsIcon
} from 'lucide-react'
import { getProfileData } from '../utils/storage'

const Layout = ({ user, onLogout, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState({
    projects: false,
    tasks: false
  })
  const location = useLocation()
  const profileDropdownRef = useRef(null)
  
  // Get profile data state
  const [profileData, setProfileData] = useState(() => getProfileData())

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Proposal', href: '/proposals', icon:HeartHandshake },
    { 
      name: 'Projects & Jobs', 
      href: '/projects', 
      icon: Settings,
      hasDropdown: true,
      key: 'projects'
    },
    { 
      name: 'Tasks', 
      href: '/tasks', 
      icon: ClipboardList,
      hasDropdown: true,
      key: 'tasks'
    },
    { name: 'Client / Supplier', href: '/clients', icon: Users },
    { name: 'User / Employee', href: '/employees', icon: Users },
    { name: 'Profile', href: '/profile', icon: User },
  ]

  const toggleMenu = (key) => {
    setExpandedMenus(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(prev => !prev)
  }

  const handleLogout = () => {
    setProfileDropdownOpen(false)
    onLogout()
  }

  const isActive = (href) => location.pathname === href

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Close sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  // Force re-render when profile data changes
  useEffect(() => {
    const handleStorageChange = () => {
      // Update profile data state to force re-render
      setProfileData(getProfileData())
      setProfileDropdownOpen(false)
    }

    // Listen for storage events
    window.addEventListener('storage', handleStorageChange)
    
    // Also check periodically for changes
    const interval = setInterval(() => {
      const currentProfileData = getProfileData()
      if (currentProfileData && (
        currentProfileData.name !== profileData?.name || 
        currentProfileData.email !== profileData?.email
      )) {
        setProfileData(currentProfileData)
      }
    }, 2000)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [profileData])

  return (
    <div className="min-h-screen bg-secondary-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:relative lg:inset-0 lg:flex-shrink-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-secondary-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">CC</span>
            </div>
            <div>
              <div className="text-primary-600 font-semibold">ClientCore</div>
              {/* <div className="text-secondary-600 text-sm">Professional CRM System</div> */}
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md text-secondary-400 hover:text-secondary-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.hasDropdown ? (
                  <div>
                    <button
                      onClick={() => toggleMenu(item.key)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        isActive(item.href)
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                        expandedMenus[item.key] ? 'rotate-180' : ''
                      }`} />
                    </button>
                    {expandedMenus[item.key] && (
                      <div className="ml-8 mt-1 space-y-1">
                        <Link
                          to={item.href}
                          className="block px-3 py-2 text-sm text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg"
                        >
                          View All
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-secondary-200">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-secondary-400 hover:text-secondary-600"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex-1 max-w-lg mx-4 lg:mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-secondary-400 hover:text-secondary-600">
                <Bell className="w-5 h-5" />
              </button>
              
              {/* Profile Dropdown */}
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={toggleProfileDropdown}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-secondary-100 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold text-sm">
                      {profileData?.name?.charAt(0) || user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-secondary-900">{profileData?.name || user?.name || 'User'}</div>
                    <div className="text-xs text-secondary-500">{profileData?.email || user?.email || 'user@example.com'}</div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-secondary-400 transition-transform duration-200 ${
                    profileDropdownOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {/* Profile Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-secondary-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-secondary-200">
                      <div className="text-sm font-medium text-secondary-900">{profileData?.name || user?.name || 'User'}</div>
                      <div className="text-xs text-secondary-500">{profileData?.email || user?.email || 'user@example.com'}</div>
                    </div>
                    
                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100 transition-colors duration-200"
                    >
                      <User className="w-4 h-4 mr-3" />
                      View Profile
                    </Link>
                    
                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100 transition-colors duration-200"
                    >
                      <SettingsIcon className="w-4 h-4 mr-3" />
                      Settings
                    </Link>
                    
                    <div className="border-t border-secondary-200 my-1"></div>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout