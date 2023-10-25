'use client'
import Image from 'next/image'
import { useState, useRef } from 'react'
import axios from 'axios'
import moment from 'moment-timezone'

export default function Home() {

  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const startDateRef = useRef<HTMLInputElement>(null)
  const endDateRef = useRef<HTMLInputElement>(null)
  const dateRef = useRef<HTMLInputElement>(null)
  const [downloadSelected, setDownloadSelected] = useState(false)
  const [downloadType, setDownloadType] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleLogin = () => {
    if(passwordRef.current?.value !== process.env.PASSWORD || emailRef.current?.value !== process.env.EMAIL) {
      setErrorMessage('Invalid Credentials')
      setTimeout(() => {
        setErrorMessage('')
      }, 3000)
      return
    }
    axios({
      method: 'POST',
      url: process.env.API_URL + 'login',
      data: {
        email: emailRef.current?.value,
        password: passwordRef.current?.value,
      },
    })
      .then((res) => {
        if (res.data.body.status === 'success') {
          setIsLoggedIn(true)
          setSuccessMessage('Login Success')
          setTimeout(() => {
            setSuccessMessage('')
          }, 2000)
        }
        else {
          setErrorMessage(res.data.body.error)
          setTimeout(() => {
            setErrorMessage('')
          }, 2000)
        }
      }).catch((err) => {
        alert(err)
      })
  }


  const checkElement = (value: string) => {
    if (value === 'Single File') {
      setDownloadSelected(true)
      setDownloadType('single')
    }
    else if (value === 'Multiple') {
      setDownloadSelected(true)
      setDownloadType('multiple')
    }
    else {
      setDownloadSelected(false)
      setDownloadType('')
    }
  }


  const handleDownload = async () => {
    console.log(dateRef.current?.value)
    console.log(startDateRef.current?.value)
    console.log(endDateRef.current?.value)
    if (downloadType === 'single') {
      const sDate = moment(dateRef.current?.value).format('MM/DD/YYYY')
      await axios({
        method: 'POST',
        url: process.env.API_URL + 'file-download',
        data: {
          dateRange: [sDate]
        },
      })
        .then((res) => {
          if (res.data.body.status === 'success') {
            setSuccessMessage('Download Success')
            setTimeout(() => {
              setSuccessMessage('')
            }, 2000)
            const link = document.createElement('a');
            link.href = res.data.body.url;
            link.setAttribute('download', '');
            document.body.appendChild(link);
            link.dispatchEvent(
              new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window,
              })
            );
            document.body.removeChild(link);
          }
          else {
            setErrorMessage(res.data.body.error)
            setTimeout(() => {
              setErrorMessage('')
            }, 2000)
          }
        }).catch((err) => {
          alert(err)
        })
    } else {
      const msDate = moment(startDateRef.current?.value).format('MM/DD/YYYY')
      const meDate = moment(endDateRef.current?.value).format('MM/DD/YYYY')
      await axios({
        method: 'POST',
        url: process.env.API_URL + 'file-download',
        data: {
          dateRange: [msDate, meDate]
        },
      })
        .then((res) => {
          if (res.data.body.status === 'success') {
            setSuccessMessage('Download Success')
            setTimeout(() => {
              setSuccessMessage('')
            }, 2000)
            const link = document.createElement('a');
            link.href = res.data.body.url;
            link.setAttribute('download', '');
            document.body.appendChild(link);
            link.dispatchEvent(
              new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window,
              })
            );
            document.body.removeChild(link);
          }
          else {
            setErrorMessage(res.data.body.error)
            setTimeout(() => {
              setErrorMessage('')
            }, 2000)
          }
        }).catch((err) => {
          alert(err)
        })
    }
  }

  return (
    <>
      {
        errorMessage && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center w-screen absolute" role="alert">
          <p>{errorMessage}</p>
        </div>
      }
      {
        successMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-center absolute w-screen" role="alert">
          <p>{successMessage}</p>
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
          {
            !isLoggedIn &&
            <div className="w-full max-w-xs bg-gradient-to-r from-blue-600 via-blue-400 to-white mt-[200px]">
              <form className="bg-white shadow-md rounded px-8 pt-6 pb-8">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Email
                  </label>
                  <input name="email" ref={emailRef}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username" />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Password
                  </label>
                  <input name="password" ref={passwordRef}
                    className="shadow appearance-none borde rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" />
                </div>
                <div className="flex flex-col items-center justify-center mb-4 cursor-pointer">
                  <button onClick={handleLogin}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4" type="button">
                    Log In
                  </button>
                </div>
              </form>
            </div>
          }


          {
            isLoggedIn &&
            <div className="w-full max-w-xs bg-gradient-to-r from-blue-600 via-blue-400 to-white mt-[150px]">
              <form className="bg-white shadow-md rounded px-8 pt-6 pb-8">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Download Type
                  </label>
                  <select onChange={(e) => checkElement(e.target.value)} name="type" id="type" className="shadow rounded-b-none appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline cursor-pointer">
                    <option className="rounded-b-none">Select</option>
                    <option className="rounded-b-none cursor-pointer">Single File</option>
                    <option className="rounded-b-none cursor-pointer">Multiple</option>
                  </select>
                </div>


                {
                  downloadSelected && downloadType === 'multiple' &&
                  <>
                    <div className='mb-4'>
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="start">
                        Start date:
                      </label>
                      <input type="date" id="start" name="trip-start" ref={startDateRef}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline cursor-pointer"
                        min="2022-01-01" max="2027-12-31">
                      </input>
                    </div>
                    <div className='mb-4'>
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="start">
                        End date:
                      </label>
                      <input type="date" id="end" name="trip-start" ref={endDateRef}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline cursor-pointer"
                        min="2022-01-01" max="2027-12-31">
                      </input>
                    </div>
                  </>
                }

                {
                  downloadSelected && downloadType === 'single' &&
                  <div className='mb-4'>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="start">
                      Date:
                    </label>
                    <input type="date" id="start2" name="trip-start" ref={dateRef}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline cursor-pointer"
                      min="2022-01-01" max="2027-12-31">
                    </input>
                  </div>
                }

                <div className="flex flex-col items-center justify-center pt-2 mb-4 cursor-pointer">
                  <button onClick={handleDownload} disabled={!downloadSelected}
                    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4 ${!downloadSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
                    type="button">
                    Download
                  </button>
                </div>
              </form>
            </div>
          }
        </div>
      </main>

    </>
  )
}
