import * as Dialog from "@radix-ui/react-dialog";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  transform,
} from "framer-motion";
import { useState, useRef, useEffect } from "react";

const fast = { type: "spring", stiffness: 2000, damping: 120 };

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const opacity = useMotionValue();
  const panel = useRef();

  const handleUpdate = (latest) => {
    if (typeof latest.y === "string") return;
    const { height } = panel.current.getBoundingClientRect();
    const progress = transform(latest.y, [0, height], [1, 0]);
    opacity.set(progress);
  };

  const handleDragEnd = (_, info) => {
    const { velocity, offset } = info;
    const { height } = panel.current.getBoundingClientRect();
    const shouldClose = velocity.y > 20 || offset.y > height / 2;
    if (shouldClose) setIsOpen(false);
  };

  useEffect(() => {
    const themeTag = document.querySelector("meta[name=theme-color]");
    return opacity.onChange((v) => {
      const color = transform(v, [0, 1], ["#fff", "#a6a6a6"]);
      themeTag.setAttribute("content", color);
    });
  }, [opacity]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>Delete account</Dialog.Trigger>
      <Dialog.Portal forceMount>
        <AnimatePresence>
          {isOpen && (
            <>
              <Dialog.Overlay asChild forceMount>
                <motion.div
                  className="overlay"
                  style={{ opacity }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div
                  ref={panel}
                  className="content"
                  transition={fast}
                  style={{ x: "-50%" }}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "120%" }}
                  onDragEnd={handleDragEnd}
                  onUpdate={handleUpdate}
                  dragElastic={0.05}
                  dragConstraints={{ top: 0 }}
                  drag="y"
                >
                  <Dialog.Title>Are you absolutely sure?</Dialog.Title>
                  <Dialog.Description>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </Dialog.Description>
                  <Dialog.Close className="warning">
                    Yes, delete account
                  </Dialog.Close>
                  <Dialog.Close>Cancel</Dialog.Close>
                </motion.div>
              </Dialog.Content>
            </>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default App;
