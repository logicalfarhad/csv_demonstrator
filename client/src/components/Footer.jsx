import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Footer = () => {
  const { t } = useTranslation();

  // Helper function to get current year
  const getCurrentYear = () => {
    return new Date().getFullYear();
  };

  return (
    <footer className="footer">
      <div className="container text-center">
        <div className="row">
          <div className="col">
            <p>
              <Link to="/imprint">{t("imprint")}</Link> |{" "}
              <Link to="/privacy-policy">{t("privacyPolicy")}</Link> |{" "}
              <Link to="/term-of-use">{t("termofUse")}</Link>
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <p>&copy;Fraunhofer IAIS {getCurrentYear()}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
