export function formatDate(dateString, format = 'DD MMM YYYY', showTime = false) {
    const date = new Date(dateString);
    const options = {
        'DD MMM YYYY': { day: '2-digit', month: 'short', year: 'numeric' },
        'MMM DD, YYYY': { day: '2-digit', month: 'short', year: 'numeric' },
        'YYYY-MM-DD': { year: 'numeric', month: '2-digit', day: '2-digit' },
        'DD/MM/YYYY': { day: '2-digit', month: '2-digit', year: 'numeric' },
        'MM-DD-YYYY': { month: '2-digit', day: '2-digit', year: 'numeric' },
        'Full Date': { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }, // e.g., Monday, May 2, 2030
    };

    let formattedDate = '';

    // Handle specific formats that require different structures
    if (format === 'MMM DD, YYYY') {
        formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    } else if (format === 'YYYY-MM-DD') {
        formattedDate = date.toISOString().split('T')[0];
    } else if (format === 'MM-DD-YYYY') {
        formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    } else if (format === 'DD/MM/YYYY') {
        formattedDate = date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } else {
        formattedDate = date.toLocaleDateString('en-GB', options[format] || options['DD MMM YYYY']);
    }

    if (showTime) {
        const timeString = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }); // 24-hour time format without seconds
        formattedDate += ` ${timeString}`;
    }

    return formattedDate;
};