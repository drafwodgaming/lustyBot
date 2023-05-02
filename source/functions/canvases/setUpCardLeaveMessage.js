const { AttachmentBuilder } = require("discord.js");
const { createCanvas, loadImage } = require("@napi-rs/canvas");
const { registerFont } = require("canvas");
const memberCardBackground = require("../../../config/memberBackground.json");
const botFonts = require("../../../config/botFonts.json");
const botColors = require("../../../config/botColors.json");
const botConfig = require("../../../config/botConfig.json");

async function cardLeaveMessage(member) {
  const { user } = member;
  let username = user.username;
  let avatarURL = user.displayAvatarURL({
    format: "png",
    dynamic: "false",
  });
  let fontSize = 45;
  const canvasColor = botColors.canvasWhite;

  //#region Welcome Canvas
  let canvas = createCanvas(1024, 450);
  let context = canvas.getContext("2d");

  // Image
  let background = await loadImage(memberCardBackground.leave);
  context.drawImage(background, 0, 0, canvas.width, canvas.height);

  //Username
  registerFont(botFonts.luckiestGuyRegular.path, {
    family: botFonts.luckiestGuyRegular.family,
  });

  var textDimensions,
    text = `Goodbye ${username}`;
  do {
    context.fillStyle = canvasColor;
    context.font = `${fontSize} ${botFonts.luckiestGuyRegular.family}`;
    textDimensions = context.measureText(text);
  } while (textDimensions >= canvas.width);

  context.fillText(
    text,
    canvas.width / 2 - textDimensions.width / 2,
    canvas.height - 90
  );

  // Avatar
  context.beginPath();
  context.lineWidth = 10;
  context.strokeStyle = canvasColor;
  context.arc(canvas.width / 2, canvas.height - 270, 100, 0, Math.PI * 2, true);
  context.stroke();
  context.closePath();
  context.clip();
  const img = await loadImage(avatarURL);
  context.drawImage(img, 412, 80, 200, 200);
  context.restore();

  const imageAttachment = new AttachmentBuilder(
    canvas.toBuffer("image/png"),
    botConfig.memberCard.leave
  );
  return imageAttachment;
  //#endregion
}

module.exports = { cardLeaveMessage };
