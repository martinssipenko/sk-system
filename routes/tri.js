exports.reg = function(req, res) {
    res.render('indReg', {
        title: 'Reģistrācija - Triatlons - Šķūnenieku Kauss',
        eventType: 'tri',
        eventAction: 'reg'
    });
};

exports.sta = function(req, res) {
    res.render('indReg', {
        title: 'Starts - Triatlons - Šķūnenieku Kauss',
        eventType: 'tri',
        eventAction: 'sta'
    });
};

exports.fin = function(req, res) {
    res.render('indReg', {
        title: 'Finišs - Triatlons - Šķūnenieku Kauss',
        eventType: 'tri',
        eventAction: 'fin'
    });
};

exports.prot = function(req, res) {
    res.render('indReg', {
        title: 'Protokoli - Triatlons - Šķūnenieku Kauss',
        eventType: 'tri',
        eventAction: 'prot'
    });
};
