import { Sequelize } from "sequelize";
const conexion = new Sequelize (
    'SchoolProject_BD',
    'postgres',
    '1234',
    {
        host:'localhost',
        port: 5432,
        dialect: 'postgres',
        /*
        dialectOptions: {
            ssl: {
              require: true,
              rejectUnauthorized: false  // Opciones adicionales para evitar errores de certificado (no recomendado en producción)
            }
          },*/
    }
);
export default conexion;   