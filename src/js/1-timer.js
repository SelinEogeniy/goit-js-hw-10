import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  input: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('[data-start]'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

const timer = {
  deadline: null,
  intervalId: null,
  isActive: false,
  refs,

  init() {
    this.refs.startBtn.disabled = true;
    flatpickr(this.refs.input, {
      enableTime: true,
      time_24hr: true,
      defaultDate: new Date(),
      minuteIncrement: 1,
      onClose: selectedDates => {
        const selected = selectedDates[0];

        if (selected <= new Date()) {
          this.refs.startBtn.disabled = true;
          iziToast.error({
            title: 'Помилка',
            message: 'Please choose a date in the future',
          });
        } else {
          this.deadline = selected;
          this.refs.startBtn.disabled = false;
        }
      },
    });

    this.refs.startBtn.addEventListener('click', () => this.start());
  },

  start() {
    if (this.isActive || !this.deadline) return;

    this.isActive = true;
    this.refs.startBtn.disabled = true;
    this.refs.input.disabled = true;

    this.intervalId = setInterval(() => {
      const diff = this.deadline - Date.now();

      if (diff <= 0) {
        this.stop();
        this.updateInterface(0, 0, 0, 0);
        this.refs.input.disabled = false;
        return;
      }

      const { days, hours, minutes, seconds } = this.getTimeComponents(diff);
      this.updateInterface(days, hours, minutes, seconds);
    }, 1000);
  },

  stop() {
    clearInterval(this.intervalId);
    this.isActive = false;
  },

  getTimeComponents(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor((ms % hour) / minute);
    const seconds = Math.floor((ms % minute) / second);

    return { days, hours, minutes, seconds };
  },

  updateInterface(days, hours, minutes, seconds) {
    this.refs.days.textContent = this.pad(days);
    this.refs.hours.textContent = this.pad(hours);
    this.refs.minutes.textContent = this.pad(minutes);
    this.refs.seconds.textContent = this.pad(seconds);
  },

  pad(value) {
    return String(value).padStart(2, '0');
  },
};

timer.init();
