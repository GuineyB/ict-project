"use strict";

const express = require("express");
const router = express.Router();

const index = require("./controllers/index.js");
const dashboard = require("./controllers/dashboard.js");
const trainerDashboard = require("./controllers/trainerDashboard.js");
const about = require("./controllers/about.js");
const accounts = require("./controllers/accounts.js");
const analytics = require("./controllers/analytics.js");

router.get("/", accounts.index);
router.get("/login", accounts.login);
router.get("/signup", accounts.signup);
router.get("/logout", accounts.logout);
router.post("/register", accounts.register);
router.post("/authenticate", accounts.authenticate);

router.get("/dashboard", dashboard.index);
router.get("/about", about.index);

router.get("/", accounts.index);
router.get("/about", about.index);
router.get("/index", index.index);
router.get("/dashboard", dashboard.index);
router.get("/trainerDashboard", trainerDashboard.index);

router.get("/settings", dashboard.settings);
router.post("/settings/updatefirstname", dashboard.updateFirstName);
router.post("/settings/updatelastname", dashboard.updateLastName);
router.post("/settings/updateemail", dashboard.updateEmail);
router.post("/settings/updatepassword", dashboard.updatePassword);
router.post("/settings/updateaddress", dashboard.updateAddress);
router.post("/settings/updategender", dashboard.updateGender);
router.post("/settings/updateheight", dashboard.updateHeight);
router.post("/settings/updatestartingweight", dashboard.updateStartingWeight);

router.post("/dashboard/memberaddassessment", dashboard.memberAddAssessment);
router.get(
  "/dashboard/removeassessment/:assessmentid",
  dashboard.removeAssessment
);

router.get("/dashboard/membergoals", dashboard.memberGoals);
router.post("/dashboard/memberaddgoal", dashboard.memberAddGoal);
router.get("/dashboard/removegoal/:goalid", dashboard.removeGoal);

router.get(
  "/trainerDashboard/trainerviewassessments/:memberid",
  trainerDashboard.trainerViewAssessments
);
router.get(
  "/trainerDashboard/:memberid/removeassessment/:assessmentid",
  trainerDashboard.removeAssessment
);
router.post(
  "/trainerDashboard/:memberid/updatecomment/:assessmentid",
  trainerDashboard.updateComment
);
router.get(
  "/trainerDashboard/removemember/:memberid",
  trainerDashboard.removeMember
);

router.get("/trainerDashboard/trainergoals", trainerDashboard.trainerGoals);
router.post(
  "/trainerDashboard/traineraddgoal",
  trainerDashboard.trainerAddGoal
);

module.exports = router;
