const express = require('express');
const con = require('../bin/db');
const router = express.Router();
const date = require('../bin/dateReturn');

router.get('/', function(req,res,next){
  console.log(date.getDateID());
  console.log(date.getNowTime());
  console.log(date.time.getDailyWorkingHours(req.session.user.officeGoingHour, 9.1));
})

/* GET home page. */
router.get('/boss', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.send("Boss Page");
});

router.post('/boss', function(req, res, next){
  if (req.session.grade=="s") res.redirect('/staff');
  const id=req.session.user.id;
  con.query("select storeID from TheWorkDiary.store where bossID=?", [id], function(err, result, field){
    const storeID=result[0].storeID;
    console.log(storeID);

    con.query("select staffName, hourlyWage from TheWorkDiary.staff where storeID=?", [storeID], function(err, result, field){
      if(err) throw err;
      res.send(result);
    })
  })
});

router.get('/staff', function(req, res, next){
  if(req.session.user.workStatus=="Y") res.send("현재 근무중입니다.");
  else res.send('현재 근무중이 아닙니다.');
})

router.post('/staff/onDuty', function(req, res, next){
  req.session.user.officeGoingHour = date.getNowTime();
  req.session.user.workStatus="Y"
  con.query("select staffName, hourlyWage from TheWorkDiary.staff where staffID=?", [req.session.user.id], function(err, result, field){
    if(err) throw err;
    const info={
      name: result[0].staffName,
      hourlyWage: result[0].hourlyWage,
      officeGoingHour: req.session.user.officeGoingHour
    }
    res.send(info);
  });
});

router.post('/staff/leaveWork', function(req, res, next){
  con.query("select hourlyWage from TheWorkDiary.staff where staffID=?", [req.session.user.id], function(err, result, field){
    const info={
      date: date.getDateID(),
      workingHours: date.time.getDailyWorkingHours(req.session.user.officeGoingHour, date.getNowTime()),
      dailyWage: result[0].hourlyWage*date.time.getDailyWorkingHours(req.session.user.officeGoingHour, date.getNowTime()),
      id:req.session.user.id
    }

    const insertSql="INSERT INTO TheWorkDiary.salary_"+info.id.replace(/\s*$/, "")+" (`date`, `workingHours`, `dailyWage`, `staffID`) VALUES (?,?,?,?);";
    con.query(insertSql, [info.date, info.workingHours, info.dailyWage, info.id], function(err){if(err) throw err;});

    res.send(info);
  })
})

module.exports = router;