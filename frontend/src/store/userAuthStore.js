import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import {io} from"socket.io-client"


const BASE_URL= import.meta.env.MODE==="development"?"http://localhost:5001":"/"

export const userAuthStore = create((set,get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIng: false,
  isUpdateingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket:null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
        get().connectSocket()
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

       get().connectSocket()
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
    get().connectSocket()
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
      get().disconnectSocket()
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
  connectSocket:()=>{
    const{authUser}=get()
    if(!authUser || get().socket?.connected)return 

    const socket =io(BASE_URL,{
      query:{
        userId:authUser._id,
      },
    })

    socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error)
  })

    socket.connect()
    set({socket:socket})

    socket.on("getOnlineUsers",(userIds)=>{
      set({onlineUsers:userIds})
    })
  },
  disconnectSocket:()=>{
    if(get().socket?.connected) get().socket.disconnect()
  }
}));