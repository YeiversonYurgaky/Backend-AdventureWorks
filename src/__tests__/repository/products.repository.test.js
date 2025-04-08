import sql from "msnodesqlv8";
import {
  getAllProductsRepository,
  getCategoriesRepository,
  createProductRepository,
  updateProductRepository,
  deleteProductRepository,
} from "../../repository/products.repository";

// Mock msnodesqlv8
jest.mock("msnodesqlv8");

describe("Products Repository Tests", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe("getAllProductsRepository", () => {
    it("should get all products successfully", async () => {
      const mockProducts = [
        { ProductID: 1, Name: "Product 1", ListPrice: 100 },
        { ProductID: 2, Name: "Product 2", ListPrice: 200 },
      ];

      sql.query.mockImplementation((conn, query, params, callback) => {
        callback(null, mockProducts);
      });

      const result = await getAllProductsRepository();
      expect(result).toEqual(mockProducts);
      expect(sql.query).toHaveBeenCalled();
    });

    it("should handle search term filtering", async () => {
      const searchTerm = "Product";
      sql.query.mockImplementation((conn, query, params, callback) => {
        expect(params).toContain(`%${searchTerm}%`);
        callback(null, []);
      });

      await getAllProductsRepository("name", "asc", null, searchTerm);
      expect(sql.query).toHaveBeenCalled();
    });

    it("should handle category filtering", async () => {
      const categoryId = 1;
      sql.query.mockImplementation((conn, query, params, callback) => {
        expect(params).toContain(categoryId);
        callback(null, []);
      });

      await getAllProductsRepository("name", "asc", categoryId);
      expect(sql.query).toHaveBeenCalled();
    });

    it("should handle database error", async () => {
      sql.query.mockImplementation((conn, query, params, callback) => {
        callback(new Error("Database error"), null);
      });

      await expect(getAllProductsRepository()).rejects.toThrow();
    });
  });

  describe("getCategoriesRepository", () => {
    it("should get all categories successfully", async () => {
      const mockCategories = [
        { ProductCategoryID: 1, Name: "Category 1" },
        { ProductCategoryID: 2, Name: "Category 2" },
      ];

      sql.query.mockImplementation((conn, query, params, callback) => {
        callback(null, mockCategories);
      });

      const result = await getCategoriesRepository();
      expect(result).toEqual(mockCategories);
      expect(sql.query).toHaveBeenCalled();
    });

    it("should handle database error", async () => {
      sql.query.mockImplementation((conn, query, params, callback) => {
        callback(new Error("Database error"), null);
      });

      await expect(getCategoriesRepository()).rejects.toThrow();
    });
  });

  describe("createProductRepository", () => {
    const mockProductData = {
      Name: "Test Product",
      ProductNumber: "TP-123",
      Color: "Red",
      StandardCost: 50,
      ListPrice: 100,
      Size: "M",
      Weight: 1.5,
      ProductCategoryID: 1,
      ProductModelID: 1,
      SellStartDate: new Date().toISOString(),
    };

    it("should create product successfully", async () => {
      // Mock for name check
      sql.query.mockImplementationOnce((conn, query, params, callback) => {
        callback(null, [{ count: 0 }]);
      });

      // Mock for insert
      sql.query.mockImplementationOnce((conn, query, params, callback) => {
        callback(null, { insertId: 1 });
      });

      const result = await createProductRepository(...Object.values(mockProductData));
      expect(result.message).toBe("Producto creado correctamente");
    });

    it("should reject if product name already exists", async () => {
      sql.query.mockImplementationOnce((conn, query, params, callback) => {
        callback(null, [{ count: 1 }]);
      });

      await expect(
        createProductRepository(...Object.values(mockProductData))
      ).rejects.toThrow(/ya existe/);
    });

    it("should handle database error during creation", async () => {
      sql.query.mockImplementationOnce((conn, query, params, callback) => {
        callback(new Error("Database error"), null);
      });

      await expect(
        createProductRepository(...Object.values(mockProductData))
      ).rejects.toThrow("Error al verificar la existencia del producto");
    });
  });

  describe("updateProductRepository", () => {
    const mockProductData = {
      id: 1,
      Name: "Updated Product",
      ProductNumber: "UP-123",
      Color: "Blue",
      StandardCost: 75,
      ListPrice: 150,
      Size: "L",
      Weight: 2.0,
      ProductCategoryID: 2,
      ProductModelID: 2,
    };

    it("should update product successfully", async () => {
      // Mock for product check
      sql.query.mockImplementationOnce((conn, query, params, callback) => {
        callback(null, [{ count: 1 }]);
      });

      // Mock for update
      sql.query.mockImplementationOnce((conn, query, params, callback) => {
        callback(null, { rowsAffected: 1 });
      });

      const result = await updateProductRepository(
        mockProductData.id,
        ...Object.values(mockProductData).slice(1)
      );
      expect(result.message).toBe("Producto actualizado correctamente");
    });

    it("should reject if product doesn't exist", async () => {
      sql.query.mockImplementationOnce((conn, query, params, callback) => {
        callback(null, [{ count: 0 }]);
      });

      await expect(
        updateProductRepository(
          mockProductData.id,
          ...Object.values(mockProductData).slice(1)
        )
      ).rejects.toThrow("El producto no existe en la base de datos");
    });

    it("should handle database error during update", async () => {
      sql.query.mockImplementationOnce((conn, query, params, callback) => {
        callback(new Error("Database error"), null);
      });

      await expect(
        updateProductRepository(
          mockProductData.id,
          ...Object.values(mockProductData).slice(1)
        )
      ).rejects.toThrow("Error al verificar si el producto existe");
    });
  });

  describe("deleteProductRepository", () => {
    it("should delete product successfully", async () => {
      sql.query.mockImplementation((conn, query, params, callback) => {
        callback(null, { rowsAffected: 1 });
      });

      const result = await deleteProductRepository(1);
      expect(result.message).toBe("Producto eliminado correctamente");
    });

    it("should reject if product doesn't exist", async () => {
      sql.query.mockImplementation((conn, query, params, callback) => {
        callback(null, { rowsAffected: 0 });
      });

      await expect(deleteProductRepository(999)).rejects.toThrow(
        "El producto no existe o ya fue eliminado"
      );
    });

    it("should handle database error during deletion", async () => {
      sql.query.mockImplementation((conn, query, params, callback) => {
        callback(new Error("Database error"), null);
      });

      await expect(deleteProductRepository(1)).rejects.toThrow(
        "Error al eliminar el producto"
      );
    });
  });
});