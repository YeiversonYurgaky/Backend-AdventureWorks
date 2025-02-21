import dotenv from "dotenv";
import sql from "msnodesqlv8";

dotenv.config();

// Define la cadena de conexión UNA SOLA VEZ
export const connectionString = `Driver=${process.env.DB_DRIVER};Server=${process.env.DB_SERVER};Database=${process.env.DB_NAME};Trusted_Connection=${process.env.DB_TRUSTED_CONNECTION};`;

export const queryDatabase = (query, params = []) => {
  return new Promise((resolve, reject) => {
    sql.query(connectionString, query, params, (err, rows) => {
      if (err) {
        console.error("❌ Error en la consulta:", err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// Conexión inicial para verificar que funciona el servidor
export const connectDB = () => {
  sql.query(connectionString, "SELECT 1", (err) => {
    if (err) {
      console.error("❌ Error al conectar a la base de datos:", err);
    } else {
      console.log("✅ Conexión a SQL Server exitosa");
    }
  });
};


