import {
  deleteSalesOrderHeaderRepository,
  getAllSalesOrderHeaderRepository,
  getAvgShippingTimeRepository,
  getMonthlySalesReport,
  getSalesByCategory,
  getTopSalesMonthRepository,
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

const getMonthlySales = async (req, res) => {
  let responseObj = { ...Response };
  try {
    const data = await getMonthlySalesReport();
    responseObj.status = 200;
    responseObj.message = "Reporte mensual de ventas obtenido correctamente";
    responseObj.result = data;
    res.status(200).json(responseObj);
  } catch (error) {
    console.error("Error al obtener reporte mensual:", error);
    responseObj.status = 500;
    responseObj.message = "Error al obtener reporte mensual de ventas";
    responseObj.result = error.message;
    res.status(500).json(responseObj);
  }
};

const getSalesByProductCategory = async (req, res) => {
  let responseObj = { ...Response };
  try {
    const data = await getSalesByCategory();
    responseObj.status = 200;
    responseObj.message = "Ventas por categoría obtenidas correctamente";
    responseObj.result = data;
    res.status(200).json(responseObj);
  } catch (error) {
    console.error("Error al obtener ventas por categoría:", error);
    responseObj.status = 500;
    responseObj.message = "Error al obtener ventas por categoría";
    responseObj.result = error.message;
    res.status(500).json(responseObj);
  }
};

const getAvgShippingTime = async (req, res) => {
  try {
    const result = await getAvgShippingTimeRepository();
    res.status(200).json({
      status: 200,
      message: "Tiempo promedio de envío obtenido correctamente",
      result: result.AvgShippingDays,
    });
  } catch (error) {
    console.error("❌ Error al obtener el tiempo promedio de envío:", error);
    res.status(500).json({
      status: 500,
      message: "Error al calcular el tiempo promedio de envío",
    });
  }
};

const getTopSalesMonth = async (req, res) => {
  try {
    const result = await getTopSalesMonthRepository();
    res.status(200).json({
      status: 200,
      message: "Mes con más ventas obtenido correctamente",
      result: result,
    });
  } catch (error) {
    console.error("❌ Error al obtener el mes con más ventas:", error);
    res.status(500).json({
      status: 500,
      message: "Error al calcular el mes con más ventas",
    });
  }
};

export default {
  getAllSalesOrderHeaderController,
  deleteSalesOrderHeaderController,
  getMonthlySales,
  getSalesByProductCategory,
  getAvgShippingTime,
  getTopSalesMonth,
};

