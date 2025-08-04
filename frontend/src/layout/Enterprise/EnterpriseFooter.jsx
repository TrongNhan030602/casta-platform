// src/layout/Enterprise/EnterpriseFooter.jsx
import React from "react";
import "@/assets/styles/layout/enterprise/enterprise-footer.css";

const EnterpriseFooter = () => {
  return (
    <footer className="enterprise-footer">
      <div className="enterprise-footer__content">
        © {new Date().getFullYear()} CASTA. Giao diện doanh nghiệp.
      </div>
    </footer>
  );
};

export default EnterpriseFooter;
