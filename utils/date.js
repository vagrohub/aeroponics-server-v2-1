const dateToString = (date) => {
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    };
    return date.toLocaleDateString('en-GB', options)
};

const parserDateFromMicrocontroller = sourceDate => {
    const dateRegExp = /(\d+):(\d+):(\d+) (\d+)\.(\d+)\.(\d+)/gm;

    try {
        const [
            _,
            hours,
            minute,
            seconds,
            day,
            month,
            year
        ] = dateRegExp.exec(sourceDate);

        return new Date(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day),
            parseInt(hours),
            parseInt(minute),
            parseInt(seconds),
        )
    } catch {
        return new Date();
    }
}

export {
    dateToString,
    parserDateFromMicrocontroller
}