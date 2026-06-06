// Our native JavaScript object tracking client IPs in RAM
const store = {};

/**
 * Custom Fixed Window Counter Middleware Factory
 * @param {number} maxRequests - Max operations permitted in the window
 * @param {number} windowDurationMs - Window size in milliseconds
 */
export function customFixedWindowLimiter(maxRequests, windowDurationMs) {
    return (req, res, next) => {
        
        // Extract unique identifier (IP Address)
        const clientIp = req.ip
        const currentTime = Date.now();

        // Check if the user exists in our tracking ledger
        let userRecord = store[clientIp];

        if (!userRecord) {
            store[clientIp] = {
                counter: 1,
                windowStartTime: currentTime
            };
            return next();
        }

        if (currentTime - userRecord.windowStartTime < windowDurationMs) {
            if (userRecord.counter >= maxRequests) {
                return res.status(429).json({
                    status: 429,
                    error: "Too Many Requests",
                    message: "Rate boundary exceeded. Your requests have been throttled."
                });
            }

            userRecord.counter += 1;
            return next();
        } else {
            userRecord.counter = 1;
            userRecord.windowStartTime = currentTime;
            return next();
        }
    };
}

// If users make a single visit and close their tab, their tracking object remains stuck in RAM. Scan the store every 5 minutes and drops records whose window durations have completely passed.
setInterval(() => {
    const currentTime = Date.now();
    const records = Object.keys(store);
    
    for (const ip of records) {
        if (currentTime - store[ip].windowStartTime > 30 * 60 * 1000) { // Stale for over 30 mins
            delete store[ip]; // Purge entries out of the heap cleanly
        }
    }
}, 5 * 60 * 1000);