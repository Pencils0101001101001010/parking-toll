const { input, select } = require("@inquirer/prompts");

let PLATES_ENTERED = [];
let PLATES_EXIT = [];
let PLATES_PAID = [];

function timeToSeconds(timeStr) {
  const [hours, minutes, seconds] = timeStr.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}

function normalizePlates(plate) {
  return plate.replace(/\s/g, "").toLowerCase();
}

async function CarEnter() {
  let d = new Date();
  let time = d.toTimeString().split(" ")[0];
  const carEntered = normalizePlates(await input({ message: "number-plate" }));

  if (!carEntered) {
    console.log("Plate number can not be empty.");
    return;
  }

  //^ can include a check to make sure car entered field is not empty
  return PLATES_ENTERED.push(carEntered + `/${time}`);
}

async function Checkout() {
  let d = new Date();
  const currentTime = d.toTimeString().split(" ")[0];

  let PlateNumberToCheckout = normalizePlates(
    await input({
      message: "Enter you license plate number:",
    }),
  );

  if (!PlateNumberToCheckout) {
    console.log("Plate number can not be empty.");
    return;
  }

  let timeEntered;
  const findPlate = PLATES_ENTERED.find((p) => {
    let numberPlate = p.split("/")[0];
    timeEntered = p.split("/")[1];
    return numberPlate == PlateNumberToCheckout;
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

async function CarExit() {
  const plateExiting = normalizePlates(
    await input({ message: "Plate at gate" }),
  );

  if (!plateExiting) {
    console.log("Plate number can not be empty.");
    return;
  }

  const findIndexOfPlate = PLATES_PAID.findIndex(
    (p) => p.split("/")[0] === plateExiting,
  );

  if (findIndexOfPlate === -1) {
    console.log("Return to pay station.");
    return;
  }

  const [exitedPlate] = PLATES_PAID.splice(findIndexOfPlate, 1);
  PLATES_EXIT.push(exitedPlate);

  console.log("Drive safe");
}

async function PlatesScanningSystem() {
  let systemRun = true;
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
          name: "off",
          value: "off",
          description: "Stop system",
        },
      ],
    });
    // console.log(actionType);

    switch (actionType) {
      case "car entering":
        await CarEnter();
        // console.log(`Plates entered : ${PLATES_ENTERED}`);
        break;
      case "checkout":
        await Checkout();
        // console.log(`Plates paid : ${PLATES_PAID}`);
        break;
      case "car exit":
        await CarExit();
        // console.log(`Plates exit ${PLATES_EXIT}`);
        break;
      case "off":
        systemRun = false;
        break;
    }
  } while (systemRun);
}

PlatesScanningSystem();
