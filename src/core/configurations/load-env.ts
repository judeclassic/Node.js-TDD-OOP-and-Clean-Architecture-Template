import dotEnv from 'dotenv'

const loadEnv = () => {
    dotEnv.config();

    if (process.env.NODE_ENV == 'development') {
        dotEnv.config({ path: '../.env'});
    }
    if (process.env.APP_NAME == null){
        throw new Error('APP_NAME environment variable missing.');
    }
}

export default loadEnv;