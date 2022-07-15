var nodemailer = require('nodemailer');

/** Send email 
 * @param { string } email 
 * @param { string } subject 
 * @param { string } message 
 */ 
exports.sendEmail = async (email, subject, message) => {
    try {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              type: 'OAuth2',
              user: process.env.MAIL_USERNAME,
              pass: process.env.MAIL_PASSWORD,
              clientId: process.env.OAUTH_CLIENTID,
              clientSecret: process.env.OAUTH_CLIENT_SECRET,
              refreshToken: process.env.OAUTH_REFRESH_TOKEN, 
              accessToken: process.env.OAUTH_ACCESS_TOKEN,
              expires: 1484314697598,
            }
        });

        var mainOptions = { 
            to: email,
            subject: subject,
            text: message
        }

        // Might throw error due to token not being refreshed properly 
        transporter.sendMail(mainOptions, function(err, info){
            if (err) {
                console.log(err);
            } else {
                console.log('Message sent: ' +  info.response);
            }
        });

    } catch (err) {
        console.log(err.message)
    }
}

