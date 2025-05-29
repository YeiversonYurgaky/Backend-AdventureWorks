import sql from "msnodesqlv8";
import { connectionString } from "../config/db.js";

//Top 10 Productos Más Vendidos por Cantidad:
export const getTopSellingProducts = async () => {
  const query = `
    SELECT TOP 10
      p.Name AS ProductName,
      SUM(sod.OrderQty) AS TotalQuantity,
      SUM(sod.LineTotal) AS TotalRevenue
    FROM SalesLT.SalesOrderDetail sod
    JOIN SalesLT.Product p ON sod.ProductID = p.ProductID
    GROUP BY p.Name
    ORDER BY TotalRevenue DESC;
  `;

  return new Promise((resolve, reject) => {
    sql.query(connectionString, query, (err, rows) => {
      if (err) {
        console.error("❌ Error al obtener los productos más vendidos:", err);
        return reject(new Error("Error al obtener datos de la base de datos"));
      }
      resolve(rows);
    });
  });
};
