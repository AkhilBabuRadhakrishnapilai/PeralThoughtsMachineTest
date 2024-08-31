const EmailService = require('../src/services/EmailService');

const emailService = new EmailService();

const emailData={
    to:'akhil@gmail.com',
    subject:'Hey',
    body:'Good to see u'
};

emailService.sendEmail(emailData).then(result=>console.log(result)).catch(error=>console.log(error));
