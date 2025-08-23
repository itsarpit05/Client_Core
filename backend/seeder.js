const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Client = require('./models/Client');
const Proposal = require('./models/Proposal');
const Project = require('./models/Project');
const Task = require('./models/Task');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/clientcore', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
    department: 'Management',
    phone: '+1 (555) 123-4567'
  },
  {
    name: 'John Doe',
    email: 'john.doe@company.com',
    password: 'password123',
    role: 'manager',
    department: 'Engineering',
    phone: '+1 (555) 234-5678'
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    password: 'password123',
    role: 'employee',
    department: 'Design',
    phone: '+1 (555) 345-6789'
  }
];

const clients = [
  {
    name: 'ABC Corporation',
    type: 'Client',
    email: 'contact@abccorp.com',
    phone: '+1 (555) 123-4567',
    address: {
      street: '123 Business Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    industry: 'Technology',
    totalProjects: 5,
    totalRevenue: 125000,
    status: 'Active',
    contactPerson: 'John Smith',
    lastContact: new Date()
  },
  {
    name: 'XYZ Tech Solutions',
    type: 'Client',
    email: 'info@xyztech.com',
    phone: '+1 (555) 987-6543',
    address: {
      street: '456 Innovation St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'USA'
    },
    industry: 'Software',
    totalProjects: 3,
    totalRevenue: 85000,
    status: 'Active',
    contactPerson: 'Sarah Johnson',
    lastContact: new Date()
  }
];

const proposals = [
  {
    title: 'Website Redesign Project',
    status: 'lead',
    address: '123 Main St, New York, NY',
    description: 'Complete website redesign for ABC Corporation',
    totalValue: 25000,
    priority: 'High'
  },
  {
    title: 'Mobile App Development',
    status: 'bidding',
    address: '456 Tech Blvd, San Francisco, CA',
    description: 'iOS and Android app development for XYZ Tech',
    totalValue: 35000,
    priority: 'Medium'
  },
  {
    title: 'E-commerce Platform',
    status: 'approved',
    address: '789 Commerce Dr, Chicago, IL',
    description: 'Full e-commerce solution with payment integration',
    totalValue: 45000,
    priority: 'High',
    signed: true,
    signedAt: new Date()
  }
];

const projects = [
  {
    name: 'E-commerce Website Redesign',
    status: 'In Progress',
    progress: 65,
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-03-30'),
    budget: 25000,
    priority: 'High'
  },
  {
    name: 'Mobile App Development',
    status: 'Completed',
    progress: 100,
    startDate: new Date('2023-11-01'),
    endDate: new Date('2024-01-15'),
    budget: 35000,
    priority: 'Medium'
  }
];

const tasks = [
  {
    title: 'Design homepage mockups',
    description: 'Create wireframes and mockups for the new homepage design',
    priority: 'High',
    status: 'In Progress',
    dueDate: new Date('2024-02-15'),
    estimatedHours: 8,
    category: 'Design'
  },
  {
    title: 'Database optimization',
    description: 'Optimize database queries and improve performance',
    priority: 'Medium',
    status: 'Completed',
    dueDate: new Date('2024-02-10'),
    estimatedHours: 12,
    category: 'Development'
  }
];

// Seeder function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany();
    await Client.deleteMany();
    await Proposal.deleteMany();
    await Project.deleteMany();
    await Task.deleteMany();

    console.log('🗑️  Cleared existing data');

    // Create users
    const createdUsers = [];
    for (const userData of users) {
      const user = await User.create(userData);
      createdUsers.push(user);
      console.log(`👤 Created user: ${user.name}`);
    }

    // Create clients
    const createdClients = [];
    for (const clientData of clients) {
      const client = await Client.create({
        ...clientData,
        assignedTo: createdUsers[0]._id
      });
      createdClients.push(client);
      console.log(`🏢 Created client: ${client.name}`);
    }

    // Create proposals
    for (let i = 0; i < proposals.length; i++) {
      const proposal = await Proposal.create({
        ...proposals[i],
        client: createdClients[i % createdClients.length]._id,
        assignedTo: createdUsers[0]._id
      });
      console.log(`📋 Created proposal: ${proposal.title}`);
    }

    // Create projects
    for (let i = 0; i < projects.length; i++) {
      const project = await Project.create({
        ...projects[i],
        client: createdClients[i % createdClients.length]._id,
        assignedTo: createdUsers[0]._id
      });
      console.log(`🚀 Created project: ${project.name}`);
    }

    // Create tasks
    for (let i = 0; i < tasks.length; i++) {
      const task = await Task.create({
        ...tasks[i],
        assignee: createdUsers[i % createdUsers.length]._id
      });
      console.log(`✅ Created task: ${task.title}`);
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Sample data created:');
    console.log(`   👥 Users: ${createdUsers.length}`);
    console.log(`   🏢 Clients: ${createdClients.length}`);
    console.log(`   📋 Proposals: ${proposals.length}`);
    console.log(`   🚀 Projects: ${projects.length}`);
    console.log(`   ✅ Tasks: ${tasks.length}`);
    console.log('\n🔑 Default login credentials:');
    console.log('   Email: admin@example.com');
    console.log('   Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

// Run seeder
seedDatabase();
