const canvas = document.getElementById('calendarCanvas');
        const ctx = canvas.getContext('2d');

        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;


        // Set the background color to light grey
        ctx.fillStyle = '#5f5f5f'; // Light grey color
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        

        const numberOfWeeks = 2; // Display two weeks
        const weekHeight = (canvasHeight - 20) / numberOfWeeks;
        const dayWidth = canvasWidth / 7;
        const timeStart = 7; // 7 AM
        const timeEnd = 18; // 6 PM
        const timeRange = timeEnd - timeStart;
        const hourHeight = (weekHeight - 20) / timeRange;

        const days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];

        // Function to draw a week's grid
        function drawWeekGrid(weekOffset, yOffset) {
            // Draw day labels
            ctx.font = '12px Arial';
            for (let i = 0; i < 7; i++) {
                ctx.fillStyle = 'black';
                ctx.textAlign = 'center';
                const dayName = days[i];
                const date = moment().startOf('week').add(i + weekOffset * 7, 'days').format('MMM D');
                ctx.fillText(`${dayName} ${date}`, i * dayWidth + dayWidth / 2, yOffset + 15);
            }

            // Draw vertical grid lines for days
            for (let i = 0; i <= 7; i++) {
                ctx.beginPath();
                ctx.moveTo(i * dayWidth, yOffset + 20);
                ctx.lineTo(i * dayWidth, yOffset + weekHeight);
                ctx.strokeStyle = '#cccccc';
                ctx.stroke();
            }

            // Draw horizontal grid lines for hours
            ctx.textAlign = 'right';
            for (let i = 0; i <= timeRange; i++) {
                const y = yOffset + 20 + i * hourHeight;
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvasWidth, y);
                ctx.strokeStyle = 'cccccc';
                ctx.stroke();

                // Label the time on the right side of the canvas
                const hour = timeStart + i;
                ctx.fillStyle = 'black';
                ctx.fillText(hour + ':00', canvasWidth - 5, y - 2);
            }
        }

        // Draw grids for two weeks
        for (let week = 0; week < numberOfWeeks; week++) {
            const yOffset = week * weekHeight;
            drawWeekGrid(week, yOffset);
        }

        // Your Google API key
        const apiKey = 'AIzaSyAVABSEuYuWqa9pNWX6HoJxz-sLUamUiFg'; // Replace with your actual API key

        // Calendar ID
        const calendarId = 'justin@rocketscience.cc';

        const mountainTime = moment().tz('America/Denver');
        const startOfFirstWeek = mountainTime.clone().startOf('week').toISOString();
        const endOfSecondWeek = mountainTime.clone().endOf('week').add(1, 'week').toISOString();

        const apiUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?key=${apiKey}&timeMin=${startOfFirstWeek}&timeMax=${endOfSecondWeek}&singleEvents=true&orderBy=startTime`;

        fetch(apiUrl)
          .then(response => response.json())
          .then(data => {
            if (!data || !data.items) {
                console.error('No events found');
                return;
            }

            const events = data.items;

            events.forEach(function(event) {
                const startDate = event.start.dateTime || event.start.date;
                const endDate = event.end.dateTime || event.end.date;

                // Convert to Moment.js objects in Mountain Time
                const eventStartMT = moment.tz(startDate, 'America/Denver');
                const eventEndMT = moment.tz(endDate, 'America/Denver');

                // Determine which week the event belongs to
                const weekOffset = Math.floor(eventStartMT.diff(moment().startOf('week'), 'days') / 7);
                if (weekOffset < 0 || weekOffset >= numberOfWeeks) {
                    // Event is outside the displayed weeks
                    return;
                }

                const yOffset = weekOffset * weekHeight;

                const dayOfWeek = eventStartMT.day(); // 0 for Sunday, 6 for Saturday
                const startHour = eventStartMT.hour() + eventStartMT.minute() / 60;
                const endHour = eventEndMT.hour() + eventEndMT.minute() / 60;

                // Adjust for timeStart and timeEnd
                const eventStartHour = Math.max(startHour, timeStart);
                const eventEndHour = Math.min(endHour, timeEnd);

                const x = dayOfWeek * dayWidth;
                const y = yOffset + 20 + (eventStartHour - timeStart) * hourHeight;
                const height = (eventEndHour - eventStartHour) * hourHeight;

                if (height > 0) {
                    // Draw the event rectangle
                    ctx.fillStyle = 'rgba(0, 128, 255, 0.5)';
                    ctx.fillRect(x + 1, y, dayWidth - 2, height);

                    // Draw the event title as "Busy"
                    ctx.fillStyle = 'black';
                    ctx.font = '12px Arial';
                    ctx.textAlign = 'left';

                    //const eventTitle = 'Busy'; // Replace event title with "Busy"
                    //ctx.fillText(eventTitle, x + 5, y + 15);
                }
            });

          })
          .catch(error => {
            console.error('Error fetching calendar data:', error);
          });