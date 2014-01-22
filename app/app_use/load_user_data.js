console.log('load load_user_data..');
var g = require('../global.js');
var a = g.app_fnc;

//загружаем данные пользователя в res.locals.user
module.exports = function(req,res,next){
    
    g.log.info("load res.locals.user..");
    if(!req.session || !req.session.user){
        g.log.info("!req.session || !req.session.user");
        //res.render("need_auth.ect",{g:g});
        a.render(req,res,"need_auth.ect",{g:g})
        return 0;
    }
    
    res.locals.user = req.session.user;
    
    return next();
}
