function call_authorization_check() {
	var filters = new Array();
	var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFI_AP_PAG_SRV");
	oModel.read(
		"/AuthorizationCheckSet", {
			filters: filters,
			success: function(oData, oResponse) {
				var aData = oData.results;
				aData = tratamento_boolean(aData);
				for (var i = 0; i < aData.length; i++) {
					if (aData[i].Check === "X") {
						oShell.setApp(app_menu);
						controller_menu.refresh_totais();
						dequeue_all();
					} else {
						oShell.setApp(app_erro);
					}
				}
				set_busy_global(false);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus, errorThrown);
				set_busy_global(false);
			}
		}
	);
}

function myNavToWithoutHash(oOptions) {
	var oSplitApp = findSplitApp(oOptions.currentView);
	// Load view, add it to the page aggregation, and navigate to it
	var oView = sap.ui.view({
		viewName: oOptions.targetViewName,
		type: oOptions.targetViewType
	});
	oSplitApp.addPage(oView, oOptions.isMaster);
	oSplitApp.to(oView.getId(), oOptions.transition || "show", oOptions.data);
}

function findSplitApp(oControl) {
	var sAncestorControlName = "idAppControl";
	if (oControl instanceof sap.ui.core.mvc.View && oControl.byId(sAncestorControlName)) {
		return oControl.byId(sAncestorControlName);
	}
	return oControl.getParent() ? findSplitApp(oControl.getParent(), sAncestorControlName) : null;
}

function refresh_modelo() {
	if (component_aprov !== undefined) {
		call_obtain_aprov_odata_refresh(component_aprov);
	}
}

function refresh_modelo_mobile() {
	call_obtain_aprov_odata_refresh_mobile();
}

function refresh_modelo_filtered(filtro) {
	call_obtain_aprov_odata_refresh_filtered(component_aprov, filtro);
}

function refresh_modelo_filtered_mobile(filtro) {
	call_obtain_aprov_odata_refresh_filtered_mobile(filtro);
}

function call_obtain_aprov_odata_refresh(component) {
	set_busy_global(true);
	var filters = new Array();
	var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFI_AP_PAG_SRV");
	oModel.read(
		"/DadosPorEmpresaSet", {
			filters: filters,
			success: function(oData, oResponse) {
				var aData = oData.results;
				var aDataOrig = aData;
				aData = tratamento_boolean(aData);
				if (aDataOrig.length > 0) {
					var oModel1 = new sap.ui.model.json.JSONModel();
					oModel1.setData({
						DadosPorEmpresaSet: aData
					});
					component.setModel(oModel1);
					model_geral = oModel1;
					master_comp.selectFirstItem();
				} else {
					oShell.setApp(app_menu);
					controller_menu.refresh_totais();
					dequeue_all();
				}
				set_busy_global(false);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus, errorThrown);
				set_busy_global(false);
			}
		}
	);
}

function call_obtain_aprov_odata_refresh_mobile() {
	set_busy_global(true);
	var filters = new Array();
	var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFI_AP_PAG_SRV");
	oModel.read(
		"/DadosPorEmpresaSet", {
			filters: filters,
			success: function(oData, oResponse) {
				var aData = oData.results;
				var aDataOrig = aData;
				aData = tratamento_boolean(aData);
				if (aDataOrig.length > 0) {
					var oModel1 = new sap.ui.model.json.JSONModel();
					oModel1.setData({
						DadosPorEmpresaSet: aData
					});
					controller_master_mobile.getView().setModel(oModel1);
				} else {
					oShell.setApp(app_menu);
					controller_menu.refresh_totais();
					dequeue_all();
				}
				set_busy_global(false);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus, errorThrown);
				set_busy_global(false);
			}
		}
	);
}

function call_obtain_aprov_odata_refresh_filtered(component, filtro) {
	filtro = filtro.toUpperCase();
	set_busy_global(true);

	var filters = new Array();
	var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFI_AP_PAG_SRV");
	oModel.read(
		"/DadosPorEmpresaSet", {
			filters: filters,
			success: function(oData, oResponse) {
				var aData = oData.results;
				var aDataOrig = aData;
				aData = tratamento_boolean(aData);
				var oModel1 = new sap.ui.model.json.JSONModel();
				aData = filter_adata(aData, filtro);
				if (aDataOrig.length > 0) {
					oModel1.setData({
						DadosPorEmpresaSet: aData
					});
					component.setModel(oModel1);
					model_geral = oModel1;
					master_comp.selectFirstItem();
				} else {
					oShell.setApp(app_menu);
					controller_menu.refresh_totais();
					dequeue_all();
				}
				set_busy_global(false);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus, errorThrown);
				set_busy_global(false);
			}
		}
	);
}

function call_obtain_aprov_odata_refresh_filtered_mobile(filtro) {
	filtro = filtro.toUpperCase();
	set_busy_global(true);

	var filters = new Array();
	var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFI_AP_PAG_SRV");
	oModel.read(
		"/DadosPorEmpresaSet", {
			filters: filters,
			success: function(oData, oResponse) {
				var aData = oData.results;
				var aDataOrig = aData;
				aData = tratamento_boolean(aData);
				var oModel1 = new sap.ui.model.json.JSONModel();
				aData = filter_adata(aData, filtro);
				if (aDataOrig.length > 0) {
					oModel1.setData({
						DadosPorEmpresaSet: aData
					});
					controller_master_mobile.getView().setModel(oModel1);
				} else {
					oShell.setApp(app_menu);
					controller_menu.refresh_totais();
					dequeue_all();
				}
				set_busy_global(false);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus, errorThrown);
				set_busy_global(false);
			}
		}
	);
}

function filter_adata(aData, filtro) {
	var aDataAux = [];
	for (var i = 0; i < aData.length; i++) {
		if ((filtro === "") || ((aData[i].Nome).toUpperCase().indexOf(filtro) > -1) || ((aData[i].Codigo).toUpperCase().indexOf(filtro) > -1)) {
			aDataAux.push(aData[i]);
		}
	}
	return aDataAux;
}

function call_obtain_aprov_odata(component) {
	set_busy_global(true);
	var filters = new Array();
	var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFI_AP_PAG_SRV");
	oModel.read(
		"/DadosPorEmpresaSet", {
			filters: filters,
			success: function(oData, oResponse) {
				var oModel1 = new sap.ui.model.json.JSONModel();
				var aData = oData.results;
				aData = tratamento_boolean(aData);
				oModel1.setData({
					DadosPorEmpresaSet: aData
				});
				component.setModel(oModel1);
				model_geral = oModel1;
				set_busy_global(false);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus, errorThrown);
				set_busy_global(false);
			}
		}
	);
}

function tratamento_boolean(aData) {
	for (var i = 0; i < aData.length; i++) {
		for (var key in aData[i]) {
			if (aData[i].hasOwnProperty(key)) {
				if (aData[i][key] === "true") {
					aData[i][key] = true;
				} else if (aData[i][key] === "false") {
					aData[i][key] = false;
				}
			}
		}
	}
	return aData;
}

