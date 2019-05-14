import * as mongoose from 'mongoose';

export default class DatabaseConfig{
    public static config(){
        mongoose.connect('mongodb://localhost:27017/the-fighter', {useNewUrlParser:true})
    }
}