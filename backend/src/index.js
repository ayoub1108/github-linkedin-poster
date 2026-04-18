const app = require('./app');
const config = require('./config/env');

const PORT = config.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🏠 Root: http://localhost:${PORT}/`);
});