function load_model_empresa(comp_det) {
	var oTable = comp_det.getView().byId("propostasTable");
	oTable.setBusy(true);
	oTable.removeAllItems();

	var filters = new Array();
	var filterItem = new sap.ui.model.Filter("CodigoEmpresa", sap.ui.model.FilterOperator.EQ, comp_det.Codigo);
	filters.push(filterItem);
	filterItem = new sap.ui.model.Filter("CodigoEmpresaPagadora", sap.ui.model.FilterOperator.EQ, comp_det.CodigoEmpresaPagadora);
	filters.push(filterItem);
	filterItem = new sap.ui.model.Filter("Rfc", sap.ui.model.FilterOperator.EQ, comp_det.Rfc);
	filters.push(filterItem);
	var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFI_AP_PAG_SRV");
	oModel.read(
		"/DadosPorPropostaSet", {
			filters: filters,
			success: function(oData, oResponse) {
				oTable.removeAllItems();
				var aData = oData.results;
				aData = tratamento_boolean(aData);
				aData = valida_filtro_proposta(aData);
				data_proposta = aData;

				var lv_view = false;
				var lv_msg_lock = comp_det.Msg_visible;
				var lv_msg_text = comp_det.Error_msg;

				for (var i = 0; i < aData.length; i++) {
					if (aData[i].Aprovar === true) {
						lv_view = true;
					}

					if (aData[i].LockFlag !== lv_msg_lock) {
						lv_msg_lock = aData[i].LockFlag;
						lv_msg_text = "Propostas bloqueadas pelo utilizador: " + aData[i].LockUname;
					}

					var btn_apr = new sap.m.Button({
						icon: "sap-icon://accept",
						press: comp_det.pressAccept,
						enabled: aData[i].Aprovar
					});
					var btn_rej = new sap.m.Button({
						icon: "sap-icon://decline",
						press: comp_det.pressDecline,
						enabled: aData[i].Aprovar
					});

					var btn_pen = new sap.m.Button({
						icon: "sap-icon://pending",
						press: comp_det.pressClear,
						enabled: aData[i].Aprovar
					});

					var segButton1 = new sap.m.SegmentedButton({
						buttons: [btn_apr, btn_rej, btn_pen],
						//visible: aData[i].Aprovar,
						enabled: aData[i].Editar
					});

					var btn_comment = new sap.m.Button({
						icon: "sap-icon://comment",
						press: comp_det.pressComment,
						//visible: aData[i].Aprovar
						enabled: aData[i].Aprovar
					}).addStyleClass("sapMSegB sapMSegBIcons");

					var btn_comment_ant = new sap.m.Button({
						icon: "sap-icon://collaborate",
						press: comp_det.pressCommentAnt,
						//visible: aData[i].Aprovar,
						enabled: aData[i].Aprovar
					}).addStyleClass("sapMSegB sapMSegBIcons");

					if (aData[i].ComentariosAntigos === "") {
						btn_comment_ant.setEnabled(false);
					} else {
						btn_comment_ant.setType("Emphasized");
					}

					if (aData[i].StatusVal === "10" || aData[i].StatusVal === "11") {
						segButton1.setSelectedButton(btn_apr);
					} else if (aData[i].StatusVal === "90" || aData[i].StatusVal === "91") {
						segButton1.setSelectedButton(btn_rej);
					} else {
						segButton1.setSelectedButton(btn_pen);
					}

					var status_atual = new sap.m.ObjectIdentifier({
						title: aData[i].Status
					}).addStyleClass("item");

					var status_anterior = new sap.m.ObjectIdentifier({
						text: aData[i].AprovadorAnterior
					});

					var icon = new sap.m.Image({
						src: aData[i].StatusSrc
					});

					var icon_old = new sap.m.Image({
						src: aData[i].StatusSrcOld
					});

					var v_layout_icon = new sap.ui.commons.layout.VerticalLayout();
					v_layout_icon.addContent(icon);
					if (aData[i].StatusSrcOld !== "") {
						v_layout_icon.addContent(new sap.ui.commons.HorizontalDivider());
						v_layout_icon.addContent(icon_old);
					}
					var v_layout_status = new sap.ui.commons.layout.VerticalLayout();
					v_layout_status.addContent(status_atual);
					if (aData[i].AprovadorAnterior !== "") {
						v_layout_status.addContent(status_anterior);
					}
					var oLayoutOP = undefined;
					if (aData[i].LockFlag === true) {
						var alertIcon = new sap.ui.core.Icon({
							color: "#CA4747",
							src: "sap-icon://alert"
						});
						var alertLabel = new sap.m.Text({
							text: "Proposta bloqueada: " + aData[i].LockUname,
							wrapping: true
						}).addStyleClass("alert_label");
						var oLayoutAlert = new sap.ui.commons.layout.MatrixLayout({
							layoutFixed: true,
							width: '100%',
							columns: 2
						}).addStyleClass("matrix_layout");
						oLayoutAlert.setWidths('10%', '90%');
						oLayoutAlert.createRow(alertIcon, alertLabel);
						oLayoutOP = oLayoutAlert;
					} else {

						var oLayoutButton = new sap.ui.commons.layout.MatrixLayout({
							layoutFixed: true,
							width: '100%',
							columns: 3
						}).addStyleClass("matrix_layout");
						oLayoutButton.setWidths('60%', '20%', '20%');
						oLayoutButton.createRow(segButton1, btn_comment, btn_comment_ant);

						oLayoutOP = oLayoutButton;
					}

					var oColumn = new sap.m.ColumnListItem({
						press: "handlePressItem",
						cells: [
							new sap.m.Button({
								type: "Default",
								icon: "sap-icon://display",
								press: comp_det.pressDisplay
							}).addStyleClass("sapMSegB sapMSegBIcons"),
							new sap.m.ObjectIdentifier({
								title: aData[i].LaufdStr + " / " + aData[i].Laufi,
								text: aData[i].NFornecedores + " fornecedor(es)"
							}),
							new sap.m.ObjectIdentifier({
								title: aData[i].ValorAprovado + " " + aData[i].Moeda,
								text: aData[i].ValorTotal + " " + aData[i].Moeda
							}),
							v_layout_icon,
							v_layout_status,
							new sap.m.ObjectNumber({
								number: aData[i].Nivel
							}),
							new sap.m.ObjectIdentifier({
								title: aData[i].FormaPagamento
							}),
							/*opButtonAlert,
							btn_comment,
							btn_comment_ant*/
							oLayoutOP
						]
					});
					oTable.addItem(oColumn);
				}

				var oViewModel = new sap.ui.model.json.JSONModel({
					Codigo: comp_det.Codigo,
					Nome: comp_det.Nome,
					Local: comp_det.Local,
					NPropostas: comp_det.NPropostas,
					Total: comp_det.Total,
					Moeda: comp_det.Moeda,
					Msg_visible: lv_msg_lock,
					Error_msg: lv_msg_text,
					ApProposta: lv_view,
					Rfc: comp_det.Rfc
				});

				comp_det.getView().setModel(oViewModel, "header");

				oTable.setBusy(false);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus, errorThrown);
				oTable.setBusy(false);
			}
		}
	);
}

function load_model_empresa_mobile(comp_det_mobile) {
	var oTable = comp_det_mobile.getView().byId("propostasTableMobile");
	oTable.setBusy(true);

	var filters = new Array();
	var filterItem = new sap.ui.model.Filter("CodigoEmpresa", sap.ui.model.FilterOperator.EQ, comp_det_mobile.Codigo);
	filters.push(filterItem);
	filterItem = new sap.ui.model.Filter("CodigoEmpresaPagadora", sap.ui.model.FilterOperator.EQ, comp_det_mobile.CodigoEmpresaPagadora);
	filters.push(filterItem);
	filterItem = new sap.ui.model.Filter("Rfc", sap.ui.model.FilterOperator.EQ, comp_det_mobile.Rfc);
	filters.push(filterItem);
	var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFI_AP_PAG_SRV");
	oModel.read(
		"/DadosPorPropostaSet", {
			filters: filters,
			success: function(oData, oResponse) {
				oTable.removeAllItems();
				var aData = oData.results;
				aData = tratamento_boolean(aData);
				aData = valida_filtro_proposta_mobile(aData);
				data_proposta = aData;
				var lv_view = false;
				for (var i = 0; i < aData.length; i++) {

					if (aData[i].Aprovar === true) {
						lv_view = true;
					}

					var btn_apr = new sap.m.Button({
						icon: "sap-icon://accept",
						press: comp_det_mobile.pressAccept,
						enabled: aData[i].Aprovar
					});
					var btn_rej = new sap.m.Button({
						icon: "sap-icon://decline",
						press: comp_det_mobile.pressDecline,
						enabled: aData[i].Aprovar
					});

					var btn_pen = new sap.m.Button({
						icon: "sap-icon://pending",
						press: comp_det_mobile.pressClear,
						enabled: aData[i].Aprovar
					});

					var segButton1 = new sap.m.SegmentedButton({
						buttons: [btn_apr, btn_rej, btn_pen],
						//visible: aData[i].Aprovar,
						enabled: aData[i].Editar
					});

					var btn_comment = new sap.m.Button({
						icon: "sap-icon://comment",
						press: comp_det_mobile.pressComment,
						//visible: aData[i].Aprovar,
						enabled: aData[i].Aprovar
					}).addStyleClass("sapMSegB sapMSegBIcons");

					var btn_comment_ant = new sap.m.Button({
						icon: "sap-icon://collaborate",
						press: comp_det_mobile.pressCommentAnt,
						//visible: aData[i].Aprovar,
						enabled: aData[i].Aprovar
					}).addStyleClass("sapMSegB sapMSegBIcons");

					if (aData[i].ComentariosAntigos === "") {
						btn_comment_ant.setEnabled(false);
					} else {
						btn_comment_ant.setType("Emphasized");
					}

					if (aData[i].StatusVal === "10" || aData[i].StatusVal === "11") {
						segButton1.setSelectedButton(btn_apr);
					} else if (aData[i].StatusVal === "90" || aData[i].StatusVal === "91") {
						segButton1.setSelectedButton(btn_rej);
					} else {
						segButton1.setSelectedButton(btn_pen);
					}

					var status_atual = new sap.m.ObjectIdentifier({
						title: aData[i].Status
					}).addStyleClass("item");

					var status_anterior = new sap.m.ObjectIdentifier({
						text: aData[i].AprovadorAnterior
					});

					var icon = new sap.m.Image({
						src: aData[i].StatusSrc
					});

					var icon_old = new sap.m.Image({
						src: aData[i].StatusSrcOld
					});

					var v_layout_icon = new sap.ui.commons.layout.VerticalLayout();
					v_layout_icon.addContent(icon);
					if (aData[i].StatusSrcOld !== "") {
						v_layout_icon.addContent(new sap.ui.commons.HorizontalDivider());
						v_layout_icon.addContent(icon_old);
					}
					var v_layout_status = new sap.ui.commons.layout.VerticalLayout();
					v_layout_status.addContent(status_atual);
					if (aData[i].AprovadorAnterior !== "") {
						v_layout_status.addContent(status_anterior);
					}

					var oLayoutOP = undefined;
					if (aData[i].LockFlag === true) {
						var alertIcon = new sap.ui.core.Icon({
							color: "#CA4747",
							src: "sap-icon://alert"
						});
						var alertLabel = new sap.m.Text({
							text: "Proposta bloqueada: " + aData[i].LockUname,
							wrapping: true
						}).addStyleClass("alert_label");
						var oLayoutAlert = new sap.ui.commons.layout.MatrixLayout({
							layoutFixed: true,
							width: '100%',
							columns: 2
						}).addStyleClass("matrix_layout");
						oLayoutAlert.setWidths('10%', '90%');
						oLayoutAlert.createRow(alertIcon, alertLabel);
						oLayoutOP = oLayoutAlert;
					} else {

						var oLayoutButton = new sap.ui.commons.layout.MatrixLayout({
							layoutFixed: true,
							width: '100%',
							columns: 3
						}).addStyleClass("matrix_layout");
						oLayoutButton.setWidths('60%', '20%', '20%');
						oLayoutButton.createRow(segButton1, btn_comment, btn_comment_ant);

						oLayoutOP = oLayoutButton;
					}

					var oColumn = new sap.m.ColumnListItem({
						press: "handlePressItem",
						cells: [
							new sap.m.Button({
								type: "Default",
								icon: "sap-icon://display",
								press: comp_det_mobile.pressDisplay
							}).addStyleClass("sapMSegB sapMSegBIcons"),
							new sap.m.ObjectIdentifier({
								title: aData[i].LaufdStr + " / " + aData[i].Laufi,
								text: aData[i].NFornecedores + " fornecedor(es)"
							}),
							new sap.m.ObjectIdentifier({
								title: aData[i].ValorAprovado + " " + aData[i].Moeda,
								text: aData[i].ValorTotal + " " + aData[i].Moeda
							}),
							v_layout_icon,
							v_layout_status,
							new sap.m.ObjectNumber({
								number: aData[i].Nivel
							}),
							new sap.m.ObjectIdentifier({
								title: aData[i].FormaPagamento
							}),
							/*segButton1,
							btn_comment,
							btn_comment_ant*/
							oLayoutOP
						]
					});
					oTable.addItem(oColumn);
				}

				var oViewModel = new sap.ui.model.json.JSONModel({
					Codigo: comp_det_mobile.Codigo,
					Nome: comp_det_mobile.Nome,
					Local: comp_det_mobile.Local,
					NPropostas: comp_det_mobile.NPropostas,
					Total: comp_det_mobile.Total,
					Moeda: comp_det_mobile.Moeda,
					Msg_visible: comp_det_mobile.Msg_visible,
					Error_msg: comp_det_mobile.Error_msg,
					ApProposta: lv_view,
					Rfc: comp_det_mobile.Rfc
				});

				comp_det_mobile.getView().setModel(oViewModel, "header");
				oTable.setBusy(false);

			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus, errorThrown);
				oTable.setBusy(false);
			}
		}
	);
}

