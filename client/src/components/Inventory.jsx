import axios from "axios";
import { useEffect, useState } from "react";

const emptyInventory = {
  productname: "",
  category: "",
  brand: "",
  stock: "",
  sellingprice: "",
};

const IMAGE_BASE_URL = "http://localhost:3000/uploads/";

const Inventory = () => {
  const [showModal, setShowModal] = useState(false);
  const [inventories, setInventories] = useState([]);
  const [editingInventory, setEditingInventory] = useState(null);
  const [search, setSearch] = useState("");

  const [inventory, setInventory] = useState(emptyInventory);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // GET ALL INVENTORY
  const getInventory = async () => {
    try {
      const result = await axios.get(
        "http://localhost:3000/api/inventoryalldata",
      );

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
    }
  };

  const handleDelete = async (inventoryID) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item from inventory?",
    );
    if (!confirmDelete) {
      return;
    }
    try {
      const result = await axios.delete(
        `http://localhost:3000/api/inventory/${inventoryID}`,
      );
      if (result.data.success) {
        alert("Item deleted successfully from inventory");
        getInventory();
      } else {
        alert(result.data.message || "Failed to delete item");
      }
    } catch (error) {
      if (error.response) {
        alert(
          error.response.data.message || "Server error while deleting item",
        );
      } else {
        alert("Something went wrong.");
      }
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

  // handle image file selection + validation + preview
  const allowedTypes = ["image/jpeg", "image/png", "image/jfif"];
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".jfif"];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const ext = "." + file.name.split(".").pop().toLowerCase();

    const typeOk = allowedTypes.includes(file.type);
    const extOk = allowedExtensions.includes(ext);

    if (!typeOk && !extOk) {
      alert("Only JPG, JPEG, PNG and JFIF images are allowed");
      e.target.value = "";
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleAddInventory = () => {
    setEditingInventory(null);
    setInventory(emptyInventory);
    setImageFile(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setEditingInventory(product);

    setInventory({
      productname: product.ProductName || "",
      category: product.Category || "",
      brand: product.Brand || "",
      stock: product.Stock ?? "",
      sellingprice: product.SellingPrice ?? "",
    });

    setImageFile(null);
    setImagePreview(product.Image ? `${IMAGE_BASE_URL}${product.Image}` : null);

    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingInventory(null);
    setInventory(emptyInventory);
    setImageFile(null);
    setImagePreview(null);
  };

  // for adding and updating the items in inventory
  const handleOnSubmit = async (e) => {
    e.preventDefault();

    try {
      let result;

      const formData = new FormData();
      formData.append("ProductName", inventory.productname);
      formData.append("Category", inventory.category);
      formData.append("Brand", inventory.brand);
      formData.append("Stock", inventory.stock);
      formData.append("SellingPrice", inventory.sellingprice);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };

      if (editingInventory) {
        result = await axios.put(
          `http://localhost:3000/api/inventory/${editingInventory._id}`,
          formData,
          config,
        );
      } else {
        result = await axios.post(
          "http://localhost:3000/api/inventory",
          formData,
          config,
        );
      }

      if (result.data.success) {
        alert(
          editingInventory
            ? "Item updated successfully"
            : "Item added successfully",
        );

        handleCloseModal();
        await getInventory();
      } else {
        alert(result.data.message || "Operation failed");
      }
    } catch (error) {
      console.error("Error saving inventory:", error);

      if (error.response) {
        alert(
          error.response.data.message || "Server error while saving inventory",
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
                <div className="h-36 w-full bg-gray-50">
                  {product.Image ? (
                    <img
                      src={`${IMAGE_BASE_URL}${product.Image}`}
                      alt={product.ProductName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

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

                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Selling Price</span>
                      <span className="font-medium text-gray-800">
                        ₹{product.SellingPrice ?? 0}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 border-t border-gray-100 px-2 py-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(product)}
                    className="cursor-pointer text-blue-600 hover:text-blue-800"
                  >
                    <i className="fa-solid fa-pen "></i>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(product._id)}
                    className="cursor-pointer text-red-600 hover:text-red-800"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
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
                  {editingInventory ? "Update Product" : "Add New Product"}
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
                      Product Image
                    </label>

                    <input
                      type="file"
                      accept="image/jpeg,image/png,.jfif"
                      onChange={handleImageChange}
                      className="w-full text-xs"
                    />

                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mt-3 h-28 w-28 rounded-md border object-cover"
                      />
                    )}
                  </div>

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

                  <div className="grid grid-cols-2 gap-4">
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

                    <div>
                      <label className="mb-1 block text-xs font-medium">
                        Selling Price
                      </label>
                      <input
                        type="number"
                        name="sellingprice"
                        value={inventory.sellingprice}
                        onChange={handleOnChange}
                        className="h-10 w-full rounded-md border px-3 text-xs outline-none focus:border-blue-500"
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>
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
                    {editingInventory ? "Update Product" : "Add Product"}
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
