import { useState, useRef, useEffect } from 'react'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Shield, 
  Camera,
  Edit,
  Save,
  X,
  Key,
  Bell,
  Globe,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { 
  saveProfileData, 
  saveProfilePicture, 
  removeProfilePicture,
  saveNotifications 
} from '../utils/storage'

const Profile = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user?.name || 'User',
    email: user?.email || 'user@example.com',
    phone: '',
    address: '',
    company: 'ClientCore',
    role: user?.role || 'User',
    bio: '',
    timezone: 'UTC-5 (Eastern Time)',
    language: 'English'
  })

  // Handle user changes and load/save profile data
  useEffect(() => {
    if (user) {
      console.log('Profile: User changed to:', user)
      
      // Check if profile data exists for this user
      const savedProfile = localStorage.getItem('clientcore_profile_data')
      
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile)
        // If saved profile matches current user, use it
        if (parsed.email === user.email) {
          console.log('Profile: Loading existing profile data for user:', user.email)
          setProfileData(parsed)
        } else {
          // Different user, clear old data and create new profile
          console.log('Profile: Different user detected, creating new profile')
          localStorage.removeItem('clientcore_profile_data')
          localStorage.removeItem('clientcore_profile_picture')
          
          const newProfileData = {
            name: user.name || 'User',
            email: user.email || 'user@example.com',
            phone: '',
            address: '',
            company: 'ClientCore',
            role: user?.role || 'User',
            bio: '',
            timezone: 'UTC-5 (Eastern Time)',
            language: 'English'
          }
          setProfileData(newProfileData)
          saveProfileData(newProfileData)
        }
      } else {
        // No profile data exists, create new one for current user
        console.log('Profile: Creating new profile data for user:', user.email)
        const newProfileData = {
          name: user.name || 'User',
          email: user.email || 'user@example.com',
          phone: '',
          address: '',
          company: 'ClientCore',
          role: user?.role || 'User',
          bio: '',
          timezone: 'UTC-5 (Eastern Time)',
          language: 'English'
        }
        setProfileData(newProfileData)
        saveProfileData(newProfileData)
      }
    } else {
      // User is null, reset profile data
      console.log('Profile: User is null, resetting profile data')
      setProfileData({
        name: 'User',
        email: 'user@example.com',
        phone: '',
        address: '',
        company: 'ClientCore',
        role: 'User',
        bio: '',
        timezone: 'UTC-5 (Eastern Time)',
        language: 'English'
      })
    }
  }, [user])

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  const fileInputRef = useRef(null)
  const passwordModalRef = useRef(null)

  const [notifications, setNotifications] = useState(() => {
    const savedNotifications = localStorage.getItem('clientcore_notifications')
    if (savedNotifications) {
      return JSON.parse(savedNotifications)
    }
    return {
      email: true,
      push: true,
      sms: false,
      weekly: true,
      marketing: false
    }
  })

  const [profilePicture, setProfilePicture] = useState(null)
  const [profilePicturePreview, setProfilePicturePreview] = useState(() => {
    const savedPicture = localStorage.getItem('clientcore_profile_picture')
    return savedPicture || null
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    if (!profileData.name.trim()) {
      alert('Name is required!')
      return false
    }
    if (!profileData.email.trim()) {
      alert('Email is required!')
      return false
    }
    if (!profileData.phone.trim()) {
      alert('Phone is required!')
      return false
    }
    return true
  }

  const handleNotificationChange = (key) => {
    setNotifications(prev => {
      const newNotifications = {
        ...prev,
        [key]: !prev[key]
      }
              // Save to localStorage
        saveNotifications(newNotifications)
      return newNotifications
    })
  }



  const handleSave = () => {
    if (!validateForm()) {
      return
    }
    
    // Save profile data to localStorage
    saveProfileData(profileData)
    
    // Also update the user data in localStorage to keep header in sync
    const updatedUser = {
      name: profileData.name,
      email: profileData.email
    }
    localStorage.setItem('clientcore_user', JSON.stringify(updatedUser))
    
    // Trigger a storage event to notify other components
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'clientcore_user',
      newValue: JSON.stringify(updatedUser)
    }))
    
    // Handle profile picture upload
    if (profilePicture) {
      // In a real app, this would upload the image to the backend
      console.log('Saving profile picture:', profilePicture.name)
    }
    
    // In a real app, this would save profile data to the backend
    setIsEditing(false)
    setShowSuccessMessage(true)
    setTimeout(() => setShowSuccessMessage(false), 3000)
  }

  const handleCancel = () => {
        // Reset to original data
    setProfileData({
      name: user?.name || 'User',
      email: user?.email || 'user@example.com',
      phone: '',
      address: '',
      company: 'ClientCore',
      role: user?.role || 'User',
      bio: '',
      timezone: 'UTC-5 (Eastern Time)',
      language: 'English'
    })
    
    // Reset profile picture changes
    setProfilePicture(null)
    setProfilePicturePreview(null)
    removeProfilePicture()
    
    setIsEditing(false)
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const handlePasswordSubmit = () => {
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!')
      return
    }
    if (passwordData.newPassword.length < 8) {
      alert('New password must be at least 8 characters long!')
      return
    }
    
    // In a real app, this would update the password
    setShowPasswordModal(false)
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    setShowSuccessMessage(true)
    setTimeout(() => setShowSuccessMessage(false), 3000)
  }

  const handleProfilePictureUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file!')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB!')
        return
      }
      
      setProfilePicture(file)
      
      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target.result
        setProfilePicturePreview(imageData)
        // Save to localStorage
        saveProfilePicture(imageData)
      }
      reader.readAsDataURL(file)
      
      // Show success message
      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 3000)
      
      // In a real app, this would upload to the backend
      console.log('Profile picture uploaded:', file.name)
    }
  }

  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (passwordModalRef.current && !passwordModalRef.current.contains(event.target)) {
        setShowPasswordModal(false)
      }
    }

    if (showPasswordModal) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showPasswordModal])



  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800">Profile updated successfully!</span>
        </div>
      )}

             {/* Header */}
       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
         <div>
                       <h1 className="text-2xl font-bold text-secondary-900">Profile</h1>
            <p className="text-secondary-600">Manage your account settings and preferences</p>
            
            
           
         </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="btn-primary flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="btn-secondary flex items-center"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary flex items-center"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                ) : (
                  <p className="text-secondary-900">{profileData.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                ) : (
                  <p className="text-secondary-900">{profileData.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                ) : (
                  <p className="text-secondary-900">{profileData.phone}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Role
                </label>
                <p className="text-secondary-900">{profileData.role}</p>
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
              <Building className="w-5 h-5 mr-2" />
              Company Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Company Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="company"
                    value={profileData.company}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                ) : (
                  <p className="text-secondary-900">{profileData.company}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Address
                </label>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    rows="2"
                    className="input-field"
                  />
                ) : (
                  <p className="text-secondary-900">{profileData.address}</p>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">About</h3>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Bio
              </label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  rows="4"
                  className="input-field"
                />
              ) : (
                <p className="text-secondary-900">{profileData.bio}</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Picture */}
          <div className="card p-6 text-center">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
              {profilePicturePreview ? (
                <img 
                  src={profilePicturePreview} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-primary-600 font-bold text-3xl">
                  {profileData.name.charAt(0)}
                </span>
              )}
            </div>
            <button 
              onClick={triggerFileUpload}
              className="btn-secondary flex items-center mx-auto mb-2"
            >
              <Camera className="w-4 h-4 mr-2" />
              {profilePicture ? 'Change Photo' : 'Upload Photo'}
            </button>
            {profilePicture && (
              <button 
                onClick={() => {
                  setProfilePicture(null)
                  setProfilePicturePreview(null)
                  removeProfilePicture()
                  setShowSuccessMessage(true)
                  setTimeout(() => setShowSuccessMessage(false), 3000)
                }}
                className="btn-secondary text-sm w-full"
              >
                Remove Photo
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleProfilePictureUpload}
              className="hidden"
            />
          </div>

          {/* Preferences */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              Preferences
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Language
                </label>
                <p className="text-secondary-900">{profileData.language}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Timezone
                </label>
                <p className="text-secondary-900">{profileData.timezone}</p>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Notifications
            </h3>
            <div className="space-y-3">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-secondary-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <button
                    onClick={() => handleNotificationChange(key)}
                    className={`w-10 h-6 rounded-full transition-colors ${
                      value ? 'bg-primary-600' : 'bg-secondary-300'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      value ? 'translate-x-4' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Security */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Security
            </h3>
            <div className="space-y-3">
              <button 
                onClick={() => setShowPasswordModal(true)}
                className="w-full btn-secondary flex items-center justify-center"
              >
                <Key className="w-4 h-4 mr-2" />
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div ref={passwordModalRef} className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-secondary-900">Change Password</h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-secondary-400 hover:text-secondary-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="input-field pr-10"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                  >
                    {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="input-field pr-10"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                  >
                    {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="input-field pr-10"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordSubmit}
                className="flex-1 btn-primary"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