function load_model_proposta(comp_prop) {
	var oTable = comp_prop.getView().byId("fornTable");
	oTable.setBusy(true);

	lista_fornecedores_nivel = [];

	var filters = new Array();
	var filterItem = new sap.ui.model.Filter("CodigoEmpresa", sap.ui.model.FilterOperator.EQ, comp_prop.Codigo);
	filters.push(filterItem);
	filterItem = new sap.ui.model.Filter("Laufd", sap.ui.model.FilterOperator.EQ, comp_prop.Laufd);
	filters.push(filterItem);
	filterItem = new sap.ui.model.Filter("Laufi", sap.ui.model.FilterOperator.EQ, comp_prop.Laufi);
	filters.push(filterItem);
	filterItem = new sap.ui.model.Filter("Rfc", sap.ui.model.FilterOperator.EQ, comp_prop.Rfc);
	filters.push(filterItem);

	var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFI_AP_PAG_SRV");
	oModel.read(
		"/DadosPorFornecedorSet", {
			filters: filters,
			success: function(oData, oResponse) {
				oTable.removeAllItems();
				var aData = oData.results;
				aData = tratamento_boolean(aData);
				aData = valida_filtro_fornecedor(aData);
				data_fornecedor = aData;
				var lv_view;

				var lv_aprovado = "";
				var lv_total = "";
				var lv_total_faturas = 0;
				var lv_total_faturas_ap = 0;
				var lv_comentarios_prop = "";

				var lv_comment_enabled = true;

				for (var i = 0; i < aData.length; i++) {
					lv_aprovado = aData[i].SUMValorAprovado;
					lv_total = aData[i].SUMValorTotal;
					lv_total_faturas = aData[i].SUMNumFaturas;
					lv_total_faturas_ap = aData[i].SUMNumFaturasAprovadas;
					lv_comentarios_prop = aData[i].ComentariosProp;
					lv_comment_enabled = !aData[i].LockFlag;
					lv_view = aData[i].Aprovar;
					var fornecedor = {
						Fornecedor: aData[i].Lifnr,
						NivelInicial: aData[i].NivelInicial
					};
					lista_fornecedores_nivel.push(fornecedor);

					var btn_apr = new sap.m.Button({
						icon: "sap-icon://accept",
						press: comp_prop.pressAccept,
						enabled: aData[i].Aprovar
					});
					var btn_rej = new sap.m.Button({
						icon: "sap-icon://decline",
						press: comp_prop.pressDecline,
						enabled: aData[i].Aprovar
					});

					var btn_pen = new sap.m.Button({
						icon: "sap-icon://pending",
						press: comp_prop.pressClear,
						enabled: aData[i].Aprovar
					});

					var segButton1 = new sap.m.SegmentedButton({
						buttons: [btn_apr, btn_rej, btn_pen],
						//visible: aData[i].Aprovar,
						enabled: aData[i].Editar
					});

					var btn_comment = new sap.m.Button({
						icon: "sap-icon://comment",
						press: comp_prop.pressComment,
						//visible: aData[i].Aprovar,
						enabled: aData[i].Aprovar
					}).addStyleClass("sapMSegB sapMSegBIcons");

					var btn_comment_ant = new sap.m.Button({
						icon: "sap-icon://collaborate",
						press: comp_prop.pressCommentAnt,
						//visible: aData[i].Aprovar,
						enabled: aData[i].Aprovar
					}).addStyleClass("sapMSegB sapMSegBIcons");

					if (aData[i].ComentariosAntigos === "") {
						btn_comment_ant.setEnabled(false);
					} else {
						btn_comment_ant.setType("Emphasized");
					}

					if (aData[i].StatusVal === "10" || aData[i].StatusVal === "11") {
						segButton1.setSelectedButton(btn_apr);
					} else if (aData[i].StatusVal === "90" || aData[i].StatusVal === "91") {
						segButton1.setSelectedButton(btn_rej);
					} else {
						segButton1.setSelectedButton(btn_pen);
					}

					var status_atual = new sap.m.ObjectIdentifier({
						title: aData[i].Status
					}).addStyleClass("item");

					var status_anterior = new sap.m.ObjectIdentifier({
						text: aData[i].AprovadorAnterior
					});

					var icon = new sap.m.Image({
						src: aData[i].StatusSrc
					});

					var icon_old = new sap.m.Image({
						src: aData[i].StatusSrcOld
					});

					var v_layout_icon = new sap.ui.commons.layout.VerticalLayout();
					v_layout_icon.addContent(icon);
					if (aData[i].StatusSrcOld !== "") {
						v_layout_icon.addContent(new sap.ui.commons.HorizontalDivider());
						v_layout_icon.addContent(icon_old);
					}
					var v_layout_status = new sap.ui.commons.layout.VerticalLayout();
					v_layout_status.addContent(status_atual);
					if (aData[i].AprovadorAnterior !== "") {
						v_layout_status.addContent(status_anterior);
					}

					var oLayoutOP = undefined;
					if (aData[i].LockFlag === true) {
						var alertIcon = new sap.ui.core.Icon({
							color: "#CA4747",
							src: "sap-icon://alert"
						});
						var alertLabel = new sap.m.Text({
							text: "Proposta bloqueada: " + aData[i].LockUname,
							wrapping: true
						}).addStyleClass("alert_label");
						var oLayoutAlert = new sap.ui.commons.layout.MatrixLayout({
							layoutFixed: true,
							width: '100%',
							columns: 2
						}).addStyleClass("matrix_layout");
						oLayoutAlert.setWidths('10%', '90%');
						oLayoutAlert.createRow(alertIcon, alertLabel);
						oLayoutOP = oLayoutAlert;
					} else {

						var oLayoutButton = new sap.ui.commons.layout.MatrixLayout({
							layoutFixed: true,
							width: '100%',
							columns: 3
						}).addStyleClass("matrix_layout");
						oLayoutButton.setWidths('60%', '20%', '20%');
						oLayoutButton.createRow(segButton1, btn_comment, btn_comment_ant);

						oLayoutOP = oLayoutButton;
					}

					var oColumn = new sap.m.ColumnListItem({
						press: "handlePressItem",
						cells: [
							new sap.m.Button({
								type: "Default",
								icon: "sap-icon://display",
								press: comp_prop.pressDisplay
							}).addStyleClass("sapMSegB sapMSegBIcons"),
							new sap.m.ObjectIdentifier({
								title: aData[i].NomeFornecedor + " [ " + aData[i].Lifnr + " ]",
								text: aData[i].NFaturas + " fatura(s)"
							}),
							new sap.m.ObjectIdentifier({
								title: aData[i].ValorAprovado + " " + aData[i].Moeda,
								text: aData[i].ValorTotal + " " + aData[i].Moeda
							}),
							v_layout_icon,
							v_layout_status,
							/*segButton1,
							btn_comment,
							btn_comment_ant*/
							oLayoutOP
						]
					});
					oTable.addItem(oColumn);
				}

				if (lv_aprovado === "") {
					lv_aprovado = comp_prop.Aprovado;
				}

				if (lv_total === "") {
					lv_total = comp_prop.Total;
				}

				if (lv_total_faturas == 0) {
					lv_total_faturas = comp_prop.NFaturas;
				}

				/*if (lv_total_faturas_ap == 0){
					lv_total_faturas_ap = comp_prop.NFaturas;
				}*/

				var lv_comment_ant = "<div>" + comp_prop.ComentariosAntigosProp + "</div>";

				var oViewModel = new sap.ui.model.json.JSONModel({
					Codigo: comp_prop.Codigo,
					Nome: comp_prop.Nome,
					Laufd: comp_prop.Laufd,
					LaufdStr: comp_prop.LaufdStr,
					Laufi: comp_prop.Laufi,
					Total: lv_total,
					Aprovado: lv_aprovado,
					Moeda: comp_prop.Moeda,
					NFornecedores: comp_prop.NFornecedores,
					NFaturas: lv_total_faturas,
					NFaturasAP: lv_total_faturas_ap,
					Status: comp_prop.Status,
					Nivel: comp_prop.Nivel,
					FormaPagamento: comp_prop.FormaPagamento,
					ApFornecedor: lv_view,
					EnvioAprov: comp_prop.EnvioAprov,
					Hbkid: comp_prop.Hbkid,
					Ubknt: comp_prop.Ubknt,
					ComentariosAntigosProp: lv_comment_ant,
					ComentariosProp: lv_comentarios_prop,
					Contrato: comp_prop.Contrato,
					Outro: comp_prop.Outro,
					FactBloqueio: comp_prop.FactBloqueio,
					Editar: comp_prop.Editar,
					CommentEnabled: lv_comment_enabled
				});

				comp_prop.getView().setModel(oViewModel, "header");

				oTable.setBusy(false);

			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus, errorThrown);
				oTable.setBusy(false);
			}
		}
	);
}

