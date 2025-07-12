import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PackageSearch } from 'lucide-react';

export const Order = ({ url }) => {
  const [data, setData] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");

  const fetchOrderList = async () => {
    try {
      const response = await axios.get(url + "/api/order/list",{ headers: { token: localStorage.getItem('adminToken') } });
      if (response.data.success) {
        setData(response.data.data);
        
      } else {
        toast.error("Error in getting the order list");
      }
    } catch (error) {
      toast.error("Server error while fetching orders");
    }
  };

  const statusHandler = async (e,orderId)=>{
    
    try {
      const response = await axios.post(url+"/api/order/status",{orderId,status:e.target.value},{headers:{token:localStorage.getItem("adminToken")}})
      if(response.data.success){
        await fetchOrderList()
        toast.success("Status Updated")
      }
    } catch (error) {
      toast.error("Can not update the status")
    }
  }

  useEffect(() => {
    fetchOrderList();
  }, []);

  // Sort and filter orders
  const filteredOrders = (
    filterStatus === "All"
      ? data
      : data.filter(order => order.status.toLowerCase() === filterStatus.toLowerCase())
  ).slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // newest first

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-10 py-20">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
        Order Management
      </h2>

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {["All", "Product Processing", "Out For Delivery", "Delivered"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-1.5 text-sm rounded-md border transition ${filterStatus === status
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* No Orders */}
      {filteredOrders.length === 0 ? (
        <div className="text-center text-gray-600">
          <PackageSearch className="mx-auto mb-4 w-10 h-10 text-gray-400" />
          <p className="text-lg">No orders found</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2 2xl:grid-cols-3">
          {filteredOrders.map((order, index) => (
            <div
              key={order._id}
              className="bg-white border shadow-sm rounded-xl p-4 flex flex-col gap-1 hover:shadow-md transition max-w-full break-words"
            >

              <h4 className="text-base font-semibold text-gray-800 mb-1">
                Order #{data.length - data.indexOf(order)}
              </h4>

              <div className="flex flex-col md:flex-row justify-between gap-1 text-sm text-gray-700">
                {/* LEFT: Items & Total */}
                <div className="flex flex-col gap-3 md:w-1/2 pr-3">
                  <p className="mt-2 font-semibold text-gray-900">
                    Total: ${order.amount}
                  </p>
                  <div>
                    <p className="font-medium text-gray-800 mb-1">Items:</p>
                    <div className="space-y-1 pl-1">
                      {order.items.map((item, i) => (
                        <div key={i}>
                          <div className="flex justify-between">
                            <span>• {item.name}</span>
                            <span className="font-medium text-gray-800">× {item.quantity}</span>
                          </div>
                          <div className="h-px bg-gray-400 my-1" />
                        </div>
                      ))}
                    </div>
                  </div>
                 
                </div>

                {/* Vertical Divider */}
                <div className="hidden md:block w-px bg-gray-300"></div>

                {/* RIGHT: Customer Info (without address) */}
                <div className="flex-1 md:pl-4">
                  <p className="font-medium text-gray-800 mb-1">Customer Info:</p>
                  <div className="space-y-1 pl-2">
                    <p>👤 {order.address.name}</p>
                    <p>📞 {order.address.phone}</p>
                    <p>📧 {order.address.email}</p>
                     <p className="text-xs text-gray-500 mt-2">
                    🗓️ Ordered on: {new Date(order.createdAt).toLocaleString()}
                  </p>
                  </div>
                </div>
              </div>

              {/* ADDRESS SECTION - full width below */}
              <div className="mt-3 text-sm text-gray-700">
                <p className="font-medium text-gray-800 mb-1">Address:</p>
                <p className="bg-gray-100 rounded-md px-2 py-1 break-words">
                  🏠 {order.address.address}
                </p>
              </div>


              {/* Status Dropdown */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">Update Status</label>
                <select
                  
                  onChange={(e)=>(statusHandler(e,order._id))}
                 value={order.status}
                  className="w-full px-2 py-1 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Product Processing">Product Processing</option>
                  <option value="Out For Delivery">Out For Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
