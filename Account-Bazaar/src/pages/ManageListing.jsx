import { Loader2Icon, Upload } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

function ManageListing() {
  const {id} = useParams()

  const navigate = useNavigate()
  const {userListings} = useSelector((state)=>state.listing)

  const [loadingListing,setLoadingListing] = useState(false)
   const [isEditing,setIsEditing] = useState(false)

   const [formData , setFormData] = useState({
    title:"",
    platform:"",
    username:"",
    followers_count:"",
    engagement_rate:"",
    monthly_views:"",
    niche:"",
    price:"",
    description:"",
    verified:false,
    monetized:false,
    country:"",
    age_range:"",
    images:[],
   })

   const platforms = ["youtube","instagram","tiktok","facebook","X","Linkedin","pinterest","snapchat","twitch","discord","kick"];
   const niches = ["lifestyle","fitness","food","travel","tech","gaming","fashion","beauty","business","education","entertainment","music","art","sports","health","finance","other"];
   const ageRanges = ["13-17 years","18-24 years","25-34 years","35-44 years","45-54 years","55+","Mixed ages"];


   const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

   const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return

    if (files.length + formData.images.length > 5)
      return toast.error('You can add up to 5 images')

    setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }))
  }

   const removeImage = (idx) =>{
    setFormData((prev)=>({...prev,images:prev.images.filter((_,i)=> i !== idx)}))
   }

  //  get listing dta for edit if id is provided (edit mode)
  useEffect(()=>{
    if(!id)return

    setIsEditing(true)
    setLoadingListing(true)
    const listing = userListings.find((listing) => listing.id === id)

    if(listing){
      setFormData(listing)
      setLoadingListing(false)
    }else{
      toast.error("Listing not found")
      navigate("")
    }
  }, [id, navigate, userListings])


  const handleSubmit = async (e) =>{
    e.preventDefault();
  }

  if (loadingListing) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='flex items-center gap-2 rounded-lg bg-white px-6 py-4 shadow'>
          <Loader2Icon className='h-5 w-5 animate-spin text-indigo-600' />
          <span className='text-sm font-medium text-gray-700'>Loading listing...</span>
        </div>
      </div>
    )
  }
  return (
    <div className='min-h-screen bg-gray-50 py-10'>
      <div className='mx-auto w-full max-w-5xl space-y-8 px-4'>
        <header className='rounded-2xl bg-white p-6 shadow-sm'>
          <h1 className='text-2xl font-semibold text-gray-900'>
            {isEditing ? 'Edit Listing' : 'List Your Account'}
          </h1>
          <p className='mt-2 text-sm text-gray-600'>
            {isEditing
              ? 'Update your existing account listing.'
              : 'Create a mock listing to display your account info.'}
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className='space-y-8 rounded-2xl bg-white p-6 shadow-sm'
        >
          {/* Basic INFO */}
          <Section title='Basic Information'>
            <div className='grid gap-6 md:grid-cols-2'>
              <InputField
                label='Listing Title *'
                value={formData.title}
                placeholder='e.g., Premium Travel Instagram Account'
                onChange={(value) => handleInputChange('title', value)}
                required={true}
              />

              <SelectField
                label='Platform *'
                options={platforms}
                value={formData.platform}
                onChange={(value) => handleInputChange('platform', value)}
                required={true}
              />

              <InputField
                label='Username/Handle *'
                value={formData.username}
                placeholder='@username'
                onChange={(value) => handleInputChange('username', value)}
                required={true}
              />

              <SelectField
                label='Niche/Category *'
                options={niches}
                value={formData.niche}
                onChange={(value) => handleInputChange('niche', value)}
                required={true}
              />
            </div>
          </Section>

          {/* METRICS */}
          <Section title='Account Metrics'>
            <div className='grid gap-6 md:grid-cols-2'>
              <InputField
                label='Followers Count *'
                type='number'
                min={0}
                value={formData.followers_count}
                placeholder='10000'
                onChange={(value) => handleInputChange('followers_count', value)}
                required={true}
              />

              <InputField
                label='Engagement Rate (%) *'
                type='number'
                min={0}
                max={100}
                value={formData.engagement_rate}
                placeholder='4'
                onChange={(value) => handleInputChange('engagement_rate', value)}
              />

              <InputField
                label='Monthly Views/Impressions *'
                type='number'
                min={0}
                value={formData.monthly_views}
                placeholder='100000'
                onChange={(value) => handleInputChange('monthly_views', value)}
              />

              <InputField
                label='Primary Audience Country'
                value={formData.country}
                placeholder='India'
                onChange={(value) => handleInputChange('country', value)}
              />

              <SelectField
                label='Primary Audience Age Range'
                options={ageRanges}
                value={formData.age_range}
                onChange={(value) => handleInputChange('age_range', value)}
              />

              <div className='flex flex-col gap-2'>
                <CheckBoxField
                  label='Account is verified on the platform'
                  checked={formData.verified}
                  onChange={(checked) => handleInputChange('verified', checked)}
                />
                <CheckBoxField
                  label='Account is monetized'
                  checked={formData.monetized}
                  onChange={(checked) => handleInputChange('monetized', checked)}
                />
              </div>
            </div>
          </Section>

          {/* Pricing */}
          <Section title='Pricing & Description'>
            <div className='grid gap-6 md:grid-cols-2'>
              <InputField
                label='Asking Price (USD) *'
                type='number'
                min={0}
                value={formData.price}
                placeholder='2500.00'
                onChange={(value) => handleInputChange('price', value)}
                required={true}
              />
              <TextareaField
                label='Description *'
                value={formData.description}
                onChange={(value) => handleInputChange('description', value)}
                required={true}
              />
            </div>
          </Section>

          {/* Images */}
          <Section title='Upload Images'>
            <div className='grid gap-4 md:grid-cols-2'>
              <div className='flex flex-col gap-2 rounded-lg border border-dashed border-gray-300 p-4 text-center'>
                <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600'>
                  <Upload className='h-6 w-6' />
                </div>
                <label
                  htmlFor='images'
                  className='cursor-pointer text-sm font-medium text-indigo-600 hover:text-indigo-700'
                >
                  Choose files
                </label>
                <p className='text-xs text-gray-500'>Upload screenshots or analytics proof (max 5 images).</p>
                <input
                  type='file'
                  id='images'
                  multiple
                  accept='image/*'
                  onChange={handleImageUpload}
                  className='hidden'
                />
              </div>

              {formData.images.length > 0 && (
                <div className='grid gap-3 sm:grid-cols-2'>
                  {formData.images.map((img, idx) => (
                    <div key={idx} className='relative overflow-hidden rounded-lg border border-gray-200'>
                      <img
                        src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                        alt={`image ${idx + 1}`}
                        className='h-32 w-full object-cover'
                      />
                      <button
                        type='button'
                        onClick={() => removeImage(idx)}
                        className='absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-gray-600 hover:bg-white'
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Section>

          <div className='flex flex-col gap-3 sm:flex-row sm:justify-end'>
            <button
              type='button'
              onClick={() => navigate(-1)}
              className='rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700'
            >
              {isEditing ? 'Update Listing' : 'Create Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
// common Elements

const Section = ({ title, children }) => (
  <section className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm'>
    {title && <h2 className='text-lg font-semibold text-gray-900'>{title}</h2>}
    <div className='mt-4 space-y-6'>{children}</div>
  </section>
)

const InputField = ({label, value, onChange, placeholder,type='text',required=false,min=null,max=null})=>(
      <div>
        <label className="">{label}</label>
        <input type={type} min={min} max={max} placeholder={placeholder} value={value} onChange={(e)=>onChange(e.target.value)}  required={required}/>
      </div>
)

const SelectField = ({ label, options, value, onChange, required = false }) => {
  return (
    <div className='flex flex-col gap-1'>
      <label className='text-sm font-medium text-gray-700'>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className='w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none'
      >
        <option value=''>Select...</option>
        {options.map((opt) => (
          <option key={opt} value={opt} className='text-gray-900'>
            {opt}
          </option>
        ))}
      </select>
    </div>
  )
}

const CheckBoxField = ({ label, checked, onChange, required = false }) => {
  return (
    <label className='inline-flex items-center gap-2 text-sm text-gray-700'>
      <input
        type='checkbox'
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
        required={required}
      />
      <span>{label}</span>
    </label>
  )
}

const TextareaField = ({ label, value, onChange, required = false }) => {
  return (
    <div className='flex flex-col gap-1'>
      <label className='text-sm font-medium text-gray-700'>{label}</label>
      <textarea
        rows={5}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none'
        required={required}
      />
    </div>
  )
}



export default ManageListing
