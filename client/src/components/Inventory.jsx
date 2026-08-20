function Inventory() {
  const products = [
    { id: 1, name: "Crizal Sapphire Lens 1.56 Blue UV", category: "Lenses", brand: "Essilor", sku: "LEN-0001", stock: 120 },
    { id: 2, name: "Titan Eyeplus Frame TE-1234", category: "Frames", brand: "Titan", sku: "FRM-0045", stock: 35 },
    { id: 3, name: "Acuvue Oasys (6P)", category: "Contact Lenses", brand: "Johnson & Johnson", sku: "CL-0012", stock: 18 },
    { id: 4, name: "Ray-Ban RB3154 Clubmaster", category: "Sunglasses", brand: "Ray-Ban", sku: "SUN-0211", stock: 22 },
    { id: 5, name: "Lens Cleaning Solution 100ml", category: "Solutions", brand: "Optifree", sku: "SOL-0007", stock: 80 },
    { id: 6, name: "Blue Cut Lens 1.56", category: "Lenses", brand: "Optifree", sku: "LEN-0025", stock: 0 },
  ]

  return (
    <div className="w-full h-screen bg-gray-100 p-8 flex flex-col overflow-hidden">
      <div className="max-w-[1400px] w-full mx-auto flex flex-col flex-1 min-h-0">

        {/* Header */}
        <div className="bg-[#14213d] text-white px-8 py-6 rounded-2xl mb-5 shrink-0">
          <h2 className="text-2xl font-bold">Inventory</h2>
          <p className="text-sm text-gray-300">Manage your stock and products</p>
        </div>

        {/* Search + button */}
        <div className="flex justify-between items-center gap-3 mb-5 shrink-0">
          <input
            type="text"
            placeholder="Search by product name, SKU, barcode or brand"
            className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none"
          />
          <button className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg">+ Add Product</button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-4 mb-5 shrink-0">
          <div className="bg-white p-4 rounded-xl">
            <p className="text-xs text-gray-500">Total Products</p>
            <h3 className="text-xl font-semibold">752</h3>
          </div>
          <div className="bg-white p-4 rounded-xl">
            <p className="text-xs text-gray-500">In Stock</p>
            <h3 className="text-xl font-semibold">512</h3>
          </div>
          <div className="bg-white p-4 rounded-xl">
            <p className="text-xs text-gray-500">Low Stock</p>
            <h3 className="text-xl font-semibold">128</h3>
          </div>
          <div className="bg-white p-4 rounded-xl">
            <p className="text-xs text-gray-500">Out of Stock</p>
            <h3 className="text-xl font-semibold">112</h3>
          </div>
        </div>

        {/* Table - only this part scrolls */}
        <div className="bg-white rounded-xl overflow-y-auto flex-1 min-h-0">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white">
              <tr>
                <th className="text-left px-4 py-3">#</th>
                <th className="text-left px-4 py-3">Product</th>
                <th className="text-left px-4 py-3">Category</th>
                <th className="text-left px-4 py-3">Brand</th>
                <th className="text-left px-4 py-3">SKU</th>
                <th className="text-left px-4 py-3">Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, index) => (
                <tr key={p.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">{p.name}</td>
                  <td className="px-4 py-3">{p.category}</td>
                  <td className="px-4 py-3">{p.brand}</td>
                  <td className="px-4 py-3">{p.sku}</td>
                  <td className="px-4 py-3">{p.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}

export default Inventory
