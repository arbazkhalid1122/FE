"use client"

import { useState } from "react"

// Default fake data
const defaultTransactions = [
  {
    id: "1",
    title: "Insurance claims invoices",
    description: "Turn any insurance claims invoice into a working capital",
    icon: "🏠",
    type: "recent",
  },
  {
    id: "2",
    title: "Insurance claims invoices",
    description: "Turn any insurance claims invoice into a working capital",
    icon: "📄",
    type: "awaiting",
  },
]

export default function TransactionHistory({
  recentTransactionsTitle = "Recent transaction",
  recentTransactionsSubtitle = "Showing your recent transfers",
  awaitingFinancingTitle = "Invoices awaiting financing",
  awaitingFinancingSubtitle = "Showing activities on the invoices submitted for financing",
  transactions = defaultTransactions,
  onTransactionClick,
  className = "",
}) {
  const [hoveredTransaction, setHoveredTransaction] = useState(null)

  const recentTransactions = transactions.filter((t) => t.type === "recent")
  const awaitingTransactions = transactions.filter((t) => t.type === "awaiting")

  const handleTransactionClick = (transaction) => {
    if (onTransactionClick) {
      onTransactionClick(transaction)
    }
  }

  const renderTransactionPanel = (
    title,
    subtitle,
    transactions,
    type,
  ) => (
    <div className="w-full">
      <div className="bg-white rounded-t-lg p-6 border-b border-gray-100">
        <h2 className="text-lg font-medium text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      </div>
      <div className="bg-white rounded-b-lg p-6 min-h-[400px] flex flex-col items-center justify-center">
        {transactions.length === 0 ? (
          <div className="text-center text-gray-400">No transactions to display</div>
        ) : (
          transactions.map((transaction) => (
            <div
              key={transaction.id}
              className={`text-center max-w-xs mx-auto cursor-pointer transition-all duration-200 ${
                hoveredTransaction === transaction.id ? "transform scale-105" : ""
              }`}
              onMouseEnter={() => setHoveredTransaction(transaction.id)}
              onMouseLeave={() => setHoveredTransaction(null)}
              onClick={() => handleTransactionClick(transaction)}
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">{transaction.icon}</span>
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-2">{transaction.title}</h3>
              <p className="text-sm text-gray-500">{transaction.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )

  return (
     <div className="flex gap-4">
        <div className="w-1/3">
            {renderTransactionPanel(recentTransactionsTitle, recentTransactionsSubtitle, recentTransactions, "recent")}
        </div>
        <div className="w-2/3">
            {renderTransactionPanel(awaitingFinancingTitle, awaitingFinancingSubtitle, awaitingTransactions, "awaiting")}
        </div>
    </div>
  )
}
