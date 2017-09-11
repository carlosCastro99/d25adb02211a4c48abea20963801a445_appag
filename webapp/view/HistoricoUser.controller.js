sap.ui.controller("ZODK_AP_PAG.view.HistoricoUser", {
	detalhePropostaView: undefined,
	FiltroEmpresa: "",
	FiltroData: "",
	FiltroCodigo: "",
	onInit: function() {
		controller_historico_user = this;
	},
	handleBack: function() {
		oShell.setApp(app_menu);
		controller_menu.refresh_totais();
	},
	handleRefresh: function() {
		obter_historico_user(this);
	},
	handlePressItem: function(e) {
		var table = e.getSource().getParent();
		var items = table.getItems();
		var item = e.getSource();
		var index = 0;
		for (var i = 0; i < items.length; i++) {
			if (items[i] === item) {
				index = i;
			}
		}
		var data = data_historico_user_propostas[index];

		controller_historico_user.detalhePropostaView = sap.ui.xmlfragment("ZODK_AP_PAG.view.DetalhePropostaUser", controller_historico_user);
		controller_historico_user.detalhePropostaView.open();

		load_detalhe_proposta_user(data, controller_historico_user.detalhePropostaView);
	},
	onDetPropCancel: function() {
		controller_historico_user.detalhePropostaView.close();
	},
	handleClearFilter: function() {
		this.getView().byId("filtro_hist_user_bukrs").setValue("");
		this.getView().byId("filtro_hist_user_data").setValue("");
		this.getView().byId("filtro_hist_user_cod").setValue("");
		this.FiltroEmpresa = "";
		this.FiltroData = "";
		this.FiltroCodigo = "";
		obter_historico_user(this);
	},
	handleFilter: function() {
		this.FiltroEmpresa = this.getView().byId("filtro_hist_user_bukrs").getValue();
		this.FiltroData = this.getView().byId("filtro_hist_user_data").getValue();
		this.FiltroCodigo = this.getView().byId("filtro_hist_user_cod").getValue();
		obter_historico_user(this);
	}
});