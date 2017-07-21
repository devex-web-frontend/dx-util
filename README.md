# dx-util
Common utilities fro dx-projects

# development
`npm start`

# build
`npm run build`

# Breaking change with 0.11.0
TS does not support accessing decorator descriptor in property decorators https://www.typescriptlang.org/docs/handbook/decorators.html#property-decorators
TODO: rewrite with reflect-metadata