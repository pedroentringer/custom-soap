import Soap from '../src'

const simetrias = async () => {
  console.log(">> Simetrias")

  const soap = new Soap({
    soap12: true,
    url: 'http://187.75.229.91:8091/WSCTE/Service_CTE.asmx',
    agentOptions: {
      rejectUnauthorized: false,
    },
    envelopeAttrs: {
      'xmlns:ns':"http://simetrias.com.br/webservices/wscte/1.0"
    },
    requestHeaders: {
      SOAPAction: 'http://simetrias.com.br/webservices/wscte/1.0/ReceberConhecimentos'
    }
  })

  const payloadToConvert = {
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
              BD: '',
            },
          },
        }
    },
  }

  const response = await soap.soapRequest({}, payloadToConvert)

  console.log(response)
}

simetrias();