function load_model_fornecedor(comp_forn) {

	var lock = false;
	var oTable = comp_forn.getView().byId("faturasTable");
	oTable.setBusy(true);

	var filters = new Array();
	var filterItem = new sap.ui.model.Filter("CodigoEmpresa", sap.ui.model.FilterOperator.EQ, comp_forn.Codigo);
	filters.push(filterItem);
	filterItem = new sap.ui.model.Filter("Laufd", sap.ui.model.FilterOperator.EQ, comp_forn.Laufd);
	filters.push(filterItem);
	filterItem = new sap.ui.model.Filter("Laufi", sap.ui.model.FilterOperator.EQ, comp_forn.Laufi);
	filters.push(filterItem);
	filterItem = new sap.ui.model.Filter("Lifnr", sap.ui.model.FilterOperator.EQ, comp_forn.Lifnr);
	filters.push(filterItem);
	filterItem = new sap.ui.model.Filter("Rfc", sap.ui.model.FilterOperator.EQ, comp_forn.Rfc);
	filters.push(filterItem);

	var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFI_AP_PAG_SRV");
	oModel.read(
		"/DadosPorFaturaSet", {
			filters: filters,
			success: function(oData, oResponse) {
				oTable.removeAllItems();
				var aData = oData.results;
				aData = tratamento_boolean(aData);
				aData = valida_filtro_fatura(aData);
				data_fatura = aData;
				var lv_view = false;
				var lv_comentarios_forn = "";
				var lv_comment_enabled = true;

				for (var i = 0; i < aData.length; i++) {
					lv_view = aData[i].Aprovar;

					lv_comentarios_forn = aData[i].ComentariosForn;

					lv_comment_enabled = !aData[i].LockFlag;

					var btn_apr = new sap.m.Button({
						icon: "sap-icon://accept",
						press: comp_forn.pressAccept,
						enabled: aData[i].Aprovar
					});
					var btn_rej = new sap.m.Button({
						icon: "sap-icon://decline",
						press: comp_forn.pressDecline,
						enabled: aData[i].Aprovar
					});

					var btn_pen = new sap.m.Button({
						icon: "sap-icon://pending",
						press: comp_forn.pressClear,
						enabled: aData[i].Aprovar
					});

					var segButton1 = new sap.m.SegmentedButton({
						buttons: [btn_apr, btn_rej, btn_pen],
						//visible: aData[i].Aprovar,
						enabled: aData[i].Editar
					});

					var btn_comment = new sap.m.Button({
						icon: "sap-icon://comment",
						press: comp_forn.pressComment,
						//visible: aData[i].Aprovar,
						enabled: aData[i].Aprovar
					}).addStyleClass("sapMSegB sapMSegBIcons");

					var btn_comment_ant = new sap.m.Button({
						icon: "sap-icon://collaborate",
						press: comp_forn.pressCommentAnt,
						//visible: aData[i].Aprovar,
						enabled: aData[i].Aprovar
					}).addStyleClass("sapMSegB sapMSegBIcons");

					var btn_outras_propostas = new sap.m.Button({
						icon: "sap-icon://simple-payment",
						press: comp_forn.handleOutrasPropostas,
						enabled: aData[i].OutraProposta
					}).addStyleClass("sapMSegB sapMSegBIcons");

					if (aData[i].ComentariosAntigos === "") {
						btn_comment_ant.setEnabled(false);
					} else {
						btn_comment_ant.setType("Emphasized");
					}

					if (aData[i].OutraProposta) {
						btn_outras_propostas.setType("Emphasized");
					}

					if (aData[i].StatusVal === "10" || aData[i].StatusVal === "11") {
						segButton1.setSelectedButton(btn_apr);
					} else if (aData[i].StatusVal === "90" || aData[i].StatusVal === "91") {
						segButton1.setSelectedButton(btn_rej);
					} else {
						segButton1.setSelectedButton(btn_pen);
					}

					var status_atual = new sap.m.ObjectIdentifier({
						title: aData[i].Status
					}).addStyleClass("item");

					var status_anterior = new sap.m.ObjectIdentifier({
						text: aData[i].AprovadorAnterior
					});

					var icon = new sap.m.Image({
						src: aData[i].StatusSrc
					});

					var icon_old = new sap.m.Image({
						src: aData[i].StatusSrcOld
					});

					var v_layout_icon = new sap.ui.commons.layout.VerticalLayout();
					v_layout_icon.addContent(icon);
					if (aData[i].StatusSrcOld !== "") {
						v_layout_icon.addContent(new sap.ui.commons.HorizontalDivider());
						v_layout_icon.addContent(icon_old);
					}
					var v_layout_status = new sap.ui.commons.layout.VerticalLayout();
					v_layout_status.addContent(status_atual);
					if (aData[i].AprovadorAnterior !== "") {
						v_layout_status.addContent(status_anterior);
					}

					var oLayout_valores = new sap.ui.commons.layout.MatrixLayout({
						layoutFixed: true,
						width: '90%',
						columns: 2
					}).addStyleClass("matrix_layout");
					oLayout_valores.setWidths('40%', '60%');

					var mont_liquido = new sap.m.ObjectNumber({
						number: aData[i].ValorTotal,
						unit: aData[i].Moeda,
						textAlign: "Right"
					});
					var mont_label_liquido = new sap.m.Label({
						text: "Líquido:"
					});
					oLayout_valores.createRow(mont_label_liquido, mont_liquido);

					var mont_imp = new sap.m.ObjectNumber({
						number: aData[i].ValorImposto,
						unit: aData[i].Moeda,
						textAlign: "Right"
					});
					var mont_label_imp = new sap.m.Label({
						text: "Imposto:"
					});
					oLayout_valores.createRow(mont_label_imp, mont_imp);

					var mont_doc = new sap.m.ObjectNumber({
						number: aData[i].ValorDocumento,
						unit: aData[i].Moeda,
						textAlign: "Right"
					});
					var mont_label_doc = new sap.m.Label({
						text: "Bruto:"
					});
					oLayout_valores.createRow(mont_label_doc, mont_doc);

					var v_layout_valor = new sap.ui.commons.layout.VerticalLayout();
					v_layout_valor.addContent(oLayout_valores);

					var oLayoutInfo = new sap.ui.commons.layout.MatrixLayout({
						layoutFixed: true,
						width: '100%',
						columns: 2
					}).addStyleClass("matrix_layout");
					oLayoutInfo.setWidths('60%', '40%');
					var lbl_suporte = new sap.m.Text({
						text: "Suporte contratual?",
						wrapping: true
					});
					var lbl_outro = new sap.m.Text({
						text: "Se não, Outro?",
						wrapping: true
					});
					var lbl_fact = new sap.m.Text({
						text: "Factores de bloqueio?",
						wrapping: true
					});

					var switch1 = new sap.m.Switch({
						state: aData[i].Contrato,
						customTextOff: "Não",
						customTextOn: "Sim",
						enabled: (aData[i].Aprovar && aData[i].Editar),
						change: comp_forn.pressSwitchContrato
					});
					var switch2 = new sap.m.Switch({
						state: aData[i].Outro,
						customTextOff: "Não",
						customTextOn: "Sim",
						enabled: (aData[i].Aprovar && aData[i].Editar),
						change: comp_forn.pressSwitchOutro
					});
					var switch3 = new sap.m.Switch({
						state: aData[i].FactBloqueio,
						customTextOff: "Não",
						customTextOn: "Sim",
						enabled: (aData[i].Aprovar && aData[i].Editar),
						change: comp_forn.pressSwitchFactBloqueio
					});

					oLayoutInfo.createRow(lbl_suporte, switch1);
					oLayoutInfo.createRow(lbl_outro, switch2);
					oLayoutInfo.createRow(lbl_fact, switch3);

					var oLayoutOP = undefined;
					if (aData[i].LockFlag === true) {
						var alertIcon = new sap.ui.core.Icon({
							color: "#CA4747",
							src: "sap-icon://alert"
						});
						var alertLabel = new sap.m.Text({
							text: "Proposta bloqueada: " + aData[i].LockUname,
							wrapping: true
						}).addStyleClass("alert_label");
						var oLayoutAlert = new sap.ui.commons.layout.MatrixLayout({
							layoutFixed: true,
							width: '100%',
							columns: 2
						}).addStyleClass("matrix_layout");
						oLayoutAlert.setWidths('10%', '90%');
						oLayoutAlert.createRow(alertIcon, alertLabel);
						oLayoutOP = oLayoutAlert;
					} else {

						var oLayoutButton = new sap.ui.commons.layout.MatrixLayout({
							layoutFixed: true,
							width: '100%',
							columns: 3
						}).addStyleClass("matrix_layout");
						oLayoutButton.setWidths('60%', '20%', '20%');
						oLayoutButton.createRow(segButton1, btn_comment, btn_comment_ant);

						oLayoutOP = oLayoutButton;
					}

					var oColumn = new sap.m.ColumnListItem({
						press: "handlePressItem",
						cells: [
							new sap.m.ObjectIdentifier({
								text: aData[i].Fatura + "/" + aData[i].Ano,
								title: aData[i].Referencia
							}),
							v_layout_valor,
							v_layout_icon,
							v_layout_status,
							/*segButton1,
							btn_comment,
							btn_comment_ant,*/
							oLayoutOP,
							btn_outras_propostas,
							oLayoutInfo
						]
					});
					oTable.addItem(oColumn);
				}

				var lv_comment_ant = "<div>" + comp_forn.ComentariosAntigosForn + "</div>";

				var oViewModel = new sap.ui.model.json.JSONModel({
					Codigo: comp_forn.Codigo,
					Nome: comp_forn.Nome,
					Laufd: comp_forn.Laufd,
					LaufdStr: comp_forn.LaufdStr,
					Laufi: comp_forn.Laufi,
					Lifnr: comp_forn.Lifnr,
					NomeLifnr: comp_forn.NomeLifnr,
					Total: comp_forn.Total,
					Moeda: comp_forn.Moeda,
					NFaturas: comp_forn.NFaturas,
					Status: comp_forn.Status,
					Nivel: comp_forn.Nivel,
					LockAll: lock,
					ApFatura: lv_view,
					ComentariosForn: lv_comentarios_forn,
					ComentariosAntigosForn: lv_comment_ant,
					CommentEnabled: lv_comment_enabled
				});
				comp_forn.getView().setModel(oViewModel, "header");

				oTable.setBusy(false);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus, errorThrown);
				oTable.setBusy(false);
			}
		}
	);
}

