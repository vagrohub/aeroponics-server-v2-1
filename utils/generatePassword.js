const generatePassword = (length) => {
    let password = '';

    for (let i = 0; i < length; i += 1) {
        let charCode = 122 - Math.round(Math.random() * 25);
        password += String.fromCharCode(charCode);
    }

    return password;
}

export default generatePassword;