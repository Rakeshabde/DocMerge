import mongoose from 'mongoose';

const Connection = async (username = 'rakeshabde', password = '727220000') => {
    const URL = `mongodb://${username}:${password}@ac-eumk4d5-shard-00-00.erbaapc.mongodb.net:27017,ac-eumk4d5-shard-00-01.erbaapc.mongodb.net:27017,ac-eumk4d5-shard-00-02.erbaapc.mongodb.net:27017/?ssl=true&replicaSet=atlas-7qxe0t-shard-0&authSource=admin&retryWrites=true&w=majority`;

    try{
        await mongoose.connect(URL, { useUnifiedTopology: true, useNewUrlParser: true});
        console.log('Database connected successfully')
    }catch(error){
        console.log('Error while connecting with the database',error);
    }
}

export default Connection;