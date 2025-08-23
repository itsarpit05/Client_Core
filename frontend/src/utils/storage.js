// Storage utility functions for CRUD operations

// Profile data
export const saveProfileData = (data) => {
  localStorage.setItem('clientcore_profile_data', JSON.stringify(data))
}

export const getProfileData = () => {
  const data = localStorage.getItem('clientcore_profile_data')
  return data ? JSON.parse(data) : null
}

export const saveProfilePicture = (imageData) => {
  localStorage.setItem('clientcore_profile_picture', imageData)
}

export const getProfilePicture = () => {
  return localStorage.getItem('clientcore_profile_picture')
}

export const removeProfilePicture = () => {
  localStorage.removeItem('clientcore_profile_picture')
}

// Notifications
export const saveNotifications = (notifications) => {
  localStorage.setItem('clientcore_notifications', JSON.stringify(notifications))
}

export const getNotifications = () => {
  const data = localStorage.getItem('clientcore_notifications')
  return data ? JSON.parse(data) : null
}

// Proposals
export const saveProposals = (proposals) => {
  localStorage.setItem('clientcore_proposals', JSON.stringify(proposals))
}

export const getProposals = () => {
  const data = localStorage.getItem('clientcore_proposals')
  return data ? JSON.parse(data) : []
}

export const addProposal = (proposal) => {
  const proposals = getProposals()
  const newProposal = { ...proposal, id: Date.now().toString() }
  proposals.push(newProposal)
  saveProposals(proposals)
  return newProposal
}

export const updateProposal = (id, updatedData) => {
  const proposals = getProposals()
  const index = proposals.findIndex(p => p.id === id)
  if (index !== -1) {
    proposals[index] = { ...proposals[index], ...updatedData }
    saveProposals(proposals)
    return proposals[index]
  }
  return null
}

export const deleteProposal = (id) => {
  const proposals = getProposals()
  const filteredProposals = proposals.filter(p => p.id !== id)
  saveProposals(filteredProposals)
}

// Projects
export const saveProjects = (projects) => {
  localStorage.setItem('clientcore_projects', JSON.stringify(projects))
}

export const getProjects = () => {
  const data = localStorage.getItem('clientcore_projects')
  return data ? JSON.parse(data) : []
}

export const addProject = (project) => {
  const projects = getProjects()
  const newProject = { ...project, id: Date.now().toString() }
  projects.push(newProject)
  saveProjects(projects)
  return newProject
}

export const updateProject = (id, updatedData) => {
  const projects = getProjects()
  const index = projects.findIndex(p => p.id === id)
  if (index !== -1) {
    projects[index] = { ...projects[index], ...updatedData }
    saveProjects(projects)
    return projects[index]
  }
  return null
}

export const deleteProject = (id) => {
  const projects = getProjects()
  const filteredProjects = projects.filter(p => p.id !== id)
  saveProjects(filteredProjects)
}

// Clients
export const saveClients = (clients) => {
  console.log('saveClients - Saving clients to localStorage:', clients)
  localStorage.setItem('clientcore_clients', JSON.stringify(clients))
  console.log('saveClients - Data saved, verifying...')
  const saved = localStorage.getItem('clientcore_clients')
  console.log('saveClients - Verification - saved data:', saved)
}

export const getClients = () => {
  try {
    const data = localStorage.getItem('clientcore_clients')
    console.log('getClients - Raw localStorage data:', data)
    if (!data) {
      console.log('getClients - No data found, returning empty array')
      return []
    }
    
    const parsed = JSON.parse(data)
    console.log('getClients - Parsed data:', parsed)
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.error('Error parsing clients data:', error)
    return []
  }
}

export const addClient = (client) => {
  console.log('addClient - Input client data:', client)
  const clients = getClients()
  console.log('addClient - Existing clients:', clients)
  const newClient = { ...client, id: Date.now().toString() }
  console.log('addClient - New client with ID:', newClient)
  clients.push(newClient)
  console.log('addClient - Updated clients array:', clients)
  saveClients(clients)
  return newClient
}

