function Staff() {
  const staff = [
    { id: 1, name: "Anjali Verma", empId: "EMP-001", designation: "Optometrist", phone: "98765 43210", join: "Jan 10, 2024", status: "Active" },
    { id: 2, name: "Rohan Gupta", empId: "EMP-002", designation: "Sales Executive", phone: "98123 45678", join: "Mar 15, 2024", status: "Active" },
    { id: 3, name: "Pooja Mehta", empId: "EMP-003", designation: "Optical Assistant", phone: "91234 56789", join: "Feb 20, 2024", status: "Active" },
    { id: 4, name: "Vikram Singh", empId: "EMP-004", designation: "Store Manager", phone: "99987 66554", join: "Dec 05, 2023", status: "Active" },
    { id: 5, name: "Neha Kapoor", empId: "EMP-005", designation: "Customer Support", phone: "98701 23456", join: "Apr 18, 2024", status: "Active" },
    { id: 6, name: "Amit Yadav", empId: "EMP-006", designation: "Accountant", phone: "96543 21098", join: "Jan 25, 2024", status: "On Leave" },
  ]

  const statusStyle = {
    "Active": "bg-green-100 text-green-600",
    "On Leave": "bg-yellow-100 text-yellow-600",
    "Resigned": "bg-red-100 text-red-600",
  }

  return (
    <div className="w-full h-screen bg-gray-100 p-8 flex flex-col overflow-hidden">
      <div className="max-w-[1400px] w-full mx-auto flex flex-col flex-1 min-h-0">

        {/* Header */}
        <div className="flex justify-between items-center mb-5 shrink-0">
          <div>
            <h2 className="text-2xl font-bold">Staff</h2>
            <p className="text-sm text-gray-400">Manage your staff and employee information</p>
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium">
            + Add Staff
          </button>
        </div>

        {/* Search + Filter */}
        <div className="flex items-center gap-3 mb-5 shrink-0">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2.5 flex-1">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search by name, phone or designation"
              className="w-full outline-none text-sm"
            />
          </div>
          <button className="bg-white border border-gray-200 px-4 py-2.5 rounded-lg text-sm text-gray-600">
            ⚙ Filter
          </button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-4 mb-5 shrink-0">
          <div className="bg-white p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">👥</div>
            <div>
              <p className="text-xs text-gray-500">Total Staff</p>
              <h3 className="text-xl font-semibold">12</h3>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">📋</div>
            <div>
              <p className="text-xs text-gray-500">Active Staff</p>
              <h3 className="text-xl font-semibold">10</h3>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">🧑</div>
            <div>
              <p className="text-xs text-gray-500">On Leave</p>
              <h3 className="text-xl font-semibold">1</h3>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">🚫</div>
            <div>
              <p className="text-xs text-gray-500">Resigned</p>
              <h3 className="text-xl font-semibold">1</h3>
            </div>
          </div>
        </div>

        {/* Table - only this part scrolls */}
        <div className="bg-white rounded-xl overflow-y-auto flex-1 min-h-0">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white">
              <tr>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">#</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Staff Name</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Designation</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Phone</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Join Date</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s, index) => (
                <tr key={s.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-medium text-indigo-600">
                        {s.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-medium m-0">{s.name}</p>
                        <p className="text-xs text-gray-400 m-0">{s.empId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{s.designation}</td>
                  <td className="px-4 py-3">{s.phone}</td>
                  <td className="px-4 py-3">{s.join}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle[s.status]}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">⋮</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}

export default Staff
