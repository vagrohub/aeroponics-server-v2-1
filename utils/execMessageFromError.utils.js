const execMessageFromError = (error, message) => {
    return typeof error === 'string' ?
        error : error.message || message || error
};

export default execMessageFromError;
