	
/**
 * http://usejsdoc.org/
 Kleiner Test
 */

/*jshint esversion: 6 */
var config = require('./config');
const Telebot = require('telebot');
const bot = new Telebot({
	token: config.bottoken,
	limit: 1000,
        usePlugins: ['commandButton']
});

const util = require('util');
const mysql = require('mysql'); 
const hash = require('hash-int');
var log;
var db = mysql.createPool({
	connectionLimit : 100,
	host: config.dbreaduserhost,
	user: config.dbreaduser,
	password: config.dbreaduserpwd,
	database: config.database,
	charset : 'utf8mb4'
});



let cooldown = [];

bot.start();

bot.on('/pin', (msg) => {
	bot.pinChatMessage(msg.chat.id, msg.reply_to_message.message_id);
	bot.deleteMessage(msg.chat.id, msg.message_id);

});

bot.on(/^\/pinthis( .+)*$/, (msg, props) => {
        bot.sendMessage(msg.chat.id, props);
	bot.pinChatMessage(msg.result.chat.id,msg.result.message_id);
	
        });
bot.on('/delete',(msg) => {
bot.deleteMessage(msg.chat.id, msg.reply_to_message.message_id);
bot.deleteMessage(msg.chat.id, msg.message_id);
});

bot.on('/addadmin', (msg) => {
        var checkOptin = "SELECT COUNT(*) FROM admintable, state AS state FROM admintable where userid = " + hash(msg.from.id) + ";";
      db.connection.query(checkOptin, function(err, rows) {
      if (rows[0].checkOptin == 1) {
	let sqlcmd = "INSERT IGNORE INTO admintable (userid, state) VALUES ?";
	var values = [[hash(msg.reply_to_message.from.id), 1]];
	db.getConnection(function(err, connection){
                connection.query(sqlcmd, [values], function(err, result){
			bot.deleteMessage(msg.chat.id, msg.message_id);
			msg.reply.text("@" + msg.from.username + " hat @" + msg.reply_to_message.from.username + " zum Admin Level 1 gemacht").then(function(msg)
                        {
                                setTimeout(function(){
                                        bot.deleteMessage(msg.result.chat.id,msg.result.message_id);
                                }, config.waittimetop);
                        });
			connection.release();
		});
	});
       };
     });
});


bot.on(/^\/support( .+)*$/, (msg, props) => {
        const Para = props.match[1]
	bot.deleteMessage(msg.chat.id, msg.message_id);
        msg.reply.text("Vielen Dank. Der Support wurde informiert")
        bot.sendMessage(-1001236038060, "Benuzer: " + msg.from.id +" (" + msg.from.username + ")" + "\nGruppe:" + msg.chat.id + "\nNachricht: " + Para)
        });

bot.on(/^\/sreply( .+)*$/, (msg, props) => {
        const Para = props.match[1].split(' ');
        var ID = Para[1]
        var MSG = Para[2]
	bot.deleteMessage(msg.chat.id, msg.message_id);
        msg.reply.text("Eine Nachricht wurde an den User:" + ID + " gesendet\n" + MSG)
        bot.sendMessage(ID, "Antwort vom Support: " + MSG)
        });



bot.on(/^\/cl( .+)*$/, (msg, props) => {
	bot.deleteMessage(msg.chat.id, msg.message_id);
        
        if (props === undefined) {
        msg.reply.text("Zahl1 Operant(+ - * / w(Wurzel) zahl2(Fals nötig")
        }else{

	const Para = props.match[1].split(' ');
	
        var e = Para[1]
        var op = Para[2]
        var a = Para[3]
        var er;
switch(op) {
case"+": er = parseInt(e) + parseInt(a);
break;
case"-": er = parseInt(e) - parseInt(a);
break;
case"*": er = parseInt(e) * parseInt(a);
break;
case"/": er = parseInt(e) / parseInt(a);
break;
case"w": er = Math.sqrt(e);
break;
case"h": er = Math.pow(e, a);
break;
case"manu": er = parseInt(e) / (0,5 * parseInt(e) ) * parseInt(hash(e));
break;
case"matt": er = parseInt(e) / (0,2 * parseInt(e) ) * (0,7 * parseInt(hash(e)) );
break;

}
if (op === 'x') {
var op2 = 'X';
}
if (op === 'w') {
var op2 = '√';
}
if (op === 'h') {
var op = '^';
}
if (op === 'manu') {
var op2 = 'Manu Faktor';
}
if (op === 'matt') {
var op2 = 'Matt Faktor';
}

        if (op === undefined) {
	msg.reply.text("Depp: Was soll ich mit der Zahl machen??? Du musst mir sagen was ich mit der Zahl tuen soll!")
	}else{
        if (a === undefined) {
	msg.reply.text("Rechnung: " + e +" "+ op2 + " = " + er )
	}else{
         msg.reply.text("Rechnung: " + e +" "+ op + " " + a + " = " + er )
	}
        
}
}
});

