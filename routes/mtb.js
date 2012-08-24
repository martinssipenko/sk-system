exports.reg = function(req, res) {
    res.render('indReg', {
        title: 'Reģistrācija - MTB - Šķūnenieku Kauss',
        eventType: 'mtb',
        eventAction: 'reg'
    });
};

exports.sta = function(req, res) {
    res.render('indReg', {
        title: 'Starts - MTB - Šķūnenieku Kauss',
        eventType: 'mtb',
        eventAction: 'sta'
    });
};

exports.fin = function(req, res) {
    res.render('indReg', {
        title: 'Finišs - MTB - Šķūnenieku Kauss',
        eventType: 'mtb',
        eventAction: 'fin'
    });
};

exports.prot = function(req, res) {
    res.render('indReg', {
        title: 'Protokoli - MTB - Šķūnenieku Kauss',
        eventType: 'mtb',
        eventAction: 'prot'
    });
};
