export default function Dashboard() {
  return (
      <div className="dashboard">

        <h2>Dashboard</h2>

        <p>
          Visão geral do estoque e das movimentações.
        </p>

        <div className="cards">

          <div className="card">
            <strong>0</strong>
            <span>Produtos</span>
          </div>

          <div className="card">
            <strong>0</strong>
            <span>Estoque baixo</span>
          </div>

          <div className="card">
            <strong>0</strong>
            <span>Entradas</span>
          </div>

          <div className="card">
            <strong>0</strong>
            <span>Saídas</span>
          </div>

        </div>

      </div>
  );
}