bot.on('/knopf', msg => {

    // Inline keyboard markup
    const replyMarkup = bot.inlineKeyboard([
        [
            // First row with command callback button
            bot.inlineButton('Command button', {callback: '/help'})
        ],
        [
            // Second row with regular command button
            bot.inlineButton('Regular data button', {callback: '/mymsgs'})
        ]
    ]);

    // Send message with keyboard markup
    return msg.reply.text('Example of command button.', {replyMarkup});

});

// Button callback
bot.on('callbackQuery', (msg) => {
    if (msg.data = 'lol') {
	bot.sendMessage(-1001319107313, 'Drogen Funktionieren');
	
	}
    if (msg.data = 'hello') {
    bot.sendMessage(-1001319107313, 'Drogen sind einfach');
        }
    bot.sendMessage('callbackQuery data:',msg.data);
    bot.answerCallbackQuery(msg.id);

});


/*
const queryString = require('querystring');
let l = 'http://foo.bar/whatever?ref=xxx&foo=bar';
l = l.substr(2);
l = queryString.parse(1);
console.log(l);
let params;
const myUrl = new URL('https://test.org/?ref=123');
console.log(myURL.searchParams.get('ref'));
params = new URLSearchParams('user=abc&etc');
console.log(params.get('user'));
*/


bot.on(/^\/outputhashid (.+)$/, (msg, props) => {
   if(msg.from.id == config.isSuperAdmin) {
    const IDtext = props.match[1];
    let sqlcmd = "SELECT COUNT(*) AS amount FROM messagetable WHERE userid = " + hash(IDtext) + ";";
    db.getConnection(function(err, connection){
                connection.query(sqlcmd, function(err, rows){
                bot.deleteMessage(msg.chat.id, msg.message_id);
                    msg.reply.text("ID als HASH " + "'" + hash(IDtext) + "'"  + "\n" + " current amount of " + IDtext + " msgs is: " + util.inspect(rows[0].amount,false,null))
            });
      connection.release();
        });
   }else{
     bot.deleteMessage(msg.chat.id, msg.message_id);
     msg.reply.text("Fehler " + msg.from.username + " besitzt nicht genug Rechte");
}


});

bot.on('text', (msg) => {
        
	var checkoptin = "SELECT COUNT(*) AS checkOptin FROM optintable where userid = " + hash(msg.from.id) + ";";
	db.getConnection(function(err, connection){
                connection.query(checkoptin, function(err, rows){
			if(rows[0].checkOptin==1){
				var sqlcmd = "INSERT INTO messagetable (msgid, userid, groupid) VALUES ?";
			        var values = [[msg.message_id, hash(msg.from.id), msg.chat.id]];
		        	db.query(sqlcmd, [values]);
			}
			connection.release();
		});
	});
});





bot.on('/optin', (msg) => {
msg.reply.text("Mit /optintrue stimmen sie zu dass der Bot folgendes Speichert:\n-Uhrzeit wann eine Nachricht geschrieben wurde\n-Gehashte Telegram USER ID\n-Gruppen ID\n-Die Nachrichten ID\nBei Admins wird zusätzlich ein Admin Level gespeichert\n\nSie können jederzeit ihre Einwilligung wiederrufen mit /optout\n\nMit /updateuserinfo könnt ihr euren aktuellen Nicknamen zu der gehashten USERID hinterlegen lassen, achtung so sind sie in der Datenbank nicht mehr Anonym! \nMit /deleteuserinfo können sie jederzeit ihren Nicknamen entfernen\n\nMit /deletemymsgs können sie sich aus der Bot Datenbank entfernen, dies kann nicht abgebrochen werden und die Daten sind für immer verloren! Dauer 0,003 Sekunden pro Nachricht\n\nGehasht wird von diesem Bot so Returns: A signed 32 bit integer representing the value of x")
});


