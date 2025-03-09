import type { HTMLMotionProps, Transition, Variants } from "framer-motion";
import { motion } from "framer-motion";

// Re-export framer-motion
export { motion, AnimatePresence } from "framer-motion";

// Animation Presets
export const presets = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  scale: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 },
  },
  // Add more presets as needed
} as const;

// Transition Presets
export const transitions = {
  spring: {
    type: "spring" as const,
    stiffness: 400,
    damping: 30,
  },
  smooth: {
    type: "tween" as const,
    duration: 0.2,
  },
  bounce: {
    type: "spring" as const,
    stiffness: 300,
    damping: 10,
  },
} satisfies Record<string, Transition>;

// Direct transition export for convenience
export const smoothTransition = transitions.smooth;

// Existing variants
export const containerVariants: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const cardVariants: Variants = {
  initial: { scale: 0.9, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: transitions.spring,
  },
  exit: {
    scale: 0.9,
    opacity: 0,
    transition: { duration: 0.15 },
  },
};

export const filterToggleVariants: Variants = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.95, opacity: 0 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

export const slideInVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const fadeInVariants: Variants = presets.fadeIn;

// Preset Components
interface AnimatedProps extends HTMLMotionProps<"div"> {
  preset?: keyof typeof presets;
  transitionPreset?: keyof typeof transitions;
}

export const Animated = ({
  preset = "fadeIn",
  transitionPreset = "smooth",
  transition,
  ...props
}: AnimatedProps) => {
  return (
    <motion.div
      {...presets[preset]}
      transition={transition ?? transitions[transitionPreset]}
      {...props}
    />
  );
};

// Example usage in apps:
// import { Animated, transitions, presets } from "@acme/ui/animations";
//
// <Animated preset="slideUp" transition="spring">
//   Content
// </Animated>
