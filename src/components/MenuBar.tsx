"use client";
import Link from "next/link";
import Image from "next/image";

import { motion } from "framer-motion";

import { fadeIn } from "../../variants";
import { IoIosArrowRoundForward } from "react-icons/io";

type MenuCard = {
  img: string;
  title: string;
  price: string;
  href: string;
  dishes?: string[]; // 新增可選欄位
};

const menuBar = [
  {
    img: "/menu/item-1.png",
    title: "Amy Lin — Taiwanese Home Feast",
    price: "from $18",
    href: "/chef/amy-lin",
    dishes: ["/taiwanese_food/beef_noodle.jpg", "/taiwanese_food/gua_bao.jpg", "/taiwanese_food/Lu-rou-fan-with-bok-choy.jpg"]
  },

  {
    img: "/menu/item-2.png",
    title: "Raj Singh — North Indian Classics",
    price: "from $16",
    href: "/chef/raj-singh",
    dishes: ["/indian_food/meduvada.png", "/indian_food/mohanthal.png", "/indian_food/dabeli.png"]
  },

  {
    img: "/menu/item-3.png",
    title: "Maria Rossi — Italian Comfort",
    price: "from $20",
    href: "/chef/maria-rossi", 
    dishes: ["/Italian_food/images.jpg", "/Italian_food/download (2).jpg", "/Italian_food/download (1).jpg"]
  },

  {
    img: "/menu/item-4.png",
    title: "Mei Chen — Japanese Comfort",
    price: "from $15",
    href: "/chef/mei-chen",
    dishes: ["/japenese_food/download.jpg", "/japenese_food/download (4).jpg", "/japenese_food/images (1).jpg"]
  },
];

const MenuBar = () => {
  return (
    <section className=" relative py-12 xl:py-24 bg-menu" id="menu">
      <div className="container mx-auto">
        <motion.div
          variants={fadeIn("left", 0.1)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: false, amount: 0.1 }}
          className=" max-w-[570px] mx-auto text-center xl:text-right"
        >
          <div>
            <h2 className="mb-3"> Featured Chefs</h2>
            <Link
              className="text-green flex justify-center items-center mb-16 xl:justify-end"
              href="/browse"
            >
              view all
              <IoIosArrowRoundForward className="text-3xl" />
            </Link>
          </div>
        </motion.div>
        <motion.div
          variants={fadeIn("up", 0.1)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: false, amount: 0.1 }}
          className="grid grid-cols-1 gap-[30px] md:grid-cols-3 md:gap-[15px] xl:grid-cols-4"
        >
          {menuBar.map((item, index) => {
            // 針對每個 item 計算隨機圖片；沒有 dishes 就用原本主圖
            const pool = item.dishes && item.dishes.length > 0 ? item.dishes : [item.img];
            const randomDish = pool[Math.floor(Math.random() * pool.length)];
            return (
              <div
                id="menu"
                key={index}
                className="max-w-[270px] bg-white shadow-2xl  mx-auto xl:mx-0 group"
              >
                <div className="overflow-hidden w-[270px] h-[270px] rounded-xl">
                  <Image
                    className="group-hover:scale-110 transition-all duration-300 object-cover w-full h-full"
                    src={randomDish}
                    width={270}
                    height={270}
                    alt="image"
                  />
                </div>
                <div className="pt-[20px] pb-[28px] px-[30px]">
                  <Link href={item.href}>
                    <h3 className=" font-poppins text-black mb-[14px]">
                      {item.title}
                    </h3>
                  </Link>
                  <div className="text-xl font-poppins font-semibold text-orange ">
                    {item.price}
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default MenuBar;
