
export default {
    "type": "postgres",
    "host": process.env.DB_HOST || "172.17.0.3",
    "port": process.env.DB_PORT || 5432,
    "username": process.env.DB_USERNAME || 'postgres',
    "password": process.env.DB_PASSWORD || 'postgres',
    "database": process.env.DB_DATABASE || 'database_db',
    "entities": [__dirname + '/../**/*.entity.{js,ts}'],
    "synchronize": true,
    "logging": true,
 }