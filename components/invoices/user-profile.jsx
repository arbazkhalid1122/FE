"use client"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ChevronsUpDown } from "lucide-react"

export default function UserProfile({ name, location, initials, showChevron = false }) {
  return (
    <div className="border border-[#e4e4e7] rounded-lg">
      <div className="flex p-4 items-center gap-3">
        <Avatar className="w-10 h-10">
          <AvatarFallback className="text-[#03A84E] bg-[#0E363F0F] text-md font-medium">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="text-sm text-[#000000] truncate">{name}</div>
            {showChevron && <ChevronsUpDown className="w-4 h-4 text-[#61c454]" />}
          </div>
          <div className="text-xs text-[#a1a1aa] truncate">{location}</div>
        </div>
      </div>
    </div>
  )
}
