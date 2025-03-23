import React, {useState } from 'react';
import SidePanel from '../Components/SidePanel';
import { useFormik } from 'formik';

const Settings = () => {
   const [isEdit, setIsEdit] = useState(false);

   const getStoredValues = () => {
      const storedValues = localStorage.getItem('settingsData');
      return storedValues
         ? JSON.parse(storedValues)
         : {
              firstName: '',
              lastName: '',
              email: '',
              dateOfBirth: '',
              gender: '',
              profilePicture: '',
              monthlyIncome: '',
              monthlyBudgetLimit: '',
              accountNumber: '',
              expiryDate: '',
           };
   };

   const {
      values,
      errors,
      handleChange,
      handleBlur,
      handleSubmit,
      touched,
      handleReset,
   } = useFormik({
      initialValues: getStoredValues(),
      enableReinitialize: true,
      onSubmit: (values) => {
         console.log('Saved Data:', values);
         localStorage.setItem('settingsData', JSON.stringify(values));
         setIsEdit(false);
      },
   });

   return (
      <div className="flex min-h-screen">
         <SidePanel />
         <div className="flex-1 p-6">
            <div className="p-2 h-full">
               <div className="flex justify-between items-center">
                  <p className="font-semibold text-3xl">Settings</p>
                  <button onClick={() => setIsEdit(!isEdit)}>
                     {!isEdit && 
                        <i className="fa-regular fa-pen-to-square border-y-2 p-2 rounded-full border-[#155dfc] text-[#155dfc] hover:bg-[#155dfc] hover:text-white hover:cursor-pointer text-lg px-4"></i>
                     }
                  </button>
               </div>

               <div>
                  <form onSubmit={handleSubmit} id="settings-form">
                     <div className="grid grid-cols-1 border my-5 rounded-2xl border-[#ccc] shadow-xl p-6 sm:grid-cols-2 md:grid-cols-4 gap-5">
                        {Object.keys(values).map((key, index) => (
                           <div key={index} className="my-2">
                              <label className="block text-sm font-medium mb-1 -tracking-tight">
                                 {key.charAt(0).toUpperCase()+key.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                              </label>
                              {key === 'profilePicture' ? (
                                 <input
                                    type="file"
                                    name="profilePicture"
                                    disabled={!isEdit}
                                    onChange={(event) =>
                                       setFieldValue(
                                          'profilePicture',
                                          event.currentTarget.files[0]
                                       )
                                    }
                                    className={`w-full p-2 border border-gray-400 rounded-md ${
                                       !isEdit
                                          ? 'bg-gray-300 opacity-50 cursor-not-allowed'
                                          : ''
                                    }`}
                                 />
                              ) : (
                                 <input
                                    type={
                                       key === 'dateOfBirth' ? 'date' : 'text'
                                    }
                                    name={key}
                                    disabled={!isEdit}
                                    autoComplete="off"
                                    value={values[key]}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`w-full p-2 border border-gray-400 rounded-md ${
                                       !isEdit
                                          ? 'bg-gray-300 opacity-50 cursor-not-allowed'
                                          : ''
                                    }`}
                                 />
                              )}
                              {errors[key] && touched[key] ? (
                                 <p className="text-red-700 font-semibold">
                                    {errors[key]}
                                 </p>
                              ) : (
                                 ''
                              )}
                           </div>
                        ))}
                     </div>
                     {
                        isEdit &&
                        <button type='submit' className='border-y-2 p-2 rounded-full border-[#155dfc] text-[#155dfc] hover:bg-[#155dfc] hover:text-white hover:cursor-pointer text-xl px-7 font-bold'>Submit</button>
                     }
                  </form>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Settings;
