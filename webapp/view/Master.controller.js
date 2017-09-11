jQuery.sap.require("ZODK_AP_PAG.util.Formatter");
jQuery.sap.require("ZODK_AP_PAG.util.Controller");

ZODK_AP_PAG.util.Controller.extend("ZODK_AP_PAG.view.Master", {

	onInit: function() {
		master_comp = this;
		this.oInitialLoadFinishedDeferred = jQuery.Deferred();

		this.getView().byId("list").attachEventOnce("updateFinished", function() {
			this.oInitialLoadFinishedDeferred.resolve();
			oEventBus.publish("Master", "InitialLoadFinished", {
				oListItem: this.getView().byId("list").getItems()[0]
			});
		}, this);

		var oEventBus = this.getEventBus();
		oEventBus.subscribe("Detail", "TabChanged", this.onDetailTabChanged, this);

		//on phones, we will not have to select anything in the list so we dont need to attach to events
		if (sap.ui.Device.system.phone) {
			return;
		}

		this.getRouter().attachRoutePatternMatched(this.onRouteMatched, this);

		oEventBus.subscribe("Detail", "Changed", this.onDetailChanged, this);
		oEventBus.subscribe("Detail", "NotFound", this.onNotFound, this);
	},

	onRouteMatched: function(oEvent) {
		var sName = oEvent.getParameter("name");

		if (sName !== "main") {
			return;
		}

		//Load the detail view in desktop
		myNavToWithoutHash({
			currentView: this.getView(),
			targetViewName: "ZODK_AP_PAG.view.Detail",
			targetViewType: "XML"
		});

		//Wait for the list to be loaded once
		this.waitForInitialListLoading(function() {
			//On the empty hash select the first item
			this.selectFirstItem();
		});

	},

	onDetailChanged: function(sChanel, sEvent, oData) {
		var sProductPath = oData.sProductPath;
		//Wait for the list to be loaded once
		this.waitForInitialListLoading(function() {
			var oList = this.getView().byId("list");

			var oSelectedItem = oList.getSelectedItem();
			// the correct item is already selected
			if (oSelectedItem && oSelectedItem.getBindingContext().getPath() === sProductPath) {
				return;
			}

			var aItems = oList.getItems();

			for (var i = 0; i < aItems.length; i++) {
				if (aItems[i].getBindingContext().getPath() === sProductPath) {
					oList.setSelectedItem(aItems[i], true);
					break;
				}
			}
		});
	},

	onDetailTabChanged: function(sChanel, sEvent, oData) {
		this.sTab = oData.sTabKey;
	},

	waitForInitialListLoading: function(fnToExecute) {
		jQuery.when(this.oInitialLoadFinishedDeferred).then(jQuery.proxy(fnToExecute, this));
	},
	onNotFound: function() {
		this.getView().byId("list").removeSelections();
	},
	selectFirstItem: function() {
		var oList = this.getView().byId("list");
		var aItems = oList.getItems();
		if (aItems.length) {
			oList.setSelectedItem(aItems[0], true);
			this.showDetail(aItems[0]);
		}
	},
	selectItem: function(item) {
		var oList = this.getView().byId("list");
		oList.setSelectedItem(item, true);
		this.showDetail(item);
	},
	removeSelections: function() {
		var oList = this.getView().byId("list");
		oList.removeSelections();
	},
	onSearch: function(oEvent) {
		var filtro = oEvent.getParameter("query");
		refresh_modelo_filtered(filtro);
	},
	onSelect: function(oEvent) {
		// Get the list item, either from the listItem parameter or from the events
		// source itself (will depend on the device-dependent mode).
		this.showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
	},
	showDetail: function(oItem) {
		// If were on a phone, include nav in history; if not, dont.
		var bReplace = jQuery.device.is.phone ? false : true;

		var i = oItem.getBindingContext().getPath().substr(1).split("/")[1];

		if (i === "" || i < 0) {
			i = 0;
		}
		var aData = model_geral.getProperty("/DadosPorEmpresaSet");
		empresa_escolhida_data = aData[i];
		det_comp.fireDetailChangedAux(aData[i]);
	},
	handleBack: function() {
		dequeue_all();
		oShell.setApp(app_menu);
		controller_menu.refresh_totais();
	},
	handleRefresh: function() {
		dequeue_all();
		refresh_modelo();
	}
});