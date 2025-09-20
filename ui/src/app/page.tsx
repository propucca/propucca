"use client";
import { CONFIG } from "@/config";
import React, { FC } from "react";

const HomePage: FC = () => {
  return (
    <div className="flex w-full min-h-screen justify-center items-center">
      <div
        className="bg-center bg-cover w-[500px] h-[500px] rounded-full shadow-lg border-4 border-gray-200"
        style={{
          backgroundImage: `url(${CONFIG.LOGO})`,
        }}
      ></div>
    </div>
  );
};

export default HomePage;
