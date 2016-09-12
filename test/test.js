"use strict";

var smartSearch = require('../lib/smart-search.js');
var assert = require('assert');

var entries = [
  { id: 0, name: 'Robin David',     email: 'robin.david@gmail.com' },
  { id: 1, name: 'Loris Francois',  email: 'loris.francois@gmail.com' },
  { id: 2, name: 'Armand Roy',      email: 'armand.roy@live.com' },
  { id: 3, name: 'Mathias Meunier', email: 'mathias.meunier@gmail.com' },
  { id: 4, name: 'Ruben Bernard',   email: 'ruben.bernard@yahoo.com' },
];

var entriesDetailled = [
  { id: 0, name: { first: 'Robin', Last: 'David' },     email: 'robin.david@gmail.com' },
  { id: 1, name: { first: 'Loris', Last: 'Francois' },  email: 'loris.francois@gmail.com' },
  { id: 2, name: { first: 'Armand', Last: 'Roy' },      email: 'armand.roy@live.com' },
  { id: 3, name: { first: 'Mathias', Last: 'Meunier' }, email: 'mathias.meunier@gmail.com' },
  { id: 4, name: { first: 'Ruben', Last: 'Bernard' },   email: 'ruben.bernard@yahoo.com' },
];

var logResults = function (results) {
  var formatLog = function (prefix, key, sep, value, suffix) {
    if (typeof value === 'string')
      value = "'" + value + "'";
    return prefix + key + sep + value + suffix;
  };
  console.log('[');
  results.forEach(function (result) {
    console.log(' {');
    var s = '  entry:{';
    var first = true;
    for (var field in result.entry) {
      if (result.entry.hasOwnProperty(field)) {
        s += formatLog(first ? '' : ', ', field, ':', result.entry[field], '');
        first = false;
      }
    }
    s += '},';
    console.log(s);
    console.log('  info:[');
    result.info.forEach(function (matchField) {
      console.log('   {');
      console.log(formatLog('    ', 'field', ':', matchField.field, ','));
      console.log('    patterns:[');
      matchField.patterns.forEach(function (pattern) {
        var s = formatLog('     {', 'value', ':', pattern.value, ',');
        s    += formatLog(' ', 'insertions', ':', pattern.insertions, ',');
        s    += formatLog(' ', 'matchIndexes', ':[', pattern.matchIndexes, ']},');
        console.log(s);
      });
      console.log('    ]');
      console.log('   },');
    });
    console.log('  ],');
    console.log('  score:', result.score);
    console.log(' },');
  });
  console.log(']');
};


describe('smart-search', function () {

	it ('pattern: simple', function () {
    var patterns = ['gmail'];
    var fields = { name: true, email: true };
    var results = smartSearch(entries, patterns, fields);
    assert.equal(results.length, 3);
		assert.equal(results[0].entry.id, 0);
    assert.equal(results[1].entry.id, 1);
    assert.equal(results[2].entry.id, 3);
	});

  it ('pattern: multi', function () {
    var patterns = ['gmail', 'oi'];
    var fields = { name: true, email: true };
    var results = smartSearch(entries, patterns, fields);
    assert.equal(results.length, 2);
    assert.equal(results[0].entry.id, 1);
    assert.equal(results[1].entry.id, 0);
    //logResults(results);
  });

  it ('pattern: not found', function () {
    var patterns = ['zy'];
    var fields = { name: true, email: true };
    var results = smartSearch(entries, patterns, fields);
    assert.equal(results.length, 0);
  });

  it ('pattern: not in field', function () {
    var patterns = ['gmail'];
    var fields = { name: true };
    var results = smartSearch(entries, patterns, fields);
    assert.equal(results.length, 0);
  });

  it ('pattern: with nested field', function () {
    var patterns = ['Roy'];
    var fields = { name: { Last: true }};
    var results = smartSearch(entriesDetailled, patterns, fields);
    assert.equal(results.length, 1);
    assert.equal(results[0].entry.id, 2);
  });

  it ('options: caseSensitive pass', function () {
    var patterns = ['Ruben'];
    var fields = ['name'];
    var options = { caseSensitive: true };
    var results = smartSearch(entries, patterns, fields, options);
    assert.equal(results.length, 1);
    assert.equal(results[0].entry.id, 4);
  });

  it ('options: caseSensitive fail', function () {
    var patterns = ['ruben'];
    var fields = { name: true };
    var options = {caseSensitive: true};
    var results = smartSearch(entries, patterns, fields, options);
    assert.equal(results.length, 0);
  });

  it ('options: fieldMatching pass', function () {
    var patterns = ['ruben.'];
    var fields = { name: true, email: true };
    var options = {caseSensitive: true, FieldMatching: true};
    var results = smartSearch(entries, patterns, fields, options);
    assert.equal(results.length, 1);
    assert.equal(results[0].entry.id, 4);
  });

  it ('options: fieldMatching fail', function () {
    var patterns = ['Ruben.'];
    var fields = { name: true, email: true };
    var options = {caseSensitive: true, FieldMatching: true};
    var results = smartSearch(entries, patterns, fields, options);
    assert.equal(results.length, 0);
  });

  it ('options: maxInsertions', function () {
    var patterns = ['rd'];
    var fields = { name: true, email: true };
    var options = {maxInsertions: 0};
    var results = smartSearch(entries, patterns, fields, options);
    assert.equal(results.length, 1);
    assert.equal(results[0].entry.id, 4);
  });

});
