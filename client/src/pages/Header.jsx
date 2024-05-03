// Header.js
import Switch from "@mui/material/Switch";
import { FormControlLabel } from "@mui/material";
import logo from './../images/iais.png';
import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from "react";
import { Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Header = () => {
    const { t, i18n } = useTranslation();
    const [switchState, setSwitchState] = useState(false);


    useEffect(() => {
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage) {
            setSwitchState(savedLanguage === 'de'); // Set switch state based on saved language
            i18n.changeLanguage(savedLanguage); // Change the locale
        }
    }, []);

    const handleSwitchChange = (event) => {
        const newLocale = event.target.checked ? 'de' : 'en'; // Change locale based on switch state
        setSwitchState(event.target.checked);
        i18n.changeLanguage(newLocale); // Change the locale
        localStorage.setItem('language', newLocale); // Save selected language to local storage
    };

    return (
        <>
            <Link to="/" style={{ textDecoration: 'none' }}>
                <div className="position-absolute top-0 end-0 p-3" style={{ textAlign: 'right' }}>
                    <Image src={logo} className="w-50" />
                </div>
            </Link>
            <div className="position-absolute top-0 start-0 p-3">
                <FormControlLabel
                    control={<Switch checked={switchState} onChange={handleSwitchChange} />}
                    label={t("switchLabel")}
                />
            </div>
        </>
    );
};

export default Header;
