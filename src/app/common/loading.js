import Image from "next/image";
import React from 'react';

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Image src="/loading.gif" alt="Loading..." width={50} height={50} />
    </div>
  );
};

export default Loading;