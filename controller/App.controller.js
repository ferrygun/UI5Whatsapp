sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";
	var _id;

	return Controller.extend("pfe.bot.controller.App", {
		onChatPress: function() {
			var chatbot = this.getView().byId("botchat");
			chatbot._onOpenChat();
		},

		onSendPressed: function(oEvent){			
			var chatbot = this.getView().byId("botchat");
			var question = oEvent.getParameter("text");
			var this_ = this;

			console.log(question);
			//var data = '{"Body": "' + question + '", "From": "whatsapp:+14155238886", "MediaUrl": "https://demo.twilio.com/owl.png", "To": "whatsapp:+6512345678"}';
			var data = '{"Body": "' + question + '", "From": "whatsapp:+14155238886", "To": "whatsapp:+6512345678"}';
			var headers = {
				'Authorization':'User kDyXgv7DF2IjZ4eFpK/8qQMfLpaQGJ3f39U5FAkKnWg=, Organization f589b65c85a32fc5c3b35ec8c882f063, Element +5Wvb+VXjtbKj5xW0fEKh+XYUnR5N9epUizO/KKoX6o=',
				'Content-Type':'application/json'
			};
			
			jQuery.ajax({
				//Post Message
				url: "https://api.openconnectors.ext.hanatrial.ondemand.com/elements/api-v2/messages",
				cache: false,
				type: "POST",
				headers: headers,
				data: data,
				async: true,
				success: function(sData) {
					localStorage.setItem("chatId", sData.date_created);
					//console.log('[POST] /discover-dialog', sData);

					chatbot.botFinishTyping();
				},
				error: function(sError) {					
					chatbot.addChatItem("Something error!", false);      
				}
			});


			var ajax_get_response = function() {
				jQuery.ajax({
					url: "https://api.openconnectors.ext.hanatrial.ondemand.com/elements/api-v2/messages?pageSize=1",
					cache: false,
					type: "GET",
					headers: headers,
					async: true,
					success: function(sData) {
						//console.log('[GET] /discover-dialog', sData);
						localStorage.setItem("chatId", sData[0].date_created);

						if(sData[0].direction == 'inbound') {
							if (localStorage.getItem("chatId") != this_._id) {
								this_._id = localStorage.getItem("chatId");
								chatbot.addChatItem(sData[0].body, false);
								chatbot.botFinishTyping();								
							} 
						}
					},
					error: function(sError) {					
						chatbot.addChatItem("Something error!", false);      
					}
				});
			};

			var interval = 2000; 
			setInterval(ajax_get_response, interval);			
		}
	});
});