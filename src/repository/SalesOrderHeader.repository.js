import sql from "msnodesqlv8";
import { connectionString } from "../config/db.js";

export const getAllSalesOrderHeaderRepository = async () => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM SalesLT.SalesOrderHeader";

    sql.query(connectionString, query, (err, rows) => {
      if (err) {
        console.error("❌ Error al obtener pedido de venta:", err);
        return reject(
          new Error("Error al obtener pedidos de la base de datos")
        );
      }
      resolve(rows);
    });
  });
};

export const deleteSalesOrderHeaderRepository = async (id) => {
  return new Promise((resolve, reject) => {
    const deleteQuery = `DELETE FROM SalesLT.SalesOrderHeader WHERE SalesOrderID = ?`;

    sql.query(connectionString, deleteQuery, [id], (err, result) => {
      if (err) {
        console.error("❌ Error al eliminar pedido:", err);
        return reject(new Error("Error al eliminar el pedido"));
      }

      if (result.rowsAffected === 0) {
        return reject(new Error("El pedido no existe o ya fue eliminado"));
      }

      resolve({ message: "Pedido eliminado correctamente" });
    });
  });
};
