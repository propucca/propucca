"use client";

import React, { FC } from "react";
import { Progress } from "@heroui/react";
import { CONFIG } from "@/config";

const Loader: FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div>
        <div
          className="bg-center bg-cover w-[500px] h-[500px] rounded-full shadow-lg border-4 border-gray-200"
          style={{ backgroundImage: `url(${CONFIG.LOGO})` }}
        ></div>
        <Progress aria-label="loading..." value={100} />
      </div>
    </div>
  );
};

export default Loader;
