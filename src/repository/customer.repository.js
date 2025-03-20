import sql from "msnodesqlv8";
import { connectionString, queryDatabase } from "../config/db.js";

export const getAllCustomersRepository = async (
  sortBy = "FirstName",
  sortDirection = "asc",
  searchTerm = ""
) => {
  let query = `SELECT * FROM SalesLT.Customer WHERE 1=1`;

  const params = [];

  // Filtro de búsqueda por nombre o apellido
  if (searchTerm) {
    query += ` AND (FirstName LIKE ? OR LastName LIKE ?)`;
    params.push(`%${searchTerm}%`, `%${searchTerm}%`); // Agregar el parámetro de búsqueda para ambos campos
  }

  // Agregar ordenamiento
  query += ` ORDER BY ${sortBy} ${sortDirection.toUpperCase()}`;

  return new Promise((resolve, reject) => {
    sql.query(connectionString, query, params, (err, rows) => {
      if (err) {
        console.error("❌ Error al obtener clientes:", err);
        return reject(new Error("Error al obtener clientes de la base de datos"));
      }
      resolve(rows);
    });
  });
};

export const getCustomerByIdRepository = async (id) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM SalesLT.Customer WHERE CustomerID = ?";

    sql.query(connectionString, query, [id], (err, rows) => {
      if (err) {
        console.error("❌ Error al obtener cliente:", err);
        return reject(
          new Error("Error al obtener cliente de la base de datos")
        );
      }

      resolve(rows.length > 0 ? rows[0] : null);
    });
  });
};

export const createCustomerRepository = async (
  NameStyle,
  Title,
  FirstName,
  MiddleName,
  LastName,
  Suffix,
  CompanyName,
  SalesPerson,
  EmailAddress,
  Phone,
  PasswordHash,
  PasswordSalt
) => {
  return new Promise((resolve, reject) => {
    const checkQuery =
      "SELECT COUNT(*) AS count FROM SalesLT.Customer WHERE EmailAddress = ?";

    sql.query(connectionString, checkQuery, [EmailAddress], (err, result) => {
      if (err) {
        console.error("❌ Error en la consulta de verificación:", err);
        return reject(
          new Error("Error al verificar la existencia del cliente")
        );
      }

      if (result[0].count > 0) {
        return reject(
          new Error(`El cliente con EmailAddress: '${EmailAddress}' ya existe`)
        );
      }

      const insertQuery = `INSERT INTO SalesLT.Customer 
        (NameStyle, Title, FirstName, MiddleName, LastName, Suffix, CompanyName, SalesPerson, EmailAddress, Phone, PasswordHash, PasswordSalt) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      sql.query(
        connectionString,
        insertQuery,
        [
          NameStyle,
          Title,
          FirstName,
          MiddleName,
          LastName,
          Suffix,
          CompanyName,
          SalesPerson,
          EmailAddress,
          Phone,
          PasswordHash,
          PasswordSalt,
        ],
        (err, result) => {
          if (err) {
            console.error("❌ Error al insertar cliente:", err);
            return reject(
              new Error("Error al insertar el cliente en la base de datos")
            );
          }

          resolve({ message: "Cliente creado correctamente", result });
        }
      );
    });
  });
};

export const updateCustomerRepository = async (
  id,
  NameStyle,
  Title,
  FirstName,
  MiddleName,
  LastName,
  Suffix,
  CompanyName,
  SalesPerson,
  EmailAddress,
  Phone,
  PasswordHash,
  PasswordSalt
) => {
  return new Promise((resolve, reject) => {
    // Primero verificamos si el cliente existe
    const checkQuery = `SELECT COUNT(*) AS count FROM SalesLT.Customer WHERE CustomerID = ?`;

    sql.query(connectionString, checkQuery, [id], (checkErr, checkResult) => {
      if (checkErr) {
        console.error("❌ Error al verificar cliente:", checkErr);
        return reject(new Error("Error al verificar si el cliente existe"));
      }

      // Verificar si el cliente existe
      const exists = checkResult && checkResult[0] && checkResult[0].count > 0;

      if (!exists) {
        console.error(
          `❌ El cliente con ID ${id} no existe en la base de datos`
        );
        return reject(new Error("El cliente no existe en la base de datos"));
      }

      // Si el cliente existe, proceder con la actualización
      const updateQuery = `
        UPDATE SalesLT.Customer
        SET NameStyle = ?, 
            Title = ?, 
            FirstName = ?, 
            MiddleName = ?,
            LastName = ?, 
            Suffix = ?, 
            CompanyName = ?, 
            SalesPerson = ?,
            EmailAddress = ?, 
            Phone = ?, 
            PasswordHash = ?, 
            PasswordSalt = ?
        WHERE CustomerID = ?`;

      const values = [
        NameStyle,
        Title,
        FirstName,
        MiddleName,
        LastName,
        Suffix,
        CompanyName,
        SalesPerson,
        EmailAddress,
        Phone,
        PasswordHash,
        PasswordSalt,
        id,
      ];

      sql.query(connectionString, updateQuery, values, (updateErr) => {
        if (updateErr) {
          console.error("❌ Error al actualizar cliente:", updateErr);
          return reject(
            new Error("Error al actualizar el cliente en la base de datos")
          );
        }

        // Si no hay error, asumimos que la actualización fue exitosa
        resolve({
          message: "Cliente actualizado correctamente",
          customerId: id,
        });
      });
    });
  });
};

export const deleteCustomerRepository = async (id) => {
  return new Promise((resolve, reject) => {
    const deleteQuery = `DELETE FROM SalesLT.Customer WHERE CustomerID = ?`;

    sql.query(connectionString, deleteQuery, [id], (err, result) => {
      if (err) {
        console.error("❌ Error al eliminar cliente:", err);
        return reject(new Error("Error al eliminar el cliente"));
      }

      if (result.rowsAffected === 0) {
        return reject(new Error("El cliente no existe o ya fue eliminado"));
      }

      resolve({ message: "Cliente eliminado correctamente" });
    });
  });
};