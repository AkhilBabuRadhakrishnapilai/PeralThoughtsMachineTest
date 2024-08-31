class RateLimiter{
    constructor(maxEmails,timeWindow){
        this.maxEmails = maxEmails;
        this.timeWindow = timeWindow;
        this.emailTimeStamps = [];
    }

    //method for checcking the rate limits
    checkRateLimit(){
        const now = Date.now();
        this.emailTimeStamps = this.emailTimeStamps.filter(timestamp => now - timestamp <this.timeWindow);
        try{
        if(this.emailTimeStamps.length >= this.maxEmails){
            throw new Error('Rate limit exceeded');
            // console.log('rate limit exceeded');
        }
        }catch(err){
            console.log(err)
        }

        this.emailTimeStamps.push(now);
    }
}

module.exports = RateLimiter;