import sql from "msnodesqlv8";
import {
  getAllCustomersRepository,
  getCustomerByIdRepository,
  createCustomerRepository,
  updateCustomerRepository,
  deleteCustomerRepository,
} from "../../repository/customer.repository";

// Mock msnodesqlv8
jest.mock("msnodesqlv8");

describe("Customer Repository Tests", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe("getAllCustomersRepository", () => {
    it("should get all customers successfully", async () => {
      const mockCustomers = [
        { CustomerID: 1, FirstName: "John", LastName: "Doe" },
        { CustomerID: 2, FirstName: "Jane", LastName: "Smith" },
      ];

      sql.query.mockImplementation((conn, query, params, callback) => {
        callback(null, mockCustomers);
      });

      const result = await getAllCustomersRepository();
      expect(result).toEqual(mockCustomers);
      expect(sql.query).toHaveBeenCalled();
    });

    it("should handle search term filtering", async () => {
      const searchTerm = "John";
      sql.query.mockImplementation((conn, query, params, callback) => {
        expect(params).toContain(`%${searchTerm}%`);
        callback(null, []);
      });

      await getAllCustomersRepository("FirstName", "asc", searchTerm);
      expect(sql.query).toHaveBeenCalled();
    });

    it("should handle database error", async () => {
      sql.query.mockImplementation((conn, query, params, callback) => {
        callback(new Error("Database error"), null);
      });

      await expect(getAllCustomersRepository()).rejects.toThrow(
        "Error al obtener clientes de la base de datos"
      );
    });
  });

  describe("getCustomerByIdRepository", () => {
    it("should get customer by ID successfully", async () => {
      const mockCustomer = { CustomerID: 1, FirstName: "John", LastName: "Doe" };
      sql.query.mockImplementation((conn, query, params, callback) => {
        callback(null, [mockCustomer]);
      });

      const result = await getCustomerByIdRepository(1);
      expect(result).toEqual(mockCustomer);
    });

    it("should return null for non-existent customer", async () => {
      sql.query.mockImplementation((conn, query, params, callback) => {
        callback(null, []);
      });

      const result = await getCustomerByIdRepository(999);
      expect(result).toBeNull();
    });

    it("should handle database error", async () => {
      sql.query.mockImplementation((conn, query, params, callback) => {
        callback(new Error("Database error"), null);
      });

      await expect(getCustomerByIdRepository(1)).rejects.toThrow(
        "Error al obtener cliente de la base de datos"
      );
    });
  });

  describe("createCustomerRepository", () => {
    const mockCustomerData = {
      NameStyle: false,
      Title: "Mr",
      FirstName: "John",
      MiddleName: null,
      LastName: "Doe",
      Suffix: null,
      CompanyName: "Test Co",
      SalesPerson: "someone@example.com",
      EmailAddress: "john@example.com",
      Phone: "1234567890",
      PasswordHash: "hash",
      PasswordSalt: "salt",
    };

    it("should create customer successfully", async () => {
      // Mock for email check
      sql.query.mockImplementationOnce((conn, query, params, callback) => {
        callback(null, [{ count: 0 }]);
      });

      // Mock for insert
      sql.query.mockImplementationOnce((conn, query, params, callback) => {
        callback(null, { insertId: 1 });
      });

      const result = await createCustomerRepository(
        ...Object.values(mockCustomerData)
      );
      expect(result.message).toBe("Cliente creado correctamente");
    });

    it("should reject if email already exists", async () => {
      sql.query.mockImplementationOnce((conn, query, params, callback) => {
        callback(null, [{ count: 1 }]);
      });

      await expect(
        createCustomerRepository(...Object.values(mockCustomerData))
      ).rejects.toThrow(/ya existe/);
    });
  });

  describe("updateCustomerRepository", () => {
    const mockCustomerData = {
      id: 1,
      NameStyle: false,
      Title: "Mr",
      FirstName: "John",
      MiddleName: null,
      LastName: "Doe",
      Suffix: null,
      CompanyName: "Test Co",
      SalesPerson: "someone@example.com",
      EmailAddress: "john@example.com",
      Phone: "1234567890",
      PasswordHash: "hash",
      PasswordSalt: "salt",
    };

    it("should update customer successfully", async () => {
      // Mock for customer check
      sql.query.mockImplementationOnce((conn, query, params, callback) => {
        callback(null, [{ count: 1 }]);
      });

      // Mock for update
      sql.query.mockImplementationOnce((conn, query, params, callback) => {
        callback(null, { rowsAffected: 1 });
      });

      const result = await updateCustomerRepository(
        mockCustomerData.id,
        ...Object.values(mockCustomerData).slice(1)
      );
      expect(result.message).toBe("Cliente actualizado correctamente");
    });

    it("should reject if customer doesn't exist", async () => {
      sql.query.mockImplementationOnce((conn, query, params, callback) => {
        callback(null, [{ count: 0 }]);
      });

      await expect(
        updateCustomerRepository(
          mockCustomerData.id,
          ...Object.values(mockCustomerData).slice(1)
        )
      ).rejects.toThrow("El cliente no existe en la base de datos");
    });
  });

  describe("deleteCustomerRepository", () => {
    it("should delete customer successfully", async () => {
      sql.query.mockImplementation((conn, query, params, callback) => {
        callback(null, { rowsAffected: 1 });
      });

      const result = await deleteCustomerRepository(1);
      expect(result.message).toBe("Cliente eliminado correctamente");
    });

    it("should reject if customer doesn't exist", async () => {
      sql.query.mockImplementation((conn, query, params, callback) => {
        callback(null, { rowsAffected: 0 });
      });

      await expect(deleteCustomerRepository(999)).rejects.toThrow(
        "El cliente no existe o ya fue eliminado"
      );
    });

    it("should handle database error", async () => {
      sql.query.mockImplementation((conn, query, params, callback) => {
        callback(new Error("Database error"), null);
      });

      await expect(deleteCustomerRepository(1)).rejects.toThrow(
        "Error al eliminar el cliente"
      );
    });
  });
});