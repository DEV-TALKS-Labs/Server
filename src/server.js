import app from './app.js';
import swaggerDocs from './libs/swagger.js';
app.listen(8080, () => {
  console.log('server is running on port 8080 http://localhost:8080');
  swaggerDocs(app, 8080);
});