export const updateClient = (id, updatedData) => {
  const clients = getClients()
  const index = clients.findIndex(c => c.id === id)
  if (index !== -1) {
    clients[index] = { ...clients[index], ...updatedData }
    saveClients(clients)
    return clients[index]
  }
  return null
}

export const deleteClient = (id) => {
  const clients = getClients()
  const filteredClients = clients.filter(c => c.id !== id)
  saveClients(filteredClients)
}

// Tasks
export const saveTasks = (tasks) => {
  localStorage.setItem('clientcore_tasks', JSON.stringify(tasks))
}

export const getTasks = () => {
  const data = localStorage.getItem('clientcore_tasks')
  return data ? JSON.parse(data) : []
}

export const addTask = (task) => {
  const tasks = getTasks()
  const newTask = { ...task, id: Date.now().toString() }
  tasks.push(newTask)
  saveTasks(tasks)
  return newTask
}

export const updateTask = (id, updatedData) => {
  const tasks = getTasks()
  const index = tasks.findIndex(t => t.id === id)
  if (index !== -1) {
    tasks[index] = { ...tasks[index], ...updatedData }
    saveTasks(tasks)
    return tasks[index]
  }
  return null
}

export const deleteTask = (id) => {
  const tasks = getTasks()
  const filteredTasks = tasks.filter(t => t.id !== id)
  saveTasks(filteredTasks)
}

// Employees
export const saveEmployees = (employees) => {
  localStorage.setItem('clientcore_employees', JSON.stringify(employees))
}

export const getEmployees = () => {
  const data = localStorage.getItem('clientcore_employees')
  return data ? JSON.parse(data) : []
}

export const addEmployee = (employee) => {
  const employees = getEmployees()
  const newEmployee = { ...employee, id: Date.now().toString() }
  employees.push(newEmployee)
  saveEmployees(employees)
  return newEmployee
}

export const updateEmployee = (id, updatedData) => {
  const employees = getEmployees()
  const index = employees.findIndex(e => e.id === id)
  if (index !== -1) {
    employees[index] = { ...employees[index], ...updatedData }
    saveEmployees(employees)
    return employees[index]
  }
  return null
}

export const deleteEmployee = (id) => {
  const employees = getEmployees()
  const filteredEmployees = employees.filter(e => e.id !== id)
  saveEmployees(filteredEmployees)
}

