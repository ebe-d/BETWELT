const mongoose = require('mongoose');
require('dotenv').config();
const Event = require('../src/models/Event');

const mockEvents = [
  {
    title: 'Premier League Match',
    match: 'Manchester United vs Liverpool',
    category: 'Football',
    date: new Date('2023-11-15'),
    time: '20:00',
    venue: 'Old Trafford, Manchester',
    status: 'upcoming',
    description: 'One of the most anticipated matches of the Premier League season. Manchester United hosts Liverpool at Old Trafford in what promises to be an exciting encounter between two of England\'s most successful clubs. Both teams will be looking to secure three vital points in their race for the title.',
    image: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1489&q=80',
    teams: {
      home: {
        name: 'Manchester United',
        logo: 'MU'
      },
      away: {
        name: 'Liverpool',
        logo: 'LIV'
      }
    },
    odds: {
      home: 2.75,
      draw: 3.50,
      away: 2.40
    },
    history: [
      { date: new Date('2023-03-05'), competition: 'Premier League', result: 'Man Utd 2-1 Liverpool' },
      { date: new Date('2022-08-22'), competition: 'Premier League', result: 'Liverpool 2-0 Man Utd' },
      { date: new Date('2022-04-19'), competition: 'Premier League', result: 'Liverpool 4-0 Man Utd' },
      { date: new Date('2021-10-24'), competition: 'Premier League', result: 'Liverpool 5-0 Man Utd' },
      { date: new Date('2021-05-13'), competition: 'Premier League', result: 'Man Utd 2-4 Liverpool' }
    ],
    statistics: [
      { name: 'Goals Scored', home: 15, away: 22 },
      { name: 'Goals Conceded', home: 12, away: 9 },
      { name: 'Possession (%)', home: 48, away: 52 },
      { name: 'Shots on Target', home: 38, away: 45 },
      { name: 'Clean Sheets', home: 3, away: 5 },
      { name: 'Pass Accuracy (%)', home: 84, away: 87 },
      { name: 'Chances Created', home: 42, away: 39 }
    ],
    featured: true
  },
  {
    title: 'La Liga Match',
    match: 'Barcelona vs Real Madrid',
    category: 'Football',
    date: new Date('2023-11-20'),
    time: '21:00',
    venue: 'Camp Nou, Barcelona',
    status: 'upcoming',
    description: 'El Clásico, the biggest match in Spanish football. Barcelona faces Real Madrid in this highly anticipated showdown at Camp Nou.',
    image: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1489&q=80',
    teams: {
      home: {
        name: 'Barcelona',
        logo: 'BAR'
      },
      away: {
        name: 'Real Madrid',
        logo: 'RMA'
      }
    },
    odds: {
      home: 2.10,
      draw: 3.40,
      away: 3.20
    },
    featured: true
  },
  {
    title: 'NBA Regular Season',
    match: 'LA Lakers vs Golden State Warriors',
    category: 'Basketball',
    date: new Date('2023-11-18'),
    time: '19:30',
    venue: 'Crypto.com Arena, Los Angeles',
    status: 'upcoming',
    description: 'NBA powerhouses collide as LeBron James and the Lakers host Steph Curry and the Warriors in this Western Conference showdown.',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1489&q=80',
    teams: {
      home: {
        name: 'LA Lakers',
        logo: 'LAL'
      },
      away: {
        name: 'Golden State Warriors',
        logo: 'GSW'
      }
    },
    odds: {
      home: 1.95,
      draw: 0,
      away: 1.85
    },
    featured: true
  },
  {
    title: 'French Open Final',
    match: 'Nadal vs Djokovic',
    category: 'Tennis',
    date: new Date('2023-06-11'),
    time: '14:00',
    venue: 'Roland Garros, Paris',
    status: 'completed',
    description: 'A clash of tennis titans as Rafael Nadal faces Novak Djokovic in the French Open final at Roland Garros.',
    image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1489&q=80',
    teams: {
      home: {
        name: 'Rafael Nadal',
        logo: 'NAD'
      },
      away: {
        name: 'Novak Djokovic',
        logo: 'DJO'
      }
    },
    odds: {
      home: 1.75,
      draw: 0,
      away: 2.05
    },
    result: 'Rafael Nadal won 6-4, 6-3, 6-2'
  },
  {
    title: 'Formula 1 Monaco Grand Prix',
    match: 'Monaco Grand Prix',
    category: 'Formula 1',
    date: new Date('2023-05-28'),
    time: '15:00',
    venue: 'Circuit de Monaco, Monte Carlo',
    status: 'completed',
    description: 'The prestigious Monaco Grand Prix, one of the most important and prestigious automobile races in the world.',
    image: 'https://images.unsplash.com/photo-1604868189283-3d9b2a9e0cdf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1489&q=80',
    teams: {
      home: {
        name: 'Max Verstappen',
        logo: 'VER'
      },
      away: {
        name: 'Lewis Hamilton',
        logo: 'HAM'
      }
    },
    odds: {
      home: 1.65,
      draw: 0,
      away: 2.20
    },
    result: 'Max Verstappen won by 1st Place'
  },
  {
    title: 'Premier League Match',
    match: 'Arsenal vs Tottenham',
    category: 'Football',
    date: new Date('2023-11-25'),
    time: '16:30',
    venue: 'Emirates Stadium, London',
    status: 'upcoming',
    description: 'The North London derby as Arsenal hosts Tottenham in this fierce Premier League rivalry.',
    image: 'https://images.unsplash.com/photo-1504016798967-59a258e9cb0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1489&q=80',
    teams: {
      home: {
        name: 'Arsenal',
        logo: 'ARS'
      },
      away: {
        name: 'Tottenham',
        logo: 'TOT'
      }
    },
    odds: {
      home: 2.10,
      draw: 3.40,
      away: 3.25
    }
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_DB);
    
    console.log('Connected to MongoDB...');
    
    // Delete existing events
    await Event.deleteMany({});
    console.log('Deleted existing events');
    
    // Insert new events
    const result = await Event.insertMany(mockEvents);
    console.log(`Added ${result.length} events to the database`);
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase(); 