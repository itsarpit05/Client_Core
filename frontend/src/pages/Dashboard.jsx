import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'
import RevenueChart from '../components/RevenueChart'
import { 
  getClients, 
  getProjects, 
  getTasks, 
  getProposals 
} from '../utils/storage'

const Dashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalClients: 0,
    activeProjects: 0,
    pendingTasks: 0
  })

  const [recentActivity, setRecentActivity] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [clients, setClients] = useState([])

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load real data from localStorage
        const clientsData = getClients()
        const projects = getProjects()
        const tasks = getTasks()
        const proposals = getProposals()
        
        // Debug logging
        console.log('Dashboard - Raw data loaded:')
        console.log('Clients:', clientsData)
        console.log('Projects:', projects)
        console.log('Tasks:', tasks)
        console.log('Proposals:', proposals)
        
        // Set clients state for chart
        setClients(clientsData)
        
        // Calculate total revenue from clients
        const totalRevenue = clientsData.reduce((sum, client) => sum + (client.totalRevenue || 0), 0)
        console.log('Total Revenue calculated:', totalRevenue)
        
        // Count active projects (status !== 'Completed')
        const activeProjects = projects.filter(project => project.status !== 'Completed').length
        console.log('Active Projects count:', activeProjects)
        
        // Count pending tasks (status === 'Pending')
        const pendingTasks = tasks.filter(task => task.status === 'Pending').length
        console.log('Pending Tasks count:', pendingTasks)
        
        setStats({
          totalRevenue: totalRevenue,
          totalClients: clientsData.length,
          activeProjects: activeProjects,
          pendingTasks: pendingTasks
        })
        
        console.log('Stats set:', {
          totalRevenue: totalRevenue,
          totalClients: clientsData.length,
          activeProjects: activeProjects,
          pendingTasks: pendingTasks
        })
        
        // Generate recent activity from actual data
        const activities = []
        
        // Add recent proposals
        proposals.slice(0, 2).forEach(proposal => {
          activities.push({
            id: `proposal-${proposal.id}`,
            type: 'proposal',
            title: `Proposal: ${proposal.title}`,
            description: `Client: ${proposal.clientName}`,
            time: 'Recently',
            status: proposal.status
          })
        })
        
                 // Add recent clients
         clientsData.slice(0, 2).forEach(client => {
           activities.push({
             id: `client-${client.id}`,
             type: 'client',
             title: `Client: ${client.name}`,
             description: `Industry: ${client.industry}`,
             time: 'Recently',
             status: 'success'
           })
         })
        
        // Add recent projects
        projects.slice(0, 2).forEach(project => {
          activities.push({
            id: `project-${project.id}`,
            type: 'project',
            title: `Project: ${project.name}`,
            description: `Status: ${project.status}`,
            time: 'Recently',
            status: project.status === 'Completed' ? 'success' : 'pending'
          })
        })
        
        // Add recent tasks
        tasks.slice(0, 2).forEach(task => {
          activities.push({
            id: `task-${task.id}`,
            type: 'task',
            title: `Task: ${task.title}`,
            description: `Assigned to: ${task.assignedTo}`,
            time: 'Recently',
            status: task.status === 'Completed' ? 'success' : 'pending'
          })
        })
        
        // Sort activities by ID to show newest first
        activities.sort((a, b) => parseInt(b.id.split('-')[1]) - parseInt(a.id.split('-')[1]))
        
        setRecentActivity(activities.slice(0, 4))
        setIsLoading(false)
        
      } catch (error) {
        console.error('Error loading dashboard data:', error)
        setIsLoading(false)
      }
    }
    
    loadData()
    
    // Listen for storage changes to refresh dashboard data
    const handleStorageChange = () => {
      loadData()
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // Also refresh data periodically to catch changes from same tab
    const interval = setInterval(loadData, 5000) // Refresh every 5 seconds
    
    // Refresh data when tab becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadData()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      clearInterval(interval)
    }
  }, [])

  const StatCard = ({ title, value, change, changeType, icon: Icon, color }) => (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-secondary-600">{title}</p>
          <p className="text-2xl font-bold text-secondary-900">{value}</p>
          <div className="flex items-center mt-1">
            {changeType === 'up' ? (
              <ArrowUpRight className="w-4 h-4 text-green-500" />
            ) : changeType === 'down' ? (
              <ArrowDownRight className="w-4 h-4 text-red-500" />
            ) : (
              <div className="w-4 h-4 text-secondary-400">—</div>
            )}
            <span className={`text-sm font-medium ${
              changeType === 'up' ? 'text-green-600' : 
              changeType === 'down' ? 'text-red-600' : 
              'text-secondary-600'
            }`}>
              {change}
            </span>
          </div>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )

  const ActivityItem = ({ activity }) => {
    const getIcon = (type) => {
      switch (type) {
        case 'proposal': return '📋'
        case 'client': return '👥'
        case 'project': return '🚀'
        case 'task': return '✅'
        default: return '📝'
      }
    }

    const getStatusColor = (status) => {
      switch (status) {
        case 'success': return 'bg-green-100 text-green-800'
        case 'pending': return 'bg-yellow-100 text-yellow-800'
        case 'error': return 'bg-red-100 text-red-800'
        default: return 'bg-secondary-100 text-secondary-800'
      }
    }

    return (
      <div className="flex items-start space-x-3 p-4 hover:bg-secondary-50 rounded-lg transition-colors">
        <div className="text-2xl">{getIcon(activity.type)}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-secondary-900">{activity.title}</p>
          <p className="text-sm text-secondary-600">{activity.description}</p>
          <p className="text-xs text-secondary-500 mt-1">{activity.time}</p>
        </div>
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
          {activity.status}
        </span>
      </div>
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
          <h1 className="text-2xl font-bold text-secondary-900">Dashboard</h1>
          <p className="text-secondary-600">Welcome back to ClientCore! Here's what's happening with your business.</p>
        </div>
        <button 
          onClick={() => {
            setIsLoading(true)
            setTimeout(() => {
              const loadData = async () => {
                                 try {
                   const clientsData = getClients()
                   const projects = getProjects()
                   const tasks = getTasks()
                   const proposals = getProposals()
                   
                   // Update clients state for chart
                   setClients(clientsData)
                   
                   const totalRevenue = clientsData.reduce((sum, client) => sum + (client.totalRevenue || 0), 0)
                  const activeProjects = projects.filter(project => project.status !== 'Completed').length
                  const pendingTasks = tasks.filter(task => task.status === 'Pending').length
                  
                  setStats({
                    totalRevenue: totalRevenue,
                    totalClients: clientsData.length,
                    activeProjects: activeProjects,
                    pendingTasks: pendingTasks
                  })
                  
                  // Regenerate recent activity
                  const activities = []
                  
                  proposals.slice(0, 2).forEach(proposal => {
                    activities.push({
                      id: `proposal-${proposal.id}`,
                      type: 'proposal',
                      title: `Proposal: ${proposal.title}`,
                      description: `Client: ${proposal.clientName}`,
                      time: 'Recently',
                      status: proposal.status
                    })
                  })
                  
                                     clientsData.slice(0, 2).forEach(client => {
                     activities.push({
                       id: `client-${client.id}`,
                       type: 'client',
                       title: `Client: ${client.name}`,
                       description: `Industry: ${client.industry}`,
                       time: 'Recently',
                       status: 'success'
                     })
                   })
                  
                  projects.slice(0, 2).forEach(project => {
                    activities.push({
                      id: `project-${project.id}`,
                      type: 'project',
                      title: `Project: ${project.name}`,
                      description: `Status: ${project.status}`,
                      time: 'Recently',
                      status: project.status === 'Completed' ? 'success' : 'pending'
                    })
                  })
                  
                  tasks.slice(0, 2).forEach(task => {
                    activities.push({
                      id: `task-${task.id}`,
                      type: 'task',
                      title: `Task: ${task.title}`,
                      description: `Assigned to: ${task.assignedTo}`,
                      time: 'Recently',
                      status: task.status === 'Completed' ? 'success' : 'pending'
                    })
                  })
                  
                  activities.sort((a, b) => parseInt(b.id.split('-')[1]) - parseInt(a.id.split('-')[1]))
                  setRecentActivity(activities.slice(0, 4))
                  setIsLoading(false)
                } catch (error) {
                  console.error('Error refreshing dashboard data:', error)
                  setIsLoading(false)
                }
              }
              loadData()
            }, 500)
          }}
          className="btn-secondary flex items-center mt-4 sm:mt-0"
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Refresh Stats
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          change={stats.totalRevenue > 0 ? "+Active" : "No Revenue"}
          changeType={stats.totalRevenue > 0 ? "up" : "neutral"}
          icon={DollarSign}
          color="bg-green-500"
        />
        <StatCard
          title="Total Clients"
          value={stats.totalClients}
          change={stats.totalClients > 0 ? `${stats.totalClients} Active` : "No Clients"}
          changeType={stats.totalClients > 0 ? "up" : "neutral"}
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Active Projects"
          value={stats.activeProjects}
          change={stats.activeProjects > 0 ? `${stats.activeProjects} Running` : "No Projects"}
          changeType={stats.activeProjects > 0 ? "up" : "neutral"}
          icon={TrendingUp}
          color="bg-purple-500"
        />
        <StatCard
          title="Pending Tasks"
          value={stats.pendingTasks}
          change={stats.pendingTasks > 0 ? `${stats.pendingTasks} Pending` : "All Complete"}
          changeType={stats.pendingTasks > 0 ? "down" : "up"}
          icon={Calendar}
          color="bg-orange-500"
        />
      </div>

      {/* Charts and Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-secondary-900">ClientCore Revenue Overview</h3>
            <button className="p-2 text-secondary-400 hover:text-secondary-600">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
          <RevenueChart key={clients.length} clients={clients} />
        </div>

        {/* Recent Activity */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-secondary-900">ClientCore Recent Activity</h3>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                              View all ClientCore
            </button>
          </div>
          <div className="space-y-2">
            {recentActivity.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
                    <h3 className="text-lg font-semibold text-secondary-900 mb-4">ClientCore Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => navigate('/proposals')}
            className="flex flex-col items-center p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mb-2">
              <Eye className="w-5 h-5 text-primary-600" />
            </div>
            <span className="text-sm font-medium text-secondary-700">View Proposals</span>
          </button>
          <button 
            onClick={() => navigate('/projects')}
            className="flex flex-col items-center p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-2">
              <Edit className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm font-medium text-secondary-700">View Projects</span>
          </button>
          <button 
            onClick={() => navigate('/clients')}
            className="flex flex-col items-center p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-secondary-700">Manage Clients</span>
          </button>
          <button 
            onClick={() => navigate('/tasks')}
            className="flex flex-col items-center p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-sm font-medium text-secondary-700">View Tasks</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
