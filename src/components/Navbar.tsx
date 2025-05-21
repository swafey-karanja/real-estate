import { NAVBAR_HEIGHT } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <div
      className="fixed top-0 left-0 z-50 w-full shadow-xl"
      style={{ height: `${NAVBAR_HEIGHT}px` }}
    >
      <div className="flex justify-between items-center w-full py-3 px-8 bg-[#27272a] text-white">
        <div className="flex items-center gap-4 md:gap-6">
          <Link
            href="/"
            className="cursor-pointer hover:!text-[#c7c7cc]"
            scroll={false}
          >
            <div className="flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt="Rentiful logo"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="text-xl font-bold">
                RENT
                <span className="text-[#eb8686] font-light hover:!text-[#c7c7cc]">
                  IFUL
                </span>{" "}
              </div>
            </div>
          </Link>
        </div>
        <p className="text-[#e0e0e2] hidden md:block">
          Discover your perfect rental apartment with our advanced search
        </p>
        <div className="flex items-center gap-5">
          <Link href="/signin">
            <Button
              variant="outline"
              className="text-white border-white bg-transparent cursor-pointer hover:bg-white hover:text-[#27272a] rounded-lg"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button
              variant="secondary"
              className="text-white bg-[#e45a5a] cursor-pointer hover:bg-white hover:text-[#27272a] rounded-lg"
            >
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
