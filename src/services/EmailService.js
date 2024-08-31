//providers
const EmailMockProviderA = require('../services/EmailMockProviderA');
const EmailMockProviderB = require('../services/EmailMockProviderB');
//rate limiter
const RateLimiter = require('../utils/RateLimiter');
//circuit breaker
const CircuitBreaker = require('../utils/CircuitBreaker');
//logger
const Logger = require('../utils/Logger');

class EmailService{
    constructor(){
        this.providers=[
            new EmailMockProviderA(),
            new EmailMockProviderB()
        ];
        this.currentProviderIndex = 0;
        //limiting 5 email per min
        this.rateLimiter = new RateLimiter(5,60000);
        //3 failures, 10 sec cooldown 
        this.circuitBreaker = new CircuitBreaker(3,10000);
        this.sentEmails = new Set();
        this.logger = new Logger();
        
    }

    async sendEmail(emailData){
        const emailId = this.generateEmailId(emailData);

        //checking idempotency
        if(this.sentEmails.has(emailId)){
            this.logger.log('Email already sent');
            return {status:'Email already sent'};
        }
        this.rateLimiter.checkRateLimit();

        const provider = this.getCurrentProvider();
        
        try{

            await this.circuitBreaker.execute(()=>this.sendWithRetry(provider,emailData));
            this.sentEmails.add(emailId);
            this.logger.log(`Email sent successfully via ${provider.name}`);
            return {status:`Email sent successfully`};
        }
        catch(error){
            this.logger.log(`Failed to send email:${error.messgae}`);
            throw new Error('Failed to send email after retires');
        }
    }

    async sendWithRetry(provider,emailData,retries=3,delay=10000){

        for(let i=0;i<retries;i++){
            try{
                await provider.sendEmail(emailData);
                return;
            }
            catch(error){
                if(i<retries-1){
                    await this.sleep(delay*Math.pow(2,i));
                }
                else{
                    this.switchProvider();
                    throw new Error('All retires failed');
                }
            }
        }
    }
    //getting the index of current provider
    getCurrentProvider(){
        return this.providers[this.currentProviderIndex];
    }

    //switching providers
    switchProvider(){
        this.currentProviderIndex = (this.currentProviderIndex + 1)% this.providers.length;
        this.logger.log(`Switching to provider:${this.getCurrentProvider().name}`);
    }

    generateEmailId(emailData){
        return `${emailData.to}-${emailData.subject}-${emailData.body}`;
    }

    sleep(ms){
        return new Promise(resolve=>setTimeout(resolve,ms));
    }

}

module.exports = EmailService;