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
//Ventas Totales por Año y Mes:
export const getMonthlySalesReport = async () => {
  const query = `
    SELECT 
      YEAR(OrderDate) AS Year,
      MONTH(OrderDate) AS Month,
      COUNT(SalesOrderID) AS TotalOrders,
      SUM(TotalDue) AS TotalSales,
      SUM(SubTotal) AS SubTotalSales,
      SUM(TaxAmt) AS TotalTax,
      SUM(Freight) AS TotalFreight
    FROM SalesOrderHeader
    GROUP BY YEAR(OrderDate), MONTH(OrderDate)
    ORDER BY Year, Month;
  `;

  return new Promise((resolve, reject) => {
    sql.query(connectionString, query, (err, rows) => {
      if (err) {
        console.error("❌ Error al obtener el reporte mensual de ventas:", err);
        return reject(new Error("Error al obtener datos de la base de datos"));
      }
      resolve(rows);
    });
  });
};

//Ventas por Categoría de Producto:
export const getSalesByCategory = async () => {
  const query = `
    SELECT 
      pc.Name AS ProductCategory,
      COUNT(DISTINCT soh.SalesOrderID) AS TotalOrders,
      SUM(sod.OrderQty) AS TotalQuantitySold,
      SUM(soh.TotalDue) AS TotalSales
    FROM SalesOrderHeader soh
    JOIN SalesOrderDetail sod ON soh.SalesOrderID = sod.SalesOrderID
    JOIN Product p ON sod.ProductID = p.ProductID
    JOIN ProductCategory pc ON p.ProductCategoryID = pc.ProductCategoryID
    GROUP BY pc.Name
    ORDER BY TotalSales DESC;
  `;

  return new Promise((resolve, reject) => {
    sql.query(connectionString, query, (err, rows) => {
      if (err) {
        console.error("❌ Error al obtener ventas por categoría:", err);
        return reject(new Error("Error al obtener datos de la base de datos"));
      }
      resolve(rows);
    });
  });
};

//Tiempo Promedio de Envío:
export const getAvgShippingTimeRepository = async () => {
  const query = `
    SELECT 
      AVG(DATEDIFF(day, OrderDate, ShipDate)) AS AvgShippingDays
    FROM SalesLT.SalesOrderHeader
    WHERE ShipDate IS NOT NULL;
  `;

  return new Promise((resolve, reject) => {
    sql.query(connectionString, query, (err, rows) => {
      if (err) {
        console.error("❌ Error al obtener el tiempo promedio de envío:", err);
        return reject(new Error("Error al calcular el tiempo de envío"));
      }
      resolve(rows[0]); // Devuelve un solo valor
    });
  });
};

//Mes con más ventas
export const getTopSalesMonthRepository = async () => {
  const query = `
    SELECT 
      YEAR(OrderDate) AS Year,
      MONTH(OrderDate) AS Month,
      COUNT(SalesOrderID) AS TotalOrders,
      SUM(TotalDue) AS TotalSales
    FROM SalesLT.SalesOrderHeader
    GROUP BY YEAR(OrderDate), MONTH(OrderDate)
    ORDER BY TotalSales DESC
    LIMIT 1;
  `;

  return new Promise((resolve, reject) => {
    sql.query(connectionString, query, (err, rows) => {
      if (err) {
        console.error("❌ Error al obtener el mes con más ventas:", err);
        return reject(new Error("Error al calcular el mes con más ventas"));
      }
      resolve(rows[0]); // Devuelve solo el mes con más ventas
    });
  });
};

