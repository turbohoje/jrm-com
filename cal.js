(function () {
    const canvas = document.getElementById('calendarCanvas');
    const ctx = canvas.getContext('2d');
    const rightmargin = 40;
    const canvasWidth = canvas.width - rightmargin;
    const canvasHeight = canvas.height;

    const numberOfWeeks = 2;
    const weekHeight = (canvasHeight - 20) / numberOfWeeks;
    const dayWidth = canvasWidth / 7;
    const timeStart = 6;
    const timeEnd = 18;
    const timeRange = timeEnd - timeStart;
    const allDayRowHeight = 14;          // strip between day labels and timed grid
    const gridTop = 20 + allDayRowHeight; // px from top of each week row where timed grid starts
    const hourHeight = (weekHeight - gridTop) / timeRange;

    const hostTZ = 'America/Denver';
    const days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];

    let cachedEvents = null;

    function getViewerTZ() {
        return window.calViewerTZ || Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    function shortTZName(tz) {
        try {
            return Intl.DateTimeFormat('en', { timeZone: tz, timeZoneName: 'short' })
                .formatToParts(new Date())
                .find(function (p) { return p.type === 'timeZoneName'; }).value;
        } catch (e) { return tz; }
    }

    // Convert a host-TZ hour on a given week offset to a display label in the viewer TZ
    function viewerLabel(hostHour, weekOffset, viewerTZ) {
        const t = moment().tz(hostTZ)
            .startOf('week')
            .add(weekOffset * 7, 'days')
            .startOf('day')
            .hour(hostHour);
        return t.clone().tz(viewerTZ).format('h:mm');
    }

    function drawWeekGrid(weekOffset, yOffset, viewerTZ) {
        // Day labels
        ctx.font = '12px Arial';
        for (let i = 0; i < 7; i++) {
            ctx.fillStyle = 'black';
            ctx.textAlign = 'left';
            const date = moment().startOf('week').add(i + weekOffset * 7, 'days').format('MMM D');
            ctx.fillText(days[i] + ' ' + date, i * dayWidth, yOffset + 15);
        }

        // Vertical day lines
        for (let i = 0; i <= 7; i++) {
            ctx.beginPath();
            ctx.moveTo(i * dayWidth, yOffset + 20);
            ctx.lineTo(i * dayWidth, yOffset + weekHeight);
            ctx.strokeStyle = '#cccccc';
            ctx.stroke();
        }

        // Bottom border of all-day strip
        ctx.beginPath();
        ctx.moveTo(0, yOffset + gridTop);
        ctx.lineTo(canvasWidth, yOffset + gridTop);
        ctx.strokeStyle = '#cccccc';
        ctx.stroke();

        // Horizontal hour lines + viewer-TZ labels on right
        ctx.textAlign = 'right';
        for (let i = 0; i <= timeRange; i++) {
            const y = yOffset + gridTop + i * hourHeight;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvasWidth, y);
            ctx.strokeStyle = '#cccccc';
            ctx.stroke();

            const label = viewerLabel(timeStart + i, weekOffset, viewerTZ);
            ctx.fillStyle = 'black';
            ctx.fillText(label, canvasWidth - 5 + rightmargin, y + 4);
        }
    }

    function drawEvents() {
        if (!cachedEvents) return;
        cachedEvents.forEach(function (event) {
            const isAllDay  = !event.start.dateTime;
            const startDate = event.start.dateTime || event.start.date;
            const endDate   = event.end.dateTime   || event.end.date;

            const eventStartMT = moment.tz(startDate, hostTZ);
            const eventEndMT   = moment.tz(endDate,   hostTZ);

            const weekOffset = Math.floor(eventStartMT.diff(moment().startOf('week'), 'days') / 7);
            if (weekOffset < 0 || weekOffset >= numberOfWeeks) return;

            const yOffset   = weekOffset * weekHeight;
            const dayOfWeek = eventStartMT.day();

            if (isAllDay) {
                // Google Calendar end date is exclusive (e.g. Apr 23 event ends Apr 24)
                const spanDays = Math.min(eventEndMT.diff(eventStartMT, 'days'), 7 - dayOfWeek);
                const x = dayOfWeek * dayWidth;
                const w = spanDays * dayWidth;

                ctx.fillStyle = 'rgba(255, 160, 0, 0.55)';
                ctx.fillRect(x + 1, yOffset + 20, w - 2, allDayRowHeight - 1);

                ctx.font = '9px Arial';
                ctx.fillStyle = '#000';
                ctx.textAlign = 'left';
                ctx.fillText(event.summary || '', x + 3, yOffset + 20 + allDayRowHeight - 3);
            } else {
                const startHour  = eventStartMT.hour() + eventStartMT.minute() / 60;
                const endHour    = eventEndMT.hour()   + eventEndMT.minute()   / 60;

                const eventStartHour = Math.max(startHour, timeStart);
                const eventEndHour   = Math.min(endHour,   timeEnd);

                const x      = dayOfWeek * dayWidth;
                const y      = yOffset + gridTop + (eventStartHour - timeStart) * hourHeight;
                const height = (eventEndHour - eventStartHour) * hourHeight;

                if (height > 0) {
                    ctx.fillStyle = 'rgba(0, 128, 255, 0.5)';
                    ctx.fillRect(x + 1, y, dayWidth - 2, height);
                }
            }
        });
    }

    function draw(viewerTZ) {
        // Background
        ctx.fillStyle = '#5f5f5f';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Grid weeks
        for (let week = 0; week < numberOfWeeks; week++) {
            drawWeekGrid(week, week * weekHeight, viewerTZ);
        }

        // Events (always positioned in host/MT time — grid never moves)
        drawEvents();

        // TZ badge top-right margin strip
        ctx.fillStyle = 'rgba(0,0,0,0.45)';
        ctx.fillRect(canvasWidth + 1, 0, rightmargin - 1, 14);
        ctx.fillStyle = '#ffffff';
        ctx.font = '9px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(shortTZName(viewerTZ), canvasWidth + rightmargin / 2, 10);
    }

    // Expose redraw for the dropdown
    window.redrawCalendar = function (tz) {
        window.calViewerTZ = tz;
        draw(tz);
    };

    // Initial draw (no events yet — shows grid immediately)
    draw(getViewerTZ());

    // Fetch events once, then redraw
    const apiKey     = 'AIzaSyAVABSEuYuWqa9pNWX6HoJxz-sLUamUiFg';
    const calendarId = 'justin@rocketscience.cc';
    const mountainTime     = moment().tz(hostTZ);
    const startOfFirstWeek = mountainTime.clone().startOf('week').toISOString();
    const endOfSecondWeek  = mountainTime.clone().endOf('week').add(1, 'week').toISOString();
    const apiUrl = 'https://www.googleapis.com/calendar/v3/calendars/'
        + encodeURIComponent(calendarId)
        + '/events?key=' + apiKey
        + '&timeMin=' + startOfFirstWeek
        + '&timeMax=' + endOfSecondWeek
        + '&singleEvents=true&orderBy=startTime';

    fetch(apiUrl)
        .then(function (r) { return r.json(); })
        .then(function (data) {
            if (!data || !data.items) { console.error('No events found'); return; }
            cachedEvents = data.items;
            draw(getViewerTZ());
        })
        .catch(function (e) { console.error('Error fetching calendar data:', e); });
})();
