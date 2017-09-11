jQuery.sap.require("ZODK_AP_PAG.util.Formatter");
jQuery.sap.require("ZODK_AP_PAG.util.Controller");
jQuery.sap.require("sap.m.MessageBox");

ZODK_AP_PAG.util.Controller.extend("ZODK_AP_PAG.view.Detail", {
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
	CommentAntView: undefined,
	CommentData: undefined,
	FiltroData: "",
	FiltroCodigo: "",
	FiltroNivel: "",
	CommentRejView: undefined,
	CommentRejData: undefined,
	EnviarTudo: false,
	Rfc: "",
	onInit: function() {
		det_comp = this;

		this.oInitialLoadFinishedDeferred = jQuery.Deferred();

		if (sap.ui.Device.system.phone) {
			this.oInitialLoadFinishedDeferred.resolve();
		} else {
			this.getView().setBusy(true);
			this.getEventBus().subscribe("Master", "InitialLoadFinished", this.onMasterLoaded, this);
		}
		//this.getRouter().attachRouteMatched(this.onRouteMatched, this);
	},

	onMasterLoaded: function(sChannel, sEvent, oData) {
		if (oData.oListItem) {
			this.bindView(oData.oListItem.getBindingContext().getPath());
			this.getView().setBusy(false);
			this.oInitialLoadFinishedDeferred.resolve();
		}
	},

	onRouteMatched: function(oEvent) {
		var oParameters = oEvent.getParameters();

		jQuery.when(this.oInitialLoadFinishedDeferred).then(jQuery.proxy(function() {
			var oView = this.getView();
			// when detail navigation occurs, update the binding context
			if (oParameters.name !== "detail") {
				return;
			}
			var sEntityPath = "/" + oParameters.arguments.entity;
			this.bindView(sEntityPath);

			// Which tab?
			var sTabKey = oParameters.arguments.tab;
			this.getEventBus().publish("Detail", "TabChanged", {
				sTabKey: sTabKey
			});
		}, this));
	},

	bindView: function(sEntityPath) {
		var oView = this.getView();
		oView.bindElement(sEntityPath);

		//Check if the data is already on the client
		if (oView.getModel() != undefined && !oView.getModel().getData(sEntityPath)) {

			// Check that the entity specified actually was found.
			oView.getElementBinding().attachEventOnce("dataReceived", jQuery.proxy(function() {
				var oData = oView.getModel().getData(sEntityPath);
				if (!oData) {
					this.showEmptyView();
					this.fireDetailNotFound();
				} else {
					this.fireDetailChanged(sEntityPath);
				}
			}, this));

		} else {
			this.fireDetailChanged(sEntityPath);
		}
	},

	showEmptyView: function() {
		this.getRouter().myNavToWithoutHash({
			currentView: this.getView(),
			targetViewName: "ZODK_AP_PAG.view.NotFound",
			targetViewType: "XML"
		});
	},

	fireDetailChanged: function(sEntityPath) {
		/*gv_sentity = sEntityPath;*/
		this.getEventBus().publish("Detail", "Changed", {
			sEntityPath: sEntityPath
		});
		/*load_model_details(this);*/
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

		load_model_empresa(this);
		enqueue_empresa(aData.Codigo, aData.Rfc);
	},

	fireDetailNotFound: function() {
		this.getEventBus().publish("Detail", "NotFound");
	},

	onNavBack: function() {
		// This is only relevant when running on phone devices
		this.getRouter().myNavBack("main");
	},

	onDetailSelect: function(oEvent) {
		sap.ui.core.UIComponent.getRouterFor(this).navTo("detail", {
			entity: oEvent.getSource().getBindingContext().getPath().slice(1),
			tab: oEvent.getParameter("selectedKey")
		}, true);
	},

	handlePressItem: function() {},
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
		var data = data_proposta[index];

		var sendLine = {
			CodigoEmpresa: det_comp.Codigo,
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
			load_model_empresa(det_comp);
			set_busy_global(false);
		}, function(err) {
			sap.m.MessageToast.show("Erro ao executar o serviço! Contacte administrador!");
			set_busy_global(false);
			load_model_empresa(det_comp);
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
		det_comp.CommentRejData = data;
		if (det_comp.CommentRejView === undefined)
			det_comp.CommentRejView = sap.ui.xmlfragment("ZODK_AP_PAG.view.ComentariosRejeicao", det_comp);

		var lista = [];
		det_comp.EnviarTudo = false;

		var filters = new Array();
		var filterItem = new sap.ui.model.Filter("Rfc", sap.ui.model.FilterOperator.EQ, det_comp.Rfc);
		filters.push(filterItem);

		var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFI_AP_PAG_SRV");
		oModel.read(
			"/MotivosRejeicaoSet", {
				filters: filters,
				success: function(oData, oResponse) {
					var aData = oData.results;
					for (var j = 0; j < aData.length; j++) {
						var node = aData[j];
						node.Check = (det_comp.CommentRejData.MotivoRejeicao.indexOf(node.Id) != -1);
						node.Edit = det_comp.CommentRejData.Editar;
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

					det_comp.CommentRejView.setModel(oViewModel, "comment");

					det_comp.CommentRejView.open();

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
			CodigoEmpresa: det_comp.Codigo,
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
			load_model_empresa(det_comp);
			set_busy_global(false);
		}, function(err) {
			sap.m.MessageToast.show("Erro ao executar o serviço! Contacte administrador!");
			set_busy_global(false);
			load_model_empresa(det_comp);
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
		var lv_nome = det_comp.Nome;

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
			ApProposta: det_comp.ApProposta,
			ApFornecedor: det_comp.ApFornecedor,
			ApFatura: det_comp.ApFatura,
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
		action_all_proposta("10", "", "");
	},

	pressDeclineAll: function() {
		if (det_comp.CommentRejView === undefined)
			det_comp.CommentRejView = sap.ui.xmlfragment("ZODK_AP_PAG.view.ComentariosRejeicao", det_comp);

		var lista = [];
		set_busy_global(true);

		var filters = new Array();
		var filterItem = new sap.ui.model.Filter("Rfc", sap.ui.model.FilterOperator.EQ, det_comp.Rfc);
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

					det_comp.CommentRejView.setModel(oViewModel, "comment");

					det_comp.EnviarTudo = true;
					det_comp.CommentRejView.open();

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
						var oTable = det_comp.getView().byId("propostasTable");
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
									Zbukr: det_comp.Codigo,
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
										set_busy_global(true);
										var sendLine = {
											CodigoEmpresa: det_comp.Codigo,
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
												load_model_empresa(det_comp);
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
											load_model_empresa(det_comp);
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
														var sendLine = {
															CodigoEmpresa: det_comp.Codigo,
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
																load_model_empresa(det_comp);
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
															load_model_empresa(det_comp);
														});
													}
												}
											});
									}

									if (data_ret.Msgty === "E") {
										sap.m.MessageToast.show(data_ret.Msgtx);
										set_busy_global(false);
										load_model_empresa(det_comp);
									}

								}, function(err) {
									sap.m.MessageToast.show("Erro ao executar o serviço! Contacte administrador!");
									set_busy_global(false);
									load_model_empresa(det_comp);
								});

							} else {
								set_busy_global(false);
								load_model_empresa(det_comp);
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
		det_comp.CommentData = data;

		if (det_comp.CommentView === undefined)
			det_comp.CommentView = sap.ui.xmlfragment("ZODK_AP_PAG.view.Comentarios", det_comp);

		var lista = [];
		set_busy_global(true);

		var filters = new Array();
		var filterItem = new sap.ui.model.Filter("Rfc", sap.ui.model.FilterOperator.EQ, det_comp.Rfc);
		filters.push(filterItem);

		var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFI_AP_PAG_SRV");
		oModel.read(
			"/MotivosRejeicaoSet", {
				filters: filters,
				success: function(oData, oResponse) {
					var aData = oData.results;
					for (var j = 0; j < aData.length; j++) {
						var node = aData[j];
						node.Check = (det_comp.CommentData.MotivoRejeicao.indexOf(node.Id) != -1);
						node.Edit = det_comp.CommentData.Editar;
						lista.push(node);
					}

					var lv_rej = false;
					var lv_title = "Comentários";

					if (det_comp.CommentData.StatusVal === "90") {
						lv_rej = true;
						lv_title = "Comentários/Motivo de rejeição";
					}

					var oViewModel = new sap.ui.model.json.JSONModel({
						Comentarios: det_comp.CommentData.Comentarios,
						MotivosRejeicao: lista,
						RejVisible: lv_rej,
						Title: lv_title
					});

					det_comp.CommentView.setModel(oViewModel, "comment");

					det_comp.CommentView.open();

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
		det_comp.CommentView.close();
		var model = det_comp.CommentView.getModel("comment");
		var data = model.getData();

		var mot_reg = "";
		for (var i = 0; i < data.MotivosRejeicao.length; i++) {
			if (data.MotivosRejeicao[i].Check === true) {
				mot_reg = mot_reg + data.MotivosRejeicao[i].Id + ";";
			}
		}

		if (data.Comentarios !== det_comp.CommentData.Comentarios || mot_reg !== det_comp.CommentData.MotivoRejeicao) {
			var sendLine = {
				CodigoEmpresa: det_comp.CommentData.CodigoEmpresa,
				Laufd: det_comp.CommentData.Laufd,
				Laufi: det_comp.CommentData.Laufi,
				Comentarios: data.Comentarios,
				Rfc: det_comp.CommentData.Rfc,
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
				load_model_empresa(det_comp);
			}, function(err) {
				sap.m.MessageToast.show("Erro ao executar o serviço! Contacte administrador!");
				set_busy_global(false);
				load_model_empresa(det_comp);
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
			det_comp.CommentAntView = sap.ui.xmlfragment("ZODK_AP_PAG.view.ComentariosAnteriores", det_comp);
			var oViewModel = new sap.ui.model.json.JSONModel({
				Comentarios: data.ComentariosAntigos
			});
			det_comp.CommentAntView.setModel(oViewModel, "comment");
			det_comp.CommentAntView.open();
		} else {
			sap.m.MessageToast.show("Não existem comentários a apresentar!");
		}
	},
	onCommentClose: function() {
		det_comp.CommentAntView.close();
	},
	handleFilter: function() {
		this.FiltroData = this.getView().byId("filtro_prop_data").getValue();
		this.FiltroCodigo = this.getView().byId("filtro_prop_cod").getValue();
		this.FiltroNivel = this.getView().byId("filtro_prop_nivel").getValue();
		load_model_empresa(det_comp);
	},
	handleClearFilter: function() {
		this.getView().byId("filtro_prop_data").setValue("");
		this.getView().byId("filtro_prop_cod").setValue("");
		this.getView().byId("filtro_prop_nivel").setValue("");
		this.FiltroData = "";
		this.FiltroCodigo = "";
		this.FiltroNivel = "";
		load_model_empresa(det_comp);
	},
	onCommentRejSend: function() {
		det_comp.CommentRejView.close();
		var model = det_comp.CommentRejView.getModel("comment");
		var comment = model.getData();

		var mot_reg = "";
		for (var i = 0; i < comment.MotivosRejeicao.length; i++) {
			if (comment.MotivosRejeicao[i].Check === true) {
				mot_reg = mot_reg + comment.MotivosRejeicao[i].Id + ";";
			}
		}

		if (comment.Comentarios === "" || mot_reg === "") {
			sap.m.MessageToast.show("Não pode rejeitar sem adicionar comentários e motivos de rejeição!");
			load_model_empresa(det_comp);
		} else {
			if (det_comp.EnviarTudo) {
				action_all_proposta("90", comment.Comentarios, mot_reg);
			} else {
				det_comp.CommentRejData.Comentarios = comment.Comentarios;
				det_comp.CommentRejData.MotivoRejeicao = mot_reg;
				rejeitar_proposta(det_comp.CommentRejData);
				det_comp.EnviarTudo = false;
			}
		}
	}
});