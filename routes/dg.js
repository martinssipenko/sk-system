exports.reg = function(req, res) {
    res.render('indReg', {
        title: 'Reģistrācija - Disk Golfd - Šķūnenieku Kauss',
        eventType: 'dg',
        eventAction: 'reg'
    });
};

exports.prot = function(req, res) {
    res.render('indReg', {
        title: 'Protokoli - Disk Golfd - Šķūnenieku Kauss',
        eventType: 'dg',
        eventAction: 'prot'
    });
};
