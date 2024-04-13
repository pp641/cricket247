var express = require('express');
var router = express.Router();

var api_controller = require("../controller/api_controller.js");

/* GET users listing. */
router.post('/getLayoff', api_controller.getLayoff);

router.post('/getmatchodds', api_controller.getMatchOdds);

router.post('/getlayoffUpdateTime', api_controller.getlayoffUpdateTime);

router.post('/getMatchoddsUpdateTime', api_controller.getMatchoddsUpdateTime);

router.post('/getBallRunning',api_controller.getBallRunning);
router.post('/getBallRunning2',api_controller.getBallRunning2);

router.post('/getNews',api_controller.getNews);

router.post('/getOversRuns',api_controller.getOversRuns);

router.get("/cricket_audio/:text/:match_id",api_controller.cricket_audio)

router.get("/getloginUser",api_controller.getloginUser);
router.post('/update_user_log',api_controller.update_user_log);
router.post('/getNewsMain',api_controller.getNewsMain);
router.post('/getScore',api_controller.getScore);
module.exports = router;
