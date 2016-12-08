/**
 * Created by student on 12/5/16.
 */
var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

exports.getAll = function(callback) {
    var query = 'SELECT * FROM skill;';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.getById = function(skill_id, callback) {
    var query = 'SELECT * FROM skill WHERE skill_id = ?';
    var queryData = [skill_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

exports.getByIdX = function(skill_id, callback) {
    var query = 'SELECT r.*, s.skill_id, s.skill_name, s.description from resume r ' +
        'left join resume_skill rs on rs.resume_id = r.resume_id ' +
        'left join skill s on s.skill_id = rs.skill_id ' +
        'where r.resume_id = ?';

    var queryData = [skill_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};


exports.insert = function(params, callback) {
    // var query = 'INSERT INTO skill (skill_name, skill_description) VALUES (?, ?)';
    var query = 'INSERT INTO skill (skill_name) VALUES (?)';

    // the question marks in the sql query above will be replaced by the values of the
    // the data in queryData
    var queryData = [params.skill_name];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });

}

exports.delete = function(skill_id, callback) {
    var query = 'DELETE FROM skill WHERE skill_id = ?';
    var queryData = [skill_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });

};