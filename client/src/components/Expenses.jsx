import axios from "axios";
import { useEffect, useState } from "react";

const API_URL = "http://localhost:3000/api/expenses";

const initialData = {
  date: "",
  name: "",
  category: "",
  vendor: "",
  paymentMethod: "Bank Transfer",
  amount: "",
  isBill: false,
  isRecurring: false,
  recurringFrequency: "",
};

const Expenses = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [data, setData] = useState(initialData);

  // =========================
  // GET ALL EXPENSES
  // =========================
  const getExpenses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API_URL);

      console.log("GET expenses response:", response.data);

      if (response.data.success) {
        // Expected:
        // {
        //   success: true,
        //   data: [...]
        // }

        const expenseData = Array.isArray(response.data.data)
          ? response.data.data
          : [];

        setExpenses(expenseData);
      } else {
        setExpenses([]);
        setError(response.data.message || "Failed to fetch expenses");
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);

      setExpenses([]);

      if (error.response) {
        setError(
          error.response.data?.message ||
            "Server error while fetching expenses",
        );
      } else if (error.request) {
        setError(
          "Could not connect to the server. Make sure your backend is running.",
        );
      } else {
        setError("Something went wrong while fetching expenses.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch data once when component loads
  useEffect(() => {
    getExpenses();
  }, []);

  // =========================
  // INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =========================
  // EDIT EXPENSE
  // =========================
  const handleEdit = (expense) => {
    setEditingExpense(expense);

    setData({
      date: expense.date ? expense.date.slice(0, 10) : "",
      name: expense.name || "",
      category: expense.category || "",
      vendor: expense.vendor || "",
      paymentMethod: expense.paymentMethod || "Bank Transfer",
      amount: expense.amount || "",
      isBill: expense.isBill || false,
      isRecurring: expense.isRecurring || false,
      recurringFrequency: expense.recurringFrequency || "",
    });

    setShowModal(true);
  };

  // =========================
  // ADD EXPENSE
  // =========================
  const handleAddExpense = () => {
    setEditingExpense(null);
    setData(initialData);
    setShowModal(true);
  };

  // =========================
  // CLOSE MODAL
  // =========================
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingExpense(null);
    setData(initialData);
  };

  // =========================
  // DELETE EXPENSE
  // =========================
  const handleDelete = async (expenseId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this expense?",
    );

    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`${API_URL}/${expenseId}`);

      if (response.data.success) {
        alert("Expense deleted successfully");

        // Refresh table
        getExpenses();
      } else {
        alert(response.data.message || "Failed to delete expense");
      }
    } catch (error) {
      console.error("Delete error:", error);

      if (error.response) {
        alert(
          error.response.data?.message || "Server error while deleting expense",
        );
      } else {
        alert("Something went wrong.");
      }
    }
  };

  // =========================
  // ADD / UPDATE EXPENSE
  // =========================
  const handleOnSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        date: data.date,
        name: data.name,
        category: data.category,
        vendor: data.vendor,
        paymentMethod: data.paymentMethod,
        amount: Number(data.amount),
        isBill: data.isBill,
        isRecurring: data.isRecurring,
        recurringFrequency: data.isRecurring ? data.recurringFrequency : null,
      };

      console.log("Sending payload:", payload);

      let response;

      if (editingExpense) {
        response = await axios.put(`${API_URL}/${editingExpense._id}`, payload);
      } else {
        response = await axios.post(API_URL, payload);
      }

      console.log("Save response:", response.data);

      if (response.data.success) {
        alert(
          editingExpense
            ? "Expense updated successfully"
            : "Expense created successfully",
        );

        handleCloseModal();

        // IMPORTANT:
        // Fetch latest data after adding/updating
        await getExpenses();
      } else {
        alert(response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Save error:", error);

      if (error.response) {
        console.log("Server response:", error.response.data);

        alert(
          error.response.data?.message || "Server error while saving expense",
        );
      } else if (error.request) {
        alert("Could not connect to the server.");
      } else {
        alert("Something went wrong.");
      }
    }
  };

  // =========================
  // FILTER EXPENSES
  // =========================
  const filteredExpenses = expenses.filter((expense) => {
    const searchValue = search.toLowerCase().trim();

    const matchesSearch =
      !searchValue ||
      expense.name?.toLowerCase().includes(searchValue) ||
      expense.category?.toLowerCase().includes(searchValue) ||
      expense.vendor?.toLowerCase().includes(searchValue);

    let matchesTab = true;

    if (activeTab === "bills") {
      matchesTab = expense.isBill === true;
    }

    if (activeTab === "recurring") {
      matchesTab = expense.isRecurring === true;
    }

    return matchesSearch && matchesTab;
  });

  // =========================
  // STATISTICS
  // =========================
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount || 0),
    0,
  );

  const billsCount = expenses.filter(
    (expense) => expense.isBill === true,
  ).length;

  const categoriesCount = new Set(
    expenses.map((expense) => expense.category).filter(Boolean),
  ).size;

  const avgPerDay =
    expenses.length > 0 ? Math.round(totalExpenses / new Date().getDate()) : 0;

  // =========================
  // UI
  // =========================
  return (
    <div className="w-full h-screen bg-gray-100 p-8 flex flex-col overflow-hidden">
      <div className="max-w-[1400px] w-full mx-auto flex flex-col flex-1 min-h-0">
        {/* STAT CARDS */}
        <div className="grid grid-cols-4 gap-4 mb-5 shrink-0">
          <div className="bg-white p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              🧾
            </div>

            <div>
              <p className="text-xs text-gray-500">Total Expenses</p>

              <h3 className="text-xl font-semibold">
                ₹ {totalExpenses.toLocaleString("en-IN")}
              </h3>

              <span className="text-xs text-gray-400">This Month</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              📋
            </div>

            <div>
              <p className="text-xs text-gray-500">Bills</p>

              <h3 className="text-xl font-semibold">{billsCount}</h3>

              <span className="text-xs text-gray-400">This Month</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              🎁
            </div>

            <div>
              <p className="text-xs text-gray-500">Categories</p>

              <h3 className="text-xl font-semibold">{categoriesCount}</h3>

              <span className="text-xs text-gray-400">This Month</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              📈
            </div>

            <div>
              <p className="text-xs text-gray-500">Avg. Expense / Day</p>

              <h3 className="text-xl font-semibold">
                ₹ {avgPerDay.toLocaleString("en-IN")}
              </h3>

              <span className="text-xs text-gray-400">This Month</span>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-6 mb-4 border-b border-gray-200 shrink-0">
          <button
            onClick={() => setActiveTab("all")}
            className={`pb-2.5 text-sm ${
              activeTab === "all"
                ? "text-indigo-600 font-semibold border-b-2 border-indigo-600"
                : "text-gray-500"
            }`}
          >
            All Expenses
          </button>

          <button
            onClick={() => setActiveTab("bills")}
            className={`pb-2.5 text-sm ${
              activeTab === "bills"
                ? "text-indigo-600 font-semibold border-b-2 border-indigo-600"
                : "text-gray-500"
            }`}
          >
            Bills
          </button>

          <button
            onClick={() => setActiveTab("recurring")}
            className={`pb-2.5 text-sm ${
              activeTab === "recurring"
                ? "text-indigo-600 font-semibold border-b-2 border-indigo-600"
                : "text-gray-500"
            }`}
          >
            Recurring Expenses
          </button>
        </div>

        {/* SEARCH + ADD */}
        <div className="flex items-center gap-3 mb-5 shrink-0">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2.5 flex-1">
            <span>🔍</span>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search expense, category or vendor"
              className="w-full outline-none text-sm"
            />
          </div>

          <button
            onClick={handleAddExpense}
            className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium"
          >
            + Add Expense
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        {/* TABLE */}
        <div className="bg-white rounded-xl overflow-y-auto flex-1 min-h-0">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white">
              <tr>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">
                  Date
                </th>

                <th className="text-left px-4 py-3 text-gray-500 font-medium">
                  Expense Name
                </th>

                <th className="text-left px-4 py-3 text-gray-500 font-medium">
                  Category
                </th>

                <th className="text-left px-4 py-3 text-gray-500 font-medium">
                  Vendor
                </th>

                <th className="text-left px-4 py-3 text-gray-500 font-medium">
                  Payment Method
                </th>

                <th className="text-left px-4 py-3 text-gray-500 font-medium">
                  Amount
                </th>

                <th className="text-left px-4 py-3 text-gray-500 font-medium">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-gray-400"
                  >
                    Loading expenses...
                  </td>
                </tr>
              ) : filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense) => (
                  <tr key={expense._id} className="border-t border-gray-100">
                    <td className="px-4 py-3">
                      {expense.date
                        ? new Date(expense.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                          })
                        : "-"}
                    </td>

                    <td className="px-4 py-3 font-medium">
                      {expense.name || "-"}
                    </td>

                    <td className="px-4 py-3">{expense.category || "-"}</td>

                    <td className="px-4 py-3">{expense.vendor || "—"}</td>

                    <td className="px-4 py-3">
                      {expense.paymentMethod || "-"}
                    </td>

                    <td className="px-4 py-3 font-medium">
                      ₹ {Number(expense.amount || 0).toLocaleString("en-IN")}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleEdit(expense)}
                          className="text-indigo-500"
                        >
                          ✎
                        </button>

                        <button
                          onClick={() => handleDelete(expense._id)}
                          className="text-red-500"
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-gray-400"
                  >
                    {search
                      ? "No expenses found"
                      : activeTab === "bills"
                        ? "No bills available"
                        : activeTab === "recurring"
                          ? "No recurring expenses available"
                          : "No expenses available"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-semibold">
                {editingExpense ? "Edit Expense" : "Add Expense"}
              </h2>

              <button
                onClick={handleCloseModal}
                className="text-xl text-gray-400"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleOnSubmit}>
              <div className="space-y-3 px-6 py-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Date
                    </label>

                    <input
                      type="date"
                      name="date"
                      value={data.date}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Amount
                    </label>

                    <input
                      type="number"
                      name="amount"
                      min="0"
                      value={data.amount}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Expense Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={data.name}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Category
                    </label>

                    <input
                      type="text"
                      name="category"
                      value={data.category}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Vendor
                    </label>

                    <input
                      type="text"
                      name="vendor"
                      value={data.vendor}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Payment Method
                  </label>

                  <select
                    name="paymentMethod"
                    value={data.paymentMethod}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Net Banking">Net Banking</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>

                <div className="flex items-center gap-4 pt-1">
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      name="isBill"
                      checked={data.isBill}
                      onChange={handleChange}
                    />
                    Mark as Bill
                  </label>

                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      name="isRecurring"
                      checked={data.isRecurring}
                      onChange={handleChange}
                    />
                    Recurring
                  </label>
                </div>

                {data.isRecurring && (
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Recurring Frequency
                    </label>

                    <select
                      name="recurringFrequency"
                      value={data.recurringFrequency}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    >
                      <option value="">Select frequency</option>

                      <option value="daily">Daily</option>

                      <option value="weekly">Weekly</option>

                      <option value="monthly">Monthly</option>

                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2.5 rounded-lg text-sm text-gray-600"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium"
                >
                  {editingExpense ? "Save Changes" : "Add Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
