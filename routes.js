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
router.post("/settings/updateFirstname", dashboard.updateFirstName);
router.post("/settings/updateLastname", dashboard.updateLastName);
router.post("/settings/updateEmail", dashboard.updateEmail);
router.post("/settings/updatePassword", dashboard.updatePassword);
router.post("/settings/updateAddress", dashboard.updateAddress);
router.post("/settings/updateHeight", dashboard.updateHeight);


router.post("/dashboard/memberAddAssessment", dashboard.memberAddAssessment);
router.get("/dashboard/removeAssessment/:assessmentid", dashboard.removeAssessment);

router.get("/dashboard/memberGoals", dashboard.memberGoals);
router.post("/dashboard/memberAddGoal", dashboard.memberAddGoal);
router.get("/dashboard/removeGoal/:goalid", dashboard.removeGoal);

router.get("/trainerDashboard/trainerViewAssessments/:memberid",trainerDashboard.trainerViewAssessments);
router.get("/trainerDashboard/:memberid/removeAssessment/:assessmentid",trainerDashboard.removeAssessment);
router.post("/trainerDashboard/:memberid/updateComment/:assessmentid",trainerDashboard.updateComment);
router.get("/trainerDashboard/removeMember/:memberid", trainerDashboard.removeMember);

router.get("/trainerDashboard/trainerGoals", trainerDashboard.trainerGoals);
router.post(  "/trainerDashboard/trainerAddGoal",trainerDashboard.trainerAddGoal);

router.get('/trainerDashboard/trainerGoals', trainerDashboard.trainerGoals);
router.post('/trainerDashboard/trainerAddGoal', trainerDashboard.trainerAddGoal);
router.get('/trainerDashboard/removeGoal/:goalid', trainerDashboard.removeGoal);

router.get('/trainerDashboard/:memberid/trainerUpdateGoal/:goalid', trainerDashboard.trainerUpdateGoal);
router.post('/trainerDashboard/editTargetDate/:goalid', trainerDashboard.editTargetDate);
router.post('/trainerDashboard/editTargetArea/:goalid', trainerDashboard.editTargetArea);
router.post('/trainerDashboard/editTargetGoal/:goalid', trainerDashboard.editTargetGoal);


module.exports = router;
