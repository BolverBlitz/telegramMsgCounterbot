/**
 * http://usejsdoc.org/
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

let botname = "msgCounter_bot";
let Version = "1.1"

let Sekunde = 1000;
let Minute = Sekunde*60;
let Stunde = Minute*60;
let Tag = Stunde*24;
let Monat = Tag*(365/12);
let Jahr = Tag*365;
let cooldown = [];

let started = new Date();

bot.start();

bot.on(/^\/info$/i, (msg) => {
	msg.reply.text("Botname: " + botname + "\nVersion: " + Version + "\n\nLast changes: (" + Version + ")\n- Added /info to display botname, version and changelog\n- Fixed issue with support answer\n- Added /delete Reply to a message to delete it\n- Fixed /help trigger in Groups, bot will only awnser if you use /help@" + botname + "\n- Updated /help text\n- Added /cl help\n\nNext big update?\n- FritzOS API Connection\n- Full Support for Fritz!DECT 200\n- Advanced Graphs and database for Dect 200 powerusage, voltage and temperature").then(function(msg)
             {
                     setTimeout(function(){
                             bot.deleteMessage(msg.result.chat.id,msg.result.message_id);
                     }, config.waittimetop);
             });
             bot.deleteMessage(msg.chat.id, msg.message_id);
});

bot.on(/^\/changelog$/i, (msg) => {
	 msg.reply.text("In Arbeit").then(function(msg)
             {
                     setTimeout(function(){
                             bot.deleteMessage(msg.result.chat.id,msg.result.message_id);
                     }, config.waittimetop);
             });
             bot.deleteMessage(msg.chat.id, msg.message_id);

});

bot.on(/^\/changelog(.+)$/i, (msg, props) => {
	bot.deleteMessage(msg.chat.id, msg.message_id);
});


bot.on(/^\/geburtstag$/i, (msg) => {
	 msg.reply.text("Error: Date and Time is missing.Do /geburtstag DD.MM.YYYY HH:MM:SS").then(function(msg)
             {
                     setTimeout(function(){
                             bot.deleteMessage(msg.result.chat.id,msg.result.message_id);
                     }, config.waittimetop);
             });
             bot.deleteMessage(msg.chat.id, msg.message_id);

     bot.deleteMessage(msg.chat.id, msg.message_id);
});

bot.on([/^\/geburtstag(.+)$/i,/^\/datumsrechner(.+)$/i], (msg, props) => {
	var startDateUnix = new Date().getTime();
	
	var props2 = props.match[1].split(' ')
	var date = props2[1].split('.');
	var time = props2[2].split(':');
	
	var dd = date[0];
	var mm = date[1];
	var yyyy = date[2];
	
	
	var thh = time[0];
	if(thh = 'undefined'){
	var thh = 00;
	}
	var tmm = time[1];
	if(tmm = 'undefined'){
	var tmm = 00;
	}
	var tss = time[2];
	if(tss = 'undefined'){
	var tss = 00;
	}
	var newDate = mm+"/"+dd+"/"+yyyy;
	var TimeDoneUnix = new Date(newDate).getTime() + thh * 60 * 60 * 1000 + tmm * 60 * 1000 + tss * 1000 + 60 * 60 * 1000;
    //msg.reply.text("String(props2) = [" + props2 + "]\nprops2[1] = " + date + "\nprops2[2] = " + time + "\n\ndate[0] = " + dd + "\ndate[1] = " + mm + "\ndate[2] = " + yyyy + "\n\ntime[0] = " + thh + "\ntime[1] = " + tmm + "\ntime[2] = " + tss + "\n\nAktuelles Datum: " + startDateUnix + "\nDein Datum: " + TimeDoneUnix);
	var monat = new Date().getMonth() + 1;
	var AlterSekunden = startDateUnix/1000 - TimeDoneUnix/1000;
	if(AlterSekunden < 0){
		var AlterSekundenZukunft = AlterSekunden*(-1);
			var TeilAlterJahre = Math.floor((AlterSekundenZukunft*1000)/Jahr);
			var TeilAlterJahreRest = AlterSekundenZukunft*1000-(TeilAlterJahre*Jahr)
	
			var TeilAlterMonate = Math.floor((TeilAlterJahreRest)/Monat);
			var TeilAlterMonateRest = TeilAlterJahreRest-(TeilAlterMonate*Monat)
	
			var TeilAlterTage =  Math.floor((TeilAlterMonateRest)/Tag);
			var TeilAlterTageRest = TeilAlterMonateRest-(TeilAlterTage*Tag)
	
			var TeilAlterStunde =  Math.floor((TeilAlterTageRest)/Stunde);
			var TeilAlterStundeRest = TeilAlterTageRest-(TeilAlterStunde*Stunde)
	
			var TeilAlterMinute =  Math.floor((TeilAlterStundeRest)/Minute);
			var TeilAlterMinuteRest = TeilAlterStundeRest-(TeilAlterMinute*Minute)
	
			var TeilAlterSekunde =  Math.floor((TeilAlterMinuteRest)/Sekunde);
			var TeilAlterSekundeRest = TeilAlterMinuteRest-(TeilAlterSekunde*Sekunde)
	
	msg.reply.text("Angegebenes Zukunftsdatum: " + dd + "." + mm + "." + yyyy + " " + thh + ":" + tmm + ":" + tss + "\nHeutiges Datum: " + new Date().getDate() + "." + monat + "." + new Date().getFullYear() +  " " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds() + "." + new Date().getMilliseconds() + "\n\n" + "Zeitunterschied in Sekunden: " + AlterSekundenZukunft + "\nDas sind:\nJahre: " + TeilAlterJahre + "\nMonate: " + TeilAlterMonate + "\nTage: " + TeilAlterTage + "\nStunden: " + TeilAlterStunde + "\nMinuten: " + TeilAlterMinute + "\nSekunden: " + TeilAlterSekunde + "\nMillisekunden: " + TeilAlterSekundeRest + "\nDies ist ohne berücksichtigung der Schaltjahre und Schaltsekunden!")
	bot.deleteMessage(msg.chat.id, msg.message_id);
	}else{
		
	var TeilAlterJahre = Math.floor((AlterSekunden*1000)/Jahr);
	var TeilAlterJahreRest = AlterSekunden*1000-(TeilAlterJahre*Jahr)
	
	var TeilAlterMonate = Math.floor((TeilAlterJahreRest)/Monat);
	var TeilAlterMonateRest = TeilAlterJahreRest-(TeilAlterMonate*Monat)
	
	var TeilAlterTage =  Math.floor((TeilAlterMonateRest)/Tag);
	var TeilAlterTageRest = TeilAlterMonateRest-(TeilAlterTage*Tag)
	
	var TeilAlterStunde =  Math.floor((TeilAlterTageRest)/Stunde);
	var TeilAlterStundeRest = TeilAlterTageRest-(TeilAlterStunde*Stunde)
	
	var TeilAlterMinute =  Math.floor((TeilAlterStundeRest)/Minute);
	var TeilAlterMinuteRest = TeilAlterStundeRest-(TeilAlterMinute*Minute)
	
	var TeilAlterSekunde =  Math.floor((TeilAlterMinuteRest)/Sekunde);
	var TeilAlterSekundeRest = TeilAlterMinuteRest-(TeilAlterSekunde*Sekunde)
	
	msg.reply.text("Angegebenes Geburtsdatum: " + dd + "." + mm + "." + yyyy + " " + thh + ":" + tmm + ":" + tss + "\nHeutiges Datum: " + new Date().getDate() + "." + monat + "." + new Date().getFullYear() +  " " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds() + "." + new Date().getMilliseconds() + "\n\n" + msg.from.username + ": dein Alter in Sekunden: " + AlterSekunden + "\nDas sind:\nJahre: " + TeilAlterJahre + "\nMonate: " + TeilAlterMonate + "\nTage: " + TeilAlterTage + "\nStunden: " + TeilAlterStunde + "\nMinuten: " + TeilAlterMinute + "\nSekunden: " + TeilAlterSekunde + "\nMillisekunden: " + TeilAlterSekundeRest + "\nDies ist ohne berücksichtigung der Schaltjahre und Schaltsekunden!")
	bot.deleteMessage(msg.chat.id, msg.message_id);
	}
	
});


bot.on('/pin', (msg) => {
	bot.pinChatMessage(msg.chat.id, msg.reply_to_message.message_id);
	bot.deleteMessage(msg.chat.id, msg.message_id);

});
bot.on('/delete',(msg) => {
bot.deleteMessage(msg.chat.id, msg.reply_to_message.message_id);
bot.deleteMessage(msg.chat.id, msg.message_id);
});


bot.on(/^\/support( .+)*$/i, (msg, props) => {
        const Para = props.match[1]
	bot.deleteMessage(msg.chat.id, msg.message_id);
        msg.reply.text("Vielen Dank. Der Support wurde informiert")
        bot.sendMessage(-1001236038060, "Benuzer: " + msg.from.id +" (" + msg.from.username + ")" + "\nGruppe:" + msg.chat.id + "\nNachricht: " + Para)
        });

bot.on(/^\/sreply( .+)*$/i, (msg, props) => {
        const Para = props.match[1].split(' ');
        var ID = Para[1]
		var MSG = Para[2]
	bot.deleteMessage(msg.chat.id, msg.message_id);
		for(var i = 3; i < Para.length;i++){
			MSG = MSG + " " + Para[i];
		}
			msg.reply.text("Eine Nachricht wurde an den User:" + ID + " gesendet\n" + MSG)
			bot.sendMessage(ID, "Antwort vom " + msg.from.username  + MSG)
        });

bot.on(/^\/cl$/i, (msg) => {
	 msg.reply.text("How to use /cl <Number> <Operator> <Number>\nCurrenty supportet:\n+  -  *  /\n'w' for square root\n'h' for squares\n\nJust for fun 'manu' and 'matt'").then(function(msg)
             {
                     setTimeout(function(){
                             bot.deleteMessage(msg.result.chat.id,msg.result.message_id);
                     }, config.waittimetop);
             });
             bot.deleteMessage(msg.chat.id, msg.message_id);

     bot.deleteMessage(msg.chat.id, msg.message_id);
});

bot.on(/^\/cl( .+)*$/i, (msg, props) => {
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




bot.on(/^\/outputhashid (.+)$/i, (msg, props) => {
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
	bot.deleteMessage(msg.chat.id, msg.message_id);
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
	bot.deleteMessage(msg.chat.id, msg.message_id);
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
	bot.deleteMessage(msg.chat.id, msg.message_id);
	if(msg.chat.type != "private")
	{
		if(msg.text.split(' ')[0].endsWith(botname))
		{
		let startmsg = "Message Counting: \n/optin (agree to collecting your messages for counting your msgs)\n/optout (disable collection)\n/checkcounting (check collection status)\n/overallmsgs (overall amount of msgs in group)\n/mymsgs (you're amount of msgs)\n/deletemymsgs (remove all collected data from the DB)\n/top <Zahl>\n/topall <Zahl>\n\n Random Stuff:\n/info Botname, Version and Changelog\n/geburtstag DD.MM.YYYY HH:MM:SS to get the time passed\n/cl to calculate numbers\n/support To get help";
		msg.reply.text(startmsg).then(function(msg)
	                        {
	                                setTimeout(function(){
	                                        bot.deleteMessage(msg.result.chat.id,msg.result.message_id);
	                                }, config.waittimestart);
	                        });
		bot.deleteMessage(msg.chat.id, msg.message_id);
		}
	}else{
		let startmsg = "Message Counting: \n/optin (agree to collecting your messages for counting your msgs)\n/optout (disable collection)\n/checkcounting (check collection status)\n/overallmsgs (overall amount of msgs in group)\n/mymsgs (you're amount of msgs)\n/deletemymsgs (remove all collected data from the DB)\n/top <Zahl>\n/topall <Zahl>\n\n Random Stuff:\n/info Botname, Version and Changelog\n/geburtstag DD.MM.YYYY HH:MM:SS to get the time passed\n/cl to calculate numbers\n/support To get help";
		msg.reply.text(startmsg).then(function(msg)
	                        {
	                                setTimeout(function(){
	                                        bot.deleteMessage(msg.result.chat.id,msg.result.message_id);
	                                }, config.waittimestart);
	                        });
		bot.deleteMessage(msg.chat.id, msg.message_id);
	}
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





bot.on(/^\/top$/i, (msg) => {
	bot.deleteMessage(msg.chat.id, msg.message_id);
	 msg.reply.text("Error: Length is missing\n\nUsage:\n/top <Length>\nExample /top 10 to display a 10 user long list.\nYou can also use /toptoday or /topweek").then(function(msg)
             {
                     setTimeout(function(){
                             bot.deleteMessage(msg.result.chat.id,msg.result.message_id);
                     }, config.waittimetop);
             });
             bot.deleteMessage(msg.chat.id, msg.message_id);

     bot.deleteMessage(msg.chat.id, msg.message_id);
});

bot.on(/^\/top (.+)$/i, (msg, props) => {
	bot.deleteMessage(msg.chat.id, msg.message_id);
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




bot.on(/^\/topall$/i, (msg) => {
	 msg.reply.text("Error: Length is missing\n\nUsage:\n/topall <Length>\nExample /topall 10 to display a 10 user long list.\nYou can also use /toptodayall or /topweekall").then(function(msg)
            {
                    setTimeout(function(){
                            bot.deleteMessage(msg.result.chat.id,msg.result.message_id);
                    }, config.waittimetop);
            });
            bot.deleteMessage(msg.chat.id, msg.message_id);

    bot.deleteMessage(msg.chat.id, msg.message_id);
});

bot.on(/^\/topall (.+)$/i, (msg, props) => {
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
