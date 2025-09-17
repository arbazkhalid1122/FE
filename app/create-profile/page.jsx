import Header from "@/components/Header"
import { ProfileForm } from "@/components/profile-form"

export default function CreateProfilePage() {
  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Header variant="light" showSupport={false} />
      <div className="flex items-center justify-center min-h-[calc(100vh-73px)] p-8">
        <ProfileForm />
      </div>
      <footer className="text-center py-6 text-sm text-[#5f6057]">
        © 2025 EnvoyX, Inc. All rights reserved | Privacy Policy | Terms of Use | Service Provider Agreement
      </footer>
    </div>
  )
}