function laufd_to_text(laufd) {
	return laufd.substring(6, 8) + "." + laufd.substring(4, 6) + "." + laufd.substring(0, 4);
}

function text_to_laufd(text) {
	return text.substring(6, 10) + text.substring(3, 5) + text.substring(0, 2);
}

function enqueue_empresa(lv_codigo, lv_rfc) {
	set_busy_global(true);
	var sendLine = {
		CodigoEmpresa: lv_codigo,
		Enqueue: "X",
		Dequeue: "X",
		Rfc: lv_rfc
	};
	var oModel_d = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFI_AP_PAG_SRV");
	oModel_d.setHeaders({
		"X-Requested-With": "X"
	});
	oModel_d.create("/EnqueueDequeueSet", sendLine, null, function(data, response) {
		set_busy_global(false);
	}, function(err) {
		sap.m.MessageToast.show("Erro ao executar o serviço! Contacte administrador!");
		set_busy_global(false);
	});
}

function enqueue_proposta(lv_codigo, lv_laufd, lv_laufi, lv_rfc) {
	set_busy_global(true);
	var sendLine = {
		CodigoEmpresa: lv_codigo,
		Laufd: lv_laufd,
		Laufi: lv_laufi,
		Enqueue: "X",
		Dequeue: "X",
		Rfc: lv_rfc
	};
	var oModel_d = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFI_AP_PAG_SRV");
	oModel_d.setHeaders({
		"X-Requested-With": "X"
	});
	oModel_d.create("/EnqueueDequeueSet", sendLine, null, function(data, response) {
		set_busy_global(false);
	}, function(err) {
		sap.m.MessageToast.show("Erro ao executar o serviço! Contacte administrador!");
		set_busy_global(false);
	});
}

function dequeue_all() {
	var sendLine = {
		CodigoEmpresa: "",
		Enqueue: "",
		Dequeue: "X"
	};
	var oModel_d = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFI_AP_PAG_SRV");
	oModel_d.setHeaders({
		"X-Requested-With": "X"
	});
	oModel_d.create("/EnqueueDequeueSet", sendLine, null, function(data, response) {

	}, function(err) {
		sap.m.MessageToast.show("Erro ao executar o serviço! Contacte administrador!");

	});
}

function reiniciar_app() {
	var new_url = window.location.href.split("logoff.html")[0] + "index.html";
	window.location = new_url;
}

function logoff_old() {
	logoff_clean();

	var new_url = window.location.href.split("index.html")[0] + "logoff.html";
	window.location = new_url;
}

function logoff() {
	dequeue_all();
	logoff_done = true;
	var app_logoff = new sap.m.App();
	var logoffView = sap.ui.view({
		viewName: "ZODK_AP_PAG.view.Logoff",
		type: sap.ui.core.mvc.ViewType.XML
	});
	app_logoff.addPage(logoffView);
	oShell.setApp(app_logoff);
	logoff_clean();
}

function logoff_clean_old() {
	$.ajax({
		type: "GET",
		url: "/sap/public/bc/icf/logoff", //Clear SSO cookies: SAP Provided service to do that
	}).done(function(data) { //Now clear the authentication header stored in the browser
		if (!document.execCommand("ClearAuthenticationCache", "false")) {
			$.ajax({
				type: "GET",
				url: "/sap/opu/odata/SOME/SERVICE", //any URL to a Gateway service
				username: 'dummy', //dummy credentials: when request fails, will clear the authentication header
				password: 'dummy',
				statusCode: {
					401: function() {
						//This empty handler function will prevent authentication pop-up in chrome/firefox
					}
				},
				error: function() {}
			});
		}
	});
}

function logoff_clean() {
	$.ajax({
		type: "GET",
		url: "/sap/public/bc/icf/logoff"
	}).done(function(data) {
		if (!document.execCommand("ClearAuthenticationCache")) {
			$.ajax({
				type: "GET",
				url: "/sap/opu / odata / SOME / SERVICE",
				username: 'dummy',
				password: 'dummy',
				statusCode: {
					401: function() {}
				},
				error: function() {}
			});
		}
	});
}

function get_totais(oView) {
	set_busy_global(true);
	var tile_propostas = oView.byId("proposta_tile");
	var tile_historico = oView.byId("historico_tile");

	var filters = new Array();

	var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFI_AP_PAG_SRV");
	oModel.read(
		"/PropostasAtivasSet", {
			filters: filters,
			success: function(oData, oResponse) {

				var aData = oData.results;
				aData = tratamento_boolean(aData);
				for (var i = 0; i < aData.length; i++) {
					tile_propostas.setNumber(aData[i].Pendentes);
					num_propostas_pendentes = aData[i].Pendentes;
					tile_historico.setNumber(aData[i].Historico);
					if (aData[i].Historico === 1) {
						tile_historico.setNumberUnit("Proposta");
					} else {
						tile_historico.setNumberUnit("Propostas");
					}
				}
				set_busy_global(false);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus, errorThrown);
				set_busy_global(false);
			}
		}
	);
}

function obter_historico_user(control) {
	var oTable = control.getView().byId("historicoTable");
	oTable.setBusy(true);

	var filters = new Array();

	var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFI_AP_PAG_SRV");
	oModel.read(
		"/HistoricoUserSet", {
			filters: filters,
			success: function(oData, oResponse) {
				var aData = oData.results;
				aData = tratamento_boolean(aData);
				aData = valida_filtro_historico_user(aData);
				data_historico_user_propostas = aData;
				oTable.removeAllItems();
				for (var i = 0; i < aData.length; i++) {
					/*var oLayoutInfo = new sap.ui.commons.layout.MatrixLayout({
						layoutFixed: true,
						width: '100%',
						columns: 2
					}).addStyleClass("matrix_layout");
					oLayoutInfo.setWidths('90%', '10%');

					var oLabel1 = new sap.m.Label({
						text: "Suporte contratual?",
						wrapping: true
					});
					var oCheck1 = new sap.ui.commons.CheckBox({
						checked: aData[i].Contrato
					});

					oLayoutInfo.createRow(oLabel1, oCheck1);

					var oLabel2 = new sap.m.Label({
						text: "…se não, Outro?",
						wrapping: true
					});
					var oCheck2 = new sap.ui.commons.CheckBox({
						checked: aData[i].Outro
					});
					oLayoutInfo.createRow(oLabel2, oCheck2);

					var oLabel3 = new sap.m.Label({
						text: "Factores de bloqueio?",
						wrapping: true
					});
					var oCheck3 = new sap.ui.commons.CheckBox({
						checked: aData[i].FactBloqueio
					});
					oLayoutInfo.createRow(oLabel3, oCheck3);*/

					var oColumn = new sap.m.ColumnListItem({
						press: controller_historico_user.handlePressItem,
						type: "Active",
						cells: [
							new sap.m.ObjectIdentifier({
								text: aData[i].DescEmpresa,
								title: aData[i].CodigoEmpresa
							}),
							new sap.m.ObjectIdentifier({
								title: aData[i].LaufdStr + " / " + aData[i].Laufi
							}),
							new sap.m.ObjectIdentifier({
								title: aData[i].ValorAprovado + " " + aData[i].Moeda,
								text: aData[i].ValorTotal + " " + aData[i].Moeda
							}),
							new sap.m.ObjectNumber({
								number: aData[i].Nivel
							}),
							new sap.m.Image({
								src: aData[i].StatusSrc
							}),
							new sap.m.Text({
								text: aData[i].Status
							}),
							new sap.ui.core.HTML({
								content: aData[i].ComentarioProposta
							})
							//,oLayoutInfo
						]
					});
					oTable.addItem(oColumn);
				}
				oTable.setBusy(false);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus, errorThrown);
				oTable.setBusy(false);
			}
		}
	);
}

