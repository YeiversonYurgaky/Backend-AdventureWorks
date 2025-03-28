import sql from "msnodesqlv8";
import { connectionString } from "../config/db.js";

export const getAllSalesOrderHeaderRepository = async (customerId = null) => {
  return new Promise((resolve, reject) => {
    let query = `
      SELECT 
        soh.*, 
        c.NameStyle, 
        c.LastName
      FROM SalesLT.SalesOrderHeader soh
      JOIN SalesLT.Customer c ON soh.CustomerID = c.CustomerID
    `;

    const params = [];

    // Filtro por CustomerID si se proporciona
    if (customerId) {
      query += ` WHERE soh.CustomerID = ?`;
      params.push(customerId);
    }

    sql.query(connectionString, query, params, (err, rows) => {
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