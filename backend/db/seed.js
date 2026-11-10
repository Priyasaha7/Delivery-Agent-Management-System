const { pool } = require('../src/config/db');

const sampleAgents = [
  {
    full_name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    email: 'rahul.sharma@example.com',
    service_area: 'North Delhi',
    status: 'active'
  },
  {
    full_name: 'Priya Patel',
    phone: '+91 98765 43211',
    email: 'priya.patel@example.com',
    service_area: 'South Mumbai',
    status: 'active'
  },
  {
    full_name: 'Amit Kumar',
    phone: '+91 98765 43212',
    email: 'amit.kumar@example.com',
    service_area: 'East Bengaluru',
    status: 'inactive'
  },
  {
    full_name: 'Sneha Rao',
    phone: '+91 98765 43213',
    email: 'sneha.rao@example.com',
    service_area: 'Central Pune',
    status: 'active'
  },
  {
    full_name: 'Vikram Singh',
    phone: '+91 98765 43214',
    email: 'vikram.singh@example.com',
    service_area: 'West Hyderabad',
    status: 'active'
  }
];

async function seedData() {
  try {
    for (const agent of sampleAgents) {
      await pool.query(
        `INSERT INTO agents (full_name, phone, email, service_area, status)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (email) DO NOTHING`,
        [agent.full_name, agent.phone, agent.email, agent.service_area, agent.status]
      );
    }
    console.log('Sample delivery agents seeded successfully.');
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seedData();
