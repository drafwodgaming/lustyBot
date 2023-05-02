function parseImg() {
  const URL = split(".");
  const imgType = URL[URL.length - 1];
  const imgCheck = /(jpg|png|gif|jpeg)/gi.test(imgType);
  return imgCheck;
}

module.exports = { parseImg };
