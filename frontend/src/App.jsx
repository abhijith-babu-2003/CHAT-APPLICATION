import { Routes, Route, Navigate } from "react-router-dom"
import HomePage from "./pages/HomePage"
import SignUpPage from "./pages/SignUpPage"
import LoginPage from "./pages/LoginPage"
import SettingsPage from "./pages/SettingsPage"
import ProfilePage from "./pages/ProfilePage"
import { userAuthStore } from "./store/userAuthStore"
import { useEffect } from "react"
import { Loader } from 'lucide-react'
import { Toaster } from "react-hot-toast" 
import Navbar from "./componets/Navbar"
import { useThemeStore } from "./store/useThemeStore"

function App() {
  const { authUser, checkAuth, isCheckingAuth ,onlineUsers} = userAuthStore()
  const { theme } = useThemeStore()
  
  console.log({onlineUsers});
  
  useEffect(() => {
    checkAuth()
  }, [checkAuth])
  
  
  console.log({ authUser, theme });
  
  if (isCheckingAuth && !authUser) return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin" />
    </div>
  )

  return (
    <>
       <div data-theme={theme}>
      <Navbar />

      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>

      <Toaster />
    </div>
    </>
  );
}

export default App