import {
  createProductRepository,
  deleteProductRepository,
  getAllProductsRepository,
  getProductByIdRepository,
  updateProductRepository,
} from "../repository/products.repository.js";
import { Response } from "../utils/response.js";

const getAllProductsController = async (req, res) => {
  let responseObj = { ...Response };

  try {
    const products = await getAllProductsRepository();

    responseObj.status = 200;
    responseObj.message = "Productos obtenidos correctamente";
    responseObj.result = products;

    res.status(200).json(responseObj);
  } catch (error) {
    responseObj.status = 500;
    responseObj.message = "Error al obtener productos";
    responseObj.result = error.message || "Error desconocido";

    res.status(500).json(responseObj);
  }
};

const getProductByIdController = async (req, res) => {
  let responseObj = { ...Response };
  const productId = parseInt(req.params.id, 10);

  if (isNaN(productId)) {
    responseObj.status = 400;
    responseObj.message = "ID de producto inválido";
    responseObj.result = null;

    return res.status(400).json(responseObj);
  }

  try {
    const product = await getProductByIdRepository(productId);

    if (!product) {
      responseObj.status = 404;
      responseObj.message = "Producto no encontrado";
      responseObj.result = null;

      return res.status(404).json(responseObj);
    }

    responseObj.status = 200;
    responseObj.message = "Producto obtenido correctamente";
    responseObj.result = product;

    res.status(200).json(responseObj);
  } catch (error) {
    responseObj.status = 500;
    responseObj.message = "Error al obtener producto";
    responseObj.result = error.message || "Error desconocido";

    res.status(500).json(responseObj);
  }
};

const createProductController = async (req, res) => {
  let responseObj = { ...Response };
  const {
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
  } = req.body;

  if (!Name || !ProductNumber) {
    responseObj.status = 400;
    responseObj.message = "Faltan datos requeridos";
    responseObj.result = "Campos obligatorios: Name, ProductNumber";
    return res.status(400).json(responseObj);
  }

  try {
    const newProduct = await createProductRepository(
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
    );

    responseObj.status = 201;
    responseObj.message = "Producto creado correctamente";
    responseObj.result = newProduct;
    res.status(201).json(responseObj);
  } catch (error) {
    responseObj.status = 500;
    responseObj.message = "Error al crear producto";
    responseObj.result = error.message || "Error desconocido";
    res.status(500).json(responseObj);
  }
};

const updateProductController = async (req, res) => {
  let { id } = req.params;
  const {
    Name,
    ProductNumber,
    Color,
    StandardCost,
    ListPrice,
    Size,
    Weight,
    ProductCategoryID,
    ProductModelID,
  } = req.body;

  let responseObj = { ...Response };
  id = parseInt(id, 10);
  // 🔍 Imprime los datos recibidos
  console.log("📥 Datos recibidos en el controlador:");
  console.log({
    id,
    Name,
    ProductNumber,
    Color,
    StandardCost,
    ListPrice,
    Size,
    Weight,
    ProductCategoryID,
    ProductModelID,
  });

  if (!id || !Name || !ProductNumber) {
    responseObj.status = 400;
    responseObj.message = "Faltan datos requeridos";
    responseObj.result = "Campos obligatorios: id, Name, ProductNumber";
    return res.status(400).json(responseObj);
  }

  try {
    const result = await updateProductRepository(
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
    );

    responseObj.status = 200;
    responseObj.message = result.message;
    responseObj.result = result;
    return res.status(200).json(responseObj);
  } catch (error) {
    responseObj.status = 500;
    responseObj.message = "Error al actualizar producto";
    responseObj.result = error.message || "Error desconocido";
    return res.status(500).json(responseObj);
  }
};

const deleteProductController = async (req, res) => {
  const { id } = req.params;
  let responseObj = { ...Response }; // Copia local para evitar problemas de concurrencia

  if (!id) {
    responseObj.status = 400;
    responseObj.message = "Falta el ID del producto";
    responseObj.result = "El ID es obligatorio";
    return res.status(400).json(responseObj);
  }

  try {
    const result = await deleteProductRepository(id);
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
  getAllProductsController,
  getProductByIdController,
  createProductController,
  updateProductController,
  deleteProductController,
};
