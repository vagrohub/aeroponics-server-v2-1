// Выброс ошибки, когда не удалось найти эксперимент по id
const experimentWithSpecifiedIdNotExist = (req, res) => {
    return res.status(404).send({
        error: `${req.body.id} not found`
    });
};

export {
    experimentWithSpecifiedIdNotExist
};