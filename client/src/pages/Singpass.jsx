import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import axios from 'axios'; // You'll need to install axios for making HTTP requests

function Singpass() {
    // State variables
    const [scrollToAppForm, setScrollToAppForm] = useState(false);
    const [authApiUrl, setAuthApiUrl] = useState('');
    const [clientId, setClientId] = useState('');
    const [redirectUrl, setRedirectUrl] = useState('');
    const [purposeId, setPurposeId] = useState('');
    const [scope, setScope] = useState('');
    const [method, setMethod] = useState('S256');
    const [securityEnable, setSecurityEnable] = useState('');
    const [clientAssertionType, setClientAssertionType] = useState('urn:ietf:params:oauth:client-assertion-type:jwt-bearer');

    // Window onload effect
    useEffect(() => {
        // AJAX call to get the demo app info from config
        $.ajax({
            url: "/getEnv",
            data: {},
            type: "GET",
            success: function (result) {
                setClientId(result.clientId);
                setRedirectUrl(result.redirectUrl);
                setScope(result.scope);
                setPurposeId(result.purpose_id);
                setAuthApiUrl(result.authApiUrl);
                setSecurityEnable(result.environment);
            },
            error: function (result) {
                alert("ERROR:" + JSON.stringify(result.responseJSON.error));
            }
        });
    }, []); // Empty dependency array ensures this effect runs only once

    // Main form submission handler
    const handleFormSubmit = (event) => {
        event.preventDefault();
        callAuthorizeApi();
    };

    // Auth API call function
    const callAuthorizeApi = () => {
        // Call backend server to generate code challenge
        $.ajax({
            url: "/generateCodeChallenge",
            data: {},
            type: "POST",
            success: function (result) {
                // Redirect to authorize URL after generating code challenge
                const authorizeUrl = `${authApiUrl}?client_id=${clientId}&scope=${scope}&purpose_id=${purposeId}&code_challenge=${result}&code_challenge_method=${method}&redirect_uri=${redirectUrl}`;
                window.location = authorizeUrl;
            },
            error: function (result) {
                alert("ERROR:" + JSON.stringify(result.responseJSON.error));
            }
        });
    };

    // Callback handler for auth code
    useEffect(() => {
        if (window.location.href.indexOf("callback?code") > -1) {
            setScrollToAppForm(true);
            callServerAPIs(); // Call backend server APIs
        } else if (window.location.href.indexOf("callback") > -1) {
            setScrollToAppForm(true);
            alert("ERROR:" + JSON.stringify("Missing Auth Code"));
        }
    }, []); // Empty dependency array ensures this effect runs only once

    // Call server APIs function
    const callServerAPIs = () => {
        const authCode = new URLSearchParams(window.location.search).get('code');
        $.ajax({
            url: "/getPersonData",
            data: {
                authCode: authCode,
                codeVerifier: window.sessionStorage.getItem("codeVerifier")
            },
            type: "POST",
            success: function (result) {
                prefillForm(result);
            },
            error: function (result) {
                alert("ERROR:" + JSON.stringify(result.responseJSON.error));
            }
        });
    };

    // Prefill form with MyInfo data
    const prefillForm = (data) => {
        let noaData = "";
        let address = "";
        if (data["noa-basic"]) {
            noaData = str(data["noa-basic"].amount) ? formatMoney(str(data["noa-basic"].amount), 2, ".", ",") : "";
        }
        if (data.regadd.type == "SG") {
            address = str(data.regadd.country) == "" ? "" :
                `${str(data.regadd.block)} ${str(data.regadd.building)} \n#${str(data.regadd.floor)}-${str(data.regadd.unit)} ${str(data.regadd.street)} \nSingapore ${str(data.regadd.postal)}`;
        } else if (data.regadd.type == "Unformatted") {
            address = `${str(data.regadd.line1)}\n${str(data.regadd.line2)}`;
        }
        const formValues = {
            "uinfin": str(data.uinfin),
            "name": str(data.name),
            "sex": str(data.sex),
            "race": str(data.race),
            "nationality": str(data.nationality),
            "dob": str(data.dob),
            "email": str(data.email),
            "mobileno": `${str(data.mobileno.prefix)} ${str(data.mobileno.areacode)} ${str(data.mobileno.nbr)}`,
            "regadd": address,
            // Add other form fields here
        };
        populate('#formApplication', formValues);
    };


    // const str = (data) => {
    //     // Implement str function logic
    // };

    // const populate = (frm, data) => {
    //     // Implement populate function logic
    // };
    
    return (
        <Box>
            <Typography variant="h5">Sample Application </Typography>
            <Button variant="contained" color="primary">
            click here
            </Button>
        </Box>
    );
}

export default Singpass;