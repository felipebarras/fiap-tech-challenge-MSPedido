module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/__tests__/unit/**/*.test.js', // Testes unitários
    '**/__tests__/integration/**/*.test.js' // Testes de integração
  ],
  collectCoverage: true, // coleta de cobertura de código
  collectCoverageFrom: ['src/**/*.{js,jsx}'], // todos os arquivos da pasta src
  coverageDirectory: './coverage', // onde o relatório será gerado
  verbose: true // em tese, deverá mostrar mais detalhes nos testes
};
