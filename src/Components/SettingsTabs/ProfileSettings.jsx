import React, { useEffect, useState } from 'react';
import { Upload, Trash2, Check, User, DollarSign } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
   loadProfileSettings,
   updateProfileSettings,
} from '../../app/features/settingsSlice';
import { toast } from 'react-toastify';
import { useDarkMode } from '../DarkModeContext';

const ProfileSettings = () => {
   const { isDarkMode } = useDarkMode();
   const dispatch = useDispatch();

   const profileSettingsData = useSelector(
      (state) => state.settings.profileSettingsData || {}
   );

   const [formData, setFormData] = useState({
      name: profileSettingsData.name || 'Rahil Pathan',
      username: profileSettingsData.username || 'rahil_dev',
      email: profileSettingsData.email || 'user@tracksy.finance',
      phone: profileSettingsData.phone || '+91 98765 43210',
      currency: profileSettingsData.currency || '₹',
      image: profileSettingsData.image || '',
   });

   useEffect(() => {
      dispatch(loadProfileSettings());
   }, [dispatch]);

   useEffect(() => {
      if (profileSettingsData.name) {
         setFormData((prev) => ({
            ...prev,
            ...profileSettingsData,
         }));
      }
   }, [profileSettingsData]);

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
         ...prev,
         [name]: value,
      }));
   };

   const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
         if (file.size > 2 * 1024 * 1024) {
            toast.error('Image size should be under 2MB');
            return;
         }
         const reader = new FileReader();
         reader.onloadend = () => {
            setFormData((prev) => ({
               ...prev,
               image: reader.result,
            }));
            toast.info('Avatar loaded (click Save to persist)');
         };
         reader.readAsDataURL(file);
      }
   };

   const handleImageRemove = () => {
      setFormData((prev) => ({ ...prev, image: '' }));
      toast.info('Profile picture cleared');
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      dispatch(updateProfileSettings(formData));
      toast.success('Profile preferences updated successfully');
   };

   return (
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
         <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
               Personal Profile & Preferences
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
               Manage your account identity and local currency denomination.
            </p>
         </div>

         {/* Avatar Section */}
         <div className="flex items-center gap-5 pb-4 border-b border-slate-100 dark:border-zinc-800">
            <div className="relative">
               {formData.image ? (
                  <img
                     src={formData.image}
                     alt="Profile"
                     className="w-20 h-20 rounded-2xl object-cover border border-slate-200 dark:border-zinc-700 shadow-sm"
                  />
               ) : (
                  <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-700 dark:text-zinc-200 font-bold text-2xl border-2 border-dashed border-slate-300 dark:border-zinc-700">
                     {formData.name ? formData.name.charAt(0).toUpperCase() : <User size={28} />}
                  </div>
               )}
            </div>

            <div className="space-y-2">
               <div className="flex items-center gap-2">
                  <label
                     htmlFor="avatar-upload"
                     className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                  >
                     <Upload size={14} />
                     <span>Upload Avatar</span>
                     <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                     />
                  </label>

                  {formData.image && (
                     <button
                        type="button"
                        onClick={handleImageRemove}
                        className="p-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Remove photo"
                     >
                        <Trash2 size={16} />
                     </button>
                  )}
               </div>
               <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                  Recommended: Square JPG or PNG, max 2MB.
               </p>
            </div>
         </div>

         {/* Form Fields Grid */}
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
               <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                  Full Name
               </label>
               <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs border outline-none transition-all
                     ${
                        isDarkMode
                           ? 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-indigo-500'
                           : 'bg-white border-slate-200 text-slate-800 focus:border-indigo-500 shadow-xs'
                     }`}
                  required
               />
            </div>

            <div>
               <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                  Username
               </label>
               <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs border outline-none transition-all
                     ${
                        isDarkMode
                           ? 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-indigo-500'
                           : 'bg-white border-slate-200 text-slate-800 focus:border-indigo-500 shadow-xs'
                     }`}
               />
            </div>

            <div>
               <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                  Email Address
               </label>
               <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs border outline-none transition-all
                     ${
                        isDarkMode
                           ? 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-indigo-500'
                           : 'bg-white border-slate-200 text-slate-800 focus:border-indigo-500 shadow-xs'
                     }`}
               />
            </div>

            <div>
               <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                  Phone Number
               </label>
               <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs border outline-none transition-all
                     ${
                        isDarkMode
                           ? 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-indigo-500'
                           : 'bg-white border-slate-200 text-slate-800 focus:border-indigo-500 shadow-xs'
                     }`}
               />
            </div>

            <div>
               <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5 flex items-center gap-1">
                  <DollarSign size={12} />
                  <span>Currency Denomination Symbol</span>
               </label>
               <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs border outline-none cursor-pointer
                     ${
                        isDarkMode
                           ? 'bg-zinc-900 border-zinc-800 text-zinc-100'
                           : 'bg-white border-slate-200 text-slate-800 shadow-xs'
                     }`}
               >
                  <option value="₹">₹ - Indian Rupee (INR)</option>
                  <option value="$">$ - US Dollar (USD)</option>
                  <option value="€">€ - Euro (EUR)</option>
                  <option value="£">£ - British Pound (GBP)</option>
                  <option value="¥">¥ - Japanese Yen (JPY)</option>
                  <option value="C$">C$ - Canadian Dollar (CAD)</option>
                  <option value="A$">A$ - Australian Dollar (AUD)</option>
                  <option value="AED">AED - UAE Dirham</option>
               </select>
            </div>
         </div>

         {/* Submit Button */}
         <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex justify-end">
            <button
               type="submit"
               className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-600/30"
            >
               <Check size={16} strokeWidth={2.4} />
               <span>Save Profile Changes</span>
            </button>
         </div>
      </form>
   );
};

export default ProfileSettings;
