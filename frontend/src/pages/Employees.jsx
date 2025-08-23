import { useState, useEffect } from 'react'
import { 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2,
  Mail,
  Phone,
  MapPin,
  User,
  Shield,
  Calendar,
  Briefcase,
  X
} from 'lucide-react'
import { getEmployees, addEmployee, updateEmployee, deleteEmployee } from '../utils/storage'

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Developer',
    department: 'Engineering',
    status: 'Active',
    joinDate: ''
  })
  const [viewEmployee, setViewEmployee] = useState(null)
  const [editEmployee, setEditEmployee] = useState(null)
  const [employees, setEmployees] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load employees from localStorage
    const savedEmployees = getEmployees()
    if (savedEmployees.length > 0) {
      setEmployees(savedEmployees)
    }
    setIsLoading(false)
  }, [])

  const handleCreateEmployee = () => {
    if (newEmployee.name && newEmployee.email && newEmployee.role && newEmployee.department) {
      const employee = {
        ...newEmployee,
        projects: 0,
        avatar: null
      }
      
      // Add to storage
      const newEmployeeWithId = addEmployee(employee)
      
      // Update local state
      setEmployees(prev => [newEmployeeWithId, ...prev])
      
      setNewEmployee({
        name: '',
        email: '',
        phone: '',
        role: 'Developer',
        department: 'Engineering',
        status: 'Active',
        joinDate: ''
      })
      setShowCreateModal(false)
    }
  }

  const handleInputChange = (field, value) => {
    setNewEmployee(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleViewEmployee = (employee) => {
    setViewEmployee(employee)
  }

  const handleEditEmployee = (employee) => {
    setEditEmployee(employee)
  }

  const handleUpdateEmployee = () => {
    if (editEmployee && editEmployee.name && editEmployee.email && editEmployee.role && editEmployee.department) {
      // Update in storage
      const updatedEmployee = updateEmployee(editEmployee.id, editEmployee)
      
      if (updatedEmployee) {
        // Update local state
        setEmployees(prev => prev.map(e => 
          e.id === editEmployee.id ? updatedEmployee : e
        ))
      }
      
      setEditEmployee(null)
    }
  }

  const handleDeleteEmployee = (employeeId) => {
    // Delete from storage
    deleteEmployee(employeeId)
    
    // Update local state
    setEmployees(prev => prev.filter(e => e.id !== employeeId))
  }

  const handleInputChangeEdit = (field, value) => {
    setEditEmployee(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'Senior Developer': return 'bg-blue-100 text-blue-800'
      case 'UI/UX Designer': return 'bg-purple-100 text-purple-800'
      case 'Project Manager': return 'bg-green-100 text-green-800'
      case 'QA Engineer': return 'bg-yellow-100 text-yellow-800'
      case 'DevOps Engineer': return 'bg-orange-100 text-orange-800'
      default: return 'bg-secondary-100 text-secondary-800'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Inactive': return 'bg-gray-100 text-gray-800'
      default: return 'bg-secondary-100 text-secondary-800'
    }
  }

  const getDepartmentColor = (department) => {
    switch (department) {
      case 'Engineering': return 'bg-blue-100 text-blue-800'
      case 'Design': return 'bg-purple-100 text-purple-800'
      case 'Management': return 'bg-green-100 text-green-800'
      default: return 'bg-secondary-100 text-secondary-800'
    }
  }

  const EmployeeRow = ({ employee }) => {
    const [showMenu, setShowMenu] = useState(false)

    return (
      <tr className="hover:bg-secondary-50">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
              <User className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-secondary-900">{employee.name}</div>
              <div className="text-sm text-secondary-500">{employee.email}</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(employee.role)}`}>
            {employee.role}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDepartmentColor(employee.department)}`}>
            {employee.department}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-secondary-900">{employee.phone}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-secondary-900">{employee.projects}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-secondary-900">{employee.joinDate}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(employee.status)}`}>
            {employee.status}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-secondary-400 hover:text-secondary-600"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-6 w-32 bg-white rounded-lg shadow-lg border border-secondary-200 z-10">
                <button 
                  onClick={() => handleViewEmployee(employee)}
                  className="w-full text-left px-3 py-2 text-sm text-secondary-700 hover:bg-secondary-50 flex items-center"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </button>
                <button 
                  onClick={() => handleEditEmployee(employee)}
                  className="w-full text-left px-3 py-2 text-sm text-secondary-700 hover:bg-secondary-50 flex items-center"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteEmployee(employee.id)}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </td>
      </tr>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Users & Employees</h1>
          <p className="text-secondary-600">Manage your ClientCore team members and user accounts</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-primary mt-4 sm:mt-0 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add ClientCore Employee
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>
        <button className="btn-secondary flex items-center">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </button>
      </div>

      {/* Employees Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-secondary-200">
            <thead className="bg-secondary-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Projects
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary-200">
              {employees.map((employee) => (
                <EmployeeRow key={employee.id} employee={employee} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {employees.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👨‍💼</div>
          <h3 className="text-lg font-medium text-secondary-900 mb-2">No employees yet</h3>
          <p className="text-secondary-600 mb-6">Get started by adding your first team member</p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add First Employee
          </button>
        </div>
      )}

      {/* Create Employee Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-secondary-900">Add New Employee</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-secondary-400 hover:text-secondary-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newEmployee.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="input-field"
                  placeholder="Enter full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="input-field"
                  placeholder="Enter email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={newEmployee.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="input-field"
                  placeholder="Enter phone number"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Role
                  </label>
                  <select
                    value={newEmployee.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="input-field"
                  >
                    <option value="Developer">Developer</option>
                    <option value="Senior Developer">Senior Developer</option>
                    <option value="UI/UX Designer">UI/UX Designer</option>
                    <option value="Project Manager">Project Manager</option>
                    <option value="QA Engineer">QA Engineer</option>
                    <option value="DevOps Engineer">DevOps Engineer</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Department
                  </label>
                  <select
                    value={newEmployee.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="input-field"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Management">Management</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Join Date
                </label>
                <input
                  type="date"
                  value={newEmployee.joinDate}
                  onChange={(e) => handleInputChange('joinDate', e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleCreateEmployee}
                className="btn-primary flex-1"
              >
                Add ClientCore Employee
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Employee Modal */}
      {viewEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-secondary-900">View Employee</h3>
              <button
                onClick={() => setViewEmployee(null)}
                className="text-secondary-400 hover:text-secondary-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Full Name</label>
                <p className="text-secondary-900">{viewEmployee.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Email</label>
                <p className="text-secondary-900">{viewEmployee.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Phone</label>
                <p className="text-secondary-900">{viewEmployee.phone}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Role</label>
                <p className="text-secondary-900">{viewEmployee.role}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Department</label>
                <p className="text-secondary-900">{viewEmployee.department}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Status</label>
                <p className="text-secondary-900">{viewEmployee.status}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Join Date</label>
                <p className="text-secondary-900">{viewEmployee.joinDate}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Projects</label>
                <p className="text-secondary-900">{viewEmployee.projects}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                onClick={() => setViewEmployee(null)}
                className="btn-secondary w-full"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {editEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-secondary-900">Edit Employee</h3>
              <button
                onClick={() => setEditEmployee(null)}
                className="text-secondary-400 hover:text-secondary-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editEmployee.name}
                  onChange={(e) => handleInputChangeEdit('name', e.target.value)}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editEmployee.email}
                  onChange={(e) => handleInputChangeEdit('email', e.target.value)}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={editEmployee.phone}
                  onChange={(e) => handleInputChangeEdit('phone', e.target.value)}
                  className="input-field"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Role</label>
                  <select
                    value={editEmployee.role}
                    onChange={(e) => handleInputChangeEdit('role', e.target.value)}
                    className="input-field"
                  >
                    <option value="Developer">Developer</option>
                    <option value="Senior Developer">Senior Developer</option>
                    <option value="UI/UX Designer">UI/UX Designer</option>
                    <option value="Project Manager">Project Manager</option>
                    <option value="QA Engineer">QA Engineer</option>
                    <option value="DevOps Engineer">DevOps Engineer</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Department</label>
                  <select
                    value={editEmployee.department}
                    onChange={(e) => handleInputChangeEdit('department', e.target.value)}
                    className="input-field"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Management">Management</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Join Date</label>
                <input
                  type="date"
                  value={editEmployee.joinDate}
                  onChange={(e) => handleInputChangeEdit('joinDate', e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleUpdateEmployee}
                className="btn-primary flex-1"
              >
                Update Employee
              </button>
              <button
                onClick={() => setEditEmployee(null)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Employees
