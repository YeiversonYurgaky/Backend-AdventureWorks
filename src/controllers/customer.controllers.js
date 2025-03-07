import {
    createCustomerRepository,
    deleteCustomerRepository,
    getAllCustomersRepository,
    getCustomerByIdRepository,
    updateCustomerRepository,
  } from "../repository/customer.repository.js";
  import { Response } from "../utils/response.js";
  
  const getAllCustomersController = async (req, res) => {
    let responseObj = { ...Response };
  
    try {
      const customers = await getAllCustomersRepository();
  
      responseObj.status = 200;
      responseObj.message = "Clientes obtenidos correctamente";
      responseObj.result = customers;
  
      res.status(200).json(responseObj);
    } catch (error) {
      responseObj.status = 500;
      responseObj.message = "Error al obtener clientes";
      responseObj.result = error.message || "Error desconocido";
  
      res.status(500).json(responseObj);
    }
  };
  
  const getCustomerByIdController = async (req, res) => {
    let responseObj = { ...Response };
    const customerId = parseInt(req.params.id, 10);
  
    if (isNaN(customerId)) {
      responseObj.status = 400;
      responseObj.message = "ID de cliente inválido";
      responseObj.result = null;
  
      return res.status(400).json(responseObj);
    }
  
    try {
      const customer = await getCustomerByIdRepository(customerId);
  
      if (!customer) {
        responseObj.status = 404;
        responseObj.message = "Cliente no encontrado";
        responseObj.result = null;
  
        return res.status(404).json(responseObj);
      }
  
      responseObj.status = 200;
      responseObj.message = "Cliente obtenido correctamente";
      responseObj.result = customer;
  
      res.status(200).json(responseObj);
    } catch (error) {
      responseObj.status = 500;
      responseObj.message = "Error al obtener cliente";
      responseObj.result = error.message || "Error desconocido";
  
      res.status(500).json(responseObj);
    }
  };
  
  const createCustomerController = async (req, res) => {
    let responseObj = { ...Response };
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
  
    if (!FirstName || !LastName || !EmailAddress) {
      responseObj.status = 400;
      responseObj.message = "Faltan datos requeridos";
      responseObj.result = "Campos obligatorios: FirstName, LastName, EmailAddress";
      return res.status(400).json(responseObj);
    }
  
    try {
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
  
      responseObj.status = 201;
      responseObj.message = "Cliente creado correctamente";
      responseObj.result = newCustomer;
      res.status(201).json(responseObj);
    } catch (error) {
      responseObj.status = 500;
      responseObj.message = "Error al crear cliente";
      responseObj.result = error.message || "Error desconocido";
      res.status(500).json(responseObj);
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
    getAllCustomersController,
    getCustomerByIdController,
    createCustomerController,
    updateCustomerController,
    deleteCustomerController,
  };