const express = require('express');
const router = express.Router();
const con = require('../bin/db')
let storeID;

router.get('/boss', function(req, res, next) {
    console.log("Boss Join Page");
    res.send('Boss Join Page');
});

router.post('/boss', function(req, res, next){
    console.log("Joining...");

    const body = req.body;
    const info = {
        bossID: body.id,
        pw: body.pw,
        storeName: body.storeName,
        bossName: body.bossName,
        phone: body.phone,
        address: body.address
    }

    const insertSql = "INSERT INTO `TheWorkDiary`.`store` (`bossID`, `password`, `storeName`, `bossName`,  `phone`, `address`) VALUES (?, ?, ?, ?, ?, ?);"

    // storeID 재정렬
    con.query("SET @count=0;");
    con.query('update TheWorkDiary.store set storeID=@count:=@count+1;');
    // store table의 ai값 초기화
    con.query("select count(*) as cnt from TheWorkDiary.store;", function(err, result, field){
        if (err) throw err;
        const cnt=result[0].cnt+1;
        
        con.query('alter table TheWorkDiary.store AUTO_INCREMENT=?;', [cnt-1]);

        // insert to store Table
        con.query(insertSql, [info.bossID, info.pw, info.storeName, info.bossName, info.phone, info.address], function(err, result, field){
            if(err) throw err;
            console.log('Store Registration Success!!');
        });

        // create new store's sales Table
        const createSql = "CREATE TABLE `TheWorkDiary`.`sales_"+cnt+"` (`date` INT NOT NULL, `dailySales` INT NOT NULL, `storeID` INT NOT NULL, PRIMARY KEY (`date`), INDEX `sales_"+cnt+"_idx` (`storeID` ASC) VISIBLE, CONSTRAINT `sales_"+cnt+"` FOREIGN KEY (`storeID`) REFERENCES `TheWorkDiary`.`store` (`storeID`) ON DELETE CASCADE ON UPDATE CASCADE);"
        con.query(createSql, function(err){if(err) throw err;});
    });
    res.write('<script>alert("가게가 등록되었습니다!"); location.href = "/login";</script>');
});

router.post('/checkID', function(req, res, next){
    const id = req.body.id;
    const bossSelectSql = "select count(*) as cnt from TheWorkDiary.store where bossID=?";
    const staffSelectSql = "select count(*) as cnt from TheWorkDiary.staff where staffID=?";
    console.log(`New User ${id} Check for redundancy`);

    con.query(bossSelectSql, [id], function(err, result, field){
        if(err) throw err;

        if(result[0].cnt){
            console.log("redundancy");
            res.write('<script>alert("이미 사용중인 ID입니다. 다른 ID를 입력해주세요!")</script>');
        }
        else {
            console.log('store table not redundancy');
            con.query(staffSelectSql, [id], function(err, result, field){
                if(err) throw err;
        
                if(result[0].cnt){res.write('<script>alert("이미 사용중인 ID입니다. 다른 ID를 입력해주세요!")</script>'); console.log("redundancy")}
                else {res.write('<script>alert("사용 가능한 ID입니다. 회원가입을 계속 진행해주세요!")</script>'); console.log('staff table not redundancy');}
            });
        }
    });
});

router.post('/searchStore', function(req, res, next){
    const searchSql=`select * from TheWorkDiary.store where storeName like '%${req.body.name.replace(/\s*$/, "")}%';`;

    con.query(searchSql, function(err, result, field){
        if (err) throw err;
        res.send(result);
    });
});

router.post('/staff', function(req, res, next){
    console.log("Staff Joinning...");

    const body=req.body;
    const info={
        storeID: body.storeID,
        staffID: body.staffID,
        pw: body.pw,
        name: body.name,
        phone: body.phone,
        bank: body.bank,
        accountNumber: body.accountNumber,
        hourlyWage: body.hourlyWage
    };

    const insertSql="INSERT INTO `TheWorkDiary`.`staff` (`staffID`, `password`, `staffName`, `hourlyWage`, `phone`, `bank`, `accountNumber`, `storeID`) VALUES (?,?,?,?,?,?,?,?);";
    const createSql="CREATE TABLE `TheWorkDiary`.`salary_"+info.staffID.replace(/\s*$/, "")+"` (`date` INT NOT NULL, `workingHours` INT NOT NULL, `dailyWage` INT NOT NULL, `staffID` VARCHAR(45) NOT NULL, PRIMARY KEY (`date`), INDEX `salary_"+info.staffID.replace(/\s*$/, "")+"_idx` (`staffID` ASC) VISIBLE, CONSTRAINT `salary_"+info.staffID.replace(/\s*$/, "")+"` FOREIGN KEY (`staffID`) REFERENCES `TheWorkDiary`.`staff` (`staffID`) ON DELETE CASCADE ON UPDATE CASCADE);"

    if(info.houryWage>=9150){
        con.query(insertSql, [info.staffID, info.pw, info.name, Number(info.hourlyWage), info.phone, info.bank, info.accountNumber, info.storeID], function(err, result, field){
            if(err) throw err;
            console.log(houryWage);
            console.log("Staff Join Success!!");
        });    
    }else{
        con.query(insertSql, [info.staffID, info.pw, info.name, 9150, info.phone, info.bank, info.accountNumber, info.storeID], function(err, result, field){
            if(err) throw err;
            console.log("Staff Join Success!!");
        });
    }
    
    // create new staff's salary table
    con.query(createSql, function(err){if(err) throw err;});
    res.send('<script>alert("회원가입이 완료되었습니다!")</script>')
});

module.exports = router;