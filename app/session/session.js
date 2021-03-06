console.log('load session..');
var g = require('../global.js');
var a = g.app_fnc;
var m = g.mixa;
var cfg = g.app_config;

//функции для работы с сессиями
module.exports = {
    visit: session_visit,
    end: session_end,
    check_link_id: check_link_id,
    gen_link_id: gen_link_id,
}

function get_random_time_id() {
    return m.int.get_random_int(1,1000*1000);
}

var time_id_short = {
    last: get_random_time_id(),
    prev: get_random_time_id()
}
var time_id_long = {
    last: get_random_time_id(),
    prev: get_random_time_id()
}

if(cfg.get("link_time:short")>0){
    setInterval(function(){
        time_id_short.prev = time_id_short.last;
        time_id_short.last = get_random_time_id();
    },cfg.get("link_time:short")*1000);
}
if(cfg.get("link_time:long")>0){
    setInterval(function(){
        time_id_long.prev = time_id_short.last;
        time_id_long.last = get_random_time_id();
    },cfg.get("link_time:long")*1000);
}

function gen_link_id(req,res,is_long) {
    var r = req.session.lsid;
    if (is_long) {
        r += time_id_long.last;
    }else{
        r += time_id_short.last;
    }
    return r;    
}

function check_link_id(req,res,id,is_long) {
    var t = id - req.session.lsid;
    if (is_long) {
        if (time_id_long.last==t || time_id_long.prev==t) return 1;
    }else{
        if (time_id_short.last==t || time_id_short.prev==t) return 1;
    }
    req.session.lsid_req_error_count++;
    return 0;
}


//задаем сессию +отмечаем визит
function session_visit(req,res,next){
    //g.log.info("session_visit ..");
    req.session.count = req.session.count || 0;
    if(req.session.count==0){
        req.session.lsid = m.int.get_random_int(1000*1000*2,1000*1000*1000*9); //id сессии для генерации lid ссылок на ресурсы
        req.session.lsid_req_error_count = 0;
    }
    req.session.count++;
    
    //задаем gen_link_id() доступной для использования в шаблонах
    res.locals.data.gen_link_id = function(is_long){
        return gen_link_id(req,res,is_long);
    }
    
    next();
}

//уничтожаем сессию:
function session_end(req,res,callback){
    g.log.info("session_end ..");
    if(typeof req.session.destroy == 'function'){
        req.session.destroy(function(err){
            callback(err);
        });
        return;
    }
    req.session = null;
    delete req.session;
    callback();
}
