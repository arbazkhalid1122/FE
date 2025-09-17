'use client'

import { usePathname, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { 
  User, 
  Building2, 
  Landmark, 
  FileText, 
  Users, 
  Bell, 
  Shield,
  ChevronLeft,
  LogOut
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sidebar as SidebarPrimitive, SidebarContent, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar"
import UserProfile from "../invoices/user-profile"
import Image from "next/image"
import { signOut } from "next-auth/react"

const settingsNavItems = [
  {
    section: "GENERAL",
    items: [
      { id: "contact-person", label: "Contact Person", icon: User, href: "/accounts/contact-person" },
    ]
  },
  {
    section: "FINANCE",
    items: [
      { id: "banks", label: "Banks", icon: Landmark, href: "/accounts/banks" },
      { id: "invoice-preferences", label: "Invoice preferences", icon: FileText, href: "/accounts/invoice-preferences" },
    ]
  },
  {
    section: "ACCOUNT MANAGEMENT",
    items: [
      { id: "team-members", label: "Team members", icon: Users, href: "/accounts/team-members" },
      { id: "notifications", label: "Notifications", icon: Bell, href: "/accounts/notifications" },
      { id: "security", label: "Security", icon: Shield, href: "/accounts/security" },
    ]
  }
]

export default function SettingsSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  
  const handleBackClick = () => {
    router.push('/dashboard')
  }
  
  return (
    <SidebarPrimitive className="w-76 bg-white border-r border-[#e4e4e7]">
        <div className="p-4 border-b border-[#e4e4e7] bg-white">
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="w-7 h-7 border-1 border-gray-200 p-1 rounded-md" />
          <span>Settings</span>
        </button>
      </div>
      <SidebarContent className="px-6 flex-1 bg-white">     

        {/* Navigation Sections */}
        <div className="flex-1 mt-4">
          {settingsNavItems.map((section) => (
            <div key={section.section} className="mb-8">
              <h3 className="text-xs font-medium text-gray-500 mb-4 uppercase tracking-wider">{section.section}</h3>
              <nav className="space-y-2">
                {section.items.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`w-full flex items-center cursor-pointer text-[#081F24] gap-3 px-4 py-4 rounded-lg text-sm transition-colors ${
                        isActive ? "bg-[#F7F7F7]" : "hover:bg-[#F7F7F7]"
                      }`}
                      style={{
                        boxShadow: isActive ? "rgba(17, 17, 26, 0.05) 0px 1px 0px, #081F2426 0px 0px 2px" : "none",
                      }}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-[#03A84E]" : "text-black"}`} />
                      {item.label}
                    </Link>
                  )
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* User Profile - Bottom */}
        <div className="mt-auto mb-2">
          <UserProfile 
            name={session?.user?.name || "User"} 
            location={session?.user?.email || "user@example.com"} 
            initials={session?.user?.name ? session.user.name.split(' ').map(part => part.charAt(0)).join('').toUpperCase() : 'U'} 
            showChevron={true} 
          />
        </div>
      </SidebarContent>

      <SidebarFooter className="p-6 bg-white">
        <div className="border-t border-[#e4e4e7] pt-6">
          <button
            onClick={() => signOut({ callbackUrl: '/sign-in' })}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-black font-medium hover:bg-[#ee6a5f]/10 transition-colors border border-[#e4e4e7] rounded-full w-[fit-content]"
          >
            <LogOut className="w-4 h-4 text-[#ee6a5f]" />
            Logout
          </button>
        </div>
      </SidebarFooter>
    </SidebarPrimitive>
  )
}
