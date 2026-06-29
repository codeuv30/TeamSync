import React from "react";
import { useDispatch, useSelector } from "react-redux";

const Home = () => {
  const dispatch = useDispatch();

  const theme = useSelector((state) => state.theme.mode);
  const dark = theme === "dark";

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: dark ? "#0F0D13" : "#e0e0e0" }}
    >
      <h1>This is my dashboard page</h1>
    </div>
  );
};

export default Home;
