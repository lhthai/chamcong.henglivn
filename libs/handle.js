const fs = require("fs");
const path = require("path");

module.exports.handleFile = function() {
  var XLSX = require("xlsx");
  var workbook = XLSX.readFile(
    path.join(__dirname, "../public/upload/file.xlsx"),
    {
      cellDates: true
    }
  );
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(worksheet);
  const getdate = new Date();
  const filename =
    getdate.toISOString().slice(0, 10) +
    "-" +
    getdate.getHours() +
    "" +
    getdate.getMinutes();
  for (i = 4; i <= data.length + 3; i++) {
    if (
      worksheet["A" + i] != undefined &&
      worksheet["E" + i] != undefined &&
      worksheet["G" + i] != undefined &&
      worksheet["H" + i] != undefined
    ) {
      let worker_id = worksheet["A" + i].v;
      let timeIn = worksheet["G" + i].v;

      if (worker_id === "18040223" && timeIn.slice(0, 2) >= 8) {
        timeIn = "07:57";
      }

      let timeOut = worksheet["H" + i].v;
      let workdate = worksheet["E" + i].v;

      // Check night shift
      let strOutput;
      if (checkIfNightShift(timeIn, timeOut)) {
        strOutput = `${worker_id}\t${addDays(
          workdate,
          2
        )} ${timeIn}\t2\t0\r\n${worker_id}\t${addDays(
          workdate,
          3
        )} ${timeOut}\t2\t0\r\n`;
      } else {
        strOutput = `${worker_id}\t${addDays(
          workdate,
          1
        )} ${timeIn}\t2\t0\r\n${worker_id}\t${addDays(
          workdate,
          1
        )} ${timeOut}\t2\t0\r\n`;
      }

      fs.appendFileSync(
        path.join(__dirname, `../public/chamcong/${filename}.txt`),
        strOutput,
        "utf8"
      );
    }
  }
};

// Checking worker works day or night shift
function checkIfNightShift(timeIn, timeOut) {
  const hourIn = parseInt(timeIn.slice(0, 2));
  const hourOut = parseInt(timeOut.slice(0, 2));

  if (hourIn > hourOut && hourIn >= 19) {
    //return true if the time is more than 19:00
    return true;
  } else {
    //return false if the time is less than 19:00
    return false;
  }
}

// Add days to the date you want
function addDays(date, numberOfDays) {
  let d = new Date(date);
  let newDate = new Date(d);
  newDate.setDate(d.getDate() + numberOfDays);

  return newDate.toISOString().slice(0, 10);
}
