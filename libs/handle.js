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
  const filename = Date.now();
  for (i = 4; i <= data.length + 3; i++) {
    if (
      worksheet["A" + i] != undefined &&
      worksheet["E" + i] != undefined &&
      worksheet["G" + i] != undefined &&
      worksheet["H" + i] != undefined
    ) {
      let id = worksheet["A" + i].v;
      let timein = worksheet["G" + i].v;
      let timeout = worksheet["H" + i].v;
      let date = chageDateIfNightShift(worksheet["E" + i].v, timein, timeout);

      let str =
        id +
        "\t" +
        date +
        " " +
        timein +
        "\t" +
        "2 \t 0 \r\n" +
        id +
        "\t" +
        date +
        " " +
        timeout +
        "\t" +
        "2 \t 0 \r\n";
      fs.appendFileSync(
        path.join(__dirname, `../public/chamcong/${filename}.txt`),
        str,
        "utf8"
      );
    }
  }
};

function chageDateIfNightShift(date, timein, timeout) {
  let d = new Date(date);
  let newDate = new Date(d);
  const hourIn = parseInt(timein.slice(0, 2));
  const hourOut = parseInt(timeout.slice(0, 2));

  if (hourIn > hourOut && hourIn >= 19) {
    //return true if the time is more than 19:00:00
    newDate.setDate(d.getDate() + 2);
    return newDate.toISOString().slice(0, 10);
  } else {
    //return false if the time is less than 19:00:00
    newDate.setDate(d.getDate() + 1);
    return newDate.toISOString().slice(0, 10);
  }
}
