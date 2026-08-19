function Inventory() {
  const products = [
    { id: 1, name: "Crizal Sapphire Lens 1.56 Blue UV", category: "Lenses", brand: "Essilor", sku: "LEN-0001", stock: 120, status: "In Stock" },
    { id: 2, name: "Titan Eyeplus Frame TE-1234", category: "Frames", brand: "Titan", sku: "FRM-0045", stock: 35, status: "In Stock" },
    { id: 3, name: "Acuvue Oasys (6P)", category: "Contact Lenses", brand: "Johnson & Johnson", sku: "CL-0012", stock: 18, status: "Low Stock" },
    { id: 4, name: "Ray-Ban RB3154 Clubmaster", category: "Sunglasses", brand: "Ray-Ban", sku: "SUN-0211", stock: 22, status: "Low Stock" },
    { id: 5, name: "Lens Cleaning Solution 100ml", category: "Solutions", brand: "Optifree", sku: "SOL-0007", stock: 80, status: "In Stock" },
    { id: 6, name: "Blue Cut Lens 1.56", category: "Lenses", brand: "Optifree", sku: "LEN-0025", stock: 0, status: "Out of Stock" },
  ]

  const statusStyle = {
    "In Stock": "bg-green-100 text-green-600",
    "Low Stock": "bg-yellow-100 text-yellow-600",
    "Out of Stock": "bg-red-100 text-red-600",
  }

  return (
    <div className="w-screen min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-[1400px] mx-auto">

        {/* Header */}
        <div className="bg-[#14213d] text-white px-8 py-6 rounded-2xl mb-5">
          <h2 className="text-2xl font-bold m-0">Inventory</h2>
          <p className="text-sm text-gray-300 mt-1">Manage your stock and products</p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2.5 flex-1 min-w-[300px]">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search by product name, SKU, barcode or brand"
              className="w-full outline-none text-sm"
            />
          </div>
          <div className="flex gap-2.5">
            <button className="bg-white border border-gray-200 px-4 py-2.5 rounded-lg cursor-pointer">
              ⚙ Filter
            </button>
            <button className="bg-indigo-600 text-white px-4.5 py-2.5 rounded-lg font-medium cursor-pointer hover:bg-indigo-700">
              + Add Product
            </button>
            <button className="bg-white border border-gray-200 px-4.5 py-2.5 rounded-lg cursor-pointer">
              Import
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <StatCard icon="📦" iconBg="bg-indigo-100" label="Total Products" value="752" note={<span className="text-xs text-gray-400">All Items</span>} />
          <StatCard icon="✅" iconBg="bg-green-100" label="In Stock" value="512" note={<span className="text-xs text-green-500">▲ 68.1%</span>} />
          <StatCard icon="⚠️" iconBg="bg-yellow-100" label="Low Stock" value="128" note={<span className="text-xs text-green-500">▲ 17.0%</span>} />
          <StatCard icon="⛔" iconBg="bg-red-100" label="Out of Stock" value="112" note={<span className="text-xs text-red-500">▼ 14.9%</span>} />
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mb-4 border-b border-gray-200 overflow-x-auto">
          {["All Items", "Frames", "Lenses", "Contact Lenses", "Sunglasses", "Accessories", "Solutions"].map((tab, i) => (
            <span
              key={tab}
              className={`whitespace-nowrap pb-2.5 text-sm cursor-pointer ${
                i === 0
                  ? "text-indigo-600 font-semibold border-b-2 border-indigo-600"
                  : "text-gray-500"
              }`}
            >
              {tab}
            </span>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                {["#", "Product", "Category", "Brand", "SKU / Barcode", "Stock", "Status", "Action"].map((h) => (
                  <th key={h} className="text-left px-4 py-3.5 text-gray-500 font-medium border-b border-gray-100 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p, index) => (
                <tr key={p.id}>
                  <td className="px-4 py-3.5 border-b border-gray-50">{index + 1}</td>
                  <td className="px-4 py-3.5 border-b border-gray-50 font-medium min-w-[180px] whitespace-normal">{p.name}</td>
                  <td className="px-4 py-3.5 border-b border-gray-50 whitespace-nowrap">{p.category}</td>
                  <td className="px-4 py-3.5 border-b border-gray-50 whitespace-nowrap">{p.brand}</td>
                  <td className="px-4 py-3.5 border-b border-gray-50 whitespace-nowrap">{p.sku}</td>
                  <td className="px-4 py-3.5 border-b border-gray-50 whitespace-nowrap">{p.stock}</td>
                  <td className="px-4 py-3.5 border-b border-gray-50 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle[p.status]}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 border-b border-gray-50 whitespace-nowrap">⋮</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="flex flex-wrap justify-between items-center gap-2.5 py-4 px-1 text-sm text-gray-500">
          <span>Showing 1 to 6 of 752 entries</span>
          <div className="flex items-center gap-1.5">
            <PageBtn label="‹" />
            <PageBtn label="1" active />
            <PageBtn label="2" />
            <PageBtn label="3" />
            <span>...</span>
            <PageBtn label="126" />
            <PageBtn label="›" />
          </div>
        </div>

      </div>
    </div>
  )
}

function StatCard({ icon, iconBg, label, value, note }) {
  return (
    <div className="bg-white p-4.5 rounded-xl flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${iconBg}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500 m-0">{label}</p>
        <h3 className="text-xl font-semibold my-0.5">{value}</h3>
        {note}
      </div>
    </div>
  )
}

function PageBtn({ label, active }) {
  return (
    <button
      className={`border px-3 py-1.5 rounded-md cursor-pointer ${
        active
          ? "bg-indigo-600 text-white border-indigo-600"
          : "bg-white border-gray-200"
      }`}
    >
      {label}
    </button>
  )
}

export default Inventory