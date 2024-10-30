const FileController = require("../Controllers/FileController")
const UserController = require("../Controllers/UserController")

module.exports = function (app, authMiddleware, validators) {
    app.post(
        "/api/login", 
        UserController.login
    ),
    app.post(
        "/api/uploadFile",
        authMiddleware,
        FileController.uploadFiles
    ),
    app.get(
        "/api/readFiles",
        authMiddleware,
        FileController.readFiles
    ),
    app.post(
        "/api/trackFiles",
        authMiddleware,
        FileController.trackFiles
    )
}
