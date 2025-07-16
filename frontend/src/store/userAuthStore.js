import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const userAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIng: false,
  isUpdateingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in checkAuth", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      toast.success("Account created successfully");
      set({ authUser: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },
  login:async(data)=>{
    set({isLoggingIng:true})
   try {
    const res=await axiosInstance.post("/auth/login",data)
    set({authUser:res.data})
    toast.success("Logged in successfully")
   } catch (error) {
    toast.error(error.response.data.message)
   }finally{
    set({isLoggingIng:false})
   }
  },  
  logout:async()=>{
    try {
      await axiosInstance.post("/auth/logout")
      set({authUser:null})
      toast.success("Logged out successfully")
    } catch (error) {
      toast.error(error.response.data.message)
    }
  },
  updateProfile:async(data)=>{
    set({isUpdateingProfile:true})
      try {
        const res = await axiosInstance.put("/auth/update-profile",data)
        set({authUser:res.data})
        toast.success("Profile updated successfully")
      } catch (error) {
        console.log("errror in update profile",error);
        toast.error(error.response.data.message)
      }finally{
        set({isUpdateingProfile:false})
      }
  },
}));