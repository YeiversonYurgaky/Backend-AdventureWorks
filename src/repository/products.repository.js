import sql from "msnodesqlv8";
import { connectionString, queryDatabase } from "../config/db.js";

export const getAllProductsRepository = async (
  sortBy = "name",
  sortDirection = "asc",
  categoryId = null,
  searchTerm = ""
) => {
  let query = `SELECT * FROM SalesLT.Product WHERE 1=1`;

  const params = [];

  // Filtro de búsqueda por nombre
  if (searchTerm) {
    query += ` AND Name LIKE ?`;
    params.push(`%${searchTerm}%`);
  }

  // Filtro por categoría
  if (categoryId) {
    query += ` AND ProductCategoryID = ?`;
    params.push(categoryId);
  }

  // Ordenamiento
  const direction = sortDirection.toUpperCase() === "DESC" ? "DESC" : "ASC";

  switch (sortBy.toLowerCase()) {
    case "listprice":
      query += ` ORDER BY ListPrice ${direction}`;
      break;
    case "standardcost":
      query += ` ORDER BY StandardCost ${direction}`;
      break;
    case "name":
    default:
      query += ` ORDER BY Name ${direction}`;
      break;
  }

  try {
    return await queryDatabase(query, params);
  } catch (error) {
    console.error("Error en productRepository.getProducts:", error);
    throw error;
  }
};

export const getCategoriesRepository = async () => {
  const query = `SELECT ProductCategoryID, Name FROM SalesLT.ProductCategory`;

  try {
    return await queryDatabase(query);
  } catch (error) {
    console.error("Error en productRepository.getCategories:", error);
    throw error;
  }
};

export const createProductRepository = async (
  Name,
  ProductNumber,
  Color,
  StandardCost,
  ListPrice,
  Size,
  Weight,
  ProductCategoryID,
  ProductModelID,
  SellStartDate
) => {
  return new Promise((resolve, reject) => {
    const checkQuery =
      "SELECT COUNT(*) AS count FROM SalesLT.Product WHERE Name = ?";

    sql.query(connectionString, checkQuery, [Name], (err, result) => {
      if (err) {
        console.error("❌ Error en la consulta de verificación:", err);
        return reject(
          new Error("Error al verificar la existencia del producto")
        );
      }

      if (result[0].count > 0) {
        return reject(new Error(`El producto con Name: '${Name}' ya existe`));
      }

      const insertQuery = `INSERT INTO SalesLT.Product 
        (Name, ProductNumber, Color, StandardCost, ListPrice, Size, Weight, ProductCategoryID, ProductModelID, SellStartDate) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      sql.query(
        connectionString,
        insertQuery,
        [
          Name,
          ProductNumber,
          Color,
          StandardCost,
          ListPrice,
          Size,
          Weight,
          ProductCategoryID,
          ProductModelID,
          SellStartDate,
        ],
        (err, result) => {
          if (err) {
            console.error("❌ Error al insertar producto:", err);
            return reject(
              new Error("Error al insertar el producto en la base de datos")
            );
          }

          resolve({ message: "Producto creado correctamente", result });
        }
      );
    });
  });
};

export const updateProductRepository = async (
  id,
  Name,
  ProductNumber,
  Color,
  StandardCost,
  ListPrice,
  Size,
  Weight,
  ProductCategoryID,
  ProductModelID
) => {
  return new Promise((resolve, reject) => {
    // Primero verificamos si el producto existe
    const checkQuery = `SELECT COUNT(*) AS count FROM SalesLT.Product WHERE ProductID = ?`;

    sql.query(connectionString, checkQuery, [id], (checkErr, checkResult) => {
      if (checkErr) {
        console.error("❌ Error al verificar producto:", checkErr);
        return reject(new Error("Error al verificar si el producto existe"));
      }

      // Verificar si el producto existe
      const exists = checkResult && checkResult[0] && checkResult[0].count > 0;

      if (!exists) {
        console.error(
          `❌ El producto con ID ${id} no existe en la base de datos`
        );
        return reject(new Error("El producto no existe en la base de datos"));
      }

      // Si el producto existe, proceder con la actualización
      const updateQuery = `
        UPDATE SalesLT.Product
        SET Name = ?, 
            ProductNumber = ?, 
            Color = ?, 
            StandardCost = ?,
            ListPrice = ?, 
            Size = ?, 
            Weight = ?, 
            ProductCategoryID = ?, 
            ProductModelID = ?
        WHERE ProductID = ?`;

      const values = [
        Name,
        ProductNumber,
        Color,
        StandardCost,
        ListPrice,
        Size,
        Weight,
        ProductCategoryID,
        ProductModelID,
        id,
      ];

      sql.query(connectionString, updateQuery, values, (updateErr) => {
        if (updateErr) {
          console.error("❌ Error al actualizar producto:", updateErr);
          return reject(
            new Error("Error al actualizar el producto en la base de datos")
          );
        }

        // Si no hay error, asumimos que la actualización fue exitosa
        resolve({
          message: "Producto actualizado correctamente",
          productId: id,
        });
      });
    });
  });
};

export const deleteProductRepository = async (id) => {
  return new Promise((resolve, reject) => {
    const deleteQuery = `DELETE FROM SalesLT.Product WHERE ProductID = ?`;

    sql.query(connectionString, deleteQuery, [id], (err, result) => {
      if (err) {
        console.error("❌ Error al eliminar producto:", err);
        return reject(new Error("Error al eliminar el producto"));
      }

      if (result.rowsAffected === 0) {
        return reject(new Error("El producto no existe o ya fue eliminado"));
      }

      resolve({ message: "Producto eliminado correctamente" });
    });
  });
};
