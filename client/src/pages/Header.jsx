import React, { useState, useEffect } from "react";
import Switch from "@mui/material/Switch";
import { FormControlLabel } from "@mui/material";
import { useTranslation } from "react-i18next";

const Header = () => {
    const { t, i18n } = useTranslation();
    const [switchState, setSwitchState] = useState(false);

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage) {
            const isGerman = savedLanguage === 'de';
            setSwitchState(isGerman);
            i18n.changeLanguage(savedLanguage).catch(err => {
                console.error("Failed to change language:", err);
            });
        }
    }, []); // Empty dependency array ensures this runs only on mount

    const handleSwitchChange = (event) => {
        const newLocale = event.target.checked ? 'de' : 'en';
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
