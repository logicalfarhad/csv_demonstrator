import React from "react";
import { useTranslation } from "react-i18next";
const Footer = () => {
  const { t, i18n } = useTranslation();

  return (
    <footer className="footer">
      <div className="container text-center">
        <div className="row">
          <div className="col">
            <p>{t("imprint")} | {t("privacyPolicy")} | {t("termofUse")} </p>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <p>&copy;Fraunhofer IAIS {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
