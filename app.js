const { input, select } = require("@inquirer/prompts");

let PLATES_ENTERED = [];
let PLATES_EXIT = [];
let PLATES_PAID = [];

async function CarEnter(time) {
  let d = new Date();
  time = d.toTimeString().split(" ")[0];
  const carEntered = (await input({ message: "number-plate" })).replace(
    /\s/g,
    "",
  );
  //^ can include a check to make sure car entered field is not empty
  return PLATES_ENTERED.push(carEntered + `/${time}`);
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

  const findIndexOfPlate = PLATES_ENTERED.findIndex((p) => p === findPlate);
  if (findIndexOfPlate !== -1) {
    PLATES_PAID.push(findPlate);
    const removedItem = PLATES_ENTERED.splice(findIndexOfPlate, 1); // mutates in place, removes 1 item
    console.log("________________________________________________");
    console.log(`Item removed: ${removedItem}`);
    console.log("________________________________________________");
  } else {
    console.log("Plate not found");
  }
  console.log("________________________________________________");
  console.log(`Index of item in array : ${findIndexOfPlate}`);
  console.log(`Array after cut${PLATES_ENTERED}`);
  console.log(`Time entered: ${timeEntered}\n Current time ${currentTime}`);
  console.log(`Plate paid for : ${PLATES_PAID}`);
  console.log("________________________________________________");

  return console.log(findPlate);
}

async function PlatesScanningSystem() {
  let timeStart;
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
        console.log("Hello and welcome!");
        await CarEnter(timeStart);
        console.log(PLATES_ENTERED);
        break;
      case "checkout":
        console.log("Thanks for visiting with us");
        await Checkout();
        console.log(PLATES_PAID);
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
