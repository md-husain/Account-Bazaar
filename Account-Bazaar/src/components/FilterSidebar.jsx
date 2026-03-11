import { ChevronDown, Filter, X } from "lucide-react";
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function FilterSidebar({ showFilterPhone, setShowFilterPhone, filters, setFilters }) {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const onChangeSearch = (e) => {
    if (e.target.value) {
      setSearchParams({ search: e.target.value });
      setSearch(e.target.value);
    } else {
      navigate(`/marketplace`);
      setSearch("");
    }
  };

  const [expSec, setExpsec] = useState({
    platform: true,
    price: true,
    followers: true,
    niche: true,
    status: true,
  });

  const togglechevron = (section) => {
    setExpsec((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const platforms = [
    { value: "facebook", label: "Facebook" },
    { value: "youtube", label: "Youtube" },
    { value: "instagram", label: "Instagram" },
    { value: "x", label: "X" },
    { value: "linkedin", label: "Linkedin" },
    { value: "twitch", label: "Twitch" },
    { value: "discord", label: "Discord" },
    { value: "pinterest", label: "Pinterest" },
  ];

  const niches = [
    {value:"food" ,label:"Food"},
    {value:"tech" ,label:"Technology"},
    {value:"fitness" ,label:"Fitness"},
    {value:"lifestyle" ,label:"Lifestyle"},
    {value:"travel" ,label:"Travel"},
    {value:"gaming" ,label:"Gaming"},
    {value:"beauty" ,label:"Beauty"},
    {value:"fashion" ,label:"Fashion"},
    {value:"business" ,label:"Bussiness"},
    {value:"education" ,label:"Education"},
    {value:"entertainment" ,label:"Entertainment"},
    {value:"comedy" ,label:"Comedy"},
    {value:"music" ,label:"Music"},
    {value:"art" ,label:"Art"},
    {value:"sports" ,label:"Sports"},
    {value:"health" ,label:"Health"},
    {value:"finance" ,label:"Finance"},
  ]

  const onFilterChange = (nf)=>{
    setFilters({...filters,...nf})
  }
  const clearFilters = ()=>{
    if(search){
        navigate("/marketplace")
    }
    setFilters({
        platform:null,
        maxPrice:100000,
        minFollowers:0,
        niche:null,
        verified:false,
        monotized:false,
    })
  }


  return (
    <div
      className={`${showFilterPhone ? "max-sm:fixed" : "max-sm:hidden"}
      max-sm:inset-0
      max-sm:z-50
      max-sm:h-screen
      max-sm:overflow-y-auto
      bg-white
      rounded-lg
      shadow-sm
      border border-gray-200
      h-fit
      sticky
      top-24
      md:min-w-[300px]`}
    >

      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">

          <div className="flex items-center space-x-2 text-gray-700">
            <Filter className="size-4" />
            <h3 className="font-semibold">Filters</h3>
          </div>

          <div className="flex items-center gap-2">

              <X onClick={clearFilters} className="size-5 text-gray-500 hover:text-grey-700 p-1 hover:bg-grey-100 rounded transition-colors cursor-poinnter" />

            {/* <button
              onClick={() => setShowFilterPhone(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
            </button> */}

            <button
              onClick={() => setShowFilterPhone(false)}
              className="sm:hidden text-sm border px-3 py-1 rounded"
            >
              Apply
            </button>
          </div>

        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6 max-h-[calc(100vh-180px)] overflow-y-auto">

        {/* Search */}
        <input
          type="text"
          placeholder="Search by username, platform, niche..."
          className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md outline-indigo-500"
          onChange={onChangeSearch}
          value={search}
        />

        {/* Platform */}
        <div>

          <button
            onClick={() => togglechevron("platform")}
            className="flex items-center justify-between w-full mb-3"
          >
            <label className="text-sm font-medium text-grey-800">Platform</label>

            <ChevronDown
              className={`size-4 transition-transform ${
                expSec.platform ? "rotate-180" : ""
              }`}
            />
          </button>

          {expSec.platform && (
            <div className="flex flex-col gap-2">

              {platforms.map((platform) => (
                <label
                  key={platform.value}
                  className="flex items-center gap-2 text-gray-700 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={filters.platform?.includes(platform.value) || false}
                    onChange={(e) => {
                        const checked = e.target.checked;
                        const curr = filters.platform || [];

                        const updated = checked
                        ? [...curr, platform.value]
                        : curr.filter((p) => p !== platform.value);

                        onFilterChange({
                        ...filters,
                        platform: updated.length > 0 ? updated : null,
                        });
                    }}
                    />
                  <span>{platform.label}</span>
                </label>
              ))}

            </div>
          )}

        </div>

        {/* price range  */}
          <div>

            <button
                onClick={() => togglechevron("price")}
                className="flex items-center justify-between w-full mb-3"
            >
                <label className="text-sm font-medium text-gray-800">
                Price Range
                </label>

                <ChevronDown
                className={`size-4 transition-transform ${
                    expSec.price ? "rotate-180" : ""
                }`}
                />
            </button>

            {expSec.price && (
                <div className="space-y-3">

                <input
                    type="range"
                    min="0"
                    max="100000"
                    step="100"
                    value={filters.maxPrice || 100000}
                    onChange={(e) =>
                    onFilterChange({
                        ...filters,
                        maxPrice: parseInt(e.target.value),
                    })
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />

                <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{currency}0</span>
                    <span>
                    {currency}
                    {(filters.maxPrice || 100000).toLocaleString()}
                    </span>
                </div>

                </div>
            )}

            </div>
        {/* followers Range */}
         <div>

          <button
            onClick={() => togglechevron("followers")}
            className="flex items-center justify-between w-full mb-3"
          >
            <label className="text-sm font-medium text-grey-800">Minimum Followers</label>

            <ChevronDown
              className={`size-4 transition-transform ${
                expSec.Followers ? "rotate-180" : ""}`}
            />
          </button>

          {expSec.followers && (
            <select value={filters.minFollowers?.toString() || "0"}
             onChange={(e)=>onFilterChange({...filters,minFollowers: parseInt(e.target.value)|| 0 })} 
            className="w-full px-3 py-2 border border-grey-300 rounded-lg text-grey-700 outline-indigo-500">
                <option value="0">Any Amount</option>
                <option value="1000">1K+</option>
                <option value="10000">10K+</option>
                <option value="50000">50K+</option>
                <option value="100000">100K+</option>
                <option value="500000">500K+</option>
                <option value="1000000">1M+</option>

            </select>
          )}

        </div>
         {/* Niche Filter */}
         <div>

          <button
            onClick={() => togglechevron("niche")}
            className="flex items-center justify-between w-full mb-3"
          >
            <label className="text-sm font-medium text-grey-800">Niche</label>

            <ChevronDown
              className={`size-4 transition-transform ${
                expSec.niche ? "rotate-180" : ""}`}
            />
          </button>

          {expSec.niche && (
            <select value={filters.niche || ""}
             onChange={(e)=>onFilterChange({...filters,niche: e.target.value || null })} 
            className="w-full px-3 py-2 border border-grey-300 rounded-lg text-grey-700 outline-indigo-500">
                <option value="">All Niches</option>
                {niches.map((niche)=>(
                    <option key={niche.value} value={niche.value} >
                        {niche.label}
                    </option>
                ))}

            </select>
          )}

        </div>

         {/* Status {verification} */}
         <div>

          <button
            onClick={() => togglechevron("status")}
            className="flex items-center justify-between w-full mb-3"
          >
            <label className="text-sm font-medium text-grey-800">Account Status</label>

            <ChevronDown
              className={`size-4 transition-transform ${
                expSec.status ? "rotate-180" : ""}`}
            />
          </button>

          {expSec.status && (
            <div className="space-y-3">
                <label className="flex items-center space-x-2 cursor-pointer" >
                    <input type="checkbox" checked={filters.verified || false}
                    onChange={(e)=> onFilterChange({...filters,verified: e.target.checked})}/>
                <span className="text-sm text-grey-700">Verifiied accounts only</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer" >
                    <input type="checkbox" checked={filters.monotized || false}
                    onChange={(e)=> onFilterChange({...filters,monotized: e.target.checked})}/>
                <span className="text-sm text-grey-700">Monotized accounts only</span>
                </label>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default FilterSidebar;