import mongoose from 'mongoose';

export default class DatabaseConfig {
    static config() {
        mongoose
            .connect(process.env.STRING_URL,
                {
                    useNewUrlParser: true,
                    useCreateIndex: true,
                    useFindAndModify: true,
                    useUnifiedTopology: true
                })
            .then(res => {
                console.log("Conectado com sucesso!")
            })
            .catch(err => {
                console.log(err)
            })
    }
}