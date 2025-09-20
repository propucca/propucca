// import { ENDPOINTS } from "@/api_config";
import { postCall } from "@/api_services";
import { IGallery } from "@/utils/constants/interfaces";
import { useMutation } from "@tanstack/react-query";
import React, { FC, useEffect, useState } from "react";
import { errorMessage } from "../alert";
import { Button, ButtonGroup, Image } from "@heroui/react";

// @ts-ignore
import UilArrowRight from "@iconscout/react-unicons/icons/uil-arrow-right";
// @ts-ignore
import UilAi from "@iconscout/react-unicons/icons/uil-robot";
import ModalDialog from "../modal";

import { CONFIG } from "@/config";

interface IGalleryComponent {
  buttonLabel: string;
  onSelection: (selected: IGallery) => void;
  selected: IGallery | null;
}

const Gallery: FC<IGalleryComponent> = ({
  buttonLabel,
  onSelection,
  selected,
}) => {
  const [page, setPage] = useState<number>(0);
  const [limit] = useState<number>(12);
  const [imageList, setImageList] = useState<IGallery[]>([]);

  const [isModelOpen, setModalOpen] = useState<boolean>(false);

  const [pageSize, setPageSize] = useState<number>(0);

  const galleryListMutation = useMutation({
    mutationFn: () =>
      postCall<IGallery[]>("", {
        find: {},
        pagination: true,
        paginationDetails: {
          limit,
          page,
        },
        search: [],
        sort: {
          modified_on: -1,
        },
      }),
    onSuccess: (data) => {
      if (data && data.success === 1) {
        setImageList(data.data);
        if (data.count < limit) {
          setPageSize(1);
        } else {
          setPageSize(
            data.count % limit === 0
              ? Number((data.count / limit).toFixed())
              : parseInt((data.count / limit).toString()) + 1,
          );
        }
      }
    },
    onError: () => {
      errorMessage("Gallery Fetch failed!.");
    },
  });

  useEffect(() => {
    galleryListMutation.mutate();
  }, [page]);

  const closeCallBack = (): void => {
    setModalOpen(false);
  };

  return (
    <div>
      <Button
        color="primary"
        onClick={() => {
          setModalOpen(true);
        }}
      >
        {buttonLabel}
      </Button>
      <ModalDialog
        size="full"
        modalOpen={isModelOpen}
        closeCallBack={closeCallBack}
        title="Gallery"
      >
        <div>
          <div className="h-[calc(100vh-160px)]">
            <div className="flex justify-center gap-3 mt-5">
              <ButtonGroup>
                <Button
                  isIconOnly
                  color="primary"
                  radius="full"
                  isDisabled={page === 0}
                  onClick={(): void => {
                    setPage(page - 1);
                  }}
                ></Button>
                <Button
                  isIconOnly
                  color="primary"
                  radius="full"
                  isDisabled={page + 1 === pageSize}
                  onClick={(): void => {
                    setPage(page + 1);
                  }}
                >
                  <UilArrowRight />
                </Button>
              </ButtonGroup>
              <div>{`${page + 1} of ${pageSize}`}</div>
            </div>
            <div className="flex flex-wrap justify-center mt-1 p-1 border-3 border-black">
              {imageList.map((gallery: IGallery, index: number) => {
                return (
                  <div
                    className="relative"
                    key={index}
                    onClick={(): void => {
                      onSelection(gallery);
                      setModalOpen(false);
                    }}
                  >
                    {gallery.is_generated && (
                      <div className="absolute bottom-0 right-0 z-10 text-white bg-primary rounded-lg p-1 opacity-50">
                        <UilAi />
                      </div>
                    )}
                    <Image
                      width={250}
                      className={
                        "z-0" +
                        (selected?.path === gallery.path
                          ? " border-3 border-primary"
                          : "")
                      }
                      isZoomed
                      radius="none"
                      shadow="md"
                      height={250}
                      src={`${CONFIG["ASSETS_PREFIX"]}/${gallery.path}`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </ModalDialog>
    </div>
  );
};

export default Gallery;
