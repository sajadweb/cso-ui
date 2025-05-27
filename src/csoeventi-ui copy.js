class CsoeventiUi {

  static init(config) {
    const instance = new CsoeventiUi(config);

    (async () => {
      await instance.setupEvents();
      await instance.checkAuth();
      instance.render();
    })()
    return instance;
  }

  constructor(config) {
    this.config = config;
    this.isOpen = false;
    this.user = null;
    this.id = config?.id || 'csoeventi-ui';
    this.apiUrl = config?.apiUrl || 'https://api.csoeventi.com';
  }
  log(...str) {
    if (this.config?.debug) {
      console.log('CsoeventiUi', str)
    }
  }
  render() {
    this.container = document.createElement('div');
    this.container.id = 'csoeventi-container';
    this.container.innerHTML = `
        <div class="csoeventi-container" >
         <div class="csoeventi-details-panel">
            <div class="specialist-info">
              Specialist CSO
            </div>
            <h2 class="event-title">Book an appointment with one of our product specialists</h2>
            <div class="event-meta">
              <div class="event-duration">
                <img src="/path/to/clock-icon.svg" alt="Duration Icon" />
                1 hr
              </div>
              <div class="event-web-conf">
                 <img src="/path/to/video-icon.svg" alt="Video Icon" />
                 Web conferencing details provided upon confirmation.
              </div>
            </div>
            <p class="event-description">
              Choose the date and time to book an appointment with a CSO product specialist to find out in detail the news and features of our products.
            </p>
            <a href="#" class="cookie-settings">Cookie settings</a>
         </div>

         <div class="csoeventi-calendar-panel">
           <div class="powered-by">POWERED BY Calendly</div>
           <h3 class="panel-title">Select a Date & Time</h3>
           <div class="calendar-header">
             <button class="nav-arrow prev-month">&lt;</button>
             <span class="current-month-year">May 2025</span>
             <button class="nav-arrow next-month">&gt;</button>
           </div>
           <div class="calendar-days-header">
             <span class="day-label">SUN</span>
             <span class="day-label">MON</span>
             <span class="day-label">TUE</span>
             <span class="day-label">WED</span>
             <span class="day-label">THU</span>
             <span class="day-label">FRI</span>
             <span class="day-label">SAT</span>
           </div>
           <div class="calendar-grid">
             <!-- Calendar days will be inserted here by JavaScript -->
           </div>
            <div class="timezone-selector">
                <img src="/path/to/globe-icon.svg" alt="Timezone Icon" />
                Tehran Time (12:24pm) ▾
            </div>
         </div>
        </div>
      `;
    document.getElementById(this.id).innerHTML = '';
    document.getElementById(this.id).appendChild(this.container);
    this.addEventListeners();
  }

  async setupEvents() {
    const init = await this.loadConfig();
    this.log(init)
    this.app = init?.data;
  }

  getTime(date) {
    if (!(date instanceof Date) || isNaN(date)) {
      this.log('Invalid Date object');
      return null;
    }

    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';

    // Convert 24h format to 12h format
    const formattedHours = hours % 12 || 12; // Handle midnight (0 => 12)

    return `${formattedHours}:${minutes} ${period}`;
  }
  async checkAuth() {
    //next version
  }
  addEventListeners() {

    this.container.querySelector('.chat-toggle').addEventListener('click', () => {
      this.container.classList.toggle('open');
    });


    this.container.querySelector('.chat-close-btn').addEventListener('click', () => {
      this.container.classList.toggle('open');
    });


    this.container.querySelector('.chat-send-btn').addEventListener('click',
      this.sendMessage.bind(this)
    );


    this.container.querySelector('#chat-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.sendMessage();
      }
    });
  }
  async sendMessage() {
    const input = this.container.querySelector('#chat-input');
    const message = input.value.trim();
    this.log('message', message)
    if (!message) return;
    this.showTypingIndicator();
    try {

      this.renderMessage({
        text: message,
        isUser: true,
        timestamp: new Date()
      });


      input.value = '';


      const response = await fetch(`${this.apiUrl}/openai/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'site-key': this.config?.siteKey,
          // 'Authorization': `Bearer ${this.user?.token}`
        },
        body: JSON.stringify({ msg: message })
      });

      const data = await response.json();
      this.log('data', data)

      this.renderMessage({
        text: data.data,
        isUser: false,
        timestamp: new Date()
      });

    } catch (error) {
      console.error('Error sending message:', error);

    }
    this.hideTypingIndicator();
  }
  showTypingIndicator() {
    const statusElement = this.container.querySelector('.chat-status');
    if (statusElement) {
      statusElement.style.display = 'flex';
    }
  }

  hideTypingIndicator() {
    const statusElement = this.container.querySelector('.chat-status');
    if (statusElement) {
      statusElement.style.display = 'none';
    }
  }
  renderMessage(message) {
    const messagesContainer = this.container.querySelector('.chat-body');
    const messageDiv = document.createElement('div');

    messageDiv.className = `chat-message ${message.isUser ? 'user-message' : 'other-message'
      }`;

    messageDiv.innerHTML = `
      ${message.text}
      <span class="message-meta">${this.getTime(message.timestamp)}</span>
    `;

    messagesContainer.appendChild(messageDiv);


    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  loadConfig() {
    this.log('siteKey', this.config?.siteKey)
    return fetch(`${this.apiUrl}/openai`, {
      method: 'GET',
      headers: {
        'accept': '*/*',
        'site-key': this.config?.siteKey
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // or response.text() if not JSON
      }).catch(e => e);
  }
}