// import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
// import { NextResponse } from "next/server";

// const sendFileByMail = async (email: string, emailTemplate: string, subject: string) => {
//     const mailerSendApiKey = process.env.MAILERSEND_API_KEY;
//     const mailerSendFromEmail = process.env.MAILERSEND_FROM_EMAIL;

//     if (!mailerSendApiKey || !mailerSendFromEmail) {
//         throw new Error("MailerSend API key or sender email is not configured.");
//     }

//     const mailerSend = new MailerSend({ apiKey: mailerSendApiKey });

//     const emailParams = new EmailParams()
//         .setFrom(new Sender(mailerSendFromEmail, 'Jaypee Associates'))
//         .setTo([new Recipient(email, 'Recipient')])
//         .setSubject(subject)
//         .setHtml(emailTemplate);

//     await mailerSend.email.send(emailParams);

//     return NextResponse.json(
//         { message: "Message has been sent to email." },
//         { status: 200 }
//     );
// }

// export default sendFileByMail;


import Brevo from '@getbrevo/brevo';
import { NextResponse } from 'next/server';

const sendFileByMail = async (email: string, emailTemplate: string, subject: string) => {
    const brevoApiKey = process.env.BREVO_API_KEY;
    const brevoFromEmail = process.env.BREVO_FROM_EMAIL;

    if (!brevoApiKey || !brevoFromEmail) {
        throw new Error("Brevo API key or sender email is not configured.");
    }

    const apiInstance = new Brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, brevoApiKey);

    const sendSmtpEmail = {
        to: [{ email, name: "Recipient" }],
        sender: { email: brevoFromEmail, name: "Jaypee Associates" },
        subject,
        htmlContent: emailTemplate,
    };

    try {
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        return NextResponse.json(
            { message: "Message has been sent to email." },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Brevo email error:", error.response?.body || error.message);
        return NextResponse.json(
            { error: "Failed to send email." },
            { status: 500 }
        );
    }
}

export default sendFileByMail;
