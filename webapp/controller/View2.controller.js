sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("sap.kt.odata.odata.controller.View2", {
            onInit: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("RouteView2").attachMatched(this._onRouteMatched, this)
            },
            _onRouteMatched: function (oEvent) {

                var expID = oEvent.getParameter("arguments").ID;
                var oList = this.getView().byId("myTable");
                var oTemp = this.getView().byId("objectId")
                var url = "/Categories(" + expID + ")/Products"

                oList.bindItems(url, oTemp)
            },
            onPressClose: function () {
                this.oDialog.close();
            },
            handlePress: function (oEvent) {
                console.log(oEvent);
                var sSelectProduct = oEvent.getSource().getBindingContext().getObject().ID;
                console.log(sSelectProduct);
                var sPath = "/Products(" + sSelectProduct + ")/Supplier"
                var oModel = this.getOwnerComponent().getModel();
                oModel.read(sPath, {
                    success: function (oData) {
                        var oJsonModel = new sap.ui.model.json.JSONModel(oData);
                        this.getView().setModel(oJsonModel, "fragmentModel");
                        if (!this.oDialog) {
                            this.oDialog = sap.ui.core.Fragment.load({
                                name: "sap.kt.odata.odata.fragment.first",
                                controller: this
                            }).then(function (oDialog) {
                                this.oDialog = oDialog;
                                this.getView().addDependent(this.oDialog);
                                this.oDialog.open();
                            }.bind(this));
                        } else {
                            this.oDialog.open();
                        }
                    }.bind(this),
                    error: function (oError) {
                        console.log(oError);
                    }.bind(this)
                });
            },
            OnDeleteMethodView2: function (oEvent) {
                var sPath = oEvent.getParameter("listItem").getBindingContext().getPath();
                console.log(sPath);

                var oModel = this.getOwnerComponent().getModel();
                oModel.bUseBatch = false;
                oModel.remove(sPath, {
                    success: function (oData) {
                        sap.m.MessageBox.success("Deleted successfully");
                        this.getOwnerComponent().getModel().refresh();
                    }.bind(this),
                    error: function (error) {
                        console.log(error);
                        sap.m.MessageBox.error("Deletion failed: ");
                    }
                });
            },
            onUpdateIconView1: function (oEvent) {
                this.sPath = oEvent.getSource().getBindingContext().getPath();
                var name = oEvent.getSource().getBindingContext().getObject().Name
                var oView = this.getView()
                if (!this.oUpdate) {
                    this.oUpdate = sap.ui.core.Fragment.load({
                        name: "sap.kt.odata.odata.fragment.update",
                        controller: this
                    }).then(function (oUpdate) {
                        sap.ui.getCore().byId("categories").setValue(name)
                        this.oUpdate = oUpdate;
                        oView.addDependent(this.oUpdate);
                        this.oUpdate.open();
                    }.bind(this));
                } else {
                    this.oUpdate.open();
                    sap.ui.getCore().byId("categories").setValue("")
                }
            },
            OnUpdateMethodView2: function (oEvent) {
                this.sPath = oEvent.getSource().getBindingContext().getPath();
                var name = oEvent.getSource().getBindingContext().getObject().Name
                var desc = oEvent.getSource().getBindingContext().getObject().Description
                var rating = oEvent.getSource().getBindingContext().getObject().Rating
                var oView = this.getView()
                if (!this.oUpdateProduct) {
                    this.oUpdateProduct = sap.ui.core.Fragment.load({
                        name: "sap.kt.odata.odata.fragment.updateProduct",
                        controller: this
                    }).then(function (oUpdateProduct) {
                        this.oUpdateProduct = oUpdateProduct;
                        oView.addDependent(this.oUpdateProduct);
                        this.oUpdateProduct.open();
                        this.getOwnerComponent().getModel()
                        sap.ui.getCore().byId("productsname").setValue(name)
                        sap.ui.getCore().byId("desc").setValue(desc)
                        sap.ui.getCore().byId("rating").setValue(rating)
                    }.bind(this));
                } else {
                    this.oUpdateProduct.open();
                    this.getOwnerComponent().getModel()
                    sap.ui.getCore().byId("productsname").setValue(name)
                    sap.ui.getCore().byId("desc").setValue(desc)
                    sap.ui.getCore().byId("rating").setValue(rating)
                }
            },
            updatePresscloseView2: () => {
                this.oUpdateProduct.close();
            },
            updatePressSaveView2: function () {
                var sPath = this.sPath
                var oModel = this.getOwnerComponent().getModel()
                var name = sap.ui.getCore().byId("productsname").getValue()
                var desc = sap.ui.getCore().byId("desc").getValue()
                var rating = sap.ui.getCore().byId("rating").getValue()

                var oPayLoad = {
                    "Name": name,
                    "Description": desc,
                    "Rating": rating
                }
                oModel.bUseBatch = false;
                oModel.update(sPath, oPayLoad, {
                    success: function (oData) {
                        sap.m.MessageBox.success("Updated Successfully !")
                        this.getOwnerComponent().getModel().refresh()
                        this.oUpdateProduct.close();
                    }.bind(this),
                    error: function (error) {
                        sap.m.MessageBox.error("Failed Update !", error)
                    }
                })
            }
        });
    });
