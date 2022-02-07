import 'dotenv/config';
import server from './server.js';

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
