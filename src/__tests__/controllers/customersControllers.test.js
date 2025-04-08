import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";
import {
  createCustomerRepository,
  updateCustomerRepository,
  deleteCustomerRepository,
  getAllCustomersRepository,
} from "../../repository/customer.repository.js";
import customerRoutes from "../../routes/customer.routes.js";
import { Response } from "../../utils/response.js";

// Mock del repositorio
jest.mock("../../repository/customer.repository.js", () => ({
  createCustomerRepository: jest.fn(),
  getAllCustomersRepository: jest.fn(),
  updateCustomerRepository: jest.fn(),
  deleteCustomerRepository: jest.fn(),
}));

// Crear una app Express para testing
const testApp = express();
testApp.use(express.json());
testApp.use("/api", customerRoutes);

// Silenciar console.error durante los tests
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
});

describe("Customer Controllers", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /customers", () => {
    it("debe retornar 400 si el body está vacío", async () => {
      const response = await request(testApp)
        .post("/api/customers")
        .send({})
        .expect("Content-Type", /json/)
        .expect(400);

      const expectedResponse = {
        ...Response,
        status: 400,
        message: response.body.message,
        result: "Campos obligatorios: FirstName, LastName, EmailAddress"
      };

      expect(response.body).toEqual(expectedResponse);
    });

    it("debe crear un cliente correctamente", async () => {
      const newCustomer = {
        NameStyle: "Mr.",
        Title: "Mr.",
        FirstName: "John",
        MiddleName: "M.",
        LastName: "Doe",
        Suffix: "Jr.",
        CompanyName: "Acme Inc.",
        SalesPerson: "John Doe",
        EmailAddress: "john.doe@example.com",
        Phone: "123-456-7890",
        PasswordHash: "123456",
        PasswordSalt: "123456"
      };

      // Mock del repositorio para devolver el cliente creado
      createCustomerRepository.mockResolvedValue(newCustomer);

      const response = await request(testApp)
        .post("/api/customers")
        .send(newCustomer)
        .expect("Content-Type", /json/)
        .expect(201);

      expect(response.body).toEqual({
        ...Response,
        status: 201,
        message: "Cliente creado correctamente",
        result: newCustomer
      });

      // Verificar que el repositorio fue llamado con los parámetros correctos
      expect(createCustomerRepository).toHaveBeenCalledWith(
        newCustomer.NameStyle,
        newCustomer.Title,
        newCustomer.FirstName,
        newCustomer.MiddleName,
        newCustomer.LastName,
        newCustomer.Suffix,
        newCustomer.CompanyName,
        newCustomer.SalesPerson,
        newCustomer.EmailAddress,
        newCustomer.Phone,
        newCustomer.PasswordHash,
        newCustomer.PasswordSalt
      );
    });

    it("debe manejar errores del servidor al crear cliente", async () => {
      const newCustomer = {
        NameStyle: "Mr.",
        Title: "Mr.",
        FirstName: "John",
        MiddleName: "M.",
        LastName: "Doe",
        Suffix: "Jr.",
        CompanyName: "Acme Inc.",
        SalesPerson: "John Doe",
        EmailAddress: "john.doe@example.com",
        Phone: "123-456-7890",
        PasswordHash: "123456",
        PasswordSalt: "123456"
      };

      // Mock del repositorio para simular un error
      const errorMessage = "Error de base de datos";
      createCustomerRepository.mockRejectedValue(new Error(errorMessage));

      const response = await request(testApp)
        .post("/api/customers")
        .send(newCustomer)
        .expect("Content-Type", /json/)
        .expect(500);

      expect(response.body).toEqual({
        ...Response,
        status: 500,
        message: "Error al crear cliente",
        result: errorMessage
      });

      // Verificar que el error fue registrado
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("GET /customers", () => {
    it("debe obtener clientes correctamente", async () => {
      const mockCustomers = [
        {
          CustomerID: 1,
          NameStyle: "Mr.",
          Title: "Mr.",
          FirstName: "John",
          MiddleName: "M.",
          LastName: "Doe",
          Suffix: "Jr.",
          CompanyName: "Acme Inc.",
          SalesPerson: "John Doe",
          EmailAddress: "john.doe@example.com",
          Phone: "123-456-7890",
          PasswordHash: "123456",
          PasswordSalt: "123456"
        },
        {
          CustomerID: 2,
          NameStyle: "Mrs.",
          Title: "Mrs.",
          FirstName: "Jane",
          MiddleName: "S.",
          LastName: "Smith",
          Suffix: "",
          CompanyName: "Tech Corp",
          SalesPerson: "John Doe",
          EmailAddress: "jane.smith@example.com",
          Phone: "098-765-4321",
          PasswordHash: "654321",
          PasswordSalt: "654321"
        }
      ];

      // Mock del repositorio para devolver la lista de clientes
      getAllCustomersRepository.mockResolvedValue(mockCustomers);

      const response = await request(testApp)
        .get("/api/customers")
        .query({
          sortBy: "LastName",
          sortDirection: "desc",
          searchTerm: "John"
        })
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toEqual({
        ...Response,
        status: 200,
        message: "Clientes obtenidos correctamente",
        result: mockCustomers
      });

      // Verificar que el repositorio fue llamado con los parámetros correctos
      expect(getAllCustomersRepository).toHaveBeenCalledWith(
        "LastName",  // sortBy
        "desc",      // sortDirection
        "John"       // searchTerm
      );
    });
  });

  describe("PUT /customers/:id", () => {
    it("debe retornar 400 si faltan campos requeridos", async () => {
      const response = await request(testApp)
        .put("/api/customers/1")
        .send({})
        .expect("Content-Type", /json/)
        .expect(400);

      const expectedResponse = {
        ...Response,
        status: 400,
        message: response.body.message,
        result: "Campos obligatorios: id, FirstName, LastName, EmailAddress"
      };

      expect(response.body).toEqual(expectedResponse);
    });

    it("debe actualizar un cliente correctamente", async () => {
      const updatedCustomer = {
        NameStyle: "Mr.",
        Title: "Mr.",
        FirstName: "John",
        MiddleName: "M.",
        LastName: "Doe",
        Suffix: "Jr.",
        CompanyName: "Acme Inc.",
        SalesPerson: "John Doe",
        EmailAddress: "john.doe@example.com",
        Phone: "123-456-7890",
        PasswordHash: "123456",
        PasswordSalt: "123456"
      };

      // Mock del repositorio para devolver el cliente actualizado
      const mockResult = {
        message: "Cliente actualizado correctamente",
        ...updatedCustomer
      };
      updateCustomerRepository.mockResolvedValue(mockResult);

      const response = await request(testApp)
        .put("/api/customers/1")
        .send(updatedCustomer)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toEqual({
        ...Response,
        status: 200,
        message: "Cliente actualizado correctamente",
        result: mockResult
      });

      // Verificar que el repositorio fue llamado con los parámetros correctos
      expect(updateCustomerRepository).toHaveBeenCalledWith(
        1,  // id se convierte a número en el controlador
        updatedCustomer.NameStyle,
        updatedCustomer.Title,
        updatedCustomer.FirstName,
        updatedCustomer.MiddleName,
        updatedCustomer.LastName,
        updatedCustomer.Suffix,
        updatedCustomer.CompanyName,
        updatedCustomer.SalesPerson,
        updatedCustomer.EmailAddress,
        updatedCustomer.Phone,
        updatedCustomer.PasswordHash,
        updatedCustomer.PasswordSalt
      );
    });
  });

  describe("DELETE /customers/:id", () => {
    it("debe retornar 400 si falta el ID", async () => {
      const response = await request(testApp)
        .delete("/api/customers/null")
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toEqual({
        ...Response,
        status: 400,
        message: "Falta el ID del cliente",
        result: "El ID es obligatorio"
      });

      // Verificar que el repositorio no fue llamado
      expect(deleteCustomerRepository).not.toHaveBeenCalled();
    });

    it("debe eliminar un cliente correctamente", async () => {
      const customerId = 1;
      
      // Mock del repositorio para devolver éxito
      deleteCustomerRepository.mockResolvedValue({ 
        message: "Cliente eliminado correctamente",
        result: { id: customerId }
      });

      const response = await request(testApp)
        .delete(`/api/customers/${customerId}`)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toEqual({
        ...Response,
        status: 200,
        message: "Cliente eliminado correctamente",
        result: { id: "1" }
      });

      // Verificar que el repositorio fue llamado con el ID correcto
      expect(deleteCustomerRepository).toHaveBeenCalledWith("1");
    });
  });
});
