sap.ui.controller("ZODK_AP_PAG.view.HistoricoCompleto", {
	detalhePropostaView: undefined,
	FiltroEmpresa: "",
	FiltroData: "",
	FiltroCodigo: "",
	onInit: function() {
		controller_historico_completo = this;
	},
	handleBack: function() {
		oShell.setApp(app_menu);
		controller_menu.refresh_totais();
	},
	handleRefresh: function() {
		obter_historico_completo(this);
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
		var data = data_historico_completo_propostas[index];

		controller_historico_completo.detalhePropostaView = sap.ui.xmlfragment("ZODK_AP_PAG.view.DetalhePropostaComp",
			controller_historico_completo);
		controller_historico_completo.detalhePropostaView.open();

		load_detalhe_proposta_completo(data, controller_historico_completo.detalhePropostaView);
	},
	onDetPropCancel: function() {
		controller_historico_completo.detalhePropostaView.close();
	},
	handleClearFilter: function() {
		this.getView().byId("filtro_hist_comp_bukrs").setValue("");
		this.getView().byId("filtro_hist_comp_data").setValue("");
		this.getView().byId("filtro_hist_comp_cod").setValue("");
		this.FiltroEmpresa = "";
		this.FiltroData = "";
		this.FiltroCodigo = "";
		obter_historico_completo(this);
	},
	handleFilter: function() {
		this.FiltroEmpresa = this.getView().byId("filtro_hist_comp_bukrs").getValue();
		this.FiltroData = this.getView().byId("filtro_hist_comp_data").getValue();
		this.FiltroCodigo = this.getView().byId("filtro_hist_comp_cod").getValue();
		obter_historico_completo(this);
	}
});