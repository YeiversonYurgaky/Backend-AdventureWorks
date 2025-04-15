import {
  getTopSellingProducts
} from "../repository/SalesOrderDetail.repository.js";
import { Response } from "../utils/response.js";


const getTopProducts = async (req, res) => {
  let responseObj = { ...Response };
  try {
    const data = await getTopSellingProducts();
    responseObj.status = 200;
    responseObj.message = "Top 10 productos más vendidos obtenido correctamente";
    responseObj.result = data;
    res.status(200).json(responseObj);
  } catch (error) {
    console.error("Error al obtener productos más vendidos:", error);
    responseObj.status = 500;
    responseObj.message = "Error al obtener productos más vendidos";
    responseObj.result = error.message;
    res.status(500).json(responseObj);
  }
};




export default {
  getTopProducts
};

