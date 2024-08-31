## Overview

This service is designed to reliably send emails using a fallback mechanism between two mock email providers. It includes features such as retry logic, exponential backoff, rate limiting, idempotency, circuit breaker pattern, and logging.

## Features

- Retry Logic with Exponential Backoff: Retries email sending on failure with increasing delay.
- Provider Fallback: Switches to a secondary provider if the primary fails.
- Idempotency: Prevents duplicate email sends.
- Rate Limiting: Limits the number of emails sent per minute.
- Circuit Breaker Pattern: Prevents further attempts when too many failures occur.
- Logging: Logs all key events and actions.

## How to Run

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Run `node src/index.js` to start the email service.
4. Run `npm test` to execute unit tests.

## Assumptions

- This project uses mock email providers for demonstration purposes.
- The rate limiter is configured to allow up to 5 emails per minute.
- The circuit breaker opens after 3 consecutive failures, with a cooldown of 10 seconds.
