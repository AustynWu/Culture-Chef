/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-no-comment-textnodes */
"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeIn } from "../../variants";
import { Button } from "./ui/button";
const About = () => {
  return (
    <section
      className="grid grid-cols-1 xl:grid-cols-2 gap-x-[74px] p-8 md:p-12 xl:p-0 items-center"
      id="about"
    >
      <motion.div
        variants={fadeIn("up", 0.1)}
        initial="hidden"
        whileInView={"show"}
        viewport={{ once: false, amount: 0.1 }}
        className="xl: pl-[135px]"
      >
        <h1 className="mb-10">
          Let's enjoy with <span className="text-orange">Culture Chef</span>{" "}
        </h1>
        <p className="mb-30">
          invite familiar flavor to your place
        </p>

        <p className="mb-10">
          enjoy the Memorable flavor
        </p>
        <Button> Read more</Button>
      </motion.div>
      <motion.div
        variants={fadeIn("center", 0.2)}
        initial="hidden"
        whileInView={"show"}
        viewport={{ once: false, amount: 0.2 }}
      >
        <Image
          src="/about/aboutculturechef.jpeg"
          width={705}
          height={771}
          alt=""
          className="hidden xl:flex"
        />
      </motion.div>
    </section>
  );
};

export default About;
