module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'], // padrão para encontrar os arquivos de teste
  coverageDirectory: './coverage', // onde o relatório será gerado
  collectCoverage: true // coleta de cobertura de código
};
