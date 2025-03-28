import {
  deleteSalesOrderHeaderRepository,
  getAllSalesOrderHeaderRepository,
} from "../repository/SalesOrderHeader.repository.js";
import { Response } from "../utils/response.js";

const getAllSalesOrderHeaderController = async (req, res) => {
  let responseObj = { ...Response };

  try {
    // Obtenemos el customerId del query param si existe
    const customerId = req.query.customerId || null;
    const SalesOrderHeader = await getAllSalesOrderHeaderRepository(customerId);

    responseObj.status = 200;
    responseObj.message = customerId 
      ? `Pedidos del cliente ${customerId} obtenidos correctamente`
      : "Todos los pedidos obtenidos correctamente";
    responseObj.result = SalesOrderHeader;

    res.status(200).json(responseObj);
  } catch (error) {
    responseObj.status = 500;
    responseObj.message = "Error al obtener pedidos";
    responseObj.result = error.message || "Error desconocido";

    res.status(500).json(responseObj);
  }
};

const deleteSalesOrderHeaderController = async (req, res) => {
  const { id } = req.params;
  let responseObj = { ...Response };

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
  deleteSalesOrderHeaderController,
};

