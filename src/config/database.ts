import * as mongoose from 'mongoose';
import { stringUrl } from './secrets.json'

export default class DatabaseConfig {
    public static config() {
        mongoose
            .connect(stringUrl,
                {
                    useNewUrlParser: true,
                    useCreateIndex: true,
                    useFindAndModify: true
                })
            // .connect('mongodb://localhost:27017/warriors', { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: true })
            .then(res => {
                console.log("Conectado com sucesso!")
            })
            .catch(err => {
                console.log(err)
            })
    }
}