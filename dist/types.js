var files;
(function (files) {
    let moveOptionsExisting;
    (function (moveOptionsExisting) {
        moveOptionsExisting[moveOptionsExisting["replace"] = 0] = "replace";
        moveOptionsExisting[moveOptionsExisting["rename"] = 1] = "rename";
        moveOptionsExisting[moveOptionsExisting["continue"] = 2] = "continue";
        moveOptionsExisting[moveOptionsExisting["stop"] = 3] = "stop";
    })(moveOptionsExisting = files.moveOptionsExisting || (files.moveOptionsExisting = {}));
})(files || (files = {}));
//# sourceMappingURL=types.js.map