import { Bell, Search, Grip, X, Mail, Building2, ShieldCheck, Circle } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const formatDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const TopNav = () => {
  const employee = useSelector((state) => state.auth.employee);

  const theme = useSelector((state) => state.theme.mode);
  const dark = theme === "dark";

  const [displayNamePhoto, setDisplayNamePhoto] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchWrapperRef = useRef(null);

  const [showProfile, setShowProfile] = useState(false);
  const profileWrapperRef = useRef(null);

  useEffect(() => {
    if (!employee?.name) {
      setDisplayNamePhoto(null);
      return;
    }

    const [firstName, lastName] = employee.name.toUpperCase().split(" ");

    if (!lastName) {
      setDisplayNamePhoto(firstName.charAt(0));
      return;
    }

    setDisplayNamePhoto(firstName.charAt(0) + lastName.charAt(0));
  }, [employee]);

  // Close the suggestions dropdown when clicking outside the search area.
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
      if (profileWrapperRef.current && !profileWrapperRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close the profile popover on Escape.
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setShowProfile(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // TODO: wire this up to your actual search logic (API call, redux thunk, etc).
  // It should populate `suggestions` with whatever results come back, e.g.:
  //   const results = await searchSomething(value);
  //   setSuggestions(results);
  const handleSearch = (value) => {
    setSearchTerm(value);

    if (!value.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Placeholder hydration — replace with real results.
    setSuggestions([]);
    setShowSuggestions(true);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const isActive = employee?.status === "active";

  return (
    <div className="flex justify-between items-center gap-4 font-mono border-b border-gray-500/50 w-full px-4 py-2 bg-[#c7c7c7]" style={{ background: dark ? "#0F0D13" : "#e0e0e0" }}>
      {/* Search */}
      <div ref={searchWrapperRef} className="relative w-full max-w-85">
        <div className="relative">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: dark ? "#8b8593" : "#9ca3af" }}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => searchTerm.trim() && setShowSuggestions(true)}
            placeholder="Search…"
            className="w-full rounded-lg pl-9 pr-9 py-2 text-[13.5px] outline-none transition-colors focus:ring-2 focus:ring-violet-500/40"
            style={{
              background: dark ? "rgba(255,255,255,0.05)" : "#f3f4f6",
              border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "#e5e7eb"}`,
              color: dark ? "#f3f4f6" : "#111827",
            }}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: dark ? "#6b7280" : "#9ca3af" }}
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && (
          <div
            className="absolute left-0 right-0 mt-1.5 rounded-lg overflow-hidden shadow-lg z-50"
            style={{
              background: dark ? "#1d1927" : "#ffffff",
              border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "#e5e7eb"}`,
            }}
          >
            {suggestions.length > 0 ? (
              suggestions.map((item, i) => (
                <button
                  key={item.id ?? i}
                  type="button"
                  className="w-full text-left px-3.5 py-2.5 text-[13px] transition-colors"
                  style={{ color: dark ? "#e5e7eb" : "#374151" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = dark ? "rgba(255,255,255,0.06)" : "#f3eefc";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                  onClick={() => {
                    setSearchTerm(item.label ?? "");
                    setShowSuggestions(false);
                  }}
                >
                  {item.label ?? String(item)}
                </button>
              ))
            ) : (
              <p
                className="px-3.5 py-2.5 text-[13px]"
                style={{ color: dark ? "#6b7280" : "#9ca3af" }}
              >
                No results found.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Right side actions */}
      <div className="flex items-center space-x-3 flex-shrink-0">
        <button
          type="button"
          aria-label="Notifications"
          className="p-1.5 rounded-lg transition-colors"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = dark ? "rgba(255,255,255,0.06)" : "#f3f4f6";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          <Bell size={20} style={{ color: dark ? "#CBC4D2" : "#6b7280" }} />
        </button>

        <svg
          width="110"
          height="37"
          viewBox="0 0 137 46"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16.66 28.5L10.51 22.35C10.3433 22.1833 10.2183 22 10.135 21.8C10.0517 21.6 10.01 21.3917 10.01 21.175C10.01 20.9583 10.0517 20.75 10.135 20.55C10.2183 20.35 10.3433 20.1667 10.51 20L16.26 14.275L13.61 11.625L15.16 10L25.16 20C25.3267 20.1667 25.4475 20.35 25.5225 20.55C25.5975 20.75 25.635 20.9583 25.635 21.175C25.635 21.3917 25.5975 21.6 25.5225 21.8C25.4475 22 25.3267 22.1833 25.16 22.35L19.01 28.5C18.8433 28.6667 18.66 28.7917 18.46 28.875C18.26 28.9583 18.0517 29 17.835 29C17.6183 29 17.41 28.9583 17.21 28.875C17.01 28.7917 16.8267 28.6667 16.66 28.5ZM17.835 15.85L12.485 21.2H23.185L17.835 15.85ZM27.81 29C27.21 29 26.7017 28.7875 26.285 28.3625C25.8683 27.9375 25.66 27.4167 25.66 26.8C25.66 26.35 25.7725 25.925 25.9975 25.525C26.2225 25.125 26.4767 24.7333 26.76 24.35L27.81 23L28.91 24.35C29.1767 24.7333 29.4267 25.125 29.66 25.525C29.8933 25.925 30.01 26.35 30.01 26.8C30.01 27.4167 29.7933 27.9375 29.36 28.3625C28.9267 28.7875 28.41 29 27.81 29ZM33.16 34.275V32.4H54.86V34.275H33.16ZM68.01 30C66.4433 29.8 65.0433 29.4 63.81 28.8C62.5767 28.2 61.5308 27.4167 60.6725 26.45C59.8142 25.4833 59.16 24.3625 58.71 23.0875C58.26 21.8125 58.035 20.4 58.035 18.85C59.8683 19.0333 61.4183 19.3667 62.685 19.85C63.9517 20.3333 64.9808 21.0167 65.7725 21.9C66.5642 22.7833 67.135 23.8875 67.485 25.2125C67.835 26.5375 68.01 28.1333 68.01 30ZM68.01 21.575C67.6267 20.9917 67.1058 20.4167 66.4475 19.85C65.7892 19.2833 65.0267 18.7667 64.16 18.3C64.26 17.6 64.4267 16.875 64.66 16.125C64.8933 15.375 65.1767 14.6375 65.51 13.9125C65.8433 13.1875 66.2225 12.4917 66.6475 11.825C67.0725 11.1583 67.5267 10.55 68.01 10C68.4933 10.55 68.9475 11.1583 69.3725 11.825C69.7975 12.4917 70.1767 13.1875 70.51 13.9125C70.8433 14.6375 71.1267 15.375 71.36 16.125C71.5933 16.875 71.76 17.6 71.86 18.3C70.9933 18.75 70.2308 19.2583 69.5725 19.825C68.9142 20.3917 68.3933 20.975 68.01 21.575ZM70.01 29.6C69.9767 28.4333 69.8892 27.3542 69.7475 26.3625C69.6058 25.3708 69.385 24.4333 69.085 23.55C69.8683 22.2 70.9475 21.1 72.3225 20.25C73.6975 19.4 75.585 18.9333 77.985 18.85C78.0017 21.4833 77.2975 23.7542 75.8725 25.6625C74.4475 27.5708 72.4933 28.8833 70.01 29.6ZM82.735 32V14.925H95.96C97.51 14.925 98.8892 15.3333 100.098 16.15C101.306 16.9667 101.91 18.2333 101.91 19.95C101.91 21.7167 101.318 23.0042 100.135 23.8125C98.9517 24.6208 97.56 25.025 95.96 25.025H84.985V32H82.735ZM84.985 23.2H95.96C96.9933 23.2 97.8642 22.9333 98.5725 22.4C99.2808 21.8667 99.635 21.05 99.635 19.95C99.635 18.85 99.2767 18.0458 98.56 17.5375C97.8433 17.0292 96.9767 16.775 95.96 16.775H84.985V23.2ZM100.185 32L94.535 24.7L96.935 24.275L102.86 32H100.185ZM106.735 32V14.925H108.985V25.35L123.635 14.925H127.11L108.985 27.45V32H106.735ZM124.51 32L113.41 22.9L115.21 21.775L128.01 32H124.51Z"
            fill={dark ? "#CBC4D2" : "#374151"}
          />
        </svg>

        <button
          type="button"
          aria-label="More options"
          className="p-1.5 rounded-lg transition-colors"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = dark ? "rgba(255,255,255,0.06)" : "#f3f4f6";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          <Grip size={20} style={{ color: dark ? "#CBC4D2" : "#6b7280" }} />
        </button>

        {/* Avatar + profile popover */}
        {displayNamePhoto && (
          <div ref={profileWrapperRef} className="relative">
            <button
              type="button"
              onClick={() => setShowProfile((s) => !s)}
              aria-label="View profile"
              aria-expanded={showProfile}
              className="h-10 w-10 flex justify-center items-center rounded-full flex-shrink-0 transition-transform active:scale-95"
              style={{
                background: dark
                  ? "linear-gradient(135deg, #8b5cf6, #6d28d9)"
                  : "linear-gradient(135deg, #c4b5fd, #a78bfa)",
                outline: showProfile ? `2px solid ${dark ? "#a78bfa" : "#7c3aed"}` : "none",
                outlineOffset: "2px",
              }}
            >
              <h1 className="text-base font-semibold text-white">
                {displayNamePhoto}
              </h1>
            </button>

            {showProfile && (
              <div
                role="dialog"
                aria-label="User profile"
                className="absolute right-0 mt-2.5 w-72 rounded-xl shadow-xl overflow-hidden z-50"
                style={{
                  background: dark ? "#1d1927" : "#ffffff",
                  border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "#e5e7eb"}`,
                }}
              >
                {/* Header */}
                <div
                  className="px-4 pt-4 pb-3.5 flex items-center gap-3"
                  style={{
                    borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "#f3f4f6"}`,
                  }}
                >
                  <div
                    className="h-11 w-11 flex justify-center items-center rounded-full flex-shrink-0"
                    style={{
                      background: dark
                        ? "linear-gradient(135deg, #8b5cf6, #6d28d9)"
                        : "linear-gradient(135deg, #c4b5fd, #a78bfa)",
                    }}
                  >
                    <span className="text-[15px] font-semibold text-white">
                      {displayNamePhoto}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p
                      className="text-[14px] font-semibold capitalize truncate"
                      style={{ color: dark ? "#f3f4f6" : "#111827" }}
                    >
                      {employee?.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Circle
                        size={7}
                        fill={isActive ? "#10b981" : "#9ca3af"}
                        color={isActive ? "#10b981" : "#9ca3af"}
                      />
                      <span
                        className="text-[11.5px] capitalize"
                        style={{ color: dark ? "#9ca3af" : "#6b7280" }}
                      >
                        {employee?.status || "unknown"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="px-4 py-3.5 space-y-2.5">
                  <div className="flex items-center gap-2.5 text-[13px]">
                    <Mail size={15} style={{ color: dark ? "#8b8593" : "#9ca3af" }} />
                    <span
                      className="truncate"
                      style={{ color: dark ? "#e5e7eb" : "#374151" }}
                    >
                      {employee?.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[13px]">
                    <Building2 size={15} style={{ color: dark ? "#8b8593" : "#9ca3af" }} />
                    <span
                      className="capitalize"
                      style={{ color: dark ? "#e5e7eb" : "#374151" }}
                    >
                      {employee?.department || "—"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[13px]">
                    <ShieldCheck size={15} style={{ color: dark ? "#8b8593" : "#9ca3af" }} />
                    <span
                      className="capitalize"
                      style={{ color: dark ? "#e5e7eb" : "#374151" }}
                    >
                      {employee?.role || "—"}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div
                  className="px-4 py-2.5 text-[11px] flex justify-between"
                  style={{
                    background: dark ? "rgba(255,255,255,0.03)" : "#f9fafb",
                    color: dark ? "#6b7280" : "#9ca3af",
                    borderTop: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "#f3f4f6"}`,
                  }}
                >
                  <span>Joined {formatDate(employee?.createdAt)}</span>
                  <span>Updated {formatDate(employee?.updatedAt)}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopNav;