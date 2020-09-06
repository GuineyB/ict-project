"use strict";

const logger = require("../utils/logger.js");

const index = {
  index(request, response) {
    logger.info("index rendering");
    const viewData = {
      title: "Welcome to Homers Gym app"
    };
    response.render("index", viewData);
  }
};

module.exports = index;