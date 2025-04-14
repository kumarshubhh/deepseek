import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import axios from 'axios';

const PromptBox = ({ setisLoading, isloading }) => {
  const [prompt, setPrompt] = useState('');
  const { user, chats, setChats, selectedChat, setSelectedChat } = useAppContext();

  useEffect(() => {
    console.log("PromptBox: selectedChat =", selectedChat);
  }, [selectedChat]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendPrompt(e);
    }
  };
  const sendPrompt = async (e) => {
    const promptCopy = prompt;

    try {
      e.preventDefault();
      if (!user) return toast.error("Please login to continue");
      if (isloading) return toast.error("Already sending a message");
      if (!selectedChat) return toast.error("No chat selected.");

      setisLoading(true);
      setPrompt('');

      const userMessage = {
        role: "user",
        content: promptCopy,
        timestamps: Date.now(),
      };

      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === selectedChat._id
            ? { ...chat, messages: [...chat.messages, userMessage] }
            : chat
        )
      );

      setSelectedChat((prev) =>
        prev ? { ...prev, messages: [...prev.messages, userMessage] } : prev
      );

      // Send the request to the backend
      const { data } = await axios.post('/api/chat/ai', {
        chatId: selectedChat._id,
        prompt: promptCopy,
      });

      if (data.success) {
        // Simulate typing effect
        const message = data.data.content;
        const messageTokens = message.split(" "); // Split the response into words

        let assistantMessage = {
          role: "assistant",
          content: "",
          timestamps: Date.now(),
        };

        // Add the first part of the response to the state
        setSelectedChat((prev) =>
          prev ? { ...prev, messages: [...prev.messages, assistantMessage] } : prev
        );

        // Loop through the tokens and show message one by one
        for (let i = 0; i < messageTokens.length; i++) {
          setTimeout(() => {
            // Update the message progressively
            assistantMessage.content = messageTokens.slice(0, i + 1).join(" ");
            setSelectedChat((prev) => {
              if (!prev) return prev; // safety check
              const updatedMessages = [
                ...prev.messages.slice(0, -1), // Remove previous assistant message
                { ...assistantMessage }, // Add updated assistant message
              ];
              return { ...prev, messages: updatedMessages };
            });
          }, 100 * i); // Adjust the timing for each word (in ms)
        }
      } else {
        toast.error(data.message);
        setPrompt(promptCopy);
      }
    } catch (error) {
      toast.error(error.message);
      setPrompt(promptCopy);
    } finally {
      setisLoading(false);
    }
};



  return (
    <div>
      <form onSubmit={sendPrompt} className={`w-full ${selectedChat?.messages.length>0 ? "max-w-3xl" : "max-w-2xl"} bg-[#404045] p-4 rounded-3xl mt-4 transition-all`}>
      <textarea
    onKeyDown={handleKeyDown}
    className='outline-none w-full resize-none overflow-hidden break-words bg-transparent'
    placeholder='Message DeepSeek'
    required
    rows={2}
    onChange={(e) => setPrompt(e.target.value)} 
    value={prompt} 
  />
  <div className='flex items-center justify-between text-sm'>
    <div className='flex items-center gap-2'>
      <p className='flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition'>
        <Image src={assets.deepthink_icon} alt='DeepThink Icon' className='h-5'/>
        DeepThink (R1)
      </p>
      <p className='flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition'>
        <Image src={assets.search_icon} alt='Search Icon' className='h-5'/>
        Search
      </p>
    </div>
    <div className='flex items-center gap-2'>
      <Image src={assets.pin_icon} alt='Pin Icon' className='w-4 cursor-pointer'/>
      <button disabled={!prompt} className={`${prompt ? "bg-primary cursor-pointer" : "bg-[#71717a] cursor-not-allowed"} rounded-full p-2`}>
        <Image src={prompt ? assets.arrow_icon : assets.arrow_icon_dull} alt='Send Icon' className='w-3.5'/>
      </button>
    </div>
  </div>
      </form>
    </div>
  );
};

export default PromptBox;
