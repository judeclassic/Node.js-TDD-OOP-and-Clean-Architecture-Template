/* eslint-disable no-undef */
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import ConfigInterface from '@core/interfaces/others/config';
import { defaultLogger } from '../../developement/logger';

class DBConnection{
    mongoose: typeof mongoose;
    mongod: any;
    dbUrl: string

    constructor() {
        this.mongoose = mongoose;
        this.dbUrl = '';
    }

    private connectForTest = async () => {
        // if (process.env.NODE_ENV === 'test') {
            this.mongod = await MongoMemoryServer.create();
            this.dbUrl = this.mongod.getUri();
        // }
    }

    connect = async ({config} : {config: ConfigInterface}) => {
        try{
            this.dbUrl = config.db.url;
            await this.connectForTest();
            await this.mongoose.connect(this.dbUrl);
            this.mongoose.connection.once('open', (err) => {
                defaultLogger.info(`${config.name} database connected successfully`);
            })
        }catch(err){
            defaultLogger.error(`Error: ${err}`);
            setTimeout(()=>{
                process.exit(1);
            }, 5000);
        }
    }

    close = async () => {
        try {
            await this.mongoose.connection.close();
            if (this.mongod) {
              await this.mongod.stop();
            }
          } catch (err) {
            console.log(err);
            process.exit(1);
          }
    }
}

export default DBConnection;