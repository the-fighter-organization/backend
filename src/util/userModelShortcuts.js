
export function getUserFromRequest(req) {
    let user = req.user._doc;

    return {
        _id: user._id,
        email: user.email,
        nome: user.nome
    }
}

export function getUserIdFromRequest(req) {
    return req.user._doc._id
}