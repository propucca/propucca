import React, { FC } from "react";
import { Accordion, AccordionItem } from "@heroui/react";
import { useRouter } from "next/navigation";

interface IMenuItem {
  title: string;
  route?: string;
  subItems?: IMenuItem[];
  attrRef?: string; // Added attrRef for data-attribute
}

interface ISideMenus {
  menuItems: IMenuItem[];
  isOpen: boolean;
}

const SideMenus: FC<ISideMenus> = ({ menuItems, isOpen }) => {
  const Router = useRouter();

  const Navigate = (nav: string): void => {
    Router.push(nav);
  };

  return (
    <div className={isOpen ? "flex" : "hidden"}>
      <div>
        <div
          className="text-center p-3 cursor-pointer text-bold"
          onClick={(): void => {
            Navigate("/home");
          }}
        >
          Home
        </div>
        <Accordion variant="splitted" className="w-60 flex flex-col">
          {menuItems.map((item, index) => (
            <AccordionItem
              key={index}
              title={item.title}
              className="space-y-2 text-gray-400"
              hideIndicator={!item.subItems}
              disableAnimation={!item.subItems}
              data-attr={item.attrRef} // Added data-attribute for the menu
              onClick={() => {
                if (!item.subItems && item.route) {
                  Navigate(item.route);
                }
              }}
            >
              <>
                {item.subItems && (
                  <ul className="pl-4 space-y-2 text-gray-400 cursor-pointer">
                    {item.subItems.map((subItem, subIndex) => (
                      <li
                        className="text-black px-2 text-sm py-2 rounded transition-colors duration-200 hover:bg-primary hover:text-white cursor-pointer"
                        key={subIndex}
                        data-attr={subItem.attrRef}
                        onClick={() => {
                          if (subItem.route) {
                            Navigate(subItem.route);
                          }
                        }}
                      >
                        {subItem.title}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default SideMenus;
