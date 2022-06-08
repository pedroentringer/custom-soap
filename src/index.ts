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
  prefix?: string;
}

interface SoapResponse {
  json: GenericObject;
  body: string;
}

export class Soap {
  private options: Options;

  constructor(options: Options) {
    this.options = options;

    if (!this.options.prefix) {
      this.options.prefix = 'soap'
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

    const soapTags = {
      envelope: `${this.options.prefix}:Envelope`,
      header: `${this.options.prefix}:Header`,
      body: `${this.options.prefix}:Body`,
    }

    let soapEnvelope: GenericObject = {}

    soapEnvelope[soapTags.envelope] = {
      attrs: {
        ...defaultEnvelopeAttrs,
        ...this.options.envelopeAttrs,
        ...envelopeAttrs,
      },
      value: {},
    }

    soapEnvelope[soapTags.envelope].value[soapTags.body] = envelopeBody
    soapEnvelope[soapTags.envelope].value[soapTags.header] = envelopeHeader

    const soapXml = json2xml(soapEnvelope, { includeHeader: false });

    const requestOptions = await this.buildSoapRequestOpt(soapXml, agentOptions, requestHeaders);

    const requestResponse = await this.httpPost(requestOptions);

    const lastOfIndex = this.options.prefix ? this.options.prefix.length + 7 : 7;

    const initialIndex = requestResponse.lastIndexOf(`<${this.options.prefix}:Body>`) + lastOfIndex;
    const finalIndex = requestResponse.lastIndexOf(`</${this.options.prefix}:Body>`);

    const soapResponse = requestResponse.substring(initialIndex, finalIndex);

    return {
      json: JSON.parse(xml2json.toJson(soapResponse)),
      body: soapResponse,
    };
  }
}
