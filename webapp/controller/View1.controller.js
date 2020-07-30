sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/model/json/JSONModel',
	'sap/ui/export/Spreadsheet',
	'sap/m/MessageToast'
], function(Controller, JSONModel, Spreadsheet, MessageToast) {
	"use strict";

	return Controller.extend("zsmktest1zsmk_test1.controller.View1", {

		createColumnConfig: function() {
			return [{
				label: 'Deal #',
				property: 'Dealno',
				type: 'number',
				scale: 0
			}, {
				label: 'Trader',
				property: 'Trader',
				width: '25'
			}, {
				label: 'Deal Type',
				property: 'DealType',
				width: '25'
			}, {
				label: 'Deal Date',
				property: 'DealDate',
				type: 'Date'
			}, {
				label: 'Variant',
				property: 'Variant',
				type: 'string'
			}];
		},

		onExport: function() {
			var aCols, aProducts, oSettings, oSheet;
			var listBinding = this.byId("__list0").getBinding("items");

			aCols = this.createColumnConfig();
			aProducts = this.getView().getModel().getProperty('/');

			oSettings = {
				workbook: {
					columns: aCols
				},
				dataSource: {
					type: "OData",
					useBatch: true,
					serviceUrl: listBinding.getModel().sServiceUrl,
					headers: listBinding.getModel().getHeaders(),
					dataUrl: listBinding.getDownloadUrl(),
					// includes the $expand param.
					/*E.g.*/
					count: listBinding.getLength(), // usually: listBinding.getLength()
					/*E.g.*/
					// sizeLimit: 5
				},
				worker: true // should be false if mock server or CSP enabled
			};

			oSheet = new Spreadsheet(oSettings);

			oSheet.onprogress = function(iValue) {
				console.log("Export: %" + iValue + " completed");
			};
			oSheet.build()
				.then(function() {
					MessageToast.show('Spreadsheet export has finished');
				})
				// .finally(function() {
				// 	oSheet.destroy();
				// })
				.catch(function(sMessage) {
					console.log(sMessage);
				});
		},
		onDataReceived: function() {
			this.byId("__list0").setBusy(false);
			this.byId("exportButton").setEnabled(true);
			setTimeout(function(){ this.byId("exportButton").focus();});
		},

	});
});