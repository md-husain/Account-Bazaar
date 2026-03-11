import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProfileLink, platformIcons } from '../assets/assets'
import { useDispatch, useSelector } from 'react-redux'
import { ArrowLeftIcon, ArrowUpRightFromSquareIcon, Calendar, CheckCircle2, ChevronLeftIcon, ChevronRightIcon, DollarSign, Eye, LineChart, Loader2Icon, MapPin, MessageSquareMoreIcon, ShoppingBagIcon, Users } from 'lucide-react'
import { setChat } from '../app/features/chatSlice'

function ListingDetails() {
  const dispatch =  useDispatch()
  const navigate = useNavigate()
  const currency = import.meta.env.VITE_CURRENCY || '$'

  const [listing, setListing] = useState(null)
 
  const [curr,setCurr] = useState(0)
  const images = listing?.images || []

  const profileLink = listing && getProfileLink(listing.platform, listing.username)

  const { listingId } = useParams()
  const { listings } = useSelector((state) => state.listing)


  const prevImg = ()=> setCurr((prev) => (prev === 0 ? images.length - 1 : prev - 1))

  const nextImg = ()=> setCurr((nxt) => (nxt === images.length - 1 ? 0 : nxt + 1))

 const purchaseAccount = async () => {
  // using backend
  

 }

 const loadChat =  () => {
  // state management 
  dispatch(setChat({listing: listing}))
  
 }
  useEffect(() => {
    const found = listings.find((item) => String(item.id) === String(listingId))
    setListing(found ?? null)
  }, [listings, listingId])

  return listing ? (
    <div className='mx-auto min-h-screen px-6 md:px-16 lg:px-24 xl:px-32'>
      <button onClick={() => navigate(-1)} className='flex items-center gap-2 text-slate-600 py-5'>
        <ArrowLeftIcon className='w-4 h-4' /> GO to Previous Page
      </button>

      <div className='flex items-start max-md:flex-col gap-10'>
        <div className='flex-1 max-md:w-full'>
          {/* top section */}
          <div className='bg-white rounded-xl border border-gray-200 p-6 mb-5'>
            <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-4'>
            <div className='flex items-start gap-3'>
              <div className='p-2 rounded-xl'>{platformIcons[listing.platform]}</div>
              <div>
                <h2 className='flex items-center gap-2 text-xl font-semibold text-gray-800'>
                  {listing.title}
                  <a href={profileLink} target='_blank' rel='noreferrer' className='inline-flex items-center text-gray-500 hover:text-indigo-500'>
                    <ArrowUpRightFromSquareIcon className='w-4 h-4' />
                  </a>
                </h2>
                <p className='text-gray-500 text-sm'>
                  @{listing.username} -- {listing.platform?.charAt(0).toUpperCase() + listing.platform?.slice(1)}
                </p>
                
                <div className='flex gap-2 mt-2'>
                  {listing.verified && (
                      <span className='flex items-center text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md'>
                        <CheckCircle2 className='w-4 h-4 mr-1' />
                        Verified
                      </span>
                  )}

                  {listing.monetized && (
                    <span className='flex items-center text-xs bg-green-50 text-green-600 px-2 py-1 rounded-md'>
                      <DollarSign className='w-4 h-4 mr-1' />
                      Monetized
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className='text-right'>
                <h3 className='text-2xl font-bold text-grey'>
                  {currency}
                  {listing.price?.toLocaleString()}
                </h3>
                <p className='text-sm text-grey-500'>USD</p>
            </div>

           </div>
          </div>

        {/* screenshot section */}
        {images?.length > 0 && (
          <div className='bg-white rounded-xl border border-grey-200 mb-5 overflow-hidden'>
           <div className='p-4'>
              <h4 className='font-semibold text-grey-800'>
                Screenshots & Proof
              </h4>
           </div>
           {/* Slider container */}
           <div className='relative w-full aspect-video overflow-hidden'> 
            <div className='flex transition-transform duration-300 ease-in-out ' style={{transform:`translateX(-${curr*100}%)`}}>
              {images.map((img,idx)=>(
                <img key={idx} src={img} alt="Listing Proof" className='w-full shrink-0' />
              ))}
            </div>

            {/* Navigtion button */}
            <button onClick={prevImg} className='absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow'>
              <ChevronLeftIcon className='w-5 h-5 text-grey-700' />
            </button>

             <button onClick={nextImg} className='absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow'>
              <ChevronRightIcon className='w-5 h-5 text-grey-700' />
            </button>

            {/* Dots Indicator */}
            <div className='absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2'> 
              {images.map((_,idx)=>(
                <button onClick={()=>setCurr(idx)} key={idx} className={`w-2.5 h-2.5 rounded-full ${curr === idx ? "bg-indigo-600": "bg-grey-300"}` } />
              ))}
            </div>
           </div>
          </div>
        )}

        {/* Accounts matrices */}
        <div className='bg-white rounded-xl border border-grey-200 mb-5'>
          <div className='p-4 border-b border-grey-100'>
            <h4 className='font-semibold text-grey-800'>Account Metrices</h4>
          </div>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 p-4 text-center'>
            <div>
              <Users className='mx-auto text-grey-400 w-5 h-5 mb-1' />
              <p className='font-semibold text-grey-800'>{listing.followers_count?.toLocaleString()}</p>
              <p className='text-xs text-grey-500'>Followers</p>
            </div>
             <div>
              <LineChart className='mx-auto text-grey-400 w-5 h-5 mb-1' />
              <p className='font-semibold text-grey-800'>{listing.engagement_rate}%</p>
              <p className='text-xs text-grey-500'>Engagement</p>
            </div>
             <div>
              <Eye className='mx-auto text-grey-400 w-5 h-5 mb-1' />
              <p className='font-semibold text-grey-800'>{listing.monthly_views?.toLocaleString()}</p>
              <p className='text-xs text-grey-500'>Monthly Views</p>
            </div>
             <div>
              <Calendar className='mx-auto text-grey-400 w-5 h-5 mb-1' />
              <p className='font-semibold text-grey-800'>{new Date(listing.createdAt).toLocaleDateString()}</p>
              <p className='text-xs text-grey-500'>Listed</p>
            </div>
          </div>
        </div>

        {/* Description */}
          <div className='bg-white rounded-xl border border-grey-200 mb-5'>
            <div className='p-4 border-b border-grey-100'>
              <h4 className='font-semibold text-grey-800'>Description</h4>
            </div>
            <div className='p-4 text-sm text-grey-600'>{listing.description}</div>
          </div>

          {/* Additional Details */}
           <div className='bg-white rounded-xl border border-grey-200 mb-5'>
            <div className='p-4 border-b border-grey-100'>
              <h4 className='font-semibold text-grey-800'>Additional Details</h4>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 p-4 text-sm'>
              <div>
                <p className='text-grey-500'>Niche</p>
                <p className='flex-medium capitalize'>{listing.niche}</p>
              </div>
                <div>
                <p className='text-grey-500'>Niche</p>
                <p className='flex items-center font-medium'>
                 <MapPin className='size-4 mr-1 text-grey-400'/> {listing.country}</p>
              </div>

                <div>
                <p className='text-grey-500'>Audience Age</p>
                <p className='font-medium'>
                 {listing.age_range}</p>
              </div>
              <div>
                <p className='text-grey-500'>Platform Verified</p>
                <p className='font-medium'>
                 {listing.platformAssured ? "Yes":"No"}</p>
              </div>
               <div>
                <p className='text-grey-500'>Monetization</p>
                <p className='font-medium'>
                 {listing.monetized ? "Enabled":"Disabled"}</p>
              </div>
              <div>
                <p className='text-grey-500'>Status</p>
                <p className='font-medium capitalize'>
                 {listing.status}</p>
              </div>

            </div>
          </div>
        </div>


      {/* seller info  and purchase opetion */}
      <div className='bg-white min-w-full md:min-w-[370px] rounded-xl border border-grey-200 p-5 max-md:mb-10'>
        <h4 className='font-semibold text-grey-800 mb-4'>Seller Information</h4>
        <div className='flex items-center gap-3 mb-2'>
          <img src={listing.owner?.image} alt="seller image" className='size-10 rounded-full' />
           <div>
            <p className='font-medium text-grey-800'>{listing.owner?.name}</p>
            <p className='text-sm text-grey-500'>{listing.owner?.email}</p>

           </div>
        </div>
        <div className='flex items-center justify-between text-sm text-grey-600 mb-4'> 
          <p>Member Since<span className='font-medium'>{new Date(listing.owner?.createdAt).toLocaleDateString()}</span></p>
        </div>
        <button onClick={loadChat} className='w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transiton text-sm font-medium flex items-center justify-center gap-2'>
          <MessageSquareMoreIcon className='size-4' /> Chat
        </button>
        {
          listing.isCredentialChanged && (
              <button onClick={purchaseAccount} className='w-full mt-2 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transiton text-sm font-medium flex items-center justify-center gap-2'>
                <ShoppingBagIcon className='size-4' /> Purchase
              </button>
          )
        }
      </div>
      
      
      </div>
    {/* footer */}
    <div className='bg-white border-t border-grey-200 p-4 text-center mt-28'>
      <p className='text-sm text-grey-500'>
        @ 2025 <span>Md Husain</span>. All rights reserved.
      </p>
    </div>
    </div>

    
  ) : (
    <div className='h-screen flex justify-center items-center'>
      <Loader2Icon className='w-7 h-7 animate-spin text-indigo-600' />
    </div>
  )
}

export default ListingDetails
