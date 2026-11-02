import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PackageSearch } from 'lucide-react';

export const Order = ({ url }) => {
  const [data, setData] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");

  const fetchOrderList = async () => {
    try {
      const response = await axios.get(url + "/api/order/list", {
        headers: { token: localStorage.getItem('adminToken') }
      });
      if (response.data.success) {
        setData(response.data.data);
      } else {
        toast.error("Error in getting order list");
      }
    } catch (error) {
      toast.error("Server error while fetching orders");
    }
  };

  const statusHandler = async (e, orderId) => {
    try {
      const response = await axios.post(
        url + "/api/order/status",
        { orderId, status: e.target.value },
        { headers: { token: localStorage.getItem("adminToken") } }
      );
      if (response.data.success) {
        await fetchOrderList();
        toast.success("Order status updated!");
      }
    } catch (error) {
      toast.error("Cannot update status");
    }
  };

  useEffect(() => {
    fetchOrderList();
  }, []);

  const filteredOrders = (
    filterStatus === "All"
      ? data
      : data.filter(order => order.status.toLowerCase() === filterStatus.toLowerCase())
  ).slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-10 py-10">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold text-[#01472e]">
          Cafe Order Management
        </h2>
        <p className="text-xs uppercase tracking-wider text-gray-500 mt-1">
          Monitor and update botanical nourishment orders in real-time
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {["All", "Product Processing", "Out For Delivery", "Delivered"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full border transition cursor-pointer ${
              filterStatus === status
                ? "bg-[#01472e] text-[#fefae0] border-[#01472e] shadow-sm"
                : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center text-gray-500 py-16 bg-white rounded-2xl border">
          <PackageSearch className="mx-auto mb-3 w-10 h-10 text-gray-400" />
          <p className="text-base font-semibold">No active cafe orders found</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2 2xl:grid-cols-3">
          {filteredOrders.map((order, index) => (
            <div
              key={order._id}
              className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5 flex flex-col gap-2 hover:shadow-md transition"
            >
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <h4 className="text-base font-bold text-[#01472e]">
                  Order #{data.length - data.indexOf(order)}
                </h4>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#ccd5ae]/40 text-[#01472e]">
                  {order.status}
                </span>
              </div>

              <div className="flex flex-col md:flex-row justify-between gap-3 text-sm text-gray-700 pt-2">
                <div className="flex flex-col gap-2 md:w-1/2 pr-2">
                  <p className="font-bold text-gray-900 text-base">
                    Total: ${order.amount}
                  </p>
                  <div>
                    <p className="font-semibold text-gray-700 text-xs uppercase tracking-wider mb-1">Items:</p>
                    <div className="space-y-1">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-xs">
                          <span>• {item.name}</span>
                          <span className="font-semibold">× {item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex-1 md:pl-3 border-t md:border-t-0 md:border-l border-gray-100 pt-2 md:pt-0">
                  <p className="font-semibold text-gray-700 text-xs uppercase tracking-wider mb-1">Customer:</p>
                  <div className="space-y-0.5 text-xs text-gray-600">
                    <p>👤 {order.address.name}</p>
                    <p>📞 {order.address.phone}</p>
                    <p>📧 {order.address.email}</p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      🗓️ {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-2 text-xs text-gray-700">
                <p className="font-semibold text-gray-700 mb-1">Address:</p>
                <p className="bg-gray-50 rounded-lg p-2 border border-gray-100">
                  🏠 {order.address.address}
                </p>
              </div>

              <div className="mt-2 pt-2 border-t border-gray-100">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Update Status
                </label>
                <select
                  onChange={(e) => statusHandler(e, order._id)}
                  value={order.status}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#01472e] bg-white"
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
