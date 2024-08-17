import { handleError } from "@utils";
import nodemailer from 'nodemailer';

export const POST = async (request) => {
    const emailQuery = await request.json();
    const emailData = emailQuery.data;

    let campaigns = {
        data: [],
        subscribers: [],
        totalPages: 0,
    };

    const NODEMAILER_PASSWORD = process.env.NODEMAILER_PASSWORD;

    const credentials = {
       
    };

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: credentials.appEmail,
                pass: credentials.pass
            },
        })

        const sender = ''
        const replyToEmail = ''
        const receipient = ''

        const body = emailTemplate({
            emailType: emailData.emailType,
            // campaign: campaign.data,
            firstName: emailData.firstName,
            message: emailData.message,
            phoneNumber: emailData.phoneNumber,
            lastName: emailData.lastName,
        })

        const mail = await transporter.sendMail({
            from: sender,
            to: receipient,
            replyTo: replyToEmail,
            subject: emailData.subject,
            html: `${body}`,
        });

        return new Response(JSON.stringify({ mailData: mail, message: "Success: email was sent" }));
    } catch (error) {
        handleError(error);
        return new Response(JSON.stringify({ error: "Error: email not sent" }), { status: 500 });
    }
};