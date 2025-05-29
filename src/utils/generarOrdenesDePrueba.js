import { v4 as uuidv4 } from "uuid";

const productIDs = [
  980, 771, 977, 818, 748, 975, 884, 791, 775, 848, 715, 781, 912, 830, 950,
];

const customerIDs = [
  12, 29784, 451, 29606, 200, 29603, 294, 29636, 29780, 29, 29567, 128, 29813,
  523, 281,
];

const addressIDs = [
  451, 466, 467, 475, 487, 502, 504, 505, 519, 526, 546, 553, 558, 28, 1023,
];

const shipMethod = "CARGO TRANSPORT 5";

let globalOrderID = 80000;
let globalDetailID = 150000;

function getRandomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomFloat(min, max, decimals = 3) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function generarOrdenesDePrueba() {
  const ordenes = [];

  for (let i = 0; i < 50; i++) {
    const SalesOrderID = globalOrderID++;
    const customerID = getRandomFromArray(customerIDs);
    const ShipToAddressID = getRandomFromArray(addressIDs);
    const BillToAddressID = getRandomFromArray(addressIDs);

    const details = [];
    const lineCount = Math.floor(Math.random() * 3) + 2;

    let SubTotal = 0;

    for (let j = 0; j < lineCount; j++) {
      const SalesOrderDetailID = globalDetailID++;
      const ProductID = getRandomFromArray(productIDs);
      const OrderQty = Math.floor(Math.random() * 5) + 1;
      const UnitPrice = randomFloat(50, 500);
      const UnitPriceDiscount = 0.0;
      const LineTotal = parseFloat((OrderQty * UnitPrice).toFixed(3));

      SubTotal += LineTotal;

      details.push({
        SalesOrderID,
        SalesOrderDetailID,
        OrderQty,
        ProductID,
        UnitPrice,
        UnitPriceDiscount,
        LineTotal,
        rowguid: uuidv4().toUpperCase(),
        ModifiedDate: new Date(),
      });
    }

    const TaxAmt = parseFloat((SubTotal * 0.1).toFixed(3));
    const Freight = parseFloat((SubTotal * 0.05).toFixed(3));
    const TotalDue = parseFloat((SubTotal + TaxAmt + Freight).toFixed(3));

    const order = {
      SalesOrderID,
      RevisionNumber: 1,
      OrderDate: new Date(),
      DueDate: new Date(),
      ShipDate: new Date(),
      Status: 5,
      OnlineOrderFlag: true,
      SalesOrderNumber: `SO${SalesOrderID}`,
      PurchaseOrderNumber: `PO${SalesOrderID}`,
      AccountNumber: `10-4020-${SalesOrderID}`,
      CustomerID: customerID,
      ShipToAddressID,
      BillToAddressID,
      ShipMethod: shipMethod,
      SubTotal,
      TaxAmt,
      Freight,
      TotalDue,
      Comment: null,
      rowguid: uuidv4().toUpperCase(),
      ModifiedDate: new Date(),
      details,
    };

    ordenes.push(order);
  }

  return ordenes;
}

export { generarOrdenesDePrueba };
