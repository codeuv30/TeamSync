import { Moon, Sun } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toogleTheme } from "../../src/shared/state/themeSlice";

const ChangeTheme = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.mode);

  return (
    <button
      onClick={() => dispatch(toogleTheme())}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="
        fixed
        bottom-6
        right-6
        z-9999

        flex
        h-10
        w-10
        items-center
        justify-center

        rounded-full
        border
        border-white/10

        bg-zinc-900
        text-yellow-400
        shadow-xl

        transition-all
        duration-300
        hover:scale-110
        hover:rotate-12
        active:scale-95

        dark:bg-zinc-800
      "
    >
      <div className="relative h-6 w-6 overflow-hidden flex items-center justify-center">
        <Sun
          size={24}
          className={`absolute transition-all duration-300 ${
            theme === "light"
              ? "rotate-0 scale-100 opacity-100"
              : "rotate-90 scale-0 opacity-0"
          }`}
        />

        <Moon
          size={24}
          className={`absolute transition-all duration-300 ${
            theme === "dark"
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-0 opacity-0"
          }`}
        />
      </div>
    </button>
  );
};

export default ChangeTheme;
