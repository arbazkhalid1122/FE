'use client'

export default function BanksPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-1">Account Management</h1>
        <p className="text-gray-600 text-sm">Increase cashflow with your invoices</p>
      </div>

      <div className="bg-white rounded-lg border border-[#e4e4e7]">
        <div className="p-6 border-b border-[#e4e4e7]">
          <h2 className="text-base font-medium mb-1">Banks</h2>
          <p className="text-sm text-[#71717A]">Manage your bank accounts</p>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-center h-64 text-[#71717A]">
            Coming soon...
          </div>
        </div>
      </div>
    </div>
  )
}
