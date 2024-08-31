class EmailMockProviderB{
    constructor(){
        this.name = 'EmailMockProviderB';
    }

    async sendEmail(emailData){
        console.log(`Email send via${this.name}`);
    }
}

module.exports = EmailMockProviderB;