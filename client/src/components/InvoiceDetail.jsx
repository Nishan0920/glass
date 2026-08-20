function InvoiceDetail() {
  const items = [
    { id: 1, name: "Crizal Sapphire Lens", sku: "LENS001", details: "-1.50 / -0.75 x 90°\n+1.25 Add", qty: 1, price: 7500, discount: 5, amount: 7125 },
    { id: 2, name: "Titan Eyeglass Frame", sku: "FRM002", details: "Black, Medium", qty: 1, price: 4250, discount: 0, amount: 4250 },
    { id: 3, name: "Blue Cut Coating", sku: "COAT003", details: "Standard", qty: 1, price: 800, discount: 0, amount: 800 },
  ]

  return (
    <div className="w-full h-screen bg-gray-100 p-6 flex flex-col overflow-hidden">
      <div className="max-w-[1400px] w-full mx-auto flex flex-col flex-1 min-h-0">

        {/* Top actions bar */}
        <div className="flex justify-end gap-3 mb-4 shrink-0">
          <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
            🖨 Print
          </button>
          <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
            ⬇ Download
          </button>
          <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
            More ▾
          </button>
        </div>

        <div className="flex gap-5 flex-1 min-h-0">

          {/* Left - Invoice Info */}
          <div className="w-64 bg-white rounded-xl p-5 shrink-0 overflow-y-auto space-y-4">
            <div>
              <h3 className="font-semibold mb-3">Invoice Info</h3>
              <p className="text-xs text-gray-400">Invoice No</p>
              <p className="text-sm font-medium mb-3">INV-1256</p>
              <p className="text-xs text-gray-400">Date</p>
              <p className="text-sm font-medium mb-3">May 12, 2025 10:30 AM</p>
              <p className="text-xs text-gray-400">Customer</p>
              <p className="text-sm font-medium mb-3">Rahul Verma</p>
              <p className="text-xs text-gray-400">Mobile</p>
              <p className="text-sm font-medium mb-3">9876543210</p>
              <p className="text-xs text-gray-400 mb-1">Prescription</p>
              <div className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-1.5 mb-3">
                <span className="text-sm font-medium text-indigo-600">RX-1254</span>
                <button className="text-indigo-600 text-xs">View</button>
              </div>
              <p className="text-xs text-gray-400">Sales Person</p>
              <p className="text-sm font-medium">Admin</p>
            </div>
          </div>

          {/* Middle - Items, Payment History, Related */}
          <div className="flex-1 overflow-y-auto space-y-5 min-h-0">

            {/* Items */}
            <div className="bg-white rounded-xl p-5">
              <h3 className="font-semibold mb-4">Items</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 text-left">
                    <th className="pb-2 font-medium">#</th>
                    <th className="pb-2 font-medium">Product</th>
                    <th className="pb-2 font-medium">Power / Details</th>
                    <th className="pb-2 font-medium">Qty</th>
                    <th className="pb-2 font-medium">Price</th>
                    <th className="pb-2 font-medium">Discount</th>
                    <th className="pb-2 font-medium">Amount</th>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Payment History */}
            <div className="bg-white rounded-xl p-5">
              <h3 className="font-semibold mb-4">Payment History</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 text-left">
                    <th className="pb-2 font-medium">Paid By</th>
                    <th className="pb-2 font-medium">Amount</th>
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium">Transaction ID</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-100">
                    <td className="py-3">UPI</td>
                    <td className="py-3">₹ 12,127</td>
                    <td className="py-3">May 12, 2025 10:30 AM</td>
                    <td className="py-3">UPI/512345678901</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Related */}
            <div className="bg-white rounded-xl p-5">
              <h3 className="font-semibold mb-4">Related</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-sm font-medium mb-2">Customer History</p>
                  <p className="text-xs text-gray-400">Total Purchases</p>
                  <p className="text-lg font-semibold mb-2">₹ 24,750</p>
                  <button className="text-indigo-600 text-xs">View History</button>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-sm font-medium mb-2">Prescriptions (2)</p>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>RX-1254</span><span>May 12, 2025</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span></span><span>Apr 10, 2025</span>
                  </div>
                  <button className="text-indigo-600 text-xs">View All</button>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-sm font-medium mb-2">Appointments (1)</p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>May 20, 2025</span><span>10:00 AM</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Eye Checkup</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right - Summary + Actions */}
          <div className="w-64 shrink-0 overflow-y-auto space-y-5">
            <div className="bg-white rounded-xl p-5">
              <h3 className="font-semibold mb-4">Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Sub Total</span><span className="text-gray-800">₹ 12,175</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Discount</span><span className="text-gray-800">₹ 625</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Tax (GST 5%)</span><span className="text-gray-800">₹ 577</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Round Off</span><span className="text-gray-800">₹ 0.48</span>
                </div>
                <div className="flex justify-between font-semibold text-base pt-2 border-t border-gray-100">
                  <span>Total Amount</span><span className="text-indigo-600">₹ 12,127</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm">
                <p className="text-xs text-gray-400 mb-1">Paid By</p>
                <p className="font-medium">UPI</p>
                <div className="flex justify-between">
                  <span></span><span className="text-indigo-600 font-medium">₹ 12,127</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">Transaction ID</p>
                <p className="text-sm">UPI/512345678901</p>
                <p className="text-xs text-gray-400 mt-2">Note</p>
                <p className="text-sm">Thank you!</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5">
              <h3 className="font-semibold mb-4">Actions</h3>
              <div className="space-y-3 text-sm">
                <button className="flex items-center gap-2 text-gray-700">🖨 Print Invoice</button>
                <button className="flex items-center gap-2 text-gray-700 block">⬇ Download Invoice</button>
                <button className="flex items-center gap-2 text-gray-700 block">↩ Return / Exchange</button>
                <button className="flex items-center gap-2 text-green-600 block">💬 Send via WhatsApp</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default InvoiceDetail
