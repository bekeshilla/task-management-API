const sgMail = require ('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from:'bekesi.antonio@gmail.com',
        subject: 'Welcome bradah',
        text: `Welcome to the app, ${name}. Let me know what is up!`
    })
}
const sendGoodByeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'bekesi.antonio@gmail.com',
        subject: 'Good bye brah, you were a good customer but.. this life...',
        text: `GoodBye brah, ${name}, we'll totally miss you, tell us what you didn't like about us!!!`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendGoodByeEmail
}