import { useState, useEffect } from 'react'
import { 
  Search, 
  Plus, 
  MoreVertical, 
  CheckCircle, 
  Clock,
  User,
  MapPin,
  Layers,
  Eye,
  Edit,
  Trash2,
  X
} from 'lucide-react'
import { getProposals, addProposal, updateProposal, deleteProposal } from '../utils/storage'

const Proposals = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newProposal, setNewProposal] = useState({
    title: '',
    client: '',
    address: '',
    phases: [],
    status: 'lead',
    budget: '',
    timeline: '',
    description: '',
    contactEmail: '',
    contactPhone: '',
    projectType: '',
    priority: 'medium'
  })
  const [viewProposal, setViewProposal] = useState(null)
  const [editProposal, setEditProposal] = useState(null)
  const [proposals, setProposals] = useState({
    lead: [],
    bidding: [],
    signature: [],
    hold: [],
    approved: []
  })

  useEffect(() => {
    // Load proposals from localStorage
    const savedProposals = getProposals()
    if (savedProposals.length > 0) {
      // Group proposals by status
      const groupedProposals = {
        lead: [],
        bidding: [],
        signature: [],
        hold: [],
        approved: []
      }
      
      savedProposals.forEach(proposal => {
        if (groupedProposals[proposal.status]) {
          groupedProposals[proposal.status].push(proposal)
        }
      })
      
      setProposals(groupedProposals)
    }
  }, [])

  const handleCreateProposal = () => {
    if (newProposal.title && newProposal.client && newProposal.address) {
      const proposal = {
        ...newProposal,
        signed: false
      }
      
      // Add to storage
      const newProposalWithId = addProposal(proposal)
      
      // Update local state
      setProposals(prev => ({
        ...prev,
        [newProposal.status]: [...prev[newProposal.status], newProposalWithId]
      }))
      
      setNewProposal({ 
        title: '', 
        client: '', 
        address: '', 
        phases: [], 
        status: 'lead',
        budget: '',
        timeline: '',
        description: '',
        contactEmail: '',
        contactPhone: '',
        projectType: '',
        priority: 'medium'
      })
      setShowCreateModal(false)
    }
  }

  const handleInputChange = (field, value) => {
    setNewProposal(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleViewProposal = (proposal) => {
    setViewProposal(proposal)
  }

  const handleEditProposal = (proposal) => {
    setEditProposal(proposal)
  }

  const handleUpdateProposal = () => {
    if (editProposal && editProposal.title && editProposal.client && editProposal.address) {
      // Update in storage
      const updatedProposal = updateProposal(editProposal.id, editProposal)
      
      if (updatedProposal) {
        // Update local state
        setProposals(prev => {
          const updated = { ...prev }
          Object.keys(updated).forEach(key => {
            updated[key] = updated[key].map(p => 
              p.id === editProposal.id ? { ...updatedProposal } : p
            )
          })
          return updated
        })
      }
      
      setEditProposal(null)
    }
  }

  const handleDeleteProposal = (proposalId) => {
    // Delete from storage
    deleteProposal(proposalId)
    
    // Update local state
    setProposals(prev => {
      const updated = { ...prev }
      Object.keys(updated).forEach(key => {
        updated[key] = updated[key].filter(p => p.id !== proposalId)
      })
      return updated
    })
  }

  const handleInputChangeEdit = (field, value) => {
    setEditProposal(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleStatusChange = (proposalId, newStatus) => {
    // Find the proposal
    let proposalToUpdate = null
    let currentStatus = null
    
    Object.keys(proposals).forEach(status => {
      const found = proposals[status].find(p => p.id === proposalId)
      if (found) {
        proposalToUpdate = found
        currentStatus = status
      }
    })
    
    if (proposalToUpdate && currentStatus) {
      // Update the proposal status
      const updatedProposal = { ...proposalToUpdate, status: newStatus }
      updateProposal(proposalId, updatedProposal)
      
      // Update local state
      setProposals(prev => ({
        ...prev,
        [currentStatus]: prev[currentStatus].filter(p => p.id !== proposalId),
        [newStatus]: [...prev[newStatus], updatedProposal]
      }))
    }
  }

  const columns = [
    { key: 'lead', title: 'Lead', color: 'bg-blue-500' },
    { key: 'bidding', title: 'Bidding', color: 'bg-yellow-500' },
    { key: 'signature', title: 'Signature', color: 'bg-purple-500' },
    { key: 'hold', title: 'Hold', color: 'bg-gray-500' },
    { key: 'approved', title: 'Approved', color: 'bg-green-500' }
  ]

  const ProposalCard = ({ proposal, columnKey }) => {
    const [showMenu, setShowMenu] = useState(false)

    return (
      <div className="card p-4 mb-3 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-medium text-secondary-900 hover:text-primary-600 cursor-pointer">
            {proposal.title}
          </h4>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-secondary-400 hover:text-secondary-600"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-6 w-40 bg-white rounded-lg shadow-lg border border-secondary-200 z-10">
                <button 
                  onClick={() => handleViewProposal(proposal)}
                  className="w-full text-left px-3 py-2 text-sm text-secondary-700 hover:bg-secondary-50 flex items-center"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </button>
                <button 
                  onClick={() => handleEditProposal(proposal)}
                  className="w-full text-left px-3 py-2 text-sm text-secondary-700 hover:bg-secondary-50 flex items-center"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </button>
                <div className="border-t border-secondary-200">
                  <div className="px-3 py-2 text-xs font-medium text-secondary-500 uppercase tracking-wide">
                    Move to
                  </div>
                  {columns.map((column) => (
                    column.key !== proposal.status && (
                      <button
                        key={column.key}
                        onClick={() => {
                          handleStatusChange(proposal.id, column.key)
                          setShowMenu(false)
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-secondary-700 hover:bg-secondary-50 flex items-center"
                      >
                        <div className={`w-2 h-2 rounded-full mr-2 ${column.color}`}></div>
                        {column.title}
                      </button>
                    )
                  ))}
                </div>
                <div className="border-t border-secondary-200">
                  <button 
                    onClick={() => handleDeleteProposal(proposal.id)}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-secondary-600">
            <User className="w-4 h-4 mr-2" />
            <span>Client: {proposal.client}</span>
          </div>
          <div className="flex items-center text-secondary-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span>Address: {proposal.address}</span>
          </div>
          {proposal.budget && (
            <div className="flex items-center text-secondary-600">
              <span className="w-4 h-4 mr-2">💰</span>
              <span>Budget: ${proposal.budget}</span>
            </div>
          )}
          {proposal.timeline && (
            <div className="flex items-center text-secondary-600">
              <Clock className="w-4 h-4 mr-2" />
              <span>Timeline: {proposal.timeline}</span>
            </div>
          )}
          {proposal.projectType && (
            <div className="flex items-center text-secondary-600">
              <span className="w-4 h-4 mr-2">🏗️</span>
              <span>Type: {proposal.projectType}</span>
            </div>
          )}
          <div className="flex items-center text-secondary-600">
            <span className={`w-2 h-2 rounded-full mr-2 ${
              proposal.priority === 'high' ? 'bg-red-500' : 
              proposal.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
            }`}></span>
            <span className="capitalize">Priority: {proposal.priority}</span>
          </div>
          <div className="flex items-center text-secondary-600">
            <Layers className="w-4 h-4 mr-2" />
            <span>Phases: {proposal.phases.length > 0 ? proposal.phases.join(', ') : 'None'}</span>
          </div>
        </div>

        {proposal.signed && (
          <div className="mt-3 flex items-center text-green-600">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span className="text-xs font-medium">Signed</span>
          </div>
        )}
      </div>
    )
  }

  const KanbanColumn = ({ column }) => {
    const proposalsInColumn = filteredProposals[column.key] || []
    
    return (
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
            <h3 className="font-semibold text-secondary-900">{column.title}</h3>
          </div>
          <span className="bg-secondary-100 text-secondary-700 text-xs font-medium px-2 py-1 rounded-full">
            {proposalsInColumn.length}
          </span>
        </div>
        
        <div className="space-y-3">
          {proposalsInColumn.map((proposal) => (
            <ProposalCard 
              key={proposal.id} 
              proposal={proposal} 
              columnKey={column.key}
            />
          ))}
          
          {proposalsInColumn.length === 0 && (
            <div className="text-center py-8 text-secondary-400">
              <div className="text-4xl mb-2">📋</div>
              <p className="text-sm mb-3">No proposals</p>
              <button
                onClick={() => {
                  setNewProposal(prev => ({ ...prev, status: column.key }))
                  setShowCreateModal(true)
                }}
                className="text-xs bg-secondary-100 hover:bg-secondary-200 text-secondary-600 px-3 py-1 rounded-full transition-colors"
              >
                + Add Proposal
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  const filteredProposals = Object.keys(proposals).reduce((acc, status) => {
    if (searchTerm.trim() === '') {
      acc[status] = proposals[status]
    } else {
      acc[status] = proposals[status].filter(proposal => 
        proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proposal.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proposal.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (proposal.description && proposal.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (proposal.projectType && proposal.projectType.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (proposal.contactEmail && proposal.contactEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (proposal.contactPhone && proposal.contactPhone.includes(searchTerm))
      )
    }
    return acc
  }, {})

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Proposals</h1>
          <p className="text-secondary-600">Manage your ClientCore proposals and track their progress</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-primary mt-4 sm:mt-0 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create ClientCore Proposal
        </button>
      </div>

      {/* Search Bar */}
      <div className="max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search projects.."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Kanban Board */}
      <div className="bg-secondary-50 rounded-lg p-6">
        <div className="flex space-x-6 overflow-x-auto pb-4">
          {columns.map((column) => (
            <KanbanColumn key={column.key} column={column} />
          ))}
        </div>
      </div>

      {/* Empty State */}
      {Object.values(filteredProposals).every(col => col.length === 0) && searchTerm.trim() !== '' && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-secondary-900 mb-2">No proposals found</h3>
          <p className="text-secondary-600 mb-6">Try adjusting your search terms or create a new proposal</p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Proposal
          </button>
        </div>
      )}

      {Object.values(filteredProposals).every(col => col.length === 0) && searchTerm.trim() === '' && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-secondary-900 mb-2">No proposals yet</h3>
          <p className="text-secondary-600 mb-6">Get started by creating your first ClientCore project proposal</p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create First Proposal
          </button>
        </div>
      )}

      {/* Create Proposal Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-3 w-full max-w-lg mx-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-secondary-900">Create New ClientCore Proposal</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-secondary-400 hover:text-secondary-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-1.5">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-secondary-700 mb-0.5">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={newProposal.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="input-field py-2"
                    placeholder="Project title"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-secondary-700 mb-0.5">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    value={newProposal.client}
                    onChange={(e) => handleInputChange('client', e.target.value)}
                    className="input-field py-2"
                    placeholder="Client name"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-secondary-700 mb-0.5">
                  Project Address *
                </label>
                <input
                  type="text"
                  value={newProposal.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="input-field py-2"
                  placeholder="Project address"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-medium text-secondary-700 mb-0.5">
                    Status
                  </label>
                  <select
                    value={newProposal.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="input-field py-2"
                  >
                    <option value="lead">Lead</option>
                    <option value="bidding">Bidding</option>
                    <option value="signature">Signature</option>
                    <option value="hold">Hold</option>
                    <option value="approved">Approved</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-secondary-700 mb-0.5">
                    Priority
                  </label>
                  <select
                    value={newProposal.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="input-field py-2"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-secondary-700 mb-0.5">
                    Project Type
                  </label>
                  <select
                    value={newProposal.projectType}
                    onChange={(e) => handleInputChange('projectType', e.target.value)}
                    className="input-field py-2"
                  >
                    <option value="">Select type</option>
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Renovation">Renovation</option>
                    <option value="New Construction">New Construction</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-secondary-700 mb-0.5">
                    Budget
                  </label>
                  <input
                    type="text"
                    value={newProposal.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    className="input-field py-2"
                    placeholder="$50,000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-0.5">
                    Timeline
                  </label>
                  <input
                    type="text"
                    value={newProposal.timeline}
                    onChange={(e) => handleInputChange('timeline', e.target.value)}
                    className="input-field py-2"
                    placeholder="3 months"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-secondary-700 mb-0.5">
                  Description
                </label>
                <textarea
                  value={newProposal.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="input-field py-2"
                  rows="1"
                  placeholder="Project description"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-secondary-700 mb-0.5">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={newProposal.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    className="input-field py-2"
                    placeholder="client@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-secondary-700 mb-0.5">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={newProposal.contactPhone}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    className="input-field py-2"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2 mt-2">
              <button
                onClick={handleCreateProposal}
                className="btn-primary flex-1 py-2"
              >
                Create ClientCore Proposal
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="btn-secondary flex-1 py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Proposal Modal */}
      {viewProposal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-secondary-900">View Proposal</h3>
              <button
                onClick={() => setViewProposal(null)}
                className="text-secondary-400 hover:text-secondary-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Project Title</label>
                <p className="text-secondary-900">{viewProposal.title}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Client Name</label>
                <p className="text-secondary-900">{viewProposal.client}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Project Address</label>
                <p className="text-secondary-900">{viewProposal.address}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Status</label>
                <p className="text-secondary-900 capitalize">{viewProposal.status}</p>
              </div>

              {viewProposal.budget && (
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Budget</label>
                  <p className="text-secondary-900">{viewProposal.budget}</p>
                </div>
              )}

              {viewProposal.timeline && (
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Timeline</label>
                  <p className="text-secondary-900">{viewProposal.timeline}</p>
                </div>
              )}

              {viewProposal.projectType && (
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Project Type</label>
                  <p className="text-secondary-900">{viewProposal.projectType}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Priority</label>
                <p className="text-secondary-900 capitalize">{viewProposal.priority}</p>
              </div>

              {viewProposal.description && (
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Description</label>
                  <p className="text-secondary-900">{viewProposal.description}</p>
                </div>
              )}

              {viewProposal.contactEmail && (
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Contact Email</label>
                  <p className="text-secondary-900">{viewProposal.contactEmail}</p>
                </div>
              )}

              {viewProposal.contactPhone && (
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Contact Phone</label>
                  <p className="text-secondary-900">{viewProposal.contactPhone}</p>
                </div>
              )}
            </div>
            
            <div className="mt-6">
              <button
                onClick={() => setViewProposal(null)}
                className="btn-secondary w-full"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Proposal Modal */}
      {editProposal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-secondary-900">Edit Proposal</h3>
              <button
                onClick={() => setEditProposal(null)}
                className="text-secondary-400 hover:text-secondary-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Project Title</label>
                <input
                  type="text"
                  value={editProposal.title}
                  onChange={(e) => handleInputChangeEdit('title', e.target.value)}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Client Name</label>
                <input
                  type="text"
                  value={editProposal.client}
                  onChange={(e) => handleInputChangeEdit('client', e.target.value)}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Project Address</label>
                <input
                  type="text"
                  value={editProposal.address}
                  onChange={(e) => handleInputChangeEdit('address', e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Status</label>
                <select
                  value={editProposal.status}
                  onChange={(e) => handleInputChangeEdit('status', e.target.value)}
                  className="input-field"
                >
                  <option value="lead">Lead</option>
                  <option value="bidding">Bidding</option>
                  <option value="signature">Signature</option>
                  <option value="hold">Hold</option>
                  <option value="approved">Approved</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Budget</label>
                  <input
                    type="text"
                    value={editProposal.budget || ''}
                    onChange={(e) => handleInputChangeEdit('budget', e.target.value)}
                    className="input-field"
                    placeholder="e.g., $50,000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Timeline</label>
                  <input
                    type="text"
                    value={editProposal.timeline || ''}
                    onChange={(e) => handleInputChangeEdit('timeline', e.target.value)}
                    className="input-field"
                    placeholder="e.g., 3 months"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Project Type</label>
                <select
                  value={editProposal.projectType || ''}
                  onChange={(e) => handleInputChangeEdit('projectType', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select project type</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Renovation">Renovation</option>
                  <option value="New Construction">New Construction</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Priority</label>
                <select
                  value={editProposal.priority || 'medium'}
                  onChange={(e) => handleInputChangeEdit('priority', e.target.value)}
                  className="input-field"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Description</label>
                <textarea
                  value={editProposal.description || ''}
                  onChange={(e) => handleInputChangeEdit('description', e.target.value)}
                  className="input-field"
                  rows="3"
                  placeholder="Enter project description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={editProposal.contactEmail || ''}
                    onChange={(e) => handleInputChangeEdit('contactEmail', e.target.value)}
                    className="input-field"
                    placeholder="client@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    value={editProposal.contactPhone || ''}
                    onChange={(e) => handleInputChangeEdit('contactPhone', e.target.value)}
                    className="input-field"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleUpdateProposal}
                className="btn-primary flex-1"
              >
                Update Proposal
              </button>
              <button
                onClick={() => setEditProposal(null)}
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

export default Proposals