bot.on('/optintrue', (msg) => {
	let sqlcmd = "INSERT INTO optintable (userid) VALUES ?";
	var values = [[hash(msg.from.id)]];
	db.getConnection(function(err, connection){
                connection.query(sqlcmd, [values], function(err, result){
			bot.deleteMessage(msg.chat.id, msg.message_id);
			msg.reply.text("You opted in for data collection!").then(function(msg)
                        {
                                setTimeout(function(){
                                        bot.deleteMessage(msg.result.chat.id,msg.result.message_id);
                                }, config.waittimeoptin);
                        });
			connection.release();
		});
	});
});

bot.on('/optout', (msg) =>{
	let sqlcmd = "DELETE FROM optintable WHERE userid = " + hash(msg.from.id) + ";";
	db.getConnection(function(err, connection){
                connection.query(sqlcmd, function(err, result){
			bot.deleteMessage(msg.chat.id, msg.message_id);
			msg.reply.text("You opted out for data collection").then(function(msg)
                        {
                                setTimeout(function(){
                                        bot.deleteMessage(msg.result.chat.id,msg.result.message_id);
                                }, config.waittimeoptout);
                        });
			connection.release();
		});
	});
});
bot.on('/flucht', (msg) => {
msg.reply.text("*Seil werf*")
});


bot.on('/checkcounting', (msg) => {
	let sqlcmd = "SELECT COUNT(*) AS logging FROM optintable where userid = " + hash(msg.from.id) + ";";
	db.getConnection(function(err, connection){
                connection.query(sqlcmd, function(err, rows){
			bot.deleteMessage(msg.chat.id, msg.message_id);
			msg.reply.text("Your current status is: " + util.inspect(rows[0].logging,false,null)).then(function(msg)
                        {
                                setTimeout(function(){
                                        bot.deleteMessage(msg.result.chat.id,msg.result.message_id);
                                }, config.waittimecheckcounting);
                        });
			connection.release();
		});
	});
});

bot.on('/overallmsgs', (msg) => {
        let sqlcmd = "SELECT COUNT(*) AS amount FROM messagetable";
	db.getConnection(function(err, connection){
                connection.query(sqlcmd, function(err, rows){
			bot.deleteMessage(msg.chat.id, msg.message_id);
        	        msg.reply.text("The current amount of overall DB Lines is: " + util.inspect(rows[0].amount,false,null)).then(function(msg)
                        {
                                setTimeout(function(){
                                        bot.deleteMessage(msg.result.chat.id,msg.result.message_id);
                                }, config.waittimeoverallmsgs);
                        });
			connection.release();
	        });
	});
});

bot.on('/mymsgs', (msg) => {
        let sqlcmd = "SELECT COUNT(*) AS amount FROM messagetable WHERE userid = " + hash(msg.from.id) + ";";
	db.getConnection(function(err, connection){
                connection.query(sqlcmd, function(err, rows){
			bot.deleteMessage(msg.chat.id, msg.message_id);
        	        msg.reply.text(msg.from.username + " current amount of own msgs is: " + util.inspect(rows[0].amount,false,null)).then(function(msg)
                        {
                                setTimeout(function(){
                                        bot.deleteMessage(msg.result.chat.id,msg.result.message_id);
                                }, config.waittimemymsgs);
                        });
			connection.release();
	        });
	});
});

bot.on('/deletemymsgs', (msg) => {
        let sqlcmd = "DELETE FROM messagetable WHERE userid = " + hash(msg.from.id) + ";";
	db.getConnection(function(err, connection){
                connection.query(sqlcmd, function(err, rows){
			bot.deleteMessage(msg.chat.id, msg.message_id);
                	msg.reply.text("Your msgs have been deleted :(").then(function(msg)
                        {
                                setTimeout(function(){
                                        bot.deleteMessage(msg.result.chat.id,msg.result.message_id);
                                }, config.waittimedeletemymsgs);
                        });
			connection.release();
	        });
	});
});

