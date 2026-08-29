const { input, select } = require("@inquirer/prompts");

let PLATES_ENTERED = [];
let PLATES_EXIT = [];
let PLATES_PAID = [];

async function CarEnter() {
  let d = new Date();
  let time = d.toTimeString().split(" ")[0];
  const carEntered = (await input({ message: "number-plate" })).replace(
    /\s/g,
    "",
  );
  //^ can include a check to make sure car entered field is not empty
  return PLATES_ENTERED.push(carEntered + `/${time}`);
}

function timeToSeconds(timeStr) {
  const [hours, minutes, seconds] = timeStr.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}

async function Checkout() {
  let d = new Date();
  const currentTime = d.toTimeString().split(" ")[0];

  let PlateNumberToCheckout = await input({
    message: "Enter you license plate number:",
  });

  let timeEntered;
  const findPlate = PLATES_ENTERED.find((p) => {
    let startWith = p.split("/")[0];
    timeEntered = p.split("/")[1];
    return startWith == PlateNumberToCheckout;
  });

  if (!findPlate) {
    return console.log("Plate not found");
  }

  let convertTimeToSeconds =
    timeToSeconds(currentTime) - timeToSeconds(timeEntered);

  const hoursSpent = Math.floor(convertTimeToSeconds / 3600);
  const minutesSpent = Math.floor((convertTimeToSeconds % 3600) / 60);
  const totalMinutes = hoursSpent * 60 + minutesSpent;

  if (totalMinutes < 10) {
    console.log("Free parking.");
  } else if (totalMinutes <= 30) {
    console.log("Parking fee R15.00");
  } else if (totalMinutes <= 90) {
    console.log("Parking fee R30.00");
  } else {
    console.log("Parking fee R45.00");
  }

  const findIndexOfPlate = PLATES_ENTERED.findIndex((p) => p === findPlate);
  if (findIndexOfPlate !== -1) {
    PLATES_PAID.push(findPlate);
    PLATES_ENTERED.splice(findIndexOfPlate, 1); // mutates in place, removes 1 item
  }

  return console.log("Thanks for shopping with us!");
}

async function PlatesScanningSystem() {
  do {
    let actionType = await select({
      message: "Action Type",
      choices: [
        {
          name: "car entering",
          value: "car entering",
          description: "Car entering gates",
        },
        {
          name: "checkout",
          value: "checkout",
          description: "Car Checking out lot",
        },
        {
          name: "car exit",
          value: "car exit",
          description: "Car leaving parking lot.",
        },
        {
          name: "close",
          value: "close",
          description: "Stop system",
        },
      ],
    });
    // console.log(actionType);

    switch (actionType) {
      case "car entering":
        await CarEnter();
        break;
      case "checkout":
        await Checkout();
        break;
      case "car exit":
        console.log("Drive safe!");
        break;
      case "close":
        PLATES_ENTERED = [];
        break;
    }
  } while (PLATES_ENTERED.length > 0);
}

PlatesScanningSystem();
