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
  CheckCircle,
  Clock,
  AlertCircle,
  X
} from 'lucide-react'
import { getTasks, addTask, updateTask, deleteTask } from '../utils/storage'

const Tasks = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignee: '',
    priority: 'Medium',
    status: 'Pending',
    dueDate: '',
    project: '',
    tags: []
  })
  const [viewTask, setViewTask] = useState(null)
  const [editTask, setEditTask] = useState(null)
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load tasks from localStorage
    const savedTasks = getTasks()
    if (savedTasks.length > 0) {
      setTasks(savedTasks)
    }
    setIsLoading(false)
  }, [])

  const handleCreateTask = () => {
    if (newTask.title && newTask.assignee && newTask.dueDate) {
      const task = {
        ...newTask,
        tags: newTask.tags.length > 0 ? newTask.tags : []
      }
      
      // Add to storage
      const newTaskWithId = addTask(task)
      
      // Update local state
      setTasks(prev => [newTaskWithId, ...prev])
      
      setNewTask({
        title: '',
        description: '',
        assignee: '',
        priority: 'Medium',
        status: 'Pending',
        dueDate: '',
        project: '',
        tags: []
      })
      setShowCreateModal(false)
    }
  }

  const handleInputChange = (field, value) => {
    setNewTask(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addTag = () => {
    const tag = prompt('Enter tag name:')
    if (tag && tag.trim()) {
      setNewTask(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }))
    }
  }

  const removeTag = (index) => {
    setNewTask(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }))
  }

  const handleViewTask = (task) => {
    setViewTask(task)
  }

  const handleEditTask = (task) => {
    setEditTask(task)
  }

  const handleUpdateTask = () => {
    if (editTask && editTask.title && editTask.assignee && editTask.dueDate) {
      // Update in storage
      const updatedTask = updateTask(editTask.id, editTask)
      
      if (updatedTask) {
        // Update local state
        setTasks(prev => prev.map(t => 
          t.id === editTask.id ? updatedTask : t
        ))
      }
      
      setEditTask(null)
    }
  }

  const handleDeleteTask = (taskId) => {
    // Delete from storage
    deleteTask(taskId)
    
    // Update local state
    setTasks(prev => prev.filter(t => t.id !== taskId))
  }

  const handleInputChangeEdit = (field, value) => {
    setEditTask(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addTagEdit = () => {
    const tag = prompt('Enter tag name:')
    if (tag && tag.trim()) {
      setEditTask(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }))
    }
  }

  const removeTagEdit = (index) => {
    setEditTask(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }))
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Low': return 'bg-green-100 text-green-800'
      default: return 'bg-secondary-100 text-secondary-800'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'In Progress': return 'bg-blue-100 text-blue-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Planning': return 'bg-purple-100 text-purple-800'
      default: return 'bg-secondary-100 text-secondary-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="w-4 h-4" />
      case 'In Progress': return <Clock className="w-4 h-4" />
      case 'Pending': return <AlertCircle className="w-4 h-4" />
      case 'Planning': return <Calendar className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const TaskRow = ({ task }) => {
    const [showMenu, setShowMenu] = useState(false)

    return (
      <tr className="hover:bg-secondary-50">
        <td className="px-6 py-4 whitespace-nowrap">
          <div>
            <div className="text-sm font-medium text-secondary-900">{task.title}</div>
            <div className="text-sm text-secondary-500">{task.description}</div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-secondary-900">{task.assignee}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
            {getStatusIcon(task.status)}
            <span className="ml-1">{task.status}</span>
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-secondary-900">{task.project}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-secondary-900">{task.dueDate}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex flex-wrap gap-1">
            {task.tags.map((tag, index) => (
              <span key={index} className="inline-flex px-2 py-1 text-xs font-medium bg-secondary-100 text-secondary-800 rounded-full">
                {tag}
              </span>
            ))}
          </div>
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
                  onClick={() => handleViewTask(task)}
                  className="w-full text-left px-3 py-2 text-sm text-secondary-700 hover:bg-secondary-50 flex items-center"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </button>
                <button 
                  onClick={() => handleEditTask(task)}
                  className="w-full text-left px-3 py-2 text-sm text-secondary-700 hover:bg-secondary-50 flex items-center"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteTask(task.id)}
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
          <h1 className="text-2xl font-bold text-secondary-900">Tasks</h1>
          <p className="text-secondary-600">Manage and track your ClientCore team's tasks and assignments</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-primary mt-4 sm:mt-0 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          New ClientCore Task
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tasks..."
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

      {/* Tasks Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-secondary-200">
            <thead className="bg-secondary-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Task
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Assignee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Tags
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary-200">
              {tasks.map((task) => (
                <TaskRow key={task.id} task={task} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {tasks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-lg font-medium text-secondary-900 mb-2">No tasks yet</h3>
          <p className="text-secondary-600 mb-6">Get started by creating your first task</p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create First Task
          </button>
        </div>
      )}

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-secondary-900">Create New Task</h3>
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
                  Task Title
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="input-field"
                  placeholder="Enter task title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="input-field"
                  placeholder="Enter task description"
                  rows="2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Assignee
                </label>
                <input
                  type="text"
                  value={newTask.assignee}
                  onChange={(e) => handleInputChange('assignee', e.target.value)}
                  className="input-field"
                  placeholder="Enter assignee name"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="input-field"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Status
                  </label>
                  <select
                    value={newTask.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="input-field"
                  >
                    <option value="Planning">Planning</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Project
                </label>
                <input
                  type="text"
                  value={newTask.project}
                  onChange={(e) => handleInputChange('project', e.target.value)}
                  className="input-field"
                  placeholder="Enter project name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Tags
                </label>
                <div className="space-y-2">
                  {newTask.tags.map((tag, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-sm text-secondary-600 flex-1">{tag}</span>
                      <button
                        onClick={() => removeTag(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addTag}
                    className="btn-secondary text-sm"
                  >
                    + Add Tag
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleCreateTask}
                className="btn-primary flex-1"
              >
                Create Task
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

      {/* View Task Modal */}
      {viewTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-secondary-900">View Task</h3>
              <button
                onClick={() => setViewTask(null)}
                className="text-secondary-400 hover:text-secondary-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Task Title</label>
                <p className="text-secondary-900">{viewTask.title}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Description</label>
                <p className="text-secondary-900">{viewTask.description}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Assignee</label>
                <p className="text-secondary-900">{viewTask.assignee}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Priority</label>
                <p className="text-secondary-900">{viewTask.priority}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Status</label>
                <p className="text-secondary-900">{viewTask.status}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Project</label>
                <p className="text-secondary-900">{viewTask.project}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Due Date</label>
                <p className="text-secondary-900">{viewTask.dueDate}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Tags</label>
                <div className="flex flex-wrap gap-1">
                  {viewTask.tags.map((tag, index) => (
                    <span key={index} className="inline-flex px-2 py-1 text-xs font-medium bg-secondary-100 text-secondary-800 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                onClick={() => setViewTask(null)}
                className="btn-secondary w-full"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-secondary-900">Edit Task</h3>
              <button
                onClick={() => setEditTask(null)}
                className="text-secondary-400 hover:text-secondary-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Task Title</label>
                <input
                  type="text"
                  value={editTask.title}
                  onChange={(e) => handleInputChangeEdit('title', e.target.value)}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Description</label>
                <textarea
                  value={editTask.description}
                  onChange={(e) => handleInputChangeEdit('description', e.target.value)}
                  className="input-field"
                  rows="2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Assignee</label>
                <input
                  type="text"
                  value={editTask.assignee}
                  onChange={(e) => handleInputChangeEdit('assignee', e.target.value)}
                  className="input-field"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Priority</label>
                  <select
                    value={editTask.priority}
                    onChange={(e) => handleInputChangeEdit('priority', e.target.value)}
                    className="input-field"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Status</label>
                  <select
                    value={editTask.status}
                    onChange={(e) => handleInputChangeEdit('status', e.target.value)}
                    className="input-field"
                  >
                    <option value="Planning">Planning</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Project</label>
                <input
                  type="text"
                  value={editTask.project}
                  onChange={(e) => handleInputChangeEdit('project', e.target.value)}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={editTask.dueDate}
                  onChange={(e) => handleInputChangeEdit('dueDate', e.target.value)}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Tags</label>
                <div className="space-y-2">
                  {editTask.tags.map((tag, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-sm text-secondary-600 flex-1">{tag}</span>
                      <button
                        onClick={() => removeTagEdit(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addTagEdit}
                    className="btn-secondary text-sm"
                  >
                    + Add Tag
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleUpdateTask}
                className="btn-primary flex-1"
              >
                Update Task
              </button>
              <button
                onClick={() => setEditTask(null)}
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

export default Tasks
