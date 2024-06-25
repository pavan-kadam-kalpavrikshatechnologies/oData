sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("sap.kt.odata.odata.controller.View1", {
            onInit: function () {
                this.localModel = [];
                var oModel = new sap.ui.model.json.JSONModel(this.localModel)
                this.getView().setModel(oModel, "localModel")

                this.num=1;
                this.num1=11;
            },

            handlePress: function (oEvent) {
                var sPath = oEvent.getSource().getBindingContext().getObject().ID;
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteView2", {
                    ID: sPath
                });
            },
            handleCountPress: function (oEvent) {
                var sCategoryId = oEvent.getSource().getBindingContext().getProperty().ID;
                var oModel3 = this.getView().getModel();
                var sPath = "/Categories(" + sCategoryId + ")/Products/$count";

                oModel3.read(sPath, {
                    success: function (iCount) {
                        sap.m.MessageToast.show("Number of products in this category: " + iCount);
                    },
                    error: function () {
                        sap.m.MessageToast.show("Error");
                    }
                })
            },
            onPressProduct: function () {
                var oModel = this.getOwnerComponent().getModel();
                var data = this.getView().byId("ID").getValue();
                console.log("Product ID:", data);

                var url = "/Products";

                oModel.read(url, {
                    filters: [new sap.ui.model.Filter("ID", sap.ui.model.FilterOperator.EQ, data)],
                    success: function (oData) {
                        if (oData.results.length > 0) {
                            var productName = oData.results[0].Name;
                            sap.m.MessageToast.show("This is Product Name: " + productName);
                        } else {
                            sap.m.MessageToast.show("This is Product No Data")
                        }

                    }.bind(this),
                    error: function (error) {

                    }
                });
            },
            onPressProduct2: function () {
                var oView = this.getView();
                var ID = this.getView().byId("ID2").getValue();
                var url = "/Categories";
                var oModel = this.getOwnerComponent().getModel();
                var oFilter = new sap.ui.model.Filter("ID", sap.ui.model.FilterOperator.EQ, ID)

                oModel.read(url, {

                    filters: [oFilter],
                    urlParameters: { "$expand": "Products" },
                    success: function (oData) {
                        //    oData.results.forEach(result => {
                        //     result.Products.sort((a,b)=>{
                        //         return b.ID - a.ID
                        //     })
                        //    });

                        oData.results[0].Products = oData.results[0].Products.sort((a, b) => {
                            return b.ID - a.ID
                        })
                        var jsonData = new sap.ui.model.json.JSONModel(oData.results[0].Products);
                        this.getView().setModel(jsonData, "modelData");

                        if (!this.oDialog) {
                            this.oDialog = sap.ui.core.Fragment.load({
                                name: "sap.kt.odata.odata.fragment.second",
                                controller: this
                            }).then(function (oDialog) {
                                this.oDialog = oDialog;
                                oView.addDependent(this.oDialog);
                                this.oDialog.open();
                            }.bind(this));
                        } else {
                            this.oDialog.open();
                        }
                    }.bind(this),
                    error: function (error) {
                        console.log(error);
                    }
                });

            },

            onPressClose2: function () {
                this.oDialog.close();
            },


            // This part start the create function

            OnPressCreate: function () {
                var oView = this.getView()
                if (!this.oThree) {
                    this.oThree = sap.ui.core.Fragment.load({
                        name: "sap.kt.odata.odata.fragment.three",
                        controller: this
                    }).then(function (oThree) {
                        this.oThree = oThree;
                        oView.addDependent(this.oThree);
                        this.oThree.open();
                        var ID = this.byId("listID").getItems().length + 1
                        var inputControl = sap.ui.getCore().byId("InputID");
                        console.log(inputControl);
                        if (inputControl) {
                            inputControl.setValue(ID);
                            console.log("Value set successfully.");
                        } else {
                            console.log("Input control with ID 'InputID' not found.");

                        }
                    }.bind(this));
                } else {
                    this.oThree.open();
                    sap.ui.getCore().byId("InputID").setValue("")
                    sap.ui.getCore().byId("InputName").setValue("")
                }
            },
            threePressclose: function () {
                this.oThree.close()
            },
            threePressSave: function () {
                var input = sap.ui.getCore().byId("InputName").getValue()
                if (input === "") {
                    sap.ui.getCore().byId("InputName").setValueState("Error");
                    sap.ui.getCore().byId("InputName").setValueStateText("Enter the Value");
                } else {
                    var oModel = this.getOwnerComponent().getModel()
                    var ID = this.byId("listID").getItems().length + 1

                    var jsonData = {
                        "ID": ID,
                        "Name": input
                    }

                    oModel.bUseBatch = false
                    oModel.create("/Categories", jsonData, {
                        success: function (oData) {
                            this.getOwnerComponent().getModel().refresh();
                            sap.m.MessageBox.success("Created Successfully")
                            this.oDialog.close();
                        }.bind(this),
                        error: function (oError) {
                            sap.m.MessageBox.error("Failed")
                        }
                    })
                }
            },





            onPressAddProduct: function () {
                var oView = this.getView()
                if (!this.products) {
                    this.products = sap.ui.core.Fragment.load({
                        name: "sap.kt.odata.odata.fragment.four",
                        controller: this
                    }).then(function (products) {
                        this.products = products;
                        oView.addDependent(this.products);
                        this.products.open();
                        var ID = this.byId("listID").getItems().length + 1
                        var inputControl = sap.ui.getCore().byId("InputID");
                        console.log(inputControl);
                        if (inputControl) {
                            inputControl.setValue(ID);
                            console.log("Value set successfully.");
                        } else {
                            console.log("Input control with ID 'InputID' not found.");

                        }
                    }.bind(this));
                } else {
                    this.products.open();
                }
            },
            OnAddSave: function () {
                var oModel1 = this.getView().getModel("localModel");
                var data = oModel1.getProperty("/");
                var ID1 = this.byId("listID").getItems().length + 1;

                var ID = ID1*10 +  this.num;
                this.num++;
                
                var ID2 = ID1*100 + this.num1;
                this.num1 += 11

                data.push({
                    "ID": ID2,
                    "Name": "",
                    "Description": "",
                    "ReleaseDate": "",
                    "DiscontinuedDate": "",
                    "Price": "",
                    "Rating": "",
                    "Supplier": {
                        "ID": ID,
                        "Name": "",
                        "Address": {
                            "City": "",
                            "State": "",
                            "ZipCode": "",
                            "Country": ""
                        }
                    }
                })
                oModel1.refresh();
            },
            FourPressSave: function () {
                var category = sap.ui.getCore().byId("category").getValue();
                if (category === "") {
                    sap.ui.getCore().byId("category").setValueState("Error");
                    sap.ui.getCore().byId("category").setValueStateText("Enter the Value");
                } else {
                    var ID = this.byId("listID").getItems().length + 1;

                    
                    var products = [];
                    var oModel = this.getView().getModel("localModel");

                    for (var i = 0; i < oModel.getData().length; i++) {
                        var inputId = oModel.getData()[i].ID + "1" + 1;
                        console.log(inputId);
                        var inputName = oModel.getData()[i].Name;
                        var inputDesc = oModel.getData()[i].Description;
                        var inputRelease = oModel.getData()[i].ReleaseDate;
                        var inputDisco = oModel.getData()[i].DiscontinuedDate;
                        var inputPrice = oModel.getData()[i].Price;
                        var inputRating = oModel.getData()[i].Rating;
                        // var inputID2 = oModel.getData()[i].Supplier.ID;
                        var inputName2 = oModel.getData()[i].Supplier.Name;
                        var inputCity = oModel.getData()[i].Supplier.Address.City;
                        var inputStreet = oModel.getData()[i].Supplier.Address.Street;
                        var inputState = oModel.getData()[i].Supplier.Address.State;
                        var inputZipCode = oModel.getData()[i].Supplier.Address.ZipCode;
                        var inputCountry = oModel.getData()[i].Supplier.Address.Country;

                        products.push({
                            "ID": parseInt(inputId),
                            "Name": inputName,
                            "Description": inputDesc,
                            "ReleaseDate": inputRelease,
                            "DiscontinuedDate": inputDisco,
                            "Price": inputPrice,
                            "Rating": parseInt(inputRating),
                            "Supplier": {
                                // "ID": parseInt(inputID2),
                                "Name": inputName2,
                                "Address": {
                                    "Street": inputStreet,
                                    "City": inputCity,
                                    "State": inputState,
                                    "ZipCode": inputZipCode,
                                    "Country": inputCountry
                                }
                            }
                        });
                    }

                    var oModel = this.getOwnerComponent().getModel();

                    var jsonmodel = {
                        "ID": ID,
                        "Name": category,
                        "Products": products
                    };

                    oModel.bUseBatch = false;
                    oModel.create("/Categories", jsonmodel, {
                        success: (oData) => {
                            this.getOwnerComponent().getModel().refresh();
                            sap.m.MessageBox.success("Created successfully");
                            this.products.close();
                        },
                        error: (error) => {
                            console.log(error);
                            sap.m.MessageBox.error("Failed");
                        }
                    });
                }
            },
            fourPressclose: function() {
                this.oThree.close();
            },
            OnDeleteMethodView1: function (oEvent) {
                var sPath = oEvent.getSource().getBindingContext().getObject().ID;
                var sPath2 = "/Categories("+sPath+")"
                var oModel = this.getOwnerComponent().getModel()
                oModel.bUseBatch = false;
                oModel.remove(sPath2, {
                    success: (oData) => {
                        sap.m.MessageBox.success("Deleted successfully");
                        console.log(oData);
                    },
                    error: (error) => {
                        sap.m.MessageBox.error("Failed");
                        console.log(error);
                    }
                })
            },
            onUpdateIconView1 : function(oEvent){
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
                    sap.ui.getCore().byId("categories").setValue(name)
                }
            },
            updatePressclose : function(){
                this.oUpdate.close();
            },
            updatePressSave : function(){
                var sPath = this.sPath
                console.log(sPath);
                var oModel = this.getOwnerComponent().getModel()
                var name = sap.ui.getCore().byId("categories").getValue()
                var payload = {
                    "Name":name
                }
                oModel.bUseBatch = false;
                oModel.update(sPath,payload,{
                    success:function(oData){
                        console.log(oData);
                        sap.m.MessageBox.success("Updated Successfully !")
                        this.getOwnerComponent().getModel().refresh();
                        this.oUpdate.close();
                    }.bind(this),
                    error:function(error){
                        sap.m.MessageBox.error("Failed to update",error)
                    }
                })
            }
        });
    });

    