bot.on(['/start', '/help'], (msg) => {
	let startmsg = "Commands:\n/optin (agree to collecting your messages for counting your msgs)\n/optout (disable collection)\n/checkcounting (check collection status)\n/overallmsgs (overall amount of msgs in group)\n/mymsgs (you're amount of msgs)\n/deletemymsgs (remove all collected data from the DB)\n/top <Zahl>\n/topall <Zahl>";
	msg.reply.text(startmsg).then(function(msg)
                        {
                                setTimeout(function(){
                                        bot.deleteMessage(msg.result.chat.id,msg.result.message_id);
                                }, config.waittimestart);
                        });
	bot.deleteMessage(msg.chat.id, msg.message_id);
});

bot.on(['/topinfo'], (msg) => {
	let startmsg = "Commands:\n/top <ListenLänge> \n/topall <ListenLänge \n/topweek <ListenLänge>\n/toptoday <ListenLänge>>";
	msg.reply.text(startmsg).then(function(msg)
                        {
                                setTimeout(function(){
                                        bot.deleteMessage(msg.result.chat.id,msg.result.message_id);
                                }, config.waittimestart);
                        });
	bot.deleteMessage(msg.chat.id, msg.message_id);
});

//updates userinformation
bot.on('/updateuserinfo', (msg) => {
        let sqlcmd = "UPDATE optintable SET username = ? WHERE userid = ?";
        var values = [msg.from.username, hash(msg.from.id)];
        db.getConnection(function(err, connection){
                connection.query(sqlcmd, values, function(err, result){
                        if(err) throw err;
			bot.deleteMessage(msg.chat.id, msg.message_id);
                        msg.reply.text("Your User infos have been updated").then(function(msg)
                        {
                                setTimeout(function(){
                                        bot.deleteMessage(msg.result.chat.id,msg.result.message_id);
                                }, config.waittimeupdateuserinfo);
                        });
                        connection.release();
                });
        });
});

//updates userinformation
bot.on('/deleteuserinfo', (msg) => {
        let sqlcmd = "UPDATE optintable SET username = null WHERE userid = ?";
        var values = [hash(msg.from.id)];
        db.getConnection(function(err, connection){
		connection.query(sqlcmd, values, function(err, result){
                        if(err) throw err;
                        bot.deleteMessage(msg.chat.id, msg.message_id);
                        msg.reply.text("Your User infos have been updated").then(function(msg)
                        {
                                setTimeout(function(){
                                        bot.deleteMessage(msg.result.chat.id,msg.result.message_id);
                                }, config.waittimedeleteuserinfo);
                        });
                        connection.release();
                });
        });
});

bot.on('/ping', (msg) => {
        msg.reply.text("Pong, Pung, Ping! Ente!!!! FOOOOOOOSSS!!!").then(function(msg)
		{
                	setTimeout(function(){
                        	bot.deleteMessage(msg.result.chat.id,msg.result.message_id);
                       	}, config.waittimeping);
               	});
	bot.deleteMessage(msg.chat.id, msg.message_id);
});


