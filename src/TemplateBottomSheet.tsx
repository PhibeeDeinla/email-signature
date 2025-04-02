import { cn } from "./lib/utils";
import { motion } from "framer-motion";

interface Props {
  open: boolean;
  children?: React.ReactNode;
}

function TemplateBottomSheet({ open, children }: Props) {
  const variants = {
    hidden: { y: "100%", opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      id="change_template_sheet"
      className={cn(
        "absolute bottom-0 left-0 right-0 h-[80%] bg-white z-10 border-t border-slate-200"
      )}
      initial="hidden"
      animate={open ? "visible" : "hidden"}
      exit="hidden"
      variants={variants}
      transition={{ type: "tween", stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  );
}

export default TemplateBottomSheet;
