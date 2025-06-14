import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { setCredential } from '../app/features/credentialSlice';
import { useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Credentials = () => {
   const dispatch = useDispatch();
   const location = useLocation();
   const navigate = useNavigate();
   const isSignup = location.pathname === '/signup';

   const inputFields = [
      ...(isSignup
         ? [
              {
                 label: 'Name',
                 name: 'name',
                 type: 'text',
                 placeholder: 'Enter your name',
              },
           ]
         : []),
      {
         label: 'Email',
         name: 'email',
         type: 'email',
         placeholder: 'Enter your email',
      },
      {
         label: 'Password',
         name: 'password',
         type: 'password',
         placeholder: 'Enter your password',
      },
   ];

   const initialValues = {
      email: '',
      password: '',
      ...(isSignup ? { name: '' } : {}),
   };

   const validationSchema = Yup.object().shape({
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string().required('Password is required'),
      ...(isSignup ? { name: Yup.string().required('Name is required') } : {}),
   });

   const handleReset = () => {
      resetForm();
   };

   const {
      values,
      errors,
      handleChange,
      handleBlur,
      handleSubmit,
      touched,
      resetForm,
   } = useFormik({
      initialValues,
      validationSchema,
      enableReinitialize: true,
      onSubmit: async (values) => {
         try {
            let response;
            if (isSignup) {
               try {
                  response = await axios.post(
                     `http://localhost:8001/api/users/register`,
                     {
                        email: values.email,
                        password: values.password,
                        ...(isSignup ? { name: values.name } : {}),
                     }
                  );

                  if (response.status === 200) {
                     toast.success(response.data.message, {
                        position: 'bottom-right',
                        autoClose: 5000,
                        closeOnClick: true,
                     });
                     navigate('/');
                  }
               } catch (error) {
                  if (error.response && error.response.status === 401) {
                     toast.error(error.response.data.message, {
                        position: 'bottom-right',
                        autoClose: 5000,
                        closeOnClick: true,
                     });
                  } else {
                     toast.error('Something went wrong', {
                        position: 'bottom-right',
                        autoClose: 5000,
                        closeOnClick: true,
                     });
                  }
               }
               const { name, email, accessToken } = response.data;
               dispatch(
                  setCredential({
                     name,
                     email,
                     password: values.password,
                     accessToken,   
                  })
               );
               console.log('Saved Data:', values);
            } else {
               try {
                  response = await axios.post(
                     'http://localhost:8001/api/users/login',
                     {
                        email: values.email,
                        password: values.password,
                     }
                  );

                  if (response.status === 200) {
                     console.log(response.data);
                     toast.success(response.data.message, {
                        position: 'bottom-right',
                        autoClose: 5000,
                        closeOnClick: true,
                     });
                     navigate('/dashboard');
                  }
               } catch (error) {
                  if (error.response && error.response.status === 401) {
                     toast.error(error.response.data.message, {
                        position: 'bottom-right',
                        autoClose: 5000,
                        closeOnClick: true,
                     });
                  } else {
                     toast.error('Something went wrong', {
                        position: 'bottom-right',
                        autoClose: 5000,
                        closeOnClick: true,
                     });
                  }
               }
            }
         } catch (error) {
            console.error('Error during form submission:', error);
         }
      },
   });

   return (
      <div className="md:flex-row h-screen w-screen bg-gradient-to-br from-[#919bff] to-[#133a94]">
         <ToastContainer />
         <div className="h-screen flex items-center justify-center bg-gradient-to-br from-black/30 via-black/40 to-black/30">
            <div className=" bg-white/20 backdrop-blur-md border-2 border-white/80 shadow-xl text-white p-10 rounded-xl w-full max-w-xl">
               <div className="w-full px-10 max-w-lg mx-auto">
                  <motion.h2
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.5 }}
                     className="text-4xl font-bold text-center mb-2">
                     {isSignup ? 'Create an account' : 'Welcome Back'}
                  </motion.h2>
                  <p className="text-center text-blue-400 font-semibold mb-6">
                     {isSignup
                        ? 'Register to continue with Expense Tracker'
                        : 'Please sign in to access your Expense Tracker account.'}
                  </p>

                  <motion.form
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.5 }}
                     onSubmit={handleSubmit}
                     className="space-y-4">
                     {inputFields.map((field, id) => (
                        <div key={id}>
                           <label
                              htmlFor={field.name}
                              className="block text-yellow-400 font-semibold mb-1">
                              {field.label}
                           </label>
                           <input
                              id={field.name}
                              type={field.type}
                              placeholder={field.placeholder}
                              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                              value={values[field.name]}
                              onChange={handleChange}
                              onBlur={handleBlur}
                           />
                           {touched[field.name] && errors[field.name] && (
                              <div className="text-red-500 text-sm">
                                 {errors[field.name]}
                              </div>
                           )}
                        </div>
                     ))}
                     <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-2 cursor-pointer rounded-md hover:bg-blue-700 transition">
                        {isSignup ? 'Sign up' : 'Sign in'}
                     </button>
                  </motion.form>

                  {/* <div className="text-center mt-4 text-sm text-blue-400 font-semibold">
                     {isSignup
                        ? 'Already have an account?'
                        : "Don't have an account?"}{' '}
                     <Link
                        to={isSignup ? '/' : '/signup'}
                        className="text-yellow-400 font-semibold hover:underline">
                        {isSignup ? 'Sign in' : 'Sign up'}
                     </Link>
                  </div> */}
                  {!isSignup ? (
                     <div className="text-center mt-1 text-sm text-blue-400 font-semibold">
                        Forgot password?
                        <Link
                           to="/reset-password"
                           className="text-yellow-400 font-semibold hover:underline">
                           {` Reset here`}
                        </Link>
                     </div>
                  ) : null}

                  <div className="my-4 flex items-center justify-center text-gray-400">
                     <hr className="w-full border-gray-300" />
                     <span className="px-2 text-yellow-400 font-semibold text-sm">
                        OR
                     </span>
                     <hr className="w-full border-gray-300" />
                  </div>

                  <div className="flex justify-center gap-4">
                     <button className="p-2 rounded-full border-2 cursor-pointer hover:bg-gray-100 transition">
                        <FcGoogle size={24} />
                     </button>
                     <button className="p-2 rounded-full border-2 cursor-pointer border-white hover:bg-gray-100 transition hover:text-black">
                        <FaGithub size={24} />
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Credentials;
