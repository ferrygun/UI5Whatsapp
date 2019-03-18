sap.ui.define(
  [	"sap/ui/core/Control",
	"sap/m/Button",
	"sap/ui/core/IconPool",
	"sap/m/Dialog",
	"sap/m/List",
	"sap/m/FeedListItem",
	"sap/m/FeedInput",
	"sap/m/ResponsivePopover",
	"sap/m/VBox",
	"sap/m/ScrollContainer",
	"sap/m/Bar",
	"sap/m/Title",
	"sap/ui/core/ResizeHandler"
  ],
  function(Control, Button, IconPool, Dialog, List, FeedListItem, FeedInput, ResponsivePopover, VBox, ScrollContainer, Bar, Title, ResizeHandler) {
	var ChatDialog = Control.extend("pfe.bot.controls.ChatDialog",{
		
		metadata : {
			properties : {
				title: {type: "string", group: "Appearance", defaultValue: null},
			    
			    width: {type: "sap.ui.core.CSSSize", group: "Dimension", defaultValue: null},
				height: {type: "sap.ui.core.CSSSize", group: "Dimension", defaultValue: null},
			    
			    buttonIcon: {type: "sap.ui.core.URI", group: "Appearance", defaultValue: null},
				robotIcon: {type: "sap.ui.core.URI", group: "Appearance", defaultValue: null},
				userIcon: {type: "sap.ui.core.URI", group: "Appearance", defaultValue: null},
				
				initialMessage: {type: "string", group: "Appearance", defaultValue: "Hello, How can I help?"},
				placeHolder: {type: "string", group: "Appearance", defaultValue: "Post something here"}
			
			},
			aggregations : {
				_chatButton:  {type: "sap.m.Button", multiple: false},
				_popover: {type: "sap.m.ResponsivePopover", multiple: false}
				
			},
			events : {
				send: {
            		parameters : {
						text : {type : "string"}
					}
            	}
			}
		},
    	

    	init : function () {
    		
    		//initialisation code, in this case, ensure css is imported
	        var libraryPath = jQuery.sap.getModulePath("pfe.bot"); 
	        jQuery.sap.includeStyleSheet(libraryPath + "/css/bkChat.css"); 

			
			var oBtn = new Button(this.getId() + "-bkChatButton", {
				press: this._onOpenChat.bind(this)
			});
			this.setAggregation("_chatButton", oBtn);
			
			var oHeader = new Bar({
				contentLeft: new Button({
					icon: "sap-icon://sys-cancel",
					press: this._toggleClose.bind(this),
					tooltip: "Clear chat"
				}),
				contentMiddle: new Title(this.getId() + "-bkChatTitle", {}),
				contentRight: new Button({
					icon: "sap-icon://pushpin-off",
					press: this._toggleAutoClose.bind(this),
					tooltip: "Toggle"
				})
			});
			
			var oRpop = new ResponsivePopover(this.getId() + "-bkChatPop", {
				customHeader: oHeader,
				placement: "Top",
				showHeader: true,
				resizable: true,
				horizontalScrolling: false,
				verticalScrolling: false,
				beforeClose: function(e){
					ResizeHandler.deregister(this.sResizeHandleId);
				}.bind(this),
				afterOpen: function(e){
					this.sResizeHandleId = ResizeHandler.register(sap.ui.getCore().byId(this.getId() + "-bkChatPop"), this._saveDimensions.bind(this));
				}.bind(this),
			}).addStyleClass("sapUiTinyMargin");
			
			
			this.setAggregation("_popover", oRpop);
			
			var oFeedIn = new FeedInput(this.getId() + "-bkChatInput", {
				post: this._onPost.bind(this),
				showicon: true
			});
			
			oFeedIn.addEventDelegate({
    			onsapenter: function(oEvent) {
    				
    				oEvent.preventDefault();
    				
    				var sTxt = oFeedIn.getValue();
    				if(sTxt.length > 0){
	    				oFeedIn.fireEvent("post", {
							value: sTxt
						}, true, false);
						oFeedIn.setValue(null); 
    				}
			    }
			});
			
			var oFeedList = new List(this.getId() + "-bkChatList", {
				showSeparators: "None",
				showNoData: false
			});
			
			var oInitialFeedListItem = new FeedListItem(this.getId() + "-bkChatInitial", {
				showicon: true,
				text: "Hello I'm Ro Bot, how can i help you?"
			});
			oInitialFeedListItem.addStyleClass("bkRobotInput");
			oFeedList.addItem(oInitialFeedListItem);

			
			var oScroll = new ScrollContainer(this.getId() + "-bkChatScroll", {				
				horizontal: false,
				vertical: true,
				focusable: true
			});			
			oScroll.insertContent(oFeedList);

			
			var oStatusBar = new sap.m.Label(this.getId() + "-bkChatStatusBar", { text : ""
			}).addStyleClass("sapUiTinyMargin");

			var oVBox = new VBox({				
				items: [oScroll, oStatusBar, oFeedIn],
				fitContainer: true,
				justifyContent : "End",
            	alignItems : "Stretch"
			});
			
			oRpop.insertContent(oVBox, 0);
		},
    	
    	renderer  : function(oRm, oControl) {
    		
			var oChatBtn = oControl.getAggregation("_chatButton");
			var oPop = oControl.getAggregation("_popover");

			oRm.write("<div ");
			//oRm.addClass("bkChatButton");
			//oRm.writeClasses();
			oRm.write(">");
			
			oRm.renderControl(oChatBtn);
			oRm.renderControl(oPop);
			oRm.write("</div>");
		
		},
		
		onAfterRendering: function(args) {
            if(sap.ui.core.Control.prototype.onAfterRendering) {
             sap.ui.core.Control.prototype.onAfterRendering.apply(this,args);
            }
        },
        
        setTitle: function(sTitle){
        	this.setProperty("title", sTitle, true);
        	sap.ui.getCore().byId(this.getId() + "-bkChatTitle").setText(sTitle);
        },
                
        setHeight: function(sHeight){
        	this.setProperty("height", sHeight, true);
        	sap.ui.getCore().byId(this.getId() + "-bkChatPop").setContentHeight(sHeight);
        	
        	var iScrollHeight = sHeight.substring(0, sHeight.length - 2) - "96px".substring(0, "96px".length - 2);
        	sap.ui.getCore().byId(this.getId() + "-bkChatScroll").setHeight(iScrollHeight + "px");
        },
        
        setWidth: function(sWidth){
        	this.setProperty("width", sWidth, true);
        	sap.ui.getCore().byId(this.getId() + "-bkChatPop").setContentWidth(sWidth);
        },
        
        
        setUserIcon: function(sUserIcon){
        	this.setProperty("userIcon", sUserIcon, true);
        	sap.ui.getCore().byId(this.getId() + "-bkChatInput").setIcon(sUserIcon);
        },
        
        setRobotIcon: function(sRobotIcon){
        	this.setProperty("robotIcon", sRobotIcon, true);
        	sap.ui.getCore().byId(this.getId() + "-bkChatInitial").setIcon(sRobotIcon);
        },
        
        setButtonIcon: function(sButtonIcon){
        	//this.setProperty("buttonIcon", sButtonIcon, true);
        	//sap.ui.getCore().byId(this.getId() + "-bkChatButton").setIcon(sButtonIcon);
        },
        
        setInitialMessage: function(sText){
        	this.setProperty("initialMessage", sText, true);
        	sap.ui.getCore().byId(this.getId() + "-bkChatInitial").setText(sText);
        },
        
        setPlaceHolder: function(sText){
        	this.setProperty("placeHolder", sText, true);
        	sap.ui.getCore().byId(this.getId() + "-bkChatInput").setPlaceholder(sText);
        },
        
        _onPost: function(oEvent){     
			var this_ = this;
			setTimeout(function () {
				this_.botStartTyping();
			}, 1000);

			var sText = oEvent.getSource().getValue();
			this.addChatItem(sText, true);
			this.fireEvent("send", {
				text: sText
			}, false, true);        	
        },
        
        _onOpenChat: function(oEvent){
        	this.getAggregation("_popover").openBy(this.getAggregation("_chatButton"));
        	this.getAggregation("_popover").setContentHeight(this.getProperty("height"));
			this.getAggregation("_popover").setContentWidth(this.getProperty("width"));
        },
        
        _saveDimensions: function(oEvent){
			//console.log(sap.ui.getCore().byId(this.getId() + "-bkChatPop").getContentHeight() + ", " + oEvent.size.height);
        	this.setProperty("height", oEvent.size.height + "px", true);
        	this.setProperty("width", oEvent.size.width + "px", true);
        },
        
        _toggleAutoClose: function(oEvent){
       
        	var bAuto = this.getAggregation("_popover").getAggregation("_popup").oPopup.getAutoClose();
        	if(bAuto){
        		oEvent.getSource().setProperty("icon", "sap-icon://pushpin-on");
        		this.getAggregation("_popover").getAggregation("_popup").oPopup.setAutoClose(false);
        	}else {
        		oEvent.getSource().setProperty("icon", "sap-icon://pushpin-off");
        		this.getAggregation("_popover").getAggregation("_popup").oPopup.setAutoClose(true);
        	}
        },

		_toggleClose: function(){
			 sap.ui.getCore().byId(this.getId() + "-bkChatList").removeAllItems();
			 this.getAggregation("_popover").close();
		},

		botStartTyping: function() {
			sap.ui.getCore().byId(this.getId() + "-bkChatStatusBar").setText("Bot is typing...");
		},

		botFinishTyping: function() {
			sap.ui.getCore().byId(this.getId() + "-bkChatStatusBar").setText("");
		},

        addChatItem: function(sText, bUser){        	
        	var oFeedListItem = new FeedListItem({
				showicon: true,
				text: sText
			});

			if(bUser){
				oFeedListItem.setIcon(this.getUserIcon());
				oFeedListItem.addStyleClass("bkUserInput");
				sap.ui.getCore().byId(this.getId() + "-bkChatList").addItem(oFeedListItem, 0);
			} else {
				oFeedListItem.setIcon(this.getRobotIcon());
				oFeedListItem.addStyleClass("bkRobotInput");
				sap.ui.getCore().byId(this.getId() + "-bkChatList").addItem(oFeedListItem, 0);
				
			}
			var oScroll = sap.ui.getCore().byId(this.getId() + "-bkChatScroll");
			setTimeout(function(){ 
				oScroll.scrollTo(0, 1000, 0);
			}, 0);	
        }
	});
	  
	return ChatDialog;
});