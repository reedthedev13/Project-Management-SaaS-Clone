import React, { ReactNode } from "react";
import { motion, Variants } from "framer-motion";

interface AnimatedWrapperProps {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  initial?: string;
  animate?: string;
  exit?: string;
  transition?: object;
}

const defaultVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const defaultTransition = {
  type: "tween",
  ease: "easeOut",
  duration: 0.4,
};

const AnimatedWrapper: React.FC<AnimatedWrapperProps> = ({
  children,
  className,
  variants = defaultVariants,
  initial = "initial",
  animate = "animate",
  exit = "exit",
  transition = defaultTransition,
}) => {
  return (
    <motion.div
      className={className}
      initial={initial}
      animate={animate}
      exit={exit}
      variants={variants}
      transition={transition}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedWrapper;
