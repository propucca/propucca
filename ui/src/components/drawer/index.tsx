import React, { FC } from "react";
import { Drawer as HeroDrawer, DrawerContent, DrawerBody } from "@heroui/react";

interface IDrawer {
  open: boolean;
  heading: string;
  handleClose: () => void;
  size?:
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "full";
  placement?: "top" | "right" | "bottom" | "left";
  children: React.ReactNode;
}

const Drawer: FC<IDrawer> = ({
  open,
  handleClose,
  size = "md",
  placement = "right",
  children,
}) => {
  return (
    <HeroDrawer
      isOpen={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose();
      }}
      placement={placement}
      size={size}
      motionProps={{
        variants: {
          enter: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.1 },
          },
          exit: {
            x: 100,
            opacity: 0,
            transition: { duration: 0.3 },
          },
        },
      }}
    >
      <DrawerContent>
        {
          <>
            {/* <DrawerHeader className="flex justify-between items-center">
              <span className="font-bold text-lg">{heading}</span>
            </DrawerHeader> */}
            <DrawerBody className="p-5">{children}</DrawerBody>
          </>
        }
      </DrawerContent>
    </HeroDrawer>
  );
};

export default Drawer;
