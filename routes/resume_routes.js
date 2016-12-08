var express = require('express');
var router = express.Router();
var resume_dal = require('../model/resume_dal');
var account_dal = require('../model/account_dal');
var skill_dal = require('../model/skill_dal');
var company_dal = require('../model/company_dal');
var school_dal = require('../model/school_dal');


// View All resumes
router.get('/all', function(req, res) {
    resume_dal.getAll(function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('resume/resumeViewAll', { 'result': result });
        }
    });
});

// View the resume for the given id
router.get('/', function(req, res){
    if(req.query.resume_id == null) {
        res.send('resume_id is null');
    }
    else {
        resume_dal.getById(req.query.resume_id, function(err,resume, resume_skill, resume_company, resume_school) {
            if (err) {
                res.send(err);
            }
            else {
                res.render('resume/resumeViewById', {resume: resume, resume_skill: resume_skill, resume_company: resume_company, resume_school: resume_school});
            }
        });
    }
});


// Return the add a new resume form
router.get('/add', function(req, res){
    // passing all the query parameters (req.query) to the insert function instead of each individually
    account_dal.getAll(function(err,account) {
        company_dal.getAll(function(err, company) {
           skill_dal.getAll(function(err, skill) {
              school_dal.getAll(function (err, school) {
                  if (err) {
                      res.send(err);
                  }
                  else {
                      res.render('resume/resumeAdd', {account: account, company: company,
                                                        skill: skill, school: school});
                  }
              });
           });
        });
    });
});

// insert a resume record
router.get('/insert', function(req, res){
    // simple validation
    if(req.query.resume_name == null) {
        res.send('resume Name must be provided.');
    }
    else if(req.query.account_id == null) {
        res.send('An Account Id must be selected');
    }
    else {
        // passing all the query parameters (req.query) to the insert function instead of each individually
        resume_dal.insert(req.query, function(err,result) {
            if (err) {
                console.log(err);
                res.send(err);
            }
            else {
                //poor practice, but we will handle it differently once we start using Ajax
                res.redirect(302, '/resume/all');
            }
        });
    }
});

// Delete a resume for the given resume_id
router.get('/delete', function(req, res){
    if(req.query.resume_id == null) {
        res.send('resume_id is null');
    }
    else {
        resume_dal.delete(req.query.resume_id, function(err, result){
            if(err) {
                res.send(err);
            }
            else {
                //poor practice, but we will handle it differently once we start using Ajax
                res.redirect(302, '/resume/all');
            }
        });
    }
});

/* LAB 12 */
// router.get('/edit', function(req, res){
//     if(req.query.resume_id == null) {
//         res.send('A resume id is required');
//     }
//     else {
//         resume_dal.edit(req.query.resume_id, function(err, result){
//             res.render('resume/resumeUpdate', {school: result[0][0], address: result[1]});
//         });
//     }
// });

router.get('/edit2', function(req, res){
    if(req.query.resume_id == null) {
        res.send('A resume id is required');
    }
    else {
        resume_dal.getById(req.query.resume_id, function(err, resume){
            account_dal.getAll(function(err, account) {
                company_dal.getAll(function(err, company) {
                    company_dal.getByIdX(req.query.resume_id, function(err, companyX) {
                        school_dal.getAll(function (err, school) {
                            school_dal.getByIdX(req.query.resume_id, function(err, schoolX) {
                                skill_dal.getAll(function(err, skill) {
                                    skill_dal.getByIdX(req.query.resume_id, function(err, skillX) {
                                        console.log("company: "+ company.length);
                                        console.log("companyX: "+ companyX);
                                        res.render('resume/resumeUpdate', {resume: resume[0], account: account, company: company, school: school, skill: skill,
                                                                               companyX: companyX, schoolX: schoolX, skillX: skillX });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    }
});

router.get('/update', function(req, res){
    resume_dal.delete(req.query.resume_id, function(err, result){
        resume_dal.insert(req.query, function (err, result) {
            res.redirect(302, '/resume/all');
        });
    });
});

module.exports = router;