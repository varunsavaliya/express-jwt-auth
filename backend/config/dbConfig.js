import mongoose from 'mongoose';


const connectDb = async () => {
    const MONGODB_URL = process.env.MONGODB_URL;
    try {
        if (!MONGODB_URL) {
            throw new Error('MONGODB_URL is not defined in the environment.');
        }

        await mongoose.connect(MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log(`DB connection successful: ${mongoose.connection.host}`);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

export default connectDb;
