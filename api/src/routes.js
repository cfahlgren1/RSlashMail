const router = require("express").Router();
const { addUserToList } = require("./addUserToList");

router.get("/", (req, res) => {
  res.status(200).send("Detectify Cloud API!").end();
});

router.get("/typeform", (req, res) => {
  res.status(200).send("TypeForm API!").end();
});

// TypeForm WebHook API to retrieve responses to questionaire
router.post("/typeform", async (req, res) => {
  const body = req.body;
  const answers = body.form_response.answers;

  // get answers from form
  const name = answers[0].text;
  const email = answers[1].email;
  let choices = answers[2].choices.labels;
  const sendNow = answers[3].boolean;

  // tag and add user to mailchimp list
  const subscribingUser = {
    firstName: name,
    email: email,
  };

  choices = choices.map((choice) => {
    if (choice === "r/wallstreetbets") {
      return "R/WSB";
    } else if (choice === "r/funny") {
      return "R/Funny";
    } else if (choice === "r/memes") {
      return "R/Memes";
    }
    return choice;
  });

  const options = {
    choices: choices,
    sendNow: sendNow,
  };

  await addUserToList(subscribingUser, options);
  res.status(200).send("TypeForm Received!").send();
});

module.exports = router;
