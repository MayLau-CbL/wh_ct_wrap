if (process.env.NODE_ENV !== 'PROD') {
    require('dotenv').config({ path: './config.env' });
}

const axios = require('axios');
const pdfParse = require('pdf-parse');
const stringUtil = require('./util/string_util.js');
const clientHelper = require('./data/network/supabase_client.js');

var noticeDate = '';

async function main() {
    let res = await axios({
        method: 'get',
        url: 'https://www.chp.gov.hk/files/pdf/ctn.pdf',
        responseType: 'arraybuffer',
    });

    let buffer = res.data;

    let result = await pdfParse(buffer);

    let list = updateCategoryList(result.text);

    // delete some old records in case DB is not enough room
    await clientHelper.deletePreviousRecords();
    // delete same notice date records, in case duplicated records
    await clientHelper.deleteRecordsByDate(noticeDate);
    // add the parsed records
    await clientHelper.addListToDB(list);
}

/**
 * update category list
 */
function updateCategoryList(text) {
    const placeRegex = RegExp('^\\d+[.]\\s');
    const dateRegex = RegExp('^\\d{4}-\\d{2}-\\d{2}');

    var texts = text.split('\n');
    var categoryList = [];
    var length = texts.length;
    var index = 0;
    var periodVisited = '';
    var testDate = '';
    var isParsingDate = false;

    while (!texts[index].startsWith('附註') && index < length) {
        if (stringUtil.isBlank(noticeDate) && dateRegex.test(texts[index])) {
            noticeDate = texts[index].replace(' ', '');
        } else if (placeRegex.test(texts[index])) {
            // place
            var place = '';
            while (stringUtil.isNotBlank(texts[index])) {
                place += texts[index];
                index++;
            }

            if (stringUtil.isBlank(texts[index])) {
                index++;
            }

            // period visited
            if (
                stringUtil.isNotBlank(texts[index]) &&
                dateRegex.test(texts[index])
            ) {
                periodVisited = '';
                isParsingDate = true;
            }
            while (
                stringUtil.isNotBlank(texts[index]) &&
                !placeRegex.test(texts[index])
            ) {
                periodVisited += texts[index];
                index++;
            }

            // escape description
            while (
                isParsingDate &&
                !dateRegex.test(texts[index]) &&
                !placeRegex.test(texts[index])
            ) {
                index++;
            }

            // test date
            if (
                stringUtil.isNotBlank(texts[index]) &&
                dateRegex.test(texts[index])
            ) {
                testDate = '';
            }
            while (
                stringUtil.isNotBlank(texts[index]) &&
                !placeRegex.test(texts[index])
            ) {
                testDate += texts[index];
                index++;
            }
            isParsingDate = false;

            categoryList.push({
                place: place,
                visit_time: periodVisited,
                test_time: testDate,
                notice_date: noticeDate,
            });
        } else {
            index++;
        }
    }

    return categoryList;
}

main();
