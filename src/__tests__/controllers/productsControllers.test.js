import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";
import {
  createProductRepository,
  deleteProductRepository,
  getAllProductsRepository,
  getCategoriesRepository,
  updateProductRepository,
} from "../../repository/products.repository.js";
import productsRoutes from "../../routes/products.routes.js";
import { Response } from "../../utils/response.js";

// Mock del repositorio
jest.mock("../../repository/products.repository.js", () => ({
  getAllProductsRepository: jest.fn(),
  getCategoriesRepository: jest.fn(),
  createProductRepository: jest.fn(),
  updateProductRepository: jest.fn(),
  deleteProductRepository: jest.fn(),
}));

// Crear una app Express para testing
const testApp = express();
testApp.use(express.json());
testApp.use("/api", productsRoutes);

// Silenciar console.error durante los tests
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
});

describe("Products Controller Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/products", () => {
    it("debe obtener todos los productos correctamente", async () => {
      const mockProducts = [
        { ListPrice: 10.99, Name: "Producto 1", ProductID: 1 },
        { ListPrice: 20.99, Name: "Producto 2", ProductID: 2 },
      ];

      getAllProductsRepository.mockResolvedValue(mockProducts);

      const response = await request(testApp)
        .get("/api/products")
        .query({ sortBy: "name", sortDirection: "asc", searchTerm: "" })
        .expect("Content-Type", /json/)
        .expect(200);

      const expectedResponse = {
        ...Response,
        status: 200,
        message: response.body.message,
        result: mockProducts,
      };

      expect(response.body).toEqual(expectedResponse);

      expect(getAllProductsRepository).toHaveBeenCalledWith(
        "name",
        "asc",
        undefined,
        ""
      );
    });

    test("GET /api/products con parámetros de filtro y ordenamiento", async () => {
      const mockProducts = [
        {
          ProductID: 2,
          Name: "Mountain Bike",
          ListPrice: 599.99,
          ProductCategoryID: 5,
        },
      ];

      getAllProductsRepository.mockResolvedValue(mockProducts);

      const response = await request(testApp)
        .get("/api/products")
        .query({
          sortBy: "listprice",
          sortDirection: "desc",
          categoryId: 5,
          searchTerm: "bike",
        })
        .expect("Content-Type", /json/)
        .expect(200);

      const expectedResponse = {
        ...Response,
        status: 200,
        message: response.body.message,
        result: mockProducts,
      };

      expect(response.body).toEqual(expectedResponse);

      expect(getAllProductsRepository).toHaveBeenCalledWith(
        "listprice",
        "desc",
        "5",
        "bike"
      );
    });

    test("debe manejar errores del repositorio", async () => {
      const mockError = new Error("Error en la base de datos");
      getAllProductsRepository.mockRejectedValue(mockError);

      const response = await request(testApp)
        .get("/api/products")
        .expect("Content-Type", /json/)
        .expect(500);

      const expectedResponse = {
        ...Response,
        status: 500,
        message: response.body.message,
        result: "Error en la base de datos",
      };

      expect(response.body).toEqual(expectedResponse);
    });
  });

  describe("GET /api/products/categories", () => {
    it("debe obtener todas las categorías correctamente", async () => {
      const mockCategories = [
        { CategoryID: 1, Name: "Categoría 1" },
        { CategoryID: 2, Name: "Categoría 2" },
      ];

      getCategoriesRepository.mockResolvedValue(mockCategories);

      const response = await request(testApp)
        .get("/api/products/categories")
        .expect("Content-Type", /json/)
        .expect(200);

      const expectedResponse = {
        ...Response,
        status: 200,
        message: response.body.message,
        result: mockCategories,
      };

      expect(response.body).toEqual(expectedResponse);

      expect(getCategoriesRepository).toHaveBeenCalled();
    });

    it("debe manejar errores al obtener categorías", async () => {
      const mockError = new Error("Error en la base de datos");
      getCategoriesRepository.mockRejectedValue(mockError);

      const response = await request(testApp)
        .get("/api/products/categories")
        .expect("Content-Type", /json/)
        .expect(500);

      const expectedResponse = {
        ...Response,
        status: 500,
        message: response.body.message,
        result: "Error en la base de datos",
      };

      expect(response.body).toEqual(expectedResponse);
    });
  });

  describe("POST /api/products", () => {
    it("debe crear un producto correctamente", async () => {
      const newProduct = {
        ProductID: 1,
        Name: "Nuevo Producto",
        ProductNumber: "PN12345",
        Color: "Rojo",
        StandardCost: 100.0,
        ListPrice: 150.0,
        Size: "M",
        Weight: 1.2,
        ProductCategoryID: 1,
        ProductModelID: 1,
        SellStartDate: "2007-07-01T00:00:00.000Z",
      };

      createProductRepository.mockResolvedValue(newProduct);

      const response = await request(testApp)
        .post("/api/products")
        .send(newProduct)
        .expect("Content-Type", /json/)
        .expect(201);

      const expectedResponse = {
        ...Response,
        status: 201,
        message: response.body.message,
        result: newProduct,
      };

      expect(response.body).toEqual(expectedResponse);
    });

    it("debe manejar errores al crear producto", async () => {
      const mockError = new Error("Error en la base de datos");
      createProductRepository.mockRejectedValue(mockError);

      const response = await request(testApp)
        .post("/api/products")
        .send({
          Name: "Nuevo Producto",
          ProductNumber: "PN12345",
        })
        .expect("Content-Type", /json/)
        .expect(500);

      const expectedResponse = {
        ...Response,
        status: 500,
        message: response.body.message,
        result: "Error en la base de datos",
      };

      expect(response.body).toEqual(expectedResponse);
    });

    it("debe validar campos requeridos", async () => {
      const response = await request(testApp)
        .post("/api/products")
        .send({
          Color: "Rojo",
          StandardCost: 100,
        })
        .expect("Content-Type", /json/)
        .expect(400);

      const expectedResponse = {
        ...Response,
        status: 400,
        message: response.body.message,
        result: "Campos obligatorios: Name, ProductNumber",
      };

      expect(response.body).toEqual(expectedResponse);
    });
  });

  describe("PUT /api/products/:id", () => {
    it("debe actualizar un producto correctamente", async () => {
      const updatedProduct = {
        ProductID: 1,
        Name: "Producto Actualizado",
        ProductNumber: "PN12345",
        Color: "Rojo",
        StandardCost: 100.0,
        ListPrice: 150.0,
        Size: "M",
        Weight: 1.2,
        ProductCategoryID: 1,
        ProductModelID: 1,
        SellStartDate: "2007-07-01T00:00:00.000Z",
      };

      updateProductRepository.mockResolvedValue(updatedProduct);

      const response = await request(testApp)
        .put("/api/products/1")
        .send(updatedProduct)
        .expect("Content-Type", /json/)
        .expect(200);

      const expectedResponse = {
        ...Response,
        status: 200,
        message: response.body.message,
        result: updatedProduct,
      };

      expect(response.body).toEqual(expectedResponse);
    });

    it("debe manejar errores al actualizar producto", async () => {
      const mockError = new Error("Error en la base de datos");
      updateProductRepository.mockRejectedValue(mockError);

      const response = await request(testApp)
        .put("/api/products/1")
        .send({
          Name: "Producto Actualizado",
          ProductNumber: "PN12345",
        })
        .expect("Content-Type", /json/)
        .expect(500);

      const expectedResponse = {
        ...Response,
        status: 500,
        message: response.body.message,
        result: "Error en la base de datos",
      };

      expect(response.body).toEqual(expectedResponse);
    });

    it("debe manejar errores si faltan campos requeridos", async () => {
      const response = await request(testApp)
        .put("/api/products/1")
        .send({
          Color: "Rojo",
          StandardCost: 100,
        })
        .expect("Content-Type", /json/)
        .expect(400);

      const expectedResponse = {
        ...Response,
        status: 400,
        message: response.body.message,
        result: "Campos obligatorios: id, Name, ProductNumber"
      };

      expect(response.body).toEqual(expectedResponse);
    });
  });

  describe("DELETE /api/products/:id", () => {
    it("debe eliminar un producto correctamente", async () => {
      const productId = 1;
      const deleteResult = {
        message: "Producto eliminado correctamente"
      };

      deleteProductRepository.mockResolvedValue(deleteResult);

      const response = await request(testApp)
        .delete(`/api/products/${productId}`)
        .expect("Content-Type", /json/)
        .expect(200);

      const expectedResponse = {
        ...Response,
        status: 200,
        message: response.body.message,
        result: { id: "1" }
      };

      expect(response.body).toEqual(expectedResponse);
    });

    it("debe manejar errores al eliminar producto", async () => {
      const productId = 1;
      const mockError = new Error("Error al eliminar el producto");
      deleteProductRepository.mockRejectedValue(mockError);

      const response = await request(testApp)
        .delete(`/api/products/${productId}`)
        .expect("Content-Type", /json/)
        .expect(500);

      const expectedResponse = {
        ...Response,
        status: 500,
        message: response.body.message,
        result: null
      };

      expect(response.body).toEqual(expectedResponse);
    }); 
  });
});
