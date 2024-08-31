class CircuitBreaker{
    constructor(maxFailures,cooldownPeriod){

        this.maxFailures = maxFailures;
        this.cooldownPeriod = cooldownPeriod;
        this.failures = 0;
        this.lastFailureTime = null;
        this.state = 'CLOSED'
    }

    async execute(fn){

        if(this.state ==='OPEN' && Date.now()-this.lastFailureTime<this.cooldownPeriod){
            throw new Error('Circuit breaker is open');
        }

        try{
            await fn();
            this.reset();
        }
        catch(error){
            this.failures += 1;
            this.lastFailureTime = Date.now();

            if(this.failures>=this.maxFailures){
                this.state = 'OPEN'
            }

            throw error;
        }
    }

    reset(){
        this.failures = 0;
        this.state = 'CLOSED';
    }
}

module.exports = CircuitBreaker;