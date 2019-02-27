/*jshint undef: false, unused: false, indent: 2*/
/*global angular: false */

'use strict';

var app = angular.module('demoApp', ['multi-select-tree', 'ui.bootstrap', 'cgNotify']);

app.controller('demoAppCtrl', function ($http, $scope, $modal, notify) {
        $scope.openDialog = function (name, show) {
            $scope.appName = name;
            $scope.show = show;
            var modalInstance = $modal.open({
                templateUrl: 'edit.jsp?v=' + new Date().getTime(),
                controller: OpenEditDialog,
                scope: $scope,
                size: 'lg'
            });
        };

        $scope.closeApp = function (name, flag) {
            if (flag == 1) {
                flag = 0;
            } else {
                flag = 1;
            }
            $http.get('/workbench/change?name=' + name + "&flag=" + flag, null).success(function (data) {
                if (data.success) {
                    $chengyun.notify.success(notify, '恭喜你设置成功');
                    $scope.flush();
                } else {
                    $chengyun.notify.success(notify, '设置失败，原因：' + data);
                }
            }).error(function (data) {
                $chengyun.notify.success(notify, '设置失败，原因：' + data);
            })
        }

        $scope.fun = function (e) {
            var search = $("#search").val();
            return e.title.indexOf(search) || e.url.indexOf(search) || e.summary.indexOf(search);
        }

        $scope.initRight = function () {
            var data = JSON.parse(sessionStorage.getItem("data")).data;
            $scope.appInfo = data;
            $scope.appList = [];
            $scope.pattern=sessionStorage.getItem("pattern");
            if($scope.pattern==undefined){
                $scope.pattern = 1;
                sessionStorage.setItem("pattern",$scope.pattern);
            }
            if($scope.pattern == true){
                document.getElementById('simple').innerText = '简易模式';
            }else {
                document.getElementById('simple').innerText = '正常模式';
            }

            var length = $scope.length = JSON.parse(sessionStorage.getItem("data")).data.length;
            $scope.totalItems = length;
            for (var i = 0; i < length; i++) {
                if ($scope.appInfo[i].admin == true) {
                    data[i].description.adminFlag = true;
                    data[i].description.show = false;
                } else if ($scope.appInfo[i].superAdmin == true) {
                    $scope.superAdminFlag = true;
                    data[i].description.show = true;
                }
                if ($scope.appInfo[i].flag == 1) {
                    data[i].description.flag = 1;
                } else if ($scope.appInfo[i].flag == 0) {
                    data[i].description.flag = 0;
                }

                data[i].description.type = $scope.appInfo[i].type;
                $scope.appList.push(data[i].description);
                $scope.order = "index";
            }
        }


        $scope.deleteApp = function (name) {
            DingTalkPC.device.notification.confirm({
                message: "确认是否删除？",
                title: "提示",
                buttonLabels: ['是', '不是'],
                onSuccess: function (result) {
                    if(result.buttonIndex==0){
                        $http.get('/workbench/delete?name=' + name, null).success(function (data) {
                            if (data.success) {
                                $chengyun.notify.success(notify, '删除成功');
                                $scope.flush();
                            } else {
                                $chengyun.notify.danger(notify, '删除失败，原因：' + data);
                            }
                        }).error(function (data) {
                            $chengyun.notify.danger(notify, '删除失败，原因：' + data);
                        })
                    }

                },
                onFail: function (err) {
                }
            });

        }

        $scope.go_to = function (url) {
            DingTalkPC.runtime.permission.requestAuthCode({
                corpId: 'ding789c4e68684e3f26',
                onSuccess: function (info) {
                    DingTalkPC.biz.util.openLink({
                        url: url.indexOf("?") != -1
                            ? (url + '&code=' + info.code)
                            : (url + '?code=' + info.code),
                        onSuccess: function (result) {
                            //
                        },
                        onFail: function () {
                            //
                        }
                    });
                }
            });
        }

        $scope.openSetRight = function () {
            $http.get('/workbench/show/right',null).success(function (data) {
                if(data.success){
                    var data = sessionStorage.setItem("data",JSON.stringify(data));
                    window.location.href="/h5.jsp";
                }else{
                    $chengyun.notify.danger(notify,"初始化失败，原因："+data);
                }
            }).error(function (data) {
                $chengyun.notify.danger(notify,"初始化失败，原因："+data);
            });
        }

        $scope.openAddAdmin = function () {
            var modalInstance = $modal.open({
                templateUrl: 'addAdmin.jsp?v=' + new Date().getTime(),
                controller: OpenAddAdminDialog,
                scope: $scope,
                size: 'lg'
            });
        }

        $scope.flush = function () {
            $http.get('/workbench/flush', null).success(function (data) {
                if (data.success) {
                    sessionStorage.setItem("data", JSON.stringify(data));
                    location.href = "/h5.jsp";
                } else {
                    $chengyun.notify.warning(notify, "刷新出现异常，原因：" + data);
                }
            }).error(function (data) {
                $chengyun.notify.warning(notify, "刷新出现异常，原因：" + data);
            })
        }

        $scope.simple = function () {
            var buttonValue= document.getElementById('simple').innerText;
            if(buttonValue=='简易模式'){
                document.getElementById('simple').innerText = '正常模式';
                $scope.pattern = 0;
                sessionStorage.setItem("pattern",$scope.pattern);
            }else{
                document.getElementById('simple').innerText = '简易模式';
                $scope.pattern = 1;
                sessionStorage.setItem("pattern",$scope.pattern);
            }

        }
        function OpenAddAdminDialog($scope, $modalInstance, $http, notify) {
            $scope.cancel = function () {
                $modalInstance.close();
            };

            $scope.addAdminSummit = function () {
                var title = $("#title").val();
                var url = $("#url").val();
                var small = $("#small").val();
                var summary = $("#summary").val();
                var filePath = $("#filePath").val();
                var index = $("#index").val();
                var type = $("input[name='type']:checked").val();

                if (title == undefined || title == '') {
                    $chengyun.notify.warning(notify, '请填写应用标题');
                    return;
                }
                if (url == undefined || url == '') {
                    $chengyun.notify.warning(notify, '请填写应用链接');
                    return;
                }

                if (summary == undefined || summary == '') {
                    $chengyun.notify.warning(notify, '请填写应用描述');
                    return;
                }

                if(filePath==undefined){
                    filePath = '';
                }
                if(index==undefined || index==''){
                    index = 10;
                }
                //拼接json到后台进行插入
                var description = "{\"title\":\"" + title + "\",\"url\":\"" + url + "\",\"small\":\"" + small +
                    "\",\"summary\":\"" + summary + "\",\"pic_url\":\"" + filePath + "\",\"index\":\"" + index + "\"}";
                $http.get('/workbench/save?description=' + description + "&name=" + title + "&type=" + type, null).success(function (data) {
                    if (data.success) {
                        $chengyun.notify.success(notify, '设置成功');
                    } else {
                        $chengyun.notify.danger(notify, '设置失败，原因：' + data);
                    }

                }).error(function (data) {
                    $chengyun.notify.danger(notify, '设置失败，原因：' + data);

                })

            }
        }

        function OpenEditDialog($scope, $modalInstance, $http, notify) {
            $scope.cancel = function () {
                $modalInstance.close();
            };

            $scope.editSub = function () {
                $("#div1").hide();
                $scope.addFlag = true;
                $("#subAdmin").attr("disabled", false);
            }

            $scope.add = function () {
                var sub_admin = $("#subAdmin").val();
                $http.get('/workbench/update?name=' + $scope.appName + "&sub_admin=" + sub_admin, null).success(function (data) {
                    if (data.success) {
                        // $scope.flush();
                        $chengyun.notify.success(notify, "设置成功");
                    } else {
                        $chengyun.notify.danger(notify, '设置失败，原因：' + data);
                    }

                }).error(function (data) {
                    $chengyun.notify.danger(notify, '设置失败，原因：' + data);
                })
            }

            var data1 = [];
            var data3 = [];
            $scope.data = [];
            $scope.data3 = [];
            $scope.departments = [];
            $scope.positions = [];
            $scope.right = [];
            var inx = 0;
            $scope.initDemo = function () {
                $scope.array = [];
                $scope.addFlag = false;
                $http.get('/workbench/get/name?name=' + $scope.appName, null).success(function (data) {
                        if (data.success) {
                            $scope.workbench = data.data;
                            var app = $scope.app = eval(data.data).description;
                            $("#title").val(JSON.parse(app).title);
                            $("#url").val(JSON.parse(app).url);
                            $("#small").val(JSON.parse(app).small);
                            $("#summary").val(JSON.parse(app).summary);
                            $("#filepath").val(JSON.parse(app).pic_url);
                            $("#index").val(JSON.parse(app).index);
                            if ($scope.workbench != null) {
                                if (eval($scope.workbench).json.length != 4 &&eval($scope.workbench).json.length!=0) {
                                    $scope.right.push(eval($scope.workbench).json);
                                }
                                if (eval($scope.workbench).sub_admin != null) {
                                    $scope.sub_admins = eval($scope.workbench).sub_admin;
                                }
                            }
                            $("#names").val($scope.names);
                            $("#subAdmin").val($scope.sub_admins);

                            $http.get('department/list/bigDepartment', null).success(function (data) {
                                if (data.success) {
                                    $scope.data = eval(data.data);
                                    var departments = eval(data.data);
                                    for (var i = 0; i < departments.length; i++) {
                                        var obj = {
                                            id: i,
                                            name: departments[i],
                                            selected: false
                                        };
                                        data1.push(obj);
                                    }
                                    $scope.departments.push(angular.copy(data1));
                                } else {
                                    $chengyun.notify.danger(notify, '初始化失败，原因：' + data);

                                }

                                $http.get('position/list', null).success(function (data) {
                                    if (data.success) {
                                        $scope.data3=eval(data.data);
                                        var positions = eval(data.data);
                                        for (var i = 0; i < positions.length; i++) {
                                            var obj = {
                                                id: i,
                                                name: positions[i],
                                                selected: false
                                            };
                                            data3.push(obj);
                                        }
                                        $scope.positions.push(angular.copy(data3));

                                        if ($scope.right.length == 0) {
                                            $scope.array.push({
                                                departmentData: $scope.departments,
                                                positionData: $scope.positions,
                                                names: '',
                                                id: 'names0'
                                            });
                                        } else {
                                            //初始化设置部门、职位和姓名的div
                                            var rightArr = eval($scope.right[0]);
                                            var rightLen = rightArr.length;
                                            for (var h = 0; h < rightLen; h++) {
                                                var departmentInit = [];
                                                var departmentArr = [];
                                                var positionInit = [];
                                                var positionArr = [];
                                                var dataSize = $scope.data.length;
                                                var data3Size = $scope.data3.length;
                                                var num0 = rightLen * dataSize + 1;
                                                var num1 = rightLen * data3Size + 1;
                                                for (var i = 0; i < dataSize; i++) {
                                                    //判断上次的选择
                                                    var selected = false;
                                                    if (rightArr[h].departmentNames != '' && rightArr[h].departmentNames.indexOf($scope.data[i])!=-1) {
                                                        selected = true;
                                                    }
                                                    var obj0 = {
                                                        id: 'department' + num0++,
                                                        name: $scope.data[i],
                                                        selected: selected
                                                    };
                                                    departmentInit.push(obj0);


                                                }
                                                departmentArr.push(departmentInit);
                                                for (var i = 0; i < data3Size; i++) {
                                                    var selected = false;
                                                    if (rightArr[h].positions != '' && rightArr[h].positions.indexOf($scope.data3[i])!=-1) {
                                                        selected = true;
                                                    }
                                                    var obj1 = {
                                                        id: 'position' + num1++,
                                                        name: $scope.data3[i],
                                                        selected: selected
                                                    };
                                                    positionInit.push(obj1);
                                                }
                                                positionArr.push(positionInit);
                                                $scope.array.push({
                                                    departmentData: departmentArr,
                                                    positionData: positionArr,
                                                    names: rightArr[h].names,
                                                    id: 'names' + h
                                                });
                                                inx = $scope.array.length;
                                            }
                                        }
                                    } else {
                                        $chengyun.notify.danger(notify, '初始化失败，原因：' + data);
                                    }
                                }).error(function (data) {
                                    $chengyun.notify.danger(notify, '初始化失败，原因：' + data);
                                });


                            }).error(function (data) {
                                $chengyun.notify.danger(notify, '初始化失败，原因：' + data);

                            });

                        }

                    }
                )


            }

            $scope.modify = function () {
                var title = $("#title").val();
                var url = $("#url").val();
                var small = $("#small").val();
                var summary = $("#summary").val();
                var filePath = $("#filePath").val();
                if (filePath == undefined) {
                    filePath = JSON.parse($scope.app).pic_url;
                }
                var index = $("#index").val();

                if(index==undefined || index==''){
                    index = 10;
                }
                //拼接json到后台进行插入
                var description = "{\"title\":\"" + title + "\",\"url\":\"" + url + "\",\"small\":\"" + small +
                    "\",\"summary\":\"" + summary + "\",\"pic_url\":\"" + filePath + "\",\"index\":\"" + index+ "\"}";
                $http.get('/workbench/update/name?description=' + description + "&appName=" + JSON.parse($scope.app).title + "&name=" + title, null).success(function (data) {
                    if (data.success) {
                        $chengyun.notify.success(notify, '更新应用信息成功');
                        $scope.appName = $("#title").val();
                        // $scope.cancel();
                    } else {
                        $chengyun.notify.danger(notify, '更新应用信息失败，原因：' + data);

                    }

                }).error(function (data) {
                    $chengyun.notify.danger(notify, '更新应用信息设置失败，原因：' + data);

                })


            }
            $scope.selectOnly1Or2 = function (item, selectedItems) {
                if (selectedItems !== undefined && selectedItems.length >= 100) {
                    return false;
                } else {
                    return true;
                }
            };


            $scope.addDiv = function () {
                inx++;
                var departmentInit = [];
                var departmentArr = [];
                var positionInit = [];
                var positionArr = [];
                var dataSize = $scope.data.length;
                var data3Size = $scope.data3.length;
                var num0 = inx * dataSize + 1;
                var num1 = inx * data3Size + 1;
                for (var i = 0; i < dataSize; i++) {
                    var obj0 = {
                        id: 'department' + num0++,
                        name: $scope.data[i],
                        selected: false
                    };
                    departmentInit.push(obj0);
                }
                departmentArr.push(departmentInit);

                for (var i = 0; i < data3Size; i++) {
                    var obj1 = {
                        id: 'position' + num1++,
                        name: $scope.data3[i],
                        selected: false
                    };
                    positionInit.push(obj1);
                }
                positionArr.push(positionInit);

                $scope.array.push({
                    departmentData: departmentArr,
                    positionData: positionArr,
                    names: '',
                    id: 'names' + (inx - 1)
                });
            }

            $scope.delDiv = function (idx) {
                inx--;
                $scope.array.splice(idx, 1);
            }

            $scope.submitEvent = function () {
                var select = [];
                for (var h = 0; h < $scope.array.length; h++) {
                    var names = $("#names" + h).val();
                    if (names == undefined) {
                        names = '';
                    }

                    var selectedItem1 = eval($scope.array[h].departmentSelected[0]);
                    var departmentNames = '';
                    for (var i = 0; i < selectedItem1.length; i++) {
                        departmentNames += eval(selectedItem1[i]).name + ",";
                    }
                    departmentNames = "\"departmentNames\":\"" + departmentNames.substring(0, departmentNames.length - 1) + "\"";
                    var selectedItem2 = eval($scope.array[h].positionSelected[0]);
                    var positions = '';
                    for (var i = 0; i < selectedItem2.length; i++) {
                        if (eval(selectedItem2[i]).name == "C++开发工程师") {
                            eval(selectedItem2[i]).name = "C%2B%2B开发工程师";
                        }
                        positions += eval(selectedItem2[i]).name + ",";
                    }
                    positions = "\"positions\":\"" + positions.substring(0, positions.length - 1) + "\"";

                    names = "\"names\":\"" + names + "\"";
                    var json = "{" + departmentNames + "," + positions + "," + names + "}";
                    select.push(json);
                }
                var str = "[" + select + "]";
                var name = $scope.appName;
                $http.get('/workbench/save?json=' + str + "&name=" + name, null).success(function (data) {
                    if (data.success) {
                        $scope.flush();
                        $scope.cancel();
                    }
                }).error(function (data) {
                    $chengyun.notify.danger(notify, '提交失败，原因：' + data);

                })
            }
        }
    }
);