// Migration script to add existing experiences to the database
// Run this after setting up the experiences table

const existingExperiences = [
  {
    title: 'Started Self Learning',
    company: 'Started to learn programming',
    period: '2019',
    description: '',
    order_index: 0
  },
  {
    title: 'Started to Learn Lua for Fivem (GTA V Mod)',
    company: 'Started to learn Lua for Fivem',
    period: '2019-2020',
    description: '',
    order_index: 1
  },
  {
    title: 'Started My Journey in React.js',
    company: 'Started to learn React.js',
    period: '2020-2021',
    description: '',
    order_index: 2
  },
  {
    title: 'Started Learning Tailwind CSS',
    company: 'Started to learn Tailwind CSS',
    period: '2021-ongoing',
    description: '',
    order_index: 3
  },
  {
    title: 'Started Learning TypeScript',
    company: 'Started to learn TypeScript',
    period: '2021-ongoing',
    description: '',
    order_index: 4
  },
  {
    title: 'Started Learning Next.js',
    company: 'Started to learn Next.js',
    period: '2020-ongoing',
    description: '',
    order_index: 5
  },
  {
    title: 'Start my journey in Freelancing',
    company: 'Freelancing',
    period: '2025-ongoing',
    description: '',
    order_index: 6
  }
];

console.log('Migration data prepared. You can now use the admin interface to add these experiences:');
console.log(JSON.stringify(existingExperiences, null, 2)); 