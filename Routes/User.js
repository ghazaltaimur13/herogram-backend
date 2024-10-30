const FileController = require("../Controllers/FileController")
const UserController = require("../Controllers/UserController")
const express = require("express")

module.exports = function (app, authMiddleware, validators) {
    app.post(
        "/api/login", 
        express.static(path.join(__dirname, 'uploads')),
        UserController.login
    ),
    app.post(
        "/api/uploadFile",
        authMiddleware,
        FileController.uploadFiles
    )
}
