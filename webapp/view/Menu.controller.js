sap.ui.controller("ZODK_AP_PAG.view.Menu", {
	onInit: function() {
		controller_menu = this;
		get_totais(this);
	},
	handleAprov: function() {
		if (num_propostas_pendentes == 0) {
			sap.m.MessageToast.show("Não existem propostas pendentes para aprovação!");
		} else {
			if (jQuery.device.is.phone) {
				oShell.setApp(app_master_mobile);
				refresh_modelo_mobile();
			} else {
				oShell.setApp(app_aprov);
				refresh_modelo();
			}
		}
	},
	handleHistorico: function() {
		oShell.setApp(app_hist);
		obter_historico_user(controller_historico_user);
	},
	handleHistoricoComp: function(){
		oShell.setApp(app_hist_comp);
		obter_historico_completo(controller_historico_completo);
	},
	handleLogoff: function() {
		logoff();
	},
	handleBack: function() {
		window.history.go(-1);
	},
	refresh_totais: function() {
		get_totais(this);
	}
});