function obter_historico_completo(control) {

	var oTable = control.getView().byId("historicoCompletoTable");
	oTable.setBusy(true);

	var filters = new Array();

	var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFI_AP_PAG_SRV");
	oModel.read(
		"/HistoricoCompletoSet", {
			filters: filters,
			success: function(oData, oResponse) {
				var aData = oData.results;
				aData = tratamento_boolean(aData);
				aData = valida_filtro_historico_completo(aData);
				data_historico_completo_propostas = aData;
				oTable.removeAllItems();
				for (var i = 0; i < aData.length; i++) {

					/*var oLayoutInfo = new sap.ui.commons.layout.MatrixLayout({
						layoutFixed: true,
						width: '100%',
						columns: 2
					}).addStyleClass("matrix_layout");
					oLayoutInfo.setWidths('90%', '10%');

					var oLabel1 = new sap.m.Label({
						text: "Suporte contratual?",
						wrapping: true
					});
					var oCheck1 = new sap.ui.commons.CheckBox({
						checked: aData[i].Contrato
					});

					oLayoutInfo.createRow(oLabel1, oCheck1);

					var oLabel2 = new sap.m.Label({
						text: "…se não, Outro?",
						wrapping: true
					});
					var oCheck2 = new sap.ui.commons.CheckBox({
						checked: aData[i].Outro
					});
					oLayoutInfo.createRow(oLabel2, oCheck2);

					var oLabel3 = new sap.m.Label({
						text: "Factores de bloqueio?",
						wrapping: true
					});
					var oCheck3 = new sap.ui.commons.CheckBox({
						checked: aData[i].FactBloqueio
					});
					oLayoutInfo.createRow(oLabel3, oCheck3);*/

					var oColumn = new sap.m.ColumnListItem({
						press: controller_historico_completo.handlePressItem,
						type: "Active",
						cells: [
							new sap.m.ObjectIdentifier({
								text: aData[i].DescEmpresa,
								title: aData[i].CodigoEmpresa
							}),
							new sap.m.ObjectIdentifier({
								title: aData[i].LaufdStr + " / " + aData[i].Laufi
							}),
							new sap.m.ObjectIdentifier({
								title: aData[i].ValorAprovado + " " + aData[i].Moeda,
								text: aData[i].ValorTotal + " " + aData[i].Moeda
							}),
							new sap.m.ObjectNumber({
								number: aData[i].Nivel
							}),
							new sap.m.Image({
								src: aData[i].StatusSrc
							}),
							new sap.m.Text({
								text: aData[i].Status
							}),
							new sap.ui.core.HTML({
								content: aData[i].ComentarioProposta
							})
							//,oLayoutInfo
						]
					});
					oTable.addItem(oColumn);
				}
				oTable.setBusy(false);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus, errorThrown);
				oTable.setBusy(false);
			}
		}
	);
}

function get_source() {
	var paramLauch = getQueryVariable("LAUNCHPAD");
	if (paramLauch === undefined || paramLauch === "") {
		var oViewModel = new sap.ui.model.json.JSONModel({
			Logoff: true,
			Back: false
		});
		controller_menu.getView().setModel(oViewModel, "modelo");
	} else {
		var oViewModel = new sap.ui.model.json.JSONModel({
			Logoff: false,
			Back: true
		});
		controller_menu.getView().setModel(oViewModel, "modelo");
	}
}

function getQueryVariable(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		if (pair[0] === variable) {
			return pair[1];
		}
	}
}

function load_model_historico_proposta(lv_codigo, lv_laufd, lv_laufi, view, lv_rfc) {
	var content = view.getContent();
	var oTable = content[1];
	oTable.setBusy(true);

	var filters = new Array();
	var filterItem = new sap.ui.model.Filter("CodigoEmpresa", sap.ui.model.FilterOperator.EQ, lv_codigo);
	filters.push(filterItem);
	filterItem = new sap.ui.model.Filter("Laufd", sap.ui.model.FilterOperator.EQ, lv_laufd);
	filters.push(filterItem);
	filterItem = new sap.ui.model.Filter("Laufi", sap.ui.model.FilterOperator.EQ, lv_laufi);
	filters.push(filterItem);
	filterItem = new sap.ui.model.Filter("Rfc", sap.ui.model.FilterOperator.EQ, lv_rfc);
	filters.push(filterItem);

	var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFI_AP_PAG_SRV");
	oModel.read(
		"/HistoricoPropostaSet", {
			filters: filters,
			success: function(oData, oResponse) {

				var aData = oData.results;
				oTable.removeAllItems();

				for (var i = 0; i < aData.length; i++) {
					var oColumn = new sap.m.ColumnListItem({
						press: "handlePressItem",
						tooltip: aData[i].Status,
						cells: [
							new sap.m.ObjectIdentifier({
								text: aData[i].DescLifnr,
								title: aData[i].Lifnr
							}),
							new sap.m.ObjectIdentifier({
								text: aData[i].Ano,
								title: aData[i].Fatura
							}),
							new sap.m.ObjectNumber({
								number: aData[i].ValorTotal,
								unit: aData[i].Moeda
							}),
							new sap.m.ObjectNumber({
								number: aData[i].Nivel
							}),
							new sap.m.Image({
								src: aData[i].StatusSrc
							}),
							new sap.m.ObjectIdentifier({
								text: aData[i].UserNome,
								title: aData[i].User
							})
						]
					});
					oTable.addItem(oColumn);
				}
				oTable.setBusy(false);

			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus, errorThrown);
				oTable.setBusy(false);
			}
		}
	);
}

function load_detalhe_proposta_user(data, view) {
	var content = view.getContent();
	var oTable = content[0];
	oTable.setBusy(true);

	var filters = new Array();
	var filterItem = new sap.ui.model.Filter("CodigoEmpresa", sap.ui.model.FilterOperator.EQ, data.CodigoEmpresa);
	filters.push(filterItem);
	filterItem = new sap.ui.model.Filter("Laufd", sap.ui.model.FilterOperator.EQ, data.Laufd);
	filters.push(filterItem);
	filterItem = new sap.ui.model.Filter("Laufi", sap.ui.model.FilterOperator.EQ, data.Laufi);
	filters.push(filterItem);
	filterItem = new sap.ui.model.Filter("Rfc", sap.ui.model.FilterOperator.EQ, data.Rfc);
	filters.push(filterItem);

	var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFI_AP_PAG_SRV");
	oModel.read(
		"/HistoricoUserSet", {
			filters: filters,
			success: function(oData, oResponse) {

				var aData = oData.results;
				aData = tratamento_boolean(aData);
				oTable.removeAllItems();

				for (var i = 0; i < aData.length; i++) {

					var oLayoutInfo = new sap.ui.commons.layout.MatrixLayout({
						layoutFixed: true,
						width: '100%',
						columns: 2
					}).addStyleClass("matrix_layout");
					oLayoutInfo.setWidths('60%', '40%');
					var lbl_suporte = new sap.m.Text({
						text: "Suporte contratual?",
						wrapping: true
					});
					var lbl_outro = new sap.m.Text({
						text: "Se não, Outro?",
						wrapping: true
					});
					var lbl_fact = new sap.m.Text({
						text: "Factores de bloqueio?",
						wrapping: true
					});

					var switch1 = new sap.m.Switch({
						state: aData[i].Contrato,
						customTextOff: "Não",
						customTextOn: "Sim",
						enabled: false
					});
					var switch2 = new sap.m.Switch({
						state: aData[i].Outro,
						customTextOff: "Não",
						customTextOn: "Sim",
						enabled: false
					});
					var switch3 = new sap.m.Switch({
						state: aData[i].FactBloqueio,
						customTextOff: "Não",
						customTextOn: "Sim",
						enabled: false
					});

					oLayoutInfo.createRow(lbl_suporte, switch1);
					oLayoutInfo.createRow(lbl_outro, switch2);
					oLayoutInfo.createRow(lbl_fact, switch3);

					var oColumn = new sap.m.ColumnListItem({
						press: "handlePressItem",
						cells: [
							new sap.m.ObjectIdentifier({
								text: aData[i].DescLifnr,
								title: aData[i].Lifnr
							}),
							new sap.m.ObjectIdentifier({
								text: aData[i].Ano,
								title: aData[i].Fatura
							}),
							new sap.m.ObjectNumber({
								number: aData[i].ValorTotal,
								unit: aData[i].Moeda
							}),
							new sap.m.ObjectNumber({
								number: aData[i].Nivel
							}),
							new sap.m.Image({
								src: aData[i].StatusSrc
							}),
							new sap.ui.core.HTML({
								content: aData[i].ComentarioFornecedor
							}),
							new sap.ui.core.HTML({
								content: aData[i].ComentarioFatura
							}),
							oLayoutInfo
						]
					});
					oTable.addItem(oColumn);
				}
				oTable.setBusy(false);

			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus, errorThrown);
				oTable.setBusy(false);
			}
		}
	);
}

