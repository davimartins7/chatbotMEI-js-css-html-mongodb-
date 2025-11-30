const chatBtn = document.getElementById('chat-btn');
const chatWindow = document.getElementById('chat-window');
const chatBody = document.getElementById('chat-body');

// --- FLUXO DO CHAT ---
const fluxo = {
    inicio: {
        texto: "Olá! Você tem interesse em se tornar um microempreendedor individual?",
        tipo: "opcoes",
        opcoes: [
            { texto: "Sim", proximo: "faturamento" },
            { texto: "Não", proximo: "encerrar" },
            { texto: "O que é um microempreendedor individual?", proximo: "explicar" }
        ]
    },
    explicar: {
        texto: "O Microempreendedor Individual (MEI) é a legalização simplificada...",
        tipo: "opcoes",
        opcoes: [
            { texto: "Sim", proximo: "faturamento" },
            { texto: "Não", proximo: "encerrar" }
        ]
    },
    faturamento: {
        texto: "O limite de faturamento anual do MEI é de R$ 81.000,00...",
        tipo: "opcoes",
        opcoes: [
            { texto: "Sim", proximo: "funcionarios" },
            { texto: "Não", proximo: "encerrar" }
        ]
    },
    funcionarios: {
        texto: "Um MEI pode ter no máximo um funcionário...",
        tipo: "opcoes",
        opcoes: [
            { texto: "Minha empresa não terá funcionários", proximo: "atividade" },
            { texto: "Sim", proximo: "atividade" },
            { texto: "E se eu quiser mais de um funcionário?", proximo: "incompleto" }
        ]
    },
    atividade: {
        texto: "Você já sabe que atividade quer realizar?",
        tipo: "opcoes",
        opcoes: [
            { texto: "Sim", proximo: "agendamento" },
            { texto: "Não", proximo: "encerrar" }
        ]
    },
    encerrar: { texto: "Tudo bem! Caso se interesse novamente...", tipo: "fim" },
    fim: { texto: "Chat encerrado.", tipo: "fim" },
    agendamento: { texto: "Redirecionando para agendamento...", tipo: "fim" },
    incompleto: { texto: "Sua dúvida será encaminhada...", tipo: "fim" }
};

let etapaAtual = "inicio";

// --- SALVAR NO BACKEND ---
async function salvarResposta(pergunta, resposta) {
    const email = localStorage.getItem("emailLogado");
    if (!email) return;

    try {
        const resp = await fetch("http://localhost:3000/salvar-resposta", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, pergunta, resposta })
        });

        const data = await resp.json().catch(() => null);

        if (!data?.ok) {
            console.error("Erro ao salvar resposta:", data);
        }

    } catch (err) {
        console.error("Erro ao salvar resposta:", err);
    }
}

// --- MENSAGENS ---
function adicionarMensagem(remetente, texto) {
    const msg = document.createElement("p");
    msg.innerHTML = `<strong>${remetente}:</strong> ${texto}`;
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
}

// --- OPCOES ---
function mostrarOpcoes(opcoes) {
    const container = document.createElement("div");

    opcoes.forEach(op => {
        const btn = document.createElement("button");
        btn.classList.add("opcao-btn");
        btn.textContent = op.texto;

        btn.onclick = () => {
            adicionarMensagem("Você", op.texto);
            salvarResposta(fluxo[etapaAtual].texto, op.texto);
            container.remove();
            etapaAtual = op.proximo;
            setTimeout(fazerPergunta, 600);
        };

        container.appendChild(btn);
    });

    chatBody.appendChild(container);
    chatBody.scrollTop = chatBody.scrollHeight;
}

// --- PERGUNTA ---
function fazerPergunta() {
    const etapa = fluxo[etapaAtual];
    if (!etapa) return;

    adicionarMensagem("Bot", etapa.texto);

    if (etapa.tipo === "opcoes") {
        mostrarOpcoes(etapa.opcoes);
    }
}

// --- ABRIR CHAT ---
chatBtn.addEventListener("click", () => {
    chatWindow.classList.toggle("open");

    if (chatWindow.classList.contains("open") && etapaAtual === "inicio") {
        setTimeout(fazerPergunta, 500);
    }
});
