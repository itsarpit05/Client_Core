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
  Building,
  User,
  DollarSign,
  X
} from 'lucide-react'
import { getClients, addClient, updateClient, deleteClient } from '../utils/storage'

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newClient, setNewClient] = useState({
    name: '',
    type: 'Client',
    email: '',
    phone: '',
    address: '',
    industry: '',
    contactPerson: '',
    status: 'Active',
    totalRevenue: 0
  })
  const [viewClient, setViewClient] = useState(null)
  const [editClient, setEditClient] = useState(null)
  const [clients, setClients] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      // Load clients from localStorage
      const savedClients = getClients()
      console.log('Loaded clients:', savedClients)
      if (savedClients && savedClients.length > 0) {
        setClients(savedClients)
      }
    } catch (error) {
      console.error('Error loading clients:', error)
      // Set fallback data on error
      setClients([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleCreateClient = () => {
    if (newClient.name && newClient.email && newClient.contactPerson) {
      const client = {
        ...newClient,
        totalProjects: 0,
        totalRevenue: newClient.totalRevenue || 0,
        lastContact: new Date().toISOString().split('T')[0]
      }
      
      // Add to storage
      const newClientWithId = addClient(client)
      
      // Update local state
      setClients(prev => [newClientWithId, ...prev])
      
      setNewClient({
        name: '',
        type: 'Client',
        email: '',
        phone: '',
        address: '',
        industry: '',
        contactPerson: '',
        status: 'Active',
        totalRevenue: 0
      })
      setShowCreateModal(false)
    }
  }

  const handleInputChange = (field, value) => {
    setNewClient(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleViewClient = (client) => {
    setViewClient(client)
  }

  const handleEditClient = (client) => {
    setEditClient(client)
  }

  const handleUpdateClient = () => {
    if (editClient && editClient.name && editClient.email && editClient.contactPerson) {
      // Update in storage
      const updatedClient = updateClient(editClient.id, editClient)
      
      if (updatedClient) {
        // Update local state
        setClients(prev => prev.map(c => 
          c.id === editClient.id ? updatedClient : c
        ))
      }
      
      setEditClient(null)
    }
  }

  const handleDeleteClient = (clientId) => {
    // Delete from storage
    deleteClient(clientId)
    
    // Update local state
    setClients(prev => prev.filter(c => c.id !== clientId))
  }

  const handleInputChangeEdit = (field, value) => {
    setEditClient(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'Client': return 'bg-blue-100 text-blue-800'
      case 'Supplier': return 'bg-green-100 text-green-800'
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

  const ClientRow = ({ client }) => {
    const [showMenu, setShowMenu] = useState(false)

    // Safety check for client data
    if (!client || typeof client !== 'object') {
      return null
    }

    // Ensure all required fields exist with fallbacks
    const safeClient = {
      name: client.name || 'Unknown',
      industry: client.industry || 'N/A',
      type: client.type || 'Client',
      contactPerson: client.contactPerson || 'N/A',
      email: client.email || 'N/A',
      phone: client.phone || 'N/A',
      totalProjects: client.totalProjects || 0,
      totalRevenue: client.totalRevenue || 0,
      status: client.status || 'Active'
    }

    return (
      <tr className="hover:bg-secondary-50">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
              <Building className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-secondary-900">{safeClient.name}</div>
              <div className="text-sm text-secondary-500">{safeClient.industry}</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(safeClient.type)}`}>
            {safeClient.type}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-secondary-900">{safeClient.contactPerson}</div>
          <div className="text-sm text-secondary-500">{safeClient.email}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-secondary-900">{safeClient.phone}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-secondary-900">{safeClient.totalProjects}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-secondary-900">${safeClient.totalRevenue.toLocaleString()}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(safeClient.status)}`}>
            {safeClient.status}
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
                  onClick={() => handleViewClient(client)}
                  className="w-full text-left px-3 py-2 text-sm text-secondary-700 hover:bg-secondary-50 flex items-center"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </button>
                <button 
                  onClick={() => handleEditClient(client)}
                  className="w-full text-left px-3 py-2 text-sm text-secondary-700 hover:bg-secondary-50 flex items-center"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteClient(client.id)}
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

  console.log('Clients component render - clients:', clients, 'isLoading:', isLoading)



  return (
    <div className="space-y-6">

      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Clients & Suppliers</h1>
          <p className="text-secondary-600">Manage your ClientCore client relationships and supplier partnerships</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-primary mt-4 sm:mt-0 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add ClientCore Client
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search clients..."
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

      {/* Clients Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-secondary-200">
            <thead className="bg-secondary-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Projects
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Revenue
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
               {clients.filter(client => client && client.id).map((client) => {
                 try {
                   return <ClientRow key={client.id} client={client} />
                 } catch (error) {
                   console.error('Error rendering client row:', error, client)
                   return null
                 }
               })}
             </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {clients.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-lg font-medium text-secondary-900 mb-2">No clients yet</h3>
          <p className="text-secondary-600 mb-6">Get started by adding your first client</p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add First Client
          </button>
        </div>
      )}

      {/* Create Client Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-secondary-900">Add New Client</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-1 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-secondary-700 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={newClient.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="input-field py-1.5"
                    placeholder="Company name"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-secondary-700 mb-1">
                    Type
                  </label>
                  <select
                    value={newClient.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="input-field py-1.5"
                  >
                    <option value="Client">Client</option>
                    <option value="Supplier">Supplier</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-secondary-700 mb-1">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    value={newClient.contactPerson}
                    onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                    className="input-field py-1.5"
                    placeholder="Contact person"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-secondary-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={newClient.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="input-field py-1.5"
                    placeholder="Email address"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-secondary-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={newClient.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="input-field py-1.5"
                    placeholder="Phone number"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-secondary-700 mb-1">
                    Industry
                  </label>
                  <input
                    type="text"
                    value={newClient.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    className="input-field py-1.5"
                    placeholder="Industry"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-secondary-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={newClient.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="input-field py-1.5"
                  placeholder="Enter address"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-secondary-700 mb-1">
                    Total Revenue
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-500">$</span>
                    <input
                      type="number"
                      value={newClient.totalRevenue || ''}
                      onChange={(e) => handleInputChange('totalRevenue', parseFloat(e.target.value) || 0)}
                      className="input-field pl-8 py-1.5"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-secondary-700 mb-1">
                    Status
                  </label>
                  <select
                    value={newClient.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="input-field py-1.5"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Prospect">Prospect</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2 mt-3">
              <button
                onClick={handleCreateClient}
                className="btn-primary flex-1 py-1.5"
              >
                Add ClientCore Client
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="btn-secondary flex-1 py-1.5"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Client Modal */}
      {viewClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-sm mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-secondary-900">View Client</h3>
              <button
                onClick={() => setViewClient(null)}
                className="text-secondary-400 hover:text-secondary-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Company Name</label>
                <p className="text-secondary-900">{viewClient.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Type</label>
                <p className="text-secondary-900">{viewClient.type}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Contact Person</label>
                <p className="text-secondary-900">{viewClient.contactPerson}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Email</label>
                <p className="text-secondary-900">{viewClient.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Phone</label>
                <p className="text-secondary-900">{viewClient.phone}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Industry</label>
                <p className="text-secondary-900">{viewClient.industry}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Address</label>
                <p className="text-secondary-900">{viewClient.address}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Total Projects</label>
                <p className="text-secondary-900">{viewClient.totalProjects}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Total Revenue</label>
                <p className="text-secondary-900">${viewClient.totalRevenue.toLocaleString()}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Status</label>
                <p className="text-secondary-900">{viewClient.status}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <button
                onClick={() => setViewClient(null)}
                className="btn-secondary w-full"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Client Modal */}
      {editClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-sm mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-secondary-900">Edit Client</h3>
              <button
                onClick={() => setEditClient(null)}
                className="text-secondary-400 hover:text-secondary-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Company Name</label>
                <input
                  type="text"
                  value={editClient.name}
                  onChange={(e) => handleInputChangeEdit('name', e.target.value)}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Type</label>
                <select
                  value={editClient.type}
                  onChange={(e) => handleInputChangeEdit('type', e.target.value)}
                  className="input-field"
                >
                  <option value="Client">Client</option>
                  <option value="Supplier">Supplier</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Contact Person</label>
                <input
                  type="text"
                  value={editClient.contactPerson}
                  onChange={(e) => handleInputChangeEdit('contactPerson', e.target.value)}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editClient.email}
                  onChange={(e) => handleInputChangeEdit('email', e.target.value)}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={editClient.phone}
                  onChange={(e) => handleInputChangeEdit('phone', e.target.value)}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Industry</label>
                <input
                  type="text"
                  value={editClient.industry}
                  onChange={(e) => handleInputChangeEdit('industry', e.target.value)}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Address</label>
                <textarea
                  value={editClient.address}
                  onChange={(e) => handleInputChangeEdit('address', e.target.value)}
                  className="input-field"
                  rows="2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Total Revenue</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-500">$</span>
                  <input
                    type="number"
                    value={editClient.totalRevenue || ''}
                    onChange={(e) => handleInputChangeEdit('totalRevenue', parseFloat(e.target.value) || 0)}
                    className="input-field pl-8"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Status</label>
                <select
                  value={editClient.status}
                  onChange={(e) => handleInputChangeEdit('status', e.target.value)}
                  className="input-field"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Prospect">Prospect</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-4">
              <button
                onClick={handleUpdateClient}
                className="btn-primary flex-1"
              >
                Update Client
              </button>
              <button
                onClick={() => setEditClient(null)}
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

export default Clients
