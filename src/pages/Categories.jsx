import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PlusCircle, Trash2, Tag, Layers, Loader2 } from 'lucide-react';

export const Categories = ({ url }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: ''
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${url}/api/category/list`);
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (err) {
      toast.error("Failed to load categories");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      setSubmitting(true);
      const res = await axios.post(
        `${url}/api/category/add`,
        form,
        { headers: { token: localStorage.getItem('adminToken') } }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Category created successfully!");
        setForm({ name: '', description: '' });
        await fetchCategories();
      } else {
        toast.error(res.data.message || "Failed to create category");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error while creating category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveCategory = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove category "${name}"?`)) return;

    try {
      const res = await axios.post(
        `${url}/api/category/remove`,
        { id },
        { headers: { token: localStorage.getItem('adminToken') } }
      );

      if (res.data.success) {
        toast.success(`Category "${name}" removed`);
        await fetchCategories();
      } else {
        toast.error(res.data.message || "Failed to remove category");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error removing category");
    }
  };

  return (
    <div className="p-4 sm:p-8 w-full max-w-6xl min-h-screen">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#01472e]">
          Menu Categories
        </h2>
        <p className="text-xs uppercase tracking-wider text-gray-500 mt-1">
          Create and manage botanical menu categories & dietary pillars
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Category Card */}
        <div className="lg:col-span-1">
          <form
            onSubmit={handleCreateCategory}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200"
          >
            <div className="flex items-center gap-2 mb-4 text-[#01472e]">
              <PlusCircle className="w-5 h-5" />
              <h3 className="font-bold text-base">Add New Category</h3>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                Category Title
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Raw Juices & Elixirs"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#01472e]"
              />
            </div>

            <div className="mb-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                Description / Botanical Notes
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="e.g. Cold-pressed raw vitality juices and living botanical elixirs..."
                rows="3"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#01472e] resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#01472e] text-[#fefae0] py-3 rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-[#01472e]/90 transition shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <span>Save Category</span>
              )}
            </button>
          </form>
        </div>

        {/* Existing Categories List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between p-5 bg-[#01472e] text-[#fefae0]">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5" />
                <span className="font-bold text-sm uppercase tracking-wider">
                  Active Categories ({categories.length})
                </span>
              </div>
            </div>

            {loading ? (
              <div className="p-10 text-center text-gray-500 font-medium">
                Loading categories...
              </div>
            ) : categories.length === 0 ? (
              <div className="p-10 text-center text-gray-500">
                No custom categories found yet.
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {categories.map((cat, index) => (
                  <div
                    key={cat._id || index}
                    className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#ccd5ae]/40 text-[#01472e] flex items-center justify-center shrink-0 mt-0.5">
                        <Tag className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">
                          {cat.name}
                        </h4>
                        {cat.description && (
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                            {cat.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveCategory(cat._id, cat.name)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                      title="Remove Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
