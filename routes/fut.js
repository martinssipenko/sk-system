exports.reg = function(req, res) {
    res.render('indReg', {
        title: 'Reģistrācija - Futbols - Šķūnenieku Kauss',
        eventType: 'fut',
        eventAction: 'reg'
    });
};

exports.prot = function(req, res) {
    res.render('indReg', {
        title: 'Protokoli - Futbols - Šķūnenieku Kauss',
        eventType: 'fut',
        eventAction: 'prot'
    });
};
