import { SwatchIcon } from "@heroicons/react/20/solid";
import { Tooltip } from "@/components";
import { Dropdown, DropdownProps } from "@/components/dropdown";
import { useHover } from "../hooks/useHover";

type ThemeDropdownProps<T extends string> = Omit<DropdownProps<T>, "button">;

const ThemeButton = () => {
  const { show, onHover, ref } = useHover();

  return (
    <>
      <div ref={ref}>
        <SwatchIcon
          className="w-5 h-auto text-secondary-4 hover:text-secondary-1 transition duration-300"
          onMouseEnter={() => onHover("in")}
          onMouseLeave={() => onHover("out")}
        />
      </div>
      <Tooltip
        description="Theme"
        show={show}
        targetElement={ref.current}
        position="bottom"
        className="w-fit whitespace-nowrap pt-1"
      />
    </>
  );
};

export const ThemeDropdown = <T extends string>(
  props: ThemeDropdownProps<T>,
) => <Dropdown {...props} button={<ThemeButton />} />;
