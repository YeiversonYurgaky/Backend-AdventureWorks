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

export const getSalesOrderHeaderByIdRepository = async (id) => {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM SalesLT.SalesOrderHeader WHERE SalesOrderID = ?";
  
      sql.query(connectionString, query, [id], (err, rows) => {
        if (err) {
          console.error("❌ Error al obtener pedido:", err);
          return reject(
            new Error("Error al obtener pedido de la base de datos")
          );
        }
  
        resolve(rows.length > 0 ? rows[0] : null);
      });
    });
  };

  export const createSalesOrderHeaderRepository = async (
    RevisionNumber,
    OrderDate,
    DueDate,
    ShipDate,
    Status,
    SalesOrderNumber,
    PurchaseOrderNumber,
    AccountNumber,
    CustomerID,
    ShipToAddressID
  ) => {
    return new Promise((resolve, reject) => {
      const checkQuery =
        "SELECT COUNT(*) AS count FROM SalesLT.SalesOrderHeader WHERE RevisionNumber = ?";
  
      sql.query(connectionString, checkQuery, [RevisionNumber], (err, result) => {
        if (err) {
          console.error("❌ Error en la consulta de verificación:", err);
          return reject(
            new Error("Error al verificar la existencia del pedido")
          );
        }
  
        if (result[0].count > 0) {
          return reject(new Error(`El pedido con Number: '${RevisionNumber}' ya existe`));
        }
  
        const insertQuery = `INSERT INTO SalesLT.SalesOrderHeader 
          (RevisionNumber, OrderDate, DueDate, ShipDate, Status, SalesOrderNumber, PurchaseOrderNumber, AccountNumber, CustomerID, ShipToAddressID) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        sql.query(
         connectionString,
         insertQuery,
         [
            RevisionNumber,
            OrderDate,
            DueDate,
            ShipDate,
            Status,
            SalesOrderNumber,
            PurchaseOrderNumber,
            AccountNumber,
            CustomerID,
            ShipToAddressID,
         ],
         (err, result) => {
            if (err) {
              console.error("❌ Error al insertar el pedido:", err);
              return reject(
                new Error("Error al insertar el pedido en la base de datos")
              );
            }
  
            resolve({ message: "Pedido creado correctamente", result });
          }
        );
      });
    });
  };

  export const updateSalesOrderHeaderRepository = async (
    id,
    RevisionNumber,
    OrderDate,
    DueDate,
    ShipDate,
    Status,
    SalesOrderNumber,
    PurchaseOrderNumber,
    AccountNumber,
    CustomerID,
    ShipToAddressID
  )=> {
    return new Promise((resolve, reject) => {
      // Primero verificamos si el pedido existe
      const checkQuery = `SELECT COUNT(*) AS count FROM SalesLT.SalesOrderHeader WHERE SalesOrderID = ?`;
  
      sql.query(connectionString, checkQuery, [id], (checkErr, checkResult) => {
        if (checkErr) {
          console.error("❌ Error al verificar pedido:", checkErr);
          return reject(new Error("Error al verificar si el pedido existe"));
        }
  
        // Verificar si el pedido existe
        const exists = checkResult && checkResult[0] && checkResult[0].count > 0;
  
        if (!exists) {
          console.error(
            `❌ El pedido con ID ${id} no existe en la base de datos`
          );
          return reject(new Error("El pedido no existe en la base de datos"));
        }
        // Si el pedido existe, proceder con la actualización
      const updateQuery = `
      UPDATE SalesLT.SalesOrderHeader
      
      SET RevisionNumber = ?,
        OrderDate = ?,
        DueDate = ?,
        ShipDate = ?,
        Status = ?,
        SalesOrderNumber = ?,
        PurchaseOrderNumber = ?,
        AccountNumber = ?,
        CustomerID = ?,
        ShipToAddressID = ?
     WHERE SalesOrderID = ?`;
      
    const values = [
        RevisionNumber,
        OrderDate,
        DueDate,
        ShipDate,
        Status,
        SalesOrderNumber,
        PurchaseOrderNumber,
        AccountNumber,
        CustomerID,
        ShipToAddressID,
        id,
    ];

    sql.query(connectionString, updateQuery, values, (updateErr) => {
      if (updateErr) {
        console.error("❌ Error al actualizar pedido:", updateErr);
        return reject(
          new Error("Error al actualizar el pedido en la base de datos")
        );
      }

      // Si no hay error, asumimos que la actualización fue exitosa
      resolve({
        message: "Pedido actualizado correctamente",
        SalesOrderid: id,
      });
    });
  });
});
};

export const deleteSalesOrderHeaderRepository = async (id) => {
return new Promise((resolve, reject) => {
  const deleteQuery = `DELETE FROM SalesLT.SalerOrderHeader WHERE SalesOrderID = ?`;

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
