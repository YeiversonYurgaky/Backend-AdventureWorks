import {
    createCustomerRepository,
    deleteCustomerRepository,
    getAllCustomersRepository,
    updateCustomerRepository,
  } from "../repository/customer.repository.js";
  import { Response } from "../utils/response.js";
  
  // const getAllCustomersController = async (req, res) => {
  //   let responseObj = { ...Response };
  
  //   try {
  //     const customers = await getAllCustomersRepository();
  
  //     responseObj.status = 200;
  //     responseObj.message = "Clientes obtenidos correctamente";
  //     responseObj.result = customers;
  
  //     res.status(200).json(responseObj);
  //   } catch (error) {
  //     responseObj.status = 500;
  //     responseObj.message = "Error al obtener clientes";
  //     responseObj.result = error.message || "Error desconocido";
  
  //     res.status(500).json(responseObj);
  //   }
  // };

const createCustomerController = async (req, res) => {
  let responseObj = { ...Response };

  // Extraer los datos del cuerpo de la solicitud
  const {
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
  } = req.body;

  // Validar que los campos obligatorios estén presentes
  if (!FirstName || !LastName || !EmailAddress) {
    responseObj.status = 400;
    responseObj.message = "Faltan datos requeridos";
    responseObj.result = "Campos obligatorios: FirstName, LastName, EmailAddress";
    return res.status(400).json(responseObj);
  }

  try {
    // Llamar al repositorio para crear el cliente
    const newCustomer = await createCustomerRepository(
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
    );

    // Responder con éxito
    responseObj.status = 201;
    responseObj.message = "Cliente creado correctamente";
    responseObj.result = newCustomer;
    res.status(201).json(responseObj);
  } catch (error) {
    // Manejar errores
    console.error("Error al crear cliente:", error);
    responseObj.status = 500;
    responseObj.message = "Error al crear cliente";
    responseObj.result = error.message || "Error desconocido";
    res.status(500).json(responseObj);
  }
};
  
  const getCustomers = async (req, res) => {
    try {
      const sortBy = req.query.sortBy || "FirstName";
      const sortDirection = req.query.sortDirection || "asc";
      const searchTerm = req.query.searchTerm || "";
  
      const customers = await getAllCustomersRepository(sortBy, sortDirection, searchTerm);
      res.status(200).json({
        status: 200,
        message: "Clientes obtenidos correctamente",
        result: customers,
      });
    } catch (error) {
      console.error("Error al obtener clientes:", error);
      res.status(500).json({
        status: 500,
        message: "Error al obtener clientes",
      });
    }
  };
  
  const updateCustomerController = async (req, res) => {
    let { id } = req.params;
    const {
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
    } = req.body;
  
    let responseObj = { ...Response };
    id = parseInt(id, 10);
  
    if (!id || !FirstName || !LastName || !EmailAddress) {
      responseObj.status = 400;
      responseObj.message = "Faltan datos requeridos";
      responseObj.result = "Campos obligatorios: id, FirstName, LastName, EmailAddress";
      return res.status(400).json(responseObj);
    }
  
    try {
      const result = await updateCustomerRepository(
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
      );
  
      responseObj.status = 200;
      responseObj.message = result.message;
      responseObj.result = result;
      return res.status(200).json(responseObj);
    } catch (error) {
      responseObj.status = 500;
      responseObj.message = "Error al actualizar cliente";
      responseObj.result = error.message || "Error desconocido";
      return res.status(500).json(responseObj);
    }
  };
  
  const deleteCustomerController = async (req, res) => {
    const { id } = req.params;
    let responseObj = { ...Response };
  
    if (!id) {
      responseObj.status = 400;
      responseObj.message = "Falta el ID del cliente";
      responseObj.result = "El ID es obligatorio";
      return res.status(400).json(responseObj);
    }
  
    try {
      const result = await deleteCustomerRepository(id);
      responseObj.status = 200;
      responseObj.message = result.message;
      responseObj.result = { id };
      return res.status(200).json(responseObj);
    } catch (error) {
      responseObj.status = 500;
      responseObj.message = error.message;
      responseObj.result = null;
      return res.status(500).json(responseObj);
    }
  };
  
  export default {
    // getAllCustomersController,
    createCustomerController,
    updateCustomerController,
    deleteCustomerController,
    getCustomers
  };