ratelimits = new Array();

module.exports = (message, truthy, type) => {
  if (type == "mod") {
    if (truthy) {
      ratelimits.push(message.author.id);
    } else {
      ratelimits.pop(message.author.id);
    }
  }

  if (ratelimits.includes(message.author.id)) {
    ratelimited = true;
  } else {
    ratelimited = false;
  }
  return ratelimited;
};