bot.on(/^\/topall (.+)$/, (msg, props) => {
        var l = props.match[1];
        
	if (isNaN(l)) {
	var l = 10;
	var t = 1;
	}
	if (l > 500) {
	var l = 499;
	var t = 1;
	}
	if (l < 0) {
	var l = 1;
	var t=1;
	}
        bot.sendAction(msg.chat.id, 'typing');
        let SELECT = "SELECT DISTINCT COUNT( `messagetable`.`msgid` ) AS `Msgs`, `messagetable`.`userid` AS `User`, `optintable`.`username` AS `Username`";
        let FROM = " FROM { oj `counterdb`.`messagetable` AS `messagetable` NATURAL LEFT OUTER JOIN `counterdb`.`optintable` AS `optintable` }";
        let GROUP = " GROUP BY `messagetable`.`userid`";
        let ORDER = " ORDER BY Msgs DESC LIMIT " + l + ";" ;
        let sqlcmd = SELECT + FROM + GROUP + ORDER;
        db.getConnection(function(err, connection) {
                connection.query(sqlcmd, function(err, rows){
                        if(err) msg.reply.text("Zu blöd ne Nummer einzugeben?", { parseMode: 'markdown' });
			if(err) var t=1;
                        let result = "The top " + l + " people writing msgs: \n";
                        for(var i in rows)
                        {
                                var i1 = +i +1;
                                let user = "";
                                if(rows[i].Username != null)
                                {
                                        user = ". [" + rows[i].Username + "](t.me/" + rows[i].Username + ")";
                                }else{
                                        user = ". " + rows[i].User;
                                }
                                result = result + i1 + user + " | Msgs#: " + rows[i].Msgs;
                                result = result + "\n";
                        }
                        result = result + "\nIf you want you're name to show up use: /updateuserinfo\nWhen you want to anonymize youreself again use /deleteuserinfo\n\nEulen triggerd:" + t;
                        msg.reply.text(result, { parseMode: 'markdown' }).then(function(msg)
                        {
			
                                setTimeout(function(){
                                        bot.deleteMessage(msg.result.chat.id,msg.result.message_id);
                                }, config.waittimetop);
                        });
			bot.deleteMessage(msg.chat.id, msg.message_id);
                        connection.release();
                });
        });
});




bot.on('/toptodayall', (msg) => {
                bot.sendAction(msg.chat.id, 'typing');
                let SELECT = "SELECT DISTINCT COUNT( `messagetable`.`msgid` ) AS `Msgs`, `messagetable`.`userid` AS `User`, `optintable`.`username` AS `Username`";
                let FROM = " FROM { oj `counterdb`.`messagetable` AS `messagetable` NATURAL LEFT OUTER JOIN `counterdb`.`optintable` AS `optintable` }";
                let WHERE = " WHERE DATE(`messagetable`.`time`) = CURDATE()";
                let GROUP = " GROUP BY `messagetable`.`userid`";
                let ORDER = " ORDER BY `Msgs` DESC LIMIT 10;";
                let sqlcmd = SELECT + FROM + WHERE + GROUP + ORDER;
                db.getConnection(function(err, connection) {
                        connection.query(sqlcmd, function(err, rows){
                                if(err) throw err;
                                let result = "The top people 10 writing msgs to DAY are: \n";
                                for(var i in rows)
                                {
                                        var i1 = +i +1;
                                        let user = "";
                                        if(rows[i].Username != null)
                                        {
                                                user = ". [" + rows[i].Username + "](t.me/" + rows[i].Username + ")";
                                        }else{
                                                user = ". " + rows[i].User;
                                        }
                                        result = result + i1 + user + " | Messages#: " + rows[i].Msgs;
                                        result = result + "\n";
                                }
                                result = result + "\nIf you want you're name to show up use: /updateuserinfo\nWhen you want to anonymize youreself again use /deleteuserinfo";
                                if(msg.chat.type!="private")
                                {
                                        bot.deleteMessage(msg.chat.id, msg.message_id);
                                }
				msg.reply.text(result, { parseMode: 'markdown' }).then(function(msg)
                                {
                                        setTimeout(function(){
                                                bot.deleteMessage(msg.result.chat.id,msg.result.message_id);
                                        }, config.waittimetop);
                                });
                                connection.release();
                        });
                });
});

