// Checks if the user is the author of story
exports.validateId = (req, res, next) => {
    let id = req.params.id;
    //an objectId is a 24-bit Hex string
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid Trade Id');
        err.status = 400;
        return next(err);
    }
    else {
        return next();
    }
}