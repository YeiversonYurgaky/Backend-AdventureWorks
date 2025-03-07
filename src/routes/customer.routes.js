import express from 'express';
import customerController from '../controllers/customer.controllers.js';

const api = express.Router();

api.get('/customers', customerController.getAllCustomersController);
api.get('/customers/:id', customerController.getCustomerByIdController);
api.post('/customers', customerController.createCustomerController);
api.put('/customers/:id', customerController.updateCustomerController);
api.delete('/customers/:id', customerController.deleteCustomerController);

export default api;