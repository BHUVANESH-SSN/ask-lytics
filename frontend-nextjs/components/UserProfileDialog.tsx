"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { User, Mail, Phone, Lock, Save, LogOut } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"

interface UserData {
  id?: number
  name: string
  email: string
  mobile?: string
}

interface UserProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserProfileDialog({ open, onOpenChange }: UserProfileDialogProps) {
  const router = useRouter()
  const [user, setUser] = useState<UserData>({ name: "", email: "" })
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Password change state
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  })

  const { data: session } = useSession()

  useEffect(() => {
    if (open) {
      if (session?.user) {
        setUser({
          name: session.user.name || "",
          email: session.user.email || ""
        })
      } else {
        const userData = localStorage.getItem("user")
        if (userData) {
          setUser(JSON.parse(userData))
        }
      }
    }
  }, [open, session])

  const handleSaveProfile = async () => {
    setIsSaving(true)

    try {
      const token = localStorage.getItem("auth_token")

      // Call API to update profile
      const response = await fetch("http://localhost:8000/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          mobile: user.mobile
        })
      })

      const data = await response.json()

      if (data.success) {
        // Update localStorage
        localStorage.setItem("user", JSON.stringify(user))
        alert("Profile updated successfully!")
        setIsEditing(false)
      } else {
        alert(data.error || "Failed to update profile")
      }
    } catch (error: any) {
      alert("Error updating profile: " + error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      alert("New passwords do not match!")
      return
    }

    if (passwords.new.length < 8) {
      alert("Password must be at least 8 characters")
      return
    }

    setIsSaving(true)

    try {
      const token = localStorage.getItem("auth_token")

      const response = await fetch("http://localhost:8000/auth/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          current_password: passwords.current,
          new_password: passwords.new
        })
      })

      const data = await response.json()

      if (data.success) {
        alert("Password changed successfully!")
        setPasswords({ current: "", new: "", confirm: "" })
      } else {
        alert(data.error || "Failed to change password")
      }
    } catch (error: any) {
      alert("Error changing password: " + error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user")
    if (session) {
      await signOut({ callbackUrl: '/login' })
    } else {
      router.push('/login')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
          <DialogDescription>
            View and manage your account information
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  <User className="inline h-4 w-4 mr-2" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Enter your name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  <Mail className="inline h-4 w-4 mr-2" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">
                  <Phone className="inline h-4 w-4 mr-2" />
                  Mobile Number
                </Label>
                <Input
                  id="mobile"
                  type="tel"
                  value={user.mobile || ""}
                  onChange={(e) => setUser({ ...user, mobile: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Enter your mobile number"
                />
              </div>
            </div>

            <DialogFooter>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProfile} disabled={isSaving}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </>
              )}
            </DialogFooter>
          </TabsContent>

          <TabsContent value="security" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">
                  <Lock className="inline h-4 w-4 mr-2" />
                  Current Password
                </Label>
                <Input
                  id="current-password"
                  type="password"
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  placeholder="Enter current password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">
                  <Lock className="inline h-4 w-4 mr-2" />
                  New Password
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  placeholder="Enter new password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">
                  <Lock className="inline h-4 w-4 mr-2" />
                  Confirm New Password
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleChangePassword} disabled={isSaving}>
                <Lock className="h-4 w-4 mr-2" />
                {isSaving ? "Changing..." : "Change Password"}
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>

        <div className="border-t pt-4">
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
