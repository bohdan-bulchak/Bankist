'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2022-07-10T17:01:17.194Z',
    '2022-07-12T23:36:17.929Z',
    '2022-07-13T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2022-07-10T14:43:26.374Z',
    '2022-07-12T18:49:59.371Z',
    '2022-07-13T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();

  // return `${day}/${month}/${year}`;

  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  containerMovements.innerHTML = '';

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formatedMov = formatCur(mov, acc.locale, acc.currency);

    // = new Intl.NumberFormat(acc.locale, {
    //   style: 'currency',
    //   currency: acc.currency,
    // }).format(mov);

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${formatedMov}</div>
    </div>
  `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};

createUsernames(accounts);

const updateUI = function (acc) {
  displayMovements(acc);
  calcDisplayBalance(acc);
  calcDisplaySummer(acc);
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.floor(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log out user

    if (time === 0) {
      clearTimeout(timer);
      labelWelcome.textContent = `Log in to get started
      `;
      containerApp.style.opacity = 0;
    }

    // Decrease 1s

    time--;
  };
  // Set timer to 5 minutes

  let time = 300;

  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);

  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);

  //  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

const calcDisplaySummer = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);

  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);

  labelSumOut.textContent = formatCur(
    Math.abs(outcomes),
    acc.locale,
    acc.currency
  );

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => mov * (acc.interestRate / 100))
    .filter((int, i, arr) => int > 1)
    .reduce((acc, cur) => acc + cur, 0);

  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

// Event handlers

let currentAccount, timer;
// FAKE ALWAYS LOGGED IN

currentAccount = account1;
updateUI(account1);
containerApp.style.opacity = 100;
timer = startLogOutTimer();
// Experiment API
// const now = new Date();
// const options = {
//   hour: 'numeric',
//   minute: 'numeric',
//   day: 'numeric',
//   month: 'long',
//   year: 'numeric',
//   weekday: 'long',
// };
// const locale = navigator.language;

// labelDate.textContent = new Intl.DateTimeFormat(
//   'en-GB' /*locale*/,
//   options
// ).format(now);

// day/month/year

btnLogin.addEventListener('click', function (e) {
  //Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message

    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Create curr date
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'long',
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // Clear the input Field
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    if (timer) clearTimeout(timer);
    timer = startLogOutTimer();

    // Display balance, summ, and movements
    updateUI(currentAccount);
  }

  // console.log(currentAccount);
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //  Add a date

    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);

    // Reset Timer

    clearTimeout(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);

  if (
    amount &&
    amount > 0 &&
    currentAccount.movements.some(mov => mov >= amount * 0.1)
  ) {
    setTimeout(function () {
      currentAccount.movements.push(amount);
      //  Add a date

      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);
    }, 2500);
  }
  inputLoanAmount.value = '';

  // Reset Timer

  clearTimeout(timer);
  timer = startLogOutTimer();
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  // const acc = accounts.find(acc => acc.username === inputCloseUsername.value);

  if (
    +inputClosePin.value === currentAccount.pin &&
    inputCloseUsername.value === currentAccount.username
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    // console.log(index);
    inputClosePin.value = inputCloseUsername.value = '';
    accounts.splice(index, 1);
    console.log(accounts);
    containerApp.style.opacity = 0;
    console.log(currentAccount);
  }
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// Converting and checking numbers

/*
console.log(23 === 23.0);
console.log(0.1 + 0.2);

// Conversion

console.log(Number('23'));
console.log(+'23');

// Parsing

console.log(Number.parseInt('30px'));

console.log(Number.parseFloat('2.5rem'));

// Check if value is Not a Number

console.log(Number.isNaN(+'20x'));

// Check if value is number
console.log(Number.isFinite(23 / 0));
console.log(Number.isFinite(23));
console.log(Number.isFinite('23'));

*/

// Math and Rounding

/*


console.log(Math.sqrt(25));

console.log(Math.max(5, 18, 23, 11, 2));

console.log(Math.max(5, 18, 23, 11, 2, '34'));

console.log(Math.max(5, 18, 23, 11, 2, '34px'));

console.log(Math.min(5, 18, 23, 11, 2));

console.log(Math.PI * Number.parseFloat('10px') ** 2);

// numb between 0 and 1
console.log(Math.floor(Math.random() * 6) + 1);
const randomInt = (min, max) =>
  Math.trunc(Math.random() * (max - min) + 1) + min;

console.log(randomInt(6, 9));

// Rounding integers

console.log(Math.trunc(23.3));
console.log(Math.trunc(23.9));

console.log(Math.round(23.9));
console.log(Math.round(23.3));

console.log(Math.ceil(23.3));
console.log(Math.ceil(23.9));
// floor is the same as trink inly with positive numbers
console.log(Math.floor(23.3));
console.log(Math.floor(23.9));

console.log(Math.trunc(-23.3));
console.log(Math.floor(-23.3));

// Rounding decimals
console.log((2.7).toFixed(0));
console.log((2.7).toFixed(3));
console.log(+(2.345).toFixed(2));


*/

// The remainder operator

/*


console.log(5 % 2);

labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    if (i % 2 === 0) row.style.backgroundColor = 'orangered';
  });
});

*/

// Numeric Separators

/*

const diametr = 287_460_000_000;
console.log(diametr);

const priceCents = 345_99;
console.log(priceCents);

const transferFee1 = 15_00;
const transferFee2 = 1_500;

const PI = 3.1415;
console.log(PI);

console.log(Number('230_000'));
console.log(Number('230000'));

console.log(parseInt('230_000'));

*/

// BigInt data type

/*


console.log(2 ** 53 - 1);
console.log(2 ** 53 + 0);
console.log(2 ** 53 + 1);

console.log(Number.MAX_SAFE_INTEGER);

console.log(5487184896546531653486562389598456);
console.log(5487184896546531653486562389598456n);
console.log(BigInt(5487184896546531653486562389598456));

console.log(10000n + 10000n);
console.log(14568468486514845624154021548017818751817n * 100000000n);
console.log(10n * BigInt(10));

// console.log(10n * 10);

// Exceptions
console.log(20n > 15);
console.log(20n == 20);
console.log(20n === 20);

console.log(14568468486514845624154021548017818751817n + ' is realy big');

// Divisions

console.log(10n / 3n);
console.log(10 / 3);


*/

// Creating Datas

/*
const now = new Date();
console.log(now);
console.log(new Date('Wed Jul 13 2022 22:59:11'));
console.log(new Date('December 24, 2015'));
console.log(new Date(account1.movementsDates[0]));
console.log(new Date(2037, 10, 19, 14, 23, 5));
console.log(new Date(2037, 10, 31));

console.log(new Date(0));

console.log(new Date(3 * 24 * 60 * 60 * 1000));

const future = new Date(2037, 10, 19, 15, 23);
console.log(future);
console.log(future.getFullYear());

console.log(future.getMonth());

console.log(future.getDate());

console.log(future.getDay());
console.log(future.getHours());
console.log(future.getMinutes());

console.log(future.getSeconds());

console.log(future.toISOString());

console.log(future.getTime());

console.log(Date.now());

future.setFullYear(2040);
console.log(future);

*/

// Operations with Dates

/*


const future = new Date(2037, 10, 19, 15, 23);
console.log(+future);

// Sub dates

const calcDaysPassed = (date1, date2) =>
  Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);

const days1 = calcDaysPassed(new Date(2037, 3, 14), new Date(2037, 3, 24));
console.log(days1);


*/

// Internationalizing Dates (IntL)

// Internatiolizing Numbers

/*



const num = 1342532.41;

const options = {
  // style: 'unit',
  style: 'currency',
  // unit: 'mile-per-hour',
  // unit: 'celsius',
  currency: 'EUR',
};

console.log('US:', new Intl.NumberFormat('en-US', options).format(num));

console.log('Germany:', new Intl.NumberFormat('de-DE', options).format(num));

console.log('Syria:', new Intl.NumberFormat('ar-SY', options).format(num));

console.log(
  'Browser:',
  new Intl.NumberFormat(navigator.language, options).format(num)
);

*/

// Timers

const ingridients = ['olives', 'spinach'];

const pizzaTimer = setTimeout(
  (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2}`),
  3000,
  ...ingridients
);
console.log('Waiting...');

if (ingridients.includes('spinach')) clearTimeout(pizzaTimer);

// setInterval

setInterval(function () {
  const now = new Date();
  console.log(now);
}, 1000);
