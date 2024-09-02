const messageContainer = document.querySelector("#d-day-message");
const container = document.querySelector("#d-day-container");
const savedDate = localStorage.getItem("saved-date");
console.log(savedDate);
const intervalIdArr = [];

const dateFormMaker = function () {
  const inputYear = document.getElementById("target-year-input").value;
  const inputMonth = document.getElementById("target-month-input").value;
  const inputDate = document.getElementById("target-date-input").value;

  // const dateFormet = inputYear + "-" + inputMonth + "-" + inputDate;
  const dateFormet = `${inputYear}-${inputMonth}-${inputDate}`;

  return dateFormet;

  // console.log(inputYear, inputMonth, inputDate);
};

const counterMaker = function (data) {
  // console.log(data);
  if (data !== savedDate) {
    localStorage.setItem("saved-date", data);
  }

  const nowDate = new Date();
  const targetDate = new Date(data).setHours(0, 0, 0, 0);
  const remaining = (targetDate - nowDate) / 1000;

  if (remaining <= 0) {
    // 만약, remaining이 0이라면, 타이머가 종료되었습니다. 출력
    // console.log("타이머가 종료되었습니다.");
    container.style.display = "none";
    messageContainer.innerHTML = "<span class='info-txt'>타이머가 종료되었습니다.</span>";
    messageContainer.style.display = "flex";
    setClearInterval();
    return;
  } else if (isNaN(remaining)) {
    // 만약, 잘못된 날짜가 들어왔다면, 유효한 시간대가 아닙니다. 출력
    // console.log("유효한 시간대가 아닙니다.");
    localStorage.removeItem("saved-date");
    container.style.display = "none";
    messageContainer.innerHTML = "<span class='info-txt'>유효한 시간대가 아닙니다.</span>";
    messageContainer.style.display = "flex";
    setClearInterval();
    return;
  }

  //   const remainingDate = Math.floor(remaining / 3600 / 24);
  //   const remainingHours = Math.floor(remaining / 3600) % 24;
  //   const remainingMin = Math.floor(remaining / 60) % 60;
  //   const remainingSec = Math.floor(remaining) % 60;

  const remainingObj = {
    remainingDate: Math.floor(remaining / 3600 / 24),
    remainingHours: Math.floor(remaining / 3600) % 24,
    remainingMin: Math.floor(remaining / 60) % 60,
    remainingSec: Math.floor(remaining) % 60,
  };

  //   const days = document.getElementById("days");
  //   const hours = document.getElementById("hours");
  //   const min = document.getElementById("min");
  //   const sec = document.getElementById("sec");

  // for (let i = 0; i < timeKeys.length; i = i + 1) {
  //   documentObj[docKeys[i]].textContent = remainingObj[timeKeys[i]];
  // }

  const timeKeys = Object.keys(remainingObj);
  const documentArr = ["days", "hours", "min", "sec"];
  const format = function (time) {
    if (time < 10) {
      return "0" + time;
    } else {
      return time;
    }
  };

  let i = 0;
  for (let tag of documentArr) {
    const remainingTime = format(remainingObj[timeKeys[i]]);
    document.getElementById(tag).textContent = remainingTime;
    i++;
  }

  // const documentObj = {
  //   days: document.getElementById("days"),
  //   hours: document.getElementById("hours"),
  //   min: document.getElementById("min"),
  //   sec: document.getElementById("sec"),
  // };

  // let i = 0;
  // for (let key in documentObj) {
  //   documentObj[key].textContent = remainingObj[timeKeys[i]];
  //   i++;
  // }

  // documentObj["days"].textContent = remainingObj["remainingDate"];
  // documentObj["hours"].textContent = remainingObj["remainingHours"];
  // documentObj["min"].textContent = remainingObj["remainingMin"];
  // documentObj["sec"].textContent = remainingObj["remainingSec"];

  //   console.log(remainingDate, remainingHours, remainingMin, remainingSec);
};

// const starter = function (targetDateInput) {
//   if (!targetDateInput) {
//     targetDateInput = dateFormMaker();
//   }
//   container.style.display = "flex";
//   messageContainer.style.display = "none";
//   setClearInterval();
//   counterMaker(targetDateInput);
//   const intervalId = setInterval(() => {
//     counterMaker(targetDateInput);
//   }, 1000);
//   intervalIdArr.push(intervalId);

//   // for (let i = 0; i < 100; i++) {
//   //   setTimeout(counterMaker, 1000 * i);
//   // }
// };
const starter = function (targetDateInput) {
  if (!targetDateInput) {
    targetDateInput = dateFormMaker();
  }

  // 기존 타이머를 정리하기 전에 로컬 스토리지에서 데이터를 삭제하지 않도록 수정
  // setClearInterval(); 이 부분을 위로 이동
  setClearInterval();

  container.style.display = "flex";
  messageContainer.style.display = "none";

  // 이후 새로 입력된 날짜를 로컬 스토리지에 저장
  if (targetDateInput !== savedDate) {
    localStorage.setItem("saved-date", targetDateInput);
  }

  counterMaker(targetDateInput);

  const intervalId = setInterval(() => {
    counterMaker(targetDateInput);
  }, 1000);
  intervalIdArr.push(intervalId);
};

const setClearInterval = function () {
  // 로컬 스토리지에서 데이터를 삭제하지 않도록 수정
  for (let i = 0; i < intervalIdArr.length; i++) {
    clearInterval(intervalIdArr[i]);
  }
  intervalIdArr.length = 0; // 배열 초기화
};

const resetTimer = function () {
  container.style.display = "none";
  messageContainer.innerHTML = "<span class='info-txt'>D-Day를 입력해 주세요.</span>";
  messageContainer.style.display = "flex";

  // 타이머 리셋 시에만 로컬 스토리지에서 데이터를 삭제
  localStorage.removeItem("saved-date");
  setClearInterval();
};

if (savedDate) {
  // console.log(savedDate);
  starter(savedDate);
} else {
  // console.log("data is null");
  container.style.display = "none";
  messageContainer.innerHTML = "<span class='info-txt'>D-Day를 입력해 주세요.</span>";
}
