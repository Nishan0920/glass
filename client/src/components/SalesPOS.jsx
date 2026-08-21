import axios from "axios";
import { useEffect, useState } from "react";

function SalesPOS() {
  const [customers, setCustomers] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [items, setItems] = useState([
    {
      id: 1,
      inventoryId: null,
      name: "Crizal Sapphire Lens",
      sku: "LENS001",
      details: "-1.50 / -0.75 x 90°\n+1.25 Add",
      qty: 1,
      price: 7500,
      discount: 5,
      amount: 7125,
      stock: 0,
    },
    {
      id: 2,
      inventoryId: null,
      name: "Titan Eyeglass Frame",
      sku: "FRM002",
      details: "Black, Medium",
      qty: 1,
      price: 4250,
      discount: 0,
      amount: 4250,
      stock: 0,
    },
    {
      id: 3,
      inventoryId: null,
      name: "Blue Cut Coating",
      sku: "COAT003",
      details: "Standard",
      qty: 1,
      price: 800,
      discount: 0,
      amount: 800,
      stock: 0,
    },
  ]);

  const [paidBy, setPaidBy] = useState("Cash");

  const [productSearch, setProductSearch] = useState("");
  const [showProductResults, setShowProductResults] = useState(false);

  const [isCompletingSale, setIsCompletingSale] = useState(false);

  const subTotal = 12175;
  const discount = 625;
  const tax = 577;
  const roundOff = 0.48;
  const total = 12127;

  // =========================================================
  // GET CUSTOMERS
  // =========================================================
  const getCustomers = async () => {
    try {
      const result = await axios.get(
        "http://localhost:3000/api/customeralldata"
      );

      if (result.data.success) {
        setCustomers(result.data.customers || []);
      } else {
        alert(result.data.message || "Failed to get customers");
      }
    } catch (error) {
      console.error("Error getting customers:", error);
      alert("Could not connect to the server");
    }
  };

  // =========================================================
  // GET INVENTORY
  // =========================================================
  const getInventory = async () => {
    try {
      const result = await axios.get(
        "http://localhost:3000/api/inventoryalldata"
      );

      console.log("SALES POS INVENTORY:", result.data);

      if (result.data.success) {
        const inventoryData =
          result.data.in ||
          result.data.inventory ||
          result.data.inventories ||
          result.data.data ||
          [];

        setInventory(Array.isArray(inventoryData) ? inventoryData : []);
      } else {
        alert(result.data.message || "Failed to get inventory");
      }
    } catch (error) {
      console.error("Error getting inventory:", error);
      alert("Could not connect to the server");
    }
  };

  // =========================================================
  // LOAD CUSTOMERS + INVENTORY
  // =========================================================
  useEffect(() => {
    getCustomers();
    getInventory();
  }, []);

  // =========================================================
  // SELECT CUSTOMER
  // =========================================================
  const handleCustomerChange = (e) => {
    const customerId = e.target.value;

    const customer = customers.find(
      (item) => item._id === customerId
    );

    setSelectedCustomer(customer || null);
  };

  // =========================================================
  // SEARCH INVENTORY PRODUCT
  // =========================================================
  const filteredProducts = inventory.filter((product) => {
    const search = productSearch.toLowerCase().trim();

    if (!search) return false;

    return (
      String(product.ProductName || "")
        .toLowerCase()
        .includes(search) ||
      String(product.Category || "")
        .toLowerCase()
        .includes(search) ||
      String(product.Brand || "")
        .toLowerCase()
        .includes(search) ||
      String(product._id || "")
        .toLowerCase()
        .includes(search)
    );
  });

  // =========================================================
  // ADD PRODUCT FROM INVENTORY
  // =========================================================
  const handleSelectProduct = (product) => {
    const stock = Number(product.Stock || 0);

    if (stock <= 0) {
      alert(
        `${product.ProductName} is out of stock. You cannot add this item.`
      );
      return;
    }

    // Check if this exact inventory item already exists
    const existingItem = items.find(
      (item) => item.inventoryId === product._id
    );

    if (existingItem) {
      if (existingItem.qty >= stock) {
        alert(
          `Only ${stock} unit(s) of ${product.ProductName} are available.`
        );
        return;
      }

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.inventoryId === product._id
            ? {
                ...item,
                qty: item.qty + 1,
                amount:
                  (item.qty + 1) *
                  item.price *
                  (1 - item.discount / 100),
              }
            : item
        )
      );
    } else {
      const newItem = {
        id: Date.now(),
        inventoryId: product._id,
        name: product.ProductName,
        sku: product._id,
        details: `${product.Brand || ""}${
          product.Category ? ` / ${product.Category}` : ""
        }`,
        qty: 1,

        // Keep the existing POS price structure.
        // Change this later if your inventory API has a selling price field.
        price: 0,

        discount: 0,
        amount: 0,
        stock: stock,
      };

      setItems((prevItems) => [...prevItems, newItem]);
    }

    setProductSearch("");
    setShowProductResults(false);
  };

  // =========================================================
  // REMOVE PRODUCT
  // =========================================================
  const handleRemoveItem = (itemId) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.id !== itemId)
    );
  };

  // =========================================================
  // CHANGE QUANTITY
  // =========================================================
  const handleQuantityChange = (itemId, newQty) => {
    const qty = Number(newQty);

    if (qty < 1) return;

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id !== itemId) return item;

        if (item.inventoryId && qty > item.stock) {
          alert(
            `Only ${item.stock} unit(s) of ${item.name} are available.`
          );

          return {
            ...item,
            qty: item.stock,
            amount:
              item.stock *
              item.price *
              (1 - item.discount / 100),
          };
        }

        return {
          ...item,
          qty,
          amount:
            qty *
            item.price *
            (1 - item.discount / 100),
        };
      })
    );
  };

  // =========================================================
  // COMPLETE SALE
  // =========================================================
  const handleCompleteSale = async () => {
    if (isCompletingSale) return;

    if (!selectedCustomer) {
      alert("Please select a customer before completing the sale.");
      return;
    }

    if (items.length === 0) {
      alert("Please add at least one product.");
      return;
    }

    // -------------------------------------------------------
    // Check stock BEFORE changing anything
    // -------------------------------------------------------
    for (const item of items) {
      if (!item.inventoryId) {
        continue;
      }

      const currentProduct = inventory.find(
        (product) => product._id === item.inventoryId
      );

      if (!currentProduct) {
        alert(
          `${item.name} could not be found in inventory.`
        );
        return;
      }

      const currentStock = Number(currentProduct.Stock || 0);

      if (currentStock < item.qty) {
        alert(
          `Not enough stock for ${item.name}.\n\nAvailable: ${currentStock}\nRequired: ${item.qty}`
        );
        return;
      }
    }

    setIsCompletingSale(true);

    try {
      // -----------------------------------------------------
      // DECREASE ONLY THE SPECIFIC SOLD ITEM
      // -----------------------------------------------------
      for (const item of items) {
        if (!item.inventoryId) {
          continue;
        }

        const currentProduct = inventory.find(
          (product) => product._id === item.inventoryId
        );

        if (!currentProduct) continue;

        const currentStock = Number(currentProduct.Stock || 0);

        const newStock = currentStock - item.qty;

        await axios.put(
          `http://localhost:3000/api/inventory/${item.inventoryId}`,
          {
            ProductName: currentProduct.ProductName,
            Category: currentProduct.Category,
            Brand: currentProduct.Brand,

            // THIS IS THE IMPORTANT PART
            Stock: newStock,
          }
        );
      }

      alert("Sale completed successfully!");

      // Refresh inventory so the new stock is displayed everywhere
      await getInventory();

      // Refresh customers
      await getCustomers();

      console.log("Sold Customer:", selectedCustomer);
      console.log("Sold Items:", items);

    } catch (error) {
      console.error("Error completing sale:", error);

      if (error.response) {
        alert(
          error.response.data.message ||
            "Server error while completing sale"
        );
      } else if (error.request) {
        alert("Could not connect to the server.");
      } else {
        alert("Something went wrong while completing the sale.");
      }
    } finally {
      setIsCompletingSale(false);
    }
  };

  return (
    <div className="w-full h-screen bg-gray-50 p-8 overflow-y-auto">
      <div className="max-w-[1400px] mx-auto">

        {/* Top bar */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
          <div>
            <h2 className="text-2xl font-bold m-0">
              Sales (POS)
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              Home / Sales / New Sale
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600">
              📅 May 12, 2025
            </div>

            <span className="text-gray-400 text-lg cursor-pointer">
              🔔
            </span>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm">
                A
              </div>

              <div className="text-sm">
                <p className="m-0 font-medium">Admin</p>
                <p className="m-0 text-xs text-gray-400">
                  Administrator
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-3 mb-6">
            <span>🔍</span>

            <input
              type="text"
              value={productSearch}
              onChange={(e) => {
                setProductSearch(e.target.value);
                setShowProductResults(true);
              }}
              onFocus={() => setShowProductResults(true)}
              placeholder="Search by Product, SKU or Barcode"
              className="flex-1 outline-none text-sm"
            />

            <span className="text-xs text-gray-400 border border-gray-200 rounded px-2 py-1">
              F2
            </span>

            <button className="flex items-center gap-1 text-sm text-gray-600 border-l border-gray-200 pl-4 ml-2">
              ⌗ Scan Barcode
            </button>
          </div>

          {/* Product search results */}
          {showProductResults &&
            productSearch &&
            filteredProducts.length > 0 && (
              <div className="absolute z-50 top-[55px] left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">

                {filteredProducts.map((product) => (
                  <button
                    key={product._id}
                    type="button"
                    onClick={() =>
                      handleSelectProduct(product)
                    }
                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {product.ProductName}
                      </p>

                      <p className="text-xs text-gray-400">
                        {product.Brand || "No Brand"}{" "}
                        {product.Category
                          ? `• ${product.Category}`
                          : ""}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-gray-400">
                        Stock
                      </p>

                      <p
                        className={`text-sm font-semibold ${
                          Number(product.Stock || 0) <= 0
                            ? "text-red-500"
                            : "text-green-600"
                        }`}
                      >
                        {product.Stock ?? 0}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left side */}
          <div className="lg:col-span-2 space-y-6">

            {/* Customer / Prescription */}
            <div className="bg-white rounded-xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-6">

              <div>
                <p className="text-xs text-gray-400 mb-2">
                  Customer
                </p>

                <select
                  value={selectedCustomer?._id || ""}
                  onChange={handleCustomerChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
                >
                  <option value="">
                    Select Customer
                  </option>

                  {customers.map((customer) => (
                    <option
                      key={customer._id}
                      value={customer._id}
                    >
                      {customer.Name} -{" "}
                      {customer.PhoneNumber}
                    </option>
                  ))}
                </select>

                {selectedCustomer && (
                  <>
                    <p className="text-xs text-gray-400 mt-2">
                      Mobile
                    </p>

                    <p className="text-sm">
                      {selectedCustomer.PhoneNumber}
                    </p>
                  </>
                )}
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-2">
                  Prescription
                </p>

                <div className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2">
                  <span className="text-sm font-medium">
                    RX-1254
                  </span>

                  <button className="text-indigo-600 text-xs font-medium">
                    View
                  </button>
                </div>
              </div>

            </div>

            {/* Items */}
            <div className="bg-white rounded-xl p-5">
              <h3 className="font-semibold mb-4">
                Items
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="text-gray-400 text-left">
                      <th className="pb-2 font-medium">#</th>
                      <th className="pb-2 font-medium">
                        Product
                      </th>
                      <th className="pb-2 font-medium">
                        Power / Details
                      </th>
                      <th className="pb-2 font-medium">
                        Stock
                      </th>
                      <th className="pb-2 font-medium">
                        Qty
                      </th>
                      <th className="pb-2 font-medium">
                        Price
                      </th>
                      <th className="pb-2 font-medium">
                        Discount
                      </th>
                      <th className="pb-2 font-medium">
                        Amount
                      </th>
                      <th className="pb-2 font-medium"></th>
                    </tr>
                  </thead>

                  <tbody>
                    {items.map((item, i) => (
                      <tr
                        key={item.id}
                        className="border-t border-gray-100"
                      >
                        <td className="py-3">
                          {i + 1}
                        </td>

                        <td className="py-3">
                          <p className="font-medium m-0">
                            {item.name}
                          </p>

                          <p className="text-xs text-gray-400 m-0">
                            SKU: {item.sku}
                          </p>
                        </td>

                        <td className="py-3 text-gray-500 whitespace-pre-line text-xs">
                          {item.details}
                        </td>

                        {/* STOCK */}
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              Number(item.stock) <= 0
                                ? "bg-red-100 text-red-600"
                                : "bg-green-100 text-green-600"
                            }`}
                          >
                            {item.inventoryId
                              ? item.stock
                              : "N/A"}
                          </span>
                        </td>

                        {/* QTY */}
                        <td className="py-3">
                          {item.inventoryId ? (
                            <input
                              type="number"
                              min="1"
                              max={item.stock}
                              value={item.qty}
                              onChange={(e) =>
                                handleQuantityChange(
                                  item.id,
                                  e.target.value
                                )
                              }
                              className="w-16 border border-gray-200 rounded px-2 py-1 text-sm"
                            />
                          ) : (
                            item.qty
                          )}
                        </td>

                        <td className="py-3">
                          ₹ {item.price.toLocaleString()}
                        </td>

                        <td className="py-3">
                          {item.discount}%
                        </td>

                        <td className="py-3 font-medium">
                          ₹ {item.amount.toLocaleString()}
                        </td>

                        <td className="py-3 text-red-400 cursor-pointer">
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveItem(item.id)
                            }
                          >
                            🗑
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setProductSearch("");
                    setShowProductResults(true);
                  }}
                  className="text-indigo-600 text-sm font-medium"
                >
                  + Add Product
                </button>

                <span className="text-xs text-gray-400">
                  {items.length} Items
                </span>
              </div>
            </div>
          </div>

          {/* Right side - Summary */}
          <div className="bg-white rounded-xl p-5 h-fit space-y-5">
            <h3 className="font-semibold">
              Summary
            </h3>

            <div className="space-y-2 text-sm">

              <div className="flex justify-between text-gray-500">
                <span>Sub Total</span>

                <span className="text-gray-800">
                  ₹ {subTotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-gray-500">
                <span>Discount</span>

                <span className="text-gray-800">
                  ₹ {discount}
                </span>
              </div>

              <div className="flex justify-between text-gray-500">
                <span>Tax (GST 5%)</span>

                <span className="text-gray-800">
                  ₹ {tax}
                </span>
              </div>

              <div className="flex justify-between text-gray-500">
                <span>Round Off</span>

                <span className="text-gray-800">
                  ₹ {roundOff}
                </span>
              </div>

              <div className="flex justify-between font-semibold text-base pt-2 border-t border-gray-100">
                <span>Total Amount</span>

                <span className="text-indigo-600">
                  ₹ {total.toLocaleString()}
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-2">
                Paid By
              </p>

              <div className="grid grid-cols-4 gap-2">
                {["Cash", "UPI", "Card", "Other"].map(
                  (method) => (
                    <button
                      key={method}
                      onClick={() =>
                        setPaidBy(method)
                      }
                      className={`text-sm py-2 rounded-lg border ${
                        paidBy === method
                          ? "border-indigo-500 text-indigo-600 bg-indigo-50"
                          : "border-gray-200 text-gray-600"
                      }`}
                    >
                      {method}
                    </button>
                  )
                )}
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-2">
                Amount Paid
              </p>

              <input
                type="text"
                defaultValue={total.toLocaleString()}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
              />
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-2">
                Note
              </p>

              <input
                type="text"
                defaultValue="Thank you!"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
              />
            </div>

            {/* COMPLETE SALE */}
            <button
              onClick={handleCompleteSale}
              disabled={isCompletingSale}
              className={`w-full text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${
                isCompletingSale
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {isCompletingSale
                ? "Processing..."
                : "Complete Sale"}

              {!isCompletingSale && (
                <span className="text-xs opacity-70">
                  F4
                </span>
              )}
            </button>

            <div className="flex gap-3">
              <button className="flex-1 border border-gray-200 py-2.5 rounded-lg text-sm">
                Save Draft
              </button>

              <button className="flex-1 border border-gray-200 py-2.5 rounded-lg text-sm text-red-500">
                Cancel
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default SalesPOS;
