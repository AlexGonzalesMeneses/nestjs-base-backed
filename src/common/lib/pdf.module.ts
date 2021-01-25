export const generarPDF = async function (urlEjsPlantilla: string, objParametros: object, rutaSalidaPDF: string, config: object): Promise<any> {
  let resultado = new Promise((resolve, reject)=>{
    const ejs = require("ejs");
    ejs.renderFile(urlEjsPlantilla,objParametros, (error, result) => {
      if (result) {
        const wkhtmltopdf = require('wkhtmltopdf');
        const options = config?config:
              {
                pageSize: 'Letter',
                orientation: 'portrait',
                marginLeft   : '0.5cm',
                marginRight  : '0.5cm',
                marginTop    : '0.5cm',
                marginBottom : '0.5cm',
                output: rutaSalidaPDF
              };
        wkhtmltopdf(result, options, (err, stream) => {
          if (err) reject(err);
          else resolve({});
        });
      }
      else
      {
        reject(error);
      }
    });
  });
  return resultado;
};
