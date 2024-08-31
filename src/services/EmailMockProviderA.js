class EmailMockProviderA{
    constructor(){
        this.name = 'EmailMockProviderA';
    }

    async sendEmail(emailData){
        console.log(`Email send via ${this.name}`);
    }
}

module.exports = EmailMockProviderA;