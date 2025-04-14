"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext);
}

export const AppContextProvider = ({ children }) => {
    const { user } = useUser();
    const { getToken } = useAuth();

    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);

    // ✅ Create new chat
    const createNewChat = async () => {
        try {
            if (!user) return null;

            console.log("🛠 Creating new chat...");
            const token = await getToken();

            const { data } = await axios.post('/api/chat/create', {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("✅ New Chat Created:", data);
            return data?.data || null;
        } catch (error) {
            toast.error(error.message);
            console.error("❌ Error creating new chat:", error);
            return null;
        }
    };

    // ✅ Fetch user chats
    const fetchUsersChats = async () => {
        try {
            const token = await getToken();
            console.log("📡 Token fetched:", token);

            const { data } = await axios.get('/api/chat/get', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("📥 API Response:", data);

            if (data?.data?.length === 0) {
                const newChat = await createNewChat();
                if (newChat) {
                    console.log("🆕 New chat created, fetching again...");
                    const newChats = await fetchUsersChats(); // recursion

                    if (newChats && newChats.length > 0) {
                        setChats(newChats);
                        setSelectedChat(newChats[0]);
                    }
                }
                return [];
            }

            const sortedChats = data.data.sort(
                (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
            );

            setChats(sortedChats);
            setSelectedChat(sortedChats[0]);
            return sortedChats;
        } catch (error) {
            toast.error(error.message);
            console.error("❌ Error fetching chats:", error);
            return [];
        }
    };

    useEffect(() => {
        if (user) {
            fetchUsersChats().then((chats) => {
                if (chats?.length > 0) {
                    setSelectedChat(chats[0]); // ✅ Yeh selectedChat set karega
                }
            });
        }
    }, [user]);
    

    const value = {
        user,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        fetchUsersChats,
        createNewChat,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
