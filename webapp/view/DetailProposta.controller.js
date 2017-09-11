jQuery.sap.require("sap.m.MessageBox");
sap.ui.controller("ZODK_AP_PAG.view.DetailProposta", {
	Codigo: "",
	Nome: "",
	Laufd: "",
	LaufdStr: "",
	Laufi: "",
	Total: "",
	Aprovado: "",
	Moeda: "",
	Status: "",
	Nivel: "",
	FormaPagamento: "",
	NFornecedores: "",
	NFaturas: "",
	ApProposta: false,
	ApFornecedor: false,
	ApFatura: false,
	hist_prop_view: undefined,
	CommentView: undefined,
	CommentAntView: undefined,
	CommentData: undefined,
	CommentRejView: undefined,
	CommentRejData: undefined,
	EnviarTudo: false,
	FiltroCodigo: "",
	FiltroDescricao: "",
	EnvioAprov: "",
	Hbkid: "",
	Ubknt: "",
	ComentariosAntigosProp: "",
	Contrato: false,
	Outro: false,
	Editar: true,
	FactBloqueio: false,
	Rfc: "",
	onInit: function() {
		det_prop = this;
	},
	firePropostaShow: function(aData) {
		this.Codigo = aData.Codigo;
		this.Nome = aData.Nome;
		this.Laufd = aData.Laufd;
		this.LaufdStr = laufd_to_text(aData.Laufd);
		this.Laufi = aData.Laufi;
		this.Total = aData.Total;
		this.Aprovado = aData.Aprovado;
		this.Moeda = aData.Moeda;
		this.Status = aData.Status;
		this.Nivel = aData.Nivel;
		this.NFornecedores = aData.NFornecedores;
		this.NFaturas = aData.NFaturas;
		this.ApProposta = aData.ApProposta;
		this.ApFornecedor = aData.ApFornecedor;
		this.ApFatura = aData.ApFatura;
		this.FormaPagamento = aData.FormaPagamento;
		this.EnvioAprov = aData.EnvioAprov;
		this.Hbkid = aData.Hbkid;
		this.Ubknt = aData.Ubknt;
		this.ComentariosAntigosProp = aData.ComentariosAntigos;
		/*this.Contrato = aData.Contrato;
		this.Outro = aData.Outro;
		this.FactBloqueio = aData.FactBloqueio;*/
		this.Editar = aData.Editar;
		this.Rfc = aData.Rfc;

		load_model_proposta(this);
		enqueue_proposta(this.Codigo, this.Laufd, this.Laufi, this.Rfc);
	},
	handleBack: function() {
		this.ComentariosAntigosProp = "";
		enqueue_empresa(this.Codigo);
		if (jQuery.device.is.phone) {
			oShell.setApp(detailMobileApp);
			load_model_empresa_mobile(det_comp_mobile);
		} else {
			oShell.setApp(app_aprov);
			load_model_empresa(det_comp);
		}
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
		var data = data_fornecedor[index];
		var lv_nivel_inicial = false;
		for (var i = 0; i < lista_fornecedores_nivel.length; i++) {
			if (data.Lifnr === lista_fornecedores_nivel[i].Fornecedor) {
				lv_nivel_inicial = lista_fornecedores_nivel[i].NivelInicial;
			}
		}
		var aData = {
			Codigo: data.CodigoEmpresa,
			Nome: det_prop.Nome,
			Laufd: det_prop.Laufd,
			Laufi: det_prop.Laufi,
			Lifnr: data.Lifnr,
			NomeLifnr: data.NomeFornecedor,
			Total: data.ValorTotal,
			Moeda: data.Moeda,
			Faturas: data.NFaturas,
			Status: data.Status,
			Nivel: data.Nivel,
			NivelInicial: lv_nivel_inicial,
			ApProposta: det_prop.ApProposta,
			ApFornecedor: det_prop.ApFornecedor,
			ApFatura: det_prop.ApFatura,
			ComentariosAntigos: data.ComentariosAntigos,
			Rfc: data.Rfc
		};
		det_forn.firePropostaShow(aData);
		oShell.setApp(app_fornecedor);
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
		var data = data_fornecedor[index];
		var sendLine = {
			CodigoEmpresa: det_prop.Codigo,
			Laufd: det_prop.Laufd,
			Laufi: det_prop.Laufi,
			Lifnr: data.Lifnr,
			Rfc: data.Rfc,
			Status: "10"
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
			load_model_proposta(det_prop);
			set_busy_global(false);
		}, function(err) {
			sap.m.MessageToast.show("Erro ao executar o serviço! Contacte administrador!");
			set_busy_global(false);
			load_model_proposta(det_prop);
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
		var data = data_fornecedor[index];

		det_prop.CommentRejData = data;
		if (det_prop.CommentRejView === undefined)
			det_prop.CommentRejView = sap.ui.xmlfragment("ZODK_AP_PAG.view.ComentariosRejeicao", det_prop);
		det_prop.EnviarTudo = false;
		var lista = [];
		set_busy_global(true);

		var filters = new Array();
		var filterItem = new sap.ui.model.Filter("Rfc", sap.ui.model.FilterOperator.EQ, det_prop.Rfc);
		filters.push(filterItem);

		var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFI_AP_PAG_SRV");
		oModel.read(
			"/MotivosRejeicaoSet", {
				filters: filters,
				success: function(oData, oResponse) {
					var aData = oData.results;
					for (var j = 0; j < aData.length; j++) {
						var node = aData[j];
						node.Check = (det_prop.CommentRejData.MotivoRejeicao.indexOf(node.Id) != -1);
						node.Edit = det_prop.CommentRejData.Editar;
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

					det_prop.CommentRejView.setModel(oViewModel, "comment");

					det_prop.CommentRejView.open();

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
		var data = data_fornecedor[index];
		var sendLine = {
			CodigoEmpresa: det_prop.Codigo,
			Laufd: det_prop.Laufd,
			Laufi: det_prop.Laufi,
			Lifnr: data.Lifnr,
			Rfc: data.Rfc,
			Status: "00"
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
			load_model_proposta(det_prop);
			set_busy_global(false);
		}, function(err) {
			sap.m.MessageToast.show("Erro ao executar o serviço! Contacte administrador!");
			set_busy_global(false);
			load_model_proposta(det_prop);
		});
	},
	pressAcceptAll: function() {
		action_all_fornecedor("10", "", "");
	},
	pressDeclineAll: function() {
		if (det_prop.CommentRejView === undefined)
			det_prop.CommentRejView = sap.ui.xmlfragment("ZODK_AP_PAG.view.ComentariosRejeicao", det_prop);

		var lista = [];
		set_busy_global(true);

		var filters = new Array();
		var filterItem = new sap.ui.model.Filter("Rfc", sap.ui.model.FilterOperator.EQ, det_prop.Rfc);
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

					det_prop.CommentRejView.setModel(oViewModel, "comment");

					det_prop.EnviarTudo = true;
					det_prop.CommentRejView.open();

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
		sap.m.MessageBox.show("Tem a certeza que pretende submeter a proposta?", {
			icon: sap.m.MessageBox.Icon.INFORMATION,
			title: "Confirmar",
			actions: [
				sap.m.MessageBox.Action.YES,
				sap.m.MessageBox.Action.NO
			],
			onClose: function(oAction) {
				if (sap.m.MessageBox.Action.YES === oAction) {

					var valLine = {
						Zbukr: det_prop.Codigo,
						Laufd: det_prop.Laufd,
						Laufi: det_prop.Laufi,
						Rfc: det_prop.Rfc
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
								CodigoEmpresa: det_prop.Codigo,
								Laufd: det_prop.Laufd,
								Laufi: det_prop.Laufi,
								Rfc: det_prop.Rfc,
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
									load_model_proposta(det_prop);
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
								load_model_proposta(det_prop);
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
												CodigoEmpresa: det_prop.Codigo,
												Laufd: det_prop.Laufd,
												Laufi: det_prop.Laufi,
												Rfc: det_prop.Rfc,
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
													load_model_proposta(det_prop);
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
												load_model_proposta(det_prop);
											});
										}
									}
								});
						}

						if (data_ret.Msgty === "E") {
							sap.m.MessageToast.show(data_ret.Msgtx);
							set_busy_global(false);
							load_model_proposta(det_prop);
						}

					}, function(err) {
						sap.m.MessageToast.show("Erro ao executar o serviço! Contacte administrador!");
						set_busy_global(false);
						load_model_proposta(det_prop);
					});
				}
			}
		});
	},
	handleHistoricoProposta: function() {
		if (this.hist_prop_view === undefined)
			this.hist_prop_view = sap.ui.xmlfragment("ZODK_AP_PAG.view.HistoricoProposta", this);
		this.hist_prop_view.open();
		var oViewModel = new sap.ui.model.json.JSONModel({
			Codigo: this.Codigo,
			Nome: this.Nome,
			Laufd: this.Laufd,
			LaufdStr: this.LaufdStr,
			Laufi: this.Laufi,
			Rfc: this.Rfc
		});
		this.hist_prop_view.setModel(oViewModel, "header");
		load_model_historico_proposta(this.Codigo, this.Laufd, this.Laufi, this.hist_prop_view, this.Rfc);
	},
	onHistPropCancel: function() {
		this.hist_prop_view.close();
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
		var data = data_fornecedor[index];
		det_prop.CommentData = data;
		if (det_prop.CommentView === undefined)
			det_prop.CommentView = sap.ui.xmlfragment("ZODK_AP_PAG.view.Comentarios", det_prop);

		var lista = [];
		set_busy_global(true);

		var filters = new Array();
		var filterItem = new sap.ui.model.Filter("Rfc", sap.ui.model.FilterOperator.EQ, det_prop.Rfc);
		filters.push(filterItem);

		var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFI_AP_PAG_SRV");
		oModel.read(
			"/MotivosRejeicaoSet", {
				filters: filters,
				success: function(oData, oResponse) {
					var aData = oData.results;
					for (var j = 0; j < aData.length; j++) {
						var node = aData[j];
						node.Check = (det_prop.CommentData.MotivoRejeicao.indexOf(node.Id) != -1);
						node.Edit = det_prop.CommentData.Editar;
						lista.push(node);
					}

					var lv_rej = false;
					var lv_title = "Comentários";

					if (det_prop.CommentData.StatusVal === "90") {
						lv_rej = true;
						lv_title = "Comentários/Motivo de rejeição";
					}

					var oViewModel = new sap.ui.model.json.JSONModel({
						Comentarios: det_prop.CommentData.Comentarios,
						MotivosRejeicao: lista,
						RejVisible: lv_rej,
						Title: lv_title
					});

					det_prop.CommentView.setModel(oViewModel, "comment");

					det_prop.CommentView.open();

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
		det_prop.CommentView.close();
		var model = det_prop.CommentView.getModel("comment");
		var data = model.getData();

		var mot_reg = "";
		for (var i = 0; i < data.MotivosRejeicao.length; i++) {
			if (data.MotivosRejeicao[i].Check === true) {
				mot_reg = mot_reg + data.MotivosRejeicao[i].Id + ";";
			}
		}

		if (data.Comentarios !== det_prop.CommentData.Comentarios || mot_reg !== det_prop.CommentData.MotivoRejeicao) {
			var sendLine = {
				CodigoEmpresa: det_prop.Codigo,
				Laufd: det_prop.Laufd,
				Laufi: det_prop.Laufi,
				Lifnr: det_prop.CommentData.Lifnr,
				Rfc: det_prop.CommentData.Rfc,
				Comentarios: data.Comentarios,
				MotivoRejeicao: mot_reg
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
				load_model_proposta(det_prop);
			}, function(err) {
				sap.m.MessageToast.show("Erro ao executar o serviço! Contacte administrador!");
				set_busy_global(false);
				load_model_proposta(det_prop);
			});
		}
	},
	handleRefreshProposta: function() {
		var sendLine = {
			CodigoEmpresa: det_prop.Codigo,
			Laufd: det_prop.Laufd,
			Laufi: det_prop.Laufi,
			Rfc: det_prop.Rfc
		};
		var oModel_d = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFI_AP_PAG_SRV");
		oModel_d.setHeaders({
			"X-Requested-With": "X"
		});
		oModel_d.create("/ReiniciarNivelPropostaSet", sendLine, null, function(data, response) {
			var retorno = data.Retorno;
			if (retorno !== "") {
				sap.m.MessageToast.show(retorno);
			}
			set_busy_global(false);
			load_model_proposta(det_prop);
		}, function(err) {
			sap.m.MessageToast.show("Erro ao executar o serviço! Contacte administrador!");
			set_busy_global(false);
			load_model_proposta(det_prop);
		});
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
		var data = data_fornecedor[index];
		if (data.ComentariosAntigos !== "") {
			det_prop.CommentAntView = sap.ui.xmlfragment("ZODK_AP_PAG.view.ComentariosAnteriores", det_prop);
			var oViewModel = new sap.ui.model.json.JSONModel({
				Comentarios: data.ComentariosAntigos
			});
			det_prop.CommentAntView.setModel(oViewModel, "comment");
			det_prop.CommentAntView.open();
		} else {
			sap.m.MessageToast.show("Não existem comentários a apresentar!");
		}
	},
	onCommentClose: function() {
		det_prop.CommentAntView.close();
	},
	handleFilter: function() {
		this.FiltroCodigo = this.getView().byId("filtro_forn_codigo").getValue();
		this.FiltroDescricao = this.getView().byId("filtro_forn_desc").getValue();
		load_model_proposta(det_prop);
	},
	handleClearFilter: function() {
		this.getView().byId("filtro_forn_codigo").setValue("");
		this.getView().byId("filtro_forn_desc").setValue("");
		this.FiltroCodigo = "";
		this.FiltroDescricao = "";
		load_model_proposta(det_prop);
	},
	onCommentRejSend: function() {
		det_prop.CommentRejView.close();
		var model = det_prop.CommentRejView.getModel("comment");
		var comment = model.getData();

		var mot_reg = "";
		for (var i = 0; i < comment.MotivosRejeicao.length; i++) {
			if (comment.MotivosRejeicao[i].Check === true) {
				mot_reg = mot_reg + comment.MotivosRejeicao[i].Id + ";";
			}
		}

		if (comment.Comentarios === "" || mot_reg === "") {
			sap.m.MessageToast.show("Não pode rejeitar sem adicionar comentários e motivos de rejeição!");
			load_model_proposta(det_prop);
		} else {
			if (det_prop.EnviarTudo) {
				action_all_fornecedor("90", comment.Comentarios, mot_reg);
			} else {
				det_prop.CommentRejData.Comentarios = comment.Comentarios;
				det_prop.CommentRejData.MotivoRejeicao = mot_reg;
				rejeitar_fornecedor(det_prop.CommentRejData);
				det_prop.EnviarTudo = false;
			}
		}
	},
	onChange: function(event) {
		set_busy_global(true);
		var sendLine = {
			CodigoEmpresa: det_prop.Codigo,
			Laufd: det_prop.Laufd,
			Laufi: det_prop.Laufi,
			Rfc: det_prop.Rfc,
			Comentarios: event.getSource().getValue()
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
		}, function(err) {
			sap.m.MessageToast.show("Erro ao executar o serviço! Contacte administrador!");
			set_busy_global(false);
		});
	}
});