//sends a list containing the top 10 people writing msgs of the last week
bot.on('/topweekall', (msg) => {
                bot.sendAction(msg.chat.id, 'typing');
                let SELECT = "SELECT DISTINCT COUNT( `messagetable`.`msgid` ) AS `Msgs`, `messagetable`.`userid` AS `User`, `optintable`.`username` AS `Username`";
                let FROM = " FROM { oj `counterdb`.`messagetable` AS `messagetable` NATURAL LEFT OUTER JOIN `counterdb`.`optintable` AS `optintable` }";
		let WHERE = " WHERE (`messagetable`.`time` > (now() - INTERVAL 1 WEEK))";
                let GROUP = " GROUP BY `messagetable`.`userid`";
                let ORDER = " ORDER BY `Msgs` DESC LIMIT 10;";
                let sqlcmd = SELECT + FROM + WHERE + GROUP + ORDER;
                db.getConnection(function(err, connection) {
                        connection.query(sqlcmd, function(err, rows){
                                if(err) throw err;
                                let result = "The top people 10 writing msgs this WEEK are: \n";
                                for(var i in rows)
                                {
                                        var i1 = +i +1;
                                        let user = "";
                                        if(rows[i].Username != null)
                                        {
                                                user = ". [" + rows[i].Username + "](t.me/" + rows[i].Username + ")";
                                        }else{
                                                user = ". " + rows[i].User;
                                        }
                                        result = result + i1 + user + " | Messages#: " + rows[i].Msgs;
                                        result = result + "\n";
                                }
                                result = result + "\nIf you want you're name to show up use: /updateuserinfo\nWhen you want to anonymize youreself again use /deleteuserinfo";
                                if(msg.chat.type!="private")
                                {
                                        bot.deleteMessage(msg.chat.id, msg.message_id);
                                }
				msg.reply.text(result, { parseMode: 'markdown' }).then(function(msg)
                                {
                                        setTimeout(function(){
                                                bot.deleteMessage(msg.result.chat.id,msg.result.message_id);
                                        }, config.waittimetop);
                                });
                                connection.release();
                        });
                });
});

});
bot.on(/^\/top\s*(\d+)?$/, (msg, props) => {
  console.log( props.length)
    if(props.length.split(' ') === 1) {
    var l = props.match[1];
  if (isNaN(l)) {
  var l = 10;
  var t = 1;
  }
  if (l > 500) {
  var l = 499;
  var t = 1;
  }
        bot.sendAction(msg.chat.id, 'typing');
	    let groupid = msg.chat.id
        let SELECT = "SELECT DISTINCT COUNT( `messagetable`.`msgid` ) AS `Msgs`, `messagetable`.`userid` AS `User`, `optintable`.`username` AS `Username`";
        let FROM = " FROM { oj `counterdb`.`messagetable` AS `messagetable` NATURAL LEFT OUTER JOIN `counterdb`.`optintable` AS `optintable` }";
    	let WHERE = " WHERE groupid = " + groupid;
        let GROUP = " GROUP BY `messagetable`.`userid`";
        let ORDER = " ORDER BY Msgs DESC LIMIT " + l + ";" ;
     	let sqlcmd = SELECT + FROM + WHERE + GROUP + ORDER;
        db.getConnection(function(err, connection) {
                connection.query(sqlcmd, function(err, rows){
                        if(err) msg.reply.text("Zu blöd ne Nummer einzugeben?", { parseMode: 'markdown' });
			if(err) var t=1;
                        let result = "The top " + l + " people writing msgs in this GROUP are: \n";
                        for(var i in rows)
                        {
                                var i1 = +i +1;
                                let user = "";
                                if(rows[i].Username != null)
                                {
                                        user = ". [" + rows[i].Username + "](t.me/" + rows[i].Username + ")";
                                }else{
                                        user = ". " + rows[i].User;
                                }
                                result = result + i1 + user + " | Msgs#: " + rows[i].Msgs;
                                result = result + "\n";
                        }
                        result = result + "\nIf you want you're name to show up use: /updateuserinfo\nWhen you want to anonymize youreself again use /deleteuserinfo\n\nEulen triggerd:" + t;
                        msg.reply.text(result, { parseMode: 'markdown' }).then(function(msg)
                        {
                                setTimeout(function(){
                                        bot.deleteMessage(msg.result.chat.id,msg.result.message_id);
                                }, config.waittimetop);
                        });
			bot.deleteMessage(msg.chat.id, msg.message_id);
                        connection.release();
                });
        });
   }else{
   msg.reply.text("Error: Lenph is missing\n\nUsage:\n/top <Lengh>\nExample /top 10 tp display a 10 user long list." + props.lenth + props).then(function(msg)
                        {
                                setTimeout(function(){
                                        bot.deleteMessage(msg.result.chat.id,msg.result.message_id);
                                }, config.waittimetop);
                        });
                        bot.deleteMessage(msg.chat.id, msg.message_id);

   bot.deleteMessage(msg.chat.id, msg.message_id);

   };
});


