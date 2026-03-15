import React, { useState } from 'react'
import { X } from 'lucide-react'
import { useAuth } from '@clerk/react'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../configs/axios'
import { getAllPublicListing, getAllUserListing } from '../app/features/listingSlice'

const WithdrawModel = ({ onClose }) => {
  const [amount, setAmount] = useState('')

     const {getToken} = useAuth()
     const dispatch = useDispatch()

  const [account, setAccount] = useState([
    { type: 'text', name: 'Account Holder Name', value: '' },
    { type: 'text', name: 'Bank Name', value: '' },
    { type: 'number', name: 'Account Number', value: '' },
    { type: 'text', name: 'Account Type', value: '' },
    { type: 'text', name: 'Swift', value: '' },
    { type: 'text', name: 'Branch', value: '' },
  ])

  const handleSubmission = async (e) => {
    e.preventDefault()
    // TODO: implement withdrawal submission logic
    try {
      if(account.length === 0){
        return toast.error("Please add at least one field")
      }

      // check all fields are filled
      for(const field of account){
        if(!field.value){
          return toast.error(`Please fill in thr ${field.name} field`)
        }
      }
       const confirm = window.confirm('Are you sure you want to submit?')
            if(!confirm)return

             const token = await getToken()

                const { data } = await api.post(`/api/listing/withdraw`,{account, amount: parseInt(amount)},{headers :{Authorization:`Bearer ${token}`}})
                toast.success(data.message)
                dispatch(getAllUserListing({getToken}))
                onClose()
    } catch (error) {
      // toast.dismissAll()
       toast.error(error?.response?.data?.message || error.message)
       console.log(error)
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4'>
      <div className='w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-xl'>
        {/* Header */}
        <div className='flex items-start justify-between border-b border-gray-200 px-6 py-4'>
          <div>
            <h3 className='text-lg font-semibold text-gray-900'>Withdraw Funds</h3>
            <p className='mt-1 text-sm text-gray-600'>Provide your payout details below.</p>
          </div>
          <button
            type='button'
           onClick={onClose}
            className='rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500'
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmission} className='space-y-6 px-6 py-5'>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-700'>Amount</label>
            <input
              value={amount}
              type='number'
              min='0'
              step='0.01'
              onChange={(e) => setAmount(e.target.value)}
              className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none'
              placeholder='Enter withdrawal amount'
            />
          </div>

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            {account.map((field, idx) => (
              <div key={idx} className='space-y-2'>
                <label className='text-sm font-medium text-gray-700'>{field.name}</label>
                <input
                  type={field.type}
                  value={field.value}
                  onChange={(e) =>
                    setAccount((prev) =>
                      prev.map((c, i) => (i === idx ? { ...c, value: e.target.value } : c))
                    )
                  }
                  className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none'
                />
              </div>
            ))}
          </div>

          <div className='flex justify-end border-t border-gray-200 pt-4'>
            <button
              type='submit'
              className='inline-flex items-center justify-center rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
            >
              Apply for Withdrawal
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default WithdrawModel
