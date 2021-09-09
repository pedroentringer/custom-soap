"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var src_1 = require("../src");
var simetrias = function () { return __awaiter(void 0, void 0, void 0, function () {
    var soap, payloadToConvert, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(">> Simetrias");
                soap = new src_1["default"]({
                    soap12: true,
                    url: 'http://187.75.229.91:8091/WSCTE/Service_CTE.asmx',
                    agentOptions: {
                        rejectUnauthorized: false
                    },
                    envelopeAttrs: {
                        'xmlns:ns': "http://simetrias.com.br/webservices/wscte/1.0"
                    },
                    requestHeaders: {
                        SOAPAction: 'http://simetrias.com.br/webservices/wscte/1.0/ReceberConhecimentos'
                    }
                });
                payloadToConvert = {
                    'ns:ReceberConhecimentos': {
                        'ns:xml': {
                            CTE: {
                                viagem: {
                                    A: "1",
                                    B: "E",
                                    C: "C",
                                    D: "88832175000106",
                                    E: "54",
                                    F: '',
                                    G: "003",
                                    H: "41160202351144003052570030000869681567202596",
                                    I: "05/11/2015",
                                    J: "06/11/2015",
                                    K: "N",
                                    L: "R",
                                    M: "SP",
                                    N: "0",
                                    O: "RJ",
                                    P: "0",
                                    Q: "0",
                                    R: "S",
                                    S: "9497,16",
                                    T: '',
                                    U: "150,88",
                                    V: "99,75",
                                    W: "1999,99",
                                    Z: "1,80",
                                    AA: "JXA6906",
                                    AB: "N",
                                    AC: '',
                                    AD: "N",
                                    AE: "S",
                                    AF: "N",
                                    AG: "N",
                                    AH: '',
                                    AI: '',
                                    AJ: '',
                                    AK: "86111146000120",
                                    AL: "06/01/2016 13:56:06",
                                    AM: '',
                                    AN: "N",
                                    AO: "Observação Emissão",
                                    AP: '',
                                    AQ: '',
                                    AR: '',
                                    AS: '',
                                    AT: '',
                                    AU: '',
                                    AV: '',
                                    AW: "000869681",
                                    AX: '',
                                    AZ: '',
                                    BA: '',
                                    BB: '',
                                    BC: '',
                                    BD: ''
                                }
                            }
                        }
                    }
                };
                return [4 /*yield*/, soap.soapRequest({}, payloadToConvert)];
            case 1:
                response = _a.sent();
                console.log(JSON.stringify(response.json));
                return [2 /*return*/];
        }
    });
}); };
simetrias();
