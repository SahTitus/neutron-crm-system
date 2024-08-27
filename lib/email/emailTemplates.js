import { SITE_URL } from "@lib/routes";
import { emailStyles } from "@styles/styles";

export const emailTemplate = ({ firstName, lastName, company, image, emailBody, jobTitle }) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            }
            ${emailStyles}
        </style>
    </head>
    <body>
        <div class="container">
            ${emailBody}
            <div class="bottomInfo">
                <div style="display: flex; align-items: center;">
                    <div class="senderInfo">
                        <p>${firstName} ${lastName}</p>
                        <a href="${SITE_URL}" class="cta">Visit our Website</a>
                    </div>
                </div>
            </div>

           <div class="footer">
             <p>Powered by Neutron</p>
             <p class="custom-3d">Neutron</p>
             <img src="https://algogenz.com/_next/image?url=%2Ftitus.png&w=256&q=75" alt="Neutron">
                <p>&copy; 2024 Neutron. All rights reserved.</p>
                <p>1234 Fiapre, Sunyani, Ghana</p>
            </div>
        </div>
    </body>
    </html>
`;
}