// Initialize default data if none exists
export const initializeDefaultData = () => {
  try {
    // Initialize proposals if none exist
    if (!localStorage.getItem('clientcore_proposals')) {
      console.log('initializeDefaultData - Creating default proposals...')
      const defaultProposals = [
        {
          id: '1',
          title: 'Website Redesign Project',
          client: 'TechCorp Inc.',
          value: 15000,
          status: 'In Progress',
          dueDate: '2024-03-15',
          description: 'Complete website redesign for TechCorp Inc.'
        },
        {
          id: '2',
          title: 'Mobile App Development',
          client: 'StartupXYZ',
          value: 25000,
          status: 'Pending',
          dueDate: '2024-04-20',
          description: 'iOS and Android app development for StartupXYZ'
        }
      ]
      console.log('initializeDefaultData - Default proposals created:', defaultProposals)
      saveProposals(defaultProposals)
      console.log('initializeDefaultData - Default proposals saved')
    } else {
      console.log('initializeDefaultData - Proposals already exist in localStorage')
    }

  // Initialize projects if none exist
  if (!localStorage.getItem('clientcore_projects')) {
    console.log('initializeDefaultData - Creating default projects...')
    const defaultProjects = [
      {
        id: '1',
        name: 'E-commerce Platform',
        client: 'Retail Solutions',
        status: 'In Progress',
        progress: 75,
        startDate: '2024-01-15',
        endDate: '2024-05-30',
        budget: 50000,
        team: ['John Doe', 'Jane Smith', 'Mike Johnson']
      },
      {
        id: '2',
        name: 'CRM System',
        client: 'Business Corp',
        status: 'Planning',
        progress: 25,
        startDate: '2024-02-01',
        endDate: '2024-08-15',
        budget: 75000,
        team: ['Sarah Wilson', 'David Brown']
      }
    ]
    console.log('initializeDefaultData - Default projects created:', defaultProjects)
    saveProjects(defaultProjects)
    console.log('initializeDefaultData - Default projects saved')
  } else {
    console.log('initializeDefaultData - Projects already exist in localStorage')
  }

      // Initialize clients if none exist
    if (!localStorage.getItem('clientcore_clients')) {
      console.log('initializeDefaultData - Creating default clients...')
      const defaultClients = [
        {
          id: '1',
          name: 'TechCorp Inc.',
          type: 'Client',
          email: 'contact@techcorp.com',
          phone: '+1 (555) 123-4567',
          address: '123 Business Ave, New York, NY 10001',
          industry: 'Technology',
          contactPerson: 'John Smith',
          totalProjects: 3,
          totalRevenue: 75000,
          status: 'Active',
          lastContact: '2024-02-10'
        },
        {
          id: '2',
          name: 'StartupXYZ',
          type: 'Client',
          email: 'hello@startupxyz.com',
          phone: '+1 (555) 987-6543',
          address: '456 Innovation St, San Francisco, CA 94102',
          industry: 'Software',
          contactPerson: 'Sarah Wilson',
          totalProjects: 1,
          totalRevenue: 25000,
          status: 'Active',
          lastContact: '2024-02-15'
        }
      ]
      console.log('initializeDefaultData - Default clients created:', defaultClients)
      saveClients(defaultClients)
      console.log('initializeDefaultData - Default clients saved')
    } else {
      console.log('initializeDefaultData - Clients already exist in localStorage')
    }

  // Initialize tasks if none exist
  if (!localStorage.getItem('clientcore_tasks')) {
    console.log('initializeDefaultData - Creating default tasks...')
    const defaultTasks = [
      {
        id: '1',
        title: 'Design Homepage',
        description: 'Create modern homepage design for e-commerce platform',
        assignee: 'John Doe',
        priority: 'High',
        status: 'In Progress',
        dueDate: '2024-03-20',
        tags: ['Design', 'Frontend']
      },
      {
        id: '2',
        title: 'Database Setup',
        description: 'Set up PostgreSQL database with proper schemas',
        assignee: 'Mike Johnson',
        priority: 'Medium',
        status: 'Completed',
        dueDate: '2024-03-10',
        tags: ['Backend', 'Database']
      },
      {
        id: '3',
        title: 'API Integration',
        description: 'Integrate third-party payment APIs',
        assignee: 'Sarah Wilson',
        priority: 'High',
        status: 'Pending',
        dueDate: '2024-03-25',
        tags: ['Backend', 'API']
      }
    ]
    console.log('initializeDefaultData - Default tasks created:', defaultTasks)
    saveTasks(defaultTasks)
    console.log('initializeDefaultData - Default tasks saved')
  } else {
    console.log('initializeDefaultData - Tasks already exist in localStorage')
  }

  // Initialize employees if none exist
  if (!localStorage.getItem('clientcore_employees')) {
    const defaultEmployees = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@clientcore.com',
        role: 'Senior Developer',
        department: 'Engineering',
        status: 'Active',
        joinDate: '2023-01-15'
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@clientcore.com',
        role: 'UI/UX Designer',
        department: 'Design',
        status: 'Active',
        joinDate: '2023-03-20'
      }
    ]
    saveEmployees(defaultEmployees)
  }
} catch (error) {
  console.error('Error initializing default data:', error)
}
}
