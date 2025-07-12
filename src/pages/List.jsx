import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';

export const List = ({url}) => {
  
  const [listData, setListData] = useState([]);

  const fetchList = async () => {
    if(!localStorage.getItem("adminToken")){
      toast.error("token not found")
    }
    try {
      const response = await axios.get(`${url}/api/product/list`);
     
      if (response.data.success) {
        setListData(response.data.data);
      } else {
        toast.error('Error in fetching the product list');
      }
    } catch (error) {
      toast.error('Server error while fetching product list');
      console.error(error);
    }
  };

  useEffect(() => {
    
    fetchList();
  }, []);

  const removeProduct = async (productId) => {
    try {
      const response = await axios.post(`${url}/api/product/remove`,{id:productId},{ headers: { token: localStorage.getItem('adminToken') } })
      await fetchList()
      if(response.data.success){
        toast.success(response.data.message)
      }else{
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error,"Error in removing the product")
    }
  }

  return (
    <div className="sm:p-4 sm:py-4 w-[85vw] sm:w-full max-w-6xl min-h-screen lg:pl-10 mt-5">
      <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-800">Product List</h2>

      
      <div className="grid grid-cols-[.3fr_.65fr_75px_40px_25px] sm:grid-cols-[.5fr_1fr_90px_50px_40px] lg:grid-cols-[.5fr_1fr_150px_100px_80px]  font-semibold bg-gray-100 text-gray-700 px-1 sm:px-4 py-2 border border-gray-300 rounded-t-md text-sm">
        <div>Image</div>
        <div>Name</div>
        <div>Category</div>
        <div className="text-center">Price</div>
        <div className="text-center">Dlt</div>
      </div>

     
      <div className="space-y-2 mt-2">
        {listData.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No products found.</p>
        ) : (
          listData.map((item, index) => (
            <div
              key={index}
              className="relative border border-gray-200 rounded-md bg-white shadow-sm p-2 grid   grid-cols-[.3fr_.65fr_75px_40px_22px] sm:grid-cols-[.5fr_1fr_90px_50px_40px] lg:grid-cols-[.5fr_1fr_150px_100px_80px] sm:items-center "
            >
             
              <div className="lg:w-24 lg:h-16 sm:w-15 sm:h-12 w-12 h-10  flex-shrink-0">
                <img
                  src={`${url}/image/${item.image}`}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>

              
              <div className="flex flex-col px-0.5 sm:px-1 tracking-tight w-full gap-1 text-sm sm:text-base capitalize lg:text-lg text-gray-800 ">
                <p className="font-semibold">{item.name}</p>
              </div>

              <div className="flex flex-col gap-1 text-sm sm:text-base font-medium capitalize text-gray-600 ">
                <p>{item.category}</p>
              </div>

              <div className="flex flex-col text-center  gap-1 text-sm sm:text-base font-bold text-gray-700 ">
                <p>${item.price}</p>
              </div>

              
              <div className="flex items-start sm:items-center justify-end sm:justify-center ">
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => removeProduct(item._id)}
                >
                  <X className=" sm:h-5 sm:w-5 h-4 w-4" />
                </button>
              </div>

        
            </div>
          ))
        )}
      </div>
    </div>
  );
};
