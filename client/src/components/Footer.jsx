import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import '../style/Footer.css';  // Import the CSS file for Footer styles

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer-content">
        <span className="footer-copy">
          &copy; KI.NRW {new Date().getFullYear()}
        </span>
        <span className="footer-links">
          <Link to="/imprint">{t("imprint")}</Link> |{" "}
          <Link to="/privacy-policy">{t("privacyPolicy")}</Link> |{" "}
          <Link to="/term-of-use">{t("termofUse")}</Link>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
