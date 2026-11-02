import React, { useEffect, useState } from 'react';
import { UploadCloud, PlusCircle, Check, Loader2 } from 'lucide-react';
import axios from "axios";
import { toast } from 'react-toastify';

const DEFAULT_CATEGORIES = [
  "Artisan Brews & Teas",
  "Superfood Bowls",
  "Sourdough & Bakes",
  "Botanical Tonics"
];

export const Add = ({ url }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [submittingCategory, setSubmittingCategory] = useState(false);

  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Artisan Brews & Teas"
  });

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const res = await axios.get(`${url}/api/category/list`);
      if (res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        const fetchedNames = res.data.data.map(c => c.name);
        setCategories(fetchedNames);
        if (!data.category || !fetchedNames.includes(data.category)) {
          setData(prev => ({ ...prev, category: fetchedNames[0] }));
        }
      }
    } catch (err) {
      console.log("Could not load dynamic categories, using defaults:", err.message);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [url]);

  const handleonChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleQuickCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      setSubmittingCategory(true);
      const res = await axios.post(
        `${url}/api/category/add`,
        { name: newCategoryName.trim() },
        { headers: { token: localStorage.getItem('adminToken') } }
      );

      if (res.data.success) {
        toast.success(`Category "${newCategoryName.trim()}" created!`);
        const addedName = res.data.data?.name || newCategoryName.trim();
        setCategories(prev => [...prev, addedName]);
        setData(prev => ({ ...prev, category: addedName }));
        setNewCategoryName("");
        setIsAddingNewCategory(false);
      } else {
        toast.error(res.data.message || "Failed to create category");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add category");
    } finally {
      setSubmittingCategory(false);
    }
  };

  const handleonSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error("Please upload an image for the item");
      return;
    }

    const formdata = new FormData();
    formdata.append("name", data.name);
    formdata.append("description", data.description);
    formdata.append("price", data.price);
    formdata.append("category", data.category);
    formdata.append("image", image);

    try {
      const response = await axios.post(`${url}/api/product/add`, formdata, {
        headers: { token: localStorage.getItem('adminToken') }
      });

      if (response.data.success) {
        setData({
          name: "",
          description: "",
          price: "",
          category: categories[0] || "Artisan Brews & Teas"
        });
        setImage(null);
        setPreview(null);
        toast.success(response.data.message || "Botanical item added!");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error connecting to backend server");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <form
      onSubmit={handleonSubmit}
      className="max-w-2xl mx-auto bg-white shadow-md border border-gray-200 rounded-2xl p-6 lg:p-10 my-8"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl lg:text-3xl font-bold text-[#01472e]">
          Add Cafe Item
        </h2>
        <p className="text-xs uppercase tracking-wider text-gray-500 mt-1">
          Add natural foods, brews, bowls, or bakes to the menu
        </p>
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 text-sm font-semibold mb-2">
          Item Photograph
        </label>
        <div className="flex w-full">
          <label className="relative flex flex-col items-center justify-center px-4 py-6 bg-gray-50 text-gray-700 rounded-xl shadow-inner border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-100 w-full h-48 overflow-hidden transition">
            {preview ? (
              <img src={preview} alt="Preview" className="object-cover h-full w-full rounded-lg" />
            ) : (
              <>
                <UploadCloud className="w-10 h-10 mb-2 text-[#01472e]" />
                <span className="text-sm font-medium text-gray-600">Click to upload photo</span>
                <span className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</span>
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
        <label className="block text-gray-700 text-sm font-semibold mb-2">Item Title</label>
        <input
          onChange={handleonChange}
          value={data.name}
          name="name"
          type="text"
          required
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#01472e]"
          placeholder="e.g. Ceremonial Matcha Botanical Cloud"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-semibold mb-2">Item Description & Ingredients</label>
        <textarea
          onChange={handleonChange}
          value={data.description}
          name="description"
          rows="3"
          required
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#01472e] resize-none"
          placeholder="e.g. Cold-whipped oat milk, raw lavender reduction, blue spirulina foam..."
        ></textarea>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-gray-700 text-sm font-semibold">Category</label>
            <button
              type="button"
              onClick={() => setIsAddingNewCategory(!isAddingNewCategory)}
              className="text-[11px] font-bold text-[#01472e] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              {isAddingNewCategory ? "Choose Existing" : "+ New Category"}
            </button>
          </div>

          {isAddingNewCategory ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="New Category Name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#01472e]"
              />
              <button
                type="button"
                onClick={handleQuickCreateCategory}
                disabled={submittingCategory}
                className="bg-[#01472e] text-[#fefae0] px-3 py-2 rounded-lg text-xs font-bold hover:bg-[#01472e]/90 transition shrink-0 flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                {submittingCategory ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                Add
              </button>
            </div>
          ) : (
            <div className="relative">
              <select
                onChange={handleonChange}
                value={data.category}
                name="category"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#01472e] appearance-none bg-white font-medium"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                ▼
              </div>
            </div>
          )}
        </div>

        <div className="flex-1">
          <label className="block text-gray-700 text-sm font-semibold mb-2">Price ($)</label>
          <input
            onChange={handleonChange}
            value={data.price}
            name="price"
            type="number"
            step="0.01"
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#01472e]"
            placeholder="e.g. 8.50"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-[#01472e] text-[#fefae0] py-3 rounded-xl font-bold tracking-wider uppercase hover:bg-[#01472e]/90 transition shadow-md cursor-pointer"
      >
        Publish Cafe Item
      </button>
    </form>
  );
};
