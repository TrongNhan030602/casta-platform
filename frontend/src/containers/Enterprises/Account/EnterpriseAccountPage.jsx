// src/containers/Enterprises/Account/EnterpriseAccountPage.jsx
import React from "react";
import ProfileInfoCard from "./components/ProfileInfoCard";
import ChangePasswordForm from "./components/ChangePasswordForm";
import EnterpriseViolationsCard from "./components/EnterpriseViolationsCard";
import LoginHistoryCard from "./components/LoginHistoryCard";
import MyFeedbacksCard from "./components/MyFeedbacksCard";
import "@/assets/styles/layout/enterprise/account/account-page.css";

const EnterpriseAccountPage = () => {
  return (
    <div className="enterprise-account">
      <h2 className="page-title">Tài khoản doanh nghiệp</h2>
      <div className="enterprise-account__grid">
        <ProfileInfoCard />
        <ChangePasswordForm />
        <EnterpriseViolationsCard />
        <LoginHistoryCard />
        <MyFeedbacksCard />
      </div>
    </div>
  );
};

export default EnterpriseAccountPage;
