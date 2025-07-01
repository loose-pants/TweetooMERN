#!/usr/bin/env node

import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Tweet from './models/Tweet.js';
import { users } from './data/users.js';
import { tweets } from './data/tweets.js';

// Load environment variables
dotenv.config();

/**
 * Import seed data into database
 */
const importData = async () => {
  try {
    console.log('🌱 Starting data import...');

    // Clear existing data
    await destroyData();

    // Create users
    console.log('👥 Creating users...');
    const createdUsers = [];
    
    for (const userData of users) {
      try {
        const user = await User.create(userData);
        createdUsers.push(user);
        console.log(`✅ Created user: ${user.username} (${user.role})`);
      } catch (error) {
        console.error(`❌ Failed to create user ${userData.username}:`, error.message);
      }
    }

    // Create user lookup map
    const userMap = {};
    createdUsers.forEach(user => {
      userMap[user.username] = user._id;
    });

    // Create tweets
    console.log('🐦 Creating tweets...');
    for (const tweetData of tweets) {
      try {
        const userId = userMap[tweetData.username];
        if (!userId) {
          console.error(`❌ User ${tweetData.username} not found for tweet`);
          continue;
        }

        const tweet = await Tweet.create({
          user: userId,
          content: tweetData.content
        });
        
        console.log(`✅ Created tweet by ${tweetData.username}: ${tweet.content.substring(0, 50)}...`);
      } catch (error) {
        console.error(`❌ Failed to create tweet:`, error.message);
      }
    }

    console.log('🎉 Data import completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   Users created: ${createdUsers.length}`);
    console.log(`   Tweets created: ${tweets.length}`);
    console.log('\n📋 Test Accounts:');
    console.log('   Admin: admin / admin123');
    console.log('   Editor: editor_jane / editor123');
    console.log('   User: john_doe / user123');
    
    process.exit(0);
  } catch (error) {
    console.error('💥 Import failed:', error.message);
    process.exit(1);
  }
};

/**
 * Clear all data from database
 */
const destroyData = async () => {
  try {
    console.log('🧹 Clearing existing data...');
    
    const deletedTweets = await Tweet.deleteMany();
    const deletedUsers = await User.deleteMany();
    
    console.log(`🗑️  Deleted ${deletedTweets} tweets and ${deletedUsers} users`);
  } catch (error) {
    console.error('❌ Failed to clear data:', error.message);
    throw error;
  }
};

/**
 * Main execution logic
 */
const main = async () => {
  // Connect to database
  await connectDB();

  // Parse command line arguments
  const args = process.argv.slice(2);
  
  if (args.includes('-d') || args.includes('--destroy')) {
    console.log('🚨 DESTROY MODE: This will delete all data!');
    await destroyData();
    console.log('✅ All data destroyed successfully');
    process.exit(0);
  } else if (args.includes('-i') || args.includes('--import')) {
    await importData();
  } else {
    console.log('📖 Twittoo Database Seeder');
    console.log('Usage:');
    console.log('  npm run seed          # Import sample data');
    console.log('  npm run seed:destroy  # Clear all data');
    console.log('  node seeder.js -i     # Import sample data');
    console.log('  node seeder.js -d     # Clear all data');
    process.exit(0);
  }
};

// Execute if called directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  main().catch(error => {
    console.error('💥 Seeder failed:', error.message);
    process.exit(1);
  });
}

export { importData, destroyData };