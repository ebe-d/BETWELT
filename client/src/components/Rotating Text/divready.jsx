import React from "react";
import RotatingText from "@/components/Rotating Text/rotatingtxt";

const RotatingT = () => {
  return (
    <div style={{backgroundColor:'red'}} className="flex items-center justify-center h-[300px] w-[500px] bg-red-600 rounded-lg font-[Montserrat] px-6">
      {/* 'Now' on the left with extra spacing */}
      <div className="text-black text-[45px] font-bold mr-8">Now</div>

      {/* Rotating Text in the Center */}
      <RotatingText
        texts={['Predict', 'Bet', 'Win']}
        mainClassName="text-black text-[45px] font-bold text-center"
      />
    </div>
  );
};

export default RotatingT;
