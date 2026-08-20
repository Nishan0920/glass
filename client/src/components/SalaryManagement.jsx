import { useState } from "react"

function SalaryManagement() {
  const [activeTab, setActiveTab] = useState("Salary List")

  const salaries = [
    { id: 1, name: "Anjali Verma", designation: "Optometrist", basic: 60000, allowances: 8000, deductions: 2000, net: 66000, status: "Paid" },
    { id: 2, name: "Rohan Gupta", designation: "Sales Executive", basic: 28000, allowances: 5000, deductions: 1000, net: 32000, status: "Paid" },
    { id: 3, name: "Pooja Mehta", designation: "Optical Assistant", basic: 22000, allowances: 3000, deductions: 1000, net: 24000, status: "Paid" },
    { id: 4, name: "Vikram Singh", designation: "Store Manager", basic: 35000, allowances: 5000, deductions: 1500, net: 38500, status: "Paid" },
    { id: 5, name: "Neha Kapoor", designation: "Customer Support", basic: 20000, allowances: 2500, deductions: 500, net: 22000, status: "Paid" },
    { id: 6, name: "Amit Yadav", designation: "Accountant", basic: 30000, allowances: 4000, deductions: 1000, net: 33000, status: "Pending" },
  ]

  const statusStyle = {
    "Paid": "bg-green-100 text-green-600",
    "Pending": "bg-yellow-100 text-yellow-600",
  }

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
            <button className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium">
              + Add Salary
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-4 mb-5 shrink-0">
          <div className="bg-white p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">💰</div>
            <div>
              <p className="text-xs text-gray-500">Total Payroll</p>
              <h3 className="text-xl font-semibold">₹ 3,45,000</h3>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">✅</div>
            <div>
              <p className="text-xs text-gray-500">Paid This Month</p>
              <h3 className="text-xl font-semibold">₹ 3,20,000</h3>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">⏳</div>
            <div>
              <p className="text-xs text-gray-500">Pending Amount</p>
              <h3 className="text-xl font-semibold">₹ 25,000</h3>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">👥</div>
            <div>
              <p className="text-xs text-gray-500">Employees</p>
              <h3 className="text-xl font-semibold">12</h3>
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
                  {salaries.map((s, index) => (
                    <tr key={s.id} className="border-t border-gray-100">
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3 font-medium">{s.name}</td>
                      <td className="px-4 py-3">{s.designation}</td>
                      <td className="px-4 py-3">₹ {s.basic.toLocaleString()}</td>
                      <td className="px-4 py-3">₹ {s.allowances.toLocaleString()}</td>
                      <td className="px-4 py-3">₹ {s.deductions.toLocaleString()}</td>
                      <td className="px-4 py-3 font-medium">₹ {s.net.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle[s.status]}`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="cursor-pointer">👁</span>
                          <span className="cursor-pointer">⋮</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom summary + payment */}
            <div className="grid grid-cols-2 gap-5 shrink-0">
              <div className="bg-white rounded-xl p-5">
                <h3 className="font-semibold mb-4">Payroll Summary</h3>
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Total Basic Salary</p>
                    <p className="font-medium">₹ 2,55,000</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Total Allowances</p>
                    <p className="font-medium">₹ 32,000</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Total Deductions</p>
                    <p className="font-medium">₹ 10,000</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Net Payroll</p>
                    <p className="font-medium">₹ 2,77,000</p>
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

      </div>
    </div>
  )
}

export default SalaryManagement
