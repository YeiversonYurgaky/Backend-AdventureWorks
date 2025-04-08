import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";
import {
  deleteSalesOrderHeaderRepository,
  getAllSalesOrderHeaderRepository,
} from "../../repository/SalesOrderHeader.repository.js";
import salesOrderHeaderRoutes from "../../routes/SalesOrderHeader.routes.js";
import { Response } from "../../utils/response.js";

// Mock del repositorio
jest.mock("../../repository/SalesOrderHeader.repository.js", () => ({
  getAllSalesOrderHeaderRepository: jest.fn(),
  deleteSalesOrderHeaderRepository: jest.fn(),
}));

// Crear una app Express para testing
const testApp = express();
testApp.use(express.json());
testApp.use("/api", salesOrderHeaderRoutes);

// Silenciar console.error durante los tests
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
});

describe("Sale Order Header Controller Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/salesorderheader", () => {
    it("debe obtener todas las órdenes correctamente", async () => {
      const mockOrders = [
        {
          SalesOrderID: 1,
          OrderDate: "2025-04-06T00:00:00.000Z",
          DueDate: "2025-04-13T00:00:00.000Z",
          ShipDate: "2025-04-08T00:00:00.000Z",
          Status: 1,
          OnlineOrderFlag: true,
          CustomerID: 1,
          SubTotal: 1000.00,
          TaxAmt: 80.00,
          Freight: 50.00,
          TotalDue: 1130.00
        },
        {
          SalesOrderID: 2,
          OrderDate: "2025-04-06T00:00:00.000Z",
          DueDate: "2025-04-13T00:00:00.000Z",
          ShipDate: "2025-04-08T00:00:00.000Z",
          Status: 1,
          OnlineOrderFlag: true,
          CustomerID: 2,
          SubTotal: 2000.00,
          TaxAmt: 160.00,
          Freight: 75.00,
          TotalDue: 2235.00
        }
      ];

      getAllSalesOrderHeaderRepository.mockResolvedValue(mockOrders);

      const response = await request(testApp)
        .get("/api/salesorderheader")
        .query({ 
          sortBy: "OrderDate", 
          sortDirection: "desc",
          searchTerm: "" 
        })
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toEqual({
        ...Response,
        status: 200,
        message: "Todos los pedidos obtenidos correctamente",
        result: mockOrders
      });
      
      expect(response.body).toEqual({
        ...Response,
        status: 200,
        message: "Todos los pedidos obtenidos correctamente",
        result: mockOrders
      });
    });

    it("debe manejar errores del repositorio", async () => {
      const mockError = new Error("Error en la base de datos");
      getAllSalesOrderHeaderRepository.mockRejectedValue(mockError);

      const response = await request(testApp)
        .get("/api/salesorderheader")
        .expect("Content-Type", /json/)
        .expect(500);

      expect(response.body).toEqual({
        ...Response,
        status: 500,
        message: "Error al obtener pedidos",
        result: "Error en la base de datos"
      });
    });
  });

  describe("DELETE /api/salesorderheader/:id", () => {
    it("debe eliminar una orden correctamente", async () => {
      const orderId = "1";

      deleteSalesOrderHeaderRepository.mockResolvedValue({
        message: "Orden eliminada correctamente",
        result: { id: orderId }
      });

      const response = await request(testApp)
        .delete(`/api/salesorderheader/${orderId}`)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toEqual({
        ...Response,
        status: 200,
        message: "Orden eliminada correctamente",
        result: { id: orderId }
      });

      expect(deleteSalesOrderHeaderRepository).toHaveBeenCalledWith(orderId);
    });

    it("debe manejar errores al eliminar orden", async () => {
      const orderId = "1";
      const mockError = new Error("Error al eliminar la orden");
      deleteSalesOrderHeaderRepository.mockRejectedValue(mockError);

      const response = await request(testApp)
        .delete(`/api/salesorderheader/${orderId}`)
        .expect("Content-Type", /json/)
        .expect(500);

      expect(response.body).toEqual({
        ...Response,
        status: 500,
        message: "Error al eliminar la orden",
        result: null
      });
    });
  });
});
