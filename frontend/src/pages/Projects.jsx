import { useState, useEffect } from 'react'
import { 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2,
  Calendar,
  User,
  DollarSign,
  Clock,
  X
} from 'lucide-react'
import { getProjects, addProject, updateProject, deleteProject } from '../utils/storage'

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newProject, setNewProject] = useState({
    name: '',
    client: '',
    status: 'Planning',
    startDate: '',
    endDate: '',
    budget: '',
    team: []
  })
  const [viewProject, setViewProject] = useState(null)
  const [editProject, setEditProject] = useState(null)
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load projects from localStorage
    const savedProjects = getProjects()
    if (savedProjects.length > 0) {
      setProjects(savedProjects)
    }
    setIsLoading(false)
  }, [])

  const handleCreateProject = () => {
    if (newProject.name && newProject.client && newProject.startDate && newProject.endDate && newProject.budget) {
      const project = {
        ...newProject,
        progress: 0,
        budget: parseFloat(newProject.budget),
        team: newProject.team.length > 0 ? newProject.team : []
      }
      
      // Add to storage
      const newProjectWithId = addProject(project)
      
      // Update local state
      setProjects(prev => [newProjectWithId, ...prev])
      
      setNewProject({
        name: '',
        client: '',
        status: 'Planning',
        startDate: '',
        endDate: '',
        budget: '',
        team: []
      })
      setShowCreateModal(false)
    }
  }

  const handleInputChange = (field, value) => {
    setNewProject(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addTeamMember = () => {
    const member = prompt('Enter team member name:')
    if (member && member.trim()) {
      setNewProject(prev => ({
        ...prev,
        team: [...prev.team, member.trim()]
      }))
    }
  }

  const removeTeamMember = (index) => {
    setNewProject(prev => ({
      ...prev,
      team: prev.team.filter((_, i) => i !== index)
    }))
  }

  const handleViewProject = (project) => {
    setViewProject(project)
  }

  const handleEditProject = (project) => {
    setEditProject(project)
  }

  const handleUpdateProject = () => {
    if (editProject && editProject.name && editProject.client && editProject.startDate && editProject.endDate && editProject.budget) {
      // Update in storage
      const updatedProject = updateProject(editProject.id, { ...editProject, budget: parseFloat(editProject.budget) })
      
      if (updatedProject) {
        // Update local state
        setProjects(prev => prev.map(p => 
          p.id === editProject.id ? updatedProject : p
        ))
      }
      
      setEditProject(null)
    }
  }

  const handleDeleteProject = (projectId) => {
    // Delete from storage
    deleteProject(projectId)
    
    // Update local state
    setProjects(prev => prev.filter(p => p.id !== projectId))
  }

  const handleInputChangeEdit = (field, value) => {
    setEditProject(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addTeamMemberEdit = () => {
    const member = prompt('Enter team member name:')
    if (member && member.trim()) {
      setEditProject(prev => ({
        ...prev,
        team: [...prev.team, member.trim()]
      }))
    }
  }

  const removeTeamMemberEdit = (index) => {
    setEditProject(prev => ({
      ...prev,
      team: prev.team.filter((_, i) => i !== index)
    }))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'In Progress': return 'bg-blue-100 text-blue-800'
      case 'Planning': return 'bg-yellow-100 text-yellow-800'
      case 'On Hold': return 'bg-gray-100 text-gray-800'
      default: return 'bg-secondary-100 text-secondary-800'
    }
  }

  const ProjectRow = ({ project }) => {
    const [showMenu, setShowMenu] = useState(false)

    return (
      <tr className="hover:bg-secondary-50">
        <td className="px-6 py-4 whitespace-nowrap">
          <div>
            <div className="text-sm font-medium text-secondary-900">{project.name}</div>
            <div className="text-sm text-secondary-500">#{project.id}</div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-secondary-900">{project.client}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
            {project.status}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="w-16 bg-secondary-200 rounded-full h-2 mr-2">
              <div 
                className="bg-primary-600 h-2 rounded-full" 
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
            <span className="text-sm text-secondary-900">{project.progress}%</span>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-secondary-900">${project.budget.toLocaleString()}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-secondary-900">{project.team.length} members</div>
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
                  onClick={() => handleViewProject(project)}
                  className="w-full text-left px-3 py-2 text-sm text-secondary-700 hover:bg-secondary-50 flex items-center"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </button>
                <button 
                  onClick={() => handleEditProject(project)}
                  className="w-full text-left px-3 py-2 text-sm text-secondary-700 hover:bg-secondary-50 flex items-center"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteProject(project.id)}
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
          <h1 className="text-2xl font-bold text-secondary-900">Projects & Jobs</h1>
          <p className="text-secondary-600">Manage your ClientCore projects and track their progress</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-primary mt-4 sm:mt-0 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          New ClientCore Project
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search projects..."
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

      {/* Projects Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-secondary-200">
            <thead className="bg-secondary-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Team
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary-200">
              {projects.map((project) => (
                <ProjectRow key={project.id} project={project} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {projects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🚀</div>
          <h3 className="text-lg font-medium text-secondary-900 mb-2">No projects yet</h3>
          <p className="text-secondary-600 mb-6">Get started by creating your first ClientCore project</p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create First Project
          </button>
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-secondary-900">Create New ClientCore Project</h3>
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
                  Project Name
                </label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="input-field"
                  placeholder="Enter project name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Client Name
                </label>
                <input
                  type="text"
                  value={newProject.client}
                  onChange={(e) => handleInputChange('client', e.target.value)}
                  className="input-field"
                  placeholder="Enter client name"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={newProject.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={newProject.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Budget ($)
                </label>
                <input
                  type="number"
                  value={newProject.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  className="input-field"
                  placeholder="Enter budget amount"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Team Members
                </label>
                <div className="space-y-2">
                  {newProject.team.map((member, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-sm text-secondary-600 flex-1">{member}</span>
                      <button
                        onClick={() => removeTeamMember(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addTeamMember}
                    className="btn-secondary text-sm"
                  >
                    + Add Team Member
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleCreateProject}
                className="btn-primary flex-1"
              >
                Create Project
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

      {/* View Project Modal */}
      {viewProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-secondary-900">View Project</h3>
              <button
                onClick={() => setViewProject(null)}
                className="text-secondary-400 hover:text-secondary-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Project Name</label>
                <p className="text-secondary-900">{viewProject.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Client</label>
                <p className="text-secondary-900">{viewProject.client}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Status</label>
                <p className="text-secondary-900">{viewProject.status}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Progress</label>
                <p className="text-secondary-900">{viewProject.progress}%</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Budget</label>
                <p className="text-secondary-900">${viewProject.budget.toLocaleString()}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Team Members</label>
                <p className="text-secondary-900">{viewProject.team.length > 0 ? viewProject.team.join(', ') : 'None'}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                onClick={() => setViewProject(null)}
                className="btn-secondary w-full"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {editProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-secondary-900">Edit Project</h3>
              <button
                onClick={() => setEditProject(null)}
                className="text-secondary-400 hover:text-secondary-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Project Name</label>
                <input
                  type="text"
                  value={editProject.name}
                  onChange={(e) => handleInputChangeEdit('name', e.target.value)}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Client</label>
                <input
                  type="text"
                  value={editProject.client}
                  onChange={(e) => handleInputChangeEdit('client', e.target.value)}
                  className="input-field"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={editProject.startDate}
                    onChange={(e) => handleInputChangeEdit('startDate', e.target.value)}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={editProject.endDate}
                    onChange={(e) => handleInputChangeEdit('endDate', e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Budget ($)</label>
                <input
                  type="number"
                  value={editProject.budget}
                  onChange={(e) => handleInputChangeEdit('budget', e.target.value)}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Team Members</label>
                <div className="space-y-2">
                  {editProject.team.map((member, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-sm text-secondary-600 flex-1">{member}</span>
                      <button
                        onClick={() => removeTeamMemberEdit(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addTeamMemberEdit}
                    className="btn-secondary text-sm"
                  >
                    + Add Team Member
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleUpdateProject}
                className="btn-primary flex-1"
              >
                Update Project
              </button>
              <button
                onClick={() => setEditProject(null)}
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

export default Projects
