class CsoeventiUi {

  static init(config) {
    const instance = new CsoeventiUi(config);

    (async () => {
      await instance.setupEvents();
      // await instance.checkAuth();
      instance.render();
    })()
    return instance;
  }

  constructor(config) {
    this.config = config;
    this.isOpen = false;
    this.user = null;
    window.document['sitekey'] = config.sitekey;
    this.id = config?.id || 'csoeventi-ui';
    this.apiUrl = config?.apiUrl || 'https://api.csoeventi.com';
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
                <form id="form">
                    <label class="calendar-form-label" for="name">Name <span class="required">*</span></label>
                    <input class="calendar-form-input" type="text" id="name" name="name" required>
   <input style="display:none;" type="text" id="date" name="date" required>
                    <label class="calendar-form-label" for="email">Email <span class="required">*</span></label>
                    <input class="calendar-form-input" type="email" id="email" name="email" required>
                    <div class="calendar-form-desc" style="margin-top:18px;">
                        Please share anything that will help prepare for our meeting.
                    </div>
                    <textarea class="calendar-form-textarea" id="notes" name="notes" rows="3"></textarea>

                    <div class="calendar-form-terms">
                        By proceeding, you confirm that you have read and agree to
                        <a href="#" target="_blank">Calendly's Terms of Use</a> and
                        <a href="#" target="_blank">Privacy Notice</a>.
                    </div>
                    <button type="submit" class="calendar-form-submit">Schedule Event</button>
                </form>
            </div>
        </div>
      `;

    // load the calendar
    this.loadCalendar();
    this.addEventListeners();
  }
  async setupEvents() {
    // const init = await this.loadConfig();
    // this.log(init)
    // this.app = init?.data;
  }



  addEventListeners() {

    this.container.querySelector('#form').addEventListener('click', (t) => {
       console.log(t)
    });

    const prenexIcons = document
      .querySelectorAll(".calendar-navigation span");
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
  const timeInput = document.querySelector('.calendar-form-input[name="time"]');
  if (timeInput) {
    timeInput.value = id;
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
}

async function callApi({ method = 'GET', url, date, }) {
  this.log('siteKey', window.document.sitekey)
  try {
    const response = await fetch(`${this.apiUrl}/${url}`, {
      method,
      headers: {
        'accept': '*/*',
        'site-key': window.document.sitekey
      },
      body: date ? JSON.stringify(date) : ''
    });
    return (await response.json())?.data;
  } catch (error) {
    return null;
  }
}