class CsoeventiUi {

  static init(config) {
    const instance = new CsoeventiUi(config);

    (async () => {
      instance.render();
    })()
    return instance;
  }

  constructor(config) {
    this.config = config;
    this.isOpen = false;
    this.user = null;
    // window.document['sitekey'] = config.sitekey;
    this.id = config?.id || 'csoeventi-ui';
    this.apiUrl = config?.apiUrl || 'http://api-cso.zagrosagency.xyz';
    this.date = new Date();
    this.year = this.date.getFullYear();
    this.month = this.date.getMonth();
    this.months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
  }
  log(...str) {
    if (this.config?.debug) {
      console.log('CsoeventiUi', str)
    }
  }
  // renderSuccess
  renderSuccess() {

    document.getElementById(this.id).innerHTML = `
         <div class="calendar-info">
            <span class="icon-back" id="backBtn" style="display:block;">
                <span class="material-symbols-rounded">arrow_back</span>
            </span>
            
            <div class="specialist-title">Specialist CSO</div>
            <div class="calendar-success" style="display:block;">
              <div class="calendar-success-icon">
                <span class="material-symbols-rounded" style="font-size:48px;color:#4caf50;">check_circle</span>
              </div>
              <div class="calendar-success-title" style="font-size:1.3em;font-weight:bold;margin-top:10px;">
                Event scheduled successfully!
              </div>
              <div class="calendar-success-desc" style="margin-top:8px;">
                Thank you for booking your appointment. A confirmation email has been sent.
              </div>
            </div>

        </div> 
      `;
    this.addEventListeners();
  }
  render() {

    document.getElementById(this.id).innerHTML = `
         <div class="calendar-info">
            <span class="icon-back" onclick="backBtn()">
                <span class="material-symbols-rounded">arrow_back</span>
            </span>
            
            <div class="specialist-title">Specialist CSO</div>
            <h1 class="main-title">Book an appointment with one of our product specialists</h1>
            <div class="info-row">
                <span class="material-symbols-rounded icon">schedule</span>
                <span class="info-text">1 hr</span>
            </div>
            <div class="info-row">
                <span class="material-symbols-rounded icon">videocam</span>
                <span class="info-text bold">Web conferencing details provided upon confirmation.</span>
            </div>
            <p class="description">
                Choose the date and time to book an appointment with a CSO product specialist to find out in detail the
                news and features of our products.
            </p>

        </div>
        <div class="calendar">
            <div class="calendar-container">
                <header class="calendar-header">
                    <p class="calendar-current-date"></p>
                    <div class="calendar-navigation">
                        <span id="calendar-prev" class="material-symbols-rounded">
                            chevron_left
                        </span>
                        <span id="calendar-next" class="material-symbols-rounded">
                            chevron_right
                        </span>
                    </div>
                </header>

                <div class="calendar-body">
                    <ul class="calendar-weekdays">
                        <li>Sun</li>
                        <li>Mon</li>
                        <li>Tue</li>
                        <li>Wed</li>
                        <li>Thu</li>
                        <li>Fri</li>
                        <li>Sat</li>
                    </ul>
                    <ul class="calendar-dates"></ul>
                </div>



            </div>
            <div class="calendar-events">


                <div class="calendar-events-date">Thursday, May 29</div>
                <!--  -->
                <div class="calendar-times">
                     
                </div>
            </div>
        </div>
        <div class="calendar-form">

            <div class="calendar-form-container">
                <h2>Enter Details</h2>
                <form id="form" >
                    <label class="calendar-form-label" for="name">Name <span class="required">*</span></label>
                    <input class="calendar-form-input" type="text" id="name" name="name" required>
   <input style="display:none;" type="text" id="date" name="date" required>
                    <label class="calendar-form-label" for="email">Email <span class="required">*</span></label>
                    <input class="calendar-form-input" type="email" id="email" name="email" required>
                    <div class="calendar-form-desc" style="margin-top:18px;">
                        Please share anything that will help prepare for our meeting.
                    </div>
                    <textarea class="calendar-form-textarea" id="description" name="description" rows="3"></textarea>

                    <button type="submit" class="calendar-form-submit">Schedule Event</button>
                </form>
            </div>
        </div>
      `;

    // load the calendar
    this.loadCalendar();
    this.addEventListeners();
  }

