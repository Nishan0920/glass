import axios from "axios";
import { useEffect, useState } from "react";

const Inventory = () => {
  const [showModal, setShowModal] = useState(false);
  const [inventories, setInventories] = useState([]);
  const [editingInventory, setEditingInventory] = useState(null);
  const [search, setSearch] = useState("");

  const [inventory, setInventory] = useState({
    productname: "",
    category: "",
    brand: "",
    sku: "",
    stock: "",
    barcode: "",
  });
  //fort updating the exisitng inventory
  const handleEdit = (inventory) => {
    setEditingInventory(inventory);
    setInventory({
      productname: "",
      category: "",
      brand: "",
      sku: "",
      stock: "",
      barcode: "",
    });
  };
  //for getting all data of the inventory
  const getInventory = async () => {
    try {
      const result = await axios.get(
        "http://localhost:3000/api/inventoryalldata",
      );

      console.log("GET INVENTORY:", result.data);

      if (result.data.success) {
        const inventoryData =
          result.data.in ||
          result.data.inventory ||
          result.data.inventories ||
          result.data.data ||
          [];

        setInventories(Array.isArray(inventoryData) ? inventoryData : []);
      } else {
        setInventories([]);
        alert(result.data.message || "Failed to get inventory");
      }
    } catch (error) {
      console.error("Error getting inventory:", error);

      if (error.response) {
        alert(
          error.response.data.message || "Server error while getting inventory",
        );
      } else if (error.request) {
        alert("Could not connect to the server");
      } else {
        alert("Something went wrong");
      }

      setInventories([]);
    }
  };

  useEffect(() => {
    getInventory();
  }, []);

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setInventory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddInventory = () => {
    setInventory({
      productname: "",
      category: "",
      brand: "",
      sku: "",
      stock: "",
      barcode: "",
    });

    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);

    setInventory({
      productname: "",
      category: "",
      brand: "",
      sku: "",
      stock: "",
      barcode: "",
    });
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await axios.post("http://localhost:3000/api/inventory", {
        ProductName: inventory.productname,
        Category: inventory.category,
        Brand: inventory.brand,
        Sku: inventory.sku,
        Barcode: inventory.barcode,
        Stock: inventory.stock,
      });

      if (result.data.success) {
        alert(result.data.message || "Successfully added item");

        setInventory({
          productname: "",
          category: "",
          brand: "",
          sku: "",
          stock: "",
          barcode: "",
        });

        setShowModal(false);

        await getInventory();
      } else {
        alert(result.data.message || "Failed to add inventory");
      }
    } catch (error) {
      console.error("Error adding inventory:", error);

      if (error.response) {
        alert(
          error.response.data.message || "Server error while adding inventory",
        );
      } else if (error.request) {
        alert("Could not connect to the server");
      } else {
        alert("Something went wrong");
      }
    }
  };

  const filteredInventory = (inventories || []).filter((product) => {
    const searchValue = search.toLowerCase().trim();

    return (
      String(product.ProductName || "")
        .toLowerCase()
        .includes(searchValue) ||
      String(product.Category || "")
        .toLowerCase()
        .includes(searchValue) ||
      String(product.Brand || "")
        .toLowerCase()
        .includes(searchValue)
    );
  });

  return (
    <div className="min-h-screen w-full bg-gray-100 p-8">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col">
        <div className="mb-5 rounded-2xl bg-[#14213d] px-8 py-6 text-white">
          <h2 className="text-2xl font-bold">Inventory</h2>

          <p className="text-sm text-gray-300">
            Manage your stock and products
          </p>
        </div>

        <div className="mb-5 flex items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name, category or brand"
            className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
          />

          <button
            type="button"
            onClick={handleAddInventory}
            className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2.5 text-sm text-white hover:bg-indigo-700"
          >
            + Add Product
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredInventory.length > 0 ? (
            filteredInventory.map((product) => (
              <div
                key={product._id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="p-4">
                  <h2 className="truncate text-base font-semibold text-gray-900">
                    {product.ProductName || "Unnamed Product"}
                  </h2>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-medium text-blue-600">
                      {product.Category || "No Category"}
                    </span>

                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-medium text-gray-600">
                      {product.Brand || "No Brand"}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 border-t border-gray-100 pt-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Stock</span>

                      <span className="font-medium text-gray-800">
                        {product.Stock ?? 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-xl bg-white py-12 text-center">
              <p className="text-sm text-gray-400">
                {search ? "No products found" : "No inventory available"}
              </p>
            </div>
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
              <div className="flex items-center justify-between border-b p-5">
                <h2 className="text-lg font-semibold text-gray-800">
                  Add New Product
                </h2>

                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="cursor-pointer text-xl text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleOnSubmit}>
                <div className="space-y-4 p-5">
                  <div>
                    <label className="mb-1 block text-xs font-medium">
                      Product Name
                    </label>

                    <input
                      type="text"
                      name="productname"
                      value={inventory.productname}
                      onChange={handleOnChange}
                      className="h-10 w-full rounded-md border px-3 text-xs outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium">
                      Category
                    </label>

                    <input
                      type="text"
                      name="category"
                      value={inventory.category}
                      onChange={handleOnChange}
                      className="h-10 w-full rounded-md border px-3 text-xs outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium">
                      Brand
                    </label>

                    <input
                      type="text"
                      name="brand"
                      value={inventory.brand}
                      onChange={handleOnChange}
                      className="h-10 w-full rounded-md border px-3 text-xs outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium">
                      Stock
                    </label>

                    <input
                      type="number"
                      name="stock"
                      value={inventory.stock}
                      onChange={handleOnChange}
                      className="h-10 w-full rounded-md border px-3 text-xs outline-none focus:border-blue-500"
                      required
                      min="0"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 border-t p-5">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="cursor-pointer rounded-md border px-5 py-2 text-xs text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="cursor-pointer rounded-md bg-blue-600 px-5 py-2 text-xs text-white hover:bg-blue-700"
                  >
                    Add Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;
