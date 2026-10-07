class Tarefa {
    #concluida;

    constructor(descricao, concluida = false, prazo = "") {
        descricao = descricao.trim();

        if (descricao === "") {
            throw new Error("Digite uma tarefa.");
        }

        this.descricao = descricao;
        this.#concluida = concluida;
        this.prazo = prazo;
    }

    get concluida() {
        return this.#concluida;
    }

    alternarConclusao() {
        this.#concluida = !this.#concluida;
    }

    definirPrazo(novoPrazo) {
        this.prazo = novoPrazo;
    }
}

const listaDeTarefas = [];
const campoTarefas = document.getElementById("campo-tarefa");
const listaTarefas = document.getElementById("lista-tarefas");
const contadorTarefas = document.getElementById("contador-tarefas");
const botaoAdicionar = document.querySelector(".botao-principal");
const botaoTema = document.getElementById("botao-alternar-tema");

function salvarTarefas() {

    const tarefasParaSalvar = listaDeTarefas.map(function (tarefa) {

        return {
            descricao: tarefa.descricao,
            concluida: tarefa.concluida,
            prazo: tarefa.prazo
        };

    });

    localStorage.setItem(
        "tarefas",
        JSON.stringify(tarefasParaSalvar)
    );
}

function carregarTarefas() {

    const tarefasSalvas = localStorage.getItem("tarefas");

    if (tarefasSalvas) {

        const tarefas = JSON.parse(tarefasSalvas);

        tarefas.forEach(function (tarefaSalva) {

            const tarefa = new Tarefa(
                tarefaSalva.descricao,
                tarefaSalva.concluida,
                tarefaSalva.prazo
            );

            listaDeTarefas.push(tarefa);

        });
    }

    renderizarTarefas();
}

botaoAdicionar.addEventListener("click", function () {

    try {

        const descricao = campoTarefas.value;

        const novaTarefa = new Tarefa(descricao);

        listaDeTarefas.push(novaTarefa);

        salvarTarefas();

        renderizarTarefas();

        campoTarefas.value = "";

        campoTarefas.focus();

    } catch (erro) {

        alert(erro.message);

    }

});

campoTarefas.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        event.preventDefault();

        botaoAdicionar.click();

    }

});

function renderizarTarefas() {

    listaDeTarefas.sort(function (a, b) {
        // 1. Concluídas vão para o final
        if (a.concluida && !b.concluida) return 1;
        if (!a.concluida && b.concluida) return -1;

        // 2. Sem prazo vão para o final (acima das concluídas)
        if (!a.prazo && !b.prazo) return 0;
        if (!a.prazo) return 1;
        if (!b.prazo) return -1;

        // 3. Comparação de datas (prazo mais próximo primeiro)
        const dataA = new Date(a.prazo);
        const dataB = new Date(b.prazo);

        return dataA - dataB;
    });

    listaTarefas.innerHTML = "";

    listaDeTarefas.forEach(function (tarefa, index) {

        const item = document.createElement("li");

        item.classList.add("item-tarefa");

        const texto = document.createElement("span");

        texto.textContent = tarefa.descricao;

        if (tarefa.concluida) {

            texto.style.textDecoration = "line-through";

            texto.style.opacity = "0.5";

            texto.style.color = "inherit";

            texto.style.fontWeight = "normal";

        } else if (tarefa.prazo) {

            const dataPrazo = new Date(tarefa.prazo + "T00:00:00");

            const dataHoje = new Date();

            dataHoje.setHours(0, 0, 0, 0);


            if (dataPrazo < dataHoje) {

                texto.style.color = "#ff4d4d";

                texto.style.fontWeight = "bold";

            } else {

                texto.style.color = "inherit";

                texto.style.fontWeight = "normal";

            }

        }

        const campoPrazo = document.createElement("input");

        campoPrazo.type = "date";

        campoPrazo.value = tarefa.prazo;

        campoPrazo.title = "Adicionar prazo";

        campoPrazo.classList.add("botao-acao", "campo-prazo");;

        campoPrazo.addEventListener("change", function () {

            tarefa.definirPrazo(campoPrazo.value);

            salvarTarefas();

            renderizarTarefas();

        });

        const botaoConcluir = document.createElement("button");

        botaoConcluir.classList.add("botao-acao");


        if (tarefa.concluida) {

            botaoConcluir.innerHTML =
                `<i class="fa-solid fa-circle-check"></i>`;

        } else {

            botaoConcluir.innerHTML =
                `<i class="fa-regular fa-circle"></i>`;

        }


        botaoConcluir.addEventListener("click", function () {

            tarefa.alternarConclusao();

            salvarTarefas();

            renderizarTarefas();

        });

        const botaoExcluir = document.createElement("button");

        botaoExcluir.classList.add(
            "botao-acao",
            "excluir"
        );

        botaoExcluir.innerHTML =
            `<i class="fa-solid fa-trash"></i>`;


        botaoExcluir.addEventListener("click", function () {

            listaDeTarefas.splice(index, 1);

            salvarTarefas();

            renderizarTarefas();

        });

        const acoes = document.createElement("div");

        acoes.classList.add("acoes-tarefa");

        acoes.appendChild(campoPrazo);

        acoes.appendChild(botaoConcluir);

        acoes.appendChild(botaoExcluir);


        item.appendChild(texto);

        item.appendChild(acoes);

        listaTarefas.appendChild(item);

    });


    atualizarContador();
}

function atualizarContador() {

    const quantidade = listaDeTarefas.length;


    if (quantidade === 0) {

        contadorTarefas.textContent =
            "0 tarefas na lista";

    } else if (quantidade === 1) {

        contadorTarefas.textContent =
            "1 tarefa na lista";

    } else {

        contadorTarefas.textContent =
            `${quantidade} tarefas na lista`;

    }

}

botaoTema.addEventListener("click", function () {

    document.body.classList.toggle("modo-escuro");

    const icone = botaoTema.querySelector("i");


    if (document.body.classList.contains("modo-escuro")) {

        icone.classList.remove("fa-moon");

        icone.classList.add("fa-sun");

    } else {

        icone.classList.remove("fa-sun");

        icone.classList.add("fa-moon");

    }

});

carregarTarefas();