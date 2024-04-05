import React from "react";
import BotResponse from "./BotResponse";
import { useTranslation } from "react-i18next";
const IntroSection = () => {
  const { t, i18n } = useTranslation();


  return (
    <div id="introsection" className="">
      <h4>
        {t("welcomeLabel")} <br />
        <BotResponse response={t("menu3_summary")} />
      </h4>
      {/* <h2>
      </h2>
      Features:
      <ul>
        <li>Deep learning technology to generate SQL from natural language.</li>
      </ul>

      Steps to follow :
      <ul>
        <li>Click "Upload CSV" from side menu.</li>
        <li>Upload valid CSV dump file.</li>
        <li>Start typing your query in Natural language</li>
        <li>A valid sql query will be generated which will run against the CSV you uploaded.</li>
        <li>"Show Query response" button will show the results from the CSV.</li>
        <li>"Show Visualization" button will show the different charts based on the response from CSV.</li>
      </ul> */}
    </div>
  );
};

export default IntroSection;
