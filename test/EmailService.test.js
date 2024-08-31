const EmailService = require('../src/services/EmailService');

describe('EmailService',()=>{
    let emailService;

    beforeEach(()=>{
        emailService = new EmailService();
    });

    test('should send an email sucessfully',async ()=>{
        const emailData = {
            to:'akhil@gmail.com',
            subject:'test',
            body:'this is a test email'
        }

        const result = await emailService.sendEmail(emailData);
        expect(result.status).toBe('Email sent successfully')
    });

    test('should prevent duplicate email sends(checking idempotency)',async ()=>{
        const emailData = {
            to:'akhil@gmail.com',
            subject:'test',
            body:'this is a test email'
        };

        await emailService.sendEmail(emailData);
        const result = await emailService.sendEmail(emailData);
        expect(result.status).toBe('Email already sent');
    });

    test('should switch providers on failure',async ()=>{
        const failingProvider = new EmailService();
        failingProvider.providers[0].sendEmail=()=>{
            try{
                throw new Error('Provider Failed')
            }
            catch(error){
                console.log(error)
            }
        }

        const emailData = {
            to:'akhil@gmail.com',
            subject:'test',
            body:'this is a test email'
        };

        const result = await failingProvider.sendEmail(emailData);
        expect(result.status).toBe('Email sent successfully');

    })
    
})