import React, { Fragment } from "react";
import clsx from "clsx";
import { Menu, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { Text } from "@waitingonalice/design-system/components/text";
import { Option } from "@/utils/types";

export interface DropdownProps<T extends string> {
  button: React.ReactNode;
  options: Option[];
  onSelect?: (value: T) => void;
  selectedValue?: string;
  menuClassName?: string;
  theme?: "light" | "dark";
}
export const Dropdown = <T extends string>({
  button,
  options,
  onSelect,
  selectedValue,
  menuClassName,
  theme = "light",
}: DropdownProps<T>) => {
  const handleSelect = (
    e:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.KeyboardEvent<HTMLDivElement>,
    value: T,
  ) => {
    e.stopPropagation();
    if (onSelect) onSelect(value);
  };
  return (
    <Menu as="div" className="relative">
      <Menu.Button className="items-center flex transition duration-100 ease-out">
        {typeof button === "string" ? (
          <Text type="body-bold" className="text-secondary-5">
            {button}
          </Text>
        ) : (
          button
        )}
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-50"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-50"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={clsx(
            "absolute z-10 mt-2 rounded-md border border-secondary-3 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none max-h-80 overflow-y-auto p-1 min-w-max flex flex-col",
            menuClassName,
            theme === "light" ? "bg-secondary-1" : "bg-secondary-5",
          )}
        >
          {options?.map(({ label, value, renderLabel }) => (
            <Menu.Item key={value}>
              <div
                role="button"
                tabIndex={0}
                className={clsx(
                  "rounded-md p-2 hover:text-secondary-1 hover:bg-primary-main text-primary-main",
                  !renderLabel &&
                    "min-w-[200px] flex justify-between items-center gap-x-4",
                )}
                onClick={(e) => handleSelect(e, value as T)}
                onKeyDown={(e) => handleSelect(e, value as T)}
              >
                {renderLabel ? (
                  renderLabel(label)
                ) : (
                  <Text type="body-bold">{label}</Text>
                )}
                {selectedValue && value === selectedValue && (
                  <CheckIcon className="h-4 w-4" />
                )}
              </div>
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
