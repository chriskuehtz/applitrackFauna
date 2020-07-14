/* Api methods to call /functions */

const validate = (u) => {
  return fetch("/.netlify/functions/validate", {
    body: JSON.stringify({ user: u }),
    method: "POST",
  }).then((response) => {
    return response.json();
  });
};
const changePW = (u) => {
  return fetch("/.netlify/functions/changePW", {
    body: JSON.stringify(u),
    method: "POST",
  }).then((response) => {
    return response.json();
  });
};
const read = (u) => {
  return fetch("/.netlify/functions/read", {
    body: JSON.stringify(u),
    method: "POST",
  }).then((response) => {
    return response.json();
  });
};
const update = (l) => {
  return fetch(`/.netlify/functions/update`, {
    method: "POST",
    body: JSON.stringify(l),
  }).then((response) => {
    return response.json();
  });
};

const giveFeedback = (f) => {
  return fetch(`/.netlify/functions/giveFeedback`, {
    method: "POST",
    body: JSON.stringify(f),
  }).then((response) => {
    return response.json();
  });
};
const showTutorial = (s) => {
  return fetch(`/.netlify/functions/showTutorial`, {
    method: "POST",
    body: JSON.stringify(s),
  }).then((response) => {
    return response.json();
  });
};

export default {
  read: read,
  validate: validate,
  update: update,
  giveFeedback: giveFeedback,
  showTutorial: showTutorial,
  changePW: changePW,
};
