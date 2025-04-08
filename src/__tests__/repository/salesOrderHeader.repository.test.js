import sql from "msnodesqlv8";
import {
  getAllSalesOrderHeaderRepository,
  deleteSalesOrderHeaderRepository,
} from "../../repository/SalesOrderHeader.repository";

// Mock msnodesqlv8
jest.mock("msnodesqlv8");

describe("SalesOrderHeader Repository Tests", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe("getAllSalesOrderHeaderRepository", () => {
    it("should get all sales orders successfully", async () => {
      const mockSalesOrders = [
        {
          SalesOrderID: 1,
          CustomerID: 1,
          OrderDate: new Date(),
          NameStyle: false,
          LastName: "Doe",
        },
        {
          SalesOrderID: 2,
          CustomerID: 2,
          OrderDate: new Date(),
          NameStyle: false,
          LastName: "Smith",
        },
      ];

      sql.query.mockImplementation((conn, query, params, callback) => {
        callback(null, mockSalesOrders);
      });

      const result = await getAllSalesOrderHeaderRepository();
      expect(result).toEqual(mockSalesOrders);
      expect(sql.query).toHaveBeenCalled();
    });

    it("should filter by customer ID when provided", async () => {
      const customerId = 1;
      const mockSalesOrders = [
        {
          SalesOrderID: 1,
          CustomerID: customerId,
          OrderDate: new Date(),
          NameStyle: false,
          LastName: "Doe",
        },
      ];

      sql.query.mockImplementation((conn, query, params, callback) => {
        expect(params).toContain(customerId);
        callback(null, mockSalesOrders);
      });

      const result = await getAllSalesOrderHeaderRepository(customerId);
      expect(result).toEqual(mockSalesOrders);
      expect(sql.query).toHaveBeenCalled();
    });

    it("should handle database error", async () => {
      sql.query.mockImplementation((conn, query, params, callback) => {
        callback(new Error("Database error"), null);
      });

      await expect(getAllSalesOrderHeaderRepository()).rejects.toThrow(
        "Error al obtener pedidos de la base de datos"
      );
    });
  });

  describe("deleteSalesOrderHeaderRepository", () => {
    it("should delete sales order successfully", async () => {
      sql.query.mockImplementation((conn, query, params, callback) => {
        callback(null, { rowsAffected: 1 });
      });

      const result = await deleteSalesOrderHeaderRepository(1);
      expect(result.message).toBe("Pedido eliminado correctamente");
    });

    it("should reject if sales order doesn't exist", async () => {
      sql.query.mockImplementation((conn, query, params, callback) => {
        callback(null, { rowsAffected: 0 });
      });

      await expect(deleteSalesOrderHeaderRepository(999)).rejects.toThrow(
        "El pedido no existe o ya fue eliminado"
      );
    });

    it("should handle database error during deletion", async () => {
      sql.query.mockImplementation((conn, query, params, callback) => {
        callback(new Error("Database error"), null);
      });

      await expect(deleteSalesOrderHeaderRepository(1)).rejects.toThrow(
        "Error al eliminar el pedido"
      );
    });
  });
});