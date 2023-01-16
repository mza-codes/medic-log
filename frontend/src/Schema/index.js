import * as Yup from 'yup';

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