  async callApi({ method = 'GET', url, date, }) {

    this.log('siteKey', this.config.sitekey)
    try {
      const response = await fetch(`${this.apiUrl}/${url}`, {
        method,
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
          'site-key': this.config.sitekey
        },
        body: date ? JSON.stringify(date) : ''
      });
      return (await response.json());
    } catch (error) {
      return null;
    }
  }

  addEventListeners() {
    const form = document.querySelector('#form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target.closest('form'));
        const data = Object.fromEntries(formData);
        try {
          const nameParts = (data.name || '').trim().split(' ');
          const firstName = nameParts[0] || '';
          const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
          const response = await this.callApi({
            method: 'POST',
            url: 'appointments',
            date: {
              ...data,
              firstName,
              lastName,
              duration: 60
            }
          });
          console.log('response addEventListeners', response);
          if (response && response?._id) {
            //alert('Event scheduled successfully!');
            return this.renderSuccess();
          } else {
            alert('Error scheduling event. Please try again later.');
          }
        } catch (error) {
          alert('An error occurred while scheduling the event. Please try again later.');
        }
      });
    }
    const prenexIcons = document
      .querySelectorAll(".calendar-navigation span");
    if (prenexIcons && prenexIcons.length > 0) {
      prenexIcons.forEach(icon => {

        // When an icon is clicked
        icon.addEventListener("click", () => {

          // Check if the icon is "calendar-prev"
          // or "calendar-next"
          this.month = icon.id === "calendar-prev" ? this.month - 1 : this.month + 1;

          // Check if the month is out of range
          if (this.month < 0 || this.month > 11) {

            // Set the date to the first day of the 
            // month with the new year
            this.date = new Date(this.year, this.month, new Date().getDate());

            // Set the year to the new year
            this.year = date.getFullYear();

            // Set the month to the new month
            this.month = date.getMonth();
          }

          else {

            // Set the date to the current date
            this.date = new Date();
          }

          // Call the manipulate function to 
          // update the calendar display
          this.loadCalendar();
        });
      });
    }
    const backBtnEl = document.getElementById('backBtn');
    if (backBtnEl) {
      backBtnEl.addEventListener('click', () => {
        this.render();
      });
    }
  }
  async loadCalendar() {
    const day = document.querySelector(".calendar-dates");
    const currdate = document
      .querySelector(".calendar-current-date");
    // Get the first day of the month
    let dayone = new Date(this.year, this.month, 1).getDay();

    // Get the last date of the this.month
    let lastdate = new Date(this.year, this.month + 1, 0).getDate();

    // Get the day of the last date of the this.month
    let dayend = new Date(this.year, this.month, lastdate).getDay();

    // Get the last date of the previous this.month
    let monthlastdate = new Date(this.year, this.month, 0).getDate();

    // Variable to store the generated calendar HTML
    let lit = "";

    // Loop to add the last dates of the previous this.month
    for (let i = dayone; i > 0; i--) {
      lit +=
        `<li class="inactive">${monthlastdate - i + 1}</li>`;
    }

    // Loop to add the dates of the current this.month
    for (let i = 1; i <= lastdate; i++) {

      // Check if the current date is today
      let isToday = new Date(this.year, this.month, i).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0)
        && new Date(this.year, this.month, i).getDay() !== 0
        && new Date(this.year, this.month, i).getDay() !== 6
        ? "active"
        : "";
      lit += `<li 
      id="${this.year}-${this.month}-${i}" 
      class="${isToday}" onclick="selectDate(${this.year},${this.month},${i})">${i}</li>`;
    }

    // Loop to add the first dates of the next this.month
    for (let i = dayend; i < 6; i++) {
      lit += `<li class="inactive">${i - dayend + 1}</li>`
    }

    // Update the text of the current date element 
    // with the formatted current this.month and this.year
    currdate.innerText = `${this.months[this.month]} ${this.year}`;

    // update the HTML of the dates element 
    // with the generated calendar
    day.innerHTML = lit;
  }
}
function selectDate(year, month, day) {
  const selectedDate = new Date(year, month, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    alert('You cannot schedule a meeting in the past.');
    return;
  }
  if (selectedDate.getDay() === 0 || selectedDate.getDay() === 6) {
    alert('You cannot schedule a meeting on Saturday or Sunday.');
    return;
  }
  // alert(`Selected date: ${year}-${month}-${day}`);
  const events = document.querySelectorAll('.active-event');
  if (events) {
    events.forEach(event => event.classList.toggle("active-event"));
  }
  const id = `${year}-${month}-${day}`;
  const selectedDateElement = document.getElementById(id);
  selectedDateElement.classList.toggle("active-event");
  // ..calendar-events
  const calendarEvents = document.querySelector('.calendar-events');
  if (calendarEvents) {
    calendarEvents.style.display = 'flex';
  }
  const date = document.querySelector('.calendar-events-date');
  if (date) {
    const selectedDate = new Date(year, month, day);
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    date.innerText = selectedDate.toLocaleDateString('en-US', options);
  }
  let eventsTime = [
    "09:00am",
    "10:00am",
    "11:00am",
    "02:00pm",
    "03:00pm",
  ];
  // If the selected day is Friday (5), clear eventsTime
  if (new Date(year, month, day).getDay() === 5) {
    eventsTime = [
      "09:00am",
      "10:00am",
      "11:00am",
      "12:00am",
    ];
  }
  const calendarTimes = document.querySelector('.calendar-times');
  if (calendarTimes) {
    calendarTimes.innerHTML = `
         ${eventsTime.map(time => `
            <button id="btn-${time}" class="calendar-time-btn" 
            onclick="sctBtn('${time}')">
                        ${time}
                    </button>
                    <div id="next-${time}" class="calendar-events-top" style="display: none;">
                        <button class="calendar-btn selected"
                          >${time}</button>
                        <button onclick="sctNextBtn(${year}, ${month}, ${day},'${time}')" class="calendar-btn next">Next</button>
                    </div>
            `).join('')}
    `;
  }
};

