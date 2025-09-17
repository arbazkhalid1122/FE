"use client"
import { usePathname } from "next/navigation"

export default function Navigation({ items, activeItem, setActiveItem }) {
  const router = usePathname()

  return (
    <nav className="flex-1 py-4">
      <ul className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = router === `/${item.id}`

          return (
            <li key={item.id}>
              <button
                onClick={() => {
                  window.location.href = item.href
                  setActiveItem(item.id)
                }}
                style={{
                  boxShadow: isActive ? "rgba(17, 17, 26, 0.05) 0px 1px 0px, #081F2426 0px 0px 2px" : "none",
                }}
                className={`w-full flex items-center cursor-pointer text-[#081F24] gap-3 px-4 py-4 rounded-lg text-sm transition-colors ${
                  isActive ? "bg-[#F7F7F7]" : "hover:bg-[#F7F7F7]"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? " text-[#03A84E]" : "text-black"}`} />
                {item.label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
