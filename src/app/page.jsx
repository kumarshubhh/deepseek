
'use client';
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { assets } from "../../assets/assets";
import Sidebar from "../../component/sidebar";
import PromptBox from "../../component/PromptBox";
import Message from "../../component/Message";
import { useAppContext } from "../../context/AppContext";

export default function Home() {

  const [expand, setExpand] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isloading, setisLoading] = useState(false);
  const {selectedChat} = useAppContext();
  const containerRef = useRef(null);

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages);
    }
  }
  , [selectedChat]);
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ 
        top: containerRef.current.scrollHeight,
        
        behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div>

      <div  className="flex h-screen ">
        
        <Sidebar expand={expand} setExpand={setExpand} />

      <div  className="flex-1 flex flex-col items-center justify-center px-4 pb-8 bg-[#292a2d] text-white relative" >


<div  className="md:hidden absolute px-4 top-6 flex items-center justify-between w-full">

  <Image  onClick={() =>(expand ? setExpand(false) : setExpand(true))} 
   className="rotate-180"  src={assets.menu_icon} alt=""/>
  <Image className="opacity-70"  src={assets.chat_icon} alt="" />


</div>


{messages.length === 0 ?(
  <>
  <div className="flex items-center gap-3">
    <Image  src={assets.logo_icon} alt="" className="h-16"/>
    <p className="text-2xl font-medium">Hi, I'm DeepSeek</p>
  </div>
  <p className="text-sm mt-2">How can I help you today?</p>
  </>
):
(
<div ref={containerRef} 
className="relative flex flex-col items-center justify-center w-full max-h-screen pt-70 overflow-y-auto"> 
   <div className="fixed top-0.5  w-full  text-center  bg-[#292a2d] hover:border-gray-500/50 py-5 px-6 rounded-lg font-semibold mb-6 z-10 ">
    {selectedChat.name}
  </div>  
  
{messages.map((msg, index) =>(
  <Message key={index} role={msg.role} content={msg.content} />
))}


{
  isloading && (
    <div className="flex gap-4 max-w-3xl w-full py-3">
      <Image className="h-9 w-9 p-1 border border-white/15 rounded-full"
      src={assets.logo_icon} alt="logo" />
      <div className="loader flex justify-center items-center gap-1">
        <div className="w-1 h-1 rounded-full bg-white animate-bounce">

        </div>
        <div className="w-1 h-1 rounded-full bg-white animate-bounce">

        </div>
        <div className="w-1 h-1 rounded-full bg-white animate-bounce">

        </div>
      </div>

    </div>
  )
}


   </div>
) }

<PromptBox isloading ={isloading} setisLoading = {setisLoading}/>

<p className=" text-xs absolute bottom-1 text-gray-500"> AI- generated, for reference only</p>

      </div>



      </div>



    </div>
  );
}
