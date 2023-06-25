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
            from: `Hello 🙌 <${process.env.USER}>`,
            to: process.env.RECEIVER,
            subject: 'test subject',
            text: 'success message',
            html: '<h1>hello brothers </h1>'
        }

        const result = await transporter.sendMail(mail)
        return result

    } catch (error) {
        return error
    }


}
sendMail().then(result => console.log('success', result)).catch(error => console.log('error', error.message));