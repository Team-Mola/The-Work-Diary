const express = require('express');
const con = require('../bin/db');
const router = express.Router();


router.get('/', function(req, res, next) {
    if (req.session.user){
        console.log("Already Login Status")
        res.redirect("/");
    } else {
        console.log("Login Page Access")
        res.send("Login Page");
    }
});

router.post('/', function(req, res, next){
    if(req.session.user){
        if(req.session.user.grade=b) res.redirect('/boss');
        else res.redirect('/staff');
    }else{
        console.log('Logining...');

        const id=req.body.id;
        const pw=req.body.pw;

        const selectBossSql="select password, bossName from TheWorkDiary.store where bossID=?";
        const selectStaffSql="select password, staffName from TheWorkDiary.staff where staffID=?";

        con.query(selectBossSql, [id], function(err, result, field){
            try{
                if(result[0].password == pw){
                    console.log(`Boss ${id} is Login Success!!`);
                    req.session.user={
                        id: id,
                        pw: pw,
                        name: result[0].bossName,
                        grade: "b",
                        authorized: true
                    };
                    console.log(req.session.user);
                    res.redirect('/boss');
                }
            } catch(err){
                console.log(err);
                con.query(selectStaffSql, [id], function(err, result, field){
                    try{
                        if(result[0].password == pw){
                            console.log(`Staff ${id} is Login Success!!`);
                            req.session.user={
                                id: id,
                                pw: pw,
                                grade: "s",
                                name: result[0].staffName,
                                workStatus: "No",
                                officeGoingHour: 0,
                                authorized: true
                            };
                            res.redirect('/staff');
                        } else{
                            console.log('Login Failed...');
                            res.send('<script>alert("?????? ????????? ???????????? ????????????. ?????? ??????????????????.")</script>');
                        }    
                    } catch(err){
                        console.log(err);
                        console.log('Login Failed...');
                        res.send('<script>alert("?????? ????????? ???????????? ????????????. ?????? ??????????????????.")</script>');
                    }
                });
            }
        });
    }
})

module.exports = router;