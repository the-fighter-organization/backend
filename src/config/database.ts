import * as mongoose from 'mongoose';

export default class DatabaseConfig {
    public static config() {
        mongoose
            // .connect('mongodb+srv://admin:Pj94FLdGncumi3e@warrior-e4g7m.gcp.mongodb.net/test?retryWrites=true',
            //     {
            //         useNewUrlParser: true,
            //         useCreateIndex: true,
            //         useFindAndModify:true
            //     })
            .connect('mongodb://localhost:27017/warriors', { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: true })
            .then(res => {
                console.log("Conectado com sucesso!")
            })
            .catch(err => {
                console.log(err)
            })
    }
}