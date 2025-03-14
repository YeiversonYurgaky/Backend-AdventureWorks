import {
  createSalesOrderHeaderRepository,
  deleteSalesOrderHeaderRepository,
  getAllSalesOrderHeaderRepository,
  getSalesOrderHeaderByIdRepository,
  updateSalesOrderHeaderRepository,
} from "../repository/SalesOrderHeader.repository.js";
import { Response } from "../utils/response.js";

const getAllSalesOrderHeaderController = async (req, res) => {
  let responseObj = { ...Response };

  try {
    const SalesOrderHeader = await getAllSalesOrderHeaderRepository();

    responseObj.status = 200;
    responseObj.message = "Pedidos obtenidos correctamente";
    responseObj.result = SalesOrderHeader;

    res.status(200).json(responseObj);
  } catch (error) {
    responseObj.status = 500;
    responseObj.message = "Error al obtener pedidos";
    responseObj.result = error.message || "Error desconocido";

    res.status(500).json(responseObj);
  }
};

const getSalesOrderHeaderByIdController = async (req, res) => {
  let responseObj = { ...Response };
  const salesOrderID = parseInt(req.params.id, 10);

  if (isNaN(salesOrderID)) {
    responseObj.status = 400;
    responseObj.message = "ID de pedido inválido";
    responseObj.result = null;

    return res.status(400).json(responseObj);
  }

  try {
    const SalesOrderHeader = await getSalesOrderHeaderByIdRepository(salesOrderID);

    if (!SalesOrderHeader) {
      responseObj.status = 404;
      responseObj.message = "Pedido no encontrado";
      responseObj.result = null;

      return res.status(404).json(responseObj);
    }

    responseObj.status = 200;
    responseObj.message = "Pedido obtenido correctamente";
    responseObj.result = product;

    res.status(200).json(responseObj);
  } catch (error) {
    responseObj.status = 500;
    responseObj.message = "Error al obtener pedido";
    responseObj.result = error.message || "Error desconocido";

    res.status(500).json(responseObj);
  }
};

const createSalesOrderHeaderController = async (req, res) => {
  let responseObj = { ...Response };
  const {
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
  } = req.body;

  if (!RevisionNumber || !OrderDate) {
    responseObj.status = 400;
    responseObj.message = "Faltan datos requeridos";
    responseObj.result = "Campos obligatorios: RevisionNumber, OrderDate";
    return res.status(400).json(responseObj);
  }

  try {
    const newSalesOrderHeader = await createSalesOrderHeaderRepository(
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
    );

    responseObj.status = 201;
    responseObj.message = "Pedido creado correctamente";
    responseObj.result = newSalesOrderHeader;
    res.status(201).json(responseObj);
  } catch (error) {
    responseObj.status = 500;
    responseObj.message = "Error al crear pedido";
    responseObj.result = error.message || "Error desconocido";
    res.status(500).json(responseObj);
  }
};

const updateSalesOrderHeaderController = async (req, res) => {
  let { id } = req.params;
  const {
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
  } = req.body;

  let responseObj = { ...Response };
  id = parseInt(id, 10);
  // 🔍 Imprime los datos recibidos
  console.log("📥 Datos recibidos en el controlador:");
  console.log({
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
    ShipToAddressID,
  });

  if (!id || !RevisionNumber || !OrderDate) {
    responseObj.status = 400;
    responseObj.message = "Faltan datos requeridos";
    responseObj.result = "Campos obligatorios: id, RevisionNumber, OrderDate";
    return res.status(400).json(responseObj);
  }

  try {
    const result = await updateSalesOrderHeaderRepository(
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
    );

    responseObj.status = 200;
    responseObj.message = result.message;
    responseObj.result = result;
    return res.status(200).json(responseObj);
  } catch (error) {
    responseObj.status = 500;
    responseObj.message = "Error al actualizar pedido";
    responseObj.result = error.message || "Error desconocido";
    return res.status(500).json(responseObj);
  }
};

const deleteSalesOrderHeaderController = async (req, res) => {
  const { id } = req.params;
  let responseObj = { ...Response }; // Copia local para evitar problemas de concurrencia

  if (!id) {
    responseObj.status = 400;
    responseObj.message = "Falta el ID del pedido";
    responseObj.result = "El ID es obligatorio";
    return res.status(400).json(responseObj);
  }

  try {
    const result = await deleteSalesOrderHeaderRepository(id);
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
  getAllSalesOrderHeaderController,
  getSalesOrderHeaderByIdController,
  createSalesOrderHeaderController,
  updateSalesOrderHeaderController,
  deleteSalesOrderHeaderController,
};
