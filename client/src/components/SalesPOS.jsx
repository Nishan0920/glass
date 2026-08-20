import { useState } from "react"

function SalesPOS() {
  const [items] = useState([
    { id: 1, name: "Crizal Sapphire Lens", sku: "LENS001", details: "-1.50 / -0.75 x 90°\n+1.25 Add", qty: 1, price: 7500, discount: 5, amount: 7125 },
    { id: 2, name: "Titan Eyeglass Frame", sku: "FRM002", details: "Black, Medium", qty: 1, price: 4250, discount: 0, amount: 4250 },
    { id: 3, name: "Blue Cut Coating", sku: "COAT003", details: "Standard", qty: 1, price: 800, discount: 0, amount: 800 },
  ])

  const [paidBy, setPaidBy] = useState("Cash")

  const subTotal = 12175
  const discount = 625
  const tax = 577
  const roundOff = 0.48
  const total = 12127

  return (
    <div className="w-screen min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-[1400px] mx-auto">

        {/* Top bar */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
          <div>
            <h2 className="text-2xl font-bold m-0">Sales (POS)</h2>
            <p className="text-sm text-gray-400 mt-1">Home / Sales / New Sale</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600">
              📅 May 12, 2025
            </div>
            <span className="text-gray-400 text-lg cursor-pointer">🔔</span>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm">A</div>
              <div className="text-sm">
                <p className="m-0 font-medium">Admin</p>
                <p className="m-0 text-xs text-gray-400">Administrator</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-3 mb-6">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search by Product, SKU or Barcode"
            className="flex-1 outline-none text-sm"
          />
          <span className="text-xs text-gray-400 border border-gray-200 rounded px-2 py-1">F2</span>
          <button className="flex items-center gap-1 text-sm text-gray-600 border-l border-gray-200 pl-4 ml-2">
            ⌗ Scan Barcode
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left side */}
          <div className="lg:col-span-2 space-y-6">

            {/* Customer / Prescription */}
            <div className="bg-white rounded-xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-400 mb-2">Customer</p>
                <div className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2">
                  <span className="text-sm font-medium">Rahul Verma</span>
                  <span className="bg-indigo-100 text-indigo-600 text-xs px-2 py-0.5 rounded-full">New</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">Mobile</p>
                <p className="text-sm">9876543210</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-2">Prescription</p>
                <div className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2">
                  <span className="text-sm font-medium">RX-1254</span>
                  <button className="text-indigo-600 text-xs font-medium">View</button>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="bg-white rounded-xl p-5">
              <h3 className="font-semibold mb-4">Items</h3>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-gray-400 text-left">
                    <th className="pb-2 font-medium">#</th>
                    <th className="pb-2 font-medium">Product</th>
                    <th className="pb-2 font-medium">Power / Details</th>
                    <th className="pb-2 font-medium">Qty</th>
                    <th className="pb-2 font-medium">Price</th>
                    <th className="pb-2 font-medium">Discount</th>
                    <th className="pb-2 font-medium">Amount</th>
                    <th className="pb-2 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr key={item.id} className="border-t border-gray-100">
                      <td className="py-3">{i + 1}</td>
                      <td className="py-3">
                        <p className="font-medium m-0">{item.name}</p>
                        <p className="text-xs text-gray-400 m-0">SKU: {item.sku}</p>
                      </td>
                      <td className="py-3 text-gray-500 whitespace-pre-line text-xs">{item.details}</td>
                      <td className="py-3">{item.qty}</td>
                      <td className="py-3">₹ {item.price.toLocaleString()}</td>
                      <td className="py-3">{item.discount}%</td>
                      <td className="py-3 font-medium">₹ {item.amount.toLocaleString()}</td>
                      <td className="py-3 text-red-400 cursor-pointer">🗑</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-between items-center mt-4">
                <button className="text-indigo-600 text-sm font-medium">+ Add Product</button>
                <span className="text-xs text-gray-400">{items.length} Items</span>
              </div>
            </div>
          </div>

          {/* Right side - Summary */}
          <div className="bg-white rounded-xl p-5 h-fit space-y-5">
            <h3 className="font-semibold">Summary</h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Sub Total</span>
                <span className="text-gray-800">₹ {subTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Discount</span>
                <span className="text-gray-800">₹ {discount}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Tax (GST 5%)</span>
                <span className="text-gray-800">₹ {tax}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Round Off</span>
                <span className="text-gray-800">₹ {roundOff}</span>
              </div>
              <div className="flex justify-between font-semibold text-base pt-2 border-t border-gray-100">
                <span>Total Amount</span>
                <span className="text-indigo-600">₹ {total.toLocaleString()}</span>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-2">Paid By</p>
              <div className="grid grid-cols-4 gap-2">
                {["Cash", "UPI", "Card", "Other"].map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaidBy(method)}
                    className={`text-sm py-2 rounded-lg border ${
                      paidBy === method
                        ? "border-indigo-500 text-indigo-600 bg-indigo-50"
                        : "border-gray-200 text-gray-600"
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-2">Amount Paid</p>
              <input
                type="text"
                defaultValue={total.toLocaleString()}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
              />
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-2">Note</p>
              <input
                type="text"
                defaultValue="Thank you!"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
              />
            </div>

            <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2">
              Complete Sale <span className="text-xs opacity-70">F4</span>
            </button>

            <div className="flex gap-3">
              <button className="flex-1 border border-gray-200 py-2.5 rounded-lg text-sm">Save Draft</button>
              <button className="flex-1 border border-gray-200 py-2.5 rounded-lg text-sm text-red-500">Cancel</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default SalesPOS