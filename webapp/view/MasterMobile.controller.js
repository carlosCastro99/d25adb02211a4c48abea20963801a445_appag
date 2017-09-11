jQuery.sap.require("ZODK_AP_PAG.util.Formatter");
jQuery.sap.require("ZODK_AP_PAG.util.Controller");

ZODK_AP_PAG.util.Controller.extend("ZODK_AP_PAG.view.MasterMobile", {

	onInit: function() {
		controller_master_mobile = this;
	},
	onSearch: function(oEvent) {
		var filtro = oEvent.getParameter("query");
		refresh_modelo_filtered_mobile(filtro);
	},
	onListItemPress: function(e) {

		var i = e.getSource().getBindingContext().getPath().substr(1).split("/")[1];

		if (i === "" || i < 0) {
			i = 0;
		}

		var aData = this.getView().getModel().getProperty("/DadosPorEmpresaSet");
		empresa_escolhida_data = aData[i];
		det_comp_mobile.fireDetailChangedAux(aData[i]);
		oShell.setApp(detailMobileApp);

	},
	handleBack: function() {
		dequeue_all();
		oShell.setApp(app_menu);
		controller_menu.refresh_totais();
	},
	handleRefresh: function() {
		dequeue_all();
		refresh_modelo_mobile();
	}
});