bot.on('/toptoday', (msg) => {
        bot.sendAction(msg.chat.id, 'typing');
	    let groupid = msg.chat.id
        let SELECT = "SELECT DISTINCT COUNT( `messagetable`.`msgid` ) AS `Msgs`, `messagetable`.`userid` AS `User`, `optintable`.`username` AS `Username`";
        let FROM = " FROM { oj `counterdb`.`messagetable` AS `messagetable` NATURAL LEFT OUTER JOIN `counterdb`.`optintable` AS `optintable` }";
        let WHERE = " WHERE groupid = " + groupid + " AND DATE(`messagetable`.`time`) = CURDATE()";
        let GROUP = " GROUP BY `messagetable`.`userid`";
        let ORDER = " ORDER BY `Msgs` DESC LIMIT 10;";
     	let sqlcmd = SELECT + FROM + WHERE + GROUP + ORDER;
        db.getConnection(function(err, connection) {
                connection.query(sqlcmd, function(err, rows){
                        if(err) throw err;
                        let result = "The top people 10 writing msgs this DAY in THIS group are: \n";
                        for(var i in rows)
                        {
                                var i1 = +i +1;
                                let user = "";
                                if(rows[i].Username != null)
                                {
                                        user = ". [" + rows[i].Username + "](t.me/" + rows[i].Username + ")";
                                }else{
                                        user = ". " + rows[i].User;
                                }
                                result = result + i1 + user + " | Msgs#: " + rows[i].Msgs;
                                result = result + "\n";
                        }
                        result = result + "\nIf you want you're name to show up use: /updateuserinfo\nWhen you want to anonymize youreself again use /deleteuserinfo";
                        msg.reply.text(result, { parseMode: 'markdown' }).then(function(msg)
                        {
                                setTimeout(function(){
                                        bot.deleteMessage(msg.result.chat.id,msg.result.message_id);
                                }, config.waittimetop);
                        });
			bot.deleteMessage(msg.chat.id, msg.message_id);
                        connection.release();
                });
        });
});

bot.on('/topweek', (msg) => {
        bot.sendAction(msg.chat.id, 'typing');
	    let groupid = msg.chat.id
        let SELECT = "SELECT DISTINCT COUNT( `messagetable`.`msgid` ) AS `Msgs`, `messagetable`.`userid` AS `User`, `optintable`.`username` AS `Username`";
        let FROM = " FROM { oj `counterdb`.`messagetable` AS `messagetable` NATURAL LEFT OUTER JOIN `counterdb`.`optintable` AS `optintable` }";
    	let WHERE = " WHERE groupid = " + groupid + " AND (`messagetable`.`time` > (now() - INTERVAL 1 WEEK))";
        let GROUP = " GROUP BY `messagetable`.`userid`";
        let ORDER = " ORDER BY `Msgs` DESC LIMIT 10;";
     	let sqlcmd = SELECT + FROM + WHERE + GROUP + ORDER;
        db.getConnection(function(err, connection) {
                connection.query(sqlcmd, function(err, rows){
                        if(err) throw err;
                        let result = "The top people 10 writing msgs this WEEK in THIS group are: \n";
                        for(var i in rows)
                        {
                                var i1 = +i +1;
                                let user = "";
                                if(rows[i].Username != null)
                                {
                                        user = ". [" + rows[i].Username + "](t.me/" + rows[i].Username + ")";
                                }else{
                                        user = ". " + rows[i].User;
                                }
                                result = result + i1 + user + " | Msgs#: " + rows[i].Msgs;
                                result = result + "\n";
                        }
                        result = result + "\nIf you want you're name to show up use: /updateuserinfo\nWhen you want to anonymize youreself again use /deleteuserinfo";
                        msg.reply.text(result, { parseMode: 'markdown' }).then(function(msg)
                        {
                                setTimeout(function(){
                                        bot.deleteMessage(msg.result.chat.id,msg.result.message_id);
                                }, config.waittimetop);
                        });
			bot.deleteMessage(msg.chat.id, msg.message_id);
                        connection.release();
                });
        });
});


