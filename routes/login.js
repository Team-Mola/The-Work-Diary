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
            if (err) throw err;
            if(result[0].password == pw){
                console.log(`Boss ${id} is Login Success!!`);
                req.session.user={
                    id: id,
                    pw: pw,
                    name: result[0].name,
                    grade: b,
                    authorized: true
                };
                res.redirect('/boss');
            } else{
                con.query(selectStaffSql, [id], function(err, result, field){
                    try{
                        if(result[0].password == pw){
                            console.log(`Staff ${id} is Login Success!!`);
                            if(result[0].passwork == pw){
                                console.log(`Staff ${id} is Login Success!!`);
                                req.session.user={
                                    id: id,
                                    pw: pw,
                                    grade: s,
                                    name: result[0].name,
                                    authorized: true
                                };
                            res.redirect('/staff');
                            }
                        } else{
                            console.log('Login Failed...');
                            res.send('<script>alert("회원 정보가 올바르지 않습니다. 다시 시도해주세요.")</script>');
                        }    
                    } catch(err){
                        console.log('Login Failed...');
                        res.send('<script>alert("회원 정보가 올바르지 않습니다. 다시 시도해주세요.")</script>');
                    }
                });
            }
        });
    }
})

module.exports = router;