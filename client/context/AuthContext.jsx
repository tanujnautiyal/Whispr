import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import toast from "react-hot-toast";
import {io} from "socket.io-client"
import { useNavigate } from "react-router-dom"
const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({children})=>{

    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);

    const [socket, setSocket] = useState(null);
    
    //check if user is authenticated and if so, set the user data and connect the socket
    
    const checkAuth = async ()=>{
        try {
            const { data} = await axios.get("/api/auth/check");
            if(data.success){
                setAuthUser(data.user)
                connectSocket(data.user)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    const navigate = useNavigate();
    //Login function to handle user authincation and socket conection

    const login = async (route, data) => {
  try {
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/${route}`, data);
    if (res.data.success) {
      const { token, userData } = res.data;
      localStorage.setItem("token", token);
      setToken(token);
      setAuthUser(userData);
      axios.defaults.headers.common["token"] = token;
      toast.success(
        route === "signup" ? "Account Created Successfully!" : "Login Successful!"
      );
      navigate("/");
    } else {
      toast.error(res.data.message || "Something went wrong");
    }
  } catch (err) {
    console.log(err.message);
    toast.error("Server Error");
  }
};


    //logout function for handle user logout and disconnect socket

    const logout = async ()=>{
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);
        delete axios.defaults.headers.common["token"];
        toast.success("Logged Out Successfully!")
        socket.disconnect();
        navigate("/login");
    }

    //function to update profile
    const updateProfile = async (body)=>{
        try {
            const {data} = await axios.put("/api/auth/update-profile", body);
            if(data.success){
                setAuthUser(data.user);
                toast.success("Profile Updated Successfully!")
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //connect socket function to handle socket connection and online users updates
    const connectSocket = (userData)=>{
        if(!userData || socket?.connected) return;
        const newSocket = io(backendUrl,{
            query: {
                userId: userData._id,
            }
        });
        newSocket.connect();
        setSocket(newSocket);
        newSocket.on("getOnlineUsers",(userIds)=>{
            setOnlineUsers(userIds);
        })
    }
    useEffect(()=>{
        if(token){
            axios.defaults.headers.common["token"] = token;
        }
        checkAuth();
    })
    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
        
    
}