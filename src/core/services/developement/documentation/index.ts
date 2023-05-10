import { setTimeout as delay } from 'node:timers/promises';
import swaggerUi from 'swagger-ui-express';
import YAMLJS from 'yamljs';
import YAML from 'yaml';
import CustomizedAppRouter from '../../../interfaces/router/router';

type DocumentationProps = {
    app : CustomizedAppRouter,
    documentationRoute: string
}

class DocumentationRepository {

    private static writeDocumentation = async (app: CustomizedAppRouter) => {
        await delay(1000);

        const yamlToJson = YAMLJS.parse(YAML_INITIAL_TEXT);

        app.listEndPoint.forEach((data) => {
            if (!yamlToJson.paths[data.endpoint]) {
                let title = data.endpoint.toLowerCase().split('/')[2];

                yamlToJson.paths[data.endpoint] = {};
                yamlToJson.paths[data.endpoint][data.method.toLowerCase()] = {
                    request: {
                      'data': ''
                    },
                    responses: {
                        '200': { description: 'OK' }
                    }
                };
                if (yamlToJson.tags.find((data: any) => data.name === title)) return;
                
                yamlToJson.tags.push({
                    name: title,
                    description: `Secured ${title}-only calls`
                });
            }
        })

        const jsonToYaml = new YAML.Document();

        jsonToYaml.contents = yamlToJson;

        return yamlToJson
    }

    static useSwaggerDocumention = async ({app, documentationRoute, }: DocumentationProps) => {
        const swaggerDocument = await this.writeDocumentation(app);
        app.use( documentationRoute, swaggerUi.serve, swaggerUi.setup( swaggerDocument ));
    }

}

export default DocumentationRepository;

const YAML_INITIAL_TEXT =  `
openapi: 3.0.2
info:
  title: Bakely API
  version: "1.0"
servers:
  - url: http://localhost:8080/
tags:
  - name: test
    description: Just for Test, this should not be implemented
paths:
  /test:
    get:
      responses:
        "200":
          description: Testing Servers to see if server is up
`