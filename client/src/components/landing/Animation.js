import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";


function AnimationReveal({ disabled, children }) {
  if (disabled) {
    return <>{children}</>;
  }

  if (!Array.isArray(children)) children = [children];

  const directions = ["left", "right"];
  const childrenWithAnimation = children.map((child, i) => {
    return (
      <AnimatedSlideInComponent
        key={i}
        direction={directions[i % directions.length]}
      >
        {child}
      </AnimatedSlideInComponent>
    );
  });

  return <>{childrenWithAnimation}</>;
}

function AnimatedSlideInComponent({ direction = "left", offset = 30, children }) {
  // react-intersection-observer
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
    rootMargin: `${offset}px 0px`,
  });

  const x = { target: "0%" };
  x.initial = direction === "left" ? "-150%" : "150%";

  return (
    <motion.section
      initial={{ x: x.initial }}
      animate={{
        x: inView ? x.target : x.initial,
        transitionEnd: {
          x: inView ? 0 : x.initial,
        }
      }}
      transition={{ type: "spring", damping: 19 }}
      ref={ref}
    >
      {children}
    </motion.section>
  );
}

const AnimationWrapper = (props) => (
    <AnimationReveal {...props} />
);


export default AnimationWrapper;