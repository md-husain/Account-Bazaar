import React, { useEffect, useState } from 'react'
import { dummyOrders, platformIcons } from '../assets/assets'
import toast from 'react-hot-toast'
import { CheckCircle2, ChevronDown, ChevronUp, Copy, Loader2Icon } from 'lucide-react'
import {format} from 'date-fns'
import { useAuth, useUser } from '@clerk/react'
import api from '../configs/axios'

function MyOrders () {
  const {user, isLoaded} = useUser()
  const {getToken} = useAuth()

  const currency = import.meta.env.VITE_CURRENCY || "$"
  const [orders,setOrders] = useState([])
  const [loading,setLoading] = useState(true)
  const [expandedId,setExpandedId] = useState(null)

  const fetchOrders = async () => {
    // setOrders(dummyOrders)
    // setLoading(false)
    try {
      setLoading(true)
      const token = await getToken()
      const { data } = await api.get(`/api/listing/user-orders`,{headers :{Authorization:`Bearer ${token}`}})
      setOrders(data.orders)
    } catch (error) {
       toast.error(error?.response?.data?.message || error.message)
    }
    finally{
      setLoading(false)
    }
  }

  useEffect(()=> {
    if(user && isLoaded){
      fetchOrders()
    }
  },[isLoaded,user])

  const mask = (val, type) => {
    if(!val && val !== 0) return "-"
    return type.toLowerCase() === "password" ? ".".repeat(8) : String(val)
  }

  const copy = async (txt) =>{
    try {
      await navigator.clipboard.writeText(txt);
      toast.success("Copied to clipboard")
    } catch (error) {
       toast.error("Copy failed")
    }
  }

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50 p-6'>
        <div className='flex items-center gap-2 rounded-lg bg-white px-6 py-4 shadow'>
          <Loader2Icon className='h-5 w-5 animate-spin text-indigo-600' />
          <span className='text-sm font-medium text-gray-700'>Loading your orders…</span>
        </div>
      </div>
    )
  }

  if (!orders.length) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50 p-6'>
        <div className='max-w-md rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm'>
          <h3 className='text-xl font-semibold text-gray-900'>No orders yet</h3>
          <p className='mt-2 text-sm text-gray-600'>You haven't purchased any listings yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 py-10'>
      <div className='mx-auto w-full max-w-5xl px-4'>
        <div className='mb-8 flex flex-col gap-2'>
          <h2 className='text-2xl font-semibold text-gray-900'>My Orders</h2>
          <p className='text-sm text-gray-600'>Review purchases and credentials for your orders.</p>
        </div>

        <div className='grid gap-6'>
          {orders.map((order) => {
            const id = order.id
            const listing = order.listing
            const credential = order.credential
            const isExpanded = expandedId === id

            return (
              <div
                key={id}
                className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm'
              >
                <div className='flex flex-col gap-4 md:flex-row md:items-start md:justify-between'>
                  <div className='flex items-start gap-4'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gray-100'>
                      {platformIcons[listing.platform]}
                    </div>
                    <div className='min-w-0'>
                      <h3 className='text-lg font-semibold text-gray-900'>{listing.title}</h3>
                      <p className='text-sm text-gray-600'>
                        @{listing.username} ·{' '}
                        <span className='capitalize text-gray-500'>{listing.platform}</span>
                      </p>

                      <div className='mt-2 flex flex-wrap gap-2'>
                        {listing.verified && (
                          <span className='inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700'>
                            <CheckCircle2 className='h-4 w-4' /> Verified
                          </span>
                        )}
                        {listing.monetized && (
                          <span className='inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700'>
                            <span className='text-sm font-semibold'>$</span> Monetized
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className='flex flex-col items-start gap-1 text-right md:items-end'>
                    <p className='text-lg font-semibold text-gray-900'>
                      {currency}
                      {Number(order.amount).toLocaleString()}
                    </p>
                    <p className='text-sm text-gray-500'>USD</p>
                    <p className='text-xs text-gray-500'>
                      Purchased: {format(new Date(order.createdAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>

                <div className='mt-6 flex flex-col gap-3 border-t border-gray-200 pt-4 md:flex-row md:items-center md:justify-between'>
                  <button
                    type='button'
                    onClick={() => setExpandedId((p) => (p === id ? null : id))}
                    className='inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50'
                    aria-expanded={isExpanded}
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className='h-4 w-4' /> Hide Credentials
                      </>
                    ) : (
                      <>
                        <ChevronDown className='h-4 w-4' /> View Credentials
                      </>
                    )}
                  </button>

                  <div className='text-sm text-gray-500'>
                    Credential Purchased: {format(new Date(order.createdAt), 'MMM d, yyyy')}
                  </div>
                </div>

                {isExpanded && (
                  <div className='mt-4 rounded-xl bg-gray-50 p-4'>
                    <div className='grid gap-4 md:grid-cols-2'>
                      {credential?.updatedCredential?.map((cred) => (
                        <div
                          key={cred.name}
                          className='flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-4'
                        >
                          <div className='flex items-center justify-between'>
                            <div>
                              <p className='text-sm font-semibold text-gray-800'>{cred.name}</p>
                              <p className='text-xs text-gray-500'>{cred.type}</p>
                            </div>
                            <button
                              type='button'
                              onClick={(e) => {
                                e.stopPropagation()
                                copy(cred.value)
                              }}
                              className='inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50'
                              title='Copy credential'
                            >
                              <Copy className='h-4 w-4' />
                              Copy
                            </button>
                          </div>
                          <code className='block rounded bg-gray-100 px-3 py-2 text-sm text-gray-800'>
                            {mask(cred.value, cred.type)}
                          </code>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default MyOrders 
