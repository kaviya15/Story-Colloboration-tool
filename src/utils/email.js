// our emailing functions goes here
const sgMail = require("@sendgrid/mail");

module.exports.sendEmail = async (userEmail, storyTitle, userName) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: userEmail, // Change to your recipient
    from: "kaviya.sivaraj1507@gmail.com", // Change to your verified sender
    subject: "Message from Plotline",
    text: "Hey there user" + userName,
    html: `<strong>Wanna write some story ??? The story <em> ${storyTitle} </em> is available to edit now.  </strong>`,
  };
  let response = await sgMail.send(msg);
  console.log(" email Response", response);
  return response;
};