function load_detalhe_proposta_completo(data, view) {
	var content = view.getContent();
	var oTable = content[0];
	oTable.setBusy(true);

	var filters = new Array();
	var filterItem = new sap.ui.model.Filter("CodigoEmpresa", sap.ui.model.FilterOperator.EQ, data.CodigoEmpresa);
	filters.push(filterItem);
	filterItem = new sap.ui.model.Filter("Laufd", sap.ui.model.FilterOperator.EQ, data.Laufd);
	filters.push(filterItem);
	filterItem = new sap.ui.model.Filter("Laufi", sap.ui.model.FilterOperator.EQ, data.Laufi);
	filters.push(filterItem);
	filterItem = new sap.ui.model.Filter("Rfc", sap.ui.model.FilterOperator.EQ, data.Rfc);
	filters.push(filterItem);

	var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFI_AP_PAG_SRV");
	oModel.read(
		"/HistoricoCompletoSet", {
			filters: filters,
			success: function(oData, oResponse) {

				var aData = oData.results;
				aData = tratamento_boolean(aData);
				oTable.removeAllItems();

				for (var i = 0; i < aData.length; i++) {

					var oLayoutInfo = new sap.ui.commons.layout.MatrixLayout({
						layoutFixed: true,
						width: '100%',
						columns: 2
					}).addStyleClass("matrix_layout");
					oLayoutInfo.setWidths('60%', '40%');
					var lbl_suporte = new sap.m.Text({
						text: "Suporte contratual?",
						wrapping: true
					});
					var lbl_outro = new sap.m.Text({
						text: "Se não, Outro?",
						wrapping: true
					});
					var lbl_fact = new sap.m.Text({
						text: "Factores de bloqueio?",
						wrapping: true
					});

					var switch1 = new sap.m.Switch({
						state: aData[i].Contrato,
						customTextOff: "Não",
						customTextOn: "Sim",
						enabled: false
					});
					var switch2 = new sap.m.Switch({
						state: aData[i].Outro,
						customTextOff: "Não",
						customTextOn: "Sim",
						enabled: false
					});
					var switch3 = new sap.m.Switch({
						state: aData[i].FactBloqueio,
						customTextOff: "Não",
						customTextOn: "Sim",
						enabled: false
					});

					oLayoutInfo.createRow(lbl_suporte, switch1);
					oLayoutInfo.createRow(lbl_outro, switch2);
					oLayoutInfo.createRow(lbl_fact, switch3);

					var oColumn = new sap.m.ColumnListItem({
						press: "handlePressItem",
						cells: [
							new sap.m.ObjectIdentifier({
								text: aData[i].DescLifnr,
								title: aData[i].Lifnr
							}),
							new sap.m.ObjectIdentifier({
								text: aData[i].Ano,
								title: aData[i].Fatura
							}),
							new sap.m.ObjectNumber({
								number: aData[i].ValorTotal,
								unit: aData[i].Moeda
							}),
							new sap.m.ObjectNumber({
								number: aData[i].Nivel
							}),
							new sap.m.Image({
								src: aData[i].StatusSrc
							}),
							new sap.m.ObjectIdentifier({
								text: aData[i].UserName,
								title: aData[i].User
							}),
							new sap.ui.core.HTML({
								content: aData[i].ComentarioFornecedor
							}),
							new sap.ui.core.HTML({
								content: aData[i].ComentarioFatura
							}),
							oLayoutInfo
						]
					});
					oTable.addItem(oColumn);
				}
				oTable.setBusy(false);

			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus, errorThrown);
				oTable.setBusy(false);
			}
		}
	);
}

function valida_filtro_fornecedor(aData) {
	var aData_new = [];
	for (var i = 0; i < aData.length; i++) {
		if (det_prop.FiltroCodigo !== "" && det_prop.FiltroDescricao !== "") {
			if ((aData[i].Lifnr.toUpperCase().indexOf(det_prop.FiltroCodigo.toUpperCase()) !== -1) && (aData[i].NomeFornecedor.toUpperCase().indexOf(
					det_prop.FiltroDescricao.toUpperCase()) !== -1)) {
				aData_new.push(aData[i]);
			}
		} else if (det_prop.FiltroCodigo !== "" && det_prop.FiltroDescricao === "") {
			if (aData[i].Lifnr.toUpperCase().indexOf(det_prop.FiltroCodigo.toUpperCase()) !== -1) {
				aData_new.push(aData[i]);
			}
		} else if (det_prop.FiltroCodigo === "" && det_prop.FiltroDescricao !== "") {
			if (aData[i].NomeFornecedor.toUpperCase().indexOf(det_prop.FiltroDescricao.toUpperCase()) !== -1) {
				aData_new.push(aData[i]);
			}
		} else {
			aData_new.push(aData[i]);
		}
	}
	return aData_new;
}

function valida_filtro_fatura(aData) {
	var aData_new = [];
	for (var i = 0; i < aData.length; i++) {
		if (det_forn.FiltroFatura !== "" && det_forn.FiltroAno !== "") {
			if ((aData[i].Fatura.toUpperCase().indexOf(det_forn.FiltroFatura.toUpperCase()) !== -1) && (aData[i].Ano.toUpperCase().indexOf(det_forn.FiltroAno
					.toUpperCase()) !== -1)) {
				aData_new.push(aData[i]);
			}
		} else if (det_forn.FiltroFatura !== "" && det_forn.FiltroAno === "") {
			if (aData[i].Fatura.toUpperCase().indexOf(det_forn.FiltroFatura.toUpperCase()) !== -1) {
				aData_new.push(aData[i]);
			}
		} else if (det_forn.FiltroFatura === "" && det_forn.FiltroAno !== "") {
			if (aData[i].Ano.toUpperCase().indexOf(det_forn.FiltroAno.toUpperCase()) !== -1) {
				aData_new.push(aData[i]);
			}
		} else {
			aData_new.push(aData[i]);
		}
	}
	return aData_new;
}

function valida_filtro_proposta(aData) {
	var aData_new = [];
	var lv_continue = true;
	for (var i = 0; i < aData.length; i++) {

		lv_continue = true;

		if (det_comp.FiltroData !== "") {
			if (aData[i].LaufdStr.toUpperCase().indexOf(det_comp.FiltroData.toUpperCase()) === -1) {
				lv_continue = false;
			}
		}

		if (det_comp.FiltroCodigo !== "") {
			if (aData[i].Laufi.toUpperCase().indexOf(det_comp.FiltroCodigo.toUpperCase()) === -1) {
				lv_continue = false;
			}
		}

		if (det_comp.FiltroNivel !== "") {
			if (aData[i].Nivel.toUpperCase().indexOf(det_comp.FiltroNivel.toUpperCase()) === -1) {
				lv_continue = false;
			}
		}

		if (lv_continue) {
			aData_new.push(aData[i]);
		}

		/*if (det_comp.FiltroData !== "" && det_comp.FiltroCodigo !== "") {
			if ((aData[i].LaufdStr.toUpperCase().indexOf(det_comp.FiltroData.toUpperCase()) !== -1) && (aData[i].Laufi.toUpperCase().indexOf(
					det_comp.FiltroCodigo.toUpperCase()) !== -1)) {
				aData_new.push(aData[i]);
			}
		} else if (det_comp.FiltroData !== "" && det_comp.FiltroCodigo === "") {
			if (aData[i].LaufdStr.toUpperCase().indexOf(det_comp.FiltroData.toUpperCase()) !== -1) {
				aData_new.push(aData[i]);
			}
		} else if (det_comp.FiltroData === "" && det_comp.FiltroCodigo !== "") {
			if (aData[i].Laufi.toUpperCase().indexOf(det_comp.FiltroCodigo.toUpperCase()) !== -1) {
				aData_new.push(aData[i]);
			}
		} else {
			aData_new.push(aData[i]);
		}*/
	}
	return aData_new;
}

function valida_filtro_proposta_mobile(aData) {
	var aData_new = [];
	var lv_continue = true;
	for (var i = 0; i < aData.length; i++) {

		lv_continue = true;

		if (det_comp_mobile.FiltroData !== "") {
			if (aData[i].LaufdStr.toUpperCase().indexOf(det_comp_mobile.FiltroData.toUpperCase()) === -1) {
				lv_continue = false;
			}
		}

		if (det_comp_mobile.FiltroCodigo !== "") {
			if (aData[i].Laufi.toUpperCase().indexOf(det_comp_mobile.FiltroCodigo.toUpperCase()) === -1) {
				lv_continue = false;
			}
		}

		if (det_comp_mobile.FiltroNivel !== "") {
			if (aData[i].Nivel.toUpperCase().indexOf(det_comp_mobile.FiltroNivel.toUpperCase()) === -1) {
				lv_continue = false;
			}
		}

		if (lv_continue) {
			aData_new.push(aData[i]);
		}

		/*if (det_comp_mobile.FiltroData !== "" && det_comp_mobile.FiltroCodigo !== "") {
			if ((aData[i].LaufdStr.toUpperCase().indexOf(det_comp_mobile.FiltroData.toUpperCase()) !== -1) && (aData[i].Laufi.toUpperCase().indexOf(
					det_comp_mobile.FiltroCodigo.toUpperCase()) !== -1)) {
				aData_new.push(aData[i]);
			}
		} else if (det_comp_mobile.FiltroData !== "" && det_comp_mobile.FiltroCodigo === "") {
			if (aData[i].LaufdStr.toUpperCase().indexOf(det_comp_mobile.FiltroData.toUpperCase()) !== -1) {
				aData_new.push(aData[i]);
			}
		} else if (det_comp_mobile.FiltroData === "" && det_comp_mobile.FiltroCodigo !== "") {
			if (aData[i].Laufi.toUpperCase().indexOf(det_comp_mobile.FiltroCodigo.toUpperCase()) !== -1) {
				aData_new.push(aData[i]);
			}
		} else {
			aData_new.push(aData[i]);
		}*/
	}
	return aData_new;
}

