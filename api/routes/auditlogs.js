const express = require("express");
const router = express.Router();

// Get all audit logs
router.get("/", (req, res, next) => {
    res.json({
        message: 'All audit logs',
        body: req.body,
        query: req.query,
        params: req.params,
        headers: req.headers,
    });
});

// Get specific audit log by ID
router.get("/:id", (req, res, next) => {
    res.json({
        message: 'Single audit log',
        id: req.params.id,
        body: req.body,
        query: req.query,
        params: req.params,
        headers: req.headers,
    });
});

module.exports = router;