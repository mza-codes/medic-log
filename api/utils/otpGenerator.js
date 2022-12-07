const crypto = require('crypto');

const digits = '0123456789';
const lowerCaseAlphabets = 'abcdefghijklmnopqrstuvwxyz';
const upperCaseAlphabets = lowerCaseAlphabets.toUpperCase();
const specialChars = '#!&@';

module.exports = {
    /**
     * Generate OTP of the length
     * @param  {number} length length of password.
     * @param  {object} options
     * @param  {boolean} options.digits Default: `true` true value includes digits in OTP
     * @param  {boolean} options.lowerCaseAlphabets Default: `true` true value includes lowercase alphabets in OTP
     * @param  {boolean} options.upperCaseAlphabets Default: `true` true value includes uppercase alphabets in OTP
     * @param  {boolean} options.specialChars Default: `true` true value includes specialChars in OTP
     */
    generate: function (length, options) {
        length = length || 10
        const generateOptions = options || {}

        generateOptions.digits = Object.prototype.hasOwnProperty.call(generateOptions, 'digits')
            ? options.digits : false;
        generateOptions.lowerCaseAlphabets = Object.prototype.hasOwnProperty.call(generateOptions, 'lowerCaseAlphabets')
            ? options.lowerCaseAlphabets : false;
        generateOptions.upperCaseAlphabets = Object.prototype.hasOwnProperty.call(generateOptions, 'upperCaseAlphabets')
            ? options.upperCaseAlphabets : false;
        generateOptions.specialChars = Object.prototype.hasOwnProperty.call(generateOptions, 'specialChars')
            ? options.specialChars : false;

        const allowsChars = ((generateOptions.digits || '') && digits) +
            ((generateOptions.lowerCaseAlphabets || '') && lowerCaseAlphabets) +
            ((generateOptions.upperCaseAlphabets || '') && upperCaseAlphabets) +
            ((generateOptions.specialChars || '') && specialChars)
        let password = ''
        while (password.length < length) {
            const charIndex = crypto.randomInt(0, allowsChars.length)
            password += allowsChars[charIndex]
        }
        return password
    },
    generateNative: () => {
        let maxValue = 999999;
        let minValue = 111111;
        let otp = Math.floor(Math.random() * ((maxValue - minValue) + 1)) + minValue;
        return otp;
    }
};

// Copied from https://www.npmjs.com/package/otp-generator // Copied for editing & study purpose! Thanks to Contributors !