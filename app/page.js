"use client"
import Image from "next/image";
import React, {useState} from "react";

export default function Home() {
  const [value, setValue] = useState("")
  const [chatHistory, setChatHistory] = useState([]);
  const surpriseOptions = [
    "Who won the latest novel prize?",
    "what is nigeria about?",
    "what does BLM mean?"
  ]

  const surpriseChoice = () => {
    const randomValue = surpriseOptions[Math.floor(Math.random() *surpriseOptions.length)]
    setValue(randomValue)
  }

  const getResponse = async () => {
    console.log(value)
    try{
      const options = {
        method: "POST",
        body: JSON.stringify({
          history: chatHistory,
          message:value
        }),
        headers:{
          "Content-Type": "application/json"
        }
      }
      const response = await fetch("http://localhost:5000/gemini", options)
      const data = await response.text()
      console.log(data)
      setChatHistory(oldChatHistory => [...oldChatHistory, {
        role: "user",
        parts: [{text:value}]
      },
      {
        role: "model",
        parts: [{text:data}]
      }
    
    ])
    setValue("")
    }
    catch(err){
      console.log(err)
    }
  }

  return (
    <main className="w-full h-fit pb-24 flex items-center justify-center flex-col gap-12 pt-16">
      {/* <div className="flex w-[80%] m-auto h-[50px]">
        <input type="text" placeholder="What do you want to know about?" className="w-[70%] text-2xl font-bold h-full text-white p-3 bg-black border-b-2 border-white" disabled />
        <button className="bg-none text-2xl font-bold text-white bg-blue-600 w-[30%]" onClick={surpriseChoice}>Surprise Me</button>
      </div> */}
      <h1 className="text-white font-bold text-4xl">EMM<span className="text-green-400">GPT</span></h1>

      <div className="flex w-[80%] m-auto h-[60px] shadow-2xl">
        <input 
          type="text"
          placeholder="..."
          className="w-[70%] text-2xl font-normal h-full p-6 bg-white rounded-tl-lg rounded-bl-lg "
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button className="bg-none text-2xl font-bold text-white bg-green-400 w-[30%] rounded-tr-md rounded-br-md" onClick={getResponse} >
          Ask Me
        </button>
      </div> 
      <div className="w-[80%] m-auto h-fit flex flex-col gap-3">
        {
          chatHistory.map((chatItem, index) => (
            <div key={index} className="bg-white p-4 mb-1">
              <p className="text-black text-lg"><span className="font-bold capitalize">{chatItem.role}:</span> {chatItem.parts[0].text}</p>
            </div>
          ))
        }      
      </div>     
    </main>
  );
}