function sctBtn(id) {
  var prevBtn;
  var nextBtn;
  const tops = document.querySelectorAll('.calendar-events-top');
  for (let i = 0; i < tops.length; i++) {
    const top = tops[i];
    if ('next-' + id === top.id) {
      nextBtn = top;
      top.style.display = "block";
    } else {
      top.style.display = "none";
    }

  }
  const btns = document.querySelectorAll('.calendar-time-btn');
  for (let i = 0; i < btns.length; i++) {
    const btn = btns[i];
    // btn.style.display = "block";
    if ('btn-' + id === btn.id) {
      prevBtn = btn;
      btn.style.display = "none";
    } else {
      btn.style.display = "block";
      btn.style.transform = "none";
      btn.style.opacity = "1";
    }
  }


  // Hide prevBtn with slide-left animation
  if (prevBtn) {
    prevBtn.style.transition = "transform 0.3s ease, opacity 0.3s ease";
    prevBtn.style.transform = "translateX(-100%)";
    prevBtn.style.opacity = "0";
    setTimeout(() => {
      prevBtn.style.display = "none";
    }, 300);
  }

  // Show nextBtn with slide-left animation
  if (nextBtn) {
    nextBtn.style.display = "block";
    nextBtn.style.transition = "transform 0.3s ease, opacity 0.3s ease";
    nextBtn.style.transform = "translateX(-100%)";
    nextBtn.style.opacity = "0";
    // Force reflow to apply the initial state before animating in
    void nextBtn.offsetWidth;
    nextBtn.style.transform = "translateX(0)";
    nextBtn.style.opacity = "1";
  }

}
function sctNextBtn(year, month, day, id) {
  //add time to form
  const timeInput = document.querySelector('#date');
  if (timeInput) {
    // Parse time string and convert to 24-hour format
    let [time, period] = id.match(/(\d{2}:\d{2})(am|pm)/i).slice(1, 3);
    let [hour, minute] = time.split(':').map(Number);
    if (period.toLowerCase() === 'pm' && hour !== 12) hour += 12;
    if (period.toLowerCase() === 'am' && hour === 12) hour = 0;
    //2025-05-29T11:30:00.000Z
    timeInput.value = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00.000Z`;
  }

  //update information in left side
  //.calendar
  const calendar = document.querySelector('.calendar');
  if (calendar) {
    calendar.style.display = 'none';
  }
  //.calendar-form
  const calendarForm = document.querySelector('.calendar-form');
  if (calendarForm) {
    calendarForm.style.display = 'block';
  }
  const back = document.querySelector('.icon-back');
  if (back) {
    back.style.display = 'block';
  }
}
function backBtn() {
  //.calendar
  const calendar = document.querySelector('.calendar');
  if (calendar) {
    calendar.style.display = 'flex';
  }
  //.calendar-form
  const calendarForm = document.querySelector('.calendar-form');
  if (calendarForm) {
    calendarForm.style.display = 'none';
  }
  const back = document.querySelector('.icon-back');
  if (back) {
    back.style.display = 'none';
  }
  const form = document.getElementById('form');
  if (form) {
    form.reset();
  }
}

