/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Link as ScrollLink } from "react-scroll";

import { useState } from "react";
import Nav from "./Nav";
import { Button } from "./ui/button";
import { useMode } from "@/components/mode-context";
import NavMobile from "./NavMobile";

const Header = () => {
  const [active, setActive] = useState(true);

  const { mode, toggle } = useMode();

  useEffect(() => {
    // const handleScroll = () => {
    //   // scroll detection
    //   //setActive(window.scrollY > 100);
    // };
    // //event listener (add)
    // window.addEventListener("scroll", handleScroll);

    // return () => {
    //   window.removeEventListener("scroll", handleScroll);
    // };
  }, []);

  return (
    <header
      className={`${
        active ? " bg-black py-4 " : "bg-none py-8"
      } fixed top-0 w-full z-50 left-0 transition-all duration-200`}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          {/* logo */}
          <Link href="/">
            <Image src="/culturechef2.png" width={80} height={80} alt="" />
          </Link>
          {/* navbar */}
          <Nav
            containerStyles="hidden xl:flex gap-x-12 text-white"
            linkStyles="capitalize"
          />
          {/* button */}
          <ScrollLink to="reservation" smooth={true}>
            {/* <Button className="rounded" variant="orange" size="sm">
              Book a table
            </Button> */}
          </ScrollLink>

          {/* Toggle: User ↔ Chef Mode (prototype) */}
          {/* <button
            onClick={toggle}
            className={`ml-3 text-sm px-3 py-1.5 rounded-lg border transition ${
            mode === "chef" ? "bg-white text-black" : "bg-transparent text-white hover:bg-white/10"
            }`}
            aria-pressed={mode === "chef"}
            title={mode === "chef" ? "Chef Mode (on)" : "User Mode (on)"}
            >
            {mode === "chef" ? "Chef" : "User"}
          </button> */}

          {/* navMobile */}
          <NavMobile
            containerStyles="xl:hidden"
            iconStyles="text-3xl"
            linkStyles="uppercase"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
