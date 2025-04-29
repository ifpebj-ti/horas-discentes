import Head from 'next/head';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Horas Discentes - Status</title>
        <meta
          name="description"
          content="Página de status do Docker Horas Discentes"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div
          style={{
            textAlign: 'center',
            padding: '50px',
            backgroundColor: '#f0f0f0',
            borderRadius: '8px'
          }}
        >
          <h1
            style={{ fontSize: '2.5em', color: '#333', marginBottom: '20px' }}
          >
            Status do Projeto Horas Discentes (Docker)
          </h1>
          <p style={{ fontSize: '1.2em', color: '#555', marginBottom: '10px' }}>
            O ambiente Docker para o projeto Horas Discentes está operando
            conforme esperado.
          </p>
          <p style={{ fontSize: '1.2em', color: '#555', marginBottom: '20px' }}>
            Esta página confirma que o container Next.js está servindo a
            aplicação com sucesso.
          </p>
          <div
            style={{
              backgroundColor: '#e0e0e0',
              padding: '20px',
              borderRadius: '4px'
            }}
          >
            <strong style={{ color: '#222', fontWeight: 'bold' }}>
              Informações Adicionais:
            </strong>
            <ul
              style={{
                listStyleType: 'disc',
                paddingLeft: '20px',
                marginTop: '10px',
                color: '#666'
              }}
            >
              <li>Servidor Front-end: Ativo</li>
              <li>
                Endereço:{' '}
                <code style={{ fontFamily: 'monospace' }}>
                  http://localhost:3000
                </code>
              </li>
              <li>
                Status:{' '}
                <span style={{ color: 'green', fontWeight: 'bold' }}>
                  Operacional
                </span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
