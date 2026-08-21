import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";

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
  // CURRENT SALE ITEMS
  // =========================================================
  const [items, setItems] = useState([]);

  // =========================================================
  // PAYMENT
  // =========================================================
  const [paidBy, setPaidBy] = useState("Cash");
  const [amountPaid, setAmountPaid] = useState("");
  const [note, setNote] = useState("Thank you!");

  // =========================================================
  // PRODUCT SEARCH
  // =========================================================
  const [productSearch, setProductSearch] = useState("");
  const [showProductResults, setShowProductResults] =
    useState(false);

  const productSearchRef = useRef(null);

  // =========================================================
  // SALE PROCESSING
  // =========================================================
  const [isCompletingSale, setIsCompletingSale] =
    useState(false);

  // =========================================================
  // PRESCRIPTIONS
  // =========================================================
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
  // SELECTED CUSTOMER PRESCRIPTION
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
          result.data.message ||
            "Failed to get customers"
        );
      }
    } catch (error) {
      console.error(
        "Error getting customers:",
        error
      );

      if (error.response) {
        alert(
          error.response.data.message ||
            "Server error while getting customers"
        );
      } else if (error.request) {
        alert(
          "Could not connect to the server."
        );
      } else {
        alert("Something went wrong.");
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
      console.error(
        "Error getting inventory:",
        error
      );

      if (error.response) {
        alert(
          error.response.data.message ||
            "Server error while getting inventory"
        );
      } else if (error.request) {
        alert(
          "Could not connect to the server."
        );
      } else {
        alert("Something went wrong.");
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
  // GET PRODUCT PRICE
  // =========================================================
  const getProductPrice = (product) => {
    const possiblePrices = [
      product.SellingPrice,
      product.sellingPrice,
      product.SalePrice,
      product.salePrice,
      product.Price,
      product.price,
      product.UnitPrice,
      product.unitPrice,
      product.Selling_Price,
      product.selling_price,
    ];

    const foundPrice = possiblePrices.find(
      (value) =>
        value !== undefined &&
        value !== null &&
        value !== ""
    );

    return Number(foundPrice || 0);
  };

  // =========================================================
  // GET PRODUCT SKU / BARCODE
  // =========================================================
  const getProductSku = (product) => {
    return (
      product.SKU ||
      product.Sku ||
      product.sku ||
      product.Barcode ||
      product.barcode ||
      product._id ||
      ""
    );
  };

  // =========================================================
  // FILTER PRODUCTS
  // =========================================================
  const filteredProducts = useMemo(() => {
    const search =
      productSearch.toLowerCase().trim();

    if (!search) {
      return inventory;
    }

    return inventory.filter((product) => {
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
        String(getProductSku(product))
          .toLowerCase()
          .includes(search) ||
        String(product._id || "")
          .toLowerCase()
          .includes(search)
      );
    });
  }, [inventory, productSearch]);

  // =========================================================
  // OPEN ADD PRODUCT
  // =========================================================
  const handleAddProductClick = () => {
    setProductSearch("");
    setShowProductResults(true);

    setTimeout(() => {
      productSearchRef.current?.focus();
    }, 0);
  };

  // =========================================================
  // SELECT PRODUCT
  // =========================================================
  const handleSelectProduct = (product) => {
    const stock = Number(product.Stock || 0);

    // OUT OF STOCK
    if (stock <= 0) {
      alert(
        `${product.ProductName} is out of stock.`
      );

      return;
    }

    // CHECK IF PRODUCT ALREADY EXISTS
    const existingItem = items.find(
      (item) =>
        item.inventoryId === product._id
    );

    const price = getProductPrice(product);

    // =====================================================
    // EXISTING PRODUCT
    // =====================================================
    if (existingItem) {
      if (existingItem.qty >= stock) {
        alert(
          `Only ${stock} unit(s) of ${product.ProductName} are available.`
        );

        return;
      }

      setItems((prevItems) =>
        prevItems.map((item) => {
          if (
            item.inventoryId !== product._id
          ) {
            return item;
          }

          const newQty = item.qty + 1;

          return {
            ...item,
            qty: newQty,
            stock,
            amount:
              newQty *
              item.price *
              (1 - item.discount / 100),
          };
        })
      );
    } else {
      // ===================================================
      // NEW PRODUCT
      // ===================================================
      const newItem = {
        id: Date.now(),

        inventoryId: product._id,

        name:
          product.ProductName ||
          "Unnamed Product",

        sku: getProductSku(product),

        details: `${product.Brand || ""}${
          product.Category
            ? ` / ${product.Category}`
            : ""
        }`,

        qty: 1,

        price,

        discount: 0,

        amount: price,

        stock,
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
  // REMOVE ITEM
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
    let qty = Number(newQty);

    if (!Number.isFinite(qty)) {
      return;
    }

    qty = Math.floor(qty);

    if (qty < 1) {
      qty = 1;
    }

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id !== itemId) {
          return item;
        }

        if (
          item.inventoryId &&
          qty > item.stock
        ) {
          alert(
            `Only ${item.stock} unit(s) of ${item.name} are available.`
          );

          qty = item.stock;
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
  // CHANGE DISCOUNT
  // =========================================================
  const handleDiscountChange = (
    itemId,
    newDiscount
  ) => {
    let discount = Number(
      newDiscount
    );

    if (!Number.isFinite(discount)) {
      discount = 0;
    }

    if (discount < 0) {
      discount = 0;
    }

    if (discount > 100) {
      discount = 100;
    }

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id !== itemId) {
          return item;
        }

        return {
          ...item,
          discount,
          amount:
            item.qty *
            item.price *
            (1 - discount / 100),
        };
      })
    );
  };

  // =========================================================
  // SUBTOTAL
  // =========================================================
  const subTotal = useMemo(() => {
    return items.reduce(
      (sum, item) =>
        sum +
        item.qty * item.price,
      0
    );
  }, [items]);

  // =========================================================
  // TOTAL DISCOUNT
  // =========================================================
  const discount = useMemo(() => {
    return items.reduce(
      (sum, item) =>
        sum +
        item.qty *
          item.price *
          (item.discount / 100),
      0
    );
  }, [items]);

  // =========================================================
  // TAXABLE AMOUNT
  // =========================================================
  const taxableAmount =
    subTotal - discount;

  // =========================================================
  // GST 5%
  // =========================================================
  const tax = taxableAmount * 0.05;

  // =========================================================
  // TOTAL BEFORE ROUND
  // =========================================================
  const calculatedTotal =
    taxableAmount + tax;

  // =========================================================
  // FINAL TOTAL
  // =========================================================
  const total = Math.round(
    calculatedTotal
  );

  // =========================================================
  // ROUND OFF
  // =========================================================
  const roundOff =
    total - calculatedTotal;

  // =========================================================
  // AMOUNT PAID
  // =========================================================
  const numericAmountPaid =
    Number(
      String(amountPaid).replace(
        /,/g,
        ""
      )
    ) || 0;

  // =========================================================
  // DUE
  // =========================================================
  const amountDue = Math.max(
    total - numericAmountPaid,
    0
  );

  // =========================================================
  // FORMAT MONEY
  // =========================================================
  const formatMoney = (amount) => {
    return Number(
      amount || 0
    ).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });
  };

  // =========================================================
  // PAYMENT METHOD CHANGE
  // =========================================================
  const handlePaymentMethodChange = (
    method
  ) => {
    setPaidBy(method);

    if (method === "Due") {
      setAmountPaid("0");
    } else {
      setAmountPaid(String(total));
    }
  };

  // =========================================================
  // COMPLETE SALE
  // =========================================================
  const handleCompleteSale = async () => {
    if (isCompletingSale) {
      return;
    }

    // CUSTOMER
    if (!selectedCustomer) {
      alert(
        "Please select a customer before completing the sale."
      );

      return;
    }

    // PRODUCTS
    if (items.length === 0) {
      alert(
        "Please add at least one product."
      );

      return;
    }

    // PRICE
    const productsWithoutPrice =
      items.filter(
        (item) => item.price <= 0
      );

    if (
      productsWithoutPrice.length > 0
    ) {
      alert(
        `Selling price is missing for:\n\n${productsWithoutPrice
          .map((item) => item.name)
          .join("\n")}`
      );

      return;
    }

    // PAYMENT VALIDATION
    if (
      numericAmountPaid < 0
    ) {
      alert(
        "Amount paid cannot be negative."
      );

      return;
    }

    // CASH / QR MUST BE FULLY PAID
    if (
      paidBy !== "Due" &&
      numericAmountPaid < total
    ) {
      alert(
        `Please pay the full amount of Rs. ${formatMoney(
          total
        )} for ${paidBy}.`
      );

      return;
    }

    // AMOUNT PAID CANNOT EXCEED TOTAL
    if (
      numericAmountPaid > total
    ) {
      alert(
        "Amount paid cannot be greater than the total amount."
      );

      return;
    }

    // =====================================================
    // CHECK STOCK
    // =====================================================
    for (const item of items) {
      const currentProduct =
        inventory.find(
          (product) =>
            product._id ===
            item.inventoryId
        );

      if (!currentProduct) {
        alert(
          `${item.name} could not be found in inventory.`
        );

        return;
      }

      const currentStock =
        Number(
          currentProduct.Stock || 0
        );

      if (
        currentStock < item.qty
      ) {
        alert(
          `Not enough stock for ${item.name}.\n\nAvailable: ${currentStock}\nRequired: ${item.qty}`
        );

        return;
      }
    }

    setIsCompletingSale(true);

    try {
      // ===================================================
      // DECREASE INVENTORY
      // ===================================================
      for (const item of items) {
        const currentProduct =
          inventory.find(
            (product) =>
              product._id ===
              item.inventoryId
          );

        if (!currentProduct) {
          continue;
        }

        const currentStock =
          Number(
            currentProduct.Stock || 0
          );

        const newStock =
          currentStock - item.qty;

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

      // REFRESH INVENTORY
      await getInventory();

      // REFRESH CUSTOMERS
      await getCustomers();

      // CLEAR SALE
      setItems([]);

      setSelectedCustomer(null);

      setPaidBy("Cash");

      setAmountPaid("");

      setNote("Thank you!");

      setProductSearch("");

      setShowProductResults(false);
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
            HEADER
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

            <span>
              🔍
            </span>

            <input
              ref={productSearchRef}
              type="text"
              value={productSearch}
              onChange={(e) => {
                setProductSearch(
                  e.target.value
                );

                setShowProductResults(
                  true
                );
              }}
              onFocus={() => {
                setShowProductResults(
                  true
                );
              }}
              placeholder="Search by Product, SKU or Barcode"
              className="flex-1 outline-none text-sm"
            />

            <span className="text-xs text-gray-400 border border-gray-200 rounded px-2 py-1">
              F2
            </span>

            <button
              type="button"
              className="flex items-center gap-1 text-sm text-gray-600 border-l border-gray-200 pl-4 ml-2"
            >
              ⌗ Scan Barcode
            </button>

          </div>


          {/* =================================================
              PRODUCT RESULTS
          ================================================= */}
          {showProductResults &&
            filteredProducts.length > 0 && (

              <div className="absolute z-50 top-[55px] left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden max-h-[400px] overflow-y-auto">

                {filteredProducts.map(
                  (product) => {

                    const stock =
                      Number(
                        product.Stock || 0
                      );

                    const price =
                      getProductPrice(
                        product
                      );

                    return (
                      <button
                        key={
                          product._id
                        }
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
                            {
                              product.ProductName
                            }
                          </p>

                          <p className="text-xs text-gray-400">
                            {product.Brand ||
                              "No Brand"}

                            {product.Category
                              ? ` • ${product.Category}`
                              : ""}
                          </p>

                          <p className="text-xs text-gray-400 mt-1">
                            SKU:{" "}
                            {
                              getProductSku(
                                product
                              )
                            }
                          </p>

                        </div>


                        <div className="text-right">

                          <p className="text-sm font-medium text-gray-700">
                            Rs.{" "}
                            {formatMoney(
                              price
                            )}
                          </p>

                          <p
                            className={`text-xs font-semibold ${
                              stock <= 0
                                ? "text-red-500"
                                : "text-green-600"
                            }`}
                          >
                            Stock:{" "}
                            {stock}
                          </p>

                        </div>

                      </button>
                    );
                  }
                )}

              </div>
            )}


          {/* NO PRODUCTS */}
          {showProductResults &&
            productSearch &&
            filteredProducts.length ===
              0 && (

              <div className="absolute z-50 top-[55px] left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-5 text-center">

                <p className="text-sm text-gray-500">
                  No products found.
                </p>

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
                    selectedCustomer?._id ||
                    ""
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
                        key={
                          customer._id
                        }
                        value={
                          customer._id
                        }
                      >
                        {customer.Name} -{" "}
                        {
                          customer.PhoneNumber
                        }
                      </option>
                    )
                  )}

                </select>


                {/* MOBILE */}
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


                    <div className="grid grid-cols-2 gap-3">

                      {/* RIGHT */}
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


                      {/* LEFT */}
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

              <div className="flex items-center justify-between mb-4">

                <h3 className="font-semibold">
                  Items
                </h3>

                <span className="text-xs text-gray-400">
                  {items.length}{" "}
                  {items.length === 1
                    ? "Item"
                    : "Items"}
                </span>

              </div>


              <div className="overflow-x-auto">

                {items.length === 0 ? (

                  <div className="border border-dashed border-gray-200 rounded-lg py-12 text-center">

                    <div className="text-3xl mb-3">
                      🛒
                    </div>

                    <p className="text-sm text-gray-500">
                      No products added
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      Search for a product above or click Add Product
                    </p>

                  </div>

                ) : (

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
                          Details
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

                        <th className="pb-2 font-medium">
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      {items.map(
                        (item, i) => (

                          <tr
                            key={
                              item.id
                            }
                            className="border-t border-gray-100"
                          >

                            {/* NUMBER */}
                            <td className="py-3">
                              {i + 1}
                            </td>


                            {/* PRODUCT */}
                            <td className="py-3 pr-3">

                              <p className="font-medium m-0">
                                {
                                  item.name
                                }
                              </p>

                              <p className="text-xs text-gray-400 m-0">
                                SKU:{" "}
                                {
                                  item.sku
                                }
                              </p>

                            </td>


                            {/* DETAILS */}
                            <td className="py-3 pr-3 text-gray-500 text-xs">
                              {
                                item.details ||
                                "-"
                              }
                            </td>


                            {/* STOCK */}
                            <td className="py-3 pr-3">

                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  Number(
                                    item.stock
                                  ) <= 0
                                    ? "bg-red-100 text-red-600"
                                    : "bg-green-100 text-green-600"
                                }`}
                              >
                                {
                                  item.stock
                                }
                              </span>

                            </td>


                            {/* QUANTITY */}
                            <td className="py-3 pr-3">

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
                                className="w-16 border border-gray-200 rounded px-2 py-1 text-sm outline-none"
                              />

                            </td>


                            {/* PRICE */}
                            <td className="py-3 pr-3 whitespace-nowrap">

                              Rs.{" "}
                              {formatMoney(
                                item.price
                              )}

                            </td>


                            {/* DISCOUNT */}
                            <td className="py-3 pr-3">

                              <div className="flex items-center gap-1">

                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={
                                    item.discount
                                  }
                                  onChange={(
                                    e
                                  ) =>
                                    handleDiscountChange(
                                      item.id,
                                      e.target
                                        .value
                                    )
                                  }
                                  className="w-14 border border-gray-200 rounded px-2 py-1 text-sm outline-none"
                                />

                                <span>
                                  %
                                </span>

                              </div>

                            </td>


                            {/* AMOUNT */}
                            <td className="py-3 pr-3 font-medium whitespace-nowrap">

                              Rs.{" "}
                              {formatMoney(
                                item.amount
                              )}

                            </td>


                            {/* DELETE */}
                            <td className="py-3">

                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveItem(
                                    item.id
                                  )
                                }
                                className="text-red-400 hover:text-red-600"
                              >
                                🗑
                              </button>

                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                )}

              </div>


              {/* ADD PRODUCT */}
              <div className="flex justify-between items-center mt-4">

                <button
                  type="button"
                  onClick={
                    handleAddProductClick
                  }
                  className="text-indigo-600 text-sm font-medium hover:text-indigo-700"
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


            {/* =================================================
                SUMMARY
            ================================================= */}
            <div className="space-y-2 text-sm">

              {/* SUBTOTAL */}
              <div className="flex justify-between text-gray-500">

                <span>
                  Sub Total
                </span>

                <span className="text-gray-800">
                  Rs.{" "}
                  {formatMoney(
                    subTotal
                  )}
                </span>

              </div>


              {/* DISCOUNT */}
              <div className="flex justify-between text-gray-500">

                <span>
                  Discount
                </span>

                <span className="text-gray-800">
                  Rs.{" "}
                  {formatMoney(
                    discount
                  )}
                </span>

              </div>


              {/* TAX */}
              <div className="flex justify-between text-gray-500">

                <span>
                  Tax (GST 5%)
                </span>

                <span className="text-gray-800">
                  Rs.{" "}
                  {formatMoney(
                    tax
                  )}
                </span>

              </div>


              {/* ROUND OFF */}
              <div className="flex justify-between text-gray-500">

                <span>
                  Round Off
                </span>

                <span className="text-gray-800">
                  Rs.{" "}
                  {formatMoney(
                    roundOff
                  )}
                </span>

              </div>


              {/* TOTAL */}
              <div className="flex justify-between font-semibold text-base pt-2 border-t border-gray-100">

                <span>
                  Total Amount
                </span>

                <span className="text-indigo-600">
                  Rs.{" "}
                  {formatMoney(
                    total
                  )}
                </span>

              </div>

            </div>


            {/* =================================================
                PAYMENT METHOD
            ================================================= */}
            <div>

              <p className="text-xs text-gray-400 mb-2">
                Paid By
              </p>

              <div className="grid grid-cols-3 gap-2">

                {[
                  "Cash",
                  "QR",
                  "Due",
                ].map(
                  (method) => (

                    <button
                      key={
                        method
                      }
                      type="button"
                      onClick={() =>
                        handlePaymentMethodChange(
                          method
                        )
                      }
                      className={`text-sm py-2.5 rounded-lg border transition ${
                        paidBy ===
                        method
                          ? "border-indigo-500 text-indigo-600 bg-indigo-50"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
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
                type="number"
                min="0"
                max={total}
                value={
                  amountPaid
                }
                onChange={(e) =>
                  setAmountPaid(
                    e.target.value
                  )
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
                placeholder="Enter amount paid"
              />


              {/* DUE AMOUNT */}
              <div className="flex justify-between mt-2 text-xs">

                <span className="text-gray-400">
                  Due Amount
                </span>

                <span
                  className={
                    amountDue >
                    0
                      ? "text-red-500 font-medium"
                      : "text-green-600 font-medium"
                  }
                >
                  Rs.{" "}
                  {formatMoney(
                    amountDue
                  )}
                </span>

              </div>

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
                value={note}
                onChange={(e) =>
                  setNote(
                    e.target.value
                  )
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
                placeholder="Add a note"
              />

            </div>


            {/* =================================================
                COMPLETE SALE
            ================================================= */}
            <button
              type="button"
              onClick={
                handleCompleteSale
              }
              disabled={
                isCompletingSale ||
                items.length === 0
              }
              className={`w-full text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${
                isCompletingSale ||
                items.length === 0
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

              <button
                type="button"
                className="flex-1 border border-gray-200 py-2.5 rounded-lg text-sm hover:bg-gray-50"
              >
                Save Draft
              </button>

              <button
                type="button"
                onClick={() => {
                  setItems([]);
                  setSelectedCustomer(
                    null
                  );
                  setPaidBy("Cash");
                  setAmountPaid("");
                  setNote(
                    "Thank you!"
                  );
                  setProductSearch("");
                  setShowProductResults(
                    false
                  );
                }}
                className="flex-1 border border-gray-200 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50"
              >
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
