import React, { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import axios from "axios"
import { toast } from 'react-toastify';

export const Add = ({url}) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
 

  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Elegant Shoilo"
  })

  const handleonChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setData(prevdata => ({ ...prevdata, [name]: value }))
  }

  const handleonSubmit = async (e) => {
    e.preventDefault();
    const formdata = new FormData;
    formdata.append("name", data.name)
    formdata.append("description", data.description)
    formdata.append("price", data.price)
    formdata.append("category", data.category)
    formdata.append("image", image)

    const response = await axios.post(`${url}/api/product/add`, formdata)

    if (response.data.success) {
      setData({
        name: "",
        description: "",
        price: "",
        category: "Elegant Shoilo"
      });
      setImage(null)
      setPreview(null)
      toast.success(response.data.message)
    } else {
      toast.error(response.data.message)
    }

  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <form
      onSubmit={handleonSubmit}
      className="max-w-2xl mx-auto bg-gray-100 shadow-lg rounded-xl p-6 lg:px-15 m-15"
    >

      <h2 className="text-2xl lg:text-3xl text-center font-semibold text-gray-800 mb-4">Add Product</h2>


      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Upload Image</label>
        <div className="flex  w-full">
          <label className="relative flex flex-col items-center justify-center px-4 py-6 bg-gray-100 text-gray-700 rounded-lg shadow-md border border-gray-300 cursor-pointer hover:bg-gray-200 w-full md:w-1/2 h-48 overflow-hidden">
            {preview ? (
              <img src={preview} alt="Preview" className="object-cover h-full w-full" />
            ) : (
              <>
                <UploadCloud className="w-8 h-8 mb-2 text-gray-600" />
                <span className="text-sm font-medium">Click to upload</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleImageChange}
            />
          </label>
        </div>
      </div>


      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Product Title</label>
        <input
          onChange={handleonChange}
          value={data.name}
          name='name'
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter product name"
        />
      </div>


      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Product Description</label>
        <textarea
          onChange={handleonChange}
          value={data.description}
          name='description'
          rows="4"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter product description"
        ></textarea>
      </div>


      <div className="flex flex-col md:flex-row gap-4 mb-4">

        <div className="flex-1 relative">
          <label className="block text-gray-700 font-medium mb-2">Category</label>
          <div className="relative">
            <select
              onChange={handleonChange}
              value={data.category}
              name='category'
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
            >
              <option value="Elegant Shoilo" >Elegant Shoilo</option>
              <option value="Luxury Rings">Luxury Rings</option>
              <option value="Stylish Bangles">Stylish Bangles</option>
              <option value="Classic Bookmarks">Classic Bookmarks</option>

            </select>
            {/* Custom Down Arrow */}
            <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              ▼
            </div>
          </div>
        </div>



        <div className="flex-1">
          <label className="block text-gray-700 font-medium mb-2">Price ($)</label>
          <input
            onChange={handleonChange}
            value={data.price}
            name='price'
            type="number"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter price"
          />
        </div>
      </div>


      <button
        type='submit'
        className="block w-1/2 lg:w-1/3 mx-auto bg-cyan-600 text-white py-2  mt-5 rounded-md hover:bg-indigo-700 transition duration-300">
        Add Product
      </button>
    </form>
  );
};
