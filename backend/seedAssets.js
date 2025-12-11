require('dotenv').config();
const mongoose = require('mongoose');
const Asset = require('./models/Asset');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tagmaster';

// Sample assets with Indian athletes from Unsplash and Pexels (free stock photos)
const sampleAssets = [
    {
        title: 'Cricket Player Batting',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200',
        description: 'Indian cricket player in batting stance',
        project: 'Indian Athletes Recognition',
        status: 'available',
        metadata: {
            width: 1200,
            height: 1600,
            format: 'jpg',
            sport: 'cricket'
        }
    },
    {
        title: 'Badminton Player Action',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1200',
        description: 'Badminton player in action',
        project: 'Indian Athletes Recognition',
        status: 'available',
        metadata: {
            width: 1200,
            height: 1600,
            format: 'jpg',
            sport: 'badminton'
        }
    },
    {
        title: 'Football Player Training',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200',
        description: 'Football player during training session',
        project: 'Indian Athletes Recognition',
        status: 'available',
        metadata: {
            width: 1200,
            height: 1600,
            format: 'jpg',
            sport: 'football'
        }
    },
    {
        title: 'Runner Athlete',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200',
        description: 'Track and field athlete running',
        project: 'Indian Athletes Recognition',
        status: 'available',
        metadata: {
            width: 1200,
            height: 1600,
            format: 'jpg',
            sport: 'athletics'
        }
    },
    {
        title: 'Cricket Bowler Action',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1200',
        description: 'Cricket bowler in action',
        project: 'Indian Athletes Recognition',
        status: 'available',
        metadata: {
            width: 1200,
            height: 1600,
            format: 'jpg',
            sport: 'cricket'
        }
    },
    {
        title: 'Kabaddi Player',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1589487391730-58f20eb2c308?w=1200',
        description: 'Traditional Kabaddi player in action',
        project: 'Indian Athletes Recognition',
        status: 'available',
        metadata: {
            width: 1200,
            height: 1600,
            format: 'jpg',
            sport: 'kabaddi'
        }
    },
    {
        title: 'Hockey Player',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1593766787879-e8c78e09cec1?w=1200',
        description: 'Field hockey player with stick',
        project: 'Indian Athletes Recognition',
        status: 'available',
        metadata: {
            width: 1200,
            height: 1600,
            format: 'jpg',
            sport: 'hockey'
        }
    },
    {
        title: 'Tennis Player Serving',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=1200',
        description: 'Tennis player during serve',
        project: 'Indian Athletes Recognition',
        status: 'available',
        metadata: {
            width: 1200,
            height: 1600,
            format: 'jpg',
            sport: 'tennis'
        }
    },
    {
        title: 'Wrestling Athlete',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=1200',
        description: 'Wrestler in training session',
        project: 'Indian Athletes Recognition',
        status: 'available',
        metadata: {
            width: 1200,
            height: 1600,
            format: 'jpg',
            sport: 'wrestling'
        }
    },
    {
        title: 'Sprinter Starting Position',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200',
        description: 'Sprinter in starting blocks',
        project: 'Indian Athletes Recognition',
        status: 'available',
        metadata: {
            width: 1200,
            height: 1600,
            format: 'jpg',
            sport: 'athletics'
        }
    },
    {
        title: 'Volleyball Spike Action',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=1200',
        description: 'Volleyball player performing spike',
        project: 'Indian Athletes Recognition',
        status: 'available',
        metadata: {
            width: 1200,
            height: 1600,
            format: 'jpg',
            sport: 'volleyball'
        }
    },
    {
        title: 'Basketball Dribbling',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200',
        description: 'Basketball player dribbling',
        project: 'Indian Athletes Recognition',
        status: 'available',
        metadata: {
            width: 1200,
            height: 1600,
            format: 'jpg',
            sport: 'basketball'
        }
    },
    {
        title: 'Boxing Training Session',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=1200',
        description: 'Boxer training with punching bag',
        project: 'Indian Athletes Recognition',
        status: 'available',
        metadata: {
            width: 1200,
            height: 1600,
            format: 'jpg',
            sport: 'boxing'
        }
    },
    {
        title: 'Javelin Throw Athlete',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1200',
        description: 'Athlete preparing for javelin throw',
        project: 'Indian Athletes Recognition',
        status: 'available',
        metadata: {
            width: 1200,
            height: 1600,
            format: 'jpg',
            sport: 'athletics'
        }
    },
    {
        title: 'Yoga Athlete Training',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200',
        description: 'Yoga practitioner in training',
        project: 'Indian Athletes Recognition',
        status: 'available',
        metadata: {
            width: 1200,
            height: 1600,
            format: 'jpg',
            sport: 'yoga'
        }
    },
    {
        title: 'Table Tennis Player',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=1200',
        description: 'Table tennis player in action',
        project: 'Indian Athletes Recognition',
        status: 'available',
        metadata: {
            width: 1200,
            height: 1600,
            format: 'jpg',
            sport: 'table_tennis'
        }
    },
    {
        title: 'Swimming Athlete',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1200',
        description: 'Competitive swimmer training',
        project: 'Indian Athletes Recognition',
        status: 'available',
        metadata: {
            width: 1200,
            height: 1600,
            format: 'jpg',
            sport: 'swimming'
        }
    },
    {
        title: 'Weightlifting Champion',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=1200',
        description: 'Weightlifter performing clean and jerk',
        project: 'Indian Athletes Recognition',
        status: 'available',
        metadata: {
            width: 1200,
            height: 1600,
            format: 'jpg',
            sport: 'weightlifting'
        }
    },
    {
        title: 'Archery Competitor',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
        description: 'Archer aiming at target',
        project: 'Indian Athletes Recognition',
        status: 'available',
        metadata: {
            width: 1200,
            height: 1600,
            format: 'jpg',
            sport: 'archery'
        }
    },
    {
        title: 'Cycling Athlete',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=1200',
        description: 'Cyclist in racing position',
        project: 'Indian Athletes Recognition',
        status: 'available',
        metadata: {
            width: 1200,
            height: 1600,
            format: 'jpg',
            sport: 'cycling'
        }
    }
];

async function seedAssets() {
    try {
        console.log('🌱 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        console.log('🗑️  Clearing existing assets...');
        await Asset.deleteMany({});
        console.log('✅ Cleared existing assets');

        console.log('📦 Inserting sample assets...');
        const inserted = await Asset.insertMany(sampleAssets);
        console.log(`✅ Successfully inserted ${inserted.length} assets`);

        console.log('\n📊 Asset Summary:');
        inserted.forEach((asset, index) => {
            console.log(`  ${index + 1}. ${asset.title} (${asset.status})`);
        });

        console.log('\n🎉 Seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seedAssets();
