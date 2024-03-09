/* eslint-disable react/no-array-index-key */
import { Fragment, useState } from "react";
import clsx from "clsx";
import { Menu, Transition } from "@headlessui/react";
import {
  ArrowRightOnRectangleIcon,
  Cog8ToothIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { UserIcon } from "@heroicons/react/24/outline";
import { Button } from "@waitingonalice/design-system/components/button";
import { Text } from "@waitingonalice/design-system/components/text";
import { Modal } from "@/components";
import { useAppContext } from "@/components/app-context";
import { clientRoutes } from "@/constants";

interface TopbarProps {
  leftChildren?: React.ReactNode;
  rightChildren?: React.ReactNode;
  onBackClick?: () => void;
  className?: string;
  title?: string;
}

const Topbar = ({
  className,
  onBackClick,
  title,
  leftChildren,
  rightChildren,
}: TopbarProps) => {
  const [open, setOpen] = useState(false);
  const { user } = useAppContext();

  const fullName = `${user?.firstName} ${user?.lastName}`;
  const handleSignout = () => {
    window.location.replace(clientRoutes.auth.logout);
  };
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const navigation = [
    {
      href: clientRoutes.profile.index,
      name: "Profile",
    },
    {
      name: "Sign out",
      onClick: handleOpen,
    },
  ];

  return (
    <>
      <Modal
        onClose={handleClose}
        open={open}
        buttons={[
          {
            variant: "secondary",
            children: "Cancel",
            onClick: handleClose,
          },
          {
            children: "Sign out",
            onClick: handleSignout,
          },
        ]}
        title="Are you sure you want to sign out?"
      />
      <nav
        className={clsx(
          "sticky top-0 px-4 py-3 border-b bg-secondary-5 border-gray-400 flex items-center z-30 gap-x-4 w-full justify-between",
        )}
      >
        <span className="flex items-center">
          {(title || onBackClick) && (
            <span className="flex gap-x-4">
              {onBackClick && (
                <>
                  <Button variant="primaryLink" onClick={onBackClick}>
                    <XMarkIcon className="h-5 w-auto text-primary-main" />
                  </Button>
                  <div className="border-l border-gray-400 h-6" />
                </>
              )}
              {title && (
                <Text
                  type="subhead-2-bold"
                  className="text-secondary-4 whitespace-nowrap"
                >
                  {title}
                </Text>
              )}
            </span>
          )}
          <div className={clsx("flex gap-x-4 ml-16 items-center", className)}>
            {leftChildren}
          </div>
        </span>

        <div className="relative items-center flex transition duration-100 ease-out gap-x-4">
          {rightChildren}
          <Menu as="div">
            <Menu.Button className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary-dark flex items-center">
              <Cog8ToothIcon className="h-5 w-auto text-primary-main" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-150"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-150"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 z-10 min-w-[200px] w-fit rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none p-1">
                {navigation.map(({ href, name, onClick }) => (
                  <Menu.Item key={name}>
                    {href ? (
                      <a
                        href={href}
                        className={clsx(
                          "rounded-md min-w-[200px] flex p-2 truncate items-center gap-x-2 hover:text-secondary-1 hover:bg-primary-main text-primary-main",
                        )}
                      >
                        <UserIcon className="h-5 w-auto" />
                        <Text type="body-bold">{name}</Text>
                      </a>
                    ) : (
                      <>
                        <div
                          className={clsx(
                            "rounded-md min-w-[200px] flex p-2 truncate items-center gap-x-2 hover:text-secondary-1 hover:bg-primary-main text-primary-main",
                          )}
                          role="button"
                          tabIndex={0}
                          aria-hidden="true"
                          onClick={onClick}
                        >
                          <ArrowRightOnRectangleIcon className="h-5 w-auto" />
                          <Text type="body-bold">Sign out</Text>
                        </div>
                        {user && (
                          <div className="mx-4 my-2 text-secondary-5">
                            <Text type="body" className="pt-2 border-t">
                              {fullName.toUpperCase()}
                            </Text>
                            <Text type="caption-bold">{user.email}</Text>
                          </div>
                        )}
                      </>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </nav>
    </>
  );
};

export default Topbar;
