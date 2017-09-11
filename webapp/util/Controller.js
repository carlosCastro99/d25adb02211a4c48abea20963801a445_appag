jQuery.sap.declare("ZODK_AP_PAG.util.Controller");

sap.ui.core.mvc.Controller.extend("ZODK_AP_PAG.util.Controller", {
	getEventBus: function() {
		return sap.ui.getCore().getEventBus();
	},
	
	getRouter: function() {
		var r;
		try {
			r = sap.ui.core.UIComponent.getRouterFor(this);
			ret_router = r;
		} catch (err) {
			r = ret_router;
		}
		return r;
	}
});