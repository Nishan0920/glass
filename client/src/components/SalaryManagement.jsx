import axios from "axios";
import { useEffect, useMemo, useState } from "react";

function SalaryManagement() {
  const [activeTab, setActiveTab] = useState("Salary List");

  const [salaries, setSalaries] = useState([]);
  const [staffOptions, setStaffOptions] = useState([]); // for the "Staff" dropdown in the form
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingSalary, setEditingSalary] = useState(null);

  const [data, setData] = useState({
    staffId: "",
    month: "May 2025",
    basic: "",
    allowances: "",
    deductions: "",
    status: "Pending",
    paymentMethod: "Bank Transfer",
    payDate: "",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // net salary is always derived, never typed in directly
  const netPreview =
    (Number(data.basic) || 0) + (Number(data.allowances) || 0) - (Number(data.deductions) || 0);

  // ---------- fetch salaries + staff list ----------
  const getSalaries = async () => {
    setLoading(true);
    try {
      const result = await axios.get("http://localhost:3000/api/salaryalldata");
      if (result.data.success) {
        setSalaries(result.data.salaries);
      }
    } catch (error) {
      console.error("Error fetching salaries:", error);
    } finally {
      setLoading(false);
    }
  };

  // the salary form needs to know which staff exist, so it reuses the Staff API
  const getStaffOptions = async () => {
    try {
      const result = await axios.get("http://localhost:3000/api/staffalldata");
      if (result.data.success) {
        setStaffOptions(result.data.staff);
      }
    } catch (error) {
      console.error("Error fetching staff list:", error);
    }
  };

  useEffect(() => {
    getSalaries();
    getStaffOptions();
  }, []);

  // ---------- modal helpers ----------
  const handleAddSalary = () => {
    setEditingSalary(null);
    setData({
      staffId: "",
      month: "May 2025",
      basic: "",
      allowances: "",
      deductions: "",
      status: "Pending",
      paymentMethod: "Bank Transfer",
      payDate: "",
    });
    setShowModal(true);
  };

  const handleEdit = (salary) => {
    setEditingSalary(salary);
    setData({
      staffId: salary.Staff?._id || "",
      month: salary.Month || "",
      basic: salary.BasicSalary ?? "",
      allowances: salary.Allowances ?? "",
      deductions: salary.Deductions ?? "",
      status: salary.Status || "Pending",
      paymentMethod: salary.PaymentMethod || "Bank Transfer",
      payDate: salary.PayDate ? salary.PayDate.slice(0, 10) : "",
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    if (saving) return;
    setShowModal(false);
    setEditingSalary(null);
  };

  // ---------- create / update ----------
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      Staff: data.staffId,
      Month: data.month,
      BasicSalary: data.basic,
      Allowances: data.allowances || 0,
      Deductions: data.deductions || 0,
      Status: data.status,
      PaymentMethod: data.paymentMethod,
      PayDate: data.payDate || undefined,
    };

    try {
      let result;
      if (editingSalary) {
        result = await axios.put(
          `http://localhost:3000/api/salary/${editingSalary._id}`,
          payload
        );
      } else {
        result = await axios.post("http://localhost:3000/api/salary", payload);
      }

      if (result.data.success) {
        alert(editingSalary ? "Salary updated successfully" : "Salary created successfully");
        setShowModal(false);
        setEditingSalary(null);
        getSalaries();
      } else {
        alert(result.data.message || "Something went wrong");
      }
    } catch (error) {
      if (error.response) {
        const msg = error.response.data.errors
          ? error.response.data.errors[0].msg
          : error.response.data.message;
        alert(msg || "Server error while saving salary");
      } else if (error.request) {
        alert("Could not connect to the server.");
      } else {
        alert("Something went wrong.");
      }
    } finally {
      setSaving(false);
    }
  };

  // ---------- delete ----------
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this salary record?")) return;
    try {
      const result = await axios.delete(`http://localhost:3000/api/salary/${id}`);
      if (result.data.success) {
        setSalaries((prev) => prev.filter((s) => s._id !== id));
      } else {
        alert(result.data.message || "Failed to delete salary record");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  // ---------- derived stats (from real data instead of hardcoded numbers) ----------
  const stats = useMemo(() => {
    const totalPayroll = salaries.reduce((sum, s) => sum + (s.NetSalary || 0), 0);
    const paidThisMonth = salaries
      .filter((s) => s.Status === "Paid")
      .reduce((sum, s) => sum + (s.NetSalary || 0), 0);
    const pendingAmount = salaries
      .filter((s) => s.Status === "Pending")
      .reduce((sum, s) => sum + (s.NetSalary || 0), 0);
    // unique staff members that have a salary record
    const employeeCount = new Set(salaries.map((s) => s.Staff?._id)).size;

    return { totalPayroll, paidThisMonth, pendingAmount, employeeCount };
  }, [salaries]);

  const summary = useMemo(() => {
    const totalBasic = salaries.reduce((sum, s) => sum + (s.BasicSalary || 0), 0);
    const totalAllowances = salaries.reduce((sum, s) => sum + (s.Allowances || 0), 0);
    const totalDeductions = salaries.reduce((sum, s) => sum + (s.Deductions || 0), 0);
    const netPayroll = totalBasic + totalAllowances - totalDeductions;
    return { totalBasic, totalAllowances, totalDeductions, netPayroll };
  }, [salaries]);

  const statusStyle = {
    Paid: "bg-green-100 text-green-600",
    Pending: "bg-yellow-100 text-yellow-600",
  };

  const rupee = (n) => `₹ ${Number(n || 0).toLocaleString("en-IN")}`;

  return (
    <div className="w-full h-screen bg-gray-100 p-8 flex flex-col overflow-hidden">
      <div className="max-w-[1400px] w-full mx-auto flex flex-col flex-1 min-h-0">

        {/* Header */}
        <div className="flex justify-between items-center mb-5 shrink-0">
          <div>
            <h2 className="text-2xl font-bold">Salary Management</h2>
            <p className="text-sm text-gray-400">Manage staff salaries and payroll</p>
          </div>
          <div className="flex items-center gap-3">
            <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 outline-none">
              <option>May 2025</option>
            </select>
            <button
              onClick={handleAddSalary}
              className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium"
            >
              + Add Salary
            </button>
          </div>
        </div>

        {/* Stat cards - computed from real salary data */}
        <div className="grid grid-cols-4 gap-4 mb-5 shrink-0">
          <div className="bg-white p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">💰</div>
            <div>
              <p className="text-xs text-gray-500">Total Payroll</p>
              <h3 className="text-xl font-semibold">{rupee(stats.totalPayroll)}</h3>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">✅</div>
            <div>
              <p className="text-xs text-gray-500">Paid This Month</p>
              <h3 className="text-xl font-semibold">{rupee(stats.paidThisMonth)}</h3>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">⏳</div>
            <div>
              <p className="text-xs text-gray-500">Pending Amount</p>
              <h3 className="text-xl font-semibold">{rupee(stats.pendingAmount)}</h3>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">👥</div>
            <div>
              <p className="text-xs text-gray-500">Employees</p>
              <h3 className="text-xl font-semibold">{stats.employeeCount}</h3>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mb-4 border-b border-gray-200 shrink-0">
          {["Salary List", "Salary History"].map((tab) => (
            <span
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2.5 text-sm cursor-pointer ${
                activeTab === tab
                  ? "text-indigo-600 font-semibold border-b-2 border-indigo-600"
                  : "text-gray-500"
              }`}
            >
              {tab}
            </span>
          ))}
        </div>

        {activeTab === "Salary List" ? (
          <div className="flex flex-col flex-1 min-h-0 gap-5">

            {/* Table - scrolls */}
            <div className="bg-white rounded-xl overflow-y-auto flex-1 min-h-0">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white">
                  <tr>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">#</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Staff Name</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Designation</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Basic Salary</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Allowances</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Deductions</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Net Salary</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="9" className="px-4 py-10 text-center text-xs text-gray-400">
                        Loading salaries...
                      </td>
                    </tr>
                  ) : salaries.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="px-4 py-10 text-center text-xs text-gray-400">
                        No salary records yet.
                      </td>
                    </tr>
                  ) : (
                    salaries.map((s, index) => (
                      <tr key={s._id} className="border-t border-gray-100">
                        <td className="px-4 py-3">{index + 1}</td>
                        <td className="px-4 py-3 font-medium">{s.Staff?.StaffName || "—"}</td>
                        <td className="px-4 py-3">{s.Staff?.Designation || "—"}</td>
                        <td className="px-4 py-3">{rupee(s.BasicSalary)}</td>
                        <td className="px-4 py-3">{rupee(s.Allowances)}</td>
                        <td className="px-4 py-3">{rupee(s.Deductions)}</td>
                        <td className="px-4 py-3 font-medium">{rupee(s.NetSalary)}</td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle[s.Status]}`}>
                            {s.Status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <span onClick={() => handleEdit(s)} className="cursor-pointer">✏️</span>
                            <span onClick={() => handleDelete(s._id)} className="cursor-pointer">🗑️</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom summary - computed from real salary data */}
            <div className="grid grid-cols-2 gap-5 shrink-0">
              <div className="bg-white rounded-xl p-5">
                <h3 className="font-semibold mb-4">Payroll Summary</h3>
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Total Basic Salary</p>
                    <p className="font-medium">{rupee(summary.totalBasic)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Total Allowances</p>
                    <p className="font-medium">{rupee(summary.totalAllowances)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Total Deductions</p>
                    <p className="font-medium">{rupee(summary.totalDeductions)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Net Payroll</p>
                    <p className="font-medium">{rupee(summary.netPayroll)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold mb-4">Payment Method</h3>
                  <div className="border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4">Bank Transfer</div>
                  <p className="text-xs text-gray-400 mb-1">Pay Date</p>
                  <p className="text-sm font-medium mb-4">May 31, 2025</p>
                </div>
                <button className="bg-indigo-600 text-white py-2.5 rounded-lg font-medium text-sm">
                  Process Payroll
                </button>
              </div>
            </div>

          </div>
        ) : (
          <div className="bg-white rounded-xl p-6 flex-1 flex items-center justify-center text-gray-400 text-sm">
            Salary History goes here
          </div>
        )}

        {/* Add / Edit Salary modal */}
        {showModal && (
          <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            onClick={handleCloseModal}
          >
            <div
              className="bg-white rounded-xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b p-5">
                <h3 className="text-lg font-semibold">
                  {editingSalary ? "Edit Salary" : "Add Salary"}
                </h3>
                <button onClick={handleCloseModal} className="text-xl text-gray-400">×</button>
              </div>

              <form onSubmit={handleOnSubmit} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-1">Staff Member</label>
                  {/* This is the link back to the Staff collection - the salary record only
                      stores the staff _id, name/designation always comes from Staff via populate */}
                  <select
                    name="staffId"
                    value={data.staffId}
                    onChange={handleChange}
                    required
                    disabled={!!editingSalary}
                    className="w-full h-10 border rounded-md px-3 text-sm outline-none focus:border-indigo-500 disabled:bg-gray-100"
                  >
                    <option value="">Select staff member</option>
                    {staffOptions.map((st) => (
                      <option key={st._id} value={st._id}>
                        {st.StaffName} — {st.Designation}
                      </option>
                    ))}
                  </select>
                  {editingSalary && (
                    <p className="text-[11px] text-gray-400 mt-1">
                      Staff can't be changed on an existing record — delete and re-add instead.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">Month</label>
                  <input
                    name="month"
                    value={data.month}
                    onChange={handleChange}
                    placeholder="e.g. May 2025"
                    required
                    className="w-full h-10 border rounded-md px-3 text-sm outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">Basic</label>
                    <input
                      type="number"
                      name="basic"
                      value={data.basic}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full h-10 border rounded-md px-3 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Allowances</label>
                    <input
                      type="number"
                      name="allowances"
                      value={data.allowances}
                      onChange={handleChange}
                      min="0"
                      className="w-full h-10 border rounded-md px-3 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Deductions</label>
                    <input
                      type="number"
                      name="deductions"
                      value={data.deductions}
                      onChange={handleChange}
                      min="0"
                      className="w-full h-10 border rounded-md px-3 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 rounded-md px-3 py-2 flex justify-between text-sm">
                  <span className="text-gray-500">Net Salary</span>
                  <span className="font-semibold">{rupee(netPreview)}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">Status</label>
                    <select
                      name="status"
                      value={data.status}
                      onChange={handleChange}
                      className="w-full h-10 border rounded-md px-3 text-sm outline-none focus:border-indigo-500"
                    >
                      <option>Pending</option>
                      <option>Paid</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Pay Date</label>
                    <input
                      type="date"
                      name="payDate"
                      value={data.payDate}
                      onChange={handleChange}
                      className="w-full h-10 border rounded-md px-3 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={saving}
                    className="px-5 py-2 rounded-md border text-xs text-gray-600 disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 rounded-md bg-indigo-600 text-white text-xs font-medium disabled:opacity-60"
                  >
                    {saving
                      ? editingSalary ? "Updating..." : "Adding..."
                      : editingSalary ? "Update Salary" : "Add Salary"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default SalaryManagement;
