import { useState, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";
import "@/assets/styles/common/user-dropdown.css";
import useClickOutside from "@/hooks/useClickOutside";
const UserDropdown = ({ username = "Tài khoản", items = [] }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setOpen((prev) => !prev);
  useClickOutside(dropdownRef, () => setOpen(false));

  const handleItemClick = (action) => {
    if (typeof action === "function") {
      action();
    }
    setOpen(false);
  };

  return (
    <div
      className="user-dropdown"
      ref={dropdownRef}
    >
      <button
        className="user-dropdown__btn"
        onClick={toggleDropdown}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <FaUserCircle size={22} />
        <span className="user-dropdown__username">{username}</span>
      </button>

      {open && (
        <ul
          className="user-dropdown__menu"
          role="menu"
        >
          {items.map((item, index) => (
            <li
              key={index}
              role="menuitem"
              onClick={() => handleItemClick(item.onClick)}
              className={item.danger ? "danger" : ""}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserDropdown;
