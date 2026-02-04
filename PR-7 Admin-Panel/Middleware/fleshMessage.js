const fleshMessage = (req, res, next) => {
    res.locals.success_msg = req.flash('success');
    res.locals.error_msg = req.flash('error');
    res.locals.warning_msg = req.flash('warning');
    res.locals.info_msg = req.flash('info');
    next()
}

module.exports = fleshMessage;