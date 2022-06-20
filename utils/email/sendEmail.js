var nodemailer = require('nodemailer');

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

        var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
            to: email,
            subject: subject,
            text: message
        }

        transporter.sendMail(mainOptions, function(err, info){
            if (err) {
                console.log(err);
                // res.redirect('/');
            } else {
                console.log('Message sent: ' +  info.response);
                // res.redirect('/');
            }
        });
    } catch (err) {
        console.log(err.message)
    }
}

