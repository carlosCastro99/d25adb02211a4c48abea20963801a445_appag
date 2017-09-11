jQuery.sap.require("ZODK_AP_PAG.util.Formatter");
jQuery.sap.require("ZODK_AP_PAG.util.Controller");
jQuery.sap.require("sap.m.MessageBox");

ZODK_AP_PAG.util.Controller.extend("ZODK_AP_PAG.view.DetailMobile", {
	Codigo: "",
	CodigoEmpresaPagadora: "",
	Nome: "",
	Local: "",
	NPropostas: "",
	Total: "",
	Moeda: "",
	Msg_visible: false,
	Error_msg: "",
	ApProposta: false,
	ApFornecedor: false,
	ApFatura: false,
	CommentView: undefined,
	CommentData: undefined,
	CommentAntView: undefined,
	FiltroData: "",
	FiltroCodigo: "",
	FiltroNivel: "",
	CommentRejView: undefined,
	CommentRejData: undefined,
	EnviarTudo: false,
	Rfc: "",
	onInit: function() {
		det_comp_mobile = this;
	},

	fireDetailChangedAux: function(aData) {
		this.Codigo = aData.Codigo;
		this.Nome = aData.Nome;
		this.Local = aData.Local;
		this.NPropostas = aData.NPropostas;
		this.Total = aData.ValorTotal;
		this.Moeda = aData.Moeda;
		this.CodigoEmpresaPagadora = aData.CodigoEmpresaPagadora;
		this.Rfc = aData.Rfc;

		if (aData.LockFlag === true) {
			this.Msg_visible = true;
			this.Error_msg = "Propostas bloqueadas pelo utilizador: " + aData.LockUname;
		} else {
			this.Msg_visible = false;
			this.Error_msg = "";
		}

		this.ApProposta = aData.ApProposta;
		this.ApFornecedor = aData.ApFornecedor;
		this.ApFatura = aData.ApFatura;

		if (aData.LockFlag === true && this.ApProposta === true) {
			this.ApProposta = false;
		}

		load_model_empresa_mobile(this);
		enqueue_empresa(aData.Codigo);
	},
	handleBack: function() {
		oShell.setApp(app_master_mobile);
		refresh_modelo_mobile();
	},
	pressAccept: function(e) {

		set_busy_global(true);
		var table = e.getSource().getParent().getParent().getParent().getParent().getParent().getParent();
		var items = table.getItems();
		var item = e.getSource().getParent().getParent().getParent().getParent().getParent();
		var index = 0;
		for (var i = 0; i < items.length; i++) {
			if (items[i] === item) {
				index = i;
			}
		}
		var data = data_proposta[index];

		var sendLine = {
			CodigoEmpresa: det_comp_mobile.Codigo,
			Laufd: data.Laufd,
			Laufi: data.Laufi,
			Rfc: data.Rfc,
			Status: "10"
		};
		var oModel_d = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFI_AP_PAG_SRV");
		oModel_d.setHeaders({
			"X-Requested-With": "X"
		});
		oModel_d.create("/DadosPorPropostaSet", sendLine, null, function(data, response) {
			var retorno = data.Retorno;
			if (retorno !== "") {
				sap.m.MessageToast.show(retorno);
			}
			load_model_empresa_mobile(det_comp_mobile);
			set_busy_global(false);
		}, function(err) {
			sap.m.MessageToast.show("Erro ao executar o serviço! Contacte administrador!");
			set_busy_global(false);
			load_model_empresa_mobile(det_comp_mobile);
		});

	},
	pressDecline: function(e) {
		var table = e.getSource().getParent().getParent().getParent().getParent().getParent().getParent();
		var items = table.getItems();
		var item = e.getSource().getParent().getParent().getParent().getParent().getParent();
		var index = 0;
		for (var i = 0; i < items.length; i++) {
			if (items[i] === item) {
				index = i;
			}
		}
		var data = data_proposta[index];

		set_busy_global(false);
		det_comp_mobile.CommentRejData = data;
		if (det_comp_mobile.CommentRejView === undefined)
			det_comp_mobile.CommentRejView = sap.ui.xmlfragment("ZODK_AP_PAG.view.ComentariosRejeicao", det_comp_mobile);

		var lista = [];
		det_comp_mobile.EnviarTudo = false;

		var filters = new Array();
		var filterItem = new sap.ui.model.Filter("Rfc", sap.ui.model.FilterOperator.EQ, det_comp_mobile.Rfc);
		filters.push(filterItem);

		var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFI_AP_PAG_SRV");
		oModel.read(
			"/MotivosRejeicaoSet", {
				filters: filters,
				success: function(oData, oResponse) {
					var aData = oData.results;
					for (var j = 0; j < aData.length; j++) {
						var node = aData[j];
						node.Check = (det_comp_mobile.CommentRejData.MotivoRejeicao.indexOf(node.Id) != -1);
						node.Edit = det_comp_mobile.CommentRejData.Editar;
						lista.push(node);
					}

					var lv_rej = true;
					var lv_title = "Comentários/Motivo de rejeição";

					var oViewModel = new sap.ui.model.json.JSONModel({
						Comentarios: data.Comentarios,
						MotivosRejeicao: lista,
						RejVisible: lv_rej,
						Title: lv_title
					});

					det_comp_mobile.CommentRejView.setModel(oViewModel, "comment");

					det_comp_mobile.CommentRejView.open();

					set_busy_global(false);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					console.log(textStatus, errorThrown);
					set_busy_global(false);
				}
			}
		);

	},
	pressClear: function(e) {
		set_busy_global(true);
		var table = e.getSource().getParent().getParent().getParent().getParent().getParent().getParent();
		var items = table.getItems();
		var item = e.getSource().getParent().getParent().getParent().getParent().getParent();
		var index = 0;
		for (var i = 0; i < items.length; i++) {
			if (items[i] === item) {
				index = i;
			}
		}
		var data = data_proposta[index];

		var sendLine = {
			CodigoEmpresa: det_comp_mobile.Codigo,
			Laufd: data.Laufd,
			Laufi: data.Laufi,
			Rfc: data.Rfc,
			Status: "00"
		};
		var oModel_d = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFI_AP_PAG_SRV");
		oModel_d.setHeaders({
			"X-Requested-With": "X"
		});
		oModel_d.create("/DadosPorPropostaSet", sendLine, null, function(data, response) {
			var retorno = data.Retorno;
			if (retorno !== "") {
				sap.m.MessageToast.show(retorno);
			} else {
				//sap.m.MessageToast.show("Guardado! Para finalizar o processo, submeter os dados!");
			}
			load_model_empresa_mobile(det_comp_mobile);
			set_busy_global(false);
		}, function(err) {
			sap.m.MessageToast.show("Erro ao executar o serviço! Contacte administrador!");
			set_busy_global(false);
			load_model_empresa_mobile(det_comp_mobile);
		});
	},
	pressDisplay: function(e) {

		var table = e.getSource().getParent().getParent();
		var items = table.getItems();
		var item = e.getSource().getParent();
		var index = 0;
		for (var i = 0; i < items.length; i++) {
			if (items[i] === item) {
				index = i;
			}
		}
		var data = data_proposta[index];

		var lv_nome = det_comp_mobile.Nome;

		var aData = {
			Codigo: data.CodigoEmpresa,
			Nome: lv_nome,
			Laufd: data.Laufd,
			Laufi: data.Laufi,
			Total: data.ValorTotal,
			Aprovado: data.ValorAprovado,
			Moeda: data.Moeda,
			NFornecedores: data.NFornecedores,
			NFaturas: data.NFaturas,
			Status: data.Status,
			Nivel: data.Nivel,
			FormaPagamento: data.FormaPagamento,
			ApProposta: det_comp_mobile.ApProposta,
			ApFornecedor: det_comp_mobile.ApFornecedor,
			ApFatura: det_comp_mobile.ApFatura,
			EnvioAprov: data.EnvioAprov,
			Hbkid: data.Hbkid,
			Ubknt: data.Ubknt,
			ComentariosAntigos: data.ComentariosAntigos,
			Contrato: data.Contrato,
			Outro: data.Outro,
			FactBloqueio: data.FactBloqueio,
			Rfc: data.Rfc,
			Editar: !data.LockFlag
		};

		det_prop.firePropostaShow(aData);
		oShell.setApp(app_proposta);
	},

	pressAcceptAll: function() {
		action_all_proposta_mobile("10", "", "");
	},

	pressDeclineAll: function() {
		if (det_comp_mobile.CommentRejView === undefined)
			det_comp_mobile.CommentRejView = sap.ui.xmlfragment("ZODK_AP_PAG.view.ComentariosRejeicao", det_comp_mobile);

		var lista = [];
		set_busy_global(true);

		var filters = new Array();
		var filterItem = new sap.ui.model.Filter("Rfc", sap.ui.model.FilterOperator.EQ, det_comp_mobile.Rfc);
		filters.push(filterItem);

		var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFI_AP_PAG_SRV");
		oModel.read(
			"/MotivosRejeicaoSet", {
				filters: filters,
				success: function(oData, oResponse) {
					var aData = oData.results;
					for (var j = 0; j < aData.length; j++) {
						var node = aData[j];
						node.Check = false;
						node.Edit = true;
						lista.push(node);
					}

					var lv_rej = true;
					var lv_title = "Comentários/Motivo de rejeição";

					var oViewModel = new sap.ui.model.json.JSONModel({
						Comentarios: "",
						MotivosRejeicao: lista,
						RejVisible: lv_rej,
						Title: lv_title
					});

					det_comp_mobile.CommentRejView.setModel(oViewModel, "comment");

					det_comp_mobile.EnviarTudo = true;
					det_comp_mobile.CommentRejView.open();

					set_busy_global(false);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					console.log(textStatus, errorThrown);
					set_busy_global(false);
				}
			}
		);
	},

	pressSubmitAll: function() {
		sap.m.MessageBox.show(
			"Tem a certeza que pretende submeter a proposta?", {
				icon: sap.m.MessageBox.Icon.INFORMATION,
				title: "Confirmar",
				actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
				onClose: function(oAction) {
					if (sap.m.MessageBox.Action.YES === oAction) {
						set_busy_global(true);
						var oTable = det_comp_mobile.getView().byId("propostasTableMobile");
						var aItems = oTable.getItems();
						var retorno = "";
						for (var i = 0; i < aItems.length; i++) {
							set_busy_global(true);

							var data = data_proposta[i];
							var lv_laufd = data.Laufd;
							var lv_laufi = data.Laufi;
							var lv_lock_flag = data.LockFlag;
							var lv_aprovar = data.Aprovar;

							if (!lv_lock_flag && lv_aprovar) {

								var valLine = {
									Zbukr: det_comp_mobile.Codigo,
									Laufd: lv_laufd,
									Laufi: lv_laufi,
									Rfc: data.Rfc
								};
								var oModel_d = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFI_AP_PAG_SRV");
								oModel_d.setHeaders({
									"X-Requested-With": "X"
								});
								oModel_d.create("/ValidaHorarioSet", valLine, null, function(data_ret, response) {
									if (data_ret.Msgty === "S") {
										var sendLine = {
											CodigoEmpresa: det_comp_mobile.Codigo,
											Laufd: lv_laufd,
											Laufi: lv_laufi,
											Rfc: data.Rfc,
											Final: "X"
										};
										var oModel_d = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFI_AP_PAG_SRV");
										oModel_d.setHeaders({
											"X-Requested-With": "X"
										});
										oModel_d.create("/DadosPorPropostaSet", sendLine, null, function(data, response) {
											retorno = data.Retorno;
											if (retorno !== "") {
												sap.m.MessageToast.show(retorno);
												load_model_empresa_mobile(det_comp_mobile);
												set_busy_global(false);
											} else {
												set_busy_global(false);
												if (jQuery.device.is.phone) {
													oShell.setApp(app_master_mobile);
													refresh_modelo_mobile();
												} else {
													oShell.setApp(app_aprov);
													refresh_modelo();
													load_model_empresa(det_comp);
												}
											}
										}, function(err) {
											sap.m.MessageToast.show("Erro ao executar o serviço! Contacte administrador!");
											set_busy_global(false);
											load_model_empresa_mobile(det_comp_mobile);
										});
									}

									if (data_ret.Msgty === "W") {
										set_busy_global(false);
										sap.m.MessageBox.show(
											data_ret.Msgtx, {
												icon: sap.m.MessageBox.Icon.WARNING,
												title: "Confirmar",
												actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
												onClose: function(oAction) {
													if (sap.m.MessageBox.Action.YES === oAction) {
														var sendLine = {
															CodigoEmpresa: det_comp_mobile.Codigo,
															Laufd: lv_laufd,
															Laufi: lv_laufi,
															Rfc: data.Rfc,
															Final: "X"
														};
														var oModel_d = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFI_AP_PAG_SRV");
														oModel_d.setHeaders({
															"X-Requested-With": "X"
														});
														oModel_d.create("/DadosPorPropostaSet", sendLine, null, function(data, response) {
															retorno = data.Retorno;
															if (retorno !== "") {
																sap.m.MessageToast.show(retorno);
																load_model_empresa_mobile(det_comp_mobile);
																set_busy_global(false);
															} else {
																set_busy_global(false);
																if (jQuery.device.is.phone) {
																	oShell.setApp(app_master_mobile);
																	refresh_modelo_mobile();
																} else {
																	oShell.setApp(app_aprov);
																	refresh_modelo();
																	load_model_empresa(det_comp);
																}
															}
														}, function(err) {
															sap.m.MessageToast.show("Erro ao executar o serviço! Contacte administrador!");
															set_busy_global(false);
															load_model_empresa_mobile(det_comp_mobile);
														});
													}
												}
											});
									}

									if (data_ret.Msgty === "E") {
										sap.m.MessageToast.show(data_ret.Msgtx);
										set_busy_global(false);
										load_model_empresa_mobile(det_comp_mobile);
									}

								}, function(err) {
									sap.m.MessageToast.show("Erro ao executar o serviço! Contacte administrador!");
									set_busy_global(false);
									load_model_empresa_mobile(det_comp_mobile);
								});

							} else {
								set_busy_global(false);
								load_model_empresa_mobile(det_comp_mobile);
							}
						}
					}
				}
			}
		);
	},
	pressComment: function(e) {
		var table = e.getSource().getParent().getParent().getParent().getParent().getParent();
		var items = table.getItems();
		var item = e.getSource().getParent().getParent().getParent().getParent();
		var index = 0;
		for (var i = 0; i < items.length; i++) {
			if (items[i] === item) {
				index = i;
			}
		}
		var data = data_proposta[index];
		det_comp_mobile.CommentData = data;

		if (det_comp_mobile.CommentView === undefined)
			det_comp_mobile.CommentView = sap.ui.xmlfragment("ZODK_AP_PAG.view.Comentarios", det_comp_mobile);

		var lista = [];
		set_busy_global(true);

		var filters = new Array();
		var filterItem = new sap.ui.model.Filter("Rfc", sap.ui.model.FilterOperator.EQ, det_comp_mobile.Rfc);
		filters.push(filterItem);

		var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFI_AP_PAG_SRV");
		oModel.read(
			"/MotivosRejeicaoSet", {
				filters: filters,
				success: function(oData, oResponse) {
					var aData = oData.results;
					for (var j = 0; j < aData.length; j++) {
						var node = aData[j];
						node.Check = (det_comp_mobile.CommentData.MotivoRejeicao.indexOf(node.Id) != -1);
						node.Edit = det_comp_mobile.CommentData.Editar;
						lista.push(node);
					}

					var lv_rej = false;
					var lv_title = "Comentários";

					if (det_comp_mobile.CommentData.StatusVal === "90") {
						lv_rej = true;
						lv_title = "Comentários/Motivo de rejeição";
					}

					var oViewModel = new sap.ui.model.json.JSONModel({
						Comentarios: det_comp_mobile.CommentData.Comentarios,
						MotivosRejeicao: lista,
						RejVisible: lv_rej,
						Title: lv_title
					});

					det_comp_mobile.CommentView.setModel(oViewModel, "comment");

					det_comp_mobile.CommentView.open();

					set_busy_global(false);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					console.log(textStatus, errorThrown);
					set_busy_global(false);
				}
			}
		);
	},
	onCommentSend: function() {
		det_comp_mobile.CommentView.close();
		var model = det_comp_mobile.CommentView.getModel("comment");
		var data = model.getData();

		var mot_reg = "";
		for (var i = 0; i < data.MotivosRejeicao.length; i++) {
			if (data.MotivosRejeicao[i].Check === true) {
				mot_reg = mot_reg + data.MotivosRejeicao[i].Id + ";";
			}
		}

		if (data.Comentarios !== det_comp_mobile.CommentData.Comentarios || mot_reg !== det_comp_mobile.CommentData.MotivoRejeicao) {
			var sendLine = {
				CodigoEmpresa: det_comp_mobile.CommentData.CodigoEmpresa,
				Laufd: det_comp_mobile.CommentData.Laufd,
				Laufi: det_comp_mobile.CommentData.Laufi,
				Comentarios: data.Comentarios,
				Rfc: det_comp_mobile.CommentData.Rfc,
				MotivoRejeicao: mot_reg
			};
			var oModel_d = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFI_AP_PAG_SRV");
			oModel_d.setHeaders({
				"X-Requested-With": "X"
			});
			oModel_d.create("/DadosPorPropostaSet", sendLine, null, function(data, response) {
				var retorno = data.Retorno;
				if (retorno !== "") {
					sap.m.MessageToast.show(retorno);
				}
				set_busy_global(false);
				load_model_empresa_mobile(det_comp_mobile);
			}, function(err) {
				sap.m.MessageToast.show("Erro ao executar o serviço! Contacte administrador!");
				set_busy_global(false);
				load_model_empresa_mobile(det_comp_mobile);
			});
		}
	},
	pressCommentAnt: function(e) {
		var table = e.getSource().getParent().getParent().getParent().getParent().getParent();
		var items = table.getItems();
		var item = e.getSource().getParent().getParent().getParent().getParent();
		var index = 0;
		for (var i = 0; i < items.length; i++) {
			if (items[i] === item) {
				index = i;
			}
		}
		var data = data_proposta[index];
		if (data.ComentariosAntigos !== "") {
			det_comp_mobile.CommentAntView = sap.ui.xmlfragment("ZODK_AP_PAG.view.ComentariosAnteriores", det_comp_mobile);
			var oViewModel = new sap.ui.model.json.JSONModel({
				Comentarios: data.ComentariosAntigos
			});

			det_comp_mobile.CommentAntView.setModel(oViewModel, "comment");

			det_comp_mobile.CommentAntView.open();
		} else {
			sap.m.MessageToast.show("Não existem comentários a apresentar!");
		}
	},
	onCommentClose: function() {
		det_comp_mobile.CommentAntView.close();
	},
	handleFilter: function() {
		this.FiltroData = this.getView().byId("filtro_prop_data").getValue();
		this.FiltroCodigo = this.getView().byId("filtro_prop_cod").getValue();
		this.FiltroNivel = this.getView().byId("filtro_prop_nivel").getValue();
		load_model_empresa_mobile(det_comp_mobile);
	},
	handleClearFilter: function() {
		this.getView().byId("filtro_prop_data").setValue("");
		this.getView().byId("filtro_prop_cod").setValue("");
		this.getView().byId("filtro_prop_nivel").setValue("");
		this.FiltroData = "";
		this.FiltroCodigo = "";
		this.FiltroNivel = "";
		load_model_empresa_mobile(det_comp_mobile);
	},
	onCommentRejSend: function() {
		det_comp_mobile.CommentRejView.close();
		var model = det_comp_mobile.CommentRejView.getModel("comment");
		var comment = model.getData();

		var mot_reg = "";
		for (var i = 0; i < comment.MotivosRejeicao.length; i++) {
			if (comment.MotivosRejeicao[i].Check === true) {
				mot_reg = mot_reg + comment.MotivosRejeicao[i].Id + ";";
			}
		}

		if (comment.Comentarios === "" || mot_reg === "") {
			sap.m.MessageToast.show("Não pode rejeitar sem adicionar comentários e motivos de rejeição!");
			load_model_empresa_mobile(det_comp_mobile);
		} else {
			if (det_comp_mobile.EnviarTudo) {
				action_all_proposta_mobile("90", comment.Comentarios, mot_reg);
			} else {
				det_comp_mobile.CommentRejData.Comentarios = comment.Comentarios;
				det_comp_mobile.CommentRejData.MotivoRejeicao = mot_reg;
				rejeitar_proposta_mobile(det_comp_mobile.CommentRejData);
				det_comp_mobile.EnviarTudo = false;
			}
		}
	}
});