import { json2xml } from '@pedroentringer/json2xml';
import * as request from 'request';

import { AgentOptions as HTTPAgentOptions } from 'http';
import { AgentOptions as HTTPSAgentOptions } from 'https';

import * as xml2json from 'xml2json';

import { unzip } from 'zlib';

interface GenericObject {
  [key: string]: any;
}

type AgentOptions = HTTPAgentOptions | HTTPSAgentOptions;

interface Options {
  url: string;
  requestHeaders?: GenericObject;
  envelopeAttrs?: GenericObject;
  agentOptions?: AgentOptions;
  soap12: boolean;
}

interface SoapResponse {
  json: GenericObject;
  body: string;
}

export class Soap {
  private options: Options;

  constructor(options: Options) {
    this.options = options;

    if (typeof this.options.soap12 !== 'boolean') {
      this.options.soap12 = false;
    }
  }

  private unzipGzip(base64Doc: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const buffer = Buffer.from(base64Doc, 'base64');
      unzip(buffer, (err, buffer) => {
        if (err) {
          reject(err);
        }
        resolve(buffer.toString());
      });
    });
  }

  private httpPost(requestOptions: any): Promise<string> {
    return new Promise((resolve, reject) => {
      request.post(requestOptions, function (err: any, resp: request.Response, body: any) {
        if (err) reject(err);
        resolve(body);
      });
    });
  }

  private async buildSoapRequestOpt(envelope: string, agentOptions?: AgentOptions, requestHeaders?: GenericObject) {
    const requestOptions = {
      uri: this.options.url,
      agentOptions: {
        ...this.options.agentOptions,
        ...agentOptions,
      },
      headers: {
        'Content-Type': 'application/soap+xml; charset=utf-8',
        ...this.options.requestHeaders,
        ...requestHeaders,
      },
      body: envelope,
      family: 4,
    };

    return requestOptions;
  }

  public async soapRequest(
    envelopeHeader: GenericObject,
    envelopeBody: GenericObject,
    envelopeAttrs?: GenericObject,
    agentOptions?: AgentOptions,
    requestHeaders?: GenericObject,
  ): Promise<SoapResponse> {
    let defaultEnvelopeAttrs: GenericObject = {
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
    };

    let soapObject: GenericObject = {
      'soap:Envelope': {
        attrs: {
          ...defaultEnvelopeAttrs,
          ...this.options.envelopeAttrs,
          ...envelopeAttrs,
        },
        value: {
          'soap:Header': envelopeHeader,
          'soap:Body': envelopeBody,
        },
      },
    };

    if (this.options.soap12) {
      soapObject = {
        'soap12:Envelope': {
          attrs: {
            'xmlns:soap12': 'http://www.w3.org/2003/05/soap-envelope',
            ...defaultEnvelopeAttrs,
            ...this.options.envelopeAttrs,
            ...envelopeAttrs,
          },
          value: {
            'soap12:Header': envelopeHeader,
            'soap12:Body': envelopeBody,
          },
        },
      };
    }

    const soapXml = json2xml(soapObject, { includeHeader: false });

    const requestOptions = await this.buildSoapRequestOpt(soapXml, agentOptions, requestHeaders);

    const requestResponse = await this.httpPost(requestOptions);

    const initialIndex = requestResponse.lastIndexOf('<soap:Body>') + 11;
    const finalIndex = requestResponse.lastIndexOf('</soap:Body>');

    const soapResponse = requestResponse.substring(initialIndex, finalIndex);

    return {
      json: JSON.parse(xml2json.toJson(soapResponse)),
      body: soapResponse,
    };
  }
}
