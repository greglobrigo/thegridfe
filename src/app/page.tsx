'use client'
import Image from 'next/image'
import { useState, useRef, useMemo } from 'react'
import axios from 'axios'
import moment from 'moment-timezone'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons'

const branches = [
  'TGFM01',
  'TGFM02',
  'TGFM03',
  'TGFM04',
  'TGFM05',
  'TGFM06',
  'TGFM07',
  'TGFM08',
  'TGFM09',
  'TGFM10',
  'TGFM11',
  'TGFM12',
  'TGFM13',
  'TGFM14',
  'TGFM15',
  'TGFM16',
  'TGFM17',
  'TGFM18',
  'TGFM19',
  'TGFM20',
  'TGFM21',
  'TGFM22',
]

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
  const [dailyMonitoringData, setDailyMonitoringData] = useState<any>([])
  const daysInMonth = moment().tz('Asia/Manila').daysInMonth()
  const arrDaysInMonth = Array.from(Array(daysInMonth).keys())
  const currentDate = moment().tz('Asia/Manila').format('MM/DD/YYYY')
  const [time, setTime] = useState(moment().tz('Asia/Manila').format('hh:mm A'))
  const [fade, setFade] = useState(false)


  const memoizedValue = useMemo(() => {
    return dailyMonitoringData
  }, [dailyMonitoringData])

  const getDailyMonitoring = async () => {
    axios({
      method: 'POST',
      url: process.env.NEXT_PUBLIC_API_URL + 'get-daily-monitoring',
    }).then((res) => {
      if (res.data.body.status === 'success') {
        setDailyMonitoringData(res.data.body.data)
      } else {
        setErrorMessage(res.data.body.error)
        setTimeout(() => {
          setErrorMessage('')
        }, 2000)
      }
    }).catch((err) => {
      setErrorMessage(err)
    })
  }

  const refreshMonitoring = async () => {
    setFade(true)
    axios({
      method: 'POST',
      url: process.env.NEXT_PUBLIC_API_URL + 'get-daily-monitoring',
    }).then((res) => {
      if (res.data.body.status === 'success') {
        setDailyMonitoringData(res.data.body.data)
        setSuccessMessage('Refresh Success')
        setTimeout(() => {
          setFade(false)
          setTime(moment().tz('Asia/Manila').format('hh:mm A'))
          setSuccessMessage('')
        }, 2000)
      } else {
        setErrorMessage(res.data.body.error)
        setTimeout(() => {
          setErrorMessage('')
        }, 2000)
      }
    }).catch((err) => {
      setErrorMessage(err)
    })
  }


  const handleLogin = async () => {
    if (passwordRef.current?.value !== process.env.NEXT_PUBLIC_PASSWORD || emailRef.current?.value !== process.env.NEXT_PUBLIC_EMAIL) {
      setErrorMessage('Invalid Credentials')
      let timeout = setTimeout(() => {
        setErrorMessage('')
      }, 2000)
      if (timeout) {
        timeout = setTimeout(() => {
          setErrorMessage('')
        }, 2000)
      }
      return
    }
    axios({
      method: 'POST',
      url: process.env.NEXT_PUBLIC_API_URL + 'login',
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
        setErrorMessage(err)
      })
    await getDailyMonitoring()
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
    if (downloadType === 'single') {
      const sDate = moment(dateRef.current?.value).format('MM/DD/YYYY')
      await axios({
        method: 'POST',
        url: process.env.NEXT_PUBLIC_API_URL + 'file-download',
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
        url: process.env.NEXT_PUBLIC_API_URL + 'file-download',
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
        errorMessage && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center w-screen fixed top-0 z-10" role="alert">
          <p>{errorMessage}</p>
        </div>
      }
      {
        successMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-center fixed top-0 w-screen z-10" role="alert">
          <p>{successMessage}</p>
        </div>
      }

      <main className="flex min-h-screen flex-col items-center justify-around pr-20 pl-20 xs:mt-[0px]">
        <div className="flex flex-col items-center justify-center xs:mt-[0] md:mt-[25px]">
          <h1 className="text-[#1e1e1e] xs:text-6xl md:text-8xl text-center leading-[0.8] xs:pb-[0px] md:pb-[25px] font-bold">
            The Grid POC
          </h1>
          <h1 className="text-[#1e1e1e] xs:text-4xl md:text-7xl text-center leading-[0.8] xs:pb-[10px] md:pb-[25px] font-bold">
            by
          </h1>
          <Image priority src="/mosaic-logo.png" width={500} height={500} alt="mosaic-logo" className="w-auto h-auto" />
          {
            !isLoggedIn &&
            <div className="w-full max-w-xs bg-gradient-to-r from-blue-600 via-blue-400 to-white xs:mt-[0px] md:mt-[25px]">
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
                  <input name="password" ref={passwordRef} onKeyDown={(e) => {e.key === 'Enter' && handleLogin()}}
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
            <div className="w-full max-w-xs bg-gradient-to-r from-blue-600 via-blue-400 to-white mt-[50px]">
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
                    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${!downloadSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
                    type="button">
                    Download
                  </button>
                </div>
              </form>
            </div>
          }
        </div>
      </main>

      {
        isLoggedIn &&
        <>
          <div className={`inline-block flex-col align-middle items-center text-center justify-center min-h-screen px-auto w-full ${fade ? 'opacity-50 transition duration-1000 ease-in-out' : ''}`}>
            <div className="flex flex-col text-4xl font-bold text-[white] pb-4 pt-8 w-fit-content mx-auto bg-[#053B66] w-[1313px]">
              <div className="flex flex-row items-center justify-center">
                <span className="text-4xl font-bold text-[white] pr-4">
                Data IQ The Grid Monitoring UI
                </span>
                <div className="flex flex-row items-center justify-center pt-4">
                  <button onClick={refreshMonitoring} className="bg-[#0066ffb7] hover:bg-[#00c3ffb7] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4 text-xl" type="button">
                    Refresh <FontAwesomeIcon icon={faArrowsRotate} style={{ color: "#ffffff", }} className={`${fade ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>
              <span className="text-xl font-bold text-[white] pt-2"> Month of {moment().tz('Asia/Manila').format('MMMM, YYYY')}. Updated as of {time} PH Time</span>
            </div>
            <div className="items-center justify-center inline-block px-auto">
              <table className="table-auto overflow-x-scroll border border-black min-w-[1313px]">
                <thead className="border border-black">
                  <tr className="border border-black">
                    <th className="bg-[#053B66] border border-black text-center min-w-[40px] text-white">Stall</th>
                    {arrDaysInMonth.map((day) => {
                      return (
                        <th key={day} className="bg-[#053B66] border border-black text-center min-w-[40px] text-white">{day + 1}</th>
                      )
                    })
                    }
                  </tr>
                </thead>
                <tbody className="border border-black">
                  {
                    branches.map((branch) => {
                      return (
                        <tr key={branch} className="border border-black">
                          <th className="bg-[#053B66] border border-black text-center min-w-[40px] text-white">{branch}</th>
                          {
                            memoizedValue.map((data: any) => {
                              return (
                                data.stall === branch &&
                                <td key={data.id} className={`border border-[black] ${data.uploaded ? "bg-[#00FF00]"
                                  : moment(data.date).isAfter(moment(currentDate)) ? 'bg-[#FFFF00] text-[black] font-semibold text-center' : 'bg-[#FF0000]'}`}> {moment(data.date).isAfter(moment(currentDate)) ? 'TBA' : null} </td>
                              )
                            })
                          }
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
            </div>
          </div>
        </>
      }

    </>
  )
}
