// src/variants.ts
type Dir = "up" | "down" | "left" | "right";

export const fadeIn = (direction: Dir = "up", delay = 0) => {
  let x = 0, y = 0;
  if (direction === "left") x = 40;
  if (direction === "right") x = -40;
  if (direction === "up") y = 40;
  if (direction === "down") y = -40;

  return {
    hidden: { opacity: 0, x, y },
    show: {
      opacity: 1, x: 0, y: 0,
      transition: { type: "tween", ease: "easeOut", duration: 0.6, delay }
    }
  };
};
