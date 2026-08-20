import { useState } from "react"

function RentLease() {
  const [activeTab, setActiveTab] = useState("Rent Payments")

  const payments = [
    { id: 1, property: "Main Shop - MG Road", location: "New Delhi", rent: 45000, due: "May 01, 2025", paid: "May 01, 2025", method: "Bank Transfer" },
    { id: 2, property: "Main Shop - MG Road", location: "New Delhi", rent: 45000, due: "Apr 01, 2025", paid: "Apr 01, 2025", method: "UPI" },
    { id: 3, property: "Main Shop - MG Road", location: "New Delhi", rent: 45000, due: "Mar 01, 2025", paid: "Mar 02, 2025", method: "Cash" },
    { id: 4, property: "Main Shop - MG Road", location: "New Delhi", rent: 45000, due: "Feb 01, 2025", paid: "Feb 01, 2025", method: "Bank Transfer" },
    { id: 5, property: "Main Shop - MG Road", location: "New Delhi", rent: 45000, due: "Jan 01, 2025", paid: "Jan 01, 2025", method: "UPI" },
  ]

  return (
    <div className="w-full h-screen bg-gray-100 p-8 flex flex-col overflow-hidden">
      <div className="max-w-[1400px] w-full mx-auto flex flex-col flex-1 min-h-0">

        {/* Header */}
        <div className="mb-5 shrink-0">
          <h2 className="text-2xl font-bold">Rent / Lease</h2>
          <p className="text-sm text-gray-400">Manage your property rent and lease payments</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4 mb-5 shrink-0">
          <div className="bg-white p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">📅</div>
            <div>
              <p className="text-xs text-gray-500">Monthly Rent</p>
              <h3 className="text-xl font-semibold">₹ 45,000</h3>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">📆</div>
            <div>
              <p className="text-xs text-gray-500">Next Due Date</p>
              <h3 className="text-xl font-semibold">Jun 01, 2025</h3>
              <span className="text-xs text-gray-400">20 Days Left</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">💰</div>
            <div>
              <p className="text-xs text-gray-500">Advance Paid</p>
              <h3 className="text-xl font-semibold">₹ 90,000</h3>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mb-4 border-b border-gray-200 shrink-0">
          {["Rent Payments", "Lease Details"].map((tab) => (
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

        {/* Content */}
        {activeTab === "Rent Payments" ? (
          <div className="bg-white rounded-xl overflow-y-auto flex-1 min-h-0">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">#</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Property / Location</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Rent Amount</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Due Date</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Paid Date</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Payment Method</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p, index) => (
                  <tr key={p.id} className="border-t border-gray-100">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium m-0">{p.property}</p>
                      <p className="text-xs text-gray-400 m-0">{p.location}</p>
                    </td>
                    <td className="px-4 py-3">₹ {p.rent.toLocaleString()}</td>
                    <td className="px-4 py-3">{p.due}</td>
                    <td className="px-4 py-3">{p.paid}</td>
                    <td className="px-4 py-3">{p.method}</td>
                    <td className="px-4 py-3">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                        Paid
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-6 flex-1 overflow-y-auto">
            <h3 className="font-semibold mb-5">Lease Information</h3>
            <div className="grid grid-cols-3 gap-x-8 gap-y-5">
              <div>
                <p className="text-xs text-gray-400 mb-1">Property Owner</p>
                <p className="text-sm font-medium">Mr. Rajesh Kumar</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Agreement End Date</p>
                <p className="text-sm font-medium">Dec 31, 2027</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Security Deposit</p>
                <p className="text-sm font-medium">₹ 1,50,000</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Agreement Start Date</p>
                <p className="text-sm font-medium">Jan 01, 2023</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Notice Period</p>
                <p className="text-sm font-medium">2 Months</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Rent Increment</p>
                <p className="text-sm font-medium">10% Every Year</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default RentLease
