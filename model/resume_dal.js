var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

// VIEW ALL FUNCTION(S):

exports.getAll = function(callback) {
    var query = 'SELECT * FROM resume_view;';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

// VIEW BY ID FUNCTION(S):

exports.getById = function(resume_id, callback) {
    var query = 'SELECT * FROM resume_viewById WHERE resume_id = ?';
    var queryData = [resume_id];
    connection.query(query, queryData, function(err, resume) {
        resumeSkillViewById(resume_id, function (err, resume_skill) {
           resumeCompanyViewById(resume_id, function(err, resume_company) {
               resumeSchoolViewById(resume_id, function(err, resume_school) {
                   callback(err, resume, resume_skill, resume_company, resume_school);
               });
           });
        });
    });
};

var resumeSkillViewById = function(resume_id, callback){
    var query = 'SELECT * FROM resumeSkill_viewById WHERE resume_id = ?';
    connection.query(query, resume_id, function (err, result) {
        callback(err, result);
    });
};
module.exports.resumeSkillViewById = resumeSkillViewById;

var resumeCompanyViewById = function(resume_id, callback){
    var query = 'SELECT * FROM resumeCompany_viewById WHERE resume_id = ?';
    connection.query(query, resume_id, function (err, result) {
        callback(err, result);
    });
};
module.exports.resumeCompanyViewById = resumeCompanyViewById;

var resumeSchoolViewById = function(resume_id, callback){
    var query = 'SELECT * FROM resumeSchool_viewById WHERE resume_id = ?';
    connection.query(query, resume_id, function (err, result) {
        callback(err, result);
    });
};
module.exports.resumeSchoolViewById = resumeSchoolViewById;


// INSERT FUNCTION(S):

exports.insert = function(params, callback) {
    var query = 'INSERT INTO resume (user_account_id, resume_name) VALUES (?, ?)';
    // var query2 = 'INSERT INTO resume_skill (skill_id, resume_id) VALUES ?';
    // var query3 = 'INSERT into resume_company (company_id, resume_id) VALUES ?';


    var resumeData = [params.account_id, params.resume_name];
    connection.query(query, resumeData, function(err, result) {
        if(err) {
            console.log(err);
        }
        var resume_id = result.insertId;

        // IF THERYRE NULL THEY CRASH
        resumeSkillInsert(resume_id, params.skill_id, function(err, result) {
            resumeCompanyInsert(resume_id, params.company_id, function(err, result) {
                resumeSchoolInsert(resume_id, params.school_id, function(err, result) {
                    callback(err, result);
                });
            });
        });
    });
};

var resumeCompanyInsert = function(resume_id, companyIdArray, callback) {
    console.log("companyIDArray: " + companyIdArray);
    var query = 'INSERT into resume_company (company_id, resume_id) VALUES ?';

    var resumeCompanyData = [];
    if(companyIdArray instanceof Array) {
        for(var i=0; i < companyIdArray.length; i++) {
            resumeCompanyData.push([companyIdArray[i], resume_id]);
        }
    }
    else {
        resumeCompanyData.push([companyIdArray, resume_id]);
    }
    connection.query(query, [resumeCompanyData], function(err, result) {
        console.log("GETTING HERE COMPANY INSERT FOR RESUME ");
        console.log(err);
        callback(err, result);
    });
};
module.exports.resumeCompanyInsert = resumeCompanyInsert;

//declare the function so it can be used locally
var resumeSkillInsert = function(resume_id, skillIdArray, callback){
    // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
    console.log("skills to be inserted: " + skillIdArray.length);
    var query = 'INSERT INTO resume_skill (skill_id, resume_id) VALUES ?';
    // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
    var resumeSkillData = [];
    if(skillIdArray instanceof Array) {
        for(var i=0; i < skillIdArray.length; i++) {
            resumeSkillData.push([skillIdArray[i], resume_id]);
        }
    }
    else {
        resumeSkillData.push([skillIdArray, resume_id]);
    }
    connection.query(query, [resumeSkillData], function (err, result) {
        console.log("INSERTING");
        console.log(err);
        callback(err, result);
    });
};
//export the same function so it can be used by external callers
module.exports.resumeSkillInsert = resumeSkillInsert;


var resumeSchoolInsert = function (resume_id, schoolIdArray, callback) {
    // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
    // console.log("schools to be inserted: " + schoolIdArray);

    var query = 'INSERT INTO resume_school (school_id, resume_id) VALUES ?';
    // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
    var resumeSchoolData = [];
    if(schoolIdArray instanceof Array) {
        for(var i=0; i < schoolIdArray.length; i++) {
            resumeSchoolData.push([schoolIdArray[i], resume_id]);
        }
    }
    else {
        resumeSchoolData.push([schoolIdArray, resume_id]);
    }
    connection.query(query, [resumeSchoolData], function (err, result) {
        console.log("INSERTING SCHOOLs");
        callback(err, result);
    });
};
module.exports.resumeSchoolInsert = resumeSchoolInsert;

// UPDATE FUNCTION(S):

exports.update = function(params, callback) {
    var query = 'UPDATE resume SET resume_name = ?, user_account_id = ? WHERE resume_id = ?';
    var queryData = [params.resume_name, params.user_account_id, params.resume_id];
    connection.query(query, queryData, function(err, result) {
        resumeSkillDeleteAll(params.resume_id, function(err, result) {
            if (params.skill_id != null) {
                console.log("Params skill id: " + params.skill_id);
                resumeSkillInsert(params.resume_skill, params.skill_id, function (err, result) {
                    callback(err,result);
                });
            } else {
                console.log("skill_id array is null");
                callback(err, result);
            }
        });
    });
};


var resumeSkillDeleteAll = function (resume_id, callback) {

    var query = 'DELETE FROM resume_skill WHERE resume_id = ?';
    var queryData = [resume_id];
    connection.query(query, queryData, function(err, result) {
        console.log("DELETING");
        callback(err, result);
    });
};
module.exports.resumeSkillDeleteAll = resumeSkillDeleteAll;

var resumeCompanyDeleteAll = function (resume_id, callback) {
    var query = 'DELETE FROM resume_company WHERE resume_id = ?';
    var queryData = [resume_id];
    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};
module.exports.resumeCompanyDeleteAll = resumeCompanyDeleteAll;

var updateResumeSkill = function(resume_id, skillIdArray, callback) {
    var query = 'UPDATE resume_skill SET skill_id = ? WHERE resume_id = ?';

    var skillData = [];
    for (var i = 0; i < skillIdArray.length; i++) {
        skillData.push([skillIdArray[i], resume_id]);
    }
    connection.query(query, skillData, function(err, result) {
        callback(err, result);
    });
};
module.exports.updateResumeSkill = updateResumeSkill;

exports.delete = function(resume_id, callback) {
    var query = 'DELETE FROM resume WHERE resume_id = ?';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });

};


