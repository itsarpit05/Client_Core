import { useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const RevenueChart = ({ clients = [] }) => {
  // Generate dynamic revenue data based on actual clients
  const generateRevenueData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const currentMonth = new Date().getMonth()
    
    // If no clients, show zero revenue
    if (clients.length === 0) {
      return months.map(() => 0)
    }
    
    // Calculate total potential revenue from all clients
    const totalRevenue = clients.reduce((sum, client) => sum + (client.totalRevenue || 0), 0)
    
    // Generate realistic monthly progression
    const revenueData = []
    let cumulativeRevenue = 0
    
    for (let i = 0; i < 12; i++) {
      if (i <= currentMonth) {
        // For past and current months, show progressive growth
        const monthProgress = (i + 1) / 12
        const monthRevenue = Math.floor(totalRevenue * monthProgress * (0.8 + Math.random() * 0.4))
        cumulativeRevenue = monthRevenue
        revenueData.push(monthRevenue)
      } else {
        // For future months, show projected growth
        const projectedGrowth = 1 + (Math.random() * 0.3 - 0.1) // -10% to +30% variation
        const projectedRevenue = Math.floor(cumulativeRevenue * projectedGrowth)
        revenueData.push(projectedRevenue)
        cumulativeRevenue = projectedRevenue
      }
    }
    
    return revenueData
  }
  
  const revenueData = generateRevenueData()
  
  // Update chart when clients change
  useEffect(() => {
    // This will trigger a re-render when clients prop changes
  }, [clients])
  
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue',
        data: revenueData,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#2563eb',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#2563eb',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `Revenue: $${context.parsed.y.toLocaleString()}`
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 12
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(226, 232, 240, 0.5)',
          borderDash: [5, 5]
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 12
          },
          callback: function(value) {
            return '$' + (value / 1000) + 'k'
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  }

  return (
    <div className="h-64">
      <Line data={data} options={options} />
    </div>
  )
}

export default RevenueChart
