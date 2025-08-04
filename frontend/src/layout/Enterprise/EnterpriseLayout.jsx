// src/layout/Enterprise/EnterpriseLayout.jsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./EnterpriseHeader";
import Sidebar from "./EnterpriseSidebar";
import Footer from "./EnterpriseFooter";

import "@/assets/styles/layout/enterprise/enterprise-layout.css";

const EnterpriseLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`enterprise-layout ${collapsed ? "collapsed" : ""}`}>
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <div className="enterprise-layout__main">
        <Header />
        <main className="enterprise-layout__content">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default EnterpriseLayout;
