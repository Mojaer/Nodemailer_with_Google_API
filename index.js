const nodemailer = require("nodemailer");
const { google } = require('googleapis');
require('dotenv').config()



const clientId = process.env.YOUR_CLIENT_ID
const clientSecret = process.env.YOUR_CLIENT_SECRET
const redirectUrl = process.env.YOUR_REDIRECT_URL
const refreshToken = process.env.REFRESH_TOKEN

const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUrl)
oAuth2Client.setCredentials({
    refresh_token: refreshToken
});


const sendMail = async () => {
    try {
        const { token } = await oAuth2Client.getAccessToken()
        // console.log(token)

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'oAuth2',
                user: process.env.USER,
                clientId: clientId,
                clientSecret: clientSecret,
                refresh_token: refreshToken,
                accessToken: token
            }
        }
        )

        const mail = {
            from: `Hello 🙌 <${process.env.SENDER}>`,
            to: process.env.USER,
            subject: 'test subject',
            text: 'success message',
            html: '<h1>hello brothers </h1>',
            attachments: [
                {
                    filename: 'file.svg',
                    content: './vite.svg',
                }]
        }

        const result = await transporter.sendMail(mail)
        return result

    } catch (error) {
        return error
    }
}

// reply to the email
const gmail = google.gmail({
    version: 'v1',
    auth: oAuth2Client
});

const encodeBase64 = (string) => {
    const buff = Buffer.from(string, 'utf-8');
    return buff.toString('base64');
}

sendMail().then(result => {
    console.log(result);
    const replyOptions = {
        auth: oAuth2Client,
        userId: 'me',
        resource: {
            raw: encodeBase64(
                `From: "Reply" <${process.env.USER}>\r\n` +
                `To: <${process.env.SENDER}>\r\n` +
                `Subject: Re: Test Email\r\n` +
                `In-Reply-To: ${result.messageId}\r\n` +
                `References: ${result.messageId}\r\n` +
                '\r\n' +
                'This is the reply to the email.'
            )
        }
    };

    gmail.users.messages.send(replyOptions, (err, res) => {
        if (err) {
            console.error(err);
        } else {
            console.log('Reply sent:', res.data);
        }
    });
})
    .catch(error => console.log('error', error.message));









