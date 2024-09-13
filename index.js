const { select, input, checkbox } = require('@inquirer/prompts');
const fs = require("fs").promises;

let message = "Bem-vindo ao app de metas.";

let goals;

const loadGoals = async () => {
    try {
        const datas = await fs.readFile("goals.json", "utf-8");
        goals = JSON.parse(datas);
    } catch (err) {
        goals = [];
        console.log(err);
    }
};

const saveGoals = async () => {
    await fs.writeFile("goals.json", JSON.stringify(goals, null, 2));
}

const registerGoals = async () => {
    const goal = await input({message: "Digite a meta: "});

    if (goal.length == 0) {
        console.log("A meta não pode estar vazia.");
        return;
    }

    goals.push({
        value: goal, 
        checked: false}
    );

    message = "Meta cadastrada com sucesso.";
};

const listGoals = async () => {
    if (goals.length == 0) {
        message = "Não há metas disponíveis para serem listadas."
        return;
    }

    const responses = await checkbox({
        message: 'Use as "setas" para mudar de meta, o "espaço" para marcar ou desmarcar e o "enter" para finalizar.',
        choices: [...goals],
        instructions: false
    });

    goals.forEach((g) => {
        g.checked = false;
    });

    if (responses.length == 0) {
        message = "Nenhuma meta selecionada.";
        return;
    }

    responses.forEach((response) => {
        const goal = goals.find((g) => {
            return g.value == response;
        });

        goal.checked = true; 
    });

    message = "Meta(s) marcadas como concluída(s).";
};

const realizedGoals = async () => {
    const realizeds = goals.filter((goal) => {
        return goal.checked;
    });

    if (realizeds.length == 0) {
        message = "Não existem metas realizadas.";
        return;
    }

    await select({
        message: "Metas Realizadas: " + realizeds.length,
        choices: [...realizeds]
    });
};

const openedGoals = async () => {
    if (goals.length == 0) {
        message = "Não há metas disponíveis para serem listadas."
        return;
    }

    const opened = goals.filter((goal) => {
        return !goal.checked;
    });

    if (opened.length == 0) {
        message = "Não existem metas abertas.";
        return;
    }

    await select({
        message: "Metas Abertas: " + opened.length,
        choices: [...opened]
    });
};

const deleteGoals = async () => {
    if (goals.length == 0) {
        message = "Não há metas disponíveis para serem listadas."
        return;
    }

    const uncheckedMetas = goals.map((goal) => {
        return {value: goal.value, checked: false}
    });     

    const itensToDelete = await checkbox({
       message: "Selecione o(s) item(s) para serem deletados.",
       choices: [...uncheckedMetas],
       instructions: false 
    });

    if (itensToDelete.length == 0) {
        message = "Nenhum item para deletar.";
        return;
    }

    itensToDelete.forEach((item) => {
        goals = goals.filter((goal) => {
            return goal.value != item;
        });
    });

    message = "Meta(s) deletada(s) com sucesso.";
};

const showMessage = () => {
    console.clear();

    if (message != "") {
        console.log(message);
        console.log("");
        message = "";
    }
};

const start = async () => {
    await loadGoals();

    while(true) {
        showMessage();
        await saveGoals();

        const option = await select({
            message: "Menu >",
            choices: [
                {
                    name: "Cadastrar meta",
                    value: "cadastrar"
                },
                {
                    name: "Listar metas",
                    value: "listar"
                },
                {
                    name: "Metas realizadas",
                    value: "realizadas"
                },
                {
                    name: "Metas abertas",
                    value: "abertas"
                },
                {
                    name: "Deletar metas",
                    value: "deletar"
                },
                {
                    name: "Sair",
                    value: "sair"
                }
            ]
        });

        switch(option) {
            case "cadastrar":
                await registerGoals();
                break
            case "listar":
                await listGoals();
                break
            case "realizadas":
                await realizedGoals();
                break
            case "abertas":
                await openedGoals();
                break
            case "deletar":
                await deleteGoals();
                break
            case "sair":
                console.log("Saindo.");
                return;
        }
    }
}

start();