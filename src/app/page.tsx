'use client'
import Image from 'next/image'
import { useState, useRef } from 'react'
import axios from 'axios'

export default function Home() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleLogin = (e: any, p: any) => {
    axios({
      method: 'POST',
      url: process.env.API_URL + 'login',
      data: {
        email: e,
        password: p
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    })
      .then((res) => {
        if (res.data.status === 'success') {
          setIsLoggedIn(true)
          console.log(res.data)
        } else {
          setErrorMessage(res.data.message)
        }
      }).catch((err) => {
        alert(err)
      })
  }



  const handleDownload = () => { }


  return (
    <>
      {
        errorMessage && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <p>{errorMessage}</p>
        </div>
      }
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="flex flex-col items-center justify-center mt-[100px]">
          <h1 className="text-[#1e1e1e] text-8xl text-center leading-[0.8] pb-[50px] font-bold
        ">
            The Grid POC
          </h1>
          <h1 className="text-[#1e1e1e] text-7xl text-center leading-[0.8] pb-[50px] font-bold">
            by
          </h1>
          <Image src="/mosaic-logo.png" width={500} height={500} alt="mosaic-logo" />

          <div className="w-full max-w-xs bg-gradient-to-r from-blue-600 via-blue-400 to-white mt-[200px]">
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email
                </label>
                <input name="email" onChange={(e) => setEmail(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username" />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Password
                </label>
                <input name="password" onChange={(e) => setPassword(e.target.value)}
                  className="shadow appearance-none borde rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" />
              </div>
              <div className="flex flex-col items-center justify-center mb-4 cursor-pointer">
                <button onClick={() => handleLogin(email, password)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4" type="button">
                  Log In
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  )
}
