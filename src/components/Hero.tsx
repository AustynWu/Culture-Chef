/* eslint-disable react/no-unescaped-entities */
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeIn } from "../../variants";
import { Button } from "./ui/button";
import Link from "next/link";
// import { Viewport } from "@radix-ui/react-select";

const Hero = () => {
  return (
    <section
      className=" bg-hero bg-no-repeat relative xl:h-[960px] py-40 pb-32 xl:py-0"
      id="home"
    >
      <div className="container mx-auto">
        {/* text & images */}
        <div className="flex items-center xl:h-[960px]">
          {/* text */}
          <div className="w-full xl:max-w-[460px] text-center xl:text-left">
            <motion.h1
              variants={fadeIn("down", 0.1)}
              initial="hidden"
              whileInView={"show"}
              viewport={{ once: false, amount: 0.1 }}
              className="text-white mb-7"
            >
              Authentic <br /> Flavors
            </motion.h1>
            <motion.p
              variants={fadeIn("down", 0.1)}
              initial="hidden"
              whileInView={"show"}
              viewport={{ once: false, amount: 0.1 }}
              className="text-white font-semibold mb-7"
            >
              <span className="text-orange"> content</span>
            </motion.p> 
            <motion.p
              variants={fadeIn("down", 0.1)}
              initial="hidden"
              whileInView={"show"}
              viewport={{ once: false, amount: 0.1 }}
              className="text-white mb-12 max-w-lg mx-auto xl:max-w-none xl:mx-0 "
            >
              content
            </motion.p> 
            <motion.div
              variants={fadeIn("down", 0.1)}
              initial="hidden"
              whileInView={"show"}
              viewport={{ once: false, amount: 0.1 }}
            >
              {/* // eslint-disable-next-line react/no-unescaped-entities */}
              {/* <Button className=" transition hover:ease-in-out duration-500 rounded ">
                Let's eat
              </Button> */}
              <Link href="/browse" className="inline-flex items-center rounded-lg bg-orange text-white px-10 py-5 hover:opacity-90">
                Find chefs
              </Link>
            </motion.div>
          </div>
          {/* image */}
          <motion.div
            variants={fadeIn("up", 0.1)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: false, amount: 0.1 }}
            className="hidden xl:flex xl:absolute xl:top-[200px] xl:right-0"
          >
            <Image src="/about/personal chief.jpg" width={756} height={682} alt="" />
          </motion.div>
        </div>
      </div>
      {/* coffee img */}
      {/* <motion.div
        variants={fadeIn("up", 1.2)}
        initial="hidden"
        whileInView={"show"}
        viewport={{ once: false, amount: 0.1 }}
        className="hidden xl:flex xl:relative xl:-top-36"
      >
        <Image src="/hero/coffee.png" width={386} height={404} alt="" />
      </motion.div> */}
    </section>
  );
};

export default Hero;
