jQuery.sap.require("sap.m.MessageBox");

sap.ui.controller("ZODK_AP_PAG.view.DetailFornecedor", {
	Codigo: "",
	Nome: "",
	Laufd: "",
	LaufdStr: "",
	Laufi: "",
	Lifnr: "",
	NomeLifnr: "",
	Total: "",
	Moeda: "",
	Status: "",
	Nivel: "",
	NFaturas: "",
	NivelInicial: false,
	ApProposta: false,
	ApFornecedor: false,
	ApFatura: false,
	CommentView: undefined,
	CommentData: undefined,
	CommentRejView: undefined,
	CommentRejData: undefined,
	EnviarTudo: false,
	CommentAntView: undefined,
	OutraPropostaView: undefined,
	FiltroFatura: "",
	FiltroAno: "",
	Rfc: "",
	ComentariosAntigosForn: "",
	onInit: function() {
		det_forn = this;
	},
	firePropostaShow: function(aData) {
		this.Codigo = aData.Codigo;
		this.Nome = aData.Nome;
		this.Laufd = aData.Laufd;
		this.LaufdStr = laufd_to_text(aData.Laufd);
		this.Laufi = aData.Laufi;
		this.Lifnr = aData.Lifnr;
		this.NomeLifnr = aData.NomeLifnr;
		this.Total = aData.Total;
		this.Moeda = aData.Moeda;
		this.Status = aData.Status;
		this.Nivel = aData.Nivel;
		this.NFaturas = aData.Faturas;
		this.NivelInicial = aData.NivelInicial;
		this.ApProposta = aData.ApProposta;
		this.ApFornecedor = aData.ApFornecedor;
		this.ApFatura = aData.ApFatura;
		this.ComentariosAntigosForn = aData.ComentariosAntigos;
		this.Rfc = aData.Rfc;

		load_model_fornecedor(this);
	},
	handleBack: function() {
		oShell.setApp(app_proposta);
		load_model_proposta(det_prop);
	},
	pressAccept: function(e) {

		var table = e.getSource().getParent().getParent().getParent().getParent().getParent().getParent();
		var items = table.getItems();
		var item = e.getSource().getParent().getParent().getParent().getParent().getParent();
		var index = 0;
		for (var i = 0; i < items.length; i++) {
			if (items[i] === item) {
				index = i;
			}
		}
		var data = data_fatura[index];

		set_busy_global(true);

		var sendLine = {
			CodigoEmpresa: det_forn.Codigo,
			Laufd: det_forn.Laufd,
			Laufi: det_forn.Laufi,
			Lifnr: det_forn.Lifnr,
			Fatura: data.Fatura,
			Ano: data.Ano,
			Rfc: data.Rfc,
			Status: "10"
		};
		var oModel_d = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFI_AP_PAG_SRV");
		oModel_d.setHeaders({
			"X-Requested-With": "X"
		});
		oModel_d.create("/DadosPorFaturaSet", sendLine, null, function(data, response) {
			var retorno = data.Retorno;
			if (retorno !== "") {
				sap.m.MessageToast.show(retorno);
			}
			load_model_fornecedor(det_forn);
			set_busy_global(false);
		}, function(err) {
			sap.m.MessageToast.show("Erro ao executar o serviço! Contacte administrador!");
			set_busy_global(false);
			load_model_fornecedor(det_forn);
		});
	},
	pressDecline: function(e) {
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
		var data = data_fatura[index];
		det_forn.EnviarTudo = false;
		det_forn.CommentRejData = data;
		if (det_forn.CommentRejView === undefined)
			det_forn.CommentRejView = sap.ui.xmlfragment("ZODK_AP_PAG.view.ComentariosRejeicao", det_forn);

		var lista = [];
		set_busy_global(true);

		var filters = new Array();
		var filterItem = new sap.ui.model.Filter("Rfc", sap.ui.model.FilterOperator.EQ, det_forn.Rfc);
		filters.push(filterItem);

		var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFI_AP_PAG_SRV");
		oModel.read(
			"/MotivosRejeicaoSet", {
				filters: filters,
				success: function(oData, oResponse) {
					var aData = oData.results;
					for (var j = 0; j < aData.length; j++) {
						var node = aData[j];
						node.Check = (det_forn.CommentRejData.MotivoRejeicao.indexOf(node.Id) != -1);
						node.Edit = det_forn.CommentRejData.Editar;
						lista.push(node);
					}

					var lv_rej = true;
					var lv_title = "Comentários/Motivo de rejeição";

					var oViewModel = new sap.ui.model.json.JSONModel({
						Comentarios: data.Comentarios,
						MotivosRejeicao: lista,
						RejVisible: lv_rej,
						Title: lv_title,
						Rfc: data.Rfc
					});

					det_forn.CommentRejView.setModel(oViewModel, "comment");

					det_forn.CommentRejView.open();

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
		var data = data_fatura[index];

		var sendLine = {
			CodigoEmpresa: det_forn.Codigo,
			Laufd: det_forn.Laufd,
			Laufi: det_forn.Laufi,
			Lifnr: det_forn.Lifnr,
			Fatura: data.Fatura,
			Ano: data.Ano,
			Rfc: data.Rfc,
			Status: "00"
		};
		var oModel_d = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFI_AP_PAG_SRV");
		oModel_d.setHeaders({
			"X-Requested-With": "X"
		});
		oModel_d.create("/DadosPorFaturaSet", sendLine, null, function(data, response) {
			var retorno = data.Retorno;
			if (retorno !== "") {
				sap.m.MessageToast.show(retorno);
			}
			load_model_fornecedor(det_forn);
			set_busy_global(false);
		}, function(err) {
			sap.m.MessageToast.show("Erro ao executar o serviço! Contacte administrador!");
			set_busy_global(false);
			load_model_fornecedor(det_forn);
		});
	},
	pressAcceptAll: function() {
		action_all_fatura("10", "", "");
	},

	pressDeclineAll: function() {
		if (det_forn.CommentRejView === undefined)
			det_forn.CommentRejView = sap.ui.xmlfragment("ZODK_AP_PAG.view.ComentariosRejeicao", det_forn);

		var lista = [];
		set_busy_global(true);

		var filters = new Array();
		var filterItem = new sap.ui.model.Filter("Rfc", sap.ui.model.FilterOperator.EQ, det_forn.Rfc);
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

					det_forn.CommentRejView.setModel(oViewModel, "comment");

					det_forn.EnviarTudo = true;
					det_forn.CommentRejView.open();

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

						var valLine = {
							Zbukr: det_forn.Codigo,
							Laufd: det_forn.Laufd,
							Laufi: det_forn.Laufi,
							Rfc: det_forn.Rfc
						};
						var oModel_d = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFI_AP_PAG_SRV");
						oModel_d.setHeaders({
							"X-Requested-With": "X"
						});
						oModel_d.create("/ValidaHorarioSet", valLine, null, function(data_ret, response) {
							if (data_ret.Msgty === "S") {
								set_busy_global(true);
								var retorno = "";
								var sendLine = {
									CodigoEmpresa: det_forn.Codigo,
									Laufd: det_forn.Laufd,
									Laufi: det_forn.Laufi,
									Rfc: det_forn.Rfc,
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
										load_model_fornecedor(det_forn);
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
									load_model_fornecedor(det_forn);
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
												set_busy_global(true);
												var retorno = "";
												var sendLine = {
													CodigoEmpresa: det_forn.Codigo,
													Laufd: det_forn.Laufd,
													Laufi: det_forn.Laufi,
													Rfc: det_forn.Rfc,
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
														load_model_fornecedor(det_forn);
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
													load_model_fornecedor(det_forn);
												});
											}
										}
									});
							}

							if (data_ret.Msgty === "E") {
								sap.m.MessageToast.show(data_ret.Msgtx);
								set_busy_global(false);
								load_model_fornecedor(det_forn);
							}

						}, function(err) {
							sap.m.MessageToast.show("Erro ao executar o serviço! Contacte administrador!");
							set_busy_global(false);
							load_model_fornecedor(det_forn);
						});
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
		var data = data_fatura[index];
		det_forn.CommentData = data;

		if (det_forn.CommentView === undefined)
			det_forn.CommentView = sap.ui.xmlfragment("ZODK_AP_PAG.view.Comentarios", det_forn);

		var lista = [];
		set_busy_global(true);

		var filters = new Array();
		var filterItem = new sap.ui.model.Filter("Rfc", sap.ui.model.FilterOperator.EQ, det_forn.Rfc);
		filters.push(filterItem);

		var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFI_AP_PAG_SRV");
		oModel.read(
			"/MotivosRejeicaoSet", {
				filters: filters,
				success: function(oData, oResponse) {
					var aData = oData.results;
					for (var j = 0; j < aData.length; j++) {
						var node = aData[j];
						node.Check = (det_forn.CommentData.MotivoRejeicao.indexOf(node.Id) != -1);
						node.Edit = det_forn.CommentData.Editar;
						lista.push(node);
					}

					var lv_rej = false;
					var lv_title = "Comentários";

					if (det_forn.CommentData.StatusVal === "90") {
						lv_rej = true;
						lv_title = "Comentários/Motivo de rejeição";
					}

					var oViewModel = new sap.ui.model.json.JSONModel({
						Comentarios: det_forn.CommentData.Comentarios,
						MotivosRejeicao: lista,
						RejVisible: lv_rej,
						Title: lv_title
					});

					det_forn.CommentView.setModel(oViewModel, "comment");

					det_forn.CommentView.open();

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
		det_forn.CommentView.close();
		var model = det_forn.CommentView.getModel("comment");
		var data = model.getData();

		var mot_reg = "";
		for (var i = 0; i < data.MotivosRejeicao.length; i++) {
			if (data.MotivosRejeicao[i].Check === true) {
				mot_reg = mot_reg + data.MotivosRejeicao[i].Id + ";";
			}
		}

		if (data.Comentarios !== det_forn.CommentData.Comentarios || mot_reg !== det_forn.CommentData.MotivoRejeicao) {
			var sendLine = {
				CodigoEmpresa: det_forn.Codigo,
				Laufd: det_forn.Laufd,
				Laufi: det_forn.Laufi,
				Lifnr: det_forn.Lifnr,
				Fatura: det_forn.CommentData.Fatura,
				Ano: det_forn.CommentData.Ano,
				Rfc: det_forn.CommentData.Rfc,
				Comentarios: data.Comentarios,
				MotivoRejeicao: mot_reg
			};
			var oModel_d = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFI_AP_PAG_SRV");
			oModel_d.setHeaders({
				"X-Requested-With": "X"
			});
			oModel_d.create("/DadosPorFaturaSet", sendLine, null, function(data, response) {
				var retorno = data.Retorno;
				if (retorno !== "") {
					sap.m.MessageToast.show(retorno);
				}
				set_busy_global(false);
				load_model_fornecedor(det_forn);
			}, function(err) {
				sap.m.MessageToast.show("Erro ao executar o serviço! Contacte administrador!");
				set_busy_global(false);
				load_model_fornecedor(det_forn);
			});
		}
	},

	onCommentRejSend: function() {
		det_forn.CommentRejView.close();
		var model = det_forn.CommentRejView.getModel("comment");
		var comment = model.getData();

		var mot_reg = "";
		for (var i = 0; i < comment.MotivosRejeicao.length; i++) {
			if (comment.MotivosRejeicao[i].Check === true) {
				mot_reg = mot_reg + comment.MotivosRejeicao[i].Id + ";";
			}
		}

		if (comment.Comentarios === "" || mot_reg === "") {
			sap.m.MessageToast.show("Não pode rejeitar sem adicionar comentários e motivos de rejeição!");
			load_model_fornecedor(det_forn);
		} else {
			if (det_forn.EnviarTudo) {
				action_all_fatura("90", comment.Comentarios, mot_reg);
			} else {
				det_forn.CommentRejData.Comentarios = comment.Comentarios;
				det_forn.CommentRejData.MotivoRejeicao = mot_reg;
				rejeitar_fatura(det_forn.CommentRejData);
				det_forn.EnviarTudo = false;
			}
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
		var data = data_fatura[index];
		if (data.ComentariosAntigos !== "") {
			det_forn.CommentAntView = sap.ui.xmlfragment("ZODK_AP_PAG.view.ComentariosAnteriores", det_forn);
			var oViewModel = new sap.ui.model.json.JSONModel({
				Comentarios: data.ComentariosAntigos
			});

			det_forn.CommentAntView.setModel(oViewModel, "comment");

			det_forn.CommentAntView.open();
		} else {
			sap.m.MessageToast.show("Não existem comentários a apresentar!");
		}
	},
	onCommentClose: function() {
		det_forn.CommentAntView.close();
	},
	handleFilter: function() {
		this.FiltroFatura = this.getView().byId("filtro_fatura").getValue();
		this.FiltroAno = this.getView().byId("filtro_ano").getValue();
		load_model_fornecedor(det_forn);
	},
	handleClearFilter: function() {
		this.getView().byId("filtro_fatura").setValue("");
		this.getView().byId("filtro_ano").setValue("");
		this.FiltroFatura = "";
		this.FiltroAno = "";
		load_model_fornecedor(det_forn);
	},
	handleOutrasPropostas: function(e) {
		var table = e.getSource().getParent().getParent();
		var items = table.getItems();
		var item = e.getSource().getParent();
		var index = 0;
		for (var i = 0; i < items.length; i++) {
			if (items[i] === item) {
				index = i;
			}
		}
		var data = data_fatura[index];
		det_forn.OutraPropostaView = sap.ui.xmlfragment("ZODK_AP_PAG.view.OutrasPropostas", det_forn);
		get_dados_outras_propostas(data, det_forn.OutraPropostaView);
		det_forn.OutraPropostaView.open();
	},
	onOutPropCancel: function() {
		det_forn.OutraPropostaView.close();
	},
	pressSwitchContrato: function(e) {
		var table = e.getSource().getParent().getParent().getParent().getParent().getParent();
		var items = table.getItems();
		var item = e.getSource().getParent().getParent().getParent().getParent();
		var index = 0;
		for (var i = 0; i < items.length; i++) {
			if (items[i] === item) {
				index = i;
			}
		}
		var data = data_fatura[index];
		data.Contrato = e.getSource().getState();

		set_busy_global(true);
		var sendLine = {
			Zbukr: det_forn.Codigo,
			Laufd: det_forn.Laufd,
			Laufi: det_forn.Laufi,
			Lifnr: data.Lifnr,
			Belnr: data.Fatura,
			Gjahr: data.Ano,
			Contrato: data.Contrato,
			Outro: data.Outro,
			FactBloqueio: data.FactBloqueio,
			Rfc: data.Rfc
		};
		var oModel_d = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFI_AP_PAG_SRV");
		oModel_d.setHeaders({
			"X-Requested-With": "X"
		});
		oModel_d.create("/InfoAdicionalSet", sendLine, null, function(data, response) {
			set_busy_global(false);
		}, function(err) {
			sap.m.MessageToast.show("Erro ao executar o serviço! Contacte administrador!");
			set_busy_global(false);
		});

	},
	pressSwitchOutro: function(e) {
		var table = e.getSource().getParent().getParent().getParent().getParent().getParent();
		var items = table.getItems();
		var item = e.getSource().getParent().getParent().getParent().getParent();
		var index = 0;
		for (var i = 0; i < items.length; i++) {
			if (items[i] === item) {
				index = i;
			}
		}
		var data = data_fatura[index];
		data.Outro = e.getSource().getState();

		set_busy_global(true);
		var sendLine = {
			Zbukr: det_forn.Codigo,
			Laufd: det_forn.Laufd,
			Laufi: det_forn.Laufi,
			Lifnr: data.Lifnr,
			Belnr: data.Fatura,
			Gjahr: data.Ano,
			Contrato: data.Contrato,
			Outro: data.Outro,
			FactBloqueio: data.FactBloqueio,
			Rfc: data.Rfc
		};
		var oModel_d = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFI_AP_PAG_SRV");
		oModel_d.setHeaders({
			"X-Requested-With": "X"
		});
		oModel_d.create("/InfoAdicionalSet", sendLine, null, function(data, response) {
			set_busy_global(false);
		}, function(err) {
			sap.m.MessageToast.show("Erro ao executar o serviço! Contacte administrador!");
			set_busy_global(false);
		});
	},
	pressSwitchFactBloqueio: function(e) {
		var table = e.getSource().getParent().getParent().getParent().getParent().getParent();
		var items = table.getItems();
		var item = e.getSource().getParent().getParent().getParent().getParent();
		var index = 0;
		for (var i = 0; i < items.length; i++) {
			if (items[i] === item) {
				index = i;
			}
		}
		var data = data_fatura[index];
		data.FactBloqueio = e.getSource().getState();

		set_busy_global(true);
		var sendLine = {
			Zbukr: det_forn.Codigo,
			Laufd: det_forn.Laufd,
			Laufi: det_forn.Laufi,
			Lifnr: data.Lifnr,
			Belnr: data.Fatura,
			Gjahr: data.Ano,
			Contrato: data.Contrato,
			Outro: data.Outro,
			FactBloqueio: data.FactBloqueio,
			Rfc: data.Rfc
		};
		var oModel_d = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFI_AP_PAG_SRV");
		oModel_d.setHeaders({
			"X-Requested-With": "X"
		});
		oModel_d.create("/InfoAdicionalSet", sendLine, null, function(data, response) {
			set_busy_global(false);
		}, function(err) {
			sap.m.MessageToast.show("Erro ao executar o serviço! Contacte administrador!");
			set_busy_global(false);
		});
	},
	onChange: function(event) {
		set_busy_global(true);
		var sendLine = {
			CodigoEmpresa: det_forn.Codigo,
			Laufd: det_forn.Laufd,
			Laufi: det_forn.Laufi,
			Lifnr: det_forn.Lifnr,
			Rfc: det_forn.Rfc,
			Comentarios: event.getSource().getValue()
		};
		var oModel_d = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFI_AP_PAG_SRV");
		oModel_d.setHeaders({
			"X-Requested-With": "X"
		});
		oModel_d.create("/DadosPorFornecedorSet", sendLine, null, function(data, response) {
			var retorno = data.Retorno;
			if (retorno !== "") {
				sap.m.MessageToast.show(retorno);
			}
			set_busy_global(false);
		}, function(err) {
			sap.m.MessageToast.show("Erro ao executar o serviço! Contacte administrador!");
			set_busy_global(false);
		});
	}
});