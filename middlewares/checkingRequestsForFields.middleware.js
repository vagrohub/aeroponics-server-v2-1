// Проверка наличия в поля field свойства property
const  checkingRequestsForFields = (field, ...propertys) => (req, res, next) => {
    const missingFields = [];
    const reqField = req[field];

    if (!reqField) {
        return res
            .status(400)
            .send({
                error: `Не найдено поле: ${field}`
            });
    }

    propertys.forEach(prop => {
        if (reqField[prop]) {
            return;
        }

        missingFields.push(prop);
    });

    if (missingFields.length === 0) {
        return next();
    }

    return res
        .status(400)
        .send({
            error: `Не удалось найти поля ${missingFields.join(', ')} в ${field}`
        });
};

export default checkingRequestsForFields;
