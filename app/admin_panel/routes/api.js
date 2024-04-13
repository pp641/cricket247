const express = require('express');
const router = express.Router();


const api_controller = require('../controller/api_controller');
/* GET users listing. */
router.post('/getMatch_data',api_controller.getMatch_data);

router.post('/getMatch_data_all',api_controller.getMatch_data_all);

router.post('/incData',api_controller.incData);

router.post('/descData', api_controller.descData);

router.post('/updateStatus', api_controller.updateStatus);

router.post('/updateStatusAll', api_controller.updateStatusAll);

router.post('/updateStatusAll_user', api_controller.updateStatusAll_user);

router.post('/showhide',api_controller.showhide);

router.post('/getModelInfo',api_controller.getModelInfo);

router.post('/updatedata',api_controller.updatedata);

router.post('/updatehideshowAll',api_controller.updatehideshowAll);

router.post('/updatehideshowAll_user', api_controller.updatehideshowAll_user);

router.post('/getallData',api_controller.getallData);

router.post('/getuserlist',api_controller.getuserlist);

router.post('/update_users',api_controller.update_users)

router.post('/news_update', api_controller.news_update);

router.post('/getNews',api_controller.getNews);

router.post('/score_update',api_controller.score_update);

router.post('/getscore',api_controller.getScore);

router.post('/update_rank', api_controller.update_rank);

router.post('/delete_ball',api_controller.delete_ball);

router.post('/curr_over_dt',api_controller.curr_over_dt);

router.post('/updateOverRuns',api_controller.updateOverRuns);

router.post('/getinning',api_controller.getinning);

router.post('/addinning',api_controller.addinning);

router.post('/addOver',api_controller.addOver);

router.post('/removeinning',api_controller.removeinning);

router.post('/removeOver',api_controller.removeOver);

router.get('/refresh_status',api_controller.refresh_status);

router.get('/refresh_showhide',api_controller.refresh_showhide);

router.get('/refresh_all', api_controller.refresh_all);

router.get("/getloginUser",api_controller.getloginUser);

//Market Link
router.post('/add_market_link',api_controller.add_market_link);

router.post('/getlinkedMarkets',api_controller.getlinkedMarkets);

router.post('/incdecDataMarketLink',api_controller.incdecDataMarketLink);

router.post('/updateMainNews',api_controller.updateMainNews);
//Ball Running 

router.post('/delete_market',api_controller.delete_market);

router.post('/getBallRunning', api_controller.getBallRunning);

router.post('/updateball_running', api_controller.updateball_running);

router.post('/resetball_running', api_controller.resetball_running);

router.post('/addMarketNew',api_controller.addMarketNew);

router.post('/updatescore',api_controller.updatescore);

router.post('/update_wicket',api_controller.update_wicket);

module.exports = router;
