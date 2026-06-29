import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toogleTheme } from "../../shared/state/themeSlice";

export const HandleChangeTheme = ({ children }) => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.mode);

  useEffect(() => {
    document.body.classList.remove("dark", "light");
    document.body.classList.add(theme);
  }, [theme]);

  return React.cloneElement(children, {
    onClick: () => {
      dispatch(toogleTheme());
    },
  });
};
