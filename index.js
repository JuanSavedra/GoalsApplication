const { select, input, checkbox } = require('@inquirer/prompts');

let meta = {
    value: "Tomar água.",
    checked: false
};

let metas = [meta];

const cadastrarMeta = async () => {
    const meta = await input({message: "Digite a meta: "});

    if (meta.length == 0) {
        console.log("A meta não pode estar vazia.");
        return;
    }

    metas.push({value: meta, checked: false});
};

const listarMetas = async () => {
    const responses = await checkbox({
        message: 'Use as "setas" para mudar de meta, o "espaço" para marcar ou desmarcar e o "enter" para finalizar.',
        choices: [...metas],
        instructions: false
    });

    if (responses.length == 0) {
        console.log("Nenhuma meta selecionada.");
        return;
    }

    metas.forEach((m) => {
        m.checked = false;
    });

    responses.forEach((response) => {
        const meta = metas.find((m) => {
            return m.value == response;
        });

        meta.checked = true; 
    });

    console.log("Meta(s) marcadas como concluída(s).");
};

const start = async () => {
    while(true) {
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
                    name: "Sair",
                    value: "sair"
                }
            ]
        });

        switch(option) {
            case "cadastrar":
                await cadastrarMeta();
                console.log(metas);
                break
            case "listar":
                await listarMetas();
                break
            case "sair":
                console.log("Saindo.");
                return;
        }
    }
}

start();