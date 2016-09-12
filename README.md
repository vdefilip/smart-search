#Smart-Search

Smart-Search is a JavaScript library that perform fuzzy-search through a list of entries.

##Install

####Npm
```javascript
npm install smart-search
```

####Bower
```javascript
bower install smart-search
```

####Browser
```javascript
<script src="/path/to/smart-search.js"></script>
```

##Usage

```javascript
var results = smartSearch(entries, patterns, fields, options);
```

####Parameters

- **entries** `Array<Object>`

    List of objects where the search will perform. ([see details](#entries))

- **patterns** `Array<String>`

    List of patterns that will be searched in the **_entries_**. ([see details](#patterns))

- **fields** `Array<String>`

    List of **_entries_**'s properties where all the **_patterns_** will be searched. ([see details](#fields))

- **options** `Object`

    Optional properties. ([see details](#options))



####Return `Array<Object>`
The return is an array of objects containing the **_entries_** that have matched. ([see details](#Return))

##Example
```javascript
var entries = [
  { id:0, name:'Robin David',     email:'robin.david@gmail.com' },
  { id:1, name:'Loris Francois',  email:'loris.francois@gmail.com' },
  { id:2, name:'Armand Roy',      email:'armand.roy@live.com' },
  { id:3, name:'Mathias Meunier', email:'mathias.meunier@gmail.com' },
  { id:4, name:'Ruben Bernard',   email:'ruben.bernard@yahoo.com' },
];

var patterns = ['gmail', 'oi'];
var fields = { name: true, email: true };

var results = smartSearch(entries, patterns, fields);

results.forEach( function (result) {
  console.log(result.entry);
});
```
will display :
<pre>
{ id: 1, name: 'Loris Franc<b>oi</b>s', email: 'loris.franc<b>oi</b>s@<b>gmail</b>.com' }
{ id: 0, name: 'R<b>o</b>b<b>i</b>n David', email: 'r<b>o</b>b<b>i</b>n.david@<b>gmail</b>.com' }
</pre>

##Details
####Parameters
---
##### entries `Array<Object>`

List of objects where the search is performed.

>Example:
>```javascript
var entries = [
  { id:0, name:'Robin David',     email:'robin.david@gmail.com' },
  { id:1, name:'Loris Francois',  email:'loris.francois@gmail.com' },
  { id:2, name:'Armand Roy',      email:'armand.roy@live.com' },
  { id:3, name:'Mathias Meunier', email:'mathias.meunier@gmail.com' },
  { id:4, name:'Ruben Bernard',   email:'ruben.bernard@yahoo.com' },
];
```

---
##### patterns `Array<String>`

List of patterns that are searched in the **_entries_**.

Each pattern is searched accross the specified properties (**_fields_**) of every entry.

A pattern match a string if all the letters that it is constituted appears, in the same order, in the string.
The relevance of the matching is computed from the minimum number of letters that have be inserted into the pattern in such a way it matches the string.

>Example:

><pre>
the pattern 'oi'
  - match with 0 insertions in 'Loris Franc<b>oi</b>s'
  - match with 1 insertions in 'R<b>o</b>b<b>i</b>n David'
</pre>

*The optional parameter 'maxInsertions' limit the number of insertions authorised.*

---
##### fields `Array<String>`

List of objects's properties where the **_patterns_** are searched.

The property's value should be a `String`. If not, the property is ignored.

Nested properties could be specified with a dot character.

>Example:
>```javascript
var entries = [
  {
    id:0,
    name:{ first:{ 'Robin' }, last:{ 'David' } },
    email:'robin.david@gmail.com'
  },
  {...}
];
var results = smartSearch(entries, patterns, { name: { last: true }, email: true });
```

---
##### options `Object`

An optional fourth parameter allow user to customize search behavior.

The options available are :
- **caseSensitive** `Boolean` *(default:false)*

    Indicates whether matching should be case sensitive.

- **fieldMatching** `Boolean` *(default:false)*

    By default an entry match if all patterns match through the **entire entry**.

    With `fieldMatching = true`, an entry match if all patterns match in at least **one field**.

- **maxInsertions** `Integer` *(default:-1)*

	Indicate the maximum of insertions authorisedduring pattern matching.

	`maxInsertions = -1` means no limit.

>Example:
>```javascript
var options = {
	maxInsertions: 3;
};
var results = smartSearch(entries, patterns, fields, options);
```

---
#### Return `Array<Object>`

The return value is an array of objects containing the entries that have matched all the patterns.

The properties of each returned object are the following:

- **entry** : original entry from the **_entries_** array.
- **info** : informations about the matching.
- **score** : relevance score.

>Example:
>```javascript
[
 {
  entry:{id:1, name:'Loris Francois', email:'loris.francois@gmail.com'},
  info:[
   {
    field:'name',
    patterns:[
     {value:'oi', insertions:0, matchIndexes:[11,12]},
    ]
   },
   {
    field:'email',
    patterns:[
     {value:'gmail', insertions:0, matchIndexes:[15,16,17,18,19]},
     {value:'oi', insertions:0, matchIndexes:[11,12]},
    ]
   },
  ],
  score:0.011
 },
 {
  entry:{id:0, name:'Robin David', email:'robin.david@gmail.com'},
  info:[
   {
    field:'name',
    patterns:[
     {value:'oi', insertions:1, matchIndexes:[1,3]},
    ]
   },
   {
    field:'email',
    patterns:[
     {value:'gmail', insertions:0, matchIndexes:[12,13,14,15,16]},
     {value:'oi', insertions:1, matchIndexes:[1,3]},
    ]
   },
  ],
  score:1.001
 },
]
```

---

##Release History

v0.2.0 - Sept, 2016

v0.1.0 - July, 2015

##License

MIT

