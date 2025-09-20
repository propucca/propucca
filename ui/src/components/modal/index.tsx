import React, { FC, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@heroui/react";

interface IModalDialog {
  modalOpen: boolean;
  title: string;
  size?:
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "xs"
    | "3xl"
    | "4xl"
    | "5xl"
    | "full"
    | undefined;
  closeCallBack: () => void;
  children: React.ReactNode;
}

const ModalDialog: FC<IModalDialog> = ({
  modalOpen,
  closeCallBack,
  size = "md",
  title,
  children,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    if (modalOpen === true) {
      onOpen();
    }
  }, [modalOpen]);

  useEffect(() => {
    if (isOpen === false) {
      closeCallBack();
    }
  }, [isOpen]);

  return (
    <Modal isOpen={modalOpen} onOpenChange={onOpenChange} size={size}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>{children}</ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalDialog;
