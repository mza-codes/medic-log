import * as Yup from 'yup';
const isNum = /^\d+\.?\d*$/;

export const userSchema = Yup.object().shape({
    email: Yup.string().email().required().min(6).max(46),
    name: Yup.string().required().min(3).max(46),
    password: Yup.string().min(6).max(19).required(),
    // confirmPassword: Yup.string().required().oneOf([Yup.ref('password'), null], 'Passwords must match')
    confirmPassword: Yup.string().required().equals([Yup.ref("password")], "Passwords Must Match")
});

export const loginSchema = Yup.object().shape({
    email: Yup.string().email().required().min(6).max(46),
    password: Yup.string().min(6).max(19).required()
});

export const emailSchema = Yup.object().shape({
    email: Yup.string().email("Invalid Email Address").min(6).max(30).required()
});

export const otpSchema = Yup.object().shape({
    otp: Yup.string().min(4).max(7).required().test('isNumber', v => isNum.test(v))
});