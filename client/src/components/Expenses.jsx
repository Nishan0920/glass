import { useState } from "react"

function Expenses() {
  const [activeTab, setActiveTab] = useState("All Expenses")

  const expenses = [
    { id: 1, date: "May 12, 2025", name: "Rent", category: "Rent", vendor: "City Property", method: "Bank Transfer", amount: 15000 },
    { id: 2, date: "May 11, 2025", name: "Staff Salary", category: "Salary", vendor: "—", method: "Bank Transfer", amount: 20000 },
    { id: 3, date: "May 10, 2025", name: "Lens Purchase", category: "Inventory Purchase", vendor: "Acuvue India", method: "UPI", amount: 12750 },
    { id: 4, date: "May 09, 2025", name: "Electricity Bill", category: "Utilities", vendor: "BSES Yamuna", method: "Net Banking", amount: 2450 },
    { id: 5, date: "May 08, 2025", name: "Internet Bill", category: "Utilities", vendor: "Airtel", method: "UPI", amount: 1299 },
    { id: 6, date: "May 07, 2025", name: "Marketing", category: "Marketing", vendor: "Google Ads", method: "Card", amount: 3500 },
    { id: 7, date: "May 06, 2025", name: "Cleaning Services", category: "Maintenance", vendor: "CleanCare", method: "Cash", amount: 800 },
    { id: 8, date: "May 05, 2025", name: "Office Supplies", category: "Office Expenses", vendor: "Office Mart", method: "UPI", amount: 1751 },
  ]

  return (
    <div className="w-full h-screen bg-gray-100 p-8 flex flex-col overflow-hidden">
      <div className="max-w-[1400px] w-full mx-auto flex flex-col flex-1 min-h-0">

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-4 mb-5 shrink-0">
          <div className="bg-white p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">🧾</div>
            <div>
              <p className="text-xs text-gray-500">Total Expenses</p>
              <h3 className="text-xl font-semibold">₹ 68,250</h3>
              <span className="text-xs text-gray-400">This Month</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">📋</div>
            <div>
              <p className="text-xs text-gray-500">Bills</p>
              <h3 className="text-xl font-semibold">24</h3>
              <span className="text-xs text-gray-400">This Month</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">🎁</div>
            <div>
              <p className="text-xs text-gray-500">Categories</p>
              <h3 className="text-xl font-semibold">8</h3>
              <span className="text-xs text-gray-400">This Month</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">📈</div>
            <div>
              <p className="text-xs text-gray-500">Avg. Expense / Day</p>
              <h3 className="text-xl font-semibold">₹ 2,275</h3>
              <span className="text-xs text-gray-400">This Month</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mb-4 border-b border-gray-200 shrink-0">
          {["All Expenses", "Bills", "Recurring Expenses"].map((tab) => (
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

        {/* Search + Filter + Add */}
        <div className="flex items-center gap-3 mb-5 shrink-0">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2.5 flex-1">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search expense, category or vendor"
              className="w-full outline-none text-sm"
            />
          </div>
          <button className="bg-white border border-gray-200 px-4 py-2.5 rounded-lg text-sm text-gray-600">
            ⚙ Filter
          </button>
          <button className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium">
            + Add Expense
          </button>
        </div>

        {/* Table - only this part scrolls */}
        <div className="bg-white rounded-xl overflow-y-auto flex-1 min-h-0">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white">
              <tr>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Date</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Expense Name</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Category</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Vendor</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Payment Method</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Amount</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e) => (
                <tr key={e.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">{e.date}</td>
                  <td className="px-4 py-3 font-medium">{e.name}</td>
                  <td className="px-4 py-3">{e.category}</td>
                  <td className="px-4 py-3">{e.vendor}</td>
                  <td className="px-4 py-3">{e.method}</td>
                  <td className="px-4 py-3 font-medium">₹ {e.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-indigo-500 cursor-pointer">✎</span>
                      <span className="text-red-500 cursor-pointer">🗑</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}

export default Expenses
