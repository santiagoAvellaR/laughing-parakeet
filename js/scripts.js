function numericKeyboard() {
    var a = {
        restrict: "E",
        replace: !0,
        scope: {
            ngModel: "=",
            numberColorClass: "@",
            backgroundRemoveClass: "@",
            blockKeyboard: "="
        },
        controller: numericKeyboardController,
        templateUrl: "views/transversal/directiveNumericKeyboard.html"
    };
    return a
}
function numericKeyboardController(a) {
    a.setNumber = function(b) {
        a.blockKeyboard !== !0 && (null === a.ngModel ? a.ngModel += b + "" : a.ngModel.length < 4 && (a.ngModel += b + ""))
    }
    ,
    a.removeNumber = function() {
        var b = a.ngModel;
        a.blockKeyboard !== !0 && null !== b && (a.ngModel = b.substring(0, b.length - 1))
    }
}
angular.module("App", ["restangular", "noCAPTCHA", "ui.utils.masks", "vcRecaptcha"]).run(["$rootScope", "configTemplate", "configProvider", "$location", "messagesProvider", "Restangular", "$window", "$q", "utilsProvider", "configCountryProvider", "popupProvider", function(a, b, c, d, e, f, g, h, i, j, k) {
    function l(a, b) {
        var d = c.errorData;
        return "undefined" == typeof a.ResponseMessage ? (d.success = c.statusCode.fail,
        d.error.errorId = "",
        d.error.errorMessage = "") : (a.ResponseMessage.ResponseHeader.Status.StatusCode === c.statusCode.statusTrue ? (d.success = c.statusCode.success,
        d.data = a.ResponseMessage.ResponseBody.any[b]) : d.success = c.statusCode.fail,
        d.error.errorId = a.ResponseMessage.ResponseHeader.Status.StatusCode,
        d.error.errorMessage = a.ResponseMessage.ResponseHeader.Status.StatusDesc),
        d
    }
    function m() {
        var b = i.getParameterByName("region") || "co";
        a.configCountry = j[b] || j.co,
        a.hideCo = "co" === b,
        a.hidePa = "pa" === b
    }
    function n() {
        m()
    }
    a.i18n = e,
    a.sendData = {
        errorMessage: ""
    },
    a.hamburgerMenuState = "",
    a.isEmpty = function(a) {
        return "object" == typeof a && !Object.keys(a).length
    }
    ;
    var o = function() {
        var a = d.url().split("#");
        2 !== a.length && (a = d.url().split("%23"));
        var b = "";
        return a = a[0].split("/"),
        b = a.length > 1 ? a[1] : c.defaultVal.url
    };
    a.openMenu = function() {
        "" === a.hamburgerMenuState ? a.hamburgerMenuState = "active" : a.hamburgerMenuState = ""
    }
    ,
    a.getTemplate = function(a) {
        var d = b.template.transversal
          , e = c.folders.views + d + a;
        return e
    }
    ,
    a.getClassTemplate = function() {
        var a = b.classVal[o()];
        return "undefined" == typeof a && (a = b.classVal.defaultVal),
        a
    }
    ,
    a.getUrl = function() {
        var a = d.url().split("#");
        return 2 !== a.length && (a = d.url().split("%23")),
        a = a[0],
        "" === a && (a = c.defaultVal.views),
        c.folders.views + a + ".html"
    }
    ,
    a.setUrl = function(b, c) {
        d.url(b),
        a.sendData = c,
        g.scrollTo(0, 0)
    }
    ,
    f.setBaseUrl(c.baseService.url),
    f.setDefaultHeaders(c.baseService.header),
    f.setDefaultHttpFields({
        withCredentials: !0
    }),
    a.restangularService = function(b, d, e) {
        var g, h = c.messageBody;
        return 0 === e.length && (e = {}),
        d.service && d.service.version && "0.0.0" !== d.service.version && (h.RequestMessage.RequestHeader.Destination = {
            ServiceName: d.service.name,
            ServiceOperation: d.service.operation,
            ServiceRegion: a.configCountry.codigo.region,
            ServiceVersion: d.service.version
        }),
        h.RequestMessage.RequestBody.any = {},
        h.RequestMessage.RequestBody.any[d.rq] = e,
        g = f.all(d.url, h).withHttpConfig({
            timeout: c.setting.timeout
        }),
        b === c.typeRequest.post ? g.post(h) : b === c.typeRequest.get ? g.get(h) : void 0
    }
    ,
    a.jsonService = function(b, c, d) {
        var e = h.defer()
          , f = e.promise;
        return a.restangularService(b, c, d).then(function(b) {
            b && !a.isEmpty(b) ? e.resolve(l(b, c.rs)) : g.location.reload()
        }, function(a) {
            console.log("error " + a),
            e.reject(a)
        }),
        f
    }
    ,
    a.urlPSE = function() {
        return window.localStorage.getItem("UrlPSE")
    }
    ,
    a.getPSE = function() {
        if (null === window.localStorage.getItem("UrlPSE")) {
            var b = {
                id: 28
            };
            a.jsonService(c.typeRequest.post, c.urlServices.parameter, b).then(function(a) {
                window.localStorage.setItem(a.data.parameter[0].value, a.data.parameter[0].code)
            }, function(a) {
                console.log("error al obtener la url de pse")
            })
        }
    }
    ,
    n()
}
]),
angular.module("App").controller("homeController", ["$scope", "configProvider", "messagesProvider", "$rootScope", function(a, b, c, d) {
    function e() {
        window.location = d.configCountry.links.home
    }
    var f = this;
    f.email = "",
    f.captcha = "",
    f.sitekey = b.setting.sitekey,
    f.showEmail = !1,
    f.saveEmail = function() {
        var d = {};
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(f.email) ? (d = {
            recaptcha: f.captcha,
            email: f.email
        },
        a.jsonService(b.typeRequest.post, b.urlServices.saveEmail, d).then(function(a) {
            a.success ? f.showEmail = !0 : f.messageError = a.error.errorMessage
        })) : f.messageError = c.errorMessage.general.invalidEmail
    }
    ,
    e(),
    a.getPSE()
}
]),
angular.module("App").controller("loginController", ["$scope", "configProvider", "cypherProvider", "$location", "messagesProvider", "$window", "utilsProvider", "cookieProvider", "configCountryProvider", "popupProvider", function(a, b, c, d, e, f, g, h, i, j) {
    function k(a) {
        a.success ? f.location.href = b.login.success : l("response not success"),
        t.isLogin = !1
    }
    function l(a) {
        f.location.href = b.login.fail,
        t.isLogin = !1
    }
    function m() {
        if (t.messageError = g.getParameterByName("messageError"),
        t.unlockTime = g.getParameterByName("unlockTime"),
        t.unlockTimeIncremental = g.getParameterByName("unlockTimeIncremental"),
        t.changePassword = g.getParameterByName("changePassword"),
        t.unlockTime)
            window.localStorage.setItem("unlockTime", t.unlockTime);
        else if (window.localStorage.getItem("unlockTime")) {
            var a = window.localStorage.getItem("unlockTime")
              , b = Number(a);
            n(b),
            window.localStorage.removeItem("unlockTime")
        } else if (t.changePassword)
            window.localStorage.setItem("changePassword", t.changePassword);
        else if (window.localStorage.getItem("changePassword"))
            window.localStorage.getItem("changePassword"),
            p(),
            window.localStorage.removeItem("changePassword");
        else if (t.unlockTimeIncremental)
            window.localStorage.setItem("unlockTimeIncremental", t.unlockTimeIncremental);
        else if (window.localStorage.getItem("unlockTimeIncremental")) {
            var c = window.localStorage.getItem("unlockTimeIncremental")
              , d = Number(c);
            o(d),
            window.localStorage.removeItem("unlockTimeIncremental")
        }
    }
    function n(a) {
        var b = a;
        t.modalInfo = {
            title: e.unlockTime.modal.title,
            timerTitle: e.unlockTime.modal.timerTitle,
            description: e.unlockTime.modal.description,
            timer: b,
            type: "timer"
        },
        t.modalAction = t.cancelCard,
        setTimeout(function() {
            j.open({
                modalInfo: t.modalInfo,
                modalAction: t.modalAction,
                clearModal: t.clearModal
            })
        }, 1e3)
    }
    function o(a) {
        var b = a;
        t.modalInfo = {
            title: e.unlockTimeIncremental.modal.title,
            timerTitle: e.unlockTimeIncremental.modal.timerTitle,
            description: e.unlockTimeIncremental.modal.description,
            timer: b,
            type: "timerIncremental"
        },
        t.modalAction = t.cancelCard,
        setTimeout(function() {
            j.open({
                modalInfo: t.modalInfo,
                modalAction: t.modalAction,
                clearModal: t.clearModal
            })
        }, 1e3)
    }
    function p() {
        t.modalInfo = {
            title: e.changePassword.modal.title,
            description: e.changePassword.modal.description,
            button: e.changePassword.modal.button,
            type: "changePassword"
        },
        t.modalAction = t.cancelCard,
        setTimeout(function() {
            j.open({
                modalInfo: t.modalInfo,
                modalAction: t.modalAction,
                clearModal: t.clearModal
            })
        }, 1e3)
    }
    function q() {
        t.modalInfo = {
            title: e.views.blockAccount.panicMessage,
            text: e.views.blockAccount.confirmationMessage,
            button: e.views.blockAccount.title,
            img: e.views.blockAccount.img
        },
        t.modalAction = t.blockAccount
    }
    function r() {
        var a = window.location.href;
        a.match(b.recaptcha.matchPage);
        s(a),
        t.showCaptcha = !0;
        const d = document.getElementById("nequi-login-form");
        d.addEventListener("submit", function(a) {
            a.preventDefault();
            const b = document.getElementById("j_username")
              , e = document.getElementById("j_password")
              , f = document.getElementById("j_token")
              , g = c.encryptLogin(b.value, e.value, f.value);
            b.value = g.username,
            e.value = g.password,
            f.value = g.token,
            d.submit()
        })
    }
    function s(a) {
        var b = ""
          , c = new URLSearchParams(window.location.search)
          , d = Object.fromEntries(c.entries());
        d && d.region && (b = i[d.region].links.baseUrl),
        b && b !== a && (window.location = b)
    }
    var t = this;
    t.isLogin = !1,
    t.showCaptcha = !1,
    t.auth = {
        username: "",
        password: "",
        token: ""
    },
    t.selectCountry = a.configCountry.codigo.pais,
    t.messageError = null,
    t.unlockTime = null,
    t.unlockTimeIncremental = null,
    t.changePassword = null,
    t.selectOption = [{
        title: "57",
        image: "images/flag_colombia.png",
        value: "co"
    }, {
        title: "507",
        image: "images/flag_panama.png",
        value: "pa"
    }],
    t.auth.clean = function() {
        t.auth.username = "",
        t.auth.password = "",
        t.auth.token = ""
    }
    ,
    t.getLogin = function() {
        if (t.auth.username.length > 0 && t.auth.password.length > 0) {
            var d = t.auth;
            t.isLogin = !0,
            c.encryptPassword(d.password).then(function(c) {
                d.password = c.password,
                a.jsonService(b.typeRequest.post, b.urlServices.getLogin, d).then(function(a) {
                    k(a)
                }, function(a) {
                    l(a)
                })
            }, function(a) {
                f.location.href = b.login.fail,
                t.isLogin = !1
            })
        }
    }
    ,
    t.onSelectCountry = function(a) {
        t.user = "",
        t.password = "",
        t.token = "";
        var b = i[a].links.baseUrl;
        window.location = b
    }
    ,
    t.clearModal = function() {
        j.close(),
        q()
    }
    ,
    m(),
    a.getPSE(),
    r()
}
]),
angular.module("App").controller("mailController", ["utilsProvider", "messagesProvider", function(a, b) {
    function c() {
        d.userMail[0] = a.getParameterByName("mail"),
        d.textSuccess = a.createFormatString(d.textSuccess, d.userMail),
        d.textError = a.createFormatString(d.textError, d.userMail)
    }
    var d = this;
    d.userMail = [],
    d.textSuccess = b.views.mailsActivate.textSuccess,
    d.textError = b.views.mailsActivate.textError,
    c()
}
]),
angular.module("App").controller("profileResetPasswordController", ["$scope", "configProvider", "cypherProvider", "$location", "messagesProvider", function(a, b, c, d, e) {
    function f() {
        i.blockKeyBoard = !0,
        i.animationName = "load-animation",
        i.descriptorkeyView2 = e.views.profileResetPassword.loading
    }
    function g() {
        i.blockKeyBoard = !1,
        i.animationName = "",
        i.descriptorkeyView2 = e.views.profileResetPassword.textInfoTwo
    }
    function h() {
        var c = {}
          , f = d.url().split("#")
          , g = "";
        2 !== f.length && (f = d.url().split("%23")),
        2 === f.length ? (g = f[1].split("&"),
        c.email = g[1],
        c.controlCode = g[0],
        a.jsonService(b.typeRequest.post, b.urlServices.validateResetPasswordCode, c).then(function(b) {
            b.success || a.setUrl("profile/error.html?region=" + a.configCountry.codigo.pais, b.error)
        })) : a.setUrl("profile/error.html?region=" + a.configCountry.codigo.pais, e.errorCatalog.r01)
    }
    var i = this;
    i.flagPassword = !0,
    i.password = {
        pwsOne: null,
        pwsTwo: null
    },
    i.keyOne = {},
    i.keyTwo = {},
    i.animationName = "",
    i.blockKeyBoard = !1,
    i.descriptorkeyView2 = e.views.profileResetPassword.textInfoTwo,
    i.onSuccessPsw = function() {
        i.flagPassword = !1
    }
    ,
    i.onSuccessFinishPsw = function() {
        i.password.pwsTwo === i.password.pwsOne && i.blockKeyBoard !== !0 && i.sendNewPassword()
    }
    ,
    i.onCancelPsw = function() {
        i.password.pwsOne = "",
        i.password.pwsTwo = "",
        i.flagPassword = !0
    }
    ,
    i.sendNewPassword = function() {
        f(),
        i.keyOne.total = i.password.pwsOne,
        i.keyTwo.total = i.password.pwsTwo;
        var h = {}
          , j = d.url().split("#")
          , k = "";
        2 !== j.length && (j = d.url().split("%23")),
        k = j[1].split("&"),
        c.encryptPassword(i.keyOne.total).then(function(c) {
            h.email = k[1],
            h.controlCode = k[0],
            h.password = c.password,
            a.jsonService(b.typeRequest.post, b.urlServices.resetPassword, h).then(function(b) {
                g(),
                b.success ? a.setUrl("profile/successresetpassword.html?region=" + a.configCountry.codigo.pais, b) : a.setUrl("profile/error.html?region=" + a.configCountry.codigo.pais, b.error)
            }, function(b) {
                g(),
                a.setUrl("profile/error.html?region=" + a.configCountry.codigo.pais, e.errorCatalog.r02)
            })
        }, function() {
            g(),
            a.setUrl("profile/error.html?region=" + a.configCountry.codigo.pais, e.errorCatalog.r02)
        })
    }
    ,
    h()
}
]),
angular.module("App").controller("resetPasswordController", [function() {
    document.body.style.background = "#FFF"
}
]),
angular.module("App").directive("keyView", ["passwordMeterFactory", "$timeout", "messagesProvider", function(a, b, c) {
    return {
        restrict: "E",
        require: "ngModel",
        scope: {
            ngModel: "=",
            overwrite: "=",
            success: "&onSuccess",
            cancel: "&onCancel",
            description: "=",
            validate: "=",
            classparagraph: "=",
            successAnimate: "="
        },
        templateUrl: "views/transversal/keyView.html",
        link: function(d, e, f, g) {
            var h = d.description
              , i = function(a) {
                return a.replace(/\s|[^0-9]/g, "")
            }
              , j = function(a) {
                var b = "general";
                for (var c in a)
                    a[c] && (b = c);
                return b
            }
              , k = function(f) {
                var g = f.length
                  , i = null
                  , k = !1
                  , l = !1
                  , m = e[0].getElementsByClassName("item-key");
                if (4 !== g) {
                    h !== d.description && (d.description = h),
                    angular.element(m).removeClass("empty error success").addClass("full");
                    for (var n = 3; n >= g; --n)
                        angular.element(m[n]).removeClass("full error success").addClass("empty")
                } else
                    l = d.overwrite ? !0 : !1,
                    d.validate && l ? (i = a.check(f),
                    k = i.isValid && 4 === f.length,
                    k && f === d.overwrite ? (angular.element(m).removeClass("empty error").addClass("full"),
                    b(function() {
                        d.success()("")
                    }, 500)) : (angular.element(m).removeClass("empty full success").addClass("error"),
                    d.description = c.error.formKeyView.overwritePassword.overwrite,
                    b(function() {
                        d.cancel()("")
                    }, 1500))) : d.validate ? (i = a.check(f),
                    k = i.isValid && 4 === f.length,
                    k ? (angular.element(m).removeClass("empty error").addClass("full"),
                    b(function() {
                        d.success()("")
                    }, 500)) : (angular.element(m).removeClass("empty full success").addClass("error"),
                    d.description = c.error.formKeyView.password[j(i.meters)])) : l ? f === d.overwrite ? (angular.element(m).removeClass("empty error").addClass("full"),
                    b(function() {
                        d.success()("")
                    }, 500)) : (angular.element(m).removeClass("empty full success").addClass("error"),
                    d.description = c.error.formKeyView.overwritePassword.overwrite,
                    b(function() {
                        d.cancel()("")
                    }, 1500)) : (angular.element(m).removeClass("empty error").addClass("full"),
                    b(function() {
                        d.success()("")
                    }, 500))
            };
            g.$parsers.push(function(b) {
                var c = (e.find("input"),
                null)
                  , f = null
                  , h = "";
                return h = i(b),
                e.find("input").val(h),
                d.validate ? (c = a.check(h),
                f = c.isValid && 4 === h.length) : f = 4 === h.length,
                k(h),
                g.$setValidity("keyMeter", f),
                h
            }),
            g.$render = function() {
                var b = null
                  , c = g.$viewValue
                  , f = null;
                if (c)
                    d.validate ? (f = a.check(c),
                    b = f.isValid && 4 === c.length) : b = 4 === c.length,
                    k(c),
                    g.$setValidity("keyMeter", b),
                    g.$setViewValue(i(g.$viewValue));
                else {
                    var h = e[0].getElementsByClassName("item-key");
                    angular.element(h).removeClass("full error success").addClass("empty")
                }
            }
        }
    }
}
]),
angular.module("App").directive("numericKeyboard", numericKeyboard),
numericKeyboardController.$inject = ["$scope"],
angular.module("App").directive("selectCountry", ["configCountryProvider", "$rootScope", function(a, b) {
    return {
        restrict: "E",
        scope: {
            selectedCountry: "=",
            options: "=",
            onSelectCountry: "&"
        },
        templateUrl: "views/transversal/directiveSelectCountry.html",
        link: function(c, d, e, f) {
            function g() {
                d.data("state", !1),
                c.selectedCountry = "" === c.selectedCountry ? "co" : c.selectedCountry,
                "co" !== c.selectedCountry ? h() : c.indexCountry = 0
            }
            function h() {
                for (var a = 0; a < c.options.length; a++)
                    if (c.options[a].value === c.selectedCountry) {
                        c.indexCountry = a;
                        break
                    }
            }
            c.toggleSelect = function() {
                var a = d.data("state");
                a ? c.openClass = "" : c.openClass = "open-select-country",
                d.data("state", !a)
            }
            ,
            c.setCountry = function(d) {
                c.indexCountry = d,
                c.selectedCountry = c.options[d].value,
                b.configCountry = a[c.selectedCountry],
                b.hideCo = "co" === c.selectedCountry,
                b.hidePa = "pa" === c.selectedCountry,
                "function" == typeof c.onSelectCountry && c.onSelectCountry({
                    option: c.selectedCountry
                })
            }
            ,
            g()
        }
    }
}
]),
angular.module("App").directive("a", ["googleAnalyticsProvider", "configProvider", function(a, b) {
    return {
        restrict: "E",
        link: function(c, d, e) {
            d.on("click", function(c) {
                if (e.ga) {
                    var d = b.googleAnalytics.action.click;
                    c.preventDefault(),
                    a.trackEvent(e.view, d, e.ga),
                    location.href = e.href
                }
            })
        }
    }
}
]),
angular.module("App").directive("messagePrint", ["messagesProvider", function(a) {
    return {
        scope: {
            htmlPrint: "="
        },
        template: function(b, c) {
            for (var d = c.messagePrint.split("."), e = a, f = 0; f < d.length; f++)
                e = e[d[f]];
            return e
        }
    }
}
]),
angular.module("App").directive("focus", ["$timeout", function(a) {
    return {
        scope: {
            trigger: "@focus"
        },
        link: function(b, c) {
            b.$watch("trigger", function(b) {
                "true" === b && a(function() {
                    c[0].focus()
                })
            })
        }
    }
}
]),
angular.module("App").directive("popup2", ["$rootScope", "$timeout", "$interval", function(a, b, c) {
    return {
        restrict: "E",
        scope: {
            modalInfo: "=",
            success: "&onSuccess",
            closeModal: "&onClose"
        },
        templateUrl: "views/transversal/popupDirective.html",
        controllerAs: "popupController",
        controller: [function() {
            function d(a) {
                h.modalInfo = a.modalInfo,
                h.success = a.modalAction ? a.modalAction : h.closePopup,
                h.closeModal = a.clearModal ? a.clearModal : h.closePopup,
                a.modalInfo.type ? e(a) : f()
            }
            function e(a) {
                h.timer = a.modalInfo.timer,
                h.interval = c(function() {
                    h.timer--,
                    h.timer <= 0 && g()
                }, 1e3),
                h.animationShow = "popup-show",
                b(function() {
                    h.moveShow = "animation-show"
                }, 10)
            }
            function f() {}
            function g() {
                c.cancel(h.interval),
                h.closePopup()
            }
            var h = this;
            h.animationShow = "",
            h.moveShow = "",
            h.formatTimer = function() {
                var a = h.timer
                  , b = Math.floor(a / 3600)
                  , c = Math.floor(a % 3600 / 60)
                  , d = a % 60;
                return [b > 9 ? b : "0" + b, c > 9 ? c : "0" + c, d > 9 ? d : "0" + d].join(":")
            }
            ,
            h.closePopup = function() {
                h.moveShow = "",
                b(function() {
                    h.animationShow = "",
                    h.closeModal = void 0,
                    h.success = void 0,
                    h.modalInfo = void 0
                }, 100)
            }
            ,
            a.$on("openPopupDirective", function(a, b) {
                d(b)
            }),
            a.$on("closePopupDirective", function() {
                h.closePopup()
            })
        }
        ]
    }
}
]),
angular.module("App").filter("stringPhoneNumber", function() {
    return function(a, b) {
        var c, d = new StringMask("+00 000 000 0000"), e = new StringMask("000 000 0000");
        return b && (d = new StringMask(b),
        e = new StringMask(b)),
        "undefined" != typeof a && null !== a ? (a = a.replace(/-/g, "").replace(/ /g, "").replace(/\+/g, ""),
        c = a.length < 11 ? e.apply(a) : d.apply(a)) : c = a,
        c
    }
}),
angular.module("App").factory("configCountryProvider", function() {
    var a = Object.freeze({
        pa: {
            codigo: {
                pais: "pa",
                tel: "+507",
                region: "P001"
            },
            imgs: {
                logoNequi: "https://uploads-ssl.webflow.com/6317a229ebf7723658463b4b/64e50b03c9fda96db04be382_logo-nequi-blanco.svg",
                bancolombiaGroup: "https://assets-global.website-files.com/63be0fb85664b94d14287a6c/640115ff970ede3928b69c21_Logo-banistmo.svg",
                iconArrow: "https://uploads-ssl.webflow.com/6317a229ebf7723658463b4b/64e573948290d271c9185df0_ic-arrow.svg"
            },
            links: {
                baseUrl: "https://transaccionespa.nequi.com/bdigital/login.jsp?region=pa",
                home: "https://www.nequi.com.pa",
                discover: "https://www.nequi.com.pa/detalles-del-servicio/",
                faq: "https://ayuda.nequi.com.pa/",
                merchant: "https://www.nequi.com.pa/punto-nequi/",
                maps: "https://www.nequi.com.pa/mapas/",
                recharge: "#",
                security: "https://www.nequi.com.co/informacion-legal",
                contact: "https://www.nequi.com.pa/chat/",
                product: "https://www.nequi.com.pa/legal/#caracteristicas-del-producto",
                terms: "https://www.nequi.com.pa/legal/#condiciones-de-uso",
                tyc: "https://www.nequi.com.pa/legal/#terminos-y-condiciones",
                map: "https://www.nequi.com.pa/mapa-del-sitio/",
                fb: "https://www.facebook.com/nequipanama",
                you: "https://www.youtube.com/channel/UCtdpoTH0054MSAt6iqkMiFw",
                ins: "https://www.instagram.com/nequipanama",
                press: "https://www.nequi.com.pa/prensa/",
                bancolombiaGroup: "https://www.grupobancolombia.com/"
            },
            infoContact: {
                numPhone: "377-1000/ 629NEQUI",
                email: "escribe@nequi.com.pa",
                daysAttention: "Lunes a Viernes",
                hourAttention: "08:00 am a 06:00 pm"
            },
            store: {
                apple: "https://apps.apple.com/us/app/nequi-panama/id1183868167",
                appleimg: "https://uploads-ssl.webflow.com/6317a229ebf7723658463b4b/64e50ed702047ba456edd2cb_store-apple.svg",
                android: "https://play.google.com/store/apps/details?id=pa.com.nequi.MobileApp",
                androidimg: "https://uploads-ssl.webflow.com/6317a229ebf7723658463b4b/64e50ed88b7bb33f2c2c4653_store-googleplay.svg",
                huawei: "https://appgallery.huawei.com/app/C102297511",
                huaweiimg: "https://uploads-ssl.webflow.com/6317a229ebf7723658463b4b/64e50ed702047ba456edd25c_store-huawei.svg"
            },
            labels: [{
                id: "info-legal",
                title: "Información legal",
                data: [{
                    label: "Términos y condiciones",
                    link: "https://www.nequi.com.pa/informacion-legal"
                }, {
                    label: "Contrato de usuario",
                    link: "https://www.nequi.com.pa/informacion-legal"
                }, {
                    label: "Legal Nequi",
                    link: "https://www.nequi.com.pa/informacion-legal"
                }]
            }, {
                id: "para-personas",
                title: "Para personas",
                data: [{
                    label: "Tarjeta Nequi Visa",
                    link: "https://www.nequi.com.pa/tarjeta-nequi"
                }, {
                    label: "Usa tu plata",
                    link: "https://www.nequi.com.pa/usa-tu-plata"
                }, {
                    label: "Paypal",
                    link: "https://www.nequi.com.pa/paypal"
                }, {
                    label: "eVale",
                    link: "https://www.nequi.com.pa/e-vale"
                }]
            }, {
                id: "para-negocio",
                title: "Para tu negocio",
                data: [{
                    label: "Usa el QR",
                    link: "https://www.nequi.com.pa/usa-qr"
                }]
            }, {
                id: "ayuda",
                title: "Ayuda",
                data: [{
                    label: "Centro de ayuda",
                    link: "https://ayuda.nequi.com.pa/hc/es-419"
                }]
            }, {
                id: "conocenos",
                title: "Conócenos",
                data: [{
                    label: "Somos Nequi",
                    link: "https://www.nequi.com.pa/somos-nequi"
                }]
            }],
            socialMedia: [{
                img: "https://uploads-ssl.webflow.com/6317a229ebf7723658463b4b/64e5220142aa063fa007c444_ic-twitter.svg",
                link: "https://twitter.com/NequiPanama"
            }, {
                img: "https://uploads-ssl.webflow.com/6317a229ebf7723658463b4b/64e52201416719efe915e448_ic-instagram.svg",
                link: "https://www.instagram.com/nequipanama/"
            }, {
                img: "https://uploads-ssl.webflow.com/6317a229ebf7723658463b4b/64e52201c1a7bf3e9e5bd566_ic-facebook.svg",
                link: "https://www.facebook.com/appnequi/?brand_redir=1945487589018530"
            }, {
                img: "https://uploads-ssl.webflow.com/6317a229ebf7723658463b4b/64e522013be191fdc4a0252e_ic-linkedin.svg",
                link: "https://www.linkedin.com/company/nequi-panam%C3%A1/"
            }, {
                img: "https://uploads-ssl.webflow.com/6317a229ebf7723658463b4b/64e52201c663d0190bc59ba8_ic-youtube.svg",
                link: "https://www.youtube.com/channel/UCtdpoTH0054MSAt6iqkMiFw"
            }],
            inputs: {
                phoneNumber: {
                    maskString: "0000 0000",
                    regEx: "^6[\\d]{7}$+s",
                    minlength: 8
                },
                password: {
                    regEx: "^[0-9]*$",
                    minlength: 4
                }
            }
        },
        co: {
            codigo: {
                pais: "co",
                tel: "+57",
                region: "C001"
            },
            imgs: {
                logoNequi: "https://uploads-ssl.webflow.com/6317a229ebf7723658463b4b/64e50b03c9fda96db04be382_logo-nequi-blanco.svg",
                bancolombiaGroup: "https://uploads-ssl.webflow.com/6317a229ebf7723658463b4b/64e50f4c6011eb184c8d7d99_logo-grupo-bancolombia.svg",
                iconArrow: "https://uploads-ssl.webflow.com/6317a229ebf7723658463b4b/64e573948290d271c9185df0_ic-arrow.svg"
            },
            links: {
                baseUrl: "https://transacciones.nequi.com/bdigital/login.jsp?region=co",
                home: "https://www.nequi.com.co",
                discover: "https://www.nequi.com.co/descubre/",
                faq: "https://ayuda.nequi.com.co/hc/es",
                merchant: "https://www.nequi.com.co/punto-nequi/",
                maps: "https://www.nequi.com.co/mapas/",
                recharge: "https://recarga.nequi.com.co/bdigitalpsl",
                security: "https://www.nequi.com.co/informacion-legal",
                contact: "https://www.nequi.com.co/chat/",
                product: "https://www.nequi.com.co/informacion-legal",
                terms: "https://www.nequi.com.co/legal-web/condiciones-de-uso-de-la-pagina-web",
                tyc: "https://www.nequi.com.co/informacion-legal",
                map: "https://www.nequi.com.co/mapa-del-sitio/",
                fb: "https://www.facebook.com/appnequi/",
                tw: "https://twitter.com/nequi/",
                ins: "https://www.instagram.com/nequi_/",
                you: "https://www.youtube.com/channel/UCK1dLH3nTK-GOlgSVa95XNg",
                press: "https://www.nequi.com.co/prensa/",
                bancolombiaGroup: "https://www.grupobancolombia.com/"
            },
            infoContact: {
                numPhone: "300 600 0100",
                email: "escribe@nequi.co",
                daysAttention: "Todos los días",
                hourAttention: "08:00 am a 10:00 pm"
            },
            store: {
                apple: "https://apps.apple.com/co/app/nequi/id1075378688",
                appleimg: "https://uploads-ssl.webflow.com/6317a229ebf7723658463b4b/64e50ed702047ba456edd2cb_store-apple.svg",
                android: "https://play.google.com/store/apps/details?id=com.nequi.MobileApp&hl=es",
                androidimg: "https://uploads-ssl.webflow.com/6317a229ebf7723658463b4b/64e50ed88b7bb33f2c2c4653_store-googleplay.svg",
                huawei: "https://appgallery.huawei.com/#/app/C101700131?channelId=browser&detailType=0",
                huaweiimg: "https://uploads-ssl.webflow.com/6317a229ebf7723658463b4b/64e50ed702047ba456edd25c_store-huawei.svg"
            },
            labels: [{
                id: "info-legal",
                title: "Información legal",
                data: [{
                    label: "Condiciones de uso",
                    link: "https://www.nequi.com.co/legal-web/condiciones-de-uso-de-la-pagina-web"
                }, {
                    label: "Tratamiento de Datos Personales",
                    link: "https://www.nequi.com.co/legal-web/tratamiento-de-datos-personales-nequi"
                }, {
                    label: "Consumidor fianciero",
                    link: "https://www.nequi.com.co/informacion-legal#consumidor-financiero"
                }, {
                    label: "Defensor del Consumidor Financiero",
                    link: "https://www.nequi.com.co/informacion-legal/defensor-del-consumidor-financiero-de-nequi"
                }, {
                    label: "Términos y condiciones Tarjeta Nequi",
                    link: "https://www.nequi.com.co/legal-tarjeta-nequi/terminos-y-condiciones-de-tarjeta-nequi"
                }, {
                    label: "Legal Nequi",
                    link: "https://www.nequi.com.co/informacion-legal"
                }]
            }, {
                id: "para-personas",
                title: "Para personas",
                data: [{
                    label: "Tarjeta Nequi",
                    link: "https://www.nequi.com.co/tarjeta-nequi"
                }, {
                    label: "Préstamo Salvavidas",
                    link: "https://www.nequi.com.co/prestamo-salvavidas"
                }, {
                    label: "Préstamo Propulsor",
                    link: "https://www.nequi.com.co/prestamo-propulsor"
                }, {
                    label: "Usa tu plata",
                    link: "https://www.nequi.com.co/usa-tu-plata"
                }, {
                    label: "Paypal",
                    link: "https://www.nequi.com.co/paypal"
                }, {
                    label: "Remesas",
                    link: "https://www.nequi.com.co/remesas"
                }]
            }, {
                id: "para-negocio",
                title: "Para tu negocio",
                data: [{
                    label: "Negocios",
                    link: "https://negocios.nequi.co/"
                }]
            }, {
                id: "ayuda",
                title: "Ayuda",
                data: [{
                    label: "Centro de ayuda",
                    link: "https://ayuda.nequi.com.co/hc/es"
                }, {
                    label: "Blog metidas de plata",
                    link: "https://www.nequi.com.co/blog"
                }, {
                    label: "Comunidad Nequi",
                    link: "https://comunidad.nequi.co/"
                }, {
                    label: "Tips de seguridad",
                    link: "https://www.nequi.com.co/roberto-hurtado-tips-de-seguridad"
                }]
            }, {
                id: "conocenos",
                title: "Conócenos",
                data: [{
                    label: "¿Quiénes somos?",
                    link: "https://www.nequi.com.co/somos-nequi"
                }, {
                    label: "Trabaja con nosotros",
                    link: "https://www.nequi.com.co/nequi-trabaja-con-nosotros"
                }, {
                    label: "Sala de prensa",
                    link: "https://www.nequi.com.co/sala-de-prensa"
                }, {
                    label: "Comunicados",
                    link: "https://www.nequi.com.co/comunicados"
                }]
            }],
            socialMedia: [{
                img: "https://uploads-ssl.webflow.com/6317a229ebf7723658463b4b/64e5220142aa063fa007c444_ic-twitter.svg",
                link: "https://twitter.com/Nequi"
            }, {
                img: "https://uploads-ssl.webflow.com/6317a229ebf7723658463b4b/64e52201416719efe915e448_ic-instagram.svg",
                link: "https://www.instagram.com/nequi_/"
            }, {
                img: "https://uploads-ssl.webflow.com/6317a229ebf7723658463b4b/64e52201c1a7bf3e9e5bd566_ic-facebook.svg",
                link: "https://www.facebook.com/appnequi/"
            }, {
                img: "https://uploads-ssl.webflow.com/6317a229ebf7723658463b4b/64e522013be191fdc4a0252e_ic-linkedin.svg",
                link: "https://www.linkedin.com/company/nequi/mycompany/"
            }, {
                img: "https://uploads-ssl.webflow.com/6317a229ebf7723658463b4b/64e52201c663d0190bc59ba8_ic-youtube.svg",
                link: "https://www.youtube.com/channel/UCK1dLH3nTK-GOlgSVa95XNg/feed"
            }],
            inputs: {
                phoneNumber: {
                    maskString: "000 000 0000",
                    regEx: "^[0-9]*$+s",
                    minlength: 10
                },
                password: {
                    regEx: "^[0-9]*$",
                    minlength: 4
                },
                token: {
                    maskString: "000000",
                    regEx: "^[0-9]*$+s",
                    minlength: 6
                }
            }
        }
    });
    return a
}),
angular.module("App").factory("configProvider", function() {
    var a = Object.freeze({
        setting: {
            keyCodeBackSpace: 8,
            timeout: 12e4,
            sitekey: "6LdjCwshAAAAAGbejJzdnXbU7vrJOmpqjqcsUEFa",
            size: "128",
            salt: "00000000000000000000000000000000",
            iv: "00000000000000000000000000000000",
            passphrase: "UHJhZ21hMjAxNSs=",
            count: "50"
        },
        login: {
            success: "./private/",
            fail: "./error.jsp"
        },
        defaultVal: {
            template: "/home",
            views: "/home"
        },
        folders: {
            template: "views/__template",
            views: "views"
        },
        typeRequest: {
            get: "get",
            post: "post",
            put: "put"
        },
        statusCode: {
            transactionSuccess: "35",
            statusTrue: "0",
            success: !0,
            fail: !1
        },
        baseService: {
            url: "/bdigital/rest/services/public/",
            header: {
                "Content-Type": "application/json; charset=UTF-8"
            }
        },
        messageBody: {
            RequestMessage: {
                RequestHeader: {
                    Channel: "MF-001",
                    RequestDate: "",
                    MessageID: "1234545",
                    ClientID: ""
                },
                RequestBody: {
                    any: {}
                }
            }
        },
        errorData: {
            error: {
                errorId: "",
                errorMessage: ""
            }
        },
        urlServices: {
            resetPassword: {
                url: "ResetPasswordServices/getResetPassword/",
                rs: "getResetPasswordRS",
                rq: "getResetPasswordRQ",
                service: {
                    name: "ResetPasswordServices",
                    operation: "getResetPassword",
                    version: "1.0.0"
                }
            },
            validateResetPasswordCode: {
                url: "ValidateResetPasswordCodeServices/getValidateResetPasswordCode/",
                rs: "getValidateResetPasswordCodeRS",
                rq: "getValidateResetPasswordCodeRQ"
            },
            getSeed: {
                url: "SeedService/getSeed/",
                rs: "getSeedServiceRS",
                rq: "getSeedServiceRQ"
            },
            saveEmail: {
                url: "SaveEmailServices/saveEmail/",
                rs: "saveEmailRS",
                rq: "saveEmailRQ"
            },
            getLogin: {
                url: "LoginService/getLogin/",
                rs: "getLoginRS",
                rq: "getLoginRQ"
            },
            parameter: {
                url: "ParameterService/parameter/",
                rs: "parameterRS",
                rq: "parameterRQ"
            }
        },
        recaptcha: {
            matchPage: "error.jsp"
        },
        cookies: {
            keyRecaptcha: "scn"
        }
    });
    return a
}),
angular.module("App").factory("configTemplate", function() {
    var a = Object.freeze({
        template: {
            defaultVal: "/home",
            comerce: "/loginComerce",
            profile: "/profile",
            auth: "/profile",
            profilereset: "/profileResetPassword",
            help: "/tac",
            home: "/home",
            inicio: "/home",
            transversal: "/transversal"
        },
        classVal: {
            profilereset: "contenedor-gris",
            defaultVal: "wrapper-general",
            home: "wrapper-general",
            profile: "wrapper-login profile",
            auth: "",
            help: "wrapper-terminos",
            comerce: "wrapper-merchant"
        }
    });
    return a
}),
angular.module("App").factory("cookieProvider", [function() {
    function a(a, b, c) {
        var d = ""
          , e = new Date;
        c && (e.setTime(e.getTime() + 24 * c * 60 * 60 * 1e3),
        d = "; expires=" + e.toGMTString()),
        document.cookie = String(a + "=" + b + d + "; path=/")
    }
    function b(a) {
        for (var b = a + "=", c = document.cookie.split(";"), d = 0; d < c.length; d++) {
            for (var e = c[d]; " " === e.charAt(0); )
                e = e.substring(1, e.length);
            if (0 === e.indexOf(b))
                return e.substring(b.length, e.length)
        }
        return null
    }
    function c(b) {
        a(b, "", -1)
    }
    var d = {
        setCookie: a,
        getCookie: b,
        eraseCookie: c
    };
    return d
}
]),
angular.module("App").factory("cypherProvider", ["configProvider", "$q", "$rootScope", "messagesProvider", function(a, b, c, d) {
    function e() {
        var d = b.defer()
          , e = {};
        return c.jsonService(a.typeRequest.post, a.urlServices.getSeed, {}).then(function(a) {
            e.success = a.success,
            e.data = a.data,
            e.error = a.error,
            d.resolve(e)
        }, function(a) {
            e.success = !1,
            e.error = a,
            d.reject(e)
        }),
        d.promise
    }
    function f(a, b) {
        var c = b.iv
          , d = b.salt
          , e = b.size
          , f = b.count
          , g = b.passphrase
          , h = new AesUtil(e,f)
          , i = h.encrypt(d, c, g, a);
        return i
    }
    function g(a) {
        var c = {}
          , g = b.defer();
        return e().then(function(b) {
            c.success = b.success,
            b.success ? (c.password = f(a, b.data),
            g.resolve(c)) : (c.errorMessage = d.cypher.errorGettingSeedMessage,
            g.reject(c))
        }, function(a) {
            c.success = !1,
            g.reject(a)
        }),
        g.promise
    }
    function h(b, c, d) {
        var e = {}
          , g = {};
        return g.iv = a.setting.iv,
        g.salt = a.setting.salt,
        g.size = a.setting.size,
        g.count = a.setting.count,
        g.passphrase = atob(a.setting.passphrase),
        e.username = f(b, g),
        e.password = f(c, g),
        e.token = f(d, g),
        e
    }
    var i = {
        encrypt: f,
        encryptPassword: g,
        encryptLogin: h,
        getSeed: e
    };
    return i
}
]),
angular.module("App").factory("googleAnalyticsProvider", ["$rootScope", function(a) {
    function b(b, c, e, f) {
        var g = a.configCountry.prefix + " " + b;
        return ("undefined" == typeof e || null === e) && (e = ""),
        ("undefined" == typeof f || null === f) && (f = 0),
        d ? void console.log("[Google Analytics] Tracked event. Category: " + b + ". Action: " + c + ". Label: " + e + ". Value: " + f) : void ga("send", "event", g, c, e, f, {
            useBeacon: !0
        })
    }
    var c = {
        trackEvent: b
    }
      , d = !0;
    return c
}
]),
angular.module("App").value("messagesProvider", {
    general: {
        recharge: "Recargar Nequi",
        blockAccount: "¡BLOQUEAR MI CUENTA!",
        okButton: "ACEPTAR",
        back: "VOLVER",
        logout: "SALIR",
        openPicture: "Ampliar imagen",
        saveNewPassword: "Guardar nueva clave",
        submitButton: "Entrar",
        backPage: "Volver a intentarlo",
        submit: "Enviar"
    },
    errorMessage: {
        loginComerce: "Datos incorrectos.",
        general: {
            emptyField: "El campo esta vacío.",
            invalidNumber: "Número de teléfono invalido.",
            timeout: "El servidor no responde. Inténtelo de nuevo más tarde.",
            emptyFields: "Hay campos vacíos",
            numbersFields: "La contraseña solo puede tener numeros.",
            equalsPass: "La contraseña no coincide.",
            invalidEmail: "El correo no es valido."
        }
    },
    errorCatalog: {
        r01: {
            code: "01",
            errorMessage: "No puede ingresar a este sitio web"
        },
        r02: {
            code: "02",
            errorMessage: "No fue posible validar la información, intente mas tarde."
        }
    },
    unlockTime: {
        modal: {
            title: "Tu App Nequi está bloqueado",
            timerTitle: "Se desbloqueará en:",
            description: "Vimos que intentaste entrar varias veces seguidas. Por seguridad, bloqueamos tu acceso a Nequi desde la web. Prueba de nuevo en unos minutos."
        }
    },
    unlockTimeIncremental: {
        modal: {
            title: "Tu Nequi está bloqueado",
            timerTitle: "Se desbloqueará en:",
            description: "Después de varios intentos fallidos de ingreso, hemos bloqueado tu Nequi. Cambia tu clave desde tu app o espera que el bloqueo finalice para poder acceder a tu cuenta."
        }
    },
    changePassword: {
        modal: {
            title: "¡Debes cambiar tu clave!",
            description: "Por seguridad, necesitas cambiar tu clave en tu app para entrar a tu Nequi.",
            button: " Volver"
        }
    },
    header: {
        home: {
            faq: "Ayuda",
            comerce: "¿Eres comerciante?",
            recharge: "RECARGAR",
            urlLogin: "private/",
            login: "Entrar"
        },
        login: {
            discover: "Descubre",
            faq: "Ayuda",
            merchant: "¿Quieres ser Punto Nequi?",
            maps: "Mapas",
            recharge: "Recarga",
            back: "Volver"
        }
    },
    views: {
        home: {
            textOneInfo: "NO SALGAS DE CASA SIN NEQUI",
            textTwoInfo: "Le damos<br>superpoderes<br>a tu bolsillo",
            textThreeInfo: "Claro que ya lo habías imaginado, lo que no imaginabas es que íbamos a llegar tan pronto.",
            buttonInvite: "Pedir una invitación",
            email: "Tu email",
            infoText: "Autorizo a Nequi para que me envíe correos <br>electrónicos con información sobre novedades <br>y noticias del proyecto.",
            phraseOne: "Haz parte de este proyecto, y podrás contarle a tus nietos como fué el día en el que todo cambió.",
            textOutstandingOne: "* Vive tu vida a tu manera, nosotros te acompañamos.",
            fineshEmail: "Tu correo se ha guardado.",
            datagridOne: {
                PayTitle: "SIN ATADURAS",
                PayText: "Entendemos lo que necesitas y <br>respetamos tu libertad.",
                requestMoneyTitle: "NOS PARECEMOS",
                requestMoneyText: "Si, tambien vivimos el día a día como tú,<br> nos adaptamos a lo que necesitas.",
                sendMoneyTitle: "SIN LETRA PEQUEÑA",
                sendMoneyText: "Sabemos que valoras la honestidad,<br> por eso siempre te diremos la verdad."
            },
            textFineInfo: "¿Cual es tu sueño?",
            contentOneTitle: "“¿ESO SI ES <br>POSIBLE?”",
            contentOneText: "Claro! y lo mejor es que tú eres parte de esto.",
            contentTwoTitle: "“¿ASÍ DE FÁCIL?”",
            contentTwoText: "¡Si! no hay necesidad de complicarlo todo",
            contentThreeTitle: "“¿YA LO PUEDO <br>TENER?”",
            contentThreeText: "¡Muy pronto! y tu estarás en el comienzo.",
            reviewTitle: "Andrés Botero - @saertus",
            reviewText: "¡Qué más! Yo uso Nequi a diario, déjeme enseñarle cómo.",
            datagridTwo: {
                oneTitle: "Me pagan el sueldo",
                twoTitle: "Compré mecato en la U<br>donde Don Alonso.",
                threeTitle: "Mi mamita me pasa<br>lo del semestre.",
                fourTitle: "Separo $75.000<br>para la buseta",
                fiveTitle: "Meto $25.000 en mi meta<br>para irme a Cartagena.",
                sixTitle: "Todos los días pago el<br>almuerzo en la uni con el celular",
                sevenTitle: "Estoy etiquetando el mecato<br>porque me quiero controlar"
            },
            datagridThree: {
                gridTitle: "Nequi te da las herramientas<br>que no estabas esperando.",
                goalsTitle: "METAS DE AHORRO",
                goalsText: "Organizarte para conseguir<br>tus sueños nunca habia<br>sido tan fácil.",
                pocketsTitle: "BOLSILLOS",
                pocketsText: "Guardar&nbsp; plata en sobres<br>y memorizar cuentas ya no<br>será necesario.",
                stashTitle: "COLCHÓN",
                stashText: "Plata para imprevistos<br>que no necesitas esconder<br>bajo el colchón."
            },
            mapTitle: "ESTAMOS MUY CERCA DE TÍ",
            mapText: "Estaremos en la Universidad <br>de Medellín, Vén a nuestra <br>feria y facilita tus días.",
            mapReference: "Mapa Universidad de Medellín"
        },
        comerceLogin: {
            title: "Comerciante",
            phraseOne: "QUEREMOS SABER QUIÉN ERES",
            phraseTwo: "Por favor, ingresa tus datos",
            inputUser: "Código del comercio",
            inputPass: "Contraseña"
        },
        authLogin: {
            title: "Entra a tu Nequi",
            phraseOne: "Podrás bloquear tu Nequi, consultar tus datos.",
            inputUser: "Número de celular",
            inputPass: "Contraseña",
            inputToken: "Clave dinámica",
            submit: "Entra",
            forgotPass: "¿Olvidaste tu contraseña?",
            helpToken: "Puedes copiar la clave dinámica directamente desde la app"
        },
        authError: {
            title: "Error",
            phraseOne: "Error de autenticación"
        },
        profileError: {
            title: "¡Error!"
        },
        profileResetPassword: {
            title: "Cambia tu contraseña",
            text: "No te preocupes, pero trata de no olvidarla de nuevo",
            text2: "¿Necesitas bloquear tu cuenta y no puedes ingresar? llámanos al ",
            textInfoOne: "Pon tu nueva clave",
            textInfoTwo: "Repite tu nueva clave",
            btnSave: "Guardar",
            loading: "Cargando",
            textHelp: "¿Necesitas bloquear tu cuenta y no puedes ingresar? llámanos al 300 - 600 0100",
            titleMail: "¿Necesitas más información?",
            titleMail2: "Escríbenos",
            PlaceHolderMail: "Introduce tu correo eléctronico"
        },
        profileSuccess: {
            title: "¡Listo, nueva <br> clave creada!",
            text: "Recuerda que deberás introducir esta nueva clave para poder entrar en la app."
        },
        mailsActivate: {
            titleSuccess: "¡Listo!",
            textSuccess: "Ya confirmamos tu correo {0}.  ;)",
            titleError: "¡Ups!",
            textError: "No logramos validar tu correo {0}. Recuerda que este correo dura 2 horas, si ya pasó este tiempo, debes pedir un nuevo correo.",
            back: "Volver",
            linkBack: "https://www.nequi.com.co/"
        },
        biometryActivate: {
            titleSuccess: "¡Listo!",
            textSuccess: "Ya estamos seguros de que eres tú. Porfa vuelve a Nequi para que termines tu registro.",
            titleError: "¡Ups!",
            textError: "Este enlace ya está muy viejo. Porfa vuelve a la App y vuelve a intentarlo para mandarte otro. ",
            back: "Volver",
            linkBack: "http://tiendas.nequi.co"
        },
        restoreBiometrics: {
            titleSuccess: "¡Listo!",
            textSuccess: "Ya confirmamos tu correo. Vuelve a la app para que termines tu Biometría.",
            titleError: "¡Ups!",
            textError: "No pudimos conectarnos, inténtalo más tarde.",
            back: "Volver",
            linkBack: "http://tiendas.nequi.co"
        }
    },
    footer: {
        comingSoon: "Próximamente en",
        drawbacks: "¿TIENES INCONVENIENTES CON NEQUI?",
        whatsappNumber: "300-600-01-00",
        whatsappMessage: "Chatéanos",
        callNumber: "300-600-01-00",
        callMessage: "Llámanos",
        emailAccount: "escribe@nequi.co",
        emailMessage: "Escríbenos",
        login: {
            title1: "Producto",
            discover: "Descubre",
            merchant: "Punto Nequi",
            maps: "Mapas",
            security: "Legales",
            contact: "Contacto",
            title2: "Descarga la App",
            title3: "Descargas",
            title3_alt: "Portales",
            title4_alt: "Contáctanos",
            faq: "Ayuda",
            phone: "Llámanos al: ",
            mail: "Mail",
            attention: "Horario de atención",
            product: "Características del producto",
            terms: "Condiciones de uso",
            tyc: "Términos y condiciones",
            map: "Mapa del sitio",
            chat: "Chatea con nosotros",
            urlChat: "https://www.nequi.com.co/chat/",
            siguenos: "Redes",
            fb: "Facebook",
            tw: "Twitter",
            ins: "Instagram",
            you: "YouTube",
            press: "Prensa"
        }
    },
    externalLinks: {
        pse: "https://recarga.nequi.com.co/bdigitalpsl/#!/",
        blogCo: "https://metidasdeplata.nequi.com.co/",
        conectaCo: "https://conecta.nequi.com.co/"
    },
    error: {
        formKeyView: {
            password: {
                repeatNumber: "¡Ups! No puedes usar el mismo número 2 veces.",
                sequentialNumerics: "¡Ups! Los números no pueden ser consecutivos.",
                general: "¡Ups! Te equivocaste en algo. Vuelve a intentarlo."
            },
            overwritePassword: {
                overwrite: "¡Ups! Las claves deben ser iguales."
            }
        }
    }
}),
angular.module("App").factory("passwordMeterFactory", [function() {
    function a(a) {
        var c = !1
          , d = !1
          , e = {}
          , f = {
            isValid: d,
            meters: e
        };
        return e.repeatNumber = !1,
        a ? (c = 0 === b(a) ? !1 : !0,
        d = !c,
        e.repeatNumber = c,
        f.isValid = d,
        f.meters = e) : (f.isValid = !1,
        e.repeatNumber = !1,
        f.meters = e),
        f
    }
    function b(a) {
        for (var b = a.replace(/\s+/g, "").split(/\s*/), c = 0, d = "", e = 0; e < b.length; e++)
            b[e].match(/[0-9]/g) && ("" !== d && parseInt(d) === parseInt(b[e]) && c++,
            d = b[e]);
        return c
    }
    var c = {
        check: a
    };
    return c
}
]),
angular.module("App").factory("popupProvider", ["$rootScope", "configProvider", function(a, b) {
    function c(b) {
        a.$emit("openPopupDirective", b)
    }
    function d() {
        a.$emit("closePopupDirective")
    }
    var e = {
        open: c,
        close: d
    };
    return e
}
]),
angular.module("App").factory("utilsProvider", ["configProvider", function(a) {
    function b(a) {
        return "undefined" != typeof a && null !== a && "" !== a
    }
    function c(a, b) {
        return a.replace(g.formatRegex, function(a) {
            var c, d = parseInt(a.substring(1, a.length - 1));
            return c = d >= 0 ? b[d] : -1 === d ? "{" : -2 === d ? "}" : ""
        })
    }
    function d(a, b) {
        var c, d;
        return b || (b = window.location.href),
        a = a.replace(/[\[\]]/g, "\\$&"),
        c = new RegExp("[?&]" + a + "(=([^&#]*)|&|#|$)"),
        d = c.exec(b),
        d ? d[2] ? decodeURIComponent(unescape(d[2].replace(/\+/g, " "))) : "" : null
    }
    function e(a) {
        return window.btoa(unescape(encodeURIComponent(a)))
    }
    function f(a) {
        return decodeURIComponent(escape(window.atob(a)))
    }
    var g = {
        validateNull: b,
        createFormatString: c,
        getParameterByName: d,
        encodeBase64: e,
        decodeBase64: f
    };
    return g.formatRegex = new RegExp("{-?[0-9]+}","g"),
    g
}
]);
