/*
 * Smart-Search
 * https://github.com/vdefilip/smart-search
 * Licensed under the MIT license.
 */
const _match = (pattern, text, offset, options) => {
    let insertions = 0;
    const matchIndexes = [];
    let iPattern = 0;
    for (let iText = offset; iText < text.length; iText++) {
        if (text[iText] === pattern[iPattern]) {
            matchIndexes.push(iText);
            if (++iPattern === pattern.length) {
                return {
                    insertions: insertions,
                    matchIndexes: matchIndexes,
                };
            }
        }
        else if (matchIndexes.length) {
            insertions++;
            options.maxInsertions = options.maxInsertions || -1;
            if (options.maxInsertions > -1 &&
                insertions > options.maxInsertions) {
                return null;
            }
        }
    }
    return null;
};
const _find = (pattern, text, options) => {
    let match = false;
    let insertions = 0;
    let matchIndexes = [];
    const iPattern = 0;
    if (!options.caseSensitive) {
        pattern = pattern.toLowerCase();
        text = text.toLowerCase();
    }
    for (let iText = 0; iText < text.length; iText++) {
        if (text[iText] === pattern[iPattern]) {
            const res = _match(pattern, text, iText, options);
            if (res && (!match || res.insertions <= insertions)) {
                if (!match || res.insertions < insertions) {
                    match = true;
                    insertions = res.insertions;
                    matchIndexes = res.matchIndexes;
                }
                else {
                    matchIndexes = matchIndexes.concat(res.matchIndexes);
                }
            }
        }
    }
    if (match) {
        return {
            value: pattern,
            insertions: insertions,
            matchIndexes: matchIndexes,
        };
    }
    return null;
};
const _score = (entryResults) => {
    const patternsMinInsertions = {};
    const patternsMinMatchIndex = {};
    entryResults.forEach((fieldResults) => {
        fieldResults.patterns.forEach((pattern) => {
            if (patternsMinInsertions[pattern.value] === undefined ||
                pattern.insertions < patternsMinInsertions[pattern.value]) {
                patternsMinInsertions[pattern.value] = pattern.insertions;
                patternsMinMatchIndex[pattern.value] = pattern.matchIndexes;
            }
        });
    });
    let minInsertions = 0;
    let minMatchIndex = [];
    for (const pattern in patternsMinInsertions) {
        if (patternsMinInsertions.hasOwnProperty(pattern)) {
            minInsertions += patternsMinInsertions[pattern];
            minMatchIndex = minMatchIndex.concat(patternsMinMatchIndex[pattern]);
        }
    }
    return minInsertions + minMatchIndex.sort()[0] / 1000;
};
const _getFieldString = (entry, field) => {
    let current = '';
    for (let i = 0; i < field.length; i++) {
        if (entry[field[i]] === undefined) {
            return null;
        }
        else {
            current = entry[field[i]];
        }
    }
    if (typeof current !== 'string') {
        return null;
    }
    return current;
};
const _forEachObject = (obj, fn) => {
    const _locals = [];
    const _processObject = (o) => {
        for (const key in o) {
            if (o.hasOwnProperty(key)) {
                _locals.push(key);
                if (typeof o[key] === 'object') {
                    _processObject(o[key]);
                }
                else {
                    fn([].concat(_locals));
                }
                _locals.pop();
            }
        }
    };
    _processObject(obj);
};
const _search = (entries, patterns, fields, options) => {
    const results = [];
    entries.forEach((entry) => {
        let match = false;
        const entryMatch = [];
        const entryResults = [];
        _forEachObject(fields, (field) => {
            const fieldString = _getFieldString(entry, field);
            if (fieldString === null) {
                return;
            }
            const fieldMatch = [];
            const fieldResults = {
                field: field.join('.'),
                patterns: [],
            };
            patterns.forEach((pattern) => {
                const res = _find(pattern, fieldString, options);
                if (res) {
                    fieldResults.patterns.push(res);
                    fieldMatch.push(pattern);
                    if (entryMatch.indexOf(pattern) === -1) {
                        entryMatch.push(pattern);
                    }
                }
            });
            if (fieldMatch.length === patterns.length) {
                entryResults.push(fieldResults);
                match = true;
            }
            else if (!options.fieldMatching &&
                fieldResults.patterns.length > 0) {
                entryResults.push(fieldResults);
            }
        });
        if ((options.fieldMatching && match) ||
            (!options.fieldMatching && entryMatch.length === patterns.length)) {
            results.push({
                entry: entry,
                info: entryResults,
                score: _score(entryResults),
            });
        }
    });
    return results;
};
const _buildOptions = (options) => {
    const defaultOptions = {
        caseSensitive: false,
        fieldMatching: false,
        maxInsertions: -1,
    };
    if (options === undefined) {
        return defaultOptions;
    }
    for (const option in defaultOptions) {
        const value = options[option];
        if (value !== undefined) {
            defaultOptions[option] = value;
        }
    }
    return defaultOptions;
};
const sanitizeArray = (array, caseSensitive) => {
    if (array === undefined ||
        array.length === undefined ||
        array.length === 0) {
        return [];
    }
    const values = {};
    const newArray = [];
    array.forEach((elem) => {
        if (typeof elem !== 'string') {
            return;
        }
        const element = !caseSensitive ? elem.toLowerCase() : elem;
        if (element && element in values === false) {
            values[element] = true;
            newArray.push(elem);
        }
    });
    return newArray;
};
const smartSearch = (entries, patterns, fields, options) => {
    const resolvedOptions = _buildOptions(options);
    const resolvedPatterns = sanitizeArray([].concat(patterns), options.caseSensitive);
    const resolvedFields = typeof fields === 'string' ? { [fields]: true } : fields;
    if (entries.length === 0 || patterns.length === 0) {
        return;
    }
    const results = _search(entries, resolvedPatterns, resolvedFields, resolvedOptions);
    results.sort((a, b) => a.score - b.score);
    return results;
};
export default smartSearch;
//# sourceMappingURL=smart-search.js.map