import axios from "axios";
import { useEffect, useState } from "react";

const SalesPOS = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [inventory, setInventory] = useState([]);

  const [items, setItems] = useState([]);

  const [paidBy, setPaidBy] = useState("Cash");
  const [amountPaid, setAmountPaid] = useState("");
  const [note, setNote] = useState("Thank you!");

  const [productSearch, setProductSearch] = useState("");
  const [showProductResults, setShowProductResults] = useState(false);

  const [isCompletingSale, setIsCompletingSale] = useState(false);

  const getCustomers = async () => {
    try {
      const result = await axios.get(
        "http://localhost:3000/api/customeralldata",
      );

      if (result.data.success) {
        setCustomers(result.data.customers || []);
      } else {
        setCustomers([]);
        alert(result.data.message || "Failed to get customers");
      }
    } catch (error) {
      console.error("Customer error:", error);

      alert(error.response?.data?.message || "Failed to get customers");
    }
  };

  const getInventory = async () => {
    try {
      const result = await axios.get(
        "http://localhost:3000/api/inventoryalldata",
      );

      if (result.data.success) {
        const data =
          result.data.in ||
          result.data.inventory ||
          result.data.inventories ||
          result.data.data ||
          [];

        setInventory(Array.isArray(data) ? data : []);
      } else {
        setInventory([]);
        alert(result.data.message || "Failed to get inventory");
      }
    } catch (error) {
      console.error("Inventory error:", error);

      alert(error.response?.data?.message || "Failed to get inventory");
    }
  };

  useEffect(() => {
    getCustomers();
    getInventory();
  }, []);

  const handleCustomerChange = (e) => {
    const customer = customers.find((item) => item._id === e.target.value);

    setSelectedCustomer(customer || null);
  };

  const selectedPrescription = selectedCustomer
    ? prescriptions.find(
        (item) =>
          item.customer?.toLowerCase() === selectedCustomer.Name?.toLowerCase(),
      )
    : null;

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

  const handleSelectProduct = (product) => {
    const stock = Number(product.Stock || 0);

    if (stock <= 0) {
      alert(`${product.ProductName} is out of stock.`);
      return;
    }

    const existing = items.find((item) => item.inventoryId === product._id);

    if (existing) {
      if (existing.qty >= stock) {
        alert(`Only ${stock} unit(s) are available.`);
        return;
      }

      setItems((prev) =>
        prev.map((item) =>
          item.inventoryId === product._id
            ? {
                ...item,
                qty: item.qty + 1,
                stock,
              }
            : item,
        ),
      );
    } else {
      setItems((prev) => [
        ...prev,
        {
          id: Date.now(),
          inventoryId: product._id,
          name: product.ProductName,
          sku: product._id,
          details: `${product.Brand || ""}${
            product.Category ? ` / ${product.Category}` : ""
          }`,
          qty: 1,

          price: 0,

          discount: 0,
          stock,
        },
      ]);
    }

    setProductSearch("");
    setShowProductResults(false);
  };

  const handleRemoveItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleQuantityChange = (id, value) => {
    const qty = Number(value);

    if (qty < 1) return;

    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        if (qty > item.stock) {
          alert(`Only ${item.stock} unit(s) are available.`);

          return {
            ...item,
            qty: item.stock,
          };
        }

        return {
          ...item,
          qty,
        };
      }),
    );
  };

  const subTotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const discount = items.reduce(
    (sum, item) => sum + item.price * item.qty * (item.discount / 100),
    0,
  );

  const taxableAmount = subTotal - discount;

  const tax = taxableAmount * 0.05;

  const beforeRoundOff = taxableAmount + tax;

  const total = Math.round(beforeRoundOff);

  const roundOff = total - beforeRoundOff;

  const handleCompleteSale = async () => {
    if (isCompletingSale) return;

    if (!selectedCustomer) {
      alert("Please select a customer.");
      return;
    }

    if (items.length === 0) {
      alert("Please add at least one product.");
      return;
    }

    for (const item of items) {
      const product = inventory.find(
        (product) => product._id === item.inventoryId,
      );

      if (!product) {
        alert(`${item.name} not found in inventory.`);
        return;
      }

      const stock = Number(product.Stock || 0);

      if (stock < item.qty) {
        alert(`${item.name}\n\nAvailable: ${stock}\nRequired: ${item.qty}`);
        return;
      }
    }

    setIsCompletingSale(true);

    try {
      for (const item of items) {
        const product = inventory.find(
          (product) => product._id === item.inventoryId,
        );

        if (!product) continue;

        const currentStock = Number(product.Stock || 0);

        const newStock = currentStock - item.qty;

        await axios.put(
          `http://localhost:3000/api/inventory/${item.inventoryId}`,
          {
            ProductName: product.ProductName,
            Category: product.Category,
            Brand: product.Brand,
            Stock: newStock,
          },
        );
      }

      await getInventory();

      alert("Sale completed successfully!");

      setItems([]);
      setSelectedCustomer(null);
      setAmountPaid("");
      setNote("Thank you!");
      setPaidBy("Cash");
    } catch (error) {
      console.error("Complete sale error:", error);

      alert(error.response?.data?.message || "Failed to complete sale");
    } finally {
      setIsCompletingSale(false);
    }
  };

  return (
    <div className="w-full h-screen bg-gray-50 p-8 overflow-y-auto">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Sales (POS)</h2>

            <p className="text-sm text-gray-400 mt-1">
              Home / Sales / New Sale
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center">
              A
            </div>

            <div>
              <p className="m-0 font-medium text-sm">Admin</p>

              <p className="m-0 text-xs text-gray-400">Administrator</p>
            </div>
          </div>
        </div>

        <div className="relative mb-6">
          <div className="flex items-center gap-2 bg-white border rounded-lg px-4 py-3">
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
          </div>

          {showProductResults &&
            productSearch &&
            filteredProducts.length > 0 && (
              <div className="absolute z-50 top-[55px] left-0 right-0 bg-white border rounded-lg shadow-lg">
                {filteredProducts.map((product) => (
                  <button
                    key={product._id}
                    type="button"
                    onClick={() => handleSelectProduct(product)}
                    className="w-full flex justify-between px-4 py-3 text-left hover:bg-gray-50 border-b"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {product.ProductName}
                      </p>

                      <p className="text-xs text-gray-400">
                        {product.Brand || "No Brand"}
                        {product.Category ? ` • ${product.Category}` : ""}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs text-gray-400">Stock</span>

                      <p
                        className={
                          Number(product.Stock || 0) <= 0
                            ? "text-red-500 font-semibold"
                            : "text-green-600 font-semibold"
                        }
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
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-400 mb-2">Customer</p>

                <select
                  value={selectedCustomer?._id || ""}
                  onChange={handleCustomerChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Select Customer</option>

                  {customers.map((customer) => (
                    <option key={customer._id} value={customer._id}>
                      {customer.Name} - {customer.PhoneNumber}
                    </option>
                  ))}
                </select>

                {selectedCustomer && (
                  <p className="text-sm mt-3">
                    Mobile: {selectedCustomer.PhoneNumber}
                  </p>
                )}
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-2">Prescription</p>

                {selectedPrescription ? (
                  <div className="border rounded-lg p-3">
                    <div className="mb-3">
                      <p className="text-sm font-semibold">
                        {selectedPrescription.rxId}
                      </p>

                      <p className="text-xs text-gray-400">
                        {selectedPrescription.type}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-[10px] text-gray-400">RIGHT (OD)</p>

                        <p className="text-xs">{selectedPrescription.right}</p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-[10px] text-gray-400">LEFT (OS)</p>

                        <p className="text-xs">{selectedPrescription.left}</p>
                      </div>
                    </div>

                    <p className="text-[10px] text-gray-400 mt-2">
                      Date: {selectedPrescription.date}
                    </p>
                  </div>
                ) : (
                  <div className="border rounded-lg p-3">
                    <p className="text-xs text-gray-400">
                      {selectedCustomer
                        ? "No prescription found"
                        : "Select customer first"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl p-5">
              <h3 className="font-semibold mb-4">Items</h3>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-400 text-left">
                      <th className="pb-2">#</th>
                      <th className="pb-2">Product</th>
                      <th className="pb-2">Details</th>
                      <th className="pb-2">Stock</th>
                      <th className="pb-2">Qty</th>
                      <th className="pb-2">Price</th>
                      <th className="pb-2">Discount</th>
                      <th className="pb-2">Amount</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {items.map((item, index) => {
                      const itemAmount =
                        item.qty * item.price * (1 - item.discount / 100);

                      return (
                        <tr key={item.id} className="border-t">
                          <td className="py-3">{index + 1}</td>

                          <td className="py-3">
                            <p className="font-medium">{item.name}</p>

                            <p className="text-xs text-gray-400">
                              SKU: {item.sku}
                            </p>
                          </td>

                          <td className="py-3 text-xs text-gray-500">
                            {item.details}
                          </td>

                          <td className="py-3">
                            <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">
                              {item.stock}
                            </span>
                          </td>

                          <td className="py-3">
                            <input
                              type="number"
                              min="1"
                              max={item.stock}
                              value={item.qty}
                              onChange={(e) =>
                                handleQuantityChange(item.id, e.target.value)
                              }
                              className="w-16 border rounded px-2 py-1"
                            />
                          </td>

                          <td className="py-3">
                            ₹ {item.price.toLocaleString()}
                          </td>

                          <td className="py-3">{item.discount}%</td>

                          <td className="py-3 font-medium">
                            ₹ {itemAmount.toLocaleString()}
                          </td>

                          <td>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-red-500"
                            >
                              🗑
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between mt-4">
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

          <div className="bg-white rounded-xl p-5 h-fit space-y-5">
            <h3 className="font-semibold">Summary</h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Sub Total</span>

                <span>₹ {subTotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Discount</span>

                <span>₹ {discount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Tax (GST 5%)</span>

                <span>₹ {tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Round Off</span>

                <span>₹ {roundOff.toFixed(2)}</span>
              </div>

              <div className="flex justify-between font-semibold text-base border-t pt-3">
                <span>Total Amount</span>

                <span className="text-indigo-600">
                  ₹ {total.toLocaleString()}
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-2">Paid By</p>

              <div className="grid grid-cols-4 gap-2">
                {["Cash", "UPI", "Card", "Other"].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaidBy(method)}
                    className={`text-sm py-2 rounded-lg border ${
                      paidBy === method
                        ? "border-indigo-500 text-indigo-600 bg-indigo-50"
                        : "border-gray-200"
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-2">Amount Paid</p>

              <input
                type="number"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                placeholder={String(total)}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-2">Note</p>

              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <button
              type="button"
              onClick={handleCompleteSale}
              disabled={isCompletingSale}
              className={`w-full text-white py-3 rounded-lg font-medium ${
                isCompletingSale
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {isCompletingSale ? "Processing..." : "Complete Sale"}
            </button>

            <div className="flex gap-3">
              <button
                type="button"
                className="flex-1 border py-2.5 rounded-lg text-sm"
              >
                Save Draft
              </button>

              <button
                type="button"
                onClick={() => setItems([])}
                className="flex-1 border py-2.5 rounded-lg text-sm text-red-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesPOS;