function rejeitar_fatura(data) {
	var sendLine = {
		CodigoEmpresa: det_forn.Codigo,
		Laufd: det_forn.Laufd,
		Laufi: det_forn.Laufi,
		Lifnr: det_forn.Lifnr,
		Fatura: data.Fatura,
		Ano: data.Ano,
		Rfc: data.Rfc,
		Comentarios: data.Comentarios,
		MotivoRejeicao: data.MotivoRejeicao,
		Status: "90"
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
}

function rejeitar_fornecedor(data) {
	var sendLine = {
		CodigoEmpresa: det_prop.Codigo,
		Laufd: det_prop.Laufd,
		Laufi: det_prop.Laufi,
		Lifnr: data.Lifnr,
		Comentarios: data.Comentarios,
		MotivoRejeicao: data.MotivoRejeicao,
		Rfc: data.Rfc,
		Status: "90"
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
}

function rejeitar_proposta(data) {
	var sendLine = {
		CodigoEmpresa: det_comp.Codigo,
		Laufd: data.Laufd,
		Laufi: data.Laufi,
		Comentarios: data.Comentarios,
		MotivoRejeicao: data.MotivoRejeicao,
		Rfc: data.Rfc,
		Status: "90"
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
}

function rejeitar_proposta_mobile(data) {
	var sendLine = {
		CodigoEmpresa: det_comp_mobile.Codigo,
		Laufd: data.Laufd,
		Laufi: data.Laufi,
		Comentarios: data.Comentarios,
		MotivoRejeicao: data.MotivoRejeicao,
		Rfc: data.Rfc,
		Status: "90"
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
}

function action_all_fatura(status, comments, motivos) {
	set_busy_global(true);
	var retorno = "";
	for (var i = 0; i < data_fatura.length; i++) {
		set_busy_global(true);
		var sendLine = {
			CodigoEmpresa: det_forn.Codigo,
			Laufd: det_forn.Laufd,
			Laufi: det_forn.Laufi,
			Lifnr: det_forn.Lifnr,
			Fatura: data_fatura[i].Fatura,
			Ano: data_fatura[i].Ano,
			Rfc: data_fatura[i].Rfc,
			Comentarios: comments,
			Status: status,
			MotivoRejeicao: motivos
		};
		var oModel_d = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFI_AP_PAG_SRV");
		oModel_d.setHeaders({
			"X-Requested-With": "X"
		});
		oModel_d.create("/DadosPorFaturaSet", sendLine, null, function(data, response) {
			retorno = data.Retorno;
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
}

function action_all_fornecedor(status, comments, motivos) {
	var retorno = "";
	for (var i = 0; i < data_fornecedor.length; i++) {
		set_busy_global(true);
		var sendLine = {
			CodigoEmpresa: det_prop.Codigo,
			Laufd: det_prop.Laufd,
			Laufi: det_prop.Laufi,
			Lifnr: data_fornecedor[i].Lifnr,
			Status: status,
			Comentarios: comments,
			Rfc: det_prop.Rfc,
			MotivoRejeicao: motivos
		};
		var oModel_d = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFI_AP_PAG_SRV");
		oModel_d.setHeaders({
			"X-Requested-With": "X"
		});
		oModel_d.create("/DadosPorFornecedorSet", sendLine, null, function(data, response) {
			retorno = data.Retorno;
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
}

function action_all_proposta(status, comments, motivos) {
	set_busy_global(true);
	var oTable = det_comp.getView().byId("propostasTable");
	var aItems = oTable.getItems();
	var retorno = "";
	for (var i = 0; i < aItems.length; i++) {
		set_busy_global(true);
		//var cells = aItems[i].getCells();

		//var proposta = cells[1].getProperty("title");
		//var lv_laufd = text_to_laufd(proposta.split(" / ")[0]);
		//var lv_laufi = proposta.split(" / ")[1];

		var data = data_proposta[i];
		var lv_laufd = data.Laufd;
		var lv_laufi = data.Laufi;
		var lv_lock_flag = data.LockFlag;
		var lv_aprovar = data.Aprovar;

		if (!lv_lock_flag && lv_aprovar) {
			//if (cells[6].getVisible()) {
			var sendLine = {
				CodigoEmpresa: det_comp.Codigo,
				Laufd: lv_laufd,
				Laufi: lv_laufi,
				Status: status,
				Comentarios: comments,
				Rfc: data.Rfc,
				MotivoRejeicao: motivos
			};
			var oModel_d = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFI_AP_PAG_SRV");
			oModel_d.setHeaders({
				"X-Requested-With": "X"
			});
			oModel_d.create("/DadosPorPropostaSet", sendLine, null, function(data, response) {
				retorno = data.Retorno;
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
		} else {
			set_busy_global(false);
			load_model_empresa(det_comp);
		}
	}
}

function action_all_proposta_mobile(status, comments, motivos) {
	set_busy_global(true);
	var oTable = det_comp_mobile.getView().byId("propostasTableMobile");
	var aItems = oTable.getItems();
	var retorno = "";
	for (var i = 0; i < aItems.length; i++) {
		set_busy_global(true);
		//var cells = aItems[i].getCells();

		//var proposta = cells[1].getProperty("title");
		//var lv_laufd = text_to_laufd(proposta.split(" / ")[0]);
		//var lv_laufi = proposta.split(" / ")[1];
		var data = data_proposta[i];
		var lv_laufd = data.Laufd;
		var lv_laufi = data.Laufi;
		var lv_lock_flag = data.LockFlag;
		var lv_aprovar = data.Aprovar;

		if (!lv_lock_flag && lv_aprovar) {
			//if (cells[6].getVisible()) {
			var sendLine = {
				CodigoEmpresa: det_comp_mobile.Codigo,
				Laufd: lv_laufd,
				Laufi: lv_laufi,
				Status: status,
				Comentarios: comments,
				Rfc: data.Rfc,
				MotivoRejeicao: motivos
			};
			var oModel_d = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFI_AP_PAG_SRV");
			oModel_d.setHeaders({
				"X-Requested-With": "X"
			});
			oModel_d.create("/DadosPorPropostaSet", sendLine, null, function(data, response) {
				retorno = data.Retorno;
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
		} else {
			set_busy_global(false);
			load_model_empresa_mobile(det_comp_mobile);
		}
	}
}

function get_dados_outras_propostas(data, view) {
	var content = view.getContent();
	var oTable = content[0];
	oTable.setBusy(true);

	var filters = new Array();
	var filterItem = new sap.ui.model.Filter("CodigoEmpresa", sap.ui.model.FilterOperator.EQ, det_forn.Codigo);
	filters.push(filterItem);
	filterItem = new sap.ui.model.Filter("Laufd", sap.ui.model.FilterOperator.EQ, det_forn.Laufd);
	filters.push(filterItem);
	filterItem = new sap.ui.model.Filter("Laufi", sap.ui.model.FilterOperator.EQ, det_forn.Laufi);
	filters.push(filterItem);
	filterItem = new sap.ui.model.Filter("Fatura", sap.ui.model.FilterOperator.EQ, data.Fatura);
	filters.push(filterItem);
	filterItem = new sap.ui.model.Filter("Ano", sap.ui.model.FilterOperator.EQ, data.Ano);
	filters.push(filterItem);
	filterItem = new sap.ui.model.Filter("Rfc", sap.ui.model.FilterOperator.EQ, data.Rfc);
	filters.push(filterItem);

	var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFI_AP_PAG_SRV");
	oModel.read(
		"/OutrasPropostasSet", {
			filters: filters,
			success: function(oData, oResponse) {

				var aData = oData.results;
				oTable.removeAllItems();
				for (var i = 0; i < aData.length; i++) {
					var oColumn = new sap.m.ColumnListItem({
						cells: [
							new sap.m.ObjectIdentifier({
								title: aData[i].LaufdStr + " / " + aData[i].Laufi
							}),
							new sap.m.Image({
								src: aData[i].StatusSrc
							}),
							new sap.m.ObjectIdentifier({
								title: aData[i].Status
							}),
							new sap.m.ObjectIdentifier({
								title: aData[i].User,
								text: aData[i].NameUser
							}),
							new sap.m.ObjectIdentifier({
								title: aData[i].Comment
							})
						]
					});
					oTable.addItem(oColumn);
				}
				oTable.setBusy(false);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus, errorThrown);
				oTable.setBusy(false);
			}
		}
	);
}

function set_busy_global(opcao) {
	if (opcao) {
		sap.ui.core.BusyIndicator.show();
	} else {
		sap.ui.core.BusyIndicator.hide();
	}
}

function valida_filtro_historico_user(aData) {
	var aData_new = [];
	var lv_erro = 0;
	for (var i = 0; i < aData.length; i++) {
		lv_erro = 0;
		if (controller_historico_user.FiltroEmpresa !== "") {
			if ((aData[i].CodigoEmpresa.toUpperCase().indexOf(controller_historico_user.FiltroEmpresa.toUpperCase()) === -1) && (aData[i].DescEmpresa
					.toUpperCase().indexOf(controller_historico_user.FiltroEmpresa.toUpperCase()) === -1)) {
				lv_erro++;
			}
		}

		if (controller_historico_user.FiltroData !== "") {
			if (aData[i].LaufdStr.toUpperCase().indexOf(controller_historico_user.FiltroData.toUpperCase()) === -1) {
				lv_erro++;
			}
		}

		if (controller_historico_user.FiltroCodigo !== "") {
			if (aData[i].Laufi.toUpperCase().indexOf(controller_historico_user.FiltroCodigo.toUpperCase()) === -1) {
				lv_erro++;
			}
		}

		if (lv_erro === 0) {
			aData_new.push(aData[i]);
		}
	}
	return aData_new;
}

function valida_filtro_historico_completo(aData) {
	var aData_new = [];
	var lv_erro = 0;
	for (var i = 0; i < aData.length; i++) {
		lv_erro = 0;
		if (controller_historico_completo.FiltroEmpresa !== "") {
			if ((aData[i].CodigoEmpresa.toUpperCase().indexOf(controller_historico_completo.FiltroEmpresa.toUpperCase()) === -1) && (aData[i].DescEmpresa
					.toUpperCase().indexOf(controller_historico_completo.FiltroEmpresa.toUpperCase()) === -1)) {
				lv_erro++;
			}
		}

		if (controller_historico_completo.FiltroData !== "") {
			if (aData[i].LaufdStr.toUpperCase().indexOf(controller_historico_completo.FiltroData.toUpperCase()) === -1) {
				lv_erro++;
			}
		}

		if (controller_historico_completo.FiltroCodigo !== "") {
			if (aData[i].Laufi.toUpperCase().indexOf(controller_historico_completo.FiltroCodigo.toUpperCase()) === -1) {
				lv_erro++;
			}
		}

		if (lv_erro === 0) {
			aData_new.push(aData[i]);
		}
	}
	return aData_new;
}