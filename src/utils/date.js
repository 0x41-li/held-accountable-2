export function formatDate(date) {
    // Format time (e.g., "4:50 AM")
    const time = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  
    // Format date (e.g., "20 Feb 2025")
    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  
    return `${time} ● ${formattedDate}`;
}

export function formatDateTime(date) {
    // Format date (e.g., "Feb 16, 2025")
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  
    // Format time in 24-hour format (e.g., "23:59")
    const formattedTime = date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  
    return `${formattedDate} - ${formattedTime}`;
}