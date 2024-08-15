import React, { useState, useEffect } from "react";
import Switch from "@mui/material/Switch";
import { FormControlLabel } from "@mui/material";
import { useTranslation } from "react-i18next";

const Header = () => {
    const { t, i18n } = useTranslation();
    const [switchState, setSwitchState] = useState(false); // default unchecked (DE)

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language');
        // If there's a saved language, use it; otherwise default to 'de'
        const defaultLanguage = savedLanguage || 'de';
        const isGerman = defaultLanguage === 'de';
        
        setSwitchState(!isGerman); // Switch is checked for EN and unchecked for DE
        i18n.changeLanguage(defaultLanguage).catch(err => {
            console.error("Failed to change language:", err);
        });

        if (!savedLanguage) {
            // If no language was stored, set it to 'de' in localStorage
            localStorage.setItem('language', 'de');
        }
    }, [i18n]);

    const handleSwitchChange = (event) => {
        const newLocale = event.target.checked ? 'en' : 'de';
        setSwitchState(event.target.checked);
        i18n.changeLanguage(newLocale).catch(err => {
            console.error("Failed to change language:", err);
        });
        localStorage.setItem('language', newLocale);
    };

    return (
        <div className="position-absolute top-0 start-0 p-3">
            <FormControlLabel
                control={<Switch checked={switchState} onChange={handleSwitchChange} />}
                label={t("switchLabel")}
            />
        </div>
    );
};

export default Header;
