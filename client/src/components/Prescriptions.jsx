function Prescriptions() {
  const prescriptions = [
    { id: 1, rxId: "RX-1254", customer: "Rahul Verma", date: "May 12, 2025", type: "Single Vision", right: "-1.50 SPH -0.75 CYL 180°", left: "-1.25 SPH -0.50 CYL 175°" },
    { id: 2, rxId: "RX-1253", customer: "Neha Sharma", date: "May 11, 2025", type: "Bifocal", right: "-2.00 SPH ADD +1.50", left: "-1.75 SPH ADD +1.50" },
    { id: 3, rxId: "RX-1252", customer: "Amit Patel", date: "May 10, 2025", type: "Progressive", right: "-3.25 SPH ADD +2.00", left: "-3.00 SPH ADD +2.00" },
    { id: 4, rxId: "RX-1251", customer: "Priya Mehta", date: "May 09, 2025", type: "Single Vision", right: "-0.75 SPH -0.50 CYL 90°", left: "-0.50 SPH -0.25 CYL 85°" },
    { id: 5, rxId: "RX-1250", customer: "Vikram Joshi", date: "May 08, 2025", type: "Bifocal", right: "-1.25 SPH ADD +1.25", left: "-1.00 SPH ADD +1.25" },
  ]

  return (
    <div className="w-full h-screen bg-gray-100 p-8 flex flex-col overflow-hidden">
      <div className="max-w-[1400px] w-full mx-auto flex flex-col flex-1 min-h-0">

        {/* Header */}
        <div className="flex justify-between items-center mb-5 shrink-0">
          <div>
            <h2 className="text-2xl font-bold">Prescriptions</h2>
            <p className="text-sm text-gray-400">Manage and track customer prescriptions</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600">
              📅 May 12, 2025
            </div>
            <span className="text-lg">🔔</span>
          </div>
        </div>

        {/* Search + button */}
        <div className="flex justify-between items-center gap-3 mb-5 shrink-0">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2.5 flex-1 min-w-[300px]">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search by customer name, mobile or prescription ID"
              className="w-full outline-none text-sm"
            />
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium">
            + New Prescription
          </button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4 mb-5 shrink-0">
          <div className="bg-white p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">📄</div>
            <div>
              <p className="text-xs text-gray-500">Total Prescriptions</p>
              <h3 className="text-xl font-semibold">268</h3>
              <span className="text-xs text-gray-400">This Month</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">👓</div>
            <div>
              <p className="text-xs text-gray-500">Single Vision</p>
              <h3 className="text-xl font-semibold">112</h3>
              <span className="text-xs text-green-500">▲ 41.8%</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">🕶️</div>
            <div>
              <p className="text-xs text-gray-500">Bifocal</p>
              <h3 className="text-xl font-semibold">68</h3>
              <span className="text-xs text-red-500">▼ 25.4%</span>
            </div>
          </div>
        </div>

        {/* Table - only this part scrolls */}
        <div className="bg-white rounded-xl overflow-y-auto flex-1 min-h-0">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white">
              <tr>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">#</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Prescription ID</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Customer</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Date</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Type</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Right (OD)</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Left (OS)</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((p, index) => (
                <tr key={p.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-medium">{p.rxId}</td>
                  <td className="px-4 py-3">{p.customer}</td>
                  <td className="px-4 py-3">{p.date}</td>
                  <td className="px-4 py-3">{p.type}</td>
                  <td className="px-4 py-3">{p.right}</td>
                  <td className="px-4 py-3">{p.left}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}

export default Prescriptions
