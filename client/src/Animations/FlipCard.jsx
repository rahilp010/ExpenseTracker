import React, { useState } from 'react';
import { motion } from 'framer-motion';
import chip from '../assets/chip.png';
import mastercard from '../assets/mastercard.png';
import { PiContactlessPaymentLight} from 'react-icons/pi';

const FlipCard = () => {
   const [isFlipped, setIsFlipped] = useState(false);

   return (
      <div
         className="w-full h-64 rounded-2xl transition-transform"
         style={{ perspective: '500px' }}
         onClick={() => setIsFlipped(!isFlipped)}>
         <motion.div
            className="relative w-full h-full duration-100"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            style={{ transformStyle: 'preserve-3d' }}
            inherit={{ scale: 0, opacity: 0 }}
            whileInView={{
               scale: 1,
               opacity: 1,
               delay: 0.5,
            }}
            whileHover={{
               cursor: 'pointer',
            }}
            transition={{ type: 'spring', stiffness: 50 }}>
            {/* Front */}
            <div
               className="absolute w-full h-full backface-hidden bg-[#dedde4]  rounded-xl shadow-md flex-1 flex-col items-center text-lg font-semibold"
               style={{ backfaceVisibility: 'hidden' }}>
               <div className="relative flex items-center justify-between px-7 pt-10">
                  <p className="font-medium text-[#aaa8b0] text-xl">
                     Available Balance
                  </p>
                  <PiContactlessPaymentLight
                     size={50}
                     className="absolute right-7 text-[#aaa8b0]"
                  />
               </div>
               <div className="mx-6 flex items-center font-mono text-3xl pt-8">
                  <img src={chip} alt="Chip" className="w-14 h-10" />
                  <span className="px-3">{`₹ 20000`}</span>
               </div>
               <div className="mx-7 flex justify-between items-center font-light text-lg pt-12">
                  <p>{`**** **** **** 2000`}</p>
                  <img
                     src={mastercard}
                     alt="Mastercard"
                     className="w-18 h-12"
                  />
               </div>
            </div>
            {/* Back */}
            <div
               className="absolute w-full h-full backface-hidden bg-[#dedde4] rounded-xl shadow-md flex-1 flex-col items-center text-lg font-semibold rotate-y-180"
               style={{ backfaceVisibility: 'hidden' }}>
               <div className="bg-black w-full h-12 mt-10"></div>
               <div>
                  <p className="text-xl font-bold bg-[#ccc] w-1/2 ml-4 mt-5 p-2 text-right px-3">
                     123
                  </p>
                  <p className="text-xs font-light mt-1 ml-5">
                     Authorized Signature
                  </p>
                  <p className="text-lg mt-1"></p>
                  <div className="relative flex items-center justify-between mx-5 font-light text-xs mt-10">
                     <p>24X7 Toll Free Number 1800-111-000</p>
                     <img
                        src={mastercard}
                        alt="Mastercard"
                        className="w-18 h-12 absolute right-0"
                     />
                  </div>
               </div>
            </div>
         </motion.div>
      </div>
   );
};

export default FlipCard;
