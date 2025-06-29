import React, { useEffect, useState } from 'react';
import mine from '../../assets/mine.jpg';
import { Trash, Upload } from 'lucide-react';
import { profileSettings } from '../../data';
import { useDispatch, useSelector } from 'react-redux';
import {
   loadProfileSettings,
   setLoading,
   updateProfileSettings,
} from '../../app/features/settingsSlice';
import { toast } from 'react-toastify';
import Loader from '../../Animations/Loader';

const ProfileSettings = () => {
   const dispatch = useDispatch();

   const profileSettingsData = useSelector(
      (state) => state.settings.profileSettingsData
   );

   const isLoading = useSelector(
      (state) => state.settings.profileSettingsData.isLoading
   );

   const [image, setImage] = useState(profileSettingsData.image);
   const [formData, setFormData] = useState(profileSettingsData);

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
         ...prev,
         [name]: value,
      }));
   };

   useEffect(() => {
      setFormData(profileSettingsData);
   }, [profileSettingsData]);

   const handleUpdateProfileSettings = () => {
      dispatch(setLoading(true));
      setTimeout(() => {
         dispatch(updateProfileSettings(formData));
         toast.success('Profile updated successfully');
         dispatch(setLoading(false));
      }, 1000);
   };

   useEffect(() => {
      dispatch(setLoading(true));
      dispatch(loadProfileSettings());
      dispatch(setLoading(false));
   }, []);

   const handleImageRemove = () => {
      setImage(null);
   };

   return (
      <div className="flex flex-col gap-4 my-7 overflow-y-auto h-[calc(100vh-10rem)]">
         {/* Heading */}
         <div>
            <p className="text-lg font-bold">Profile</p>
            <p className="text-sm font-thin text-gray-500">
               Update your photo and personal details here.
            </p>
         </div>

         <hr className="border-gray-300" />

         {/* Profile Picture Upload */}
         <div className="flex items-center gap-5">
            <img
               src={image || profileSettingsData.image || mine}
               alt="Profile"
               className="w-32 h-32 rounded-2xl border-2 border-b-4 border-gray-300 object-cover"
            />
            <div>
               <p className="font-medium">Profile Picture</p>
               <div className="my-2 flex gap-3">
                  {/* Upload Button */}
                  <label
                     htmlFor="image"
                     className="p-1.5 px-5 rounded-lg flex items-center justify-center bg-[#6766e8] text-white hover:bg-[#6766e8]/80 cursor-pointer transition duration-300">
                     <div className="flex items-center gap-2 text-sm">
                        <Upload size={15} />
                        <span>Upload Image</span>
                     </div>
                     <input
                        type="file"
                        id="image"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                           const file = e.target.files[0];
                           if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                 setImage(event.target.result);
                              };
                              reader.readAsDataURL(file);
                           }
                        }}
                     />
                  </label>

                  {/* Remove Button */}
                  <button
                     onClick={handleImageRemove}
                     className="flex p-2 px-5 rounded-lg bg-[#e51e1e] text-white hover:bg-[#e51e1e]/80 cursor-pointer transition duration-300">
                     <div className="flex items-center gap-2 text-sm">
                        <Trash size={15} />
                        <span>Remove</span>
                     </div>
                  </button>
               </div>
               <p className="text-sm font-thin text-gray-500">
                  We support PNGs, JPGs, and GIFs under 10MB.
               </p>
               {isLoading && <Loader />}
            </div>
         </div>

         {/* Profile Fields */}
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mx-5 items-end">
            {profileSettings.map((item) => (
               <div key={item.id} className="flex flex-col gap-1">
                  <label htmlFor={item.name} className="text-sm">
                     {item.label}
                  </label>
                  <input
                     id={item.name}
                     name={item.name}
                     type={item.type}
                     placeholder={item.placeHolder}
                     value={formData[item.name] || ''}
                     onChange={handleInputChange}
                     className="w-full p-2 rounded-lg border-2 border-b-4 indent-2 border-[#d4d9fb] outline-none focus:border-[#8896f3] focus:border-b-4"
                  />
               </div>
            ))}

            {/* Update Button */}
            <p
               onClick={handleUpdateProfileSettings}
               className="border-2 border-b-4 border-[#b7c0ff] text-white bg-[#6766e8] hover:bg-[#6766e8]/90 h-fit py-2 px-5 rounded-lg transition duration-300 col-span-full sm:col-auto text-center cursor-pointer">
               Update
            </p>
         </div>
      </div>
   );
};

export default ProfileSettings;
