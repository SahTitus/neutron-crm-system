import { connectDb } from "@db";
import Customer from "@db/models/customer.model";
import Lead from "@db/models/lead.model";
import Opportunity from "@db/models/opportunity.model";
import User from "@db/models/user.model";
import { emailTemplate } from "@lib/email/emailTemplates";
import { extractNameParts } from "@utils/helpers";
import { logger } from "@utils/helpers/log";
import nodemailer from 'nodemailer';

export const POST = async (request) => {
    const emailQuery = await request.json();

    const emailData = emailQuery.data;
    let emailBody = emailData.content;

    let receipientsEmails = [];

    // Regular expression to detect base64 images
    const base64ImageRegex = /<img[^>]+src="data:image\/([^;]+);base64,([^"]+)"[^>]*>/g;
    const images = [...emailBody.matchAll(base64ImageRegex)];

    // Array to hold attachments
    let attachments = [];

    if (images.length > 0) {
        images.forEach((image, index) => {
            const mimeType = image[1]; // Extract MIME type (e.g., 'png', 'jpeg')
            const base64Data = image[2]; // Extract base64 data

            // Create a unique cid (Content-ID) for each image
            const cid = `image${index + 1}@neutron`;

            // Add the image as an attachment with a cid
            attachments.push({
                filename: `${cid}.${mimeType}`,
                content: Buffer.from(base64Data, 'base64'),  // Correct conversion to Buffer
                contentType: `image/${mimeType}`,
                cid, // Content-ID to match the image src in the email body
            });

            // Replace the image source in the email body with a reference to the attachment
            emailBody = emailBody.replace(image[0], `<img src="cid:${cid}" alt="image" />`);
        });
    }

    try {
        await connectDb();
        const user = await User.find();
        if (!user) {
            throw new Error("Unauthorized access");
        }

        if (emailData.emailType === 'multiple') {
            const leads = await Lead.find();
            const opportunities = await Opportunity.find();
            const customers = await Customer.find();

            const receipientsData = [...customers, ...opportunities, leads];

            const uniqueEmails = receipientsData.filter((receipient, index, self) =>
                index === self.findIndex((u) => u.email === receipient.email));

            const filteredEmails = uniqueEmails.map(user => user.email);

            receipientsEmails.push(filteredEmails);
        } else {
            receipientsEmails.push(emailData.receipient);
        }

        // const NODEMAILER_PASSWORD = "zwgv dmku ylev jegf";
        const NODEMAILER_PASSWORD = process.env.NODEMAILER_PASSWORD;

        const credentials = {
            pass: NODEMAILER_PASSWORD,
            appEmail: process.env.APP_EMAIL,
        };

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: credentials.appEmail,
                pass: credentials.pass
            },
        })

        // Extract firstName, middleName and lastName from full name
        const { firstName, middleName, lastName } = extractNameParts(emailData.name);

        const body = emailTemplate({
            firstName: firstName,
            lastName: lastName,
            image: emailData.image,
            jobTitle: emailData.jobTitle,
            emailBody: emailBody,
            company: emailData.company,
        })


        const mail = await transporter.sendMail({
            from: user.email,
            from: `"${firstName} via Neutron" <${emailData.recepientEmail}>`,
            to: emailData.recepientEmail,
            replyTo: emailData.email,
            subject: emailData.subject,
            html: body,
            attachments
        });

        return new Response(JSON.stringify({ mailData: mail, message: "Success: email was sent" }));
    } catch (error) {
        logger(error.message);
        return new Response(JSON.stringify({ error: "Error: email not sent" }), { status: 500 });
    }
};