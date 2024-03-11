export function formatDateDistance(dateString) {
    // Convert the input date string to a Date object
    const inputDate = new Date(dateString);
    
    // Get the current date
    const currentDate = new Date();
    
    // Calculate the difference in milliseconds between the input date and the current date
    const difference = currentDate - inputDate;
    
    // Convert the difference to seconds
    const secondsDifference = Math.floor(difference / 1000);
    
    // Define time intervals in seconds
    const intervals = {
        year: 31536000,
        month: 2592000,
        day: 86400,
        hour: 3600,
        minute: 60
    };

    // Calculate the elapsed time in different units
    let elapsedTime;
    for (const [unit, seconds] of Object.entries(intervals)) {
        elapsedTime = Math.floor(secondsDifference / seconds);
        if (elapsedTime >= 1) {
            return `${elapsedTime} ${unit}${elapsedTime !== 1 ? 's' : ''} ago`;
        }
    }

    // If less than a minute, return 'just now'
    return 'just now';
}