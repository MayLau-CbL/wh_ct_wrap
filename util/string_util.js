
class StringUtil {
    constructor() {}

    isBlank(str) {
        return !str || /^\s*$/.test(str);
    }

    isNotBlank(str) {
        return !this.isBlank(str);
    }
}
const stringUtil = new StringUtil();
module.exports = stringUtil;
