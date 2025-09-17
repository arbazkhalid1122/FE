"use client"
import { FileText, CreditCard, LogOut, Gauge, LineChartIcon as ChartLine } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import UserProfile from "../invoices/user-profile"
import Navigation from "../invoices/navigation"
import Image from "next/image"
import { Sidebar as SidebarPrimitive, SidebarContent, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar"
import { signOut } from "next-auth/react"

export default function Sidebar({ activeItem, setActiveItem }) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const isOnboarding = pathname.includes("/on-boarding")

  const getUserInitials = () => {
    if (!session?.user?.name) return 'AP';
    const nameParts = session.user.name.split(' ');
    return nameParts.map(part => part.charAt(0)).join('').toUpperCase();
  }

  const getUserName = () => {
    if (!session?.user) return 'Accessux Pharmacie'
    return session.user.name || 'Accessux Pharmacie'
  }

  const getUserLocation = () => {
    if (!session?.user) return 'Cocody, Abidjan'
    return session.user.email || 'Cocody, Abidjan'
  }

  const getCompanyName = () => {
    return 'EnvoyX'
  }

  const handleProfileClick = () => {
    // Navigate to account management page when profile is clicked
    router.push('/account')
  }

  const navigationItems = [
    { id: "dashboard", label: "Home", icon: Gauge, href: "/dashboard" },
    { id: "invoices", label: "Invoices", icon: FileText, href: "/invoices" },
    { id: "accounts", label: "Accounts", icon: CreditCard, href: "/accounts" },
    { id: "insights", label: "Insights & Reports", icon: ChartLine, href: "/dashboard" },
  ]

  const navigationItem = [{ id: "on-boarding", label: "Onboarding", icon: Gauge, href: "/on-boarding" }]

  return (
    <SidebarPrimitive className="w-76 bg-white border-r border-[#e4e4e7]" style={{ backgroundColor: "white" }}>
      <SidebarHeader className="p-6 pb-4 bg-white">
        {/* Logo */}
        <div className="flex items-center justify-between">
    <Image src="/darkLogo.svg" alt="Drawer Icon" width={100} height={100} />
          <Image src="/drawer.svg" alt="Drawer Icon" width={20} height={20} />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-6 flex-1 bg-white">
        {/* User Profile - Top */}
        {!isOnboarding && (
          <div className="mb-6">
            {session?.user ? (
              <div onClick={handleProfileClick} className="cursor-pointer hover:opacity-80 transition-opacity">
                <UserProfile 
                  name={getCompanyName()} 
                  location={getUserLocation()} 
                  initials={getUserInitials()} 
                  showChevron={true} 
                />
              </div>
            ) : (
              <div className="border border-[#e4e4e7] rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex-1">
          <Navigation
            items={isOnboarding ? navigationItem : navigationItems}
            activeItem={activeItem}
            setActiveItem={setActiveItem}
          />
        </div>

        {/* User Profile - Bottom with 5px gap */}
        <div className="mt-auto mb-2" style={{ marginTop: '5px' }}>
          {session?.user ? (
            <div onClick={handleProfileClick} className="cursor-pointer hover:opacity-80 transition-opacity">
              <UserProfile 
                name={getUserName()} 
                location={getUserLocation()} 
                initials={getUserInitials()} 
                showChevron={true} 
              />
            </div>
          ) : (
            <div className="border border-[#e4e4e7] rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </div>
              </div>
            </div>
          )}
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
