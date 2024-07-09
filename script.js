document.addEventListener('DOMContentLoaded', () => {
    const calendarBody = document.querySelector('#calendar tbody');
    const currentMonthElement = document.getElementById('current-month');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');
    const form = document.getElementById('event-form');
    
    let currentDate = new Date();
    let events = JSON.parse(localStorage.getItem('events')) || [];
    let contextMenu = null;

    function createContextMenu() {
        contextMenu = document.createElement('div');
        contextMenu.className = 'context-menu';
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '刪除事件';
        deleteButton.addEventListener('click', deleteEvent);
        contextMenu.appendChild(deleteButton);
        document.body.appendChild(contextMenu);
    }

    function showContextMenu(e, eventElement) {
        e.preventDefault();
        if (!contextMenu) {
            createContextMenu();
        }
        contextMenu.style.display = 'block';
        contextMenu.style.left = `${e.pageX}px`;
        contextMenu.style.top = `${e.pageY}px`;
        contextMenu.dataset.eventIndex = eventElement.dataset.eventIndex;
    }

    function hideContextMenu() {
        if (contextMenu) {
            contextMenu.style.display = 'none';
        }
    }

    function deleteEvent() {
        const eventIndex = parseInt(contextMenu.dataset.eventIndex);
        events.splice(eventIndex, 1);
        localStorage.setItem('events', JSON.stringify(events));
        renderCalendar();
        hideContextMenu();
    }

    document.addEventListener('click', hideContextMenu);

    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        currentMonthElement.textContent = `${year}年${month + 1}月`;
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        calendarBody.innerHTML = '';
        
        let date = new Date(firstDay);
        date.setDate(date.getDate() - date.getDay());
        
        while (date <= lastDay || date.getDay() !== 0) {
            const week = document.createElement('tr');
            
            for (let i = 0; i < 7; i++) {
                const day = document.createElement('td');
                const dayNumber = document.createElement('div');
                dayNumber.textContent = date.getDate();
                day.appendChild(dayNumber);
                
                if (date.getMonth() === month) {
                    const dateEvents = events.filter(event => {
                        const eventDate = new Date(event.date);
                        return eventDate.getDate() === date.getDate() &&
                               eventDate.getMonth() === date.getMonth() &&
                               eventDate.getFullYear() === date.getFullYear();
                    });
                    
                    dateEvents.forEach((event, index) => {
                        const eventElement = document.createElement('div');
                        let eventText = event.description;
                        if (event.time) {
                            eventText = `${event.time} ${eventText}`;
                        }
                        eventElement.textContent = eventText;
                        eventElement.classList.add('event');
                        eventElement.dataset.eventIndex = events.indexOf(event);
                        eventElement.addEventListener('contextmenu', (e) => showContextMenu(e, eventElement));
                        day.appendChild(eventElement);
                    });
                } else {
                    day.style.color = '#ccc';
                }
                
                week.appendChild(day);
                date.setDate(date.getDate() + 1);
            }
            
            calendarBody.appendChild(week);
        }
    }

    prevMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const date = document.getElementById('event-date').value;
        const time = document.getElementById('event-time').value;
        const description = document.getElementById('event-description').value;
        events.push({ date, time, description });
        localStorage.setItem('events', JSON.stringify(events));
        renderCalendar();
        form.reset();
    });

    renderCalendar();

    // 設置面板功能
    const settingsBtn = document.getElementById('settings-btn');
    const settingsPanel = document.getElementById('settings-panel');
    const applySettingsBtn = document.getElementById('apply-settings');
    const bgColorInput = document.getElementById('bg-color');
    const fontColorInput = document.getElementById('font-color');

    settingsBtn.addEventListener('click', () => {
        settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
    });

    applySettingsBtn.addEventListener('click', () => {
        document.body.style.backgroundColor = bgColorInput.value;
        document.body.style.color = fontColorInput.value;
        localStorage.setItem('bgColor', bgColorInput.value);
        localStorage.setItem('fontColor', fontColorInput.value);
        settingsPanel.style.display = 'none';
    });

    // 載入保存的顏色設置
    const savedBgColor = localStorage.getItem('bgColor');
    const savedFontColor = localStorage.getItem('fontColor');
    if (savedBgColor) {
        document.body.style.backgroundColor = savedBgColor;
        bgColorInput.value = savedBgColor;
    }
    if (savedFontColor) {
        document.body.style.color = savedFontColor;
        fontColorInput.value = savedFontColor;
    }
});