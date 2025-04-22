// our emailing functions goes here
const sgMail = require("@sendgrid/mail");

const sendEmail = async (userEmail, storyTitle, userName) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: userEmail, // Change to your recipient
    from: "kaviya.sivaraj1507@gmail.com", // Change to your verified sender
    subject: `✍️ Your story ${storyTitle} is ready to edit!`,
    text: "Hey there user" + userName,
    html: `Wanna dive back into writing? Your story <strong> “${storyTitle}” </strong> is now available for editing.
Let your creativity flow — the next chapter awaits! 📖✨

    Happy writing,
    – The Plotline Team`,
  };
  let response = await sgMail.send(msg);
  console.log(" email Response", response);
  return response;
};
// sendEmail("zlx20010815@gmail.com", "", "abe");
module.exports = { sendEmail };
