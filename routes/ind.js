exports.reg = function(req, res) {
    res.render('indReg', {
        title: 'Reģistrācija - 10KM - Šķūnenieku Kauss',
        eventType: '10km',
        eventAction: 'reg'
    });
};

exports.regpost = function(req, res) {
    res.send('indReg');
};

exports.sta = function(req, res) {
    res.render('indReg', {
        title: 'Starts - 10KM - Šķūnenieku Kauss',
        eventType: '10km',
        eventAction: 'sta'
    });
};

exports.fin = function(req, res) {
    res.render('indReg', {
        title: 'Finišs - 10KM - Šķūnenieku Kauss',
        eventType: '10km',
        eventAction: 'fin'
    });
};

exports.prot = function(req, res) {
    res.render('indReg', {
        title: 'Protokoli - 10KM - Šķūnenieku Kauss',
        eventType: '10km',
        eventAction: 'prot'
    });
};

exports.kom = function(req, res) {
    res.render('indReg', {
        title: 'Komentētājs - 10KM - Šķūnenieku Kauss',
        eventType: '10km',
        eventAction: 'kom'
    });
};

exports.cnum = function(req, res) {
    res.send('#SUCCESS');
};