import React from "react";
import "@/assets/styles/layout/admin/admin-footer.css";

const Footer = () => {
  return (
    <footer className="admin-footer">
      <div className="admin-footer__content">
        © {new Date().getFullYear()} CASTA Platform. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
