import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, LockKeyhole } from "lucide-react";
import { toast } from "react-toastify";
import { alterarSenha, sair } from "../services/authService";
import "./Login.css";

export default function AlterarSenha() {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (novaSenha.length < 6 || novaSenha.length > 72) {
      toast.error("A nova senha deve ter entre 12 e 72 caracteres.");
      return;
    }
    if (novaSenha !== confirmacao) {
      toast.error("A confirmação da nova senha não confere.");
      return;
    }
    if (novaSenha === senhaAtual) {
      toast.error("A nova senha deve ser diferente da senha atual.");
      return;
    }
    setCarregando(true);
    try {
      await alterarSenha(senhaAtual, novaSenha);
      toast.success("Senha alterada. Acesso liberado.");
      navigate("/", { replace: true });
    } catch (error: unknown) {
      const e = error as {
        response?: { data?: { message?: string; mensagem?: string } };
      };
      toast.error(
        e.response?.data?.message ||
          e.response?.data?.mensagem ||
          "Não foi possível alterar a senha.",
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="password-page">
      <section className="password-card">
        <div className="login-brand login-brand-dark">
          <span className="login-brand-mark">
            <Box size={30} />
          </span>
          <strong>
            Dev <em>ERP</em>
          </strong>
        </div>
        <h1>Crie sua nova senha</h1>
        <p>
          Por segurança, altere a senha temporária para continuar usando o
          sistema. Use de 6 a 72 caracteres.
        </p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="senhaAtual">Senha atual</label>
          <input
            id="senhaAtual"
            type="password"
            autoComplete="current-password"
            value={senhaAtual}
            onChange={(e) => setSenhaAtual(e.target.value)}
            required
          />
          <label htmlFor="novaSenha">Nova senha</label>
          <input
            id="novaSenha"
            type="password"
            autoComplete="new-password"
            minLength={6}
            maxLength={72}
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            required
          />
          <label htmlFor="confirmacao">Confirmar nova senha</label>
          <input
            id="confirmacao"
            type="password"
            autoComplete="new-password"
            minLength={6}
            maxLength={72}
            value={confirmacao}
            onChange={(e) => setConfirmacao(e.target.value)}
            required
          />
          <button type="submit" disabled={carregando}>
            {carregando ? (
              "Salvando..."
            ) : (
              <>
                <LockKeyhole
                  size={17}
                  style={{ verticalAlign: "middle", marginRight: 8 }}
                />
                Alterar senha
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              sair();
              navigate("/login", { replace: true });
            }}
            style={{ background: "#eef2f7", color: "#344054" }}
          >
            Sair da conta
          </button>
        </form>
      </section>
    </main>
  );
}
