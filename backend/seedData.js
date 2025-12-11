const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Asset Schema
const assetSchema = new mongoose.Schema({
    type: { type: String, enum: ['image', 'text'], required: true },
    url: String,
    textContent: String,
    title: String,
    project: String,
    description: String,
    status: { type: String, enum: ['available', 'in_progress', 'completed', 'claimed'], default: 'available' },
    claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    claimedAt: Date,
    completedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    completedAt: Date,
    metadata: mongoose.Schema.Types.Mixed
}, { timestamps: true });

const Asset = mongoose.model('Asset', assetSchema);

// Sample data with CORS-friendly Unsplash images
const sampleAssets = [
    {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800',
        title: 'Dog Photo',
        project: 'Animal Classification',
        description: 'Beagle dog for object detection',
        status: 'available',
        metadata: { source: 'Unsplash' }
    },
    {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800',
        title: 'Cat Photo',
        project: 'Animal Classification',
        description: 'Cat for classification',
        status: 'available',
        metadata: { source: 'Unsplash' }
    },
    {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1511044568932-338cba0ad803?w=800',
        title: 'Car Image',
        project: 'Vehicle Detection',
        description: 'Car for object detection',
        status: 'available',
        metadata: { source: 'Unsplash' }
    },
    {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800',
        title: 'Street Scene',
        project: 'Urban Analysis',
        description: 'Street scene for object detection',
        status: 'available',
        metadata: { source: 'Unsplash' }
    },
    {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',
        title: 'Portrait',
        project: 'Face Detection',
        description: 'Portrait for facial features',
        status: 'available',
        metadata: { source: 'Unsplash' }
    },
    {
        type: 'text',
        textContent: 'The quick brown fox jumps over the lazy dog. This is a sample sentence for sentiment analysis.',
        title: 'Sample Text 1',
        project: 'Sentiment Analysis',
        description: 'Text for sentiment classification',
        status: 'available',
        metadata: { category: 'Sample' }
    },
    {
        type: 'text',
        textContent: 'Machine learning is transforming the way we process and analyze data in modern applications.',
        title: 'ML Text',
        project: 'Text Classification',
        description: 'Technology text',
        status: 'available',
        metadata: { category: 'Technology' }
    },
    {
        type: 'text',
        textContent: 'Climate change is one of the most pressing challenges facing humanity today.',
        title: 'Climate Text',
        project: 'Topic Classification',
        description: 'Environmental topic',
        status: 'available',
        metadata: { category: 'Environment' }
    }
];

async function seedDatabase() {
    try {
        // Clear existing assets
        await Asset.deleteMany({});
        console.log('✓ Cleared existing assets');

        // Insert sample assets
        const inserted = await Asset.insertMany(sampleAssets);
        console.log(`\n✅ Successfully added ${inserted.length} sample assets!\n`);

        console.log('Sample assets:');
        inserted.forEach((asset, i) => {
            if (asset.type === 'image') {
                console.log(`${i + 1}. [IMAGE] ${asset.title} - ${asset.project}`);
            } else {
                console.log(`${i + 1}. [TEXT]  ${asset.title} - ${asset.project}`);
            }
        });

        console.log('\n🎉 Database seeded! Refresh your dashboard to see assets.');
        console.log('💡 All images use CORS-friendly Unsplash URLs\n');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
