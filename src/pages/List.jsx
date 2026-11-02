import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Trash2 } from 'lucide-react';

export const List = ({ url }) => {
  const [listData, setListData] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/product/list`);
      if (response.data.success) {
        setListData(response.data.data);
      } else {
        toast.error('Error fetching menu items');
      }
    } catch (error) {
      toast.error('Server error while fetching menu items');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const removeProduct = async (productId) => {
    try {
      const response = await axios.post(
        `${url}/api/product/remove`,
        { id: productId },
        { headers: { token: localStorage.getItem('adminToken') } }
      );
      await fetchList();
      if (response.data.success) {
        toast.success(response.data.message || "Item removed");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error, "Error in removing product");
    }
  };

  return (
    <div className="p-4 sm:p-8 w-full max-w-6xl min-h-screen">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#01472e]">Cafe Menu Inventory</h2>
        <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">
          Active natural food items and beverages currently published
        </p>
      </div>

      <div className="grid grid-cols-[.4fr_1fr_120px_80px_60px] font-semibold bg-[#01472e] text-[#fefae0] px-4 py-3 rounded-t-xl text-xs uppercase tracking-wider">
        <div>Image</div>
        <div>Item Name</div>
        <div>Category</div>
        <div className="text-center">Price</div>
        <div className="text-center">Action</div>
      </div>

      <div className="space-y-2 mt-2">
        {listData.length === 0 ? (
          <div className="bg-white border rounded-b-xl p-8 text-center text-gray-500">
            No cafe items found in backend database yet. Use "Add Cafe Item" to publish.
          </div>
        ) : (
          listData.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-3 grid grid-cols-[.4fr_1fr_120px_80px_60px] items-center hover:shadow-sm transition"
            >
              <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={`${url}/image/${item.image}`}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="px-2">
                <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                <p className="text-xs text-gray-500 truncate">{item.description}</p>
              </div>

              <div className="text-xs font-semibold text-[#01472e] bg-[#ccd5ae]/40 px-2 py-1 rounded-full text-center truncate">
                {item.category}
              </div>

              <div className="text-center font-bold text-gray-800 text-sm">
                ${item.price}
              </div>

              <div className="flex justify-center">
                <button
                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition cursor-pointer"
                  onClick={() => removeProduct(item._id)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
