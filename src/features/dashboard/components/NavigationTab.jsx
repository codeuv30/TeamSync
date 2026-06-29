import { NavLink } from "react-router";

const NavigationTab = ({ path, title, Icon, dark }) => {
  return (
    <NavLink
      key={path}
      to={path}
      end={"/"}
      className={({ isActive }) =>
        "w-full flex justify-start items-center space-x-2.5 py-2 pl-4 transition-colors"
      }
      style={({ isActive }) => ({
        opacity: isActive ? 1 : 0.8,
        background: isActive ? (dark ? "#241d31" : "#f3eefc") : "transparent",
        borderRight: isActive
          ? `3px solid ${dark ? "#76629d" : "#9b7bd4"}`
          : "3px solid transparent",
        color: isActive
          ? dark
            ? "#ccb2ff"
            : "#6d28d9"
          : dark
            ? "#f3f4f6"
            : "#1f2937",
      })}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = "1";
        e.currentTarget.style.background = dark ? "#241d31" : "#f3eefc";
        e.currentTarget.style.borderRight = `3px solid ${
          dark ? "#76629d" : "#9b7bd4"
        }`;
        e.currentTarget.style.color = dark ? "#ccb2ff" : "#6d28d9";
      }}
      onMouseLeave={(e) => {
        const isActive =
          e.currentTarget.getAttribute("aria-current") === "page";
        if (isActive) return;
        e.currentTarget.style.opacity = "0.8";
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.borderRight = "3px solid transparent";
        e.currentTarget.style.color = dark ? "#f3f4f6" : "#1f2937";
      }}
    >
      <Icon size={22} />
      <h3>{title}</h3>
    </NavLink>
  );
};

export default NavigationTab;
