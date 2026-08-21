import axios from "axios";
import { useEffect, useState } from "react";

function SalesPOS() {
  // =========================================================
  // CUSTOMERS
  // =========================================================
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // =========================================================
  // INVENTORY
  // =========================================================
  const [inventory, setInventory] = useState([]);

  // =========================================================
  // PRODUCTS IN CURRENT SALE
  // =========================================================
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

  // =========================================================
  // PAYMENT
  // =========================================================
  const [paidBy, setPaidBy] = useState("Cash");

  // =========================================================
  // PRODUCT SEARCH
  // =========================================================
  const [productSearch, setProductSearch] = useState("");
  const [showProductResults, setShowProductResults] = useState(false);

  // =========================================================
  // SALE PROCESSING
  // =========================================================
  const [isCompletingSale, setIsCompletingSale] = useState(false);

  // =========================================================
  // PRESCRIPTIONS
  // =========================================================
  // These are currently the same prescription records
  // used in your Prescriptions component.
  const prescriptions = [
    {
      id: 1,
      rxId: "RX-1254",
      customer: "Rahul Verma",
      date: "May 12, 2025",
      type: "Single Vision",
      right: "-1.50 SPH -0.75 CYL 180°",
      left: "-1.25 SPH -0.50 CYL 175°",
    },
    {
      id: 2,
      rxId: "RX-1253",
      customer: "Neha Sharma",
      date: "May 11, 2025",
      type: "Bifocal",
      right: "-2.00 SPH ADD +1.50",
      left: "-1.75 SPH ADD +1.50",
    },
    {
      id: 3,
      rxId: "RX-1252",
      customer: "Amit Patel",
      date: "May 10, 2025",
      type: "Progressive",
      right: "-3.25 SPH ADD +2.00",
      left: "-3.00 SPH ADD +2.00",
    },
    {
      id: 4,
      rxId: "RX-1251",
      customer: "Priya Mehta",
      date: "May 09, 2025",
      type: "Single Vision",
      right: "-0.75 SPH -0.50 CYL 90°",
      left: "-0.50 SPH -0.25 CYL 85°",
    },
    {
      id: 5,
      rxId: "RX-1250",
      customer: "Vikram Joshi",
      date: "May 08, 2025",
      type: "Bifocal",
      right: "-1.25 SPH ADD +1.25",
      left: "-1.00 SPH ADD +1.25",
    },
  ];

  // =========================================================
  // FIND SELECTED CUSTOMER'S PRESCRIPTION
  // =========================================================
  const selectedPrescription = selectedCustomer
    ? prescriptions.find(
        (prescription) =>
          prescription.customer?.toLowerCase() ===
          selectedCustomer.Name?.toLowerCase()
      )
    : null;

  // =========================================================
  // GET CUSTOMERS
  // =========================================================
  const getCustomers = async () => {
    try {
      const result = await axios.get(
        "http://localhost:3000/api/customeralldata"
      );

      console.log("CUSTOMERS:", result.data);

      if (result.data.success) {
        setCustomers(result.data.customers || []);
      } else {
        setCustomers([]);

        alert(
          result.data.message || "Failed to get customers"
        );
      }
    } catch (error) {
      console.error("Error getting customers:", error);

      if (error.response) {
        alert(
          error.response.data.message ||
            "Server error while getting customers"
        );
      } else if (error.request) {
        alert("Could not connect to the server");
      } else {
        alert("Something went wrong");
      }
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

      console.log("INVENTORY:", result.data);

      if (result.data.success) {
        const inventoryData =
          result.data.in ||
          result.data.inventory ||
          result.data.inventories ||
          result.data.data ||
          [];

        setInventory(
          Array.isArray(inventoryData)
            ? inventoryData
            : []
        );
      } else {
        setInventory([]);

        alert(
          result.data.message ||
            "Failed to get inventory"
        );
      }
    } catch (error) {
      console.error("Error getting inventory:", error);

      if (error.response) {
        alert(
          error.response.data.message ||
            "Server error while getting inventory"
        );
      } else if (error.request) {
        alert("Could not connect to the server");
      } else {
        alert("Something went wrong");
      }
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
  // CUSTOMER SELECTION
  // =========================================================
  const handleCustomerChange = (e) => {
    const customerId = e.target.value;

    const customer = customers.find(
      (item) => item._id === customerId
    );

    setSelectedCustomer(customer || null);
  };

  // =========================================================
  // FILTER PRODUCTS
  // =========================================================
  const filteredProducts = inventory.filter(
    (product) => {
      const search =
        productSearch.toLowerCase().trim();

      if (!search) {
        return false;
      }

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
    }
  );

  // =========================================================
  // SELECT PRODUCT FROM INVENTORY
  // =========================================================
  const handleSelectProduct = (product) => {
    const stock = Number(product.Stock || 0);

    // Do not allow an out-of-stock product
    if (stock <= 0) {
      alert(
        `${product.ProductName} is out of stock.`
      );

      return;
    }

    // Check whether the exact inventory product
    // is already in the current sale
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
                stock: stock,
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

        // IMPORTANT:
        // Store the actual MongoDB inventory ID.
        inventoryId: product._id,

        name: product.ProductName,

        sku: product._id,

        details: `${product.Brand || ""}${
          product.Category
            ? ` / ${product.Category}`
            : ""
        }`,

        qty: 1,

        // Your current inventory API doesn't expose
        // a selling-price field.
        price: 0,

        discount: 0,

        amount: 0,

        // Current stock from database
        stock: stock,
      };

      setItems((prevItems) => [
        ...prevItems,
        newItem,
      ]);
    }

    setProductSearch("");
    setShowProductResults(false);
  };

  // =========================================================
  // REMOVE PRODUCT
  // =========================================================
  const handleRemoveItem = (itemId) => {
    setItems((prevItems) =>
      prevItems.filter(
        (item) => item.id !== itemId
      )
    );
  };

  // =========================================================
  // CHANGE QUANTITY
  // =========================================================
  const handleQuantityChange = (
    itemId,
    newQty
  ) => {
    const qty = Number(newQty);

    if (qty < 1) {
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id !== itemId) {
          return item;
        }

        // Make sure quantity never exceeds stock
        if (
          item.inventoryId &&
          qty > item.stock
        ) {
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
    if (isCompletingSale) {
      return;
    }

    // Customer required
    if (!selectedCustomer) {
      alert(
        "Please select a customer before completing the sale."
      );

      return;
    }

    // Product required
    if (items.length === 0) {
      alert(
        "Please add at least one product."
      );

      return;
    }

    // =====================================================
    // CHECK STOCK BEFORE UPDATING ANYTHING
    // =====================================================
    for (const item of items) {
      // Existing demo items don't have inventoryId.
      // They will therefore not modify inventory.
      if (!item.inventoryId) {
        continue;
      }

      // Find exact product in inventory
      const currentProduct = inventory.find(
        (product) =>
          product._id === item.inventoryId
      );

      if (!currentProduct) {
        alert(
          `${item.name} could not be found in inventory.`
        );

        return;
      }

      const currentStock = Number(
        currentProduct.Stock || 0
      );

      if (currentStock < item.qty) {
        alert(
          `Not enough stock for ${item.name}.\n\nAvailable: ${currentStock}\nRequired: ${item.qty}`
        );

        return;
      }
    }

    setIsCompletingSale(true);

    try {
      // ===================================================
      // DECREASE STOCK FOR EACH SOLD PRODUCT
      // ===================================================
      for (const item of items) {
        // Skip demo items that aren't connected
        // to an inventory record.
        if (!item.inventoryId) {
          continue;
        }

        // Find the exact inventory record
        const currentProduct = inventory.find(
          (product) =>
            product._id === item.inventoryId
        );

        if (!currentProduct) {
          continue;
        }

        const currentStock = Number(
          currentProduct.Stock || 0
        );

        // THIS IS THE ACTUAL STOCK DECREASE
        const newStock =
          currentStock - item.qty;

        // Update ONLY this product
        await axios.put(
          `http://localhost:3000/api/inventory/${item.inventoryId}`,
          {
            ProductName:
              currentProduct.ProductName,

            Category:
              currentProduct.Category,

            Brand:
              currentProduct.Brand,

            Stock: newStock,
          }
        );
      }

      // ===================================================
      // SUCCESS
      // ===================================================
      alert(
        "Sale completed successfully!"
      );

      // Reload inventory so POS immediately
      // gets the new stock values.
      await getInventory();

      // Reload customers
      await getCustomers();

      console.log(
        "Customer:",
        selectedCustomer
      );

      console.log(
        "Prescription:",
        selectedPrescription
      );

      console.log(
        "Sold Items:",
        items
      );
    } catch (error) {
      console.error(
        "Error completing sale:",
        error
      );

      if (error.response) {
        alert(
          error.response.data.message ||
            "Server error while completing sale"
        );
      } else if (error.request) {
        alert(
          "Could not connect to the server."
        );
      } else {
        alert(
          "Something went wrong while completing the sale."
        );
      }
    } finally {
      setIsCompletingSale(false);
    }
  };

  // =========================================================
  // RETURN
  // =========================================================
  return (
    <div className="w-full h-screen bg-gray-50 p-8 overflow-y-auto">
      <div className="max-w-[1400px] mx-auto">

        {/* =================================================
            TOP BAR
        ================================================= */}
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
                <p className="m-0 font-medium">
                  Admin
                </p>

                <p className="m-0 text-xs text-gray-400">
                  Administrator
                </p>
              </div>
            </div>
          </div>
        </div>


        {/* =================================================
            PRODUCT SEARCH
        ================================================= */}
        <div className="relative">

          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-3 mb-6">

            <span>🔍</span>

            <input
              type="text"
              value={productSearch}
              onChange={(e) => {
                setProductSearch(
                  e.target.value
                );

                setShowProductResults(true);
              }}
              onFocus={() =>
                setShowProductResults(true)
              }
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


          {/* PRODUCT SEARCH RESULTS */}
          {showProductResults &&
            productSearch &&
            filteredProducts.length > 0 && (

              <div className="absolute z-50 top-[55px] left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">

                {filteredProducts.map(
                  (product) => (
                    <button
                      key={product._id}
                      type="button"
                      onClick={() =>
                        handleSelectProduct(
                          product
                        )
                      }
                      className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100"
                    >

                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {product.ProductName}
                        </p>

                        <p className="text-xs text-gray-400">
                          {product.Brand ||
                            "No Brand"}

                          {product.Category
                            ? ` • ${product.Category}`
                            : ""}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-gray-400">
                          Stock
                        </p>

                        <p
                          className={`text-sm font-semibold ${
                            Number(
                              product.Stock || 0
                            ) <= 0
                              ? "text-red-500"
                              : "text-green-600"
                          }`}
                        >
                          {product.Stock ?? 0}
                        </p>
                      </div>

                    </button>
                  )
                )}

              </div>
            )}

        </div>


        {/* =================================================
            MAIN GRID
        ================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">


          {/* =================================================
              LEFT SIDE
          ================================================= */}
          <div className="lg:col-span-2 space-y-6">


            {/* =================================================
                CUSTOMER / PRESCRIPTION
            ================================================= */}
            <div className="bg-white rounded-xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-6">

              {/* CUSTOMER */}
              <div>

                <p className="text-xs text-gray-400 mb-2">
                  Customer
                </p>

                <select
                  value={
                    selectedCustomer?._id || ""
                  }
                  onChange={
                    handleCustomerChange
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
                >
                  <option value="">
                    Select Customer
                  </option>

                  {customers.map(
                    (customer) => (
                      <option
                        key={customer._id}
                        value={customer._id}
                      >
                        {customer.Name} -{" "}
                        {
                          customer.PhoneNumber
                        }
                      </option>
                    )
                  )}
                </select>


                {/* CUSTOMER MOBILE */}
                {selectedCustomer && (
                  <>
                    <p className="text-xs text-gray-400 mt-2">
                      Mobile
                    </p>

                    <p className="text-sm">
                      {
                        selectedCustomer.PhoneNumber
                      }
                    </p>
                  </>
                )}

              </div>


              {/* =================================================
                  PRESCRIPTION
              ================================================= */}
              <div>

                <p className="text-xs text-gray-400 mb-2">
                  Prescription
                </p>


                {selectedPrescription ? (

                  <div className="border border-gray-200 rounded-lg p-3">

                    {/* PRESCRIPTION HEADER */}
                    <div className="flex items-center justify-between mb-3">

                      <div>
                        <p className="text-sm font-semibold">
                          {
                            selectedPrescription.rxId
                          }
                        </p>

                        <p className="text-xs text-gray-400">
                          {
                            selectedPrescription.type
                          }
                        </p>
                      </div>

                      <button
                        type="button"
                        className="text-indigo-600 text-xs font-medium"
                      >
                        View
                      </button>

                    </div>


                    {/* EYE VALUES */}
                    <div className="grid grid-cols-2 gap-3">


                      {/* RIGHT EYE */}
                      <div className="bg-gray-50 rounded-lg p-2">

                        <p className="text-[10px] text-gray-400 mb-1">
                          RIGHT (OD)
                        </p>

                        <p className="text-xs font-medium text-gray-700">
                          {
                            selectedPrescription.right
                          }
                        </p>

                      </div>


                      {/* LEFT EYE */}
                      <div className="bg-gray-50 rounded-lg p-2">

                        <p className="text-[10px] text-gray-400 mb-1">
                          LEFT (OS)
                        </p>

                        <p className="text-xs font-medium text-gray-700">
                          {
                            selectedPrescription.left
                          }
                        </p>

                      </div>

                    </div>


                    {/* DATE */}
                    <p className="text-[10px] text-gray-400 mt-2">
                      Prescription Date:{" "}
                      {
                        selectedPrescription.date
                      }
                    </p>

                  </div>

                ) : (

                  <div className="border border-gray-200 rounded-lg px-3 py-3">

                    <p className="text-xs text-gray-400">
                      {selectedCustomer
                        ? "No prescription found for this customer"
                        : "Select a customer to view prescription"}
                    </p>

                  </div>

                )}

              </div>

            </div>


            {/* =================================================
                ITEMS
            ================================================= */}
            <div className="bg-white rounded-xl p-5">

              <h3 className="font-semibold mb-4">
                Items
              </h3>


              <div className="overflow-x-auto">

                <table className="w-full text-sm border-collapse">

                  <thead>

                    <tr className="text-gray-400 text-left">

                      <th className="pb-2 font-medium">
                        #
                      </th>

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

                    {items.map(
                      (item, i) => (

                        <tr
                          key={item.id}
                          className="border-t border-gray-100"
                        >

                          {/* NUMBER */}
                          <td className="py-3">
                            {i + 1}
                          </td>


                          {/* PRODUCT */}
                          <td className="py-3">

                            <p className="font-medium m-0">
                              {item.name}
                            </p>

                            <p className="text-xs text-gray-400 m-0">
                              SKU:{" "}
                              {item.sku}
                            </p>

                          </td>


                          {/* DETAILS */}
                          <td className="py-3 text-gray-500 whitespace-pre-line text-xs">
                            {item.details}
                          </td>


                          {/* STOCK */}
                          <td className="py-3">

                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                Number(
                                  item.stock
                                ) <= 0
                                  ? "bg-red-100 text-red-600"
                                  : "bg-green-100 text-green-600"
                              }`}
                            >
                              {item.inventoryId
                                ? item.stock
                                : "N/A"}
                            </span>

                          </td>


                          {/* QUANTITY */}
                          <td className="py-3">

                            {item.inventoryId ? (

                              <input
                                type="number"
                                min="1"
                                max={
                                  item.stock
                                }
                                value={
                                  item.qty
                                }
                                onChange={(
                                  e
                                ) =>
                                  handleQuantityChange(
                                    item.id,
                                    e.target
                                      .value
                                  )
                                }
                                className="w-16 border border-gray-200 rounded px-2 py-1 text-sm"
                              />

                            ) : (

                              item.qty

                            )}

                          </td>


                          {/* PRICE */}
                          <td className="py-3">
                            ₹{" "}
                            {item.price.toLocaleString()}
                          </td>


                          {/* DISCOUNT */}
                          <td className="py-3">
                            {
                              item.discount
                            }
                            %
                          </td>


                          {/* AMOUNT */}
                          <td className="py-3 font-medium">
                            ₹{" "}
                            {item.amount.toLocaleString()}
                          </td>


                          {/* DELETE */}
                          <td className="py-3 text-red-400 cursor-pointer">

                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveItem(
                                  item.id
                                )
                              }
                            >
                              🗑
                            </button>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>


              {/* ADD PRODUCT */}
              <div className="flex justify-between items-center mt-4">

                <button
                  type="button"
                  onClick={() => {
                    setProductSearch("");
                    setShowProductResults(
                      true
                    );
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


          {/* =================================================
              RIGHT SIDE - SUMMARY
          ================================================= */}
          <div className="bg-white rounded-xl p-5 h-fit space-y-5">

            <h3 className="font-semibold">
              Summary
            </h3>


            {/* SUMMARY */}
            <div className="space-y-2 text-sm">

              <div className="flex justify-between text-gray-500">

                <span>
                  Sub Total
                </span>

                <span className="text-gray-800">
                  ₹{" "}
                  {subTotal.toLocaleString()}
                </span>

              </div>


              <div className="flex justify-between text-gray-500">

                <span>
                  Discount
                </span>

                <span className="text-gray-800">
                  ₹ {discount}
                </span>

              </div>


              <div className="flex justify-between text-gray-500">

                <span>
                  Tax (GST 5%)
                </span>

                <span className="text-gray-800">
                  ₹ {tax}
                </span>

              </div>


              <div className="flex justify-between text-gray-500">

                <span>
                  Round Off
                </span>

                <span className="text-gray-800">
                  ₹ {roundOff}
                </span>

              </div>


              <div className="flex justify-between font-semibold text-base pt-2 border-t border-gray-100">

                <span>
                  Total Amount
                </span>

                <span className="text-indigo-600">
                  ₹{" "}
                  {total.toLocaleString()}
                </span>

              </div>

            </div>


            {/* =================================================
                PAID BY
            ================================================= */}
            <div>

              <p className="text-xs text-gray-400 mb-2">
                Paid By
              </p>

              <div className="grid grid-cols-4 gap-2">

                {[
                  "Cash",
                  "UPI",
                  "Card",
                  "Other",
                ].map(
                  (method) => (

                    <button
                      key={method}
                      onClick={() =>
                        setPaidBy(
                          method
                        )
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


            {/* =================================================
                AMOUNT PAID
            ================================================= */}
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


            {/* =================================================
                NOTE
            ================================================= */}
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


            {/* =================================================
                COMPLETE SALE
            ================================================= */}
            <button
              onClick={
                handleCompleteSale
              }
              disabled={
                isCompletingSale
              }
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


            {/* =================================================
                DRAFT / CANCEL
            ================================================= */}
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
