const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: "getsurvunic@gmail.com",
        pass: "getsurv@123"
    }
});
let mailOptions = {
    from: 'getsurvunic@gmail.com',
    to: 'pogularakesh209@gmail.com',
    subject: 'Test',
    html:  `Greetings of the day....
    <h1 style="font-color:blue">Welcome to GetSurv</h1>
    <p>GetSurv is the online survey application By unicsol India Pvt Ltd.</p>
    <p>Your User Id is <b>US_147</b></p>
    <a href="http://localhost:4200/login">click here</a> To Login</br>
    <p>Thanks for using GetSurv</p>
    `,
    
};
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error.message);
    }
    